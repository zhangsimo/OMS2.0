<template>
  <section class="oper-box ml10">
    <div class="flex">
      <div class="wlf">
        <Button type="default" class="mr10" @click="claim(1)" v-has="'returnByCame'">原货退还</Button>
        <Button type="default" class="mr10" @click="claim(2)" v-has="'swap'">换货处理</Button>
        <Button type="default" class="mr10" @click="claim(3)" v-has="'return'">退货处理</Button>
        <Button type="default" class="mr10" @click="claim(4)" v-has="'delByCame'">原物销毁</Button>
        <!--        <Button type="default" class="mr10" @click="exportData">导出</Button>-->
      </div>
    </div>
    <vxe-table
      border
      auto-resize
      resizable
      :data="claimSupplierData"
      size="mini"
      ref="xTable"
      show-overflow="title"
      class="mt20"
      :edit-rules="validRules"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      @checkbox-all="claimSupplierSel"
      @checkbox-change="claimSupplierSel"
      @checkbox-cancel="claimSupplierSel"
    >
      <vxe-table-column type="seq" title="序号" width="40"></vxe-table-column>
      <vxe-table-column type="selection" width="50"></vxe-table-column>
      <vxe-table-column field="orderDate" title="提交日期" width="100"></vxe-table-column>
      <vxe-table-column field="serviceId" title="理赔单号" width="100"></vxe-table-column>
      <vxe-table-column field="guestName" title="供应商" width="100"></vxe-table-column>
      <vxe-table-column field="partInnerId" title="配件内码" width="100"></vxe-table-column>
      <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
      <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
      <vxe-table-column field="oemCode" title="OEM码" width="100"></vxe-table-column>
      <vxe-table-column field="partBrand" title="品牌" width="80"></vxe-table-column>
      <vxe-table-column field="carModelName" title="品牌车型" width="80"></vxe-table-column>
      <vxe-table-column field="afterSaleReason" title="理赔原因" width="120"></vxe-table-column>
      <vxe-table-column field="claimDemageCode" title="索赔编号" width="120"></vxe-table-column>
      <vxe-table-column field="afterSaleQty" title="理赔数量" width="80"></vxe-table-column>
      <vxe-table-column field="processedQty" title="已处理数量" width="80"></vxe-table-column>
      <vxe-table-column field="untreatedQty" title="未处理数量" width="80"></vxe-table-column>
      <vxe-table-column field="thisTreatmentQty" title="本次处理数量" width="80">
        <template v-slot="{row}">
          <vxe-input type="integer" :controls="false" v-model="row.thisTreatmentQty" :min="1" :max="row.untreatedQty"/>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" width="80">
        <template v-slot="{row}">
          <vxe-input type="string" v-model="row.remark" maxlength="50"/>
        </template>
      </vxe-table-column>
      <vxe-table-column field="returnQty" title="原货退还" width="80"></vxe-table-column>
      <vxe-table-column field="replaceQty" title="换货处理" width="80"></vxe-table-column>
      <vxe-table-column field="refundQty" title="退款处理" width="80"></vxe-table-column>
      <vxe-table-column field="destructionQty" title="原物销毁" width="80"></vxe-table-column>
      <vxe-table-column field="unit" title="单位" width="80"></vxe-table-column>
      <vxe-table-column field="spec" title="规格" width="80"></vxe-table-column>
    </vxe-table>
    <Page
      :total="page.total"
      :page-size="page.size"
      size="small"
      :current="page.num"
      show-sizer
      show-total
      class-name="page-con"
      @on-change="selectNum"
      @on-page-size-change="selectPage"
      class="mr10"
      :page-size-opts="[ 50, 100, 200]"
    ></Page>
  </section>
</template>
<script lang="ts">
  import {Vue, Component, Watch} from "vue-property-decorator";
  import * as api from "@/api/afterSale/claimSheet/index.js"
  import {showLoading, hideLoading} from "@/utils/loading";

  @Component
  export default class tabOne extends Vue {
    private claimSupplierData: Array<any> = new Array<any>();
    private body: any = {};
    private page: any = {
      num: 1,
      size: 50
    };
    private validRules: any = {
      thisTreatmentQty: [{required: true, message: "本次处理数量必填", trigger: "blur"}]
    }
    private claimSupplierSelData: Array<any> = new Array<any>();

    private claimSupplierSel({selection}) {
      this.claimSupplierSelData = selection;
    }

    //切换页面
    private selectNum(val) {
      this.page.num = val;
      this.getList()
    }

    //切换页数
    private selectPage(val) {
      this.page.num = 1;
      this.page.size = val;
      this.getList();
    }

    private async claim(type: number) {
      if (this.claimSupplierSelData.length < 1) {
        return this.$message.error("最少选中一条数据进行处理！")
      }
      let boolAjax: boolean = true;
      this.claimSupplierSelData.map(el => {
        if (!el.thisTreatmentQty) {
          boolAjax = false
        }
      })
      let p = ""
      switch (type) {
        case 1:
          p = "原货退还";
          break;
        case 2:
          p = "换货处理";
          break;
        case 3:
          p = "退货处理";
          break;
        case 4:
          p = "原物销毁";
          break;
      }
      // @ts-ignore
      if (boolAjax) {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>是否确定${p}?</p>`,
          onOk: async () => {
            let params: any = {
              orderType: type,
            }
            showLoading()
            let res: any = await api.supplierClaimSettlement(params, this.claimSupplierSelData)
            if (res.code === 0) {
              this.getList()
              hideLoading()
              this.$Message.success("处理成功")
            } else {
              hideLoading()
            }
          },
          onCancel: () => {
            this.$message.warning("已取消操作")
          }
        });
      } else {
        return this.$message.error("本次处理数量必填")
      }
    }

    private exportData() {

    }

    private async getList() {
      let params: any = {
        page: this.page.num - 1,
        size: this.page.size
      }
      showLoading()
      // @ts-ignore
      let res: any = await api.supplierClaimSettlementQuery(params, this.body)
      if (res.code === 0) {
        this.claimSupplierData = res.data.content;
        this.page.total = res.data.totalElements;
        hideLoading()
      } else {
        this.claimSupplierData = [];
        this.page.total = 0;
        hideLoading()
      }
    }
  }
</script>
<style lang="less"></style>

<template>
  <Modal
    v-model="show"
    title="详情"
    :styles="{ top: '50px', width: '1000px' }"
    footer-hide
  >
    <div class="pb20">
      <Tabs value="name1">
        <TabPane label="滞销信息" name="name0" v-if="type === '外采'">
          <Table
            height="420"
            size="small"
            highlight-row
            border
            :stripe="true"
            :loading="loading"
            :columns="Tab0columns"
            :data="Tab0tableData"
          ></Table>
        </TabPane>
        <TabPane label="本店库存" name="name1">
          <Table
            height="420"
            size="small"
            highlight-row
            border
            :stripe="true"
            :loading="loading"
            :columns="Tab1columns"
            :data="Tab1tableData"
          ></Table>
        </TabPane>
        <TabPane label="连锁库存" name="name2">
          <Table
            height="420"
            size="small"
            highlight-row
            border
            :stripe="true"
            :loading="loading"
            :columns="Tab2columns"
            :data="Tab2tableData"
          ></Table>
        </TabPane>
        <TabPane :label="type === '外采' ? '外采记录':  '采购记录'" name="name3">
          <Table
            height="420"
            size="small"
            highlight-row
            border
            :stripe="true"
            :loading="loading"
            :columns="Tab3columns"
            :data="Tab3tableData"
          ></Table>
        </TabPane>
      </Tabs>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";

@Component
export default class TabsModel extends Vue {
  private show: boolean = false;

  private loading: boolean = false;

  @Prop(String) readonly partId;
  @Prop({ default: "" }) readonly type;

  private Tab0columns: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      type: 'index'
    },
    {
      title: "公司名称",
      key: "orgName",
      minWidth: 100
    },
    {
      title: "配件编码",
      key: "partCode",
      minWidth: 100
    },
    {
      title: "配件名称",
      key: "partName",
      minWidth: 100
    },
    {
      title: "滞销数量",
      key: "enterQty",
      minWidth: 100
    },
  ];

  private Tab1columns: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      type: 'index'
    },
    {
      title: "配件编码",
      key: "partCode",
      minWidth: 100
    },
    {
      title: "配件名称",
      key: "partName",
      minWidth: 120
    },
    {
      title: "单位",
      key: "unit",
      minWidth: 80
    },
    {
      title: "仓库",
      key: "storeName",
      minWidth: 100
    },
    {
      title: "库存数量",
      key: "stockQty",
      minWidth: 80
    },
    {
      title: "订单占用",
      key: "occupyQty",
      minWidth: 80
    },
    {
      title: "可开单数量",
      key: "outableQty",
      minWidth: 80
    }
  ];

  private Tab2columns: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      type: 'index'
    },
    {
      title: "公司名称",
      key: "companyName",
      minWidth: 120
    },
    {
      title: "仓库",
      key: "storeName",
      minWidth: 80
    },
    {
      title: "库存数量",
      key: "stockQty",
      minWidth: 80
    },
    {
      title: "可售数量",
      key: "outableQty",
      minWidth: 80
    }
  ];

  private Tab3columns:  Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      type: 'index'
    },
    {
      title: "配件编码",
      key: "partCode",
      minWidth: 120
    },
    {
      title: "配件名称",
      key: "partName",
      minWidth: 120
    },
    {
      title: "仓库",
      key: "storeName",
      minWidth: 120
    },
    {
      title: "单位",
      key: "enterUnitId",
      minWidth: 120
    },
    {
      title: "采购数量",
      key: "enterQty",
      minWidth: 120
    },
    {
      title: "税点",
      key: "taxRate",
      minWidth: 120
    },
    {
      title: "含税单价",
      key: "taxPrice",
      minWidth: 120
    },
    {
      title: "不含税单价",
      key: "noTaxPrice",
      minWidth: 120,
      render:(h,params) => {
        return h("span",params.row.noTaxPrice?(params.row.noTaxPrice).toFixed(2):"0.00")
      }
    },
    {
      title: "供应商",
      key: "guestName",
      minWidth: 120
    },
    {
      title: "第一供应商",
      key: "guestName",
      minWidth: 120
    },
    {
      title: "入库单号",
      key: "code",
      minWidth: 120
    },
    {
      title: "入库日期",
      key: "enterDate",
      minWidth: 120
    },
  ]

  private Tab0tableData: Array<any> = new Array();
  private Tab1tableData: Array<any> = new Array();
  private Tab2tableData: Array<any> = new Array();
  private Tab3tableData: Array<any> = new Array();

  private init(): void {
    this.show = true;
    this.getlist();
  }

  private async getlist() {
    let res:any = await api.queryPartStockAndLog(this.partId);
    if(res.code == 0) {
      if(this.type === "外采") {
        this.Tab0tableData = (res.data.unsalableStock || []).filter(el=>el.enterQty!=0) // 滞销信息
      }
      this.Tab1tableData = res.data.orgStock // 本地
      this.Tab2tableData = res.data.chainStock // 连锁
      this.Tab3tableData = res.data.pchsLog // 采购
    }
  }
}
</script>

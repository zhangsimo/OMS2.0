<template>
  <Modal
    title="添加配件"
    v-model="shows"
    :styles="{ top: '50px', width: '1200px' }"
  >
    <div class="top-plan">
      <div class="tools-bar mb10">
        <div class="db mr5">
          <span class="mr5">快速查询:</span>
          <getDate class="mr10" @quickDate="getDataQuick"></getDate>
        </div>
        <!-- <div class="db mr5">
          <el-input autofocus ref="input" placeholder="配件内码/编码/名称/OE码" v-model="partId" @change="query"/>
        </div> -->

        <div class="db mr5">
          <span class="mr5">编码:</span>
          <Input ref="input" style="width: 100px" placeholder="编码" v-model="partCode" @on-enter="query"/>
        </div>
        <div class="db mr5">
          <span class="mr5">内码:</span>
          <Input placeholder="内码" style="width: 100px" v-model="partId" @on-enter="query"/>
        </div>
        <div class="db mr5">
          <span class="mr5">名称:</span>
          <Input placeholder="名称" style="width: 100px" v-model="partName" @on-enter="query"/>
        </div>
        <div class="db mr5">
          <span class="mr5">OE:</span>
          <Input placeholder="OE码" style="width: 100px" v-model="oemCode" @on-enter="query"/>
        </div>

        <!-- <div class="db mr5">
          <span class=" mr5">品牌:</span>
          <Select  v-model="partBrand" filterable style="width:140px" class="mr20" @on-change="SelectChange">
            <Option v-for="(item, index) in bands" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </div> -->
        <div class="db mr5"><span v-if="type == 'sale'">出库日期:</span><span v-else>入库日期:</span></div>
        <div class="db mr5">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择日期"
            style="width: 120px"
            :value="auditDate"
            @on-change="getDate"
          ></DatePicker>
        </div>
        <div class="db mr5">
          <Button class="w90" type="warning" @click="query">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons"/>查询
            </span>
          </Button>
        </div>
        <div class="db mr5">
          <Button type="default" @click="ok"
          >选择
          </Button
          >
        </div>
        <div class="db mr5">
          <Button type="default" @click="selectOrder"
          >整单选择
          </Button
          >
        </div>
      </div>
      <vxe-table
        v-if="type == 'good'"
        border
        stripe
        align="center"
        ref="xTable1"
        height="500"
        column-min-width="100px"
        size="mini"
        :data="tableData"
        :loading="loading"
        show-overflow
        @checkbox-all="cellClickEvent"
        @checkbox-change="radioChangeEvent"
        @cell-dblclick="dblclick"
        auto-resize
      >
        <!--        :checkbox-config="{trigger: 'row', highlight: true, range: true }"-->
        <vxe-table-column
          type="checkbox"
          width="50"
        ></vxe-table-column>
        <vxe-table-column
          type="seq"
          title="序号"
          width="60"
        ></vxe-table-column>
        <vxe-table-column width="120" field="enterDate" title="入库日期"></vxe-table-column>
        <vxe-table-column width="110" field="partCode" title="配件编码"></vxe-table-column>
        <vxe-table-column width="110" field="partName" title="配件名称"></vxe-table-column>
        <vxe-table-column width="110" field="oemCode" title="OE码"></vxe-table-column>
        <vxe-table-column width="100" field="partBrand" :filters="[]" :filter-method="filterNameMethod"
                          title="品牌"></vxe-table-column>
        <vxe-table-column width="80" field="enterQty" title="库存数量"></vxe-table-column>
        <vxe-table-column width="80" field="rtnableQty" title="可退数量"></vxe-table-column>
        <vxe-table-column width="60" field="enterUnitId" title="单位"></vxe-table-column>
        <vxe-table-column width="70" field="branchStockAge" title="库龄"></vxe-table-column>
        <vxe-table-column width="160" field="guestName" title="供应商"></vxe-table-column>
        <vxe-table-column width="180" field="code" title="入库单号"></vxe-table-column>
      </vxe-table>

      <vxe-table
        v-if="type == 'sale'"
        border
        stripe
        align="center"
        ref="xTable1"
        height="300"
        column-min-width="100px"
        size="mini"
        :data="tableData"
        :loading="loading"
        show-overflow
        @checkbox-all="cellClickEvent"
        @checkbox-change="radioChangeEvent"
        @cell-dblclick="dblclick"
        auto-resize
      >
        <!--        :checkbox-config="{trigger: 'row', highlight: true, range: true }"-->
        <vxe-table-column
          type="checkbox"
          width="50"
        ></vxe-table-column>
        <vxe-table-column
          type="seq"
          title="序号"
          width="60"

        ></vxe-table-column>
        <vxe-table-column width="120" field="outDate" title="出库日期"></vxe-table-column>
        <vxe-table-column width="110" field="partCode" title="配件编码"></vxe-table-column>
        <vxe-table-column width="110" field="partName" title="配件名称"></vxe-table-column>
        <vxe-table-column width="110" field="oemCode" title="OE码"></vxe-table-column>
        <vxe-table-column width="100" field="partBrand" :filters="[]" :filter-method="filterNameMethod"
                          title="品牌"></vxe-table-column>
        <vxe-table-column width="90" field="taxSign" title="是否含税">
          <template v-slot="{ row }">
            <span>{{ row.taxSign ? "是" : "否" }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column width="70" field="taxRate" title="税率"></vxe-table-column>
        <vxe-table-column width="80" field="sellQty" title="出库数量"></vxe-table-column>
        <vxe-table-column width="90" field="sellPrice" title="出库单价"></vxe-table-column>
        <vxe-table-column width="80" field="rtnableQty" title="可退数量"></vxe-table-column>
        <vxe-table-column width="50" field="systemUnitId" title="单位"></vxe-table-column>
        <vxe-table-column width="160" field="guestName" title="供应商"></vxe-table-column>
        <vxe-table-column width="170" field="serviceId" title="出库单号"></vxe-table-column>
        <vxe-table-column width="170" field="code" title="关联销售订单"></vxe-table-column>
        <vxe-table-column v-if="changeShowFirst" width="200" field="originGuestName" title="第一供应商"></vxe-table-column>
      </vxe-table>

      <div class="page-warp">
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          @on-change="changePageToTable"
          @on-page-size-change="changeSizeToTable"
          show-sizer
          show-total
          show-elevator
        ></Page>
      </div>
    </div>

    <!-- 供应商资料
   <select-supplier
     @selectSearchName="selectSupplierName"
     ref="selectSupplier"
     headerTit="供应商资料"
   ></select-supplier> -->

    <div slot='footer'></div>

  </Modal>
</template>

<script lang="ts">
  // @ts-ignore
  import * as tools from "_utils/tools";
  import {Vue, Component, Prop, Emit} from "vue-property-decorator";
  // @ts-ignore
  import * as api from "@/api/procurement/planTwo";
  import {getPartBrand} from "@/api/business/stockSearch";
  import getDate from "@/components/getDate/dateget_bill.vue";
  import {getParts, getSaleParts} from "@/api/salesManagment/salesOrder";

  @Component({
    components: {
      getDate
    }
  })
  export default class ProcurementModal extends Vue {
    private shows: boolean = false;
    private selectRow: Array<any> = new Array();

    @Prop({default: "good"}) private readonly type!: string;
    @Prop(String) private readonly guestId;
    @Prop(String) private readonly storeId;

    private auditDate: Array<Date> = [];
    // private guestname:string = "";
    private partId: string = "";
    private partName: string = "";
    private partCode: string = "";
    private oemCode: string = "";
    private loading:boolean=false;

    private page: Page = {
      num: 1,
      size: 10,
      total: 0
    };

    private tableData: Array<any> = [];

    private filters: Array<any> = [];

    private partBrand: any = '' //获取当前品牌code

    private bands: Array<any> = [] //品牌列表

    private tableDataBm: Array<any> = new Array();

    private selectTableItem: any;

    private init() {
      let tableRef: any = this.$refs.xTable1;
      tableRef.refreshColumn();
      // tableRef.recalculate(true)
      this.$nextTick(() => (this.$refs.input as any).focus());
      this.reset();
      // this.getPchsPlanList();
      this.shows = true;
    }

    // computed
    get changeShowFirst() {
      return this.$store.state.user.userData.currentCompany.isMaster == 0 ? true : false
    }

    //双击添加配件
    private dblclick(row) {
      if (row.row.length <= 0) {
        return this.$Message.error('请勾选要选择的配件!');
      }
      ;
      row.row.sourceDetailId = row.row.id;
      Reflect.deleteProperty(row.row, 'id');
      this.$emit("dblclickfun", [row.row])
    }

    @Emit('getPlanOrder')
    private ok() {
      let selectRow = JSON.parse(JSON.stringify(this.selectRow));
      if (selectRow.length <= 0) {
        return this.$Message.error('请勾选要选择的配件!');
      }
      ;
      // this.shows = false;
      selectRow.forEach((el: any) => {
        el.sourceDetailId = el.id;
        Reflect.deleteProperty(el, 'id');
      })
      return selectRow;
    }

    @Emit('getPlanOrder')
    private async selectOrder() {
      let selectRow = JSON.parse(JSON.stringify(this.selectRow));
      if (selectRow.length <= 0) {
        return this.$Message.error('请勾选要选择的配件!');
      }
      ;

      let msg: any = this.$Message.loading({
        content: '加载中...',
        duration: 0
      });

      let row = selectRow[0];

      let params: any = {
        guestId: this.guestId,
        storeId: this.storeId,
        code: row.code,
      }
      params.size = 9999;
      params.page = 0;

      let res: any;
      if (this.type === "good") {
        res = await getParts(params);
      }
      if (this.type === "sale") {
        res = await getSaleParts(params);
      }
      let data: Array<any> = new Array();
      if (res.code == 0) {
        data = (res.data.content || []).map(el => {
          el.sourceDetailId = el.id;
          Reflect.deleteProperty(el, 'id');
          return el;
        });
      }
      msg();
      return data;
    }


//生命周期
    created() {
      // this.getBand() //调用品牌接口
    }

    private showModel(name) {
      let ref: any = this.$refs[name];
      ref.init();
    }

    private cancel() {
      this.shows = false;
    }

    private reset() {
      this.selectRow = new Array();
      this.tableDataBm = new Array();
      this.filters = [];
      this.partId = "";
      this.partName = "";
      this.partCode = "";
      this.oemCode = "";
    }

    private filterNameMethod({value, row, column}) {
      return row.partBrand.indexOf(value) > -1
    }

    //点击全选
    private cellClickEvent({selection}) {
      this.selectRow = selection;
    }

    //点击复选框获取当前已选择数据
    private radioChangeEvent({selection}) {
      this.selectRow = selection;
    }

    //获取保留复选数据
    getReserve(v) {
      // console.log(v)
    }


    private query() {
      this.page.num = 1;
      this.getPchsPlanList();
    }

    //快速查询日期
    private getDataQuick(v) {
      this.auditDate = v
      if (!this.shows) return;
      this.getPchsPlanList();
    }

    private SelectChange(v) {
      this.getPchsPlanList();
    }


    //出库日期获取
    private getDate(v) {
      if (v[0]) {
        v[0] = v[0] + " 00:00:00"
        v[1] = v[1] + " 23:59:59"
      }
      this.auditDate = v;
      this.getPchsPlanList();
    }

    //获取品牌
    private async getBand() {
      let res: any = await getPartBrand({pageSize: 10000});
      if (res.code === 0) {
        let arr: any = [];
        res.data.content.forEach(item => {
          arr.push(...item.children);
        });
        arr.map(item => {
          this.bands.push({
            value: item.name,
            label: item.name
          });
        });
      }
    }


    private async getPchsPlanList() {
      let params: any = {
        guestId: this.guestId,
        storeId: this.storeId,
      };
      let boolParams=false;//四个判断条件最少有一个
      params.size = this.page.size;
      params.page = this.page.num - 1;
      if(!this.partName && !this.partId && !this.partCode && !this.oemCode){
        boolParams=true
      }
      if(boolParams){
        this.$Message.error("最少有一个筛选条件")
        return false
      }
      let data: any = {
        partId: this.partId,
        partName: this.partName,
        partCode: this.partCode,
        oemCode: this.oemCode,
        startEnterDate: this.auditDate[0] ? this.auditDate[0] : "",
        endEnterDate: this.auditDate[1] ? this.auditDate[1] : "",
      };
      let formData: any = {};
      for (let k in data) {
        if (data[k] && data[k].trim()) {
          formData[k] = data[k];
        }
      }
      this.partBrand == 0 ? "" : formData.partBrand = this.partBrand;

      let obj = {...params, ...formData}

      let res: any;
      this.loading=true;
      if (this.type === "good") {
        res = await getParts(obj);
      }
      if (this.type === "sale") {
        res = await getSaleParts(obj);
      }
      if (res.code == 0) {
        this.page.total = res.data.totalElements;
        this.tableData = res.data.content;
        this.filters = [];
        let arr = res.data.content.map(el => el.partBrand);
        let set = new Set(arr);
        set.forEach(el => {
          this.filters.push({label: el, value: el});
        })
        const xTable: any = this.$refs.xTable1;
        const column = xTable.getColumnByField('partBrand');
        xTable.setFilter(column, this.filters);
        xTable.updateData();
        this.loading=false
      }
    }

    private changePageToTable(p: number) {
      this.page.num = p;
      this.getPchsPlanList();
    }

    private changeSizeToTable(size: number) {
      this.page.num = 1;
      this.page.size = size;
      this.getPchsPlanList();
    }

  }
</script>

<style lang="less">
  .tools-bar {
    display: flex;
    align-items: center;
  }

  .page-warp {
    margin-top: 10px;
    text-align: right;
  }
</style>

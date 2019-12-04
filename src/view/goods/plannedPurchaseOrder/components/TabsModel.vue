<template>
  <Modal
    v-model="show"
    title="详情"
    :styles="{ top: '50px', width: '1000px' }"
    footer-hide
  >
    <div class="pb20">
      <Tabs value="name1">
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
            :columns="Tab1columns"
            :data="Tab2tableData"
          ></Table>
        </TabPane>
        <TabPane label="采购记录" name="name3">
          <Table
            height="420"
            size="small"
            highlight-row
            border
            :stripe="true"
            :loading="loading"
            :columns="Tab2columns"
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
      key: "outQty",
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
      key: "outQty",
      minWidth: 80
    }
  ];

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
      this.Tab1tableData = res.data.orgStock // 本地
      this.Tab2tableData = res.data.chainStock // 连锁
      this.Tab3tableData = res.data.pchsLog // 采购
    }
  }
}
</script>

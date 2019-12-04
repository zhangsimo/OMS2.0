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
            :columns="Tab2columns"
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
            :columns="Tab3columns"
            :data="Tab3tableData"
          ></Table>
        </TabPane>
      </Tabs>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TabsModel extends Vue {
  private show: boolean = false;

  private loading: boolean = false;

  private Tab1columns: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      key: "id"
    },
    {
      title: "配件编码",
      key: "venderSkuNo",
      minWidth: 100
    },
    {
      title: "配件名称",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "单位",
      key: "venderSkuNo",
      minWidth: 80
    },
    {
      title: "仓库",
      key: "venderSkuNo",
      minWidth: 100
    },
    {
      title: "库存数量",
      key: "venderSkuNo",
      minWidth: 80
    },
    {
      title: "订单占用",
      key: "venderSkuNo",
      minWidth: 80
    },
    {
      title: "可开单数量",
      key: "venderSkuNo",
      minWidth: 80
    }
  ];

  private Tab2columns: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      key: "id"
    },
    {
      title: "公司名称",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "仓库",
      key: "venderSkuNo",
      minWidth: 80
    },
    {
      title: "库存数量",
      key: "venderSkuNo",
      minWidth: 80
    },
    {
      title: "可售数量",
      key: "venderSkuNo",
      minWidth: 80
    }
  ];

  private Tab3columns: Array<Tableth> = [
    {
      title: "序号",
      minWidth: 50,
      key: "id"
    },
    {
      title: "配件编码",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "配件名称",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "仓库",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "单位",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "采购数量",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "税点",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "含税单价",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "不含税单价",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "供应商",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "第一供应商",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "入库单号",
      key: "venderSkuNo",
      minWidth: 120
    },
    {
      title: "入库日期",
      key: "venderSkuNo",
      minWidth: 120
    }
  ];

  private Tab1tableData: Array<any> = new Array();
  private Tab2tableData: Array<any> = new Array();
  private Tab3tableData: Array<any> = new Array();

  private init(): void {
    this.show = true;
  }
}
</script>

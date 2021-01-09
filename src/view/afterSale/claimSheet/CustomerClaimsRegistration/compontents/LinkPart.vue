<template>
  <Modal v-model="model" title="关联配件" width="1000">
    <div>
      <Tabs type="card" name="search">
        <TabPane label="关联配件连锁库存" tab="search">
          <Table border :columns="columns1" :data="allList.chainStock"></Table>
        </TabPane>
      </Tabs>
      <br />
      <Tabs type="card" name="search">
        <TabPane label="关联配件级别价格" tab="search">
          <Table border :columns="columns2" :data="allList.priceLever"></Table>
        </TabPane>
      </Tabs>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { getDetails } from "@/api/salesManagment/salesOrder";
export default {
  props: {
    partId: undefined,
    guestId: undefined,
    storeId: undefined,
  },

  data() {
    return {
      model: false,
      columns1: [
        {
          title: "配件编码",
          key: "partCode",
          align: "center"
        },
        {
          title: "配件名称",
          key: "partName",
          align: "center"
        },
        {
          title: "品牌",
          key: "partBrand",
          align: "center"
        },
        {
          title: "分店名称",
          key: "companyName",
          align: "center"
        },
        {
          title: "仓库",
          key: "storeName",
          align: "center"
        },
        {
          title: "可售数量",
          key: "outableQty",
          align: "center"
        }
      ],
      columns2: [
        {
          title: "配件编码",
          key: "partCode",
          align: "center"
        },
        {
          title: "配件名称",
          key: "partName",
          align: "center"
        },
        {
          title: "品牌",
          key: "partBrand",
          align: "center"
        },
        {
          title: "级别",
          key: "strategyName",
          align: "center"
        },
        {
          title: "销售价",
          key: "sellPrice",
          align: "center",
          render:(h , params)=>{
            let num =  +params.row.sellPrice
            return h('span', {} ,num.toFixed(2) )
          }
        },
        {
          title: "更新人",
          key: "updateUname",
          align: "center"
        },
        {
          title: "更新日期",
          key: "updateTime",
          align: "center"
        }
      ],
      allList: {},
    };
  },
  methods: {
    init() {
      this.allList = [];
      this.model = true;
      this.getList();
    },
    getList() {
        let data = {};
        data.partId = this.partId;
        data.guestId = this.guestId
        data.storeId = this.storeId;
        getDetails(data).then(res => {
            if (res.code === 0) {
                this.allList = res.data;
            }
        });
    }
  }
};
</script>

<style scoped></style>

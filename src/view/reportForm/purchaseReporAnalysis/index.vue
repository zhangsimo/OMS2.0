<template>
  <div class="content-oper" style="background: #fff">
    <panne @search="tabName" @export="exportxls()" ref="panne"/>
    <Tabs style="min-height: 500px" v-model="tabNameKey" type="card" @on-click="tabName">
      <TabPane label="按供应商排行" name="tabOne">
        <tabOne ref="tabOne"/>
      </TabPane>
      <TabPane label="按商品排行" name="tabTwo">
        <tabTwo ref="tabTwo"/>
      </TabPane>
      <TabPane label="按品牌排行" name="tabThree">
        <tabThree ref="tabThree"/>
      </TabPane>
      <TabPane label="按配件类型排行" name="tabFour">
        <tabFour ref="tabFour"/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import * as api from "_api/reportForm/index.js";
  import panne from "./components/panne";
  import tabOne from "./components/tabOne";
  import tabTwo from "./components/tabTwo";
  import tabThree from "./components/tabThree";
  import tabFour from "./components/tabFour";
  import moment from "moment";

  export default {
    name: "purchaseReporAnalysis",//采购排行分析
    components: {panne, tabOne, tabTwo, tabThree, tabFour},
    data() {
      return {tabNameKey:"tabOne"};
    },
    async mounted() {
    },
    methods: {
      tabName() {
        let data={}
        for (let key in this.$refs.panne.search) {
          if (this.$refs.panne.search[key]) {
            if (key == "enterDate") {
              if (this.$refs.panne.search["enterDate"][0]) {
                data.enterDateStart =
                  moment(this.$refs.panne.search["enterDate"][0]).format("YYYY-MM-DD") +
                  " 00:00:00";
                data.enterDateEnd =
                  moment(this.$refs.panne.search["enterDate"][1]).format("YYYY-MM-DD") +
                  " 23:59:59";
              }
            }else if(key == "supplierTypes"){
              data.supplierTypes=Array.from(new Set(this.$refs.panne.search.supplierTypes.flat()));
            } else {
              data[key] = this.$refs.panne.search[key];
            }
          }
        }
        data.guestPart == true ? data.showPerson = 1 : data.showPerson = 0
        // console.log(data.supplierTypes,11111)
        switch (this.tabNameKey) {
          case "tabOne":
            this.search1(data);
            break;
          case "tabTwo":
            this.search2(data);
            break;
          case "tabThree":
            this.search3(data);
            break;
          case "tabFour":
            this.search4(data);
            break;
        }
      },
      // type:0,//0 供应商排行 1，按商品排行 2，按品牌分析 3，按配件类型分析
      search1(data) {
        //按照供应商排行
        let data2 = {};
        // 基本查询
        delete data.isPanne;
        data.type=0;
        data2 = data;
        this.$refs.tabOne.body = data2
        this.$refs.tabOne.getList();
      },
      search2(data) {
        //按照商品排行
        let data2 = {};
        // 基本查询
        delete data.isPanne;
        data.type = 1
        data2 = data;
        this.$refs.tabTwo.body = data2;
        this.$refs.tabTwo.getList();
      },
      search3(data) {
        //按照品牌排行
        let data2 = {};
        // 基本查询
        delete data.isPanne;
        data.type = 2
        data2 = data;
        this.$refs.tabThree.body = data2;
        this.$refs.tabThree.getList();
      },
      search4(data) {
        //按照配件类型排行
        let data2 = {};
        // 基本查询
        delete data.isPanne;
        data.type = 3
        data2 = data;
        this.$refs.tabFour.body = data2;
        this.$refs.tabFour.getList();
      },
      async exportxls(refname) {
        // this.$refs[refname].exportXls();
        this.$Modal.warning({
          title:"通知",
          content:"此业务请联系IT服务台导出报表数据"
        })
      },
    }
  };
</script>


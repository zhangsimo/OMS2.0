<template>
  <div class="content-oper" style="background: #fff">
    <panne ref="panne" @search="tabName" @export="exportxls()"/>
    <Tabs style="min-height: 500px" v-model="tabNameKey" type="card" @on-click="tabName">
      <TabPane label="按客户排行" name="tabOne">
        <tabOne ref="tabOne" @one="one"/>
      </TabPane>
      <TabPane label="按商品排行" name="tabTwo">
        <tabTwo ref="tabTwo" @two="two"/>
      </TabPane>
      <TabPane label="按品牌排行" name="tabThree">
        <tabThree ref="tabThree" @san="san"/>
      </TabPane>
      <TabPane label="按配件类型排行" name="tabFour">
        <tabFour ref="tabFour" @si="si"/>
      </TabPane>
      <TabPane label="按业务员排行" name="tabFive">
        <tabFive ref="tabFive" @wu="wu"/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import panne from "./components/panne";
  import tabOne from "./components/tabOne";
  import tabTwo from "./components/tabTwo";
  import tabThree from "./components/tabThree";
  import tabFour from "./components/tabFour";
  import tabFive from "./components/tabFive";
  import moment from "moment";
  export default {
    name: "saleOrderAnalysis",
    components: { panne, tabOne, tabTwo, tabThree,tabFour,tabFive },
    data() {
      return {
        tabNameKey:"tabOne"
      };
    },
    mounted() {},
    methods: {
       one(){
        this.$refs.panne.search.enterDate=this.$refs.panne.v1
      },
      two(){
        this.$refs.panne.search.enterDate=this.$refs.panne.v1
      },
      san(){
        this.$refs.panne.search.enterDate=this.$refs.panne.v1
      },
      si(){
        this.$refs.panne.search.enterDate=this.$refs.panne.v1
      },
      wu(){
         this.$refs.panne.search.enterDate=this.$refs.panne.v1
      },
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
            } else {
              data[key] = this.$refs.panne.search[key];
            }
          }
        }
        data.guestPart == true ? data.showPerson = 1 : data.showPerson = 0;
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
          case "tabFive":
            this.search5(data);
            break;
        }
      },
      search1(data) {
        let data2 = {};
        if(data.isPanne) {
          // 基本查询
          delete data.isPanne;
          data.type=0;
          data2 = data;
        }
        this.$refs.tabOne.body = data2
        this.$refs.tabOne.getAllMoney();
        this.$refs.tabOne.getList();
      },
      search2(data) {
        let data2 = {};
        if(data.isPanne) {
          // 基本查询
          delete data.isPanne;
          data.type=1;
          data2 = data;
        }
        this.$refs.tabTwo.body = data2
        this.$refs.tabTwo.getAllMoney();
        this.$refs.tabTwo.getList();
      },
      search3(data) {
        let data2 = {};
        if(data.isPanne) {
          // 基本查询
          delete data.isPanne;
          data.type=2;
          data2 = data;
        }
        this.$refs.tabThree.body = data2
        this.$refs.tabThree.getAllMoney();
        this.$refs.tabThree.getList();
      },
      search4(data) {
        let data2 = {};
        if(data.isPanne) {
          // 基本查询
          delete data.isPanne;
          data.type=3;
          data2 = data;
        }
        this.$refs.tabFour.body = data2
        this.$refs.tabFour.getAllMoney()
        this.$refs.tabFour.getList();
      },
      search5(data) {
        let data2 = {};
        if(data.isPanne) {
          // 基本查询
          delete data.isPanne;
          data.type=4;
          data2 = data;
        }
        this.$refs.tabFive.body = data2
        this.$refs.tabFive.getAllMoney();
        this.$refs.tabFive.getList();
      },
      exportxls(refname) {
        this.$Modal.warning({
          title:"通知",
          content:"此业务请联系IT服务台导出报表数据"
        })
      },
    }
  };
</script>

<template>
  <div class="content-oper" style="background: #fff">
   
    <Tabs style="min-height: 500px" v-model="tabNameKey" type="card" @on-click="tabName">
      <TabPane label="按客户排行" name="tabOne1">
        <tabOne ref="tabOnes" />
      </TabPane>
      <TabPane label="按商品排行" name="tabTwo1">
        <tabTwo ref="tabTwos" />
      </TabPane>
      <TabPane label="按品牌排行" name="tabThree1">
        <tabThree ref="tabThrees" />
      </TabPane>
      <TabPane label="按配件类型排行" name="tabFour1">
        <tabFour ref="tabFours" />
      </TabPane>
      <TabPane label="按业务员排行" name="tabFive1">
        <tabFive ref="tabFives" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  // import panne from "./panne";
  import tabOne from "./tabOne";
  import tabTwo from "./tabTwo";
  import tabThree from "./tabThree";
  import tabFour from "./tabFour";
  import tabFive from "./tabFive";
  import moment from "moment";
  export default {
    name: "saleOrderAnalysis1",
    components: { tabOne, tabTwo, tabThree,tabFour,tabFive },
    data() {
      return {
        tabNameKey:"tabOne"
      };
    },
    mounted() {},
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
            } else {
              data[key] = this.$refs.panne.search[key];
            }
          }
        }
        data.guestPart == true ? data.showPerson = 1 : data.showPerson = 0;
        switch (this.tabNameKey) {
          case "tabOne1":
            this.search1(data);
            break;
          case "tabTwo1":
            this.search2(data);
            break;
          case "tabThree1":
            this.search3(data);
            break;
          case "tabFour1":
            this.search4(data);
            break;
          case "tabFive1":
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

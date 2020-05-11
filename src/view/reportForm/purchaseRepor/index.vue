<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="采购订单明细表">
        <panne :type="1" @search="search1" />
        <tabOne />
      </TabPane>
      <TabPane label="采购入库明细表">
        <panne :type="2" @search="search2" />
        <tabTwo />
      </TabPane>
      <TabPane label="采购退货明细表">
        <panne :type="3" @search="search3" />
        <tabThree />
      </TabPane>
      <TabPane label="采购计划明细表">
        <panne :type="4" @search="search4" />
        <tabFour />
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
import * as api from "_api/reportForm/index.js";
export default {
  name: "reporIndex",
  components: { panne, tabOne, tabTwo, tabThree, tabFour },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search1(data) {},
    search2(data) {},
    search3(data) {},
    search4(data) {}
  }
};
</script>

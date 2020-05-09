<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="组装成品入库明细表">
        <panne :type="1" @search="search1" />
        <tabOne />
      </TabPane>
      <TabPane label="组装半成品出库明细表">
        <panne :type="2" @search="search2" />
        <tabTwo />
      </TabPane>
      <TabPane label="拆分成品出库明细表">
        <panne :type="3" @search="search3" />
        <tabThree />
      </TabPane>
      <TabPane label="拆分半成品入库明细表">
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

<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="销售订单明细表">
        <panne :type="1" @search="search1" />
        <tabOne />
      </TabPane>
      <TabPane label="销售出库明细表">
        <panne :type="2" @search="search2" />
        <tabTwo />
      </TabPane>
      <TabPane label="销售退货明细表">
        <panne :type="3" @search="search3" />
        <tabThree />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";
import tabTwo from "./components/tabTwo";
import tabThree from "./components/tabThree";

export default {
  name: "reporIndex",
  components: { panne, tabOne, tabTwo, tabThree },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search1(data) {},
    search2(data) {},
    search3(data) {},
  }
};
</script>

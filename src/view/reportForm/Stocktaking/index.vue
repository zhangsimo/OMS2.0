<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="盘盈入库明细表">
        <panne :type="1" @search="search1" />
        <tabOne />
      </TabPane>
      <TabPane label="盘亏出库明细表">
        <panne :type="2" @search="search2" />
        <tabTwo />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";
import tabTwo from "./components/tabTwo";

export default {
  name: "reporIndex",
  components: { panne, tabOne, tabTwo },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search1(data) {},
    search2(data) {},
  }
};
</script>

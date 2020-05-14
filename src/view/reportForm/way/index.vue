<template>
  <div class="content-oper" style="background: #fff">
    <panne @search="search" @export="exportxls('tabOne')" />
    <tabOne ref="tabOne" />
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";

export default {
  name: "reporIndex",
  components: { panne, tabOne },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search(data) {},
    exportxls(refname) {
      this.$refs[refname].$refs.xTable.exportData({
        filename: '采购订单明细表',
        isHeader: true,
        isFooter: true,
        data: this.$refs[refname].tableDataAll,
      })
    },
  }
};
</script>

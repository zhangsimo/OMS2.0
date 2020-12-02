<template>
  <div class="content-oper" style="background: #fff">
    <panne ref="panne" @search="search" @export="exportxls('tabOne')" />
    <tabOne ref="tabOne" />
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";

export default {
  name: "procurementWay",
  components: { panne, tabOne },
  data() {
    return {};
  },
  mounted() {
    this.$refs.panne.query()
  },
  methods: {
    search(data) {
      this.$refs.tabOne.body = data;
      this.$refs.tabOne.getList();
    },
    async exportxls(refname) {
      await this.$refs[refname].getAll();
      // this.$refs[refname].$refs.xTable.exportData({
      //   filename: '调出在途信息',
      //   isHeader: true,
      //   isFooter: true,
      //   data: table,
      // })
    },
  }
};
</script>

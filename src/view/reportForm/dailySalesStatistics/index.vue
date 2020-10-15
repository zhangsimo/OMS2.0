<template>
  <div class="content-oper" style="background: #fff">
    <panne @search="search" @export="exportxls()" />
    <tabOne ref="tabOne" />
  </div>
</template>
<script>
  import panne from "./component/panne";
  import tabOne from "./component/tabOne";

  export default {
    name: "dailySalesStatistics",
    components: { panne, tabOne },
    data() {
      return {};
    },
    mounted() {},
    methods: {
      search(data) {
        this.$refs.tabOne.body = data;
        this.$refs.tabOne.getList();
      },
      async exportxls(data) {
        // this.$refs.tabOne.export()
        this.$Modal.warning({
          title:"通知",
          content:"此业务请联系IT服务台导出报表数据"
        })
      },
    }
  };
</script>

<template>
  <div class="content-oper" style="background: #fff">
    <panne @search="search1"/>
    <tabOne ref="tabOne"/>
  </div>
</template>
<script>
  import panne from "./components/panne";
  import tabOne from "./components/table";
  export default {
    name: "dingTenantres",
    components: {panne, tabOne},
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      search1(data) {
        let data2 = {}
        if (data.isPanne) {
          delete data.isPanne;
          data2 = data;
        }
        this.$refs.tabOne.searchData = data2
        this.$refs.tabOne.page.page = 0;
        this.$refs.tabOne.getList(data2);
      }
    }
  };
</script>


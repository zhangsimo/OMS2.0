<template>
  <div class="content-oper flex-c bigbox" style="background: #fff;">
    <panne @search="search" @export="exportxls()" />
    <tabOne ref="tabOne" />
  </div>
</template>
<script>
  import panne from "./components/panne.vue";
  import tabOne from "./components/tabOne.vue";

  export default {
    name: "salesAndInventorylist",
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
      async exportxls() {
        this.$Modal.warning({
          title:"通知",
          content:"此业务请联系IT服务台导出报表数据"
        })
      },
    }
  };
</script>

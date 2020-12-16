<template>
  <div  class="content-oper" style="background: #fff">
    <panne @search="search" @export="exportxls()"/>
    <tabOne ref="tabOne"/>
  </div>
</template>
<script lang="ts">
  import {Vue, Component, Watch} from "vue-property-decorator";
  import panne from "./components/panne.vue";
  import tabOne from "./components/tabOne.vue";
  // @ts-ignore
  @Component({
    components: {
      panne:panne,
      tabOne:tabOne
    }
  })
  export default class claimSupplier extends Vue {
    private search(data:any) {
      let data2:any = {};
      delete data.isPanne;
      data2 = data;
      let tabOne:any=this.$refs.tabOne;
      tabOne.body = data2
      tabOne.getList();
    }
    private exportxls(){
      let tabOne:any=this.$refs.tabOne;
      tabOne.exportData();
    }
  }
</script>
<style lang="less">

</style>

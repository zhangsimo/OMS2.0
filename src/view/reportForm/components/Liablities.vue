<template>
  <div style="height: 100%" ref="tableWrap">
    <Table height="600" border :columns="liablities" :max-height="tableHeight" :data="liablitiesData" ref="table"></Table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      liablities: [
        { key: "subjectLeft", title: "资产" ,},
        { key: "lineLeft", title: "行次",width:60, },
        { key: "yearFirstLeft", title: "年初数" ,},
        { key: "monthEndLeft", title: "期末数" ,},
        { key: "subjectRight", title: "负债及所有者权益" ,},
        { key: "lineRight", title: "行次",width:60, },
        { key: "yearFirstRight", title: "年初数", },
        { key: "monthEndRight", title: "期末数", }
      ],
      liablitiesData: [],
      tableHeight:0,
    };
  },
  mounted(){
    this.$nextTick(()=>{
      let h = this.$refs.tableWrap.offsetHeight;
      this.tableHeight = h
    })
  }
};
</script>

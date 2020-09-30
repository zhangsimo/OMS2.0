<template>
  <div style="height: 100%" ref="tableWrap">
    <Table border :columns="profit" :max-height="tableHeight" :data="profitData" ref="table"></Table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      profit: [
        { key: "projectName", title: "项目", },
        { key: "line", title: "行次",width:200, },
        { key: "lastYear", title: "上年同期数",width:200, },
        { key: "thisMonth", title: "本月数",width:200, },
        { key: "thisYearSum", title: "本年累计" ,width:200,}
      ],
      profitData: [],
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

<template>
  <Table size="small" width="500" border :stripe="true" :columns="columns" :data="tbdata"></Table>
</template>

<script>

  export default {
    name: "orderLine",
    props: {
      tbdata: Array
    },
    data() {
      return {
        columns: [
          {
            title: '配件内码',
            align: 'center',
            minWidth: 120,
            key: 'skuNo'
          },
          {
            title: '配件名称',
            align: 'center',
            key: 'skuName',
            minWidth: 120
          },
          {
            title: '数量',
            align: 'center',
            key: 'qty',
            minWidth: 120
          }
        ]
      }
    },
    mounted() {
    },
    methods: {
    },
    computed: {
    }
  }
</script>

<style scoped>

</style>

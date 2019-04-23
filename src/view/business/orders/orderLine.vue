<template>
  <Table size="small" width="610" border :stripe="true" :columns="columns" :data="tbdata"></Table>
</template>

<script>

  export default {
    name: "OrderLine",
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
            minWidth: 120,
            // render: (h, params) => {
            //   let text = params.row.qty + ' ' + (params.row.unitId || '')
            //   return h('span', {}, text)
            // }
          },
          {
            title: '单位',
            align: 'center',
            key: 'unitId',
            minWidth: 120
          },
          {
            title: '规格',
            align: 'center',
            key: 'spec',
            minWidth: 120
          }
        ]
      }
    },
    mounted() {
      // console.log(this.tbdata)
    },
    methods: {
    },
    computed: {
    }
  }
</script>

<style scoped>

</style>

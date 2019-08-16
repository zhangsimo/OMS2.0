<template>
  <Table size="small" width="910" border :stripe="true" :columns="columns" :data="tbdata"></Table>
</template>

<script>

  export default {
    name: "OrderLine",
    props: {
      tbdata: Array,
      parent: ''
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
            minWidth: 100,
            // render: (h, params) => {
            //   let text = params.row.qty + ' ' + (params.row.unitId || '')
            //   return h('span', {}, text)
            // }
          },
          {
            title: '单位',
            align: 'center',
            key: '',
            minWidth: 100,
            render: (h, params) => {
              return h('span', params.row.minSalesUnit || params.row.unitId)
            }
          },
          {
            title: '规格',
            align: 'center',
            key: 'spec',
            minWidth: 150
          },
          {
            title: '适用车牌',
            align: 'center',
            key: 'carModelName',
            minWidth: 150
          },
          {
            title: '单价',
            align: 'center',
            key: 'price',
            minWidth: 100
          },
          {
            title: '门店价',
            align: 'center',
            key: 'salesPrice',
            minWidth: 100
          },
          {
            title: '采购价',
            align: 'center',
            key: 'purchasePrice',
            minWidth: 100
          }
        ]
      }
    },
    beforeMount () {
      if (this.parent === 'directOrder') {
        this.columns.pop()
        this.columns.pop()
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

<template>
  <div id="app" v-if="Tbdata">
    <template>
      <div style="height: 100%">
        <vxe-table
          :data="Tbdata"
          :loading="Loading"
          :tree-config="{children: 'children'}"
          @cell-click="selection"
          highlight-hover-row
        >
          <vxe-table-column type="seq" title="序号"></vxe-table-column>
          <vxe-table-column field="code" title="分类编码"></vxe-table-column>
          <vxe-table-column field="name" title="分类名称" tree-node></vxe-table-column>
          <vxe-table-column field="disabled" title="是否禁用"></vxe-table-column>
          <vxe-table-column field="createUname" title="最近修改人"></vxe-table-column>
          <vxe-table-column field="createTime" title="修改时间"></vxe-table-column>
        </vxe-table>
      </div>
    </template>
  </div>
</template>


<script>

    /* eslint-disable */
    export default {
        props:{Tbdata:'',
            Loading:''},
        data () {
            return {
                // tableData: [{
                //     name: 'test1',
                //     sex: '男',
                //     date: '2019-08',
                //     children: [
                //         {
                //             name: 'test2',
                //             sex: '女',
                //             date: '2019-08',
                //             children: [
                //                 {
                //                     name: 'test3',
                //                     sex: '男',
                //                     date: '2019-08',
                //                 },
                //                 {
                //                     name: 'test11',
                //                     sex: '男',
                //                     date: '2019-08',
                //                 }
                //             ]
                //         },
                //         {
                //             name: 'test7',
                //             sex: '女',
                //             date: '2019-08',
                //             children: [
                //                 {
                //                     name: 'test9',
                //                     sex: '男',
                //                     date: '2019-08',
                //                 }
                //             ]
                //         }
                //     ]
                // },
                //     {
                //         name: 'test4',
                //         sex: '男',
                //         date: '2019-08',
                //         children: [
                //             {
                //                 name: 'test5',
                //                 sex: '女',
                //                 date: '2019-08',
                //             },
                //             {
                //                 name: 'test15',
                //                 sex: '女',
                //                 date: '2019-08',
                //             }
                //         ]
                //     }],
                tableData: this.Tbdata,
                Loading:true,
                rowMessage: '',
                STATE: ''
            }
        },
        mounted () {
            // var Ctor = Vue.extend(this.tableData);
            // new Ctor().$mount('#app')
        },
        methods: {
          selection(row){
            this.rowMessage = row.row
            this.STATE = this.rowMessage.isDisabled
            // console.log(this.rowMessage)
            // console.log(this.STATE)
            this.$emit('getMsg',[this.rowMessage,this.STATE])
          }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  th,td{
    width: 150px;
  }
  td:first-child{
    text-align: left;
  }
  td span{
    display: inline-block;
    width: 1.5rem;
    height: 1rem;
  }
  td span.expand{
    /*background-image: url('./folder_open.png');*/
  }
  td span.collapse{
    /*background-image: url('./folder.png');*/
  }
  .virtual-tree-icon {
    visibility: hidden;
    cursor: pointer;
    margin-right: 4px;
  }
  .virtual-tree-icon.visible {
    visibility: visible;
  }

</style>

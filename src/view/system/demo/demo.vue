<template>
  <div id="app">
    <template>
      <div>
        <vxe-table
          :data="tableData"
          :tree-config="{children: 'children'}">
          <vxe-table-column type="seq" title="序号"></vxe-table-column>
          <vxe-table-column field="name" title="Name" tree-node></vxe-table-column>
          <vxe-table-column field="sex" title="Sex"></vxe-table-column>
          <vxe-table-column field="date" title="Date"></vxe-table-column>
        </vxe-table>
      </div>
    </template>
  </div>
</template>


<script>


    /* eslint-disable */
    export default {
        data () {
            return {
                tableData: [{
                    name: 'test1',
                    sex: '男',
                    date: '2019-08',
                    children: [
                        {
                            name: 'test2',
                            sex: '女',
                            date: '2019-08',
                            children: [
                                {
                                    name: 'test3',
                                    sex: '男',
                                    date: '2019-08',
                                },
                                {
                                    name: 'test11',
                                    sex: '男',
                                    date: '2019-08',
                                }
                            ]
                        },
                        {
                            name: 'test7',
                            sex: '女',
                            date: '2019-08',
                            children: [
                                {
                                    name: 'test9',
                                    sex: '男',
                                    date: '2019-08',
                                }
                            ]
                        }
                    ]
                },
                    {
                        name: 'test4',
                        sex: '男',
                        date: '2019-08',
                        children: [
                            {
                                name: 'test5',
                                sex: '女',
                                date: '2019-08',
                            },
                            {
                                name: 'test15',
                                sex: '女',
                                date: '2019-08',
                            }
                        ]
                    }]
            }
        },
        created () {
            var Ctor = Vue.extend(this.tableData);
            new Ctor().$mount('#app')

        },
        methods: {}
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

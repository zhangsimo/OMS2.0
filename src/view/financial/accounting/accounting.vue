<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane" style="overflow-y: auto; height: 100%;">
        <Tree :data="treeList" @on-select-change="clickTree"></Tree>
      </div>
      <div slot="right" class="demo-split-pane" style="overflow-y: auto; height: 100%;">
        <Button @click="add" type="warning" class="mr10 w90">新增科目</Button>
        <vxe-table
          border
          class="mt10"
          resizable
          :data="tableData"
          stripe
          size="mini"
          align="center"
          :auto-resize="true"
          highlight-hover-row
          highlight-current-row
          show-overflow
        >
          <vxe-table-column type="index"  title="操作"></vxe-table-column>
          <vxe-table-column field="fullName" title="科目编码"></vxe-table-column>
          <vxe-table-column field="code" title="科目名称"></vxe-table-column>
          <vxe-table-column title="科目类别">
            <template v-slot="{ row }">{{ row.isDisabled == 1 ? '无效' : '有效' }}</template>
          </vxe-table-column>
          <vxe-table-column field="billTypeName" title="余额方向"></vxe-table-column>
          <vxe-table-column field="settTypeName" title="辅助核算"></vxe-table-column>
          <vxe-table-column field="contactor" title="层级"></vxe-table-column>
          <vxe-table-column field="contactorTel" title="状态"></vxe-table-column>
        </vxe-table>
      </div>
    </Split>
  </div>
</template>

<script>
    import {getDataDictionaryType} from '../../../api/system/dataDictionary/dataDictionaryApi'

    export default {
        name: "accounting",
        data(){
            return {
                split1: 0.2,
                treeList:[],//树形图数据
                oneTreeList:{},//点击获取一级以下树形数据
                tableData:[],//表格数据
            }
        },
        mounted(){
           this.getTreeList()
        },
        methods: {
            //获取左侧树形图数据
           async getTreeList(){
                let res = await getDataDictionaryType()
               if ( res.code === 0){
                   this.treeList = res.data
                   this.changeTree( this.treeList )
               }
            },

            //处理树形数据
            changeTree(data){
               data.map( item => {
                    item.title = item.dictName
                   // item.expand = true
                   if(item.children && item.children.length > 0){
                       this.changeTree(item.children)
                   }
               })
            },

            //点击树形数据
            clickTree(data){
               if (data[0].parentId != 0){
                   this.oneTreeList = data[0]
               }
            },

            //新增
            add(){

            }

        }
    }
</script>

<style scoped>
  .demo-split{
    height: 100%;
    border: 1px solid #dcdee2;
    /*overflow: hidden;*/
  }
  .demo-split-pane{
    padding: 10px;
  }
</style>

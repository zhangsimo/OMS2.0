<template>
    <div class="pb20">
      <div class="db pb10 pl10 pr10">
        <Button class="mr10 w90" @click="Save"><span class="center"><Icon custom="iconfont iconbaocunicon icons"/>保存</span></Button>
        <Button class="mr10 w90" @click="handleSelectAll(false)"><span class="center"><Icon custom="iconfont iconshanchuicon icons" />取消</span></Button>
      </div>
      <div class="pl10 pr10 tableBox">
        <Table
          ref="selection"
          border
          highlight-row
          size="small"
          :loading="loading"
          :stripe="true"
          :columns="columns"
          :data="tbdata"
          @on-selection-change="selctionTopRight"
        ></Table>
      </div>
    </div>
</template>

<script>
  import {findByOrgid} from '../../../../../api/system/systemSetting/Initialization'
    export default {
        name: "attention",
      data(){
          return {
            selectionArr:null,
              loading: false,
              tbdata:[],
              columns: [
                {
                  title: "序号",
                  align: "center",
                  type: "index",
                  Width: 60
                },
                {
                  title: "配件品牌信息",
                  align: "center",
                  children: [
                    {
                      type:'selection',
                      align: 'center',
                      minWidth: 80
                    },
                    {
                      title: "编码",
                      align: "center",
                      key: "name",
                      minWidth: 100
                    },
                    {
                      title: "名称",
                      align: "center",
                      key: "code",
                      minWidth: 100
                    },
                    {
                      title: "代码",
                      align: "center",
                      key: "oldId",
                      minWidth: 100
                    },
                    {
                      title: "生产产家",
                      align: "center",
                      key: "manufacture",
                      minWidth: 100
                    },
                    {
                      title: "备注",
                      align: "center",
                      key: "remark",
                      minWidth: 100
                    },
                    {
                      title: "是否禁用",
                      align: "center",
                      key: "disabled",
                      minWidth: 100
                    }
                  ]
                }
              ]
          }
      },
      methods:{
          //表格选择某行的事件
        selctionTopRight(a){
         this.selectionArr = a
          console.log(a)
          this.selectionArr.map(item => {
              item.parentId = item.id
              delete item.id
          })
          // console.log(this.selectionArr)
        },
        // 初始化内容
        getList(){
          let data = {}
          findByOrgid(data).then(res => {
            this.tbdata = res.data
          })
        },
        //保存
        Save(){
          if(this.selectionArr === null){
            this.$Message.warning('请选择要加入的内容')
          }else{
            this.$emit('childrenMsg',this.selectionArr)
          }
        },
        //取消全选
        handleSelectAll(status){
          this.$refs.selection.selectAll(status);
        }
      },
      mounted(){
          this.getList()
      }
    }
</script>

<style scoped>
  .center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icons {
    padding-right: 5px;
    font-size: 12px!important;
  }
  .tableBox{
    height: 550px;
    overflow-y: auto;
  }
</style>

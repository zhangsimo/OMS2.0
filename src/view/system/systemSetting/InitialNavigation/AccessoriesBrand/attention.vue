<template>
    <div class="pb20">
      <div class="db pb10 pl10 pr10">
        <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbaocunicon icons"/>保存</span></Button>
        <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconshanchuicon icons" />取消</span></Button>
      </div>
      <div class="pl10 pr10">
        <Table
          border
          highlight-row
          size="small"
          :loading="loading"
          :stripe="true"
          :columns="columns"
          :data="tbdata"
          @on-row-click="selctionTopRight"
        ></Table>
      </div>
    </div>
</template>

<script>
    export default {
        name: "attention",
      data(){
          return {
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
                      key: "",
                      minWidth: 100
                    },
                    {
                      title: "名称",
                      align: "center",
                      key: "",
                      minWidth: 100
                    },
                    {
                      title: "代码",
                      align: "center",
                      key: "",
                      minWidth: 100
                    },
                    {
                      title: "生产产家",
                      align: "center",
                      key: "",
                      minWidth: 100
                    },
                    {
                      title: "备注",
                      align: "center",
                      key: "",
                      minWidth: 100
                    },
                    {
                      title: "是否禁用",
                      align: "center",
                      key: "",
                      minWidth: 100
                    }
                  ]
                }
              ]
          }
      },
      methods:{
          //表格点击某行的事件
        selctionTopRight(){

        }
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
</style>

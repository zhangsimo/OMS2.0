<template>
      <div class="boxbox">
        <div class="top">
          <Split v-model="split">
            <div slot="left" class="demo-split-pane">
              <div class="db btn-title">
                <p class="mr10">云配件品质：</p>
                <Button class="mr10 w90"><span class="center"><Icon type="md-add" />新增品质</span></Button>
                <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改品质</span></Button>
                <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用品质</span></Button>
                <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用品质</span></Button>
              </div>
              <div class="con-box">
                <Table
                  border
                  highlight-row
                  size="small"
                  :loading="topLeft.loading"
                  :stripe="true"
                  :columns="topLeft.columns"
                  :data="topLeft.tbdata"
                  @on-row-click="selctionTopLeft"
                ></Table>
              </div>
            </div>
            <div slot="right" class="demo-split-pane">
              <div class="db btn-title">
                <p class="mr10">云配件品牌：</p>
                <Button class="mr10 w90"><span class="center"><Icon type="md-add" />新增品牌</span></Button>
                <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改品牌</span></Button>
                <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用品质</span></Button>
                <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用品质</span></Button>
                <Button class="mr10 w145"><span class="center"><Icon custom="iconfont iconxuanzetichengchengyuanicon icons" />上传配件品牌图片</span></Button>
              </div>
              <div class="con-box">
                <Table
                  border
                  highlight-row
                  size="small"
                  :loading="topRight.loading"
                  :stripe="true"
                  :columns="topRight.columns"
                  :data="topRight.tbdata"
                  @on-row-click="selctionTopRight"
                ></Table>
              </div>
            </div>
          </Split>
        </div>
        <div class="bottom">
          <div class="db btn-title">
            <p class="mr10">本地关注品牌：</p>
            <Button class="mr10 w120"><span class="center"><Icon type="md-add" />新增关注品牌</span></Button>
            <Button class="mr10 w120"><span class="center"><Icon custom="iconfont iconshanchuicon icons" />取消关注品牌</span></Button>
            <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
          </div>
          <div class="con-box">
            <Table
              border
              highlight-row
              size="small"
              :loading="Bottom.loading"
              :stripe="true"
              :columns="Bottom.columns"
              :data="Bottom.tbdata"
              @on-row-click="selctionBottom"
            ></Table>
          </div>
        </div>
      </div>
</template>

<script>
    export default {
        name: "AccessoriesBrand",
      data(){
          return {
            split: 0.4,
            topLeft:{
              loading: false,
              tbdata:[],
              columns: [
                {
                  title: "序号",
                  align: "center",
                  type: "index",
                  Width: 80
                },
                {
                  title: "配件品质信息",
                  align: "center",
                  children: [
                    {
                      title: "编码",
                      align: "center",
                      key: "",
                      minWidth: 120
                    },
                    {
                      title: "名称",
                      align: "center",
                      key: "",
                      minWidth: 120
                    },
                    {
                      title: "是否禁用",
                      align: "center",
                      key: "code",
                      minWidth: 120
                    }
                  ]
                }
              ],
            },
            topRight: {
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
                      title: "图片",
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
              ],
            },
            Bottom: {
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
                      type: "selection",
                      align: "center",
                      Width: 60
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
              ],
            }
          }
      },
      methods:{
          //品质表格的每行点击事件
        selctionTopLeft(a){},
          //品牌表格的每行点击事件
        selctionTopRight(a){},
        //关注品牌的每行点击事件
        selctionBottom(a){}
      }
    }
</script>


<style>
  @import url("../../../basicData/priceManage/index.less");
</style>
<style scoped>
.boxbox{
  height: 750px;
  background: #ffffff;
}
  .top,.bottom{
    width: 100%;
    height: 50%;
  }
  .top{
    border-bottom: 1px solid lightgray;
  }
  /*.demo-split-pane{*/
    /*padding: 5px;*/
  /*}*/
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

<template>
      <div class="boxbox">
        <div class="top">
          <Split v-model="split">
            <div slot="left" class="demo-split-pane">
              <div class="db btn-title">
                <p class="mr10" style="font-weight: bold">云配件品质：</p>
                <!--<Button class="mr10 w90"><span class="center"><Icon type="md-add" />新增品质</span></Button>-->
                <!--<Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改品质</span></Button>-->
                <!--<Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用品质</span></Button>-->
                <!--<Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用品质</span></Button>-->
              </div>
              <div class="pl10 pr10 Tablebox">
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
                <p class="mr10" style="font-weight: bold">云配件品牌：</p>
                <!--<Button class="mr10 w90"><span class="center"><Icon type="md-add" />新增品牌</span></Button>-->
                <!--<Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改品牌</span></Button>-->
                <!--<Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用品质</span></Button>-->
                <!--<Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用品质</span></Button>-->
                <!--<Button class="mr10 w145"><span class="center"><Icon custom="iconfont iconxuanzetichengchengyuanicon icons" />上传配件品牌图片</span></Button>-->
              </div>
              <div class="pl10 pr10 Tablebox">
                <Table
                  border
                  highlight-row
                  size="small"
                  :loading="topRight.loading"
                  :stripe="true"
                  :columns="topRight.columns"
                  :data="topRight.tbdata"
                  @on-row-click="selctionBottom"
                ></Table>
              </div>
            </div>
          </Split>
        </div>
        <div class="bottom pt10">
          <div class="db btn-title">
            <p class="mr10" style="font-weight: bold">本地关注品牌：</p>
            <Button class="mr10 w120" @click="AddAttention"><span class="center"><Icon type="md-add" />新增关注品牌</span></Button>
            <Button class="mr10 w120" @click="cancel"><span class="center"><Icon custom="iconfont iconshanchuicon icons" />取消关注品牌</span></Button>
            <Button class="mr10 w90" @click="Save"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
          </div>
          <div class="pl10 pr10 Tablebox">
            <Table
              border
              highlight-row
              size="small"
              :loading="Bottom.loading"
              :stripe="true"
              :columns="Bottom.columns"
              :data="Bottom.tbdata"
              @on-selection-change="selctionTopBottom"
            ></Table>
          </div>
        </div>

        <Modal v-model="modal" title="新增关注品牌" :footer-hide="true" width="1020" @on-cancel="closedTap" >
          <Atten-tion @childrenMsg="getMsg" ref="FatherMsg"></Atten-tion>
        </Modal>
      </div>
</template>

<script>
  import {findAllByTree,partBrandOrg,partBrandFindAllByTree,partBrandOrgSaveOrUpdate,partBrandOrgDeleteAll} from '../../../../../api/system/systemSetting/Initialization'
  import AttenTion from './attention'
    export default {
        name: "AccessoriesBrand",
      components: {
        AttenTion
      },
      data(){
          return {
            checkBox: [],
            getArr:[], //定义一个获取子组件数组
            split: 0.4,
            modal:false, //添加关注弹框
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
                      key: "code",
                      minWidth: 120
                    },
                    {
                      title: "名称",
                      align: "center",
                      key: "name",
                      minWidth: 120
                    },
                    {
                      title: "是否禁用",
                      align: "center",
                      key: "disabled",
                      minWidth: 120
                    }
                  ]
                }
              ]
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
                      key: "code",
                      minWidth: 100
                    },
                    {
                      title: "名称",
                      align: "center",
                      key: "name",
                      minWidth: 100
                    },
                    {
                      title: "代码",
                      align: "center",
                      key: "oldId",
                      minWidth: 100
                    },
                    {
                      title: "图片",
                      align: "center",
                      key: "imageUrl",
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
              ],
              newArr:[] //表格新数组，用于赋值
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
                      key: "code",
                      minWidth: 100
                    },
                    {
                      title: "名称",
                      align: "center",
                      key: "name",
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
              ],
            }
          }
      },
      methods:{
          //品质表格的每行点击事件
        selctionTopLeft(a){
          this.topRight.tbdata = a.children
          // console.log(this.topRight.tbdata)
        },
          //品牌表格的每行点击事件
        selctionTopRight(a){},
        //关注品牌的每行点击事件
        selctionBottom(a){
          console.log(a)
        },
        //modal的关闭按钮事件
        closedTap(){
          this.$refs.FatherMsg.handleSelectAll(false)
        },
        //点击添加关注按钮
        AddAttention(){
          this.modal = true
        },
        //初始化上半部分
        getListTop(){
          let data = {}
          // data.id = this.id
          findAllByTree(data).then(res => {
              this.topLeft.tbdata = res.data || []
          })
        },
        //初始化下半部分
        getListBottom(){
          let data = {}
          partBrandOrg(data).then(res => {
            this.Bottom.tbdata = res.data
          })
        },
        // 子组件的数组
        getMsg(a){
          this.getArr = a
          this.Bottom.tbdata = [...this.Bottom.tbdata,...this.getArr]
          this.Bottom.tbdata = this.unique(this.Bottom.tbdata)
        },
        //保存关注品牌
        Save(){
          let data = this.Bottom.tbdata
          partBrandOrgSaveOrUpdate(data).then(res => {
            this.getListBottom()
          })
        },
        // 取消关注品牌
        cancel(){
          let data = this.checkBox
          partBrandOrgDeleteAll(data).then(res => {
              this.getListBottom()
          })
        },
        //关注品牌的多选框
        selctionTopBottom(a){
          this.checkBox = a
          console.log(a)
        },
        //去重方法
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
          const res = new Map();  //定义常量 res,值为一个Map对象实例
          //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1112
          return arr.filter((arr) => !res.has(arr.parentId) && res.set(arr.parentId, 1112))
        }
    },
      mounted(){
        this.getListTop()
        this.getListBottom()
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
  .Tablebox{
    height: 320px;
    overflow-y: auto;
  }
</style>

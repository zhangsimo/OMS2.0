<template>
<div class="commodbigbox">
  <div class="oper-top">
    <span class="mr10">查询项：</span>
    <Select v-model="searchType" class="w100 mr10">
      <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Input  class="mr10" v-model="query" style="width: 150px" />
    <span class="mr10">品牌:</span>
    <Select v-model="band" style="width:140px" class="mr20">
      <Option v-for="item in bands" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button type="warning" class="mr20" @click="queryTight"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
    <Button type="warning" class="mr20" @click="addNew">新增紧俏品</Button>
<!--    <Button type="default" class="mr10 w90"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>-->
    <Button type="default"  class="mr10 w90" @click="deleteTight"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>
    <Upload
      ref="upload"
      style="display: inline-block"
      :show-upload-list="false"
      :action="upurl"
      :headers="headers"
      :format="['xlsx','xls']"
      :on-format-error="onFormatError"
      :on-success="onSuccess"
      :before-upload ='beforeUpload'
    >
      <Button type="default" class="mr10"  > <Icon custom="iconfont icondaoruicon icons" /> 批量导入紧俏品</Button>
    </Upload>
    <Button class="mr10" @click="downTemplate">
      <span class="center"><Icon custom="iconfont iconxiazaiicon icons" />下载模板</span>
    </Button>
  </div>
  <div class="tableCenter">
    <Table stripe :columns="columns" :data="List" size="small"  :loading="Loading" border @on-selection-change="picthTight"></Table>
    <Page class="mr10" :total="page.total"
          :page-size="page.size"
          :current="page.num"
          show-sizer
          show-total
          class-name="page-con"
          @on-change="selectNum"
          @on-page-size-change="selectPage"
    ></Page>
  </div>

<!--  新增紧俏品-->
  <Modal v-model="addCommodShow" title="新增紧俏品" width="1000">
    <Fittings @getNewList="getListAget" @setShow="closeCommodShow"></Fittings>
    <div slot='footer'>
    </div>
  </Modal>


</div>
</template>

<script>
  import {getTightProductList , getDeleteTight, getup,down} from  '@/api/system/essentialData/commoditiesInShortSupply.js'
  import * as api from "_api/system/partManager";
  import Fittings from './Fittings/Fittings.vue'
  import Cookies from 'js-cookie'
  import { TOKEN_KEY } from '@/libs/util'


  export default {
        name: "commoditiesInShortSupply",
      components:{
          Fittings,
      },
        data(){
            return {
                headers:  {
                    Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
                },
                columns:[
                    {
                     key:'',
                        type: 'selection',
                     align:'center',
                    },
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '配件内编码',
                        align: 'center',
                        key: 'code',
                    },
                    {
                        title: '编码',
                        align: 'center',
                        key: 'partCode',
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'partStandardName',
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'partBrand',
                    },
                    {
                        title: '品质',
                        align: 'center',
                        key: 'quality',
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'applyCarModel',
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'minUnit',
                    },
                    {
                        title: '规格',
                        align: 'center',
                        key: 'specifications',
                    },
                    {
                        title: '可售数量',
                        align: 'center',
                        key: 'num',
                    },
                    {
                        title: '库存数量',
                        align: 'center',
                        key: 'num',
                    },
                    {
                        title: '在途数量',
                        align: 'center',
                        key: 'num',
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: 'createTime',
                    },
                    {
                        title: '过期日期',
                        align: 'center',
                        key: 'pastTime',
                    },
                    {
                        title: '创建人',
                        align: 'center',
                        key: 'createUname',
                    },

                ],
                page:{
                    num:1,
                    page:10,
                    total:0
                },
                Loading: false,
                typeList:[
                    {
                        value: "0",
                        label: "编码"
                    },
                    {
                        value: "1",
                        label: "名称"
                    },
                    {
                        value: "2",
                        label: "车型"
                    },
                    {
                        value: "3",
                        label: "拼音"
                    }
                ],
                List:[
                    {name:'zs',
                        value:18},
                    {name:'zs',
                        value:18},
                    {name:'zs',
                        value:18},
                ],
                searchType:'',
                upurl:getup,//批量导入地址
                addCommodShow:false,
                allAddCommodShow:false,
                query:'',//搜索
                band:'' ,//品牌
                bands:[
                    {value: "0",label: "全部"}
                ],
                pitchOn:[]
            }
        },
        mounted(){
            this.getList()
            this.getBand()
        },
        methods:{
            //获取全部紧俏品
          async  getList(){
              let data = {}
              this.Loading = true
              data.size = this.page.page
              data.page = this.page.num -1
              if (this.band != "0") {
                  data.partBrandId = this.band;
              }
              switch (this.searchType) {
                  case "0":
                      data.queryCode = this.query;
                      break;
                  case "1":
                      data.fullName = this.query;
                      break;
                  case "2":
                      data.applyCarModel = this.query;
                      break;
                  case "3":
                      data.namePy = this.query;
                      break;
                  default:
                      break;
              }
              let res  = await getTightProductList(data)
              if(res.code == 0){
                  let arr = res.data.content
               arr =  arr.map( item => {
                     item.codeId = item.id
                  return    item = {...item,...item.attributeVO}
                  })
                  this.List = arr
                  this.page.total = res.data.totalElements
                  this.Loading = false
              }
            },
            //获取品牌
            async getBand() {
                let res = await api.getPartBrand();
                if (res.code == 0) {
                    res.data.forEach( el  => {
                        if (el.parentId != '0') {
                            el.label = el.name;
                            el.value = el.id;
                            this.bands.push(el);
                        }
                    })
                }
            },
            //搜索
            queryTight(){
                this.getList()
            },
            //选中紧俏品
            picthTight(selection){
              this.pitchOn = selection
                console.log(selection)
            },
            //删除
            deleteTight(){
              if (this.pitchOn.length < 1){
                  this.$message.error('至少选择一条信息')
                  return false
              }
              let data = []
                this.pitchOn.forEach( item => {
                    data.push(item.codeId)
                })
                getDeleteTight(data).then( res => {
                  if(res.code == 0){
                      this.getList()
                  }
                })
            },
            //分页
            selectNum(data){
              this.page.num = data
                this.getList()
            },
            //切换条数
            selectPage(data){
              this.page.num = 1
                this.page.page = data
                this.getList()
            },
            //新增紧俏品
            addNew(){
                this.addCommodShow = true
            },
            //新增刷新
            getListAget(){
                this.getList()
                this.addCommodShow = false
            },
            // 关闭新增
            closeCommodShow(){
                this.addCommodShow = false
            },
            //批量上传失败
            onFormatError(file) {
                // console.log(file)
                this.$Message.error('只支持xls xlsx后缀的文件')
            },
            // 上传成功函数
            onSuccess (response) {
              if(response.code != 0 ){
                  this.$Message.success(response.message)
              }else {
                  this.$Message.success(response.message)
              }
            },
            //上传之前清空
            beforeUpload(){
              this.$refs.upload.clearFiles()
            },
            //下载文档
            downTemplate(){
                down('1100000000')
            }
        }
    }
</script>

<style scoped lang="less">
.commodbigbox {
  background-color: #fff;
  height: 100%;
  width: 100%;
  .oper-top {
    line-height: 57px;
    padding-left: 10px;
    border-bottom: 1px solid #eee;
  }
  .tableCenter{
    padding: 10px;
  }
}
</style>

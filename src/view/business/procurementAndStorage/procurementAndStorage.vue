<template>
  <div style="height:100%" class="bigBox">
    <div class="headerBox">
      <span class="mr10">快速查询:</span>
      <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
      <Select v-model="orderType" style="width:100px" class="mr10">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Button type="default"   @click="openQueryModal" class="mr10"><Icon type="ios-more" />更多</Button>
      <Button type="default" class="mr10 w90"><Icon type="md-add" size="14" /> 新增</Button>
      <Button class="mr10 w90" ><span class="center"><Icon custom="iconfont iconbaocunicon icons"/>保存</span></Button>
      <Button class="mr10"><i class="iconfont mr5 iconxuanzetichengchengyuanicon"></i>出库</Button>
      <Button class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>
      <Button class="mr10"><Icon type="md-close" size="14" /> 作废</Button>
    </div>
    <div class="conter">
      <div class="demo-split">
        <Split v-model="split1">
<!--          左侧表格-->
          <div slot="left" class="demo-split-pane">
            <div>
              <div class="orderList">
                <h5>销售出库列表</h5>
              </div>
              <div class="orderCenter">
                <vxe-table
                  border
                  align="center"
                  size="mini"
                  @current-change="clickOnesList"
                  highlight-hover-row
                  highlight-current-row
                  style="width: 1000px"
                  height="593"
                  :data="tableData">
                  <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                  <vxe-table-column field="billStatusId" title="状态">
                    <template v-slot="{ row }">
                      <span>{{row.billStatusId.name}}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="xx" title="客户"></vxe-table-column>
                  <vxe-table-column field="xx" title="销售员"></vxe-table-column>
                  <vxe-table-column field="xx" title="出库单号"></vxe-table-column>
                  <vxe-table-column field="xx" title="创建日期"></vxe-table-column>

                  <vxe-table-column field="xx" title="创建人"></vxe-table-column>
                  <vxe-table-column field="xx" title="打印次数"></vxe-table-column>
                  <vxe-table-column field="xx" title="出库日期"></vxe-table-column>
                  <vxe-table-column field="xx" title="出库人"></vxe-table-column>
                </vxe-table>
              </div>
              <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
                    @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
            </div>
          </div>
          <div slot="right" class="demo-split-pane">
            <market-right ref="right"></market-right>
          </div>
        </Split>
      </div>
      <!--        更多搜索-->
      <More-query ref="morequeryModal"></More-query>
      <!--        打印-->
      <!--      <Print-show ref="printBox"></Print-show>-->
    </div>
  </div>
</template>

<script>
    import QuickDate from '../../../components/getDate/dateget' //日期查询
    import MoreQuery from './moreQuery'  // 更多窗口
    import MarketRight from "./marketRight";
    import {getLeftList} from '@/api/business/procurementAndStorage'
    export default {
        name: "market",
        components:{
            QuickDate,
            MoreQuery,
            MarketRight
        },
        data(){
            return {
                advanced: false, //更多模块的弹框
                orderType:6,
                typeList:[
                    {value:6,name:'全部'},
                    {value:0,name:'草稿'},
                    {value:1,name:'已提交'},
                    {value:2,name:'待拣货'},
                    {value:3,name:'待出库'},
                    {value:4,name:'已出库'},
                    {value:5,name:'已作废'},
                ],
                split1: 0.2,
                queryTime:'',//快速查询时间
                page:{
                    total:0,
                    size:10,
                    num:1
                }, //左侧分页
                tableData:[] //左侧数组

            }
        },
        methods:{
            //获取日期
            getDataQuick(v){
                // console.log(v)
            },
            //获取时间
            getvalue(date){
                this.queryTime = date
            },
            //打印表格
            printTable(){
                // this.$refs.printBox.openModal()
            },
            // 打开更多搜索
            openQueryModal(){
                this.$refs.morequeryModal.openModal()
            },

            //左侧数据
          // 左侧表格数据
          async  getLeftLists(){
              let data ={}
               let res = await getLeftList( data )
              if(res.code === 0) {
                  console.log(res, 777)
              }
            },
            //切换页面
            selectNum(){},
            //切换页数
            selectPage(){},
            //点击获取当前信息
            clickOnesList(data){

            }
        }
    }
</script>

<style scoped lang="less">
  .headerBox {
    border-bottom: 1px #e0e0e0 solid;
    padding-left: 10px;
    padding-bottom: 16px;
    padding-top: 16px;
  }
  .demo-split{
    height: 100%;
    border: 1px solid #dcdee2;
  }

  .conter{
    height: 100%;
    width: 100%;
    padding: 10px;
  }
  .bigBox {
    background-color: #fff;
  }
  .demo-split[data-v-4dd5fe70]{
    height: 93%;
  }
  .orderList {
    line-height: 30px;
    padding-left: 10px;
    /*border-bottom: 1px solid #dcdee2;*/
    background-color: #f8f8f8;

  }
  .orderCenter{
    overflow: hidden;
    overflow-x: scroll;
  }
</style>

<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml15">
            <span>期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200" @on-change="dateChange"></Date-picker>
          </div>
          <div class="db ml15">
            <span>区域：</span>
            <Select  v-model="model1" filterable class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select  v-model="model1" filterable class="w150">
              <Option
                v-for="item in Branchstore"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>账户：</span>
            <input type="text" class="h30" v-model="fno">
          </div>
          <div class="db ml15">
            <span>开户行：</span>
            <input type="text" class="h30" v-model="fno">
          </div>

        </div>
      </div>
      <div class="oper-top flex">
        <div class="db">
          <span>对应科目：</span>
          <Select  v-model="model1" filterable class="w150">
            <Option
              v-for="item in Branchstore"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="db ml15">
          <button class="mr10 ivu-btn ivu-btn-default" type="button">
            <i class="iconfont iconchaxunicon"></i>
            <span>查询</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="importXSL">
            <span>导入日记账</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="dele">
            <span>删除导入</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="intellect">
            <span>智能匹配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="artificialChange">
            <span>人工分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button">
            <span>撤销分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button">
            <span>资金认领核销</span>
          </button>
        </div>
      </div>
    </section>

<!-- 导入模板弹窗组件-->
    <importXLS :URL="impirtUrl" ref="imp"></importXLS>

<!--    人工智能分配-->
    <artificial ref="art"></artificial>

    <section class="title-box" style="border-bottom: 1px rgba(204, 204, 204, 1) solid ;border-top: 1px rgba(204, 204, 204, 1) solid">
      <div style="width: 100%;height: 30px;background-color: rgba(215, 235, 249, 1);border-bottom: 1px rgba(204, 204, 204, 1) solid ;margin-bottom: 15px"></div>
      <Form ref="formInline" :model="formInline"  :label-width="100" label-position="right">
        <Row>
          <Col span="6">
            <FormItem label="昨日余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本日收款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本日付款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本日余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="本期期初余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本期累计收款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本期累计付款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本期期末余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
    <div class="mt15">
      <Tabs type="card" value="capitalChain1">
        <TabPane label="标签一" name="capitalChain1">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-current-row
              highlight-hover-row
              stripe
              ref="xTable"
              align="center"
              height="500"
              @current-change="getOneList"
              size="mini"
              style="width: 3000px"
              :data="tableData"
              >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="name" title="导入时间" ></vxe-table-column>
              <vxe-table-column field="age" title="所属区域" ></vxe-table-column>
              <vxe-table-column field="date" title="所属门店" ></vxe-table-column>
              <vxe-table-column field="address" title="所属店号"></vxe-table-column>
              <vxe-table-column field="address" title="账户"></vxe-table-column>
              <vxe-table-column field="address" title="账号"></vxe-table-column>
              <vxe-table-column field="address" title="开户行"></vxe-table-column>
              <vxe-table-column field="address" title="对应科目"></vxe-table-column>
              <vxe-table-column field="address" title="发生日期"></vxe-table-column>
              <vxe-table-column field="address" title="收入金额"></vxe-table-column>
              <vxe-table-column field="address" title="支出金额"></vxe-table-column>
              <vxe-table-column field="address" title="余额"></vxe-table-column>
              <vxe-table-column field="address" title="对方户名"></vxe-table-column>
              <vxe-table-column field="address" title="对账账号"></vxe-table-column>
              <vxe-table-column field="address" title="对方开户行"></vxe-table-column>
              <vxe-table-column field="address" title="交易备注"></vxe-table-column>
              <vxe-table-column field="address" title="业务类别"></vxe-table-column>
              <vxe-table-column field="address" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="address" title="认领店号"></vxe-table-column>
              <vxe-table-column field="address" title="认领门店"></vxe-table-column>
              <vxe-table-column field="address" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="address" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="address" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="address" title="往来单位"></vxe-table-column>
              <vxe-table-column field="address" title="认领备注"></vxe-table-column>
              <vxe-table-column field="address" title="是否认领"></vxe-table-column>
              <vxe-table-column field="address" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="address" title="审核时间"></vxe-table-column>
              <vxe-table-column field="address" title="凭证字"></vxe-table-column>
              <vxe-table-column field="address" title="凭证号"></vxe-table-column>
            </vxe-table>
        </div>
        </TabPane>
        <TabPane label="标签二" name="capitalChain2">标签二的内容</TabPane>
        <TabPane label="标签三" name="capitalChain3">标签三的内容</TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {creat} from '../../components'
  import importXLS from '../../components/importXLS'
  import artificial from '../../components/artificial'
  import moment from 'moment'
  export default {
    components: {
      quickDate,
      importXLS,
      artificial
    },
    data() {
      return {
        fno:'',//调拨单号
        value: [],
        Branchstore: [],
        model1: "",
        data: [],
        company: "", //往来单位
        companyId: "", //往来单位id
        formInline:{},//统计数据
        tableData:[],//全部数据
        impirtUrl:{
          downId: '1200000000',
          upUrl:'123'
        },//下载上传路径
        oneList:{},//点击获取到的信息
      };
    },
    async mounted () {
      let arr = await creat (this.$refs.quickDate.val,this.$store)
      this.value = arr[0];
      this.model1 = arr[1];
    },
    methods: {
      // 日期选择
      dateChange(data){
        this.value = data
      },
      // 快速查询
      quickDate(data){
        this.value = data
      },
      //点击获取表格数据
      getOneList(val){
        this.oneList = val.row
        console.log(val ,789)
      },

      //打开导入模板下载
      importXSL(){
        this.$refs.imp.openModal()
      },

      //删除导入
      dele(){
        if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否删除该条数据</p>',
          onOk: () => {

          },
          onCancel: () => {
          }
        });
      },

      //智能匹配
      intellect(){
        this.$Modal.success({
          title: '提示',
          content: '删除X条成功'
        });
      },

      //人工匹配
      artificialChange(){
        if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        this.$refs.art.openModal()

      }

    }
  };
</script>

<style lang="less" scoped>
  .oper-top input {
    border: 1px solid #dddddd;
    text-indent: 4px;
  }
  .oper-top .input {
    position: relative;
    left: -26px;
    bottom: -5px;
  }
  .pro span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .inner-box {
    overflow-x: scroll;
  }

</style>

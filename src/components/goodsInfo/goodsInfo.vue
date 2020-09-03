<template>
  <div class="goodsInfo">
    <div class="header">
      <!-- 查询收货信息上 -->
      <Form ref="formOne" :model="formDateTop"  inline>
        <FormItem>
          <Input type="text" v-model="formDateTop.receiveCompName" placeholder="收货单位"/>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="formDateTop.streetAddress" placeholder="收货地址"/>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="formDateTop.receiveMan" placeholder="收货人"/>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="formDateTop.receiveManTel" placeholder="联系电话"/>
        </FormItem>
        <Button type="primary" @click="searchInfo">查询</Button>
        <Button type="primary" @click="saveInfo">保存</Button>
        <Button>取消</Button>
      </Form>
    </div>
    <div class="main clearfix">
      <!-- 表格 收货信息 左 -->
      <div class="fl mr10" :style="{width: '320px'}">
        <div class="bgc p5">收货信息</div>
        <vxe-table
          border
          resizable
          size="mini"
          height="400"
          :data="tableData"
          @radio-change="echoDate"
          :radio-config="{highlight: true}"
        >
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <!-- <vxe-table-column field="name" title="客户" width="100"></vxe-table-column> -->
          <vxe-table-column field="receiveCompName" title="收货单位" width="100"></vxe-table-column>
          <vxe-table-column field="address" title="收货地址" width="100"></vxe-table-column>
          <vxe-table-column field="receiveMan" title="收货人" width="100"></vxe-table-column>
          <vxe-table-column field="receiveManTel" title="联系电话" width="100"></vxe-table-column>
        </vxe-table>
      </div>
      <!-- 收货信息 右 -->
      <div>
        <div class="bgc p5  mb15">收货信息</div>
      <div class="sForm">
        <Form
          inline
          :model="formDateRight"
          :show-message="false"
          ref="formTwo"
          :label-width="100"
        >
          <FormItem label="收货单位：">
            <Input v-model="formDateRight.receiveComp" class="w200"/>
          </FormItem>
          <FormItem label="收货地址：">
            <Input v-model="formDateRight.receiveAddress" class="w200"/>
          </FormItem>
          <FormItem label="收货人：">
            <Input v-model="formDateRight.receiver" class="w200"/>
          </FormItem>
          <FormItem label="联系电话：">
            <Input v-model="formDateRight.receiverMobile" class="w200"/>
          </FormItem>
          <!-- 发货信息 右-->
          <div class="bgc p5 mb15 mt15">发货信息</div>
          <FormItem label="配送方式：">
            <Select v-model="formDateRight.deliveryType" class="w200">
              <Option  value="1" >自配</Option>
              <Option  value="2" >客户自提</Option>
              <Option  value="3" >快递</Option>
              <Option  value="4" >物流</Option>
            </Select>
          </FormItem>
          <FormItem label="发货物流：">
            <Select v-model="formDateRight.deliveryLogistics" class="w200">
              <Option @on-change="logCom(item.logisticsComp)" :disabled="item.isDisabled==1" v-show="item.isDisabled!==1" v-for="item in logisArr" :value="item.id" :key="item.id">{{ item.defaultLogistics }}</Option>
            </Select>
          </FormItem>
          <FormItem label="运输费用：">
            <Input v-model="formDateRight.transportCost" class="w200"/>
          </FormItem>
          <FormItem label="结算方式：">
            <Input v-model="formDateRight.settleType" class="w200"/>
          </FormItem>
          <FormItem label="发货备注：">
            <Input v-model="formDateRight.remark" class="w200"/>
          </FormItem>
          <FormItem label="业务单号：">
            <Input v-model="formDateRight.businessNum" class="w200"/>
          </FormItem>
          <FormItem label="关联单号：">
            <Input v-model="formDateRight.relationNum" class="w200"/>
          </FormItem>
        </Form>
      </div>
      </div>

    </div>
    <!-- </Modal> -->
  </div>
</template>

<script>
import { getGoodsInfo,saveGoodsInfo,logistics } from "_api/business/goodsInfos"
export default {
  name: "goodsInfo",
  data() {
    return {
      //表单数据查询 上
      formDateTop: {
        receiveCompName: null,//收货单位
        receiveMan: null,//收货人
        streetAddress: null,//详细收货地址
        receiveManTel: null//联系电话
      },
       //表单数据 右 收货信息与发货信息
      formDateRight: {
        //表单数据 上 查询
        receiveCompName: "",//收货单位
        receiveMan: "",//收货人
        receiveManTel: "",//联系电话
        //收货信息
        receiveComp: "",//收货单位名称
        receiver: "",//收货人
        receiveAddress: "",//收货单位地址
        receiverMobile: "",//联系电话
        //发货信息
        streetAddress: "",//收货详细地址
        deliveryType: "",//配送方式
        transportCost: "",//运输费用
        remark: "",//备注
        relationNum: "",//光联单号
        deliveryLogistics: "",//发货物流
        settleType: "",//结算方式
        businessNum: "",//业务单号

        //其它要带上的数据
          //初始化中的数据
        id: '',//保存带的id
        logisticsId: '',//初始化数据中的id
        guestId: '',
        provinceId: '',
        cityId: '',
        countyId: '',
          //物流中的数据
        logisticsComp: '',//物流公司名字
      },
      //表格 数据
      tableData: [

      ],
      //配送方式字典下拉框
      dictArr: [

      ],
      //发货物流下拉框
      logisArr: [

      ]
    };
  },
  components: {},
  async created() {
    //初始化数据左边表格
    let res = await getGoodsInfo()
    this.tableData = res.data

    //获取物流下拉框
    let log = await logistics()
    this.logisArr = log.data
  },
  mounted() {

  },
  methods: {
    //加上物流公司的名称
    logCom(val) {
      this.formDateRight.logisticsComp = val
    },
    //查询
    async searchInfo() {
        this.formDateTop.receiveCompName= null,//收货单位
        this.formDateTop.receiveMan= null,//收货人
        this.formDateTop.streetAddress= null,//详细收货地址
        this.formDateTop.receiveManTel= null//联系电话
      let res = await getGoodsInfo(this.formDateTop)
    },
    //保存
    async saveInfo() {
      this.saveId(this.tableData)
      let res = await saveGoodsInfo(this.formDateRight)
      if (res.code == 0) {
        this.$Message.success(res.data)
        // this.$refs.formTwo.resetFields()
      }
    },
    echoDate({row}) {
      console.log('dsfsadf')
      console.log(row)
      if (row.logisticsRecordVO) {
        this.formDateRight.receiveComp = row.logisticsRecordVO.receiveComp
        this.formDateRight.receiver = row.logisticsRecordVO.receiver
        this.formDateRight.receiveAddress = row.logisticsRecordVO.receiveAddress
        this.formDateRight.receiverMobile = row.logisticsRecordVO.receiverMobile
      } else {
        this.formDateRight.receiveComp = row.receiveCompName
        this.formDateRight.receiver = row.receiveMan
        this.formDateRight.receiveAddress = row.streetAddress
        this.formDateRight.receiverMobile = row.receiveManTel
      }
      //其它数据
      this.formDateRight.logisticsId = row.id
      this.formDateRight.guestId = row.guestId
      this.formDateRight.provinceId = row.provinceId
      this.formDateRight.cityId = row.cityId
      this.formDateRight.countyId = row.countyId
      this.formDateRight.streetAddress = row.streetAddress
    },
    //传入保存id
    saveId(row) {
      row.forEach(item => {
        if(item.logisticsRecordVO) {
          this.formDateRight.id = item.logisticsRecordVO.id
        }
      })
    }
  },
  computed: {}
};
</script>

<style lang='less' scoped>
.bgc {
  color: #000;
  background-color: #e8e8e8;
}
</style>

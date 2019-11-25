<template>
  <div class="goodsInfo">
    <!-- <Modal v-model="showInfo" title="收货信息" width="1000" > -->
    <div class="header">
      <!-- 查询收货信息上 -->
      <Form ref="formOne" :model="formDateTop"  inline>
        <!-- <FormItem>
            <Input type="text" placeholder="客户名称"></Input>
        </FormItem>-->
        <FormItem>
          <Input type="text" v-model="formDateTop.receiveCompName" placeholder="收货单位"></Input>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="formDateTop.address" placeholder="收货地址"></Input>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="formDateTop.receiveMan" placeholder="收货人"></Input>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="formDateTop.receiveManTel" placeholder="联系电话"></Input>
        </FormItem>
        <Button type="primary mr15" @click="searchInfo">查询</Button>
        <Button type="primary mr15" @click="saveInfo">保存</Button>
        <Button>取消</Button>
      </Form>
    </div>
    <div class="main clearfix">
      <!-- 表格 收货信息 左 -->
      <div class="fl  w300">
        <div class="bgc p5">收货信息</div>
        <vxe-table
          border
          resizable
          size="mini"
          height="400"
          :data="tableData"
          @current-change="echoDate"
          highlight-current-row
          :radio-config="{labelField: '', trigger: 'row'}"
        >
          <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
          <vxe-table-column type="radio" width="60" title="选择"></vxe-table-column>
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
            <Input v-model="formDateRight.receiveComp" class="w200"></Input>
          </FormItem>
          <FormItem label="收货地址：">
            <Input v-model="formDateRight.receiveAddress" class="w200"></Input>
          </FormItem>
          <FormItem label="收货人：">
            <Input v-model="formDateRight.receiver" class="w200"></Input>
          </FormItem>
          <FormItem label="联系电话：">
            <Input v-model="formDateRight.receiverMobile" class="w200"></Input>
          </FormItem>
          <!-- 发货信息 右-->
          <div class="bgc p5 mb15 mt15">发货信息</div>
          <FormItem label="配送方式：">
            <Select class="w200">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
          <FormItem label="发货物流：">
            <Select class="w200">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
          <FormItem label="运输费用：">
            <Input class="w200"></Input>
          </FormItem>
          <FormItem label="结算方式：">
            <Input class="w200"></Input>
          </FormItem>
          <FormItem label="发货备注：">
            <Input class="w200"></Input>
          </FormItem>
          <FormItem label="业务单号：">
            <Input class="w200"></Input>
          </FormItem>
          <FormItem label="失联单号：">
            <Input class="w200"></Input>
          </FormItem>
        </Form>
      </div>
      </div>

    </div>
    <!-- </Modal> -->
  </div>
</template>

<script>
import { getGoodsInfo,saveGoodsInfo,getDic,logistics } from "_api/business/goodsInfos"
export default {
  name: "goodsInfo",
  data() {
    return {
      //表单数据 上
      formDateTop: {
        receiveCompName: "",//收货单位
        receiveMan: "",//收货人
        address: "",//收货地址
        receiveManTel: ""//联系电话
      },
       //表单数据 右 收货信息与发货信息
      formDateRight: {
        //收货信息
        receiveComp: "",//收货单位名称
        receiver: "",//收货人
        receiveAddress: "",//收货单位地址
        receiverMobile: "",//联系电话
        //发货信息
        address: "",//收货详细地址
        deliveryType: "",//配送方式
        transportCost: "",//运输费用
        remark: "",//备注
        relationNum: "",//光联单号
        deliveryLogistics: "",//发货物流
        settleType: "",//结算方式
        businessNum: "",//业务单号
      },
      //表格 数据
      tableData: [

      ]
    };
  },
  components: {},
  activated() {},
  async created() {
    let res = await getGoodsInfo()
    this.tableData = res.data
    console.log(11111111111111)
    //获取字典
    let dic = await getDic()
    console.log(222222222222)
    // console.log(dic)

    //获取物流下拉框
    let tt = await logistics()
    console.log(tt)
  },
  mounted() {

  },
  methods: {
    //查询
    searchInfo() {

    },
    //保存
    saveInfo() {
      saveGoodsInfo(this.formDateRight)
    },
    echoDate({row}) {
      this.formDateRight.receiveComp = row.receiveCompName
      this.formDateRight.receiver = row.receiveMan
      this.formDateRight.receiveAddress = row.address
      this.formDateRight.address = row.address
      this.formDateRight.receiverMobile = row.receiveManTel
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

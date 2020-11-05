<template>
  <div>
    <Modal title="高级查询" width="600px" v-model="moreAndMore">
      <Form @keydown.native.enter="Determined">
        <div class="navbox">
          <Row>
            <Col span="12">
              <span class="w40">创建日期：</span>
              <DatePicker
                type="daterange"
                placeholder="请选择创建日期！"
                @on-change="establish"
                style="width: 180px"
                v-model="create"
                @on-clear="ClearTime"
              ></DatePicker>
            </Col>
            <Col span="12">
              <span class="w40">提交日期：</span>
              <DatePicker
                type="daterange"
                placeholder="请选择提交日期！"
                @on-change="submit"
                style="width: 180px"
                v-model="submita"
                @on-clear="clertSubmit"
              ></DatePicker>
            </Col>
          </Row>
          <Row class="mt15">
            <span class="ml5">供 应 商：</span>
            <Input
              v-model="fullName"
              placeholder="请选择供应商"
              style="width: 410px"
              disabled
            />
            <!-- <Select v-model="callout" filterable style="width: 410px" @on-change="SelectChange">
                <Option v-for="item in ArraySelect" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
              </Select> -->
            <Button class="ml5" size="small" type="default" @click="addSuppler"
              ><i class="iconfont iconxuanzetichengchengyuanicon"></i
            ></Button>
          </Row>
          <Row class="mt15">
            <span>采退单号：</span>
            <Input
              v-model="numbers"
              placeholder="请输入采购单号"
              style="width: 450px"
            />
          </Row>
          <Row class="mt15">
            <span>配件编码：</span>
            <Input
              v-model="coding"
              placeholder="请输入配件编码"
              style="width: 450px"
            />
          </Row>
          <Row class="mt15">
            <span>配件名称：</span>
            <Input
              v-model="Name"
              placeholder="请输入配件名称"
              style="width: 450px"
            />
          </Row>
          <Row class="mt15">
            <span>采购订单：</span>
            <Input
              v-model="purchase"
              placeholder="请输入采购订单"
              style="width: 450px"
            />
          </Row>
          <Row class="mt15">
            <span class="ml5">退 货 员：</span>
            <Input
              v-model="Return"
              placeholder="请输入退货员"
              style="width: 450px"
            />
          </Row>
          <Row class="mt15">
            <span class="ml5">创 建 人：</span>
            <Input
              v-model="Accessories"
              placeholder="请输入创建人"
              style="width: 450px"
            />
          </Row>
          <Row class="mt15">
            <span class="ml5">提 交 人：</span>
            <Input
              v-model="submitter"
              placeholder="请输入提交人"
              style="width: 450px"
            />
          </Row>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="Determined">确定</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>

    <select-supplier
      ref="selectSupplier"
      header-tit="供应商资料"
      @selectSupplierName="getSupplierNamea"
    ></select-supplier>
  </div>
</template>

<script>
import SelectSupplier from "../../../../goods/goodsList/components/supplier/selectSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";

export default {
  name: "More",
  components: {
    SelectSupplier
  },
  data() {
    return {
      ArraySelect: [], //调出方下拉框
      callout: null, //调出方
      numbers: null, //申请单号
      coding: null, //编码
      Accessories: null, //配件人
      Name: null, //配件名称
      createData: null, //创建日期
      submitData: null, //提交日期
      purchase: null, //采购订单
      Return: null, //退货员
      submitter: null, //提交人
      moreAndMore: false,
      submita: "",
      create: "",
      guestId: "",
      Ischeck: false,
      fullName: ""
    };
  },
  methods: {
    //选择创建日期
    establish(date) {
      // console.log(date)
      this.createData = date;
    },
    //选择提交日期
    submit(date) {
      // console.log(date)
      this.submitData = date;
    },
    // 提交日期清空
    clertSubmit() {
      this.submitData = null;
    },
    getSupplierNamea(a) {
      // console.log(a)
      this.callout = a.id;
      this.guestId = a.id;
      this.fullName = a.fullName;
    },
    init() {
      this.moreAndMore = true;
      this.selecQuery();
    },
    sendMsg() {
      let a = {
        callout: this.callout,
        numbers: this.numbers,
        coding: this.coding,
        Accessories: this.Accessories,
        Name: this.Name,
        createData: this.createData,
        submitData: this.submitData,
        guestId: this.guestId,
        purchase: this.purchase,
        Return: this.Return,
        submitter: this.submitter,
        Ischeck: this.Ischeck
      };
      this.$emit("sendMsg", a);
    },
    //供应商下拉查询
    selecQuery() {
      if (this.ArraySelect.length > 0) {
        return;
      }
      let req = {};
      getSupplierList(req).then(res => {
        this.ArraySelect = res.data || [];
      });
    },
    //创建日期是的取消
    ClearTime() {
      this.createData = null;
    },
    //更多弹框的确定按钮
    Determined() {
      this.sendMsg();
      this.moreAndMore = false;
      // (this.callout = null),
      //   (this.numbers = null),
      //   (this.coding = null),
      //   (this.Accessories = null),
      //   (this.Name = null),
      //   (this.createData = null),
      //   (this.submitData = null),
      //   (this.guestId = null),
      //   (this.purchase = null),
      //   (this.Return = null),
      //   (this.submitter = null);
    },
    //供应商弹框
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    // 取消
    cancel() {
      this.moreAndMore = false;
    },
    //供应商下拉框改变
    SelectChange(val) {
      this.guestId = val;
    }
  },
  mounted() {
    // this.selecQuery()
  }
};
</script>
<style scoped>
.navbox {
  padding: 20px;
}
</style>

<template>
  <Modal v-model="showInfo" title="收货信息" width="1000">
    <div class="goodsInfo">
      <div class="header">
        <Form ref="formOne" :model="formDateTop" inline>
          <FormItem>
            <Input
              type="text"
              v-model="formDateTop.receiveCompName"
              placeholder="收货单位"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              v-model="formDateTop.address"
              placeholder="收货地址"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              v-model="formDateTop.receiveMan"
              placeholder="收货人"
            />
          </FormItem>
          <FormItem>
            <Input
              type="text"
              v-model="formDateTop.receiveManTel"
              placeholder="联系电话"
            />
          </FormItem>
          <Button type="primary" class="mr10" @click="searchInfo">查询</Button>
          <Button
            type="primary"
            :disabled="disabled"
            class="mr10"
            @click="saveInfo"
            >保存</Button
          >
          <Button @click="cancel">取消</Button>
        </Form>
      </div>
      <div class="main">
        <!-- 收货信息 左 -->
        <div class="fl  w300">
          <div class="bgc p5">收货信息</div>
          <vxe-table
            border
            resizable
            stripe
            size="mini"
            height="400"
            ref="xTable1"
            :data="tableData"
            :laoding="loading"
            @current-change="echoDate"
            highlight-current-row
            :radio-config="{ trigger: 'row' }"
          >
            <vxe-table-column
              type="index"
              width="60"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column
              type="radio"
              width="60"
              title="选择"
            ></vxe-table-column>
            <!-- <vxe-table-column field="name" title="客户" width="100"></vxe-table-column> -->
            <vxe-table-column
              field="receiveCompName"
              title="收货单位"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="address"
              title="收货地址"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="receiveMan"
              title="收货人"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="receiveManTel"
              title="联系电话"
              width="100"
            ></vxe-table-column>
          </vxe-table>
        </div>
        <!-- 收货信息 右 -->
        <div class="bgc p5  mb15">收货信息</div>
        <div class="sForm">
          <Form
            inline
            :model="formDateRight"
            ref="formTwo"
            :rules="ruleValidate"
            :label-width="100"
          >
            <FormItem label="收货单位：" prop="receiveCompName">
              <Input
                v-model="formDateRight.receiveCompName"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="收货地址：" prop="address">
              <Input
                v-model="formDateRight.address"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="收货人：" prop="receiveMan">
              <Input
                v-model="formDateRight.receiveMan"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="联系电话：" prop="receiveManTel">
              <Input
                v-model="formDateRight.receiveManTel"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <!-- 发货信息 右-->
            <div class="bgc p5 mb15 mt15">发货信息</div>
            <FormItem label="配送方式：">
              <Select
                v-model="formDateRight.deliveryType"
                class="w200"
                :disabled="disabled"
              >
                <Option value="1">自配</Option>
                <Option value="2">客户自提</Option>
                <Option value="3">快递</Option>
                <Option value="4">物流</Option>
              </Select>
            </FormItem>
            <FormItem label="发货物流：">
              <Select
                v-model="formDateRight.deliveryLogistics"
                class="w200"
                :disabled="disabled"
              >
                <Option
                  @on-change="logCom(item.logisticsComp)"
                  v-for="item in logisArr"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.defaultLogistics }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="运输费用：">
              <InputNumber
                :precision="2"
                :min="0"
                v-model="formDateRight.transportCost"
                class="w200"
                :disabled="disabled"
              ></InputNumber>
            </FormItem>
            <FormItem label="结算方式：">
              <Input
                v-model="formDateRight.settleType"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="发货备注：">
              <Input
                v-model="formDateRight.remark"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="业务单号：">
              <Input
                v-model="formDateRight.businessNum"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="关联单号：">
              <Input
                v-model="formDateRight.relationNum"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div slot="footer">
      <!-- <Button class="mr15" type="primary" @click="ok">确定</Button>
      <Button @click="cancel">取消</Button> -->
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";
// @ts-ignore
import * as fapi from "_api/business/goodsInfos";

let checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("手机号不能为空"));
  } else {
    const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};

@Component
export default class GoodsInfo extends Vue {
  private showInfo: boolean = false;

  private disabled: boolean = true;

  @Prop(String) readonly mainId;

  private ruleValidate: ruleValidate = {
    receiveCompName: [
      { required: true, message: "收货单位不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],
    receiveMan: [{ required: true, message: "收货人不能为空", trigger: "blur" }],
    receiveManTel: [
      {
        required: true,
        message: "联系电话错误",
        validator: checkPhone,
        trigger: "blur"
      }
    ]
  };

  private ok() {
    this.cancel();
  }

  private cancel() {
    this.showInfo = false;
  }

  private async init() {
    this.loading = true;
    this.reset();
    this.getLists();
    this.inlogistics();
  }

  private async getLists() {
    this.showInfo = true;
    let res:any = await fapi.getGoodsInfo({ mainId: this.mainId });
    if (res.code == 0) {
      this.tableData = res.data;
      this.loading = false;
    }
  }

  //获取物流下拉框
  private async inlogistics() {
    let log:any = await fapi.logistics();
    if (log.code == 0) {
      this.logisArr = log.data;
    }
  }

  private formDateTop: any = {
    receiveCompName: null, //收货单位
    receiveMan: null, //收货人
    address: null, //详细收货地址
    receiveManTel: null //联系电话
  };

  //表单数据 右 收货信息与发货信息
  private formDateRight: any = {
    //表单数据 上 查询
    receiveCompName: "", //收货单位
    receiveMan: "", //收货人
    receiveManTel: "", //联系电话
    //收货信息
    receiveComp: "", //收货单位名称
    receiver: "", //收货人
    receiveAddress: "", //收货单位地址
    receiverMobile: "", //联系电话
    //发货信息
    address: "", //收货详细地址
    deliveryType: "", //配送方式
    transportCost: 0, //运输费用
    remark: "", //备注
    relationNum: "", //光联单号
    deliveryLogistics: "", //发货物流
    settleType: "", //结算方式
    businessNum: "", //业务单号

    //其它要带上的数据
    //初始化中的数据
    id: "", //保存带的id
    logisticsId: "", //初始化数据中的id
    guestId: "",
    provinceId: "",
    cityId: "",
    countyId: "",
    //物流中的数据
    logisticsComp: "" //物流公司名字
  };
  //表格 数据
  private tableData: Array<any> = new Array();
  private loading: boolean = false;
  //配送方式字典下拉框
  private dictArr: Array<any> = new Array();
  //发货物流下拉框
  private logisArr: Array<any> = new Array();

  //加上物流公司的名称
  private logCom(val) {
    this.formDateRight.logisticsComp = val;
  }
  //查询
  private async searchInfo() {
    let data: any = {};
    data.mainId = this.mainId;
    this.loading = true;
    for (let k in this.formDateTop) {
      const v = this.formDateTop[k];
      if (v) {
        data[k] = v;
      }
    }
    let res = await fapi.getGoodsInfo(data);
    if (res.code == 0) {
      this.tableData = res.data;
      this.loading = false;
    }
  }
  //保存
  private saveInfo() {
    const ref: any = this.$refs["formTwo"];
    ref.validate(async (valid: any) => {
      if (valid) {
        // this.saveId(this.tableData);
        let res = await fapi.saveGoodsInfo({
          ...this.formDateRight,
          mainId: this.mainId
        });
        if (res.code == 0) {
          this.$Message.success("保存成功");
          this.reset();
          // this.getLists();
          this.cancel();
        }
      } else {
        this.$Message.error("请添加配件或完善订单信息后再提交!");
      }
    });
  }
  private echoDate({ row }) {
    let ref:any = this.$refs.formTwo;
    ref.resetFields();
    this.disabled = false;
    if (row.logisticsRecordVO) {
      this.formDateRight.id = row.logisticsRecordVO.id;
      this.formDateRight = { ...row.logisticsRecordVO };
    } else {
      this.formDateRight = { ...row };
      this.formDateRight.id = null;
    }
    this.formDateRight.transportCost =  this.formDateRight.transportCost ? this.formDateRight.transportCost : 0;
    //其它数据
    this.formDateRight.logisticsId = row.id;
    this.formDateRight.guestId = row.guestId;
    this.formDateRight.provinceId = row.provinceId;
    this.formDateRight.cityId = row.cityId;
    this.formDateRight.countyId = row.countyId;
    // console.log(this.formDateRight);
  }
  //传入保存id
  private saveId(row) {
    row.forEach(item => {
      if (item.logisticsRecordVO) {
        this.formDateRight.id = item.logisticsRecordVO.id;
      }
    });
  }

  private reset() {
    this.formDateTop = {
      receiveCompName: null, //收货单位
      receiveMan: null, //收货人
      address: null, //详细收货地址
      receiveManTel: null //联系电话
    };
    const ref: any = this.$refs["formTwo"];
    ref.resetFields();
    const xTable1:any = this.$refs.xTable1;
    xTable1.clearRadioRow();
    this.formDateRight = {
      //表单数据 上 查询
      receiveCompName: "", //收货单位
      receiveMan: "", //收货人
      receiveManTel: "", //联系电话
      //收货信息
      receiveComp: "", //收货单位名称
      receiver: "", //收货人
      receiveAddress: "", //收货单位地址
      receiverMobile: "", //联系电话
      //发货信息
      address: "", //收货详细地址
      deliveryType: "", //配送方式
      transportCost: 0, //运输费用
      remark: "", //备注
      relationNum: "", //光联单号
      deliveryLogistics: "", //发货物流
      settleType: "", //结算方式
      businessNum: "", //业务单号
      //其它要带上的数据
      //初始化中的数据
      id: "", //保存带的id
      logisticsId: "", //初始化数据中的id
      guestId: "",
      provinceId: "",
      cityId: "",
      countyId: "",
      //物流中的数据
      logisticsComp: "" //物流公司名字
    };
  }
}
</script>

<style lang="less" scoped>
.bgc {
  color: #000;
  background-color: #e8e8e8;
}
</style>

<template>
  <Modal v-model="showInfo" title="收货信息" width="1030">
    <div class="goodsInfo">
      <div class="header">
        <Form ref="formOne" :model="formDateTop" inline>
          <FormItem>
            <Input type="text" v-model="formDateTop.receiveCompName" placeholder="收货单位" />
          </FormItem>
          <FormItem>
            <Input type="text" v-model="formDateTop.address" placeholder="收货地址" />
          </FormItem>
          <FormItem>
            <Input type="text" v-model="formDateTop.receiveMan" placeholder="收货人" />
          </FormItem>
          <FormItem>
            <Input type="text" v-model="formDateTop.receiveManTel" placeholder="联系电话" />
          </FormItem>
          <Button type="primary" class="mr10" @click="searchInfo">查询</Button>
          <Button type="primary" :disabled="disabled" class="mr10" @click="saveInfo">保存</Button>
          <Button @click="cancel">取消</Button>
        </Form>
      </div>
      <div class="main">
        <!-- 收货信息 左 -->
        <div class="fl1 fl w300">
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
            <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
            <vxe-table-column type="radio" width="60" title="选择"></vxe-table-column>
            <!-- <vxe-table-column field="name" title="客户" width="100"></vxe-table-column> -->
            <vxe-table-column field="receiveCompName" title="收货单位" width="100"></vxe-table-column>
            <vxe-table-column field="address" title="收货地址" width="100">
              <template v-slot="{row}">
                {{row.address||row.streetAddress}}
              </template>
            </vxe-table-column>
            <vxe-table-column field="receiveMan" title="收货人" width="100"></vxe-table-column>
            <vxe-table-column field="receiveManTel" title="联系电话" width="100"></vxe-table-column>
          </vxe-table>
        </div>
        <!-- 收货信息 右 -->
        <div class="sForm">
          <div class="bgc p5 mb15">收货信息</div>
          <Form
            inline
            :model="formDateRight"
            ref="formTwo"
            :label-width="100"
            :rules="ruleValidate"
          >
            <FormItem label="收货单位：" prop="receiveCompName">
              <Input v-model="formDateRight.receiveCompName" class="w200" :disabled="disabled" />
            </FormItem>
            <FormItem label="收货地址：" prop="address">
              <Input v-model="formDateRight.address" class="w200" :disabled="disabled" />
            </FormItem>
            <FormItem label="收货人：" prop="receiveMan">
              <Input v-model="formDateRight.receiveMan" class="w200" :disabled="disabled" />
            </FormItem>
            <FormItem label="联系电话：" prop="receiveManTel">
              <Input v-model="formDateRight.receiveManTel" class="w200" :disabled="disabled" />
            </FormItem>
            <!-- 发货信息 右-->
            <div class="bgc p5 mb15 mt15">发货信息</div>
            <FormItem label="配送方式：" prop="deliveryType">
              <Select
                v-model="formDateRight.deliveryType"
                class="w200"
                :disabled="disabled"
                @on-change="distribution"
              >
                <Option
                  v-for="item in Delivery"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem
              label="发货物流："
              :class="isRequired ? 'ivu-form-item ivu-form-item-required' : ''"
              prop="deliveryLogistics"
            >
              <Select
                v-model="formDateRight.deliveryLogistics"
                class="w200"
                :disabled="disabled"
                filterable
                @on-change="selectLogis"
              >
                <Option v-for="item in logisArr" :disabled="item.isDisabled==1"
                v-show="item.isDisabled!==1"
                :value="item.id" :key="item.id">{{ item.fullName }}</Option>
              </Select>
              <div class="ivu-form-item-error-tip" v-show="logisRequired">发货物流未选择</div>
            </FormItem>
            <FormItem label="运输费用：">
              <el-input-number
                :precision="2"
                :min="0"
                v-model="formDateRight.transportCost"
                class="w200"
                :disabled="disabled"
                :controls="false"
                size="small"
              />
            </FormItem>
            <FormItem label="结算方式：" prop="settleType">
              <Select v-model="formDateRight.settleType" class="w200" :disabled="disabled">
                <!--<Option value="0" label="0">到付</Option>-->
                <!--<Option value="1" label="1">现结</Option>-->
                <!--<Option value="2" label="2">月结</Option>-->
                <Option
                  v-for="item in payment"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="发货备注：">
              <Input v-model="formDateRight.remark" class="w200" :disabled="disabled" />
            </FormItem>
            <FormItem label="业务单号：">
              <Input v-model="formDateRight.businessNum" class="w200" readonly disabled />
            </FormItem>
            <FormItem label="关联单号：">
              <Input v-model="formDateRight.relationNum" class="w200" :disabled="disabled" />
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div slot="footer">
      <!-- <Button class="mr15" type="primary" @click="ok">确定</Button>
      <Button @click="cancel">取消</Button>-->
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
    // const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
    const reg = /^1[3456789]\d{9}$/;
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
  @Prop(Object) readonly row;
  @Prop(String) readonly guestId;

  private ruleValidate: ruleValidate = {
    receiveCompName: [
      {
        required: true,
        message: "收货单位不能为空",
        trigger: "blur",
        type: "string"
      }
    ],
    address: [
      {
        required: true,
        message: "收货地址不能为空",
        trigger: "blur",
        type: "string"
      }
    ],
    receiveMan: [
      {
        required: true,
        message: "收货人不能为空",
        trigger: "blur",
        type: "string"
      }
    ],
    receiveManTel: [
      {
        required: true,
        message: "联系电话不能为空",
        // validator: checkPhone,
        trigger: "blur",
        type: "string"
      }
    ],
    deliveryType: [
      {
        required: true,
        message: "配送方式不能为空",
        trigger: "change",
        type: "number"
      }
    ],
    settleType: [
      {
        required: true,
        message: "结算方式不能为空",
        trigger: "change",
        type: "number"
      }
    ]
    // deliveryLogistics: [{ required: true, message: "发货物流不能为空", trigger: "change",type: 'string'}]
  };

  private ok() {
    this.cancel();
  }

  private cancel() {
    this.showInfo = false;
  }

  private init() {
    this.showInfo = true;
    this.loading = true;
    this.isRequired = false;
    this.logisRequired = false;
    this.reset();
    // await this.getLists();
    this.searchInfo();
    const ref: any = this.$refs["formTwo"];
    ref.resetFields();
  }

  private async getLists() {
    const parentD: any = this.$parent;
    const directCompanyId = this.row.directCompanyId || null;

    let clientArr = Array.isArray(parentD.client)  ? parentD.client.filter(item => item.id===parentD.formPlan.guestId) : []

    let obj = {
      mainId: this.mainId,
      orgid: clientArr.length>0?clientArr[0].isInternalId:'',
      directCompanyId,
      guestId: this.guestId,
      sign: ""
    };
    if (this.$route.name == "salesOrder" || this.$route.name == "presell") {
      obj.sign = "sign";
    } else {
      delete obj.sign;
    }
    // console.log(obj);
    let res: any = await fapi.getGoodsInfos2(obj);
    if (res.code == 0) {
      this.tableData = res.data || [];
      this.loading = false;
      const xtable: any = this.$refs["xTable1"];
      let arrData = this.tableData.filter(item => item.logisticsRecordVO);
      let arrDefault = this.tableData.filter(item => item.isDefault);
      if (arrData.length > 0) {
        this.echoDate({ row: arrData[0] });
        xtable.setRadioRow(arrData[0]);
      } else if (arrDefault.length > 0) {
        this.echoDate({ row: arrDefault[0] });
        xtable.setRadioRow(arrDefault[0]);
      } else {
        this.echoDate({ row: this.tableData[0] });
        xtable.setRadioRow(this.tableData[0]);
      }
    }
  }

  //获取物流下拉框
  private async inlogistics() {
    const parentD: any = this.$parent;
    let guestId = parentD.formPlan.guestId;
    let params: any = { guestId: guestId };
    if (this.formDateRight.deliveryType == 2) {
      params.logisticsType = "020701";
    }
    if (this.formDateRight.deliveryType == 3) {
      params.logisticsType = "020702";
    }
    let log: any = await fapi.logistics(params);
    if (log.code == 0) {
      this.logisArr = log.data;
    }
  }

  private formDateTop: any = {
    receiveComp: null, //收货单位
    receiver: null, //收货人
    address: null, //详细收货地址
    receiverMobile: null //联系电话
  };

  private Delivery: any = [
    {
      value: 0,
      label: "自配"
    },
    {
      value: 1,
      label: "客户自提"
    },
    {
      value: 2,
      label: "快递"
    },
    {
      value: 3,
      label: "物流"
    }
  ];

  private payment: any = [
    {
      value: 0,
      label: "到付"
    },
    {
      value: 1,
      label: "现结"
    },
    {
      value: 2,
      label: "月结"
    }
  ];
  private isRequired: boolean = false;
  private changeDeliveryType() {
    if (
      this.formDateRight.deliveryType == 2 ||
      this.formDateRight.deliveryType == 3
    ) {
      this.isRequired = true;
    } else {
      this.isRequired = false;
    }
  }

  private selectLogis(val: any) {
    this.formDateRight.logisticsComp = val || "";
    if (this.formDateRight.deliveryLogistics !== "") {
      this.logisRequired = false;
    } else {
      this.logisRequired = true;
    }
  }

  //表单数据 右 收货信息与发货信息
  private formDateRight: any = {
    //表单数据 上 查询
    receiveComp: "", //收货单位
    receiver: "", //收货人
    receiverMobile: "", //联系电话
    //收货信息
    receiveAddress: "", //收货单位地址
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
    logisticsComp: "" //物流公司名字，
  };
  private SaveId: any = ""; //保存id,
  private logisticsRecordVO: any = "";
  //表格 数据
  private tableData: Array<any> = new Array();
  private loading: boolean = false;
  //配送方式字典下拉框
  private dictArr: Array<any> = new Array();
  //发货物流下拉框
  private logisArr: Array<any> = new Array();
  private logisRequired: boolean = false; //✳

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
    const directCompanyId = this.row.directCompanyId || null;
    data.directCompanyId = directCompanyId;
    const parentD: any = this.$parent;
    data.orgid = parentD.formPlan.guestId;
    data.guestId = this.guestId;

    if (this.$route.name == "salesOrder" || this.$route.name == "presell") {
      data.sign = "sign";
    }
    let res = await fapi.getGoodsInfos2(data);
    if (res.code == 0) {
      this.tableData = res.data || [];
      this.loading = false;
      const xtable: any = this.$refs["xTable1"];
      let arrData = this.tableData.filter(item => item.logisticsRecordVO);
      if (arrData.length > 0) {
        this.echoDate({ row: arrData[0] });
        xtable.setRadioRow(arrData[0]);
      } else {
        let arrDefault = this.tableData.filter(item => item.isDefault);
        if (arrDefault.length > 0) {
          this.echoDate({ row: arrDefault[0] });
          xtable.setRadioRow(arrDefault[0]);
        }
      }
      this.inlogistics();
    }
  }
  //快递下拉框
  private distribution(val) {
    this.formDateRight.deliveryType = val;
    this.inlogistics();
    if (val == 2 || val == 3) {
      this.isRequired = true;
    } else {
      this.isRequired = false;
    }
  }
  //保存
  private saveInfo() {
    const ref: any = this.$refs["formTwo"];
    // console.log(this.formDateRight)
    ref.validate(async (valid: any) => {
      let logisc: boolean = true;
      if (!this.isRequired) {
        logisc = true;
        this.logisRequired = false;
      } else {
        logisc = false;
        if (
          !this.formDateRight.deliveryLogistics &&
          !["0", "1"].includes(this.formDateRight.deliveryType)
        ) {
          this.logisRequired = true;
          logisc = false;
        } else {
          this.logisRequired = false;
          logisc = true;
        }
      }
      if (valid && logisc) {
        // this.saveId(this.tableData);
        //  this.formDateRight.id = this.formDateRight.logisticsId
        let aaa: any = {};
        aaa.logisticsId = this.formDateRight.id;
        delete this.formDateRight.id;
        let params: any = {};
        params.receiveComp = this.formDateRight.receiveCompName;
        params.receiveAddress = this.formDateRight.address||this.formDateRight.streetAddress;
        params.receiver = this.formDateRight.receiveMan;
        params.receiverMobile = this.formDateRight.receiveManTel;
        params.deliveryType = this.formDateRight.deliveryType;
        params.deliveryLogistics = this.formDateRight.deliveryLogistics;
        params.transportCost = this.formDateRight.transportCost;
        params.settleType = this.formDateRight.settleType;
        params.remark = this.formDateRight.remark;
        params.businessNum = this.formDateRight.businessNum;
        params.relationNum = this.formDateRight.relationNum;
        params.guestId = this.formDateRight.guestId;
        if (this.SaveId) {
          params.id = this.SaveId;
          params = this.logisticsRecordVO;
          params.receiveComp = this.formDateRight.receiveCompName;
          params.receiveAddress = this.formDateRight.address||this.formDateRight.streetAddress;
          params.receiver = this.formDateRight.receiveMan;
          params.receiverMobile = this.formDateRight.receiveManTel;
          params.deliveryType = this.formDateRight.deliveryType;
          params.deliveryLogistics = this.formDateRight.deliveryLogistics;
          params.transportCost = this.formDateRight.transportCost;
          params.settleType = this.formDateRight.settleType;
          params.remark = this.formDateRight.remark;
          params.businessNum = this.formDateRight.businessNum;
          params.relationNum = this.formDateRight.relationNum;
          params.guestId = this.formDateRight.guestId;
        }
        let res = await fapi.saveGoodsInfo({
          ...aaa,
          ...params,
          mainId: this.mainId
        });
        if (res.code == 0) {
          ref.resetFields();
          this.showInfo = false;
          this.reset();
          this.searchInfo();
          this.$Message.success("保存成功");
        }
      } else {
        this.$Message.error("请完善收货信息后再保存!");
      }
    });
  }
  private echoDate({ row }) {
    // this.reset();
    // let ref: any = this.$refs.formTwo;
    // ref.resetFields();
    this.disabled = false;
    this.formDateRight = {};
    this.formDateRight.businessNum = this.row.serviceId;
    if (row.logisticsRecordVO) {
      this.logisticsRecordVO = row.logisticsRecordVO;
      this.SaveId = row.logisticsRecordVO.id;
      this.formDateRight.businessNum = this.row.serviceId;
      this.formDateRight.id = row.logisticsRecordVO.id;
      this.formDateRight.receiveCompName = row.logisticsRecordVO.receiveComp;
      this.formDateRight.address = row.logisticsRecordVO.address||row.logisticsRecordVO.receiveAddress;
      this.formDateRight.receiveMan = row.logisticsRecordVO.receiver;
      this.formDateRight.receiveManTel = row.logisticsRecordVO.receiverMobile;
      this.formDateRight.deliveryType = row.logisticsRecordVO.deliveryType;
      this.formDateRight.deliveryLogistics =
        row.logisticsRecordVO.deliveryLogistics;
      this.formDateRight.transportCost = row.logisticsRecordVO.transportCost;
      this.formDateRight.settleType = row.logisticsRecordVO.settleType;
      this.formDateRight.remark = row.logisticsRecordVO.remark;
      this.formDateRight.businessNum = row.logisticsRecordVO.businessNum;
      this.formDateRight.relationNum = row.logisticsRecordVO.relationNum;
      this.formDateRight.guestId = row.logisticsRecordVO.guestId;
      if (this.formDateRight.deliveryType) {
        this.changeDeliveryType();
      }
    } else {
      this.SaveId = "";
      this.formDateRight = row;
      this.formDateRight.businessNum = this.row.serviceId;
      this.formDateRight.logisticsId = row.id;
      this.formDateRight.receiveComp = row.receiveCompName;
      this.formDateRight.address = row.address||row.streetAddress;
      // this.formDateRight.address = row.address;
      // this.formDateRight.receiver = row.receiveMan;
      // this.formDateRight.receiverMobile = row.receiveManTel;
      // this.formDateRight.provinceId = row.provinceId;
      // this.formDateRight.cityId = row.cityId;
      // this.formDateRight.countyId = row.countyId;
      // this.formDateRight.guestId = row.guestId;
      // this.formDateRight.receiveAddress = row.address;
    }
    this.changeDeliveryType();
    this.inlogistics();
  }
  //传入保存id
  // private saveId(row) {
  //   row.forEach(item => {
  //     if (item.logisticsRecord) {
  //       this.formDateRight.id = item.logisticsRecord.id;
  //     }
  //   });
  // }

  private reset() {
    this.formDateTop = {
      receiveCompName: null, //收货单位
      receiveMan: null, //收货人
      address: null, //详细收货地址
      receiveManTel: null //联系电话
    };
    const ref: any = this.$refs["formTwo"];
    ref.resetFields();
    const xTable1: any = this.$refs.xTable1;
    xTable1.clearRadioRow();
    this.formDateRight = {
      //表单数据 上 查询
      receiveComp: "", //收货单位
      receiver: "", //收货人
      receiverMobile: "", //联系电话
      //收货信息
      receiveAddress: "", //收货单位地址
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

<style>
.vxe-table--body-wrapper.body--wrapper {
  background-color: #fff;
}
</style>

<style lang="less" scoped>
.bgc {
  color: #000;
  background-color: #e8e8e8;
}
.fl1, .sForm{
  position: relative;
  z-index: 1;
}
.fl1 {
  z-index: 10;
}
</style>

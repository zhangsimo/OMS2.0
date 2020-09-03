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
              v-model="formDateTop.streetAddress"
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
        <div class="fl1 fl  w300">
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
              type="seq"
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
              field="streetAddress"
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
        <div class="sForm">
          <div class="bgc p5  mb15">收货信息</div>
          <Form
            inline
            :model="formDateRight"
            ref="formTwo"
            :label-width="100"
            :rules="ruleValidate"
          >
            <FormItem label="收货单位：" prop="receiveComp">
              <Input
                v-model="formDateRight.receiveComp"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="收货地址：" prop="streetAddress">
              <Input
                v-model="formDateRight.streetAddress"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="收货人：" prop="receiver">
              <Input
                v-model="formDateRight.receiver"
                class="w200"
                :disabled="disabled"
              />
            </FormItem>
            <FormItem label="联系电话：" prop="receiverMobile">
              <Input
                v-model="formDateRight.receiverMobile"
                class="w200"
                :disabled="disabled"
              />
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
                <Option value="0">自配</Option>
                <Option value="1">客户自提</Option>
                <Option value="2">快递</Option>
                <Option value="3">物流</Option>
              </Select>
            </FormItem>
            <FormItem label="发货物流：" :class="isRequired ? 'ivu-form-item ivu-form-item-required' : ''">
              <Select
                v-model="formDateRight.deliveryLogistics"
                class="w200"
                :disabled="disabled"
                filterable
                label-in-value
                @on-change="selectLogis"
              >
                <Option
                  v-for="item in logisArr"
                  :value="item.id"
                  :disabled="item.isDisabled==1"
                  v-show="item.isDisabled!==1"
                  :key="item.id"
                  >{{ item.fullName }}</Option
                >
              </Select>
              <div class="ivu-form-item-error-tip" v-show="logisRequired">
                发货物流未选择
              </div>
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
              <Select
                v-model="formDateRight.settleType"
                class="w200"
                :disabled="disabled"
              >
                <Option value="0">到付</Option>
                <Option value="1">现结</Option>
                <Option value="2">月结</Option>
              </Select>
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
                readonly
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

  private guestId:string = "";

  private addressId:string = "";

  @Prop(String) readonly mainId;
  @Prop(Object) readonly row;

  private ruleValidate: ruleValidate = {
    receiveComp: [
      { required: true, message: "收货单位不能为空", trigger: "blur" }
    ],
    streetAddress: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],
    receiver: [{ required: true, message: "收货人不能为空", trigger: "blur" }],
    receiverMobile: [
      {
        required: true,
        message: "联系电话不可为空",
        // validator: checkPhone,
        trigger: "blur"
      }
    ],
    deliveryType: [
      { required: true, message: "配送方式不能为空", trigger: "change" }
    ],
    settleType: [
      { required: true, message: "结算方式不能为空", trigger: "change" }
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
    this.isRequired = false;
    this.logisRequired = false;
    this.reset();
    await this.getLists();
    await this.inlogistics();
  }

  private async getLists() {
    const parentD:any = this.$parent
    this.showInfo = true;
    const directCompanyId = this.row.directCompanyId || null;
    this.guestId = parentD.formPlanmain.guestId;
    let res:any = await fapi.getGoodsInfos({ mainId: this.mainId,guestId:this.guestId, directCompanyId });
    if (res.code == 0) {
      this.tableData = res.data;
      this.loading = false;

      const xtable:any = this.$refs["xTable1"];
      let arrData = this.tableData.filter(item => item.defaultShow);
      if(arrData.length>0){
        this.echoDate({row:arrData[0]});
        xtable.setRadioRow(arrData[0]);
      }else{
        let arrDefault = this.tableData.filter(item => item.isDefault);
        if(arrDefault.length>0){
          this.echoDate({row:arrDefault[0]});
          xtable.setRadioRow(arrDefault[0]);
        }
      }
      // for(let b of this.tableData){
      //   if(b.defaultShow){
      //     this.echoDate({row:b});
      //     const xtable:any = this.$refs["xTable1"];
      //     xtable.setRadioRow(b);
      //     break;
      //   }
      // }
    }
  }
  //快递下拉框
  private distribution(val){
    this.formDateRight.deliveryType = val
    // console.log(this.formDateRight.deliveryType)
    this.inlogistics();
    if(val == 2 || val == 3){
      this.isRequired = true;
    }else {
      this.isRequired = false;
    }
  }
  //获取物流下拉框
  private async inlogistics() {
    let params:any = {guestId:this.guestId}
    if(this.formDateRight.deliveryType == 2){
      params.logisticsType = '020701'
    }
    if(this.formDateRight.deliveryType == 3){
      params.logisticsType = '020702'
    }
    let log:any = await fapi.logistics(params);
    if (log.code == 0) {
      this.logisArr = log.data;
    }
  }

  private formDateTop: any = {
    receiveComp: null, //收货单位
    receiver: null, //收货人
    streetAddress: null, //详细收货地址
    receiverMobile: null //联系电话
  };

  private isRequired:boolean = true;
  private changeDeliveryType() {
    if(!['0', '1'].includes(this.formDateRight.deliveryType)) {
      this.isRequired = true;
    } else {
      this.isRequired = false;
    }
  }

  private selectLogis(val:any) {
    if(val){
      this.formDateRight.logisticsComp = val.label || "";
      if(this.formDateRight.deliveryLogistics != "") {
        this.logisRequired = false;
      } else {
        this.logisRequired = true;
      }
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
    streetAddress: "", //收货详细地址
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
  private logisRequired:boolean = false;

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
    data.guestId = this.guestId;
    let res = await fapi.getGoodsInfos(data);
    if (res.code == 0) {
      this.tableData = res.data;
      this.loading = false;

      const xtable:any = this.$refs["xTable1"];
      let arrData = this.tableData.filter(item => item.defaultShow);
      if(arrData.length>0){
        this.echoDate({row:arrData[0]});
        xtable.setRadioRow(arrData[0]);
      }else{
        let arrDefault = this.tableData.filter(item => item.isDefault);
        if(arrDefault.length>0){
          this.echoDate({row:arrDefault[0]});
          xtable.setRadioRow(arrDefault[0]);
        }
      }
    }
  }
  //保存
  private saveInfo() {
    const ref: any = this.$refs["formTwo"];
    ref.validate(async (valid: any) => {
      let logisc:boolean = false;
      if(!this.isRequired) {
        logisc = true;
      } else {
        if(!!this.formDateRight.deliveryLogistics) {
          logisc = true;
          this.logisRequired = false;
        } else {
          this.logisRequired = true;
          logisc = false;
        }
      }
      if (valid && logisc) {
        // this.saveId(this.tableData);
        let reqObj = {
          ...this.formDateRight,
          mainId: this.mainId,
          guestId:this.guestId,
          logisticsId:this.addressId
        }
        let res = await fapi.saveGoodsInfos(reqObj);
        if (res.code == 0) {
          this.$Message.success("保存成功");
          this.showInfo = false;
          this.reset();
          this.searchInfo();
        }
      } else {
        this.$Message.error("请完善收货信息后再保存!");
      }
    });
  }
  private echoDate({ row }) {
    this.reset();
    let ref:any = this.$refs.formTwo;
    ref.resetFields();
    this.disabled = false;
    this.addressId = row.id
    if(row.logisticsRecord){
      this.formDateRight = {...row.logisticsRecord}
    }

    this.formDateRight.businessNum = this.formDateRight.businessNum || this.row.serviceId;
    this.formDateRight.deliveryType = this.formDateRight.deliveryType+"";
    this.formDateRight.settleType = this.formDateRight.settleType+"";
    //收货单位
    this.formDateRight.receiveComp = this.formDateRight.receiveComp || row.receiveCompName
    //收货地址
    this.formDateRight.streetAddress = this.formDateRight.streetAddress || row.address
    //收货人
    this.formDateRight.receiver = this.formDateRight.receiver || row.receiveMan
    //联系电话
    this.formDateRight.receiverMobile = this.formDateRight.receiverMobile || row.receiveManTel

    // if (row.logisticsRecord) {
    //   this.formDateRight.id = row.logisticsRecord.id;
    //   this.formDateRight = { ...row.logisticsRecord };
    //   this.formDateRight.deliveryType = this.formDateRight.deliveryType + "";
    //   this.formDateRight.settleType = this.formDateRight.settleType + "";
    // } else {
    //   this.formDateRight.logisticsId = row.id;
    //   this.formDateRight.receiveComp = row.receiveCompName;
    //   this.formDateRight.streetAddress = row.streetAddress;
    //   this.formDateRight.receiver = row.receiveMan;
    //   this.formDateRight.receiverMobile = row.receiveManTel;
    //   this.formDateRight.provinceId = row.provinceId;
    //   this.formDateRight.cityId = row.cityId;
    //   this.formDateRight.countyId = row.countyId;
    //   this.formDateRight.guestId = row.guestId;
    //   this.formDateRight.receiveAddress = row.address;
    // }
    // this.changeDeliveryType();
    this.inlogistics();
  }
  //传入保存id
  private saveId(row) {
    row.forEach(item => {
      if (item.logisticsRecord) {
        this.formDateRight.id = item.logisticsRecord.id;
      }
    });
  }

  private reset() {
    this.formDateTop = {
      receiveCompName: null, //收货单位
      receiveMan: null, //收货人
      streetAddress: null, //详细收货地址
      receiveManTel: null //联系电话
    };
    const ref: any = this.$refs["formTwo"];
    ref.resetFields();
    const xTable1:any = this.$refs.xTable1;
    xTable1.clearRadioRow();
    this.formDateRight = {
      //表单数据 上 查询
      receiveComp: "", //收货单位
      receiver: "", //收货人
      receiverMobile: "", //联系电话
      //收货信息
      receiveAddress: "", //收货单位地址
      //发货信息
      streetAddress: "", //收货详细地址
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

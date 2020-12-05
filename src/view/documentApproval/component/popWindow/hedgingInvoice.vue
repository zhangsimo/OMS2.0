<template>
  <Modal v-model="modal1" title="发票对冲申请" width="1200" @on-visible-change="visChange">
    <div v-if="modelType.type===3">
      <div class="mb10">
        <span class="mr5">申请单号：</span>
        <Input type="text" v-model="formInline.applyNo" style="width: 200px" disabled />
      </div>
      <Row class="tableBox">
        <Col class="inner" span="4">申请人</Col>
        <Col class="inner" span="4">{{formInline.applicant || ''}}</Col>
        <Col class="inner" span="4">部门名称</Col>
        <Col class="inner" span="4">{{formInline.deptName || ' '}}</Col>
        <Col class="inner" span="4">门店店号</Col>
        <Col class="inner" span="4">{{formInline.shopCode || ' '}}</Col>
      </Row>
      <Row class="tableBox twoTable">
        <Col class="inner" span="4">门店名称</Col>
        <Col class="inner" span="4">{{formInline.orgName || ' '}}</Col>
        <Col class="inner" span="4">申请类型</Col>
        <Col class="inner" span="4">{{formInline.applyTypeName || ' '}}</Col>
        <Col class="inner" span="4">申请时间</Col>
        <Col class="inner" span="4">{{formInline.applyTime}}</Col>
      </Row>
      <h4 class="mb10 mt10">对账单明细</h4>
    </div>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="preservation"
      v-has="'examine'"
      :disabled="modelType.type!==1"
      :loading="preDis"
    >保存草稿</Button>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      :loading="preDis"
      v-has="'examine'"
      v-noresub
      :disabled="modelType.type!==1"
    >提交申请</Button>
    <h4 class="mt10 mb10">基本信息</h4>
    <Row>
      <Col span="5">
        <span>分店名称：{{information.orgName}}</span>
      </Col>
      <Col span="4">
        <span>分店店号：{{information.shopNo}}</span>
      </Col>
      <Col span="5">
        <span>往来单位：{{information.guestName}}</span>
      </Col>
      <Col span="5">
        <span>对冲申请单号：{{information.serviceId}}</span>
      </Col>
      <Col span="5">
        <span>申请时间：{{information.applyTime}}</span>
      </Col>
    </Row>
    <Row class="mt10 ml10">
      <Col span="4">
        <span>申请人：</span>
        <Input v-model="information.applicant" class="ml5 w100" readonly />
      </Col>
      <Col span="4">
        <span>对冲配件：</span>
        <Input v-model="information.hedgingInvoiceOfPart" class="ml5 w100" readonly />
      </Col>
      <Col span="4">
        <span>对冲油品：</span>
        <Input v-model="information.hedgingInvoiceOfOil" class="ml5 w100" readonly />
      </Col>
      <Col span="12">
        <span>对冲申请原因说明：</span>
        <Input v-model="remarks" class="ml5 w260" :disabled="Boolean(modelType !== 2)"/>
      </Col>
    </Row>
    <button
      class="ivu-btn ivu-btn-default mt10"
      type="button"
      @click="seleteAccount"
      v-has="'examine'"
      :disabled="modelType.type!==1"
    >选择对账单</button>
    <vxe-table
      class="mt10"
      height="300"
      border
      resizable
      auto-resize
      highlight-current-row
      show-footer
      @edit-closed="editClosed"
      :footer-method="footerMethod"
      :data="accessoriesBillingData"
      :edit-config="{trigger: 'click', mode: 'cell'}"
    >
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column title="公司名称" field="orgName"></vxe-table-column>
      <vxe-table-column field="accountNo" title="对账单号"></vxe-table-column>
      <vxe-table-column field="guestName" title="往来单位"></vxe-table-column>
      <vxe-table-column field="billingTypeName" title="收付类型"></vxe-table-column>
      <vxe-table-column field="taxArrearsOfPart" title="含税配件欠票"></vxe-table-column>
      <vxe-table-column field="taxArrearsOfOil" title="含税油品欠票"></vxe-table-column>
      <vxe-table-column
        field="hedgingInvoiceOfPart"
        title="对冲配件发票"
        :edit-render="{name: 'input', attrs: {type: 'number',disabled:'modelType.type!==1'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="hedgingInvoiceOfOil"
        title="对冲油品发票"
        :edit-render="{name: 'input', attrs: {type: 'number',disabled:'modelType.type!==1'}}"
      ></vxe-table-column>
      <vxe-table-column field="taxParts" title="剩余含税配件欠票"></vxe-table-column>
      <vxe-table-column field="taxOil" title="剩余含税油品欠票"></vxe-table-column>
    </vxe-table>
    <saleSelete ref="saleSelete" :information="information" />
    <!--<flow v-if="modelType.type===3" />-->
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import saleSelete from "@/view/settlementManagement/bill/Popup/saleSelete";
import { hedPreservation, hedSubmit } from "@/api/bill/popup";
import { getThisAllList } from '@/api/documentApproval/documentApproval/documentApproval'
import bus from "@/view/settlementManagement/bill/Popup/Bus";
import flow from "../Flow.vue";
import moment from "moment";
export default {
  props: ["modelType"],
  components: {
    saleSelete,
    flow
  },
  data() {
    return {
      preDis:false,//保存接口返回之前按钮不可点击
      formInline: {
        applicant: "",
        deptName: "",
        shopCode: "",
        orgName: "",
        applyTypeName: "",
        applyTime: "",
        paymentOrgName: ""
      }, //所有数据对象
      information: {}, //传参
      modal1: false, //弹框显示
      invoiceHedging: "", //对冲发票
      oilHedging: "", //对冲油品
      remarks: "", //对冲申请原因说明
      accessoriesBillingData: [], //对账单列表数据
      row: {},//申请单标识的数据
    };
  },
  mounted() {
    bus.$on("accountHedNo", val => {
      val.statementMasterId = val.id;
      this.accessoriesBillingData.push(val);
      val.taxArrearsOfPart = -val.taxArrearsOfPart;
      val.taxArrearsOfOil = -val.taxArrearsOfOil;
      this.accessoriesBillingData.map(item => {
        delete item.id;
      });
    });
  },
  methods: {
    open(row){
      this.row = row
      this.modal1 = true
    },
    // 单元格关闭出发事件
    editClosed({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      cell
    }) {
      row.taxParts = row.taxArrearsOfPart - row.hedgingInvoiceOfPart;
      row.taxOil = row.taxArrearsOfOil - row.hedgingInvoiceOfOil;
    },
    //获取尾部总数
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (
            ["hedgingInvoiceOfPart", "hedgingInvoiceOfOil"].includes(
              column.property
            )
          ) {
            return this.$utils.sum(data, column.property).toFixed(2);
          }
          return null;
        })
      ];
    },
    // 对话框是否显示
   async visChange(flag) {
      if(this.modelType.id){
        let data ={}
        data.id = this.modelType.id || ''
        let res = await getThisAllList(data)
           if(res.code == 0){
             this.formInline.applyNo = res.data.serviceId;
             this.information = res.data;
             this.remarks = res.data.applyReason
           }
      }
      if (flag) {
        this.accessoriesBillingData = [];
        if(this.modelType.id){
          this.information.details.map(item => {
            item.taxArrearsOfOil = item.taxArrearsOfOil ? item.taxArrearsOfOil : 0;
            item.taxArrearsOfPart = item.taxArrearsOfPart ? item.taxArrearsOfPart : 0;

          })
          this.accessoriesBillingData = this.information.details;
        }else {
          this.accessoriesBillingData.push(this.information);
        }
        if (this.modelType.type === 1) {
          let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            user = this.$store.state.user.userData;
          this.formInline.applicant = user.staffName;
          this.formInline.deptName =
            user.groups[user.groups.length - 1].name || " 　　";
          this.formInline.shopCode = user.shopCode || " 　　";
          this.formInline.orgName = user.shopName;
          this.formInline.applyTypeName = "不含税开票申请";
          this.formInline.applyTime = date;
          this.formInline.paymentOrgName = user.shopName;
        }else{
          this.formInline = this.row
        }
      }
    },
    // 保存草稿
    preservation() {
      this.accessoriesBillingData.map(item => {
        item.billingType =
          item.billingType.value !== undefined
            ? item.billingType.value
            : item.billingType;
      });
      let obj = {
        applicant: this.information.applicant,
        applyTime: this.information.applyTime,
        guestId: this.information.guestId,
        orgId: this.information.orgId,
        serviceId: this.information.serviceId,
        details: this.accessoriesBillingData
      };
      // console.log(this.accessoriesBillingData)
      this.preDis=true;
      hedPreservation(obj).then(res => {
        if (res.code === 0) {
          this.preDis=false;
          this.$message.success("保存成功");
          this.modal1 = false;
        }else{
          this.preDis=false;
        }
      });
    },
    // 提交申请
    submission() {
      let sum1 = 0;
      let sum2 = 0;
      if (!this.remarks) return this.$message.error("对冲申请原因说明不能为空");
      this.accessoriesBillingData.map(item => {
        sum1 += item.hedgingInvoiceOfPart * 1;
        sum2 += item.hedgingInvoiceOfOil * 1;
        item.billingType =
          item.billingType.value !== undefined
            ? item.billingType.value
            : item.billingType;
      });
      if (sum1) return this.$message.error("对冲配件发票合计必须为0");
      if (sum2) return this.$message.error("对冲油品发票合计必须为0");
      let obj = {
        applicant: this.information.applicant,
        applyTime: this.information.applyTime,
        guestId: this.information.guestId,
        orgId: this.information.orgId,
        serviceId: this.information.serviceId,
        applyReason: this.remarks,
        details: this.accessoriesBillingData
      };
      this.preDis=true;
      hedSubmit(obj).then(res => {
        if (res.code === 0) {
          this.$message.success("提交成功");
          this.modal1 = false;
          this.preDis=false;
        }else{
          this.preDis=false
        }
      });
    },
    // 选择对账单
    seleteAccount() {
      this.$refs.saleSelete.modal1 = true;
    }
  }
};
</script>
<style scoped lang="less">
.tableBox {
  line-height: 38px;
  text-align: center;
  border: #cccccc 1px solid;
  border-right: none;
  .inner {
    border-right: #cccccc 1px solid;
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .inner:nth-child(2n-1) {
    background: #f9f9f9;
  }
}

.twoTable {
  border-top: none;
}
</style>

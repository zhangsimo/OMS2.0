<template>
  <Modal v-model="modal1" title="发票对冲申请" width="1200" @on-visible-change="visChange">
    <Button
      class="ivu-btn ivu-btn-default mr10"
      @click="preservation"
      :loading="preservationDis"
      v-has="'examine'"
    >保存草稿
    </Button>
    <Button
      class="ivu-btn ivu-btn-default mr10"
      v-noresub
      @click="submission"
      :loading="preservationDis"
      v-has="'examine'"
    >提交申请
    </Button>
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
        <Input v-model="information.applicant" class="ml5 w100" readonly/>
      </Col>
      <Col span="4">
        <span>对冲配件：</span>
        <Input v-model="information.hedgingInvoiceOfPart" class="ml5 w100" readonly/>
      </Col>
      <Col span="4">
        <span>对冲油品：</span>
        <Input v-model="information.hedgingInvoiceOfOil" class="ml5 w100" readonly/>
      </Col>
      <Col span="12">
        <span>对冲申请原因说明：</span>
        <Input v-model="remarks" class="ml5 w260"/>
      </Col>
    </Row>
    <button
      class="ivu-btn ivu-btn-default mt10"
      type="button"
      @click="seleteAccount"
      v-has="'examine'"
    >选择对账单
    </button>
    <vxe-table
      ref="xTable"
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
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="hedgingInvoiceOfOil"
        title="对冲油品发票"
        :edit-render="{name: 'input', attrs: {type: 'number'}}"
      ></vxe-table-column>
      <vxe-table-column field="taxParts" title="剩余含税配件欠票"></vxe-table-column>
      <vxe-table-column field="taxOil" title="剩余含税油品欠票"></vxe-table-column>
    </vxe-table>
    <!--    <h4 class="mt10">发票对冲申请</h4>-->
    <!--    <approval :approvalTit="approvalTit" />-->
    <saleSelete ref="saleSelete" :information="information"/>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import approval from "./approval";
  import saleSelete from "./saleSelete";
  import {hedPreservation, hedSubmit} from "@/api/bill/popup";
  import bus from "./Bus";
  import {approvalStatus} from "_api/base/user";

  export default {
    components: {
      approval,
      saleSelete
    },
    data() {
      return {
        information: {}, //传参
        preservationDis:false,//保存草稿按钮接口没有返回不可点击
        approvalTit: "对冲申请流程", //审批流程
        modal1: false, //弹框显示
        invoiceHedging: "", //对冲发票
        oilHedging: "", //对冲油品
        remarks: "", //对冲申请原因说明
        accessoriesBillingData: [] //对账单列表数据
      };
    },
    mounted() {
      bus.$on("accountHedNo", val => {
        val.statementMasterId = val.id;
        delete val.id
        this.accessoriesBillingData.push(val);
        // val.taxArrearsOfPart = val.taxArrearsOfPart;
        // val.taxArrearsOfOil = val.taxArrearsOfOil;
      });
    },
    methods: {
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
      footerMethod({columns, data}) {
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
      visChange(flag) {
        this.$refs.xTable.recalculate(true)
        if (flag) {
          this.accessoriesBillingData = [];
          this.accessoriesBillingData.push(this.information);
          approvalStatus({instanceId: this.information.processInstance==null?"":this.information.processInstance}).then(res => {
            if (res.code == 0) {
              bus.$emit('approval', res.data.operationRecords)
            }
          });
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
        this.preservationDis=true;
        // console.log(this.accessoriesBillingData)
        hedPreservation(obj).then(res => {
          if (res.code === 0) {
            this.preservationDis=false
            this.$message.success("保存成功");
            this.modal1 = false;
          }else{
            this.preservationDis=false;
          }
        });
      },
      // 提交申请
      submission() {
        let sum1 = 0;
        let sum2 = 0;
        if (this.information.hedgingInvoiceOfOil != 0 && !this.remarks) return this.$message.error("对冲申请原因说明不能为空");
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
        this.preservationDis=true;
        hedSubmit(obj).then(res => {
          if (res.code === 0) {
            this.preservationDis=false
            this.$message.success("提交成功");
            this.modal1 = false;
          }else{
            this.preservationDis=false
          }
        });
      },
      // 选择对账单
      seleteAccount() {
        this.$refs.saleSelete.modal1 = true;
      }
    },
    watch: {
      accessoriesBillingData: {
        handler(newVal, oldVal) {
          if (newVal.length == 0) return
          newVal.map(item => {
            if (item.billingTypeName == '付款') {
              item.taxArrearsOfPart = -Math.abs(item.taxArrearsOfPart)
            }
          })
        },
        deep: true
      }
    }
  };
</script>

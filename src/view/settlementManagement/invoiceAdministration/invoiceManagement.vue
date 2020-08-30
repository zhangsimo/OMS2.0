<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
      <div class="flex">
        <div class="wlf">
          <div>
            <span>快速查询：</span>
            <quickDate
              class="mr10"
              ref="quickDate"
              @quickDate="quickDate"
            ></quickDate>
          </div>
          <div class="mr10">
            <span>开票时间：</span>
            <Date-picker
              format="yyyy-MM-dd"
              :value="value"
              @on-change="changedate"
              type="daterange"
              placeholder="选择日期"
              class="w200"
            ></Date-picker>
          </div>
          <div class="mr10 flexd">
            <span>发票销售方名称：</span>
            <Select v-model="form.invoiceSellerName" style="width:160px" clearable filterable>
              <Option
                v-for="item in invoiceUnitOption"
                :value="item.itemName"
                :key="item.itemCode"
                >{{ item.itemName }}</Option
              >
            </Select>
          </div>
          <div class="mr10 flexd">
            <span>往来单位：</span>
            <Select
              v-model="form.guestId"
              class="w150"
              clearable
              filterable
              remote
              :loading="remoteloading"
              :remote-method="getOne"
              @on-change="query"
            >
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <button class="ivu-btn ivu-btn-default" @click="query" type="button">
            <i class="iconfont iconchaxunicon"></i>
            <span>查询</span>
          </button>
        </div>
      </div>
      <div class="mt20">
        <Button class="mr10" v-has="'export'" @click="operation(1)"
          >导入</Button
        >
        <Button class="mr10" v-has="'change'" @click="operation(2)"
          >修改</Button
        >
        <Button class="mr10" v-has="'delete'" @click="operation(3)"
          >删除</Button
        >
        <Button class="mr10" v-has="'ai'" @click="operation(4)"
          >智能核销</Button
        >
        <Button class="mr10" v-has="'ai'" @click="operation(8)"
          >人工核销</Button
        >
        <Button class="mr10" v-has="'backout'" @click="operation(5)"
          >发票退回</Button
        >
        <Button class="mr10" v-has="'red'" @click="operation(6)"
          >红字进项转出</Button
        >
        <Button class="mr10" v-has="'time'" @click="operation(7)"
          >导入勾选认证时间</Button
        >
        <Button
          class="mr10"
          :type="isActive === '' ? 'info' : 'default'"
          @click="chooseTable('')"
          >全部显示</Button
        >
        <Button
          class="mr10"
          :type="isActive === 1 ? 'info' : 'default'"
          @click="chooseTable(1)"
          >已核销</Button
        >
        <Button
          :type="isActive === 0 ? 'info' : 'default'"
          @click="chooseTable(0)"
          >未核销</Button
        >
      </div>
    </section>
    <section class="con-box">
      <div class>
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summaryss"
          show-summary
          :summary-method="handleSummary"
          highlight-row
          @on-selection-change="requires"
        ></Table>
        <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          show-total
          @on-change="pageNumChange"
          @on-page-size-change="pageSizeChange"
          size="small"
        />
      </div>
    </section>
    <!-- 导入 -->
    <Modal v-model="exportData" title="发票导入" width="400">
      <p class="mt20 mb20">导入前请先下载模板</p>
      <div slot="footer" class="exportBtn">
        <Button type="info" v-has="'export'" @click="exportDown"
          >模板下载</Button
        >
        <Upload
          ref="upload"
          :show-upload-list="false"
          :headers="headers"
          :action="upurl"
          :format="['xlsx', 'xls', 'csv']"
          :before-upload="handleBeforeUpload"
          :on-format-error="onFormatError"
          :on-success="handleSuccess"
        >
          <Button type="success" @click="uploading" class="mr10">导入</Button>
        </Upload>
        <!-- <Button type="primary" @click="submit">保存</Button> -->
      </div>
    </Modal>
    <Modal v-model="exportTime" title="勾选认证时间导入" width="400">
      <p class="mt20 mb20">导入前请先下载模板</p>
      <div slot="footer" class="exportBtn">
        <Button type="info" @click="exportCertification">模板下载</Button>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :headers="headers"
          :action="authenticationUpurl"
          :format="['xlsx', 'xls', 'csv']"
          :before-upload="handleBeforeUpload"
          :on-format-error="onFormatError"
          :on-success="handleSuccess"
        >
          <Button type="success" @click="importCertification" class="mr10"
            >导入</Button
          >
        </Upload>
      </div>
    </Modal>
    <!-- 弹出框 -->
    <Modal v-model="proModal" title="进项发票修改" width="650">
      <Form
        ref="proModal"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="130"
      >
        <Row>
          <Col span="11">
            <FormItem label="发票采购方名称：" prop="invoicePurchaserId">
              <Select v-model="formValidate.invoicePurchaserId" clearable>
                <Option
                  v-for="item in purchaserOptionList"
                  :value="item.id"
                  :key="item.value"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税额：" prop="taxAmt">
              <Input v-model="formValidate.taxAmt" clearable />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="店号：" prop="shopNo">
              <Input v-model="formValidate.shopNo" clearable />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税率：" prop="taxRate">
              <Select v-model="formValidate.taxRate" clearable>
                <Option
                  v-for="item in taxOptionList"
                  :value="Number(item.itemValueOne)"
                  :key="item.value"
                  >{{ Math.floor(item.itemValueOne * 100) }} %</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票代码：" prop="invoiceCode">
              <Input v-model="formValidate.invoiceCode" clearable />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="往来单位：" prop="guestName">
              <Input v-model="formValidate.guestName" clearable />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票号：" prop="invoiceNo">
              <Input v-model="formValidate.invoiceNo" clearable />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="付款方式：" prop="payType">
              <Select v-model="formValidate.payType" clearable>
                <Option
                  v-for="item in payOptionList"
                  :value="item.itemCode"
                  :key="item.value"
                  >{{ item.itemName }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票销售方名称：" prop="invoiceSellerName">
              <Input v-model="formValidate.invoiceSellerName" clearable />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票清单类型：" prop="billingType">
              <Select v-model="formValidate.billingType" clearable>
                <Option
                  v-for="item in billingOptionList"
                  :value="item.itemCode"
                  :key="item.itemCode"
                  >{{ item.itemName }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票日期：" prop="billingDate">
              <DatePicker
                type="date"
                :options="options3"
                :value="formValidate.billingDate"
                @on-change="beginTimeChange"
                placeholder="开始时间"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票分类：" prop="invoiceSort">
              <Select v-model="formValidate.invoiceSort" clearable>
                <Option
                  v-for="item in invoiceOptionList"
                  :value="item.itemCode"
                  :key="item.value"
                  >{{ item.itemName }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="价税合计金额：" prop="totalAmt">
              <Input v-model="formValidate.totalAmt" clearable />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="金额：" prop="invoiceAmt">
              <Input v-model="formValidate.invoiceAmt" clearable />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="备注：" prop="remark">
              <Input
                v-model="formValidate.remark"
                clearable
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('proModal')">保存</Button>
        <Button type="default" @click="proModal = false">返回</Button>
      </div>
    </Modal>
    <!-- 核销弹框 -->
    <Modal v-model="modal2" title="智能核销" width="360">
      <p slot="header" style="color:#fff;text-align:center">
        <span>核销成功</span>
      </p>
      <div style="text-align:center">
        <p>已成功核销{{ total }}条数据</p>
      </div>
      <div slot="footer">
        <Button type="success" @click="modal2 = false">确定</Button>
      </div>
    </Modal>
    <modelToast ref="Toast"></modelToast>
    <invoiceApplyTost ref="invoiceApplyTost"></invoiceApplyTost>
  </div>
</template>
<script>
import {
  getManageList,
  deletetManageList,
  invoiceReturnList,
  invoiceRedHedgedList,
  getup,
  authenticationGetup,
  getOptions1,
  getOptions2,
  getOptions3,
  getOptions4,
  getOptions5,
  savDetailInfor,
  invoiceWriteoff
} from "_api/salesManagment/invoiceAdministration";
import {
  getOptionSalesList,
} from "_api/salesManagment/salesInvoice";
import { findGuest } from "_api/settlementManagement/advanceCollection.js";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
import modelToast from "./modelToast.vue";
import quickDate from "@/components/getDate/dateget_bill.vue";
import moment from "moment";
import invoiceApplyTost from "./components/invoiceApplyTost"
export default {
  name: "invoiceAdministrationInvoiceManagement",
  components: {
    modelToast,
    quickDate,
    invoiceApplyTost
  },
  data() {
    return {
      remoteloading: false,
      company: [],
      value: [],
      options3: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      columns: [
        {
          title: "选择",
          minWidth: 50,
          type: "selection",
          fixed: "left"
        },
        {
          title: "序号",
          minWidth: 50,
          fixed: "left",
          render: (h, params) => {
            return h(
              "span",
              params.index + this.form.page * this.form.size + 1
            );
          }
        },
        {
          title: "导入勾选数据时间",
          key: "registrationDate",
          minWidth: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.registrationDate
                  }
                },
                params.row.registrationDate
              )
            ]);
          }
        },
        {
          title: "发票采购方名称",
          key: "invoicePurchaserName",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoicePurchaserName
                  }
                },
                params.row.invoicePurchaserName
              )
            ]);
          }
        },
        {
          title: "店号",
          key: "shopNo",
          minWidth: 60,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.shopNo
                  }
                },
                params.row.shopNo
              )
            ]);
          }
        },
        {
          title: "发票代码",
          key: "invoiceCode",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoiceCode
                  }
                },
                params.row.invoiceCode
              )
            ]);
          }
        },
        {
          title: "发票号",
          key: "invoiceNo",
          minWidth: 65,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoiceNo
                  }
                },
                params.row.invoiceNo
              )
            ]);
          }
        },
        {
          title: "发票销售方名称",
          key: "invoiceSellerName",
          minWidth: 110,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.invoiceSellerName
                  }
                },
                params.row.invoiceSellerName
              )
            ]);
          }
        },
        {
          title: "开票日期",
          key: "billingDate",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.billingDate
                  }
                },
                params.row.billingDate
              )
            ]);
          }
        },
        {
          title: "价税合计金额",
          key: "totalAmt",
          minWidth: 90
        },
        {
          title: "金额",
          key: "invoiceAmt",
          minWidth: 70
        },
        {
          title: "税额",
          key: "taxAmt",
          minWidth: 70
        },
        {
          title: "税率",
          key: "taxRate",
          minWidth: 70
        },
        {
          title: "往来单位",
          key: "guestName",
          minWidth: 70,
          fixed: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.guestName
                  }
                },
                params.row.guestName
              )
            ]);
          }
        },
        {
          title: "付款方式",
          key: "payTypeName",
          minWidth: 70
        },
        {
          title: "发票分类",
          key: "invoiceSortName",
          minWidth: 70
        },
        {
          title: "开票清单类型",
          key: "billingTypeName",
          minWidth: 90
        },
        {
          title: "增加类型",
          key: "addTypeName",
          minWidth: 70
        },
        {
          title: "导入进项经办人",
          key: "importUname",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.importUname
                  }
                },
                params.row.importUname
              )
            ]);
          }
        },
        {
          title: "登记时间",
          key: "registrationTime",
          minWidth: 70,
          className: "tc",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.registrationTime
                  }
                },
                params.row.registrationTime
              )
            ]);
          }
        },
        {
          title: "勾选认证时间",
          key: "checkCertificationTime",
          minWidth: 90,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.checkCertificationTime
                  }
                },
                params.row.checkCertificationTime
              )
            ]);
          }
        },
        {
          title: "认证所属期间",
          key: "",
          className: "tc",
          minWidth: 100
        },
        {
          title: "导入勾选经办人",
          key: "importUname",
          className: "tc",
          minWidth: 100
        },
        {
          title: "是否退回",
          key: "returned",
          className: "tc",
          minWidth: 70,
          render: (h, params) => {
            return h("span", params.row.returned ? "是" : "否");
          }
        },
        {
          title: "退回经办人",
          key: "returnUname",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.returnUname
                  }
                },
                params.row.returnUname
              )
            ]);
          }
        },
        {
          title: "退回时间",
          key: "returnTime",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.returnTime
                  }
                },
                params.row.returnTime
              )
            ]);
          }
        },
        {
          title: "是否红字转出",
          key: "redHedged",
          minWidth: 90,
          render: (h, params) => {
            return h("span", params.row.redHedged ? "是" : "否");
          }
        },
        {
          title: "红冲经办人",
          key: "hedgeUname",
          minWidth: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.hedgeUname
                  }
                },
                params.row.hedgeUname
              )
            ]);
          }
        },
        {
          title: "红冲时间",
          key: "hedgeTime",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.hedgeTime
                  }
                },
                params.row.hedgeTime
              )
            ]);
          }
        },
        {
          title: "对号账单",
          key: "accountNo",
          width: 200,
          render: (h, params) => {
            let arr = [];
            if (params.row.accountNo != null) {
              params.row.accountNo.forEach((item, i) => {
                arr.push(
                  h(
                    "span",
                    {
                      style: {
                        color: "red",
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      on: {
                        click: () => {
                          if(params.row.addTypeName=='导入'){
                            return this.$message.error("本发票信息无进项登记信息");
                          }
                          this.$refs.Toast.modal6 = true;
                          this.$refs.Toast.accountNo = item;
                          this.$refs.Toast.getToastData();
                        }
                      }
                    },
                    item
                  )
                );
              });
            }
            return h("div", arr);
          }
        },
        {
          title: "核销人",
          key: "cancelUname",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.cancelUname
                  }
                },
                params.row.cancelUname
              )
            ]);
          }
        },
        {
          title: "核销时间",
          key: "cancelTime",
          minWidth: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  domProps: {
                    title: params.row.cancelTime
                  }
                },
                params.row.cancelTime
              )
            ]);
          }
        }
      ],
      flag: true,
      flags: true,
      modal2: false,
      data: [],
      pagetotal: 0,
      isActive: "",
      proModal: false,
      formValidate: {
        id: "",
        guestName: "",
        shopNo: "",
        payType: "",
        billingType: "",
        invoicePurchaserId: "",
        billingDate: "",
        invoiceSort: "",
        invoiceNo: "",
        invoiceCode: "",
        taxAmt: "",
        taxRate: "",
        invoiceAmt: "",
        invoiceSellerName: "",
        totalAmt: "",
        remark: ""
      },
      ruleValidate: {
        invoiceCode: [{ message: "必须是10位数字", min: 10, max: 10 }],
        invoiceNo: [{ message: "必须是8位数字", min: 8, max: 8 }],
        taxAmt: [
          {
            type: "number",
            message: "请输入正确格式",
            transform(value) {
              return Number(value);
            }
          }
        ],
        totalAmt: [
          {
            type: "number",
            message: "请输入正确格式",
            transform(value) {
              return Number(value);
            }
          }
        ],
        invoiceAmt: [
          {
            type: "number",
            message: "请输入正确格式",
            transform(value) {
              return Number(value);
            }
          }
        ]
      },
      proType: [],
      form: {
        page: 0,
        size: 10,
        canceled: "",
        guestId: "",
        invoiceSellerName: "",
      },
      allTablist: [],
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
      upurl: getup, // 导入地址
      authenticationUpurl: authenticationGetup, // 导入地址
      exportData: false,
      exportTime: false,
      billingOptionList: [], //开票清单类型
      payOptionList: [], //付款方式
      taxOptionList: [], //税率
      invoiceOptionList: [], //发票分类
      purchaserOptionList: [], //发票采购方
      total: 0, //核销数量
      invoiceUnitOption: [],
    };
  },
  methods: {
    // 往来单位选择
    async getOne(query) {
      this.company = [];
      if (query != "") {
        this.remoteloading = true;
        findGuest({ fullName: query, size: 20 }).then(res => {
          if (res.code === 0) {
            this.company = [];
            res.data.content.map(item => {
              this.company.push({
                value: item.id,
                label: item.fullName
              });
            });
            this.remoteloading = false;
          }
        });
      } else {
        this.company = [];
      }
    },
    query() {
      this.form.startTime = this.value[0]
        ? moment(this.value[0]).format("YYYY-MM-DD")+" 00:00:00"
        : "";
      (this.form.endTime = this.value[1]
        ? moment(this.value[1]).format("YYYY-MM-DD")+" 23:59:59"
        : ""),
      this.getTabList(this.form);
    },
    quickDate(data) {
      this.value = data;
      this.form.startTime = this.value[0]
        ? moment(this.value[0]).format("YYYY-MM-DD")+" 00:00:00"
        : "";
      (this.form.endTime = this.value[1]
        ? moment(this.value[1]).format("YYYY-MM-DD")+" 23:59:59"
        : ""),
        this.query();
    },
    changedate(daterange) {
      this.value = daterange;
      // console.log(daterange,11111)
      this.query();
    },
    // 表格合计方式
    handleSummary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          const type = column.type;
          sums[type] = {
            title: "合计",
            value: "合计"
          };
          return;
        }
        const values = data.map(item => Number(item[key]));
        if (index > 8 && index < 12) {
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key,
              value: v.toFixed(2)
            };
          }
        } else {
          sums[key] = {
            key,
            value: " "
          };
        }
      });
      return sums;
      //
    },
    beginTimeChange(dataTime) {
      this.formValidate.billingDate = dataTime;
    },
    //操作
    operation(num) {
      switch (num) {
        case 1:
          this.exportData = true;
          break;
        case 2:
          this.modifyData();
          break;
        case 3:
          this.deleteTabList("delete");
          break;
        case 4:
          this.deleteTabList("writeoff");
          break;
        case 5:
          this.deleteTabList("return");
          break;
        case 6:
          this.deleteTabList("rewors");
          break;
        case 7:
          this.exportTime = true;
        case 8:
          this.deleteTabList("toast");
          break;
        default:
          break;
      }
    },
    //操作项
    deleteTabList(type) {
      if (!this.allTablist.length) {
        let content = "";
        if (type == "delete") {
          this.$Message.warning("请选择要删除的数据！");
        } else if (type == "return") {
          this.$Message.warning("请选择要退回的数据！");
        } else if (type == "rewors") {
          this.$Message.warning("请选择要进项转出的数据！");
        } else {
          this.$Message.warning("请选择要核销的数据！");
        }
        return;
      } else {
        let tittle = "";
        if (type == "delete") {
          tittle = "<p>确认要删除选中的数据？</p>";
        } else if (type == "return") {
          tittle = "<p>确认要退回选中的数据？</p>";
        } else if (type == "rewors") {
          tittle = "<p>确认要进项转出选中的数据？</p>";
        } else {
          tittle = "<p>确认要核销选中的数据？</p>";
        }
        this.flags = true;
        this.allTablist.forEach((item, index) => {
          if (item.canceled == 1) {
            return (this.flag = false);
          } else {
            this.flag = true;
          }
          if (item.canceled == 0 && (type == "writeoff" || type ==  "toast")) {
            return (this.flags = false);
          }
        });
        if (this.flags && (type == "writeoff" || type ==  "toast")) {
          return this.$Message.warning(
            "该数据中存在已核销数据，请选择未核销数据"
          );
        }
        if (
          (this.flag == false && type == "return") ||
          (this.flag == false && type == "rewors")
        ) {
          return this.$Message.warning(
            "该数据中存在已核销数据，请选择未核销数据"
          );
        }
        if(type === "toast") {
          this.$refs.invoiceApplyTost.init(this.allTablist);
          return;
        }
        this.$Modal.confirm({
          title: "警告",
          content: tittle,
          onOk: () => {
            let message = "";
            let deleteList = [];
            this.allTablist.forEach((item, index) => {
              deleteList.push({
                id: item.id
              });
            });
            if (type == "delete") {
              deletetManageList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("删除成功！");
                    this.allTablist = [];
                    this.getTabList(this.form);
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "return") {
              invoiceReturnList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("退回成功！");
                    this.allTablist = [];
                    this.getTabList(this.form);
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "rewors") {
              invoiceRedHedgedList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("进项转出成功！");
                    this.allTablist = [];
                    this.getTabList(this.form);
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "writeoff") {
              invoiceWriteoff(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.total = res.data;
                    this.allTablist = [];
                    this.getTabList(this.form);
                    this.modal2 = true;
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
          },
          onCancel: () => {}
        });
      }
    },
    //修改
    modifyData() {
      if (!this.allTablist.length) {
        this.$Message.warning("请选择要修改数据！");
        return;
      } else if (this.allTablist.length >= 2) {
        this.$Message.warning("请选择一条要修改数据！");
      } else {
        this.allTablist.forEach((item, index) => {
          if (item.canceled == 1) {
            return (this.flag = false);
          } else {
            return (this.flag = true);
          }
        });
        if (this.flag == false) {
          this.$Message.warning("该数据中存在已核销数据，请选择未核销数据");
        } else {
          this.getDetailInfor();
          this.proModal = true;
        }
      }
    },
    //选择操作项目
    chooseTable(num) {
      this.allTablist = [];
      this.isActive = num;
      this.form.page = 0;
      this.form.canceled = num;
      this.getTabList(this.form);
    },
    //单选
    // election(val) {
    // },
    handleBeforeUpload() {},
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    handleSuccess(response) {
      if (response.code == 0) {
        // let txt = "上传成功";
        // if (response.data) {
        //   txt = response.message;
        // }
        // this.$Message.success({
        //   title: "导入成功",
        //   desc: txt,
        //   duration: 0
        // });
        this.$Message.success("导入成功");
        this.exportData = false;
        this.getTabList(this.form);
      } else {
        // let txt = "上传失败";
        // txt = response.message;
        // this.$Message.success({
        //   title: "导入失败",
        //   desc: txt,
        //   duration: 0
        // });
        this.$Message.error(response.message);
        this.exportData = false;
        this.getTabList(this.form);
      }
    },
    //获取下拉菜单
    getSelectOptions() {
      //清单类型
      getOptions1({ dictCode: "BILL_LIST_TYPE" })
        .then(res => {
          if (res.code === 0) {
            this.billingOptionList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      //发票分类
      getOptions2({ dictCode: "INVOICE_TYPE" })
        .then(res => {
          if (res.code === 0) {
            this.invoiceOptionList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      //付款方式
      getOptions3({ dictCode: "PAYMENT_TYPE" })
        .then(res => {
          if (res.code === 0) {
            this.payOptionList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      //税率
      getOptions4({ dictCode: "CS00107" })
        .then(res => {
          if (res.code === 0) {
            this.taxOptionList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      //发票采购方
      getOptions5({ tenantId: 0 })
        .then(res => {
          if (res.code === 0) {
            this.purchaserOptionList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查看详情
    getDetailInfor() {
      for (let key in this.formValidate) {
        this.formValidate[key] = this.allTablist[0][key];
      }
    },
    //表格全选
    requires(val) {
      this.allTablist = val;
    },
    //获取列表
    getTabList(data) {
      getManageList(data)
        .then(res => {
          if (res.code === 0) {
            this.data = res.data.content;
            this.pagetotal = res.data.totalElements;
          }
        })
        .catch(err => {});
    },
    pageNumChange(pageNum) {
      this.form.page = pageNum;
      this.getTabList(this.form);
    },
    pageSizeChange(pageSize) {
      this.form.page = 0;
      this.form.size = pageSize;
      this.getTabList(this.form);
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          savDetailInfor(this.formValidate)
            .then(res => {
              if (res.code === 0) {
                this.$Message.success("修改成功");
                this.proModal = false;
                this.getTabList(this.form);
              }
            })
            .catch(err => {
              this.$Message.success(res.message);
            });
        }
      });
    },
    // 导出模板
    exportDown() {
      location.href =
        baseUrl.omsSettle +
        "/entryRegistration/template?access_token=" +
        Cookies.get(TOKEN_KEY);
    },
    //  导出勾选认证时间模板
    exportCertification() {
      location.href =
        baseUrl.omsSettle +
        "/entryRegistration/checkTemplate?access_token=" +
        Cookies.get(TOKEN_KEY);
    },
    //  导入进项管理
    uploading() {
      this.upurl = getup;
    },
    //  导入勾选认证时间
    importCertification() {
      this.authenticationUpurl = authenticationGetup;
    },
  },
  async mounted() {
    this.getSelectOptions();
    await getOptionSalesList("KPDW").then(res => {
      if (res.code === 0) {
        this.invoiceUnitOption = res.data;
      }
    });
    this.getTabList(this.form);
  }
};
</script>
<style lang="less" scoped>
.flexd {
  display: flex;
}
.exportBtn {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}
.wlf > div {
  padding-top: 0;
}
</style>

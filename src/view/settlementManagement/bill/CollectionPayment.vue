<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>对账期间：</span>
            <Date-picker
              :value="value"
              type="daterange"
              placeholder="选择日期"
              class="w200"
              @on-change="dateChange"
            ></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="BranchstoreId" class="w150" @on-change="fendian" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName }}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>往来单位：</span>
            <!-- <Select
              v-model="companyId"
              class="w150"
              clearable
              filterable
              remote
              :loading="remoteloading"
              :remote-method="getOne"
              @on-change="query"
            >
              <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
            <input type="text" class="h30" v-model="companyId" />
            <!-- <i class="iconfont iconcaidan input" @click="Dealings"></i> -->
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml10">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="openMore">
              <i class="iconfont iconcaidan"></i>
              <span>更多</span>
            </button>
          </div>
          <!--          <div class="db ml10">-->
          <!--            <button-->
          <!--              class="mr10 ivu-btn ivu-btn-default"-->
          <!--              type="button"-->
          <!--              @click="report"-->
          <!--              v-has="'export'"-->
          <!--            >导出</button>-->
          <!--          </div>-->
          <div class="db ml10">
            <Poptip placement="bottom">
              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出
              </button>
              <div slot="content">
                <button
                  class="mr8 ivu-btn ivu-btn-default"
                  type="button"
                  @click="reportPayment(2,'all')"
                >导出全部
                </button>
                <button
                  class="mr8 ivu-btn ivu-btn-default"
                  type="button"
                  @click="reportPayment(2,'parts')"
                >导出勾选
                </button>
              </div>
            </Poptip>
          </div>
          <!--          <div class="db ml10">-->
          <!--            <Poptip placement="bottom">-->
          <!--              <button class="mr10 ivu-btn ivu-btn-default" type="button">导出收付款单-->
          <!--              </button>-->
          <!--              <div slot="content">-->
          <!--                <button-->
          <!--                  class="mr8 ivu-btn ivu-btn-default"-->
          <!--                  type="button"-->
          <!--                  @click="reportPayment(1,'all')"-->
          <!--                >导出全部-->
          <!--                </button>-->
          <!--                <button-->
          <!--                  class="mr8 ivu-btn ivu-btn-default"-->
          <!--                  type="button"-->
          <!--                  @click="reportPayment(1,'parts')"-->
          <!--                >导出勾选-->
          <!--                </button>-->
          <!--              </div>-->
          <!--            </Poptip>-->
          <!--          </div>-->
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          show-summary
          highlight-row
          :summary-method="handleSummary"
          @on-selection-change="selectTabSummary"
          @on-select-all="selectAllSummary"
          @on-row-click="election"
          max-height="400"
        >
          <template slot-scope="{ row }" slot="fno">
            <div class="boxFno">
              <span class="ellipsis">{{ row.fno.split(';')[0] }};{{ row.fno.split(';')[1] }}</span>
              <span class="ellipsis" v-if="row.fno.split(';')[1]">...</span>
              <span class="hoverFno">{{row.fno}}</span>
            </div>
          </template>
        </Table>
        <div class="clearfix">
          <Page
            class-name="fr mb10 mt10"
            size="small"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            :page-size-opts="page.sizeArr"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
          ></Page>
        </div>
        <Tabs v-model="tab" class="mt10" @click="tabName">
          <Tab-pane label="收款单记录" name="key1">
            <Table
              border
              :columns="columns1"
              :data="data1"
              class="mt10"
              style="width:100%"
              ref="receivables"
              show-summary
              :summary-method="summary"
              max-height="400"
            ></Table>
          </Tab-pane>
          <Tab-pane label="付款单记录" name="key2">
            <Table
              border
              :columns="columns2"
              :data="data2"
              class="mt10"
              style="width:100%"
              ref="payment"
              show-summary
              :summary-method="summary"
              max-height="400"
            ></Table>
          </Tab-pane>
        </Tabs>
      </div>
    </section>
    <Modal v-model="modal1" title="高级查询" @on-ok="ok" @on-cancel="modal1=false">
      <Form :label-width="120">
        <FormItem label="对账单号：">
          <Input type="text" class="w200" v-model="accountNo"/>
        </FormItem>
        <FormItem label="收付款单号：">
          <Input type="text" class="w200" v-model="fno"/>
        </FormItem>
        <FormItem label="收付款人：">
          <Input type="text" class="w200" v-model="createUname"/>
        </FormItem>
        <FormItem label="审核状态：">
          <Select v-model="startStatusName" style="width:200px">
            <Option v-for="item in statelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {
    findGuest,
    importPaymentRecord/**导出收付款单*/,
    exportMethod
  } from "_api/settlementManagement/advanceCollection.js";
  import {getbayer} from "@/api/AlotManagement/threeSupplier";
  // import selectDealings from "./components/selectCompany";
  import {getSupplierList} from "_api/purchasing/purchasePlan";
  import {creat} from "./../components";
  import {
    getReceiptsPaymentsSummary,
    getReceiptsPaymentsList
  } from "@/api/bill/saleOrder";
  import {goshop} from '@/api/settlementManagement/shopList';
  import {
    colPayExportLogHis/**导出收付款单记录*/,
    colPayExportQuery/**导出收付款单*/
  } from "@/api/settlementManagement/Import/index.js"
  import moment from "moment";
  import {set} from "xe-utils/methods";
  import index from "../../admin/roles";
  import api from "_conf/url";
  import {v4} from "uuid";
  import Cookies from "js-cookie";
  import {TOKEN_KEY} from "../../../libs/util";
  import qs from "qs"
  import {showLoading, hideLoading} from "@/utils/loading"

  export default {
    name: "billCollectionPayment",
    components: {
      quickDate
    },
    data() {
      return {
        remoteloading: false,
        BranchstoreId: "",
        tab: "key1",
        value: [],
        Branchstore: [
          {id: 0, name: '全部',shortName:"全部"}
        ], //分店名称
        page: {
          total: 0,
          sizeArr: [10, 20, 30, 40, 50],
          size: 10,
          num: 1
        },
        model1: "",
        modal1: false,
        statelist: [
          {
            value: "0",
            label: "未审"
          },
          {
            value: "1",
            label: "已审"
          }
        ],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            className: "tc",
            resizable: true,
          },
          {
            title: "序号",
            key: "num",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "公司名称",
            key: "groupName",
            width:200,
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.groupName
                  }
                }, params.row.groupName)
              ])
            }
          },
          {
            title: "对账单号",
            key: "accountNo",
            width:200,
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.accountNo
                  }
                }, params.row.accountNo)
              ])
            }
          },
          {
            title: "对账单收付款单号",
            width: 140,
            slot: "fno",
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.fno
                  }
                }, params.row.fno)
              ])
            }
          },
          {
            title: "往来单位",
            key: "guestName",
            className: "tc",
            resizable: true,
            width:200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.guestName
                  }
                }, params.row.guestName)
              ])
            }
          },
          {
            title: "收付类型",
            key: "sortName",
            className: "tc",
            resizable: true,
            width: 120
          },
          {
            title: "收付款金额",
            key: "cpAmt",
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h(
                "span",
                params.row.cpAmt ? parseFloat(params.row.cpAmt).toFixed(2) : 0
              );
            },
            width:200
          },
          {
            title: "已冲减/已审核",
            key: "endAmt",
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h(
                "span",
                params.row.endAmt ? parseFloat(params.row.endAmt).toFixed(2) : 0
              );
            },
            width:200
          },
          {
            title: "未冲减/未审核",
            key: "unAmt",
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h(
                "span",
                params.row.unAmt ? parseFloat(params.row.unAmt).toFixed(2) : 0
              );
            },
            width:200
          },
          {
            title: "收款目的",
            key: "purpose",
            className: "tc",
            resizable: true,
            width:200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.purpose
                  }
                }, params.row.purpose)
              ])
            }
          },
          {
            title: "收付款人",
            key: "createUname",
            className: "tc",
            resizable: true,
            width:200
          },
          {
            title: "收付款时间",
            key: "rpDate",
            className: "tc",
            resizable: true,
            width:200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.rpDate
                  }
                }, params.row.rpDate)
              ])
            }
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            resizable: true,
            width:200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.remark
                  }
                }, params.row.remark)
              ])
            }
          },
          {
            title: "审核状态",
            key: "startStatusName",
            className: "tc",
            resizable: true,
            width:200
          },
          {
            title: "审核人",
            key: "auditor",
            className: "tc",
            resizable: true,
            width:200
          },
          {
            title: "审核日期",
            key: "auditorDate",
            className: "tc",
            resizable: true,
            width:200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.auditorDate
                  }
                }, params.row.auditorDate)
              ])
            }
          }
        ],
        columns1: [
          {
            title: "序号",
            key: "num",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "收款单号",
            key: "fno",
            className: "tc", width:200,
            resizable: true,
          },
          {
            title: "收款时间",
            key: "checkDate",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "收款方式",
            width:200,
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h('span', params.row.sort.name)
            }
          },
          {
            title: "收款账户",
            key: "account",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "收款金额",
            key: "checkAmt",
            className: "tc",
            width: 200,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.checkAmt.toFixed(2));
            }
          },
          {
            title: "审核状态",
            key: "startStatusName",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "审核人",
            key: "auditor",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "审核日期",
            key: "auditorDate",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            width:200,
            resizable: true,
          }
        ],
        columns2: [
          {
            title: "序号",
            key: "num",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "付款单号",
            key: "fno",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "付款时间",
            key: "checkDate",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "付款方式",
            width: 120,
            className: "tc",
            resizable: true,
            render: (h, params) => {
              return h('span', params.row.sort.name)
            }
          },
          {
            title: "付款账户",
            key: "account",
            className: "tc",
            width:200,
            resizable: true,
          },
          {
            title: "付款金额",
            key: "checkAmt",
            className: "tc",
            width:200,
            resizable: true,
            render: (h, params) => {
              return h("span", params.row.checkAmt.toFixed(2));
            }
          },
          {
            title: "审核状态",
            key: "startStatusName",
            className: "tc",
            width:200,
          },
          {
            title: "审核人",
            key: "auditor",
            className: "tc",
            width:200,
          },
          {
            title: "审核日期",
            key: "auditorDate",
            className: "tc",
            width:200,
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            width:200,
          }
        ],
        data: [],
        total: {},//收付款单查询 总合计对象
        data1: [],
        data2: [],
        company: [], //往来单位
        companyId: "", //往来单位id
        fno: "", //更多查询收付款单号
        accountNo: "", //更多查询对账单号
        createUname: "", //收付款人
        startStatusName: "", //审核状态

        selectData: []
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.getShop()
      this.$nextTick(() => {
        this.BranchstoreId = arr[1]
        this.getGeneral();
      })
      // this.getOne();
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      }
    },
    methods: {
      // query() {
      //   this.getQuery();
      // },
      async getOne(query) {
        this.company = [];
        if (query != "") {
          this.remoteloading = true;
          findGuest({fullName: query, size: 20}).then(res => {
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
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.Branchstore = [...this.Branchstore, ...res.data]
      },
      // 日期选择
      dateChange(data) {
        this.value = data;
        this.getGeneral()
      },
      // 表格合计方式
      handleSummary({columns, data}) {
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 1) {
            sums[key] = {
              key,
              value: "总合计"
            };
            return;
          }
          if (index > 5 && index < 10) {
            sums[key] = {
              key,
              value: this.total[key] == null ? " " : this.total[key]
            };
          } else {
            sums[key] = {
              key,
              value: " "
            };
          }
        });
        return sums
      },
      // 表格合计方式
      summary({columns, data}) {
        //   console.log(columns,data)
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: "合计"
            };
            return;
          }
          const values = data.map(item => Number(item[key]));
          if (index === 5) {
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
      openMore() {
        this.accountNo = '';
        this.fno = "";
        this.createUname = "";
        this.startStatusName = ""
        this.modal1 = true
      },
      //查询
      query() {
        this.data1 = [];
        this.data2 = [];
        this.page.num = 1
        this.getGeneral();
      },
      changePage(p) {
        console.log(p)
        this.page.num = p;
        this.getGeneral();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getGeneral();
      },
      // 往来单位选择
      // async getOne() {
      //   findGuest({ size: 2000 }).then(res => {
      //     if (res.code === 0) {
      //       res.data.content.map(item => {
      //         this.company.push({
      //           value: item.id,
      //           label: item.fullName
      //         });
      //       });
      //     }
      //   });
      // },
      // 分店切换
      fendian(val) {
        this.BranchstoreId = val;
        this.getGeneral()
      },
      // 快速查询
      quickDate(data) {
        this.value = data;
        this.getGeneral();
      },
      // 往来单位
      Dealings() {
        this.$refs.selectDealings.init();
      },
      // tab标签页的name
      tabName(name) {
        this.tab = name;
      },
      //checkbox 单个选择
      selectTabSummary(selection) {
        this.selectData = selection
      },
      //checkbox 选择全部
      selectAllSummary(selection) {
        this.selectData = selection
      },
      //导出 收付款单查询 接口
      exportQueryMethod(data, type) {
        var str = ""
        if (type == "all") {
          let obj = {
            startTime: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endTime: this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : "",
            orgId: this.BranchstoreId == 0 ? "" : this.BranchstoreId,
            guestId: this.companyId,
            accountNo: this.accountNo,
            fno: this.fno,
            createUname: this.createUname,
            documentStatus: this.startStatusName,
            size: this.page.total,
            page: 0
          }
          for (var i in obj) {
            str += `${i}=${obj[i]}&`
          }
          location.href = colPayExportQuery(str)
        } else {
          data.map(item => {
            str += `ids=${item}&`
          })
          let params = `${str}size=${data.length}&page=0&`
          location.href = colPayExportQuery(params)
        }
      },
      //导出 收付款单查询记录 接口
      exportLogMethod(data, type) {
        if (type == "all") {
          let obj = {
            startTime: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endTime: this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : "",
            orgId: this.BranchstoreId == 0 ? "" : this.BranchstoreId,
            guestId: this.companyId,
            accountNo: this.accountNo,
            fno: this.fno,
            createUname: this.createUname,
            documentStatus: this.startStatusName,
            pagesize: this.page.total,
          }
          for (var i in obj) {
            str += `${i}=${obj[i]}&`
          }
        }
        let str = ""
        data.map(item => {
          str += `accounNos=${item}&`
        })
        let params = `${str}size=${data.length}&page=0&`
        location.href = colPayExportLogHis(params)
      },
      //导出 收付款单查询/收付款单查询记录
      async reportPayment(type, type2) {
        if (this.data.length < 1) {
          return this.$Message.error("暂无数据可导出")
        }
        var str = ""
        if (type2 == "all") {
          let obj = {
            startTime: this.value[0]
              ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
              : "",
            endTime: this.value[1]
              ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
              : "",
            orgId: this.BranchstoreId == 0 ? "" : this.BranchstoreId,
            guestName: this.companyId,
            accountNo: this.accountNo,
            fno: this.fno,
            createUname: this.createUname,
            documentStatus: this.startStatusName,
            pagesize: this.page.total,
          }
          for (var i in obj) {
            str += `${i}=${obj[i]}&`
          }
          location.href = colPayExportQuery(str)
        } else {
          if (this.selectData.length < 1) {
            return this.$Message.error("请选择需要导出的数据!")
          }
          this.selectData.map(item => {
            str += `ids=${item.id}&`
          })
          let params = `${str}pagesize=${this.selectData.length}&`
          location.href = colPayExportQuery(params)
        }
      },
      // 导出
      report() {
        if (this.data.length !== 0) {
          this.$refs.summary.exportCsv({
            filename: "收付款查询"
          });
        } else {
          this.$message.error("收付款总表暂无数据");
        }
        if (this.tab === "key1") {
          if (this.data1.length !== 0) {
            this.$refs.receivables.exportCsv({
              filename: "收款单明细"
            });
          } else {
            this.$message.error("收款单明细暂无数据");
          }
        } else if (this.tab === "key2") {
          if (this.data2.length !== 0) {
            this.$refs.payment.exportCsv({
              filename: "付款单明细"
            });
          } else {
            this.$message.error("付款单明细暂无数据");
          }
        }
      },
      // 高级查询确认
      ok() {
        this.getGeneral();
      },
      cancel() {

      },
      // 总表查询
      getGeneral() {
        let data = {
          startTime: this.value[0]
            ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss")
            : "",
          endTime: this.value[1]
            ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59"
            : "",
          orgId: this.BranchstoreId == 0 ? "" : this.BranchstoreId,
          guestName: this.companyId.trim(),
          accountNo: this.accountNo,
          fno: this.fno,
          createUname: this.createUname,
          documentStatus: this.startStatusName,
        };
        let params = {
          size: this.page.size,
          page: this.page.num - 1
        }
        showLoading(".loadingClass", "数据加载中，请勿操作")
        getReceiptsPaymentsSummary(params, data).then(res => {
          if (res.data.paymentRecordVosTemp.length !== 0) {
            res.data.paymentRecordVosTemp.map((item, index) => {
              item.num = index + 1;
              item.sortName = item.sort.name;
              item.startStatusName = item.startStatus.name;
            });
            this.data = res.data.paymentRecordVosTemp;
            this.page.total = res.data.TotalElements;
            this.total = res.data.PaymentRecordVo;
            this.selectData = []
            hideLoading()
          } else {
            hideLoading()
            this.data = [];
            this.selectData = []
          }
        }).catch(e => {
          hideLoading()
        });
      },
      // 选中总表查询明细
      election(row) {
        getReceiptsPaymentsList({accountNo: row.accountNo}).then(res => {
          if (res.data.length !== 0) {
            res.data.map((item, index) => {
              item.num = index + 1;
              item.serviceTypeName = item.serviceType.name;
              item.startStatusName = item.startStatus.name;
            });
            this.data1 = res.data.filter(item => item.documentType == 1)
            this.data2 = res.data.filter(item => item.documentType == -1)
          } else {
            this.data1 = [];
            this.data2 = [];
          }
        });
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
    width:200px;
    text-align: right;
  }

  .hoverFno {
    display: none;
  }

  .boxFno:hover .hoverFno {
    display: inline-block;
  }

  .boxFno:hover .ellipsis {
    display: none;
  }
</style>

<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <!--<span>快速查询：</span>-->
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml20">
            <span>制单日期：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"
                         @on-change="dateChange"></Date-picker>
          </div>
          <div class="db ml20">
            <span>分店名称：</span>
            <Select v-model="model1" filterable class="w150" @on-change="getTransferStock" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName }}
              </Option>
            </Select>
          </div>
          <div class="db ml20">
            <span>客户名称：</span>
            <Input type="text" class="w200" v-model="company" readonly clearable/>
            <i class="iconfont iconcaidan input" @click="Dealings"></i>
          </div>
          <div class="db mr10">
            <span>类型：</span>
            <Select v-model="type" style="width:200px" @on-change="changePage(1)">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input
              v-model="partCodeOrName"
              placeholder="配件编码/名称"
              class="w200"
              clearable
            />
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="changePage(1)">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
          <!--          <div class="db ml10">-->
          <!--            <Poptip placement="bottom">-->
          <!--              <button class="mr10 ivu-btn ivu-btn-default" type="button" v-has="'export'">导出</button>-->
          <!--              <div slot="content">-->
          <!--                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(0)">导出全部</button>-->
          <!--                <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="report(1)">导出勾选</button>-->
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
          :summary-method="handleSummary"
          highlight-row
          max-height=500
          @on-row-click="election"
          @on-selection-change="selectTab"
          @on-select-all="selectTab"
        ></Table>
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
        <button class="mt10 ivu-btn ivu-btn-default" type="button">配件明细</button>
        <vxe-table
          border
          auto-resize
          resizable
          stripe
          align="center"
          show-overflow="title"
          size="mini"
          :data="data1"
          :loading="detailLoading"
          class="mt10"
          max-hight="400"
          :footer-method="summary"
          ref="parts"
          show-footer
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column title="分店名称" field="shortName" width="60"></vxe-table-column>
          <vxe-table-column title="店号" field="orgCode" width="60"></vxe-table-column>
          <vxe-table-column title="出库/入库单号" field="serviceId" width="100"></vxe-table-column>
          <vxe-table-column title="出库/入库日期" field="outDate" width="100"></vxe-table-column>
          <vxe-table-column title="客户名称" field="guestName" width="100"></vxe-table-column>
          <vxe-table-column title="申请人" field="orderMan" width="80"></vxe-table-column>
          <vxe-table-column title="仓库" field="storeName" width="80"></vxe-table-column>
          <vxe-table-column title="配件编码" field="partCode" width="80"></vxe-table-column>
          <vxe-table-column title="配件名称" field="partName" width="80"></vxe-table-column>
          <vxe-table-column title="OE码" field="oemCode" width="80"></vxe-table-column>
          <vxe-table-column title="配件品牌" field="partBrand" width="100"></vxe-table-column>
          <vxe-table-column title="品牌车型" field="carModelName" width="100"></vxe-table-column>
          <vxe-table-column title="规格" field="spec" width="60"></vxe-table-column>
          <vxe-table-column title="单位" field="unit" width="60"></vxe-table-column>
          <vxe-table-column title="数量" field="orderQty" width="60"></vxe-table-column>
          <vxe-table-column title="单价" field="orderPrice" width="60"></vxe-table-column>
          <vxe-table-column title="金额" field="orderAmt" width="60"></vxe-table-column>
          <vxe-table-column title="配件明细备注" field="detailRemark" width="100"></vxe-table-column>
          <vxe-table-column title="订单号" field="code" width="100"></vxe-table-column>
          <vxe-table-column title="提交人" field="createUname" width="100"></vxe-table-column>
          <vxe-table-column title="提交日期" field="createTime" width="100"></vxe-table-column>
          <vxe-table-column title="订单备注" field="remark" width="100"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <selectDealings ref="selectDealings" @getOne="getOne"/>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_noEmit.vue";
  import selectDealings from "./components/SelectTheCustomer";
  import {creat} from "./../components";
  import {transferStock, stockParts} from "@/api/bill/saleOrder";
  import {allocationStockExport/**导出全部及导出明细*/} from "@/api/settlementManagement/Import/index.js"
  import {goshop} from '@/api/settlementManagement/shopList'
  import moment from 'moment';
  import {showLoading, hideLoading} from "@/utils/loading"
  // import { dragTable } from '@/libs/dragtable'
  export default {
    name: "billAllocationstock",
    components: {
      quickDate,
      selectDealings
    },
    data() {
      return {
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
        total: {},//总合计对象
        model1: "",
        modal1: false,
        partCodeOrName:'',
        columns: [
          {
            key: 'id',
            type: 'selection',
            width: 60,
            align: 'center',
            className: "tc",
            resizable: true,
          },
          {
            key: 'index',
            title: "序号",
            width: 40,
            className: "tc",
            resizable: true,
          },
          {
            title: "分店名称",
            key: "guestOrgName",
            className: "tc",
            resizable: true,
            width: 150,
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
                    title: params.row.guestOrgName
                  }
                }, params.row.guestOrgName)
              ])
            }
          },
          {
            title: "出库单号",
            key: "serviceId",
            className: "tc",
            resizable: true,
            width: 150,
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
                    title: params.row.serviceId
                  }
                }, params.row.serviceId)
              ])
            }
          },
          {
            title: "客户名称",
            key: "guestName",
            className: "tc",
            resizable: true,
            width: 100,
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
            title: "订单号",
            key: "code",
            className: "tc",
            resizable: true,
            width: 150,
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
                    title: params.row.code
                  }
                }, params.row.code)
              ])
            }
          },
          {
            title: "单据类型",
            key: "orderTypeId",
            className: "tc",
            resizable: true,
            width: 100
          },
          {
            title: "仓库",
            key: "storeName",
            className: "tc",
            resizable: true,
            width: 100,
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
                    title: params.row.storeName
                  }
                }, params.row.storeName)
              ])
            }
          },
          {
            title: "创建人",
            key: "createUname",
            className: "tc",
            resizable: true,
            width: 100,
          },
          {
            title: "创建日期",
            key: "createTime",
            className: "tc",
            resizable: true,
            width: 150,
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
                    title: params.row.createTime
                  }
                }, params.row.createTime)
              ])
            }
          },
          {
            title: "提交人",
            key: "commitUname",
            className: "tc",
            resizable: true,
            width: 100,
          },
          {
            title: "提交日期",
            key: "commitDate",
            className: "tc",
            resizable: true,
            width: 150,
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
                    title: params.row.commitDate
                  }
                }, params.row.commitDate)
              ])
            }
          },
          {
            title: "金额",
            key: "orderAmt",
            className: "tc",
            resizable: true,
            width: 100,
          },
          {
            title: "单据状态",
            key: "billstate",
            className: "tc",
            resizable: true,
            width: 100,
          },
          {
            title: "备注",
            key: "remark",
            className: "tc",
            resizable: true,
            width: 150,
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
          }
        ],
        selectTabArr: [],//选中数组
        data: [],
        data1: [],
        detailLoading:false,
        typelist: [
          {
            value: "1",
            label: "调拨出库"
          },
          {
            value: "3",
            label: "调出退货"
          }
        ],
        company: "", //往来单位
        companyId: "", //往来单位id
        type: "1"//类型
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store);
      this.value = arr[0];
      this.model1 = arr[1];
      this.getShop();
      this.$refs.quickDate.getval(1);
      // const res = await this.getTransferStock();
      // let dom = this.$refs.summary.$refs.header.getElementsByTagName("th");
      // dragTable(this,dom);
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
      //获取门店
      async getShop() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.Branchstore = [...this.Branchstore, ...res.data]
      },
      // 日期选择
      dateChange(data) {
        this.value = data
        this.getTransferStock(this.page)
      },
      // 表格合计方式
      handleSummary({columns, data}) {
        //   console.log(columns,data)
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key,
              value: "总合计"
            };
            return;
          }
          if (index === 11) {
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
        return sums;
        //
      },
      // 配件表格合计方式
      summary({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (
              [
                "orderQty",
                "orderPrice",
                "orderAmt",
              ].includes(column.property)
            ) {
              return this.$utils.sum(data, column.property);
            }
            return null;
          }),]
      },
      query() {
        this.data1 = []
        this.getTransferStock(this.page)
      },
      changePage(p) {
        this.page.num = p;
        this.query();
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.query();
      },
      // 往来单位选择
      getOne(data) {
        this.company = data.fullName;
        this.companyId = data.id;
        this.getTransferStock(this.page)
      },
      // 快速查询
      quickDate(data) {
        this.value = data;
        this.page.num=1;
        // this.model1 = this.$store.state.user.userData.shopId
        this.getTransferStock(this.page)
      },
      // 主表查询
      getTransferStock(params) {
        let obj = {
          startTime: this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '',
          endTime: this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD HH:mm:ss") : '',
          orgid: this.model1 == 0 ? "" : this.model1,
          guestId: this.company ? this.companyId : "",
          orderTypeId: this.type
        };
        let param = {
          size: params.size,
          page: params.num - 1
        }
        if (obj.endTime) {
          obj.endTime = obj.endTime.split(' ')[0] + " 23:59:59"
        }
        if(this.partCodeOrName){
          obj.partCode = this.partCodeOrName;
        }
        showLoading(".loadingClass", "数据加载中，请勿操作")
        transferStock(param, obj).then(res => {
          if (res.data.vos.length !== 0) {
            res.data.vos.map((item, index) => {
              item.index = index + 1;
              item.billstate = item.settleStatus ? item.settleStatus.value ? '已出库' : '未出库' : ''
              item.orderTypeId = item.orderTypeId === 1 ? "调拨出库" : "调出退货";
            });
            this.data = res.data.vos;
            this.page.total = res.data.TotalElements;
            this.total = res.data.AllotOutMainVO
            this.selectTabArr = []
            hideLoading()
          } else {
            hideLoading()
            this.data = [];
            this.selectTabArr = []
            this.page.total = res.data.TotalElements;
          }
        }).catch(e => {
          hideLoading()
        });
      },
      // 往来单位
      Dealings() {
        this.$refs.selectDealings.addressShow = true
      },
      // 高级查询
      ok() {
      },
      selectTab(selection) {
        this.selectTabArr = selection
      },
      // 导出汇总/配件明细
      report(type) {
        if (this.data.length < 1) {
          return this.$Message.error("没有数据可导出")
        }
        let params;
        let data = {
          pagesize: this.page.total
        };
        //导出全部参数同查询接口
        //导出勾选参数为ids=选中id以及分页参数
        if (type == 0) {
          data.type = "all";
          data.startTime = this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD HH:mm:ss") : '';
          data.endTime = this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") + " 23:59:59" : '';
          data.orgid = this.model1 == 0 ? "" : this.model1;
          data.guestId = this.company ? this.companyId : "";
          data.orderTypeId = this.type
          for(let i in data){
            data[i]==undefined?delete data[i]:""
          }
          params = "parts"
          location.href = allocationStockExport(params, data)
          // console.log( allocationStockExport(params, data))
        } else {
          params = this.selectTabArr;
          data.type = "parts";
          if (this.selectTabArr.length < 1) {
            return this.$Message.error("请勾选需要导出的数据!")
          }
          data.pagesize = this.selectTabArr.length;
          data.orderTypeId = this.type
          location.href = allocationStockExport(params, data)
          // console.log( allocationStockExport(params, data))
        }
      },
      // 选中数据
      election(row) {
        this.detailLoading=true;
        stockParts({serviceId: row.serviceId}).then(res => {
          if (res.data.length !== 0) {
            res.data.map((item, index) => {
              item.index = index + 1;
              // item.taxSign = 1;
              item.taxSign = item.taxSign ? "是" : "否  ";
            });
            this.data1 = res.data;
            this.detailLoading=false;
          } else {
            this.data1 = [];
            this.detailLoading=false;
          }
        }).catch(err=>{
          this.detailLoading=false;
        })
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
    width: 100px;
    text-align: right;
  }
</style>

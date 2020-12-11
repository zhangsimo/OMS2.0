<template>
  <Modal title="因公借支核销" width="1000" footer-hide v-model="show">
    <Row>
      <Button :loading="submitDis" :disabled="selectArr.length <= 0" @click="submit">保存</Button>
    </Row>
    <Row class="mt20">
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        :data="tableData"
        size="mini"
        show-overflow="title"
        align="center"
      >
        <vxe-table-column field="serviceId" title="费用报销申请单号"></vxe-table-column>
        <vxe-table-column field="applicationTime" title="申请时间"></vxe-table-column>
        <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
        <vxe-table-column field="paymentBalance" title="费用报销总金额"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="因公借支总金额"></vxe-table-column>
        <vxe-table-column field="compay" title="公司应付"></vxe-table-column>
        <vxe-table-column field="ownpay" title="个人应还"></vxe-table-column>
      </vxe-table>
    </Row>
    <Row class="mb20 mt20">
      <Col span="8">
        <button class="ivu-btn ivu-btn-default ml10" type="button" @click="selectPage">
          <i class="iconfont iconchaxunicon"></i>
          <span>选择单据</span>
        </button>
      </Col>
    </Row>
    <Row>
      <vxe-table
        auto-resize
        resizable
        border
        highlight-hover-row
        highlight-current-row
        show-overflow="title"
        show-footer
        size="mini"
        height="200"
        ref="vxtable"
        :footer-method="footerMethod"
        :data="selectArr"
        align="center"
        :edit-rules="validRules"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      >
        <vxe-table-column title="操作">
          <template v-slot="{ row }">
            <vxe-button type="text" @click="del(row)">删除</vxe-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="serviceId" title="因公借支单号"></vxe-table-column>
        <vxe-table-column title="因公借支未核销余额">
          <template v-slot="{ row }">
            <span>
              {{
              row.paymentReturnBalance <= 0
              ? row.payAmt
              : row.paymentReturnBalance
              }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="writeOffAmount" title="因公借支核销金额" :edit-render="{ name: 'input' }">
          <template v-slot:edit="{ row }">
            <el-input-number
              :min="0" 
              v-model="row.writeOffAmount"
              :controls="false"
              size="mini"
              :precision="2"
            />
          </template>
        </vxe-table-column>
        <vxe-table-column field="applyTime" title="借支日期"></vxe-table-column>
        <vxe-table-column field="summary" title="摘要"></vxe-table-column>
      </vxe-table>
    </Row>
    <Modal title="因公借支申请查询" width="800" v-model="showChild">
      <Row>
        <span>申请日期：</span>
        <Date-picker v-model="dates" type="daterange" placeholder="选择日期" class="w200"></Date-picker>
        <Button @click="getQuery" class="ml10">
          <i class="iconfont iconchaxunicon"></i>
          <span>查询</span>
        </Button>
      </Row>
      <br/>
      <Row>
        <vxe-table
          auto-resize
          resizable
          border
          size="mini"
          show-overflow="title"
          highlight-hover-row
          highlight-current-row
          @radio-change="selectChangeEvent"
          :data="tbdataChild"
          align="center"
          ref="xTableChild"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
        >
          <vxe-table-column type="radio" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="serviceId" title="因公借支单号"></vxe-table-column>
          <vxe-table-column field="payAmt" title="借支金额"></vxe-table-column>
          <vxe-table-column field="applyTime" width="140" title="申请日期"></vxe-table-column>
          <vxe-table-column field="applicant" title="申请人"></vxe-table-column>
          <vxe-table-column field="summary" title="摘要"></vxe-table-column>
        </vxe-table>
      </Row>
      <br/>
      <div slot="footer">
        <Button type="primary" @click="ok">确认</Button>
        <Button @click="re">返回</Button>
      </div>
    </Modal>
    <br/>
  </Modal>
</template>

<script>
  import * as api from "_api/settlementManagement/businessBorrowing";
  import xeUtils from "xe-utils";
  import moment from "moment";

  export default {
    name: "writeOff",
    props: {
      table: {
        type: Object,
        default: null
      }
    },
    data() {
      const amtValid = ({row, cellValue}) => {
        return new Promise((resolve, reject) => {
          if (cellValue && cellValue > 0) {
            if (cellValue > (row.paymentReturnBalance <= 0 ? row.payAmt : row.paymentReturnBalance)) {
              reject(new Error("因公借支核销金额不能大于因公借支未核销余额"));

            } else {
              if (cellValue > this.tableData[0].paymentBalance) {
                reject(new Error("因公借支核销金额不能大于费用报销核销总金额"));
              } else {
                resolve();
              }
            }
          } else {
            if (cellValue == 0) {
              reject(new Error("因公借支核销金额不能为0"));
            } else {
              reject(new Error("因公借支核销金额必填"));
            }
          }


          // row.paymentReturnBalance <= 0
          //   ? row.payAmt
          //   : row.paymentReturnBalance
          //
          // let max =
          //   this.tableData[0].paymentBalance < this.tableData[0].totalPrice ?  this.tableData[0].paymentBalance : this.tableData[0].totalPrice ;
          // if (cellValue > max) {
          //   reject(new Error(`因公借支核销金额不能大于借支金额${max}`));
          // } else {
          //   resolve(true);
          // }
        });
      };
      return {
        validRules: {
          writeOffAmount: [
            {required: true, validator: amtValid} // message: "因公借支核销金额必填" ,
          ]
        },
        show: false,
        showChild: false,
        submitDis: false,//保存接口返回之前按钮不可点击
        dates: [],
        currRow: null,
        tbdataChild: [],
        totalPrice: 0,
        totalfooter: 0,
        compay: 0,
        ownpay: 0,
        selectTmpArr: [],
        selectArr: [],
        page: {
          num: 1,
          size: 10,
          total: 0,
          opts: [20, 50, 100, 200]
        } //分页
      };
    },
    computed: {
      tableData() {
        if (!this.table) return
        let pay = 0;
        if (this.table != null) {
          pay = (this.table.paymentBalance - this.totalPrice).toFixed(2);
        }
        if (pay > 0) {
          this.compay = pay;
          this.ownpay = 0;
        } else {
          this.ownpay = -pay;
          this.compay = 0
          // this.$utils.multiply(this.totalPrice , this.table.paymentBalance)
        }
        return [
          {
            ...this.table,
            totalPrice: this.totalPrice,
            compay: this.compay,
            ownpay: this.ownpay
          }
        ];
      }
    },
    methods: {
      open() {
        this.show = true;
        this.init();
      },
      init() {
        this.currRow = null;
        this.dates = [];
        this.tbdataChild = [];
        this.selectTmpArr = [];
        this.selectArr = [];
        this.page = {
          num: 1,
          size: 10,
          total: 0,
          opts: [20, 50, 100, 200]
        };
      },
      cancel() {
        this.show = false;
      },
      del(row) {
        this.selectArr.forEach((el, index, arr) => {
          if (el.id == row.id) {
            let price = parseFloat(el.payAmt);
            if (isNaN(price)) {
              price = 0;
            }
            this.totalPrice -= price;
            this.totalPrice = this.totalPrice.toFixed(2);
            arr.splice(index, 1);
          }
        });
      },
      //分页
      changePage(p) {
        this.page.num = p;
      },
      changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
      },
      selectPage() {
        this.showChild = true;
        this.getQuery();
      },
      getQuery() {
        let params = {
          size: 10000,
          page: 0
        };
        let data = {
          // claimed: 1,
          paymentBalance: 0,
          writeOffStatus: 0,
          searchType: 0,
          startTime: this.dates[0]
            ? moment(this.dates[0]).format("YYYY-MM-DD") + " 00:00:00"
            : "",
          endTime: this.dates[1]
            ? moment(this.dates[1]).format("YYYY-MM-DD") + " 23:59:59"
            : ""
          // serviceId: this.requestCode
          // guestId: this.companyId,
        };
        // for (let d in data) {
        //   if (!data[d]) {
        //     delete data[d];
        //   }
        // }
        api.findListPageAll(params, data).then(res => {
          if (res.code == 0) {
            this.tbdataChild = res.data.content;
            // this.page.total = res.data.totalElements;
          }
        });
      },
      
      selectChangeEvent({row}) {
        this.selectTmpArr = [row]
      },
      async ok() {
        this.showChild = false;
        this.selectArr = this.selectTmpArr;
        this.selectTmpArr = [];
        this.totalPrice = this.selectArr.reduce((total, next) => {
          let price = parseFloat(
            next.paymentReturnBalance <= 0
              ? next.payAmt
              : next.paymentReturnBalance
          );
          if (isNaN(price)) {
            price = 0;
          }
          total += price;
          return total;
        }, 0);
        this.totalPrice = this.totalPrice.toFixed(2);
      },
      re() {
        this.showChild = false;
        this.selectTmpArr = [];
        this.selectArr = [];
      },
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (["writeOffAmount"].includes(column.property)) {
              if (this.tableData) {
                if (
                  this.tableData[0].reimbursementAmount <
                  this.tableData[0].totalPrice
                ) {
                  this.totalfooter =
                    this.tableData[0].reimbursementAmount -
                    xeUtils.sum(data, column.property);
                } else {
                  this.totalfooter =
                    this.tableData[0].totalPrice -
                    xeUtils.sum(data, column.property);
                }
              }
              return this.totalfooter;
            }
            return null;
          })
        ];
      },
      async submit() {
        // if (this.tableData[0].reimbursementAmount < this.totalPrice) {
        //   if (this.totalfooter > this.tableData[0].reimbursementAmount) {
        //     return this.$message.error(
        //       "因公借支核销总金额不能大于费用报销总金额!"
        //     );
        //   }
        // }
        let enbleAjax=true;
        this.selectArr.map((row, index) => {
          let ygjzwhxye = row.paymentReturnBalance <= 0.01 ? row.payAmt : row.paymentReturnBalance
          if (ygjzwhxye < row.writeOffAmount) {
            enbleAjax=false;
            return this.$Message.error(`第${index + 1}个单据因公借支核销金额大于因公借支未核销金额,不符合条件！`)
          }
          if(row.writeOffAmount<=0){
            enbleAjax=false;
            return this.$Message.error(`第${index + 1}个单据因公借支核销金额为零,不符合条件！`)
          }
        })
        const errMap = await this.$refs.vxtable.validate().catch(errMap => errMap)
        if (errMap) {
        } else {
          if(enbleAjax){
            let data = {
              sourceDto: {
                id: this.tableData[0].id,
                rpAmt: this.totalfooter
              },
              wrtiteOffDtos: this.selectArr.map(el => {
                return {id: el.id, rpAmt: el.writeOffAmount};
              })
            };
            this.submitDis = true;
            api.orderWriteOff2(data).then(res => {
              if (res.code == 0) {
                this.submitDis = false;
                this.$message.success(res.data);
                this.$parent.getQuery();
                this.cancel();
              } else {
                this.submitDis = false;
              }
            });
          }
        }
        // this.$refs.vxtable.validate(valid => {
        //   if (valid == true || valid === undefined) {
        //
        //   } else {
        //     return this.$message.error("因公借支核销金额不能大于借支金额");
        //   }
        // });
      }
    }
  };
</script>

<style lang="scss" scoped></style>

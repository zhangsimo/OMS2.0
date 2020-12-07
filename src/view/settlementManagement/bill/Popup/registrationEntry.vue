<template>
  <Modal v-model="modal1" title="进项登记及修改" width="1200" @on-visible-change="visChange">
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addAccount"
      v-has="'examine'"
    >增加核销对账单
    </button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="submission"
      v-has="'examine'"
      v-noresub
    >保存并提交
    </button>
    <h4 class="mt10 mb10">分店名称：{{orgName}}</h4>
    <Table
      class="mt10 mb10"
      border
      size="small"
      :columns="account"
      :data="accountData"
      show-summary
      :summary-method="billSum"
    ></Table>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addRows"
      v-has="'examine'"
    >添加行
    </button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="deleteRows"
      v-has="'examine'"
    >删除行
    </button>
    <button
      class="ivu-btn ivu-btn-default mr10"
      type="button"
      @click="addOpenSup"
    >新增
      <!--      v-has="'add'"-->
    </button>
    <vxe-table
      class="mt10"
      height="300"
      ref="xTable"
      size="mini"
      border
      resizable
      auto-resize
      highlight-current-row
      show-footer
      :footer-method="footerMethod"
      @current-change="currentChangeEvent"
      :data="tableData"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      :edit-rules="validRules"
    >
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column field="billingType" title="开票清单类型" width="120">
        <template v-slot="{row}">
          <Select v-model="row.billingType">
            <Option v-for="item in listType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column title="登记日期" field="registrationDate" width="90"></vxe-table-column>
      <vxe-table-column
        field="invoicePurchaserId"
        width="150" title="发票采购方名称"
        :edit-render="{name: 'Select', options: purchaserList, optionProps: {value: 'id', label: 'itemName'}}">
      </vxe-table-column>
      <vxe-table-column
        field="invoiceCode"
        title="发票代码"
        width="120"
        :edit-render="{name: 'input', attrs: {type: 'number',placeholder:'输入10位数字'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceNo"
        title="发票号"
        width="100"
        :edit-render="{name: 'input', attrs: {type: 'number',placeholder:'输入8位数字'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="invoiceSellerName"
        title="发票销售方名称"
        width="150"
      >
        <!--        :edit-render="{name: 'input', attrs: {type: 'text'}}"-->
        <template v-slot="{row}">
          <Select v-model="row.invoiceSellerName">
            <Option v-for="(item,index) in invoiceSellerList" :key="item.id" :value="item.taxpayerName">
              {{item.taxpayerName}}
            </Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="billingDate"
        title="开票日期"
        width="150"
        :edit-render="{}"
      >
        <template v-slot:edit="{ row }">
          <DatePicker type="date" v-model="row.billingDate" transfer placeholder="输入开票日期"></DatePicker>
        </template>
        <template v-slot="{ row }">
          {{row.billingDate|filtersDate}}
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="totalAmt"
        title="价税合计金额"
        width="140"
        :edit-render="{autofocus: '.vxe-input--inner'}"
      >
        <template v-slot:edit="{ row,rowIndex }">
          <vxe-input @change="bba(row,rowIndex)" v-model="row.totalAmt" placeholder="价税合计金额" type="number"></vxe-input>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="invoiceAmt"
        title="不含税金额"
        width="120"
        :edit-render="{autofocus: '.vxe-input--inner'}"
      >
        <template v-slot:edit="{ row }">
          <vxe-input v-model="row.invoiceAmt" placeholder="不含税金额" type="number"></vxe-input>
        </template>
        <template v-slot="{ row }">
          {{row.invoiceAmt}}
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="taxAmt"
        title="税额"
        width="100"
        :edit-render="{autofocus: '.vxe-input--inner'}"
      >
        <template v-slot:edit="{ row }">
          <vxe-input v-model="row.taxAmt" placeholder="税额" type="number"></vxe-input>
        </template>
        <template v-slot="{ row }">
          {{row.taxAmt}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="taxRate" title="税率" width="100">
        <template v-slot="{row}">
          <Select v-model="row.taxRate">
            <Option v-for="item in taxRate" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="payType" title="付款方式" width="100">
        <template v-slot="{row}">
          <Select v-model="row.payType">
            <Option
              v-for="item in paymentMethod"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}
            </Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="invoiceSort" title="发票分类" width="100">
        <template v-slot="{row}">
          <Select v-model="row.invoiceSort">
            <Option
              v-for="item in invoiceSortList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}
            </Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="registrationTypeName" title="登记类型" width="100"></vxe-table-column>
    </vxe-table>
    <div slot="footer"></div>
    <account ref="account" :arrId="arrId"/>
    <idDetailed ref="idDetailed"/>
    <Modal v-model="newInoiceShow" title="新增开票">
      <AddInoice :data="addInoiceOne" ref="AddInoice" me-tit="新增开票"></AddInoice>
      <div slot="footer">
        <Button type="primary" @click="addNewBank">确定</Button>
        <Button type="default" @click="cancelNewBank">取消</Button>
      </div>
    </Modal>
  </Modal>
</template>
<script>
  import account from "./accountregistration";
  import idDetailed from "../components/idDetailed";
  // import { getDataDictionaryTable } from "@/api/system/dataDictionary/dataDictionaryApi";
  //新增 开票信息 弹框
  import AddInoice from "@/view/system/essentialData/clientManagement/AddInoice";
  import {getDataDictionaryTable} from "@/api/system/dataDictionary/dataDictionaryApi";
  import {getInvoiceSellerList/** 获取发票销售方名称数组*/, postInvoiceSellerList/**弹框新增开票信息*/} from "@/api/bill/popup.js";
  import moment from 'moment'
  import {
    submit,
    deleteRows,
    detailedIncrease,
    deleteIncrease,
    isWG
  } from "@/api/bill/popup";
  import Bus from "./Bus";

  export default {
    components: {
      account,
      idDetailed,
      AddInoice
    },
    data() {
      const amtValid = ({ cellValue ,row}) => {
        return new Promise((resolve, reject) => {
          if (row.totalAmt != (parseFloat(row.invoiceAmt)+parseFloat(row.taxAmt))) {
            reject(new Error('请满足 价税合计金额=不含税金额+税额'));
          } else {
            resolve()
          }
        })
      }
      const amtValid2 = ({ cellValue ,row}) => {
        return new Promise((resolve, reject) => {
         if(Math.abs(parseFloat(row.invoiceAmt)*parseFloat(row.taxRate)-parseFloat(row.taxAmt))>=0.06){
            reject(new Error('不含税金额误差应小于0.06'));
          } else {
            resolve()
          }
        })
      }
      const amtValid3 = ({ cellValue ,row}) => {
        return new Promise((resolve, reject) => {
          if(cellValue==""){
            reject(new Error('税额必填'));
          } else {
            resolve()
          }
        })
      }
      return {
        arrId: [], //选中数据的id，guestId，orgId
        orgName: "", //分店名称
        validRules: {
          invoiceSort: [{required: true, message: "发票分类必填"}],
          invoiceCode: [
            {required: true, message: "必须是10位数字", min: 10, max: 10}
          ],
          invoiceNo: [
            {required: true, message: "必须是8位数字", min: 8, max: 8}
          ],
          invoicePurchaserId: [{required: true, message: "发票采购方名称必填"}],
          invoiceSellerName: [{required: true, message: "发票销售方名称必填"}],
          billingDate: [{required: true, message: "开票日期必填"}],

          totalAmt: [{required: true, message: "价税合计金额必填"},{validator: amtValid}],
          invoiceAmt: [{ required: true, message: "不含税金额必填"},{validator: amtValid2}],
          taxAmt: [{validator: amtValid3}],

          taxRate: [{required: true, message: "税率必填"}],
          payType: [{required: true, message: "付款方式必填"}],
          billingType: [{required: true, message: "开票清单类型必填"}]
        }, //表格校验
        modal1: false, //弹窗显示
        account: [
          {
            title: "序号",
            type: "index",
            width: 40,
            className: "tc"
          },
          {
            title: "公司名称",
            key: "orgName",
            className: "tc"
          },
          {
            title: "对账单号",
            key: "accountNo",
            className: "tc",
            render: (h, params) => {
              return h(
                "span",
                {
                  style: {
                    cursor: "pointer",
                    color: "#87CEFA"
                  },
                  on: {
                    click: () => {
                      this.$refs.idDetailed.modal1 = true;
                      this.$refs.idDetailed.guestId = this.arrId[1];
                    }
                  }
                },
                params.row.accountNo
              );
            }
          },
          {
            title: "往来单位",
            key: "guestName",
            className: "tc"
          },
          {
            title: "对账应付",
            key: "reconciliation",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.reconciliation.toFixed(2));
            }
          },
          {
            title: "应付返利",
            key: "dealingRebates",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.dealingRebates.toFixed(2));
            }
          },
          {
            title: "应付坏账",
            key: "payingBadDebts",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.payingBadDebts.toFixed(2));
            }
          },
          {
            title: "应付合计",
            key: "actualPayment",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.actualPayment.toFixed(2));
            }
          },
          {
            title: "已收进项金额",
            key: "receiptsAmount",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.receiptsAmount.toFixed(2));
            }
          },
          {
            title: "剩余进项未收",
            key: "remainingInputAmount",
            className: "tc",
            render: (h, params) => {
              return h("span", params.row.remainingInputAmount.toFixed(2));
            }
          }
        ], //对账单
        accountData: [], //对账单
        purchaserList: [], //发票采购方名称
        paymentMethod: [], //付款方式
        listType: [], //开票清单类型
        taxRate: [], //税率
        invoiceSortList: [], //发票分类
        tableData: [], //登记表格
        currentRow: {}, //选中行数据
        invoiceSellerList: [],//发票销售方名称数组
        newInoiceShow: false,//新增开票信息 弹框 boolean
        addInoiceOne: {
          taxpayerName: "",  //开票名称
          taxpayerCode: "",  //税号
          taxpayerTel: "",   //地址电话
          accountBankNo: "", //开户银行
          taxpayerSign: true //是否为一般纳税人
        }
      };
    },
    mounted() {
      this.$refs.xTable.recalculate(true)
      this.getDictionary("PAYMENT_TYPE"); //付款方式
      this.getDictionary("TaxRate"); //税率
      this.getDictionary("BILL_LIST_TYPE"); //开票清单
      this.getDictionary("INVOICE_TYPE"); //发票分类
      Bus.$on("accountOrder", val => {
        //监听first组件的txt事件
        val.map(item => {
          this.accountData.push(item);
          if (item.details.length !== 0) {
            item.details.map(itm => {
              this.tableData.push(itm);
            });
          }
        });
      });
    },
    methods: {
      //打开 新增开票信息弹框
      async addOpenSup() {
        let id = this.accountData[0].guestId;
        let res = await isWG({ id });
        if(res.code == 0 && res.data.isClient == 1&& res.data.isSupplier == 0) {
          return this.$message.error("该往来单位为客户非供应商，如需新增，请联系财务人员");
        }
        this.newInoiceShow = true;
        this.$refs.AddInoice.data = this.addInoiceOne
      },
      //获取 发票销售方名称数组
      async getInvoiceSellerList() {
        let params={}
        params.id=this.accountData[0].guestId;
        let res = await getInvoiceSellerList(params)
        if (res.code == 0) {
          this.invoiceSellerList = res.data || []
        }
      },
      //新增开票 弹框确定
      addNewBank() {
        this.$refs.AddInoice.handleSubmit(() => {
          let data = this.$refs.AddInoice.data
          data.taxpayerSign ? data.taxpayerSign = 0 : data.taxpayerSign = 1
          data.guestId = this.accountData[0].guestId
          this.invoiceSellerList.push(this.$refs.AddInoice.data)
          this.newInoiceShow = false;
          postInvoiceSellerList(data).then(res => {
            if (res.code === 0) {
              this.$Message.success("新增开票成功")
              this.getInvoiceSellerList()
            }
          })
        })
      },
      //新增开票 弹框取消
      cancelNewBank() {
        this.newInoiceShow = false;
        this.$refs.AddInoice.resetFields()
      },
      //获取尾部总数
      footerMethod({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计";
            }
            if (["totalAmt", "invoiceAmt", "taxAmt"].includes(column.property)) {
              return this.$utils.sum(data, column.property).toFixed(2);
            }
            return null;
          })
        ];
      },
      // 对话框是否显示
      visChange(flag) {
        if (flag) {
          this.getInvoiceSellerList()
          this.getkpList()
          this.detailed();
        }
      },
      // 开票单位数据字典
      getkpList() {
        getDataDictionaryTable({dictCode: "KPDW"}).then(res => {
          this.purchaserList =  res.data
        })
      },

  bba(v,i){
          this.tableData[i]['taxAmt'] = ((v.totalAmt || 0) / (1 + v.taxRate) * v.taxRate).toFixed(2);
          this.tableData[i]['invoiceAmt'] = ((v.totalAmt || 0) / (1 + v.taxRate)).toFixed(2);

      },
      // 明细查询
      detailed() {
        detailedIncrease({id: this.arrId[2]}).then(res => {
          if (res.code === 0) {
            this.tableData = res.data;
            // console.log(res.data , 78798)
            if (this.tableData.length < 1) {
              this.addRows()
            }
          }
        });
      },
      totalAmtChange($event) {
        // let value = v.target.value||0
        // console.log($event)
      },
      // 数据字典
      getDictionary(dictCode) {
        getDataDictionaryTable({dictCode}).then(res => {
          if (res.data[0].dictCode === "PAYMENT_TYPE") {
            res.data.map(item => {
              this.paymentMethod.push({
                value: item.itemCode,
                label: item.itemName
              });
            });
          } else if (dictCode === "TaxRate") {
            res.data.map(item => {
              this.taxRate.push({
                value: parseFloat(item.itemValueOne),
                label: (item.itemValueOne * 100).toFixed(0) + "%"
              });
              const obj = {};
              this.taxRate = this.taxRate.filter(item =>
                obj[item.value] ? "" : (obj[item.value] = true)
              );
            });
          } else if (res.data[0].dictCode === "BILL_LIST_TYPE") {
            res.data.map(item => {
              this.listType.push({
                value: item.itemCode,
                label: item.itemName
              });
            });
            // console.log(this.listType)
          } else if (res.data[0].dictCode === "INVOICE_TYPE") {
            res.data.map(item => {
              this.invoiceSortList.push({
                value: item.itemCode,
                label: item.itemName
              });
            });
          }
        });
      },

      // 保存并提交
      async submission() {
        const errMap = await this.$refs.xTable.validate().catch(errMap => errMap);
        if (!errMap) {
          let falg = false
           this.tableData.forEach( item => {
            if( item.invoiceNo.length != 8 ){
              falg = true
            }
           })
          if (falg) return  this.$Message.error('发票号为8位数')
          let pay = 0;
          let pei = 0;
          let newTableData = this.tableData.map(item1 => {
            let item = {...item1}
            pei += item.totalAmt * 1;
            const data = moment(item.billingDate).format('YYYY-MM-DD').split("-");
            if (data.length > 1) {
              item.billingDate = data[0] + data[1] + data[2];
            } else {
              item.billingDate = data;
            }
            //计算税额，不含税金额
            // item.taxAmt = ((item.totalAmt || 0) / (1 + item.taxRate) * item.taxRate).toFixed(2);
            // item.invoiceAmt = ((item.totalAmt || 0) / (1 + item.taxRate)).toFixed(2);
            return item
          });
          this.accountData.map(item => {
            pay += item.actualPayment * 1;
          });
          if (pei > pay)
            return this.$message.error("价税合计金额不能大于应付合计");
          let data = {
            details: newTableData,
            masterList: this.accountData
          };
          submit(data).then(res => {
            // console.log(res);
            if (res.code === 0) {
              this.$message.success("保存成功");
              this.modal1 = false;
              this.$emit('getNewList' ,{})
            }
          });
        }
      },
      //增加核销对账单
      addAccount() {
        this.$refs.account.modal1 = true;
      },
      // 表格合计
      billSum({columns, data}) {
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
          if (index > 3) {
            const v = values.reduce((prev, curr) => {
              return prev * 1 + curr * 1;
            }, 0);
            sums[key] = {
              key,
              value: v.toFixed(2)
            };
          } else {
            sums[key] = {
              key,
              value: " "
            };
          }
          // if (index > 2) {
          // if (!values.every(value => isNaN(value))) {
          // console.log(value)
          //   const v = values.reduce((prev, curr) => {
          //     // const value = Number(curr);
          //       return prev*1 + curr*1;
          //     // if (!isNaN(value)) {
          //     // } else {
          //     //   return prev;
          //     // }
          //   }, 0);
          //   sums[key] = {
          //     key,
          //     value: v.toFixed(2)
          //   };
          // }
          // } else {
          // sums[key] = {
          //   key,
          //   value: " x"
          // };
          // }
        });
        return sums;
      },
      // 添加行
      addRows() {
        let date = new Date();
        let m =
          date.getMonth() < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        date = date.getFullYear().toString() + m + d;
        //获取该对账单是油品还是配件
        let statementType = this.$parent.reconciliationStatement.statementType && this.$parent.reconciliationStatement.statementType.value || "";
        if (this.tableData.length > 0) {
          let lastData = this.tableData[this.tableData.length - 1]
          this.tableData.push({
            registrationDate: date,
            registrationTypeName: "人工登记",
            taxRate: 0.13,
            payType: "DG",
            invoiceSort: "CG",
            invoicePurchaserId: lastData.invoicePurchaserId || "",
            billingType: statementType === 1 ? "0" : "YP",
            invoiceCode: lastData.invoiceCode || "",
            invoiceNo: lastData.invoiceNo || "",
            invoiceSellerName: this.invoiceSellerList[this.invoiceSellerList.length-1].taxpayerName || "",
            billingDate: lastData.billingDate || "",
            taxAmt:'',
            totalAmt:'',
            invoiceAmt:''

          });
        } else {
          this.tableData.push({
            registrationDate: date,
            registrationTypeName: "人工登记",
            taxRate: 0.13,
            payType: "DG",
            invoiceSort: "CG",
            invoicePurchaserId:"",
            invoiceSellerName: this.invoiceSellerList[this.invoiceSellerList.length-1] ? this.invoiceSellerList[this.invoiceSellerList.length-1].taxpayerName : "",
            billingType: statementType === 1 ? "0" : "YP",
            taxAmt:'',
            totalAmt:'',
            invoiceAmt:''
          });
        }
      },
      // 删除行
      deleteRows() {
        if (Object.keys(this.currentRow).length !== 0) {
          if (this.currentRow.id) {
            if (this.currentRow.canceled) {
              this.$Modal.confirm({
                title: "删除发票将还原已核销的金额，是否确认删除",
                onOk: () => {
                  this.deleteIncome();
                  this.$refs.xTable.remove(this.currentRow);
                  this.tableData = this.tableData.filter(
                    itm => !this.currentRow._XID.includes(itm._XID)
                  );
                },
                onCancel: () => {
                }
              });
            } else {
              this.deleteIncome();
              this.$refs.xTable.remove(this.currentRow);
              this.tableData = this.tableData.filter(
                itm => !this.currentRow._XID.includes(itm._XID)
              );
            }
          } else {
            this.$refs.xTable.remove(this.currentRow);
            this.tableData = this.tableData.filter(
              itm => !this.currentRow._XID.includes(itm._XID)
            );
          }
        } else {
          this.$message.error("请先选择一条数据");
        }
      },
      // 选中行
      currentChangeEvent({row}) {
        this.currentRow = row;
      },
      //进项登记删除行接口
      deleteIncome() {
        deleteRows({id: this.currentRow.id}).then(res => {
          // console.log(res);
        });
      }
    },
    filters: {
      filtersDate(value) {
        if (!value) {
          return ""
        }
        value = moment(value).format('YYYY-MM-DD');
        return value;
      }
    }
    // watch:{
    //   accountData:{
    //     handler(v,ov){
    //       console.log(v,ov)
    //     },
    //     deep:true
    //   }
    // }
  };
</script>

import QuickDate from '../../../components/getDate/dateget' //日期查询
import MoreQuery from './moreQuery'  // 更多窗口
import { getLeftList, getLeftMoreList, saveList, getCalculate, deletList, getup } from '@/api/business/procurementAndStorage'
import { getWarehouseList } from '@/api/salesManagment/salesOrder'
import { getClient } from '@/api/salesManagment/salesOrder'
import { getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
import moment from 'moment'
import selectPartCom from "@/view/salesManagement/salesOrder/components/selectSupplier";
import { conversionList } from '@/components/changeWbList/changewblist'
import FeeRegistration from '@/view/goods/plannedPurchaseOrder/components/FeeRegistration.vue';
import ProcurementModal from './components/ProcurementModal.vue';
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
import PrintShow from './components/PrintShow'
import SelectSupplier from "./../../goods/goodsList/components/supplier/selectSupplier";
import { getfindTypeList, getSupplierList } from "_api/purchasing/purchasePlan";



export default {
  name: "market",
  components: {
    QuickDate,
    MoreQuery,
    selectPartCom,
    FeeRegistration,
    ProcurementModal,
    PrintShow,
    SelectSupplier
  },
  data() {
    // let changeNumber = (rule, value, callback) => {
    //   if (!value && value != '0') {
    //     callback(new Error("请输入大于或等于0的正整数"));
    //   } else {
    //     const reg = /^([0]|[1-9][0-9]*)$/
    //     if (reg.test(value)) {
    //       callback();
    //     } else {
    //       callback(new Error("请输入大于或等于0的正整数"));
    //
    //     }
    //   }
    // };
    let changeNumber = (rule, value, callback) => {
      if (!value && value != "0") {
        callback(new Error("请输入大于0的正整数"));
      } else {
        const reg = /^[1-9]+\d?$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入大于0的正整数"));
        }
      }
    };
    // let money = (rule, value, callback) => {
    //   if (!value && value != '0') {
    //     callback(new Error("最多保留4位小数"));
    //   } else {
    //     const reg = /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/
    //     if (reg.test(value)) {
    //       callback();
    //     } else {
    //       callback(new Error("最多保留4位小数"));
    //
    //     }
    //   }
    // };
    let money = (rule, value, callback) => {
      if (!value && value != "0") {
        callback(new Error("最多保留2位小数"));
      } else {
        const reg = /^\d+(\.\d{0,2})?$/i;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("最多保留2位小数"));
        }
      }
    };
    return {
      StoreId :'', //默认仓
      moment: moment,
      advanced: false, //更多模块的弹框
      orderType: 99,
      typeList: [
        { value: 99, name: '全部' },
        { value: 0, name: '草稿' },
        { value: 4, name: '已入库' },
      ],
      split1: 0.2,
      leftPage: {
        total: 0,
        size: 10,
        num: 1
      }, //左侧分页
      legtTableData: [], //左侧数组
      queryDate: [],//快速查询时间
      moreQueryList: {},//更多搜索信息
      formPlan: {
        billStatusValue: 0,
        details: [],
        code: ''
      },//点击获取左侧数据
      settleTypeList: {},//结账类型
      client: [], //客户
      WarehouseList: [],//仓库
      ruleValidate: {
        guestId: [
          { required: true, type: 'string', message: ' ', trigger: 'change' }
        ],
        orderMan: [
          { required: true, message: '  ', trigger: 'blur' }
        ],
        orderDate: [
          { required: true, type: 'date', message: ' ', trigger: 'change' }
        ],
        billTypeId: [
          { required: true, type: 'string', message: ' ', trigger: 'change' }
        ],
        settleTypeId: [
          { required: true, type: 'string', message: ' ', trigger: 'change' }
        ],
        storeId: [
          { required: true, type: 'string', message: ' ', trigger: 'change' }
        ]
      },//表单校验
      validRules: {
        orderQty: [
          { required: true, validator: changeNumber },

        ],
        orderPrice: [
          { required: true, validator: money }
        ]
      }, //表格校验
      allMoney: 0,//总价
      taxRate: {},//税率
      selectRowState: '草稿',//费用需要的状态
      serviceId: '',//费用需要id
      rightList: [],//右侧点击数据
      headers: {
        Authorization: 'Bearer ' + Cookies.get(TOKEN_KEY)
      },//请求头
      upurl: getup,//批量导入地址
    }
  },
  mounted() {
    this.getLeftLists()
    this.getType()
    this.getWarehouse()
    this.getAllClient()
  },
  methods: {
    //选择供应商
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    //获取选中供应商
    getSupplierName(val) {
      this.$set(this.formPlan, "guestId", val.id);
      this.$set(this.formPlan, "supplyName", val.fullName);
      this.$set(this.formPlan,"billTypeId",val.billTypeId)
      this.$set(this.formPlan,"settleTypeId",val.settTypeId)
      // if (v) {
      //   //赋值供应商名称
      //   this.formPlan.supplyName = v.fullName || "";
      //   //赋值供应商id
      //   let guestId = v.id || "";
      //   this.$set(this.formPlan, 'guestId', guestId)
      //   //赋值票据类型id
      //   this.formPlan.billType = v.billTypeId || "";
      // }

    },
    //快速查询获取日期
    getDataQuick(v) {
      this.queryDate = v
      this.leftPage.num = 1
      this.moreQueryList = {}
      this.getLeftLists()
    },
    //打印
    setPrint() {
      if (!this.formPlan.id) return this.$message.error('请至少选择一条数据')
      this.$refs.printBox.openModal()
    },
    // 打开更多搜索
    openQueryModal() {
      this.leftPage.num = 1
      this.moreQueryList = {}
      this.$refs.morequeryModal.openModal()
    },
    //确认更多查询
    moreQuery() {
      this.leftPage.num = 1
      this.getmoreyLeftLists()
    },
    //更多查询方法
    async getmoreyLeftLists() {
      let data = this.moreQueryList
      data.page = this.leftPage.num - 1
      data.size = this.leftPage.size
      let res = await getLeftMoreList(data)
      if (res.code === 0) {
        this.legtTableData = res.data.content
        this.leftPage.total = res.data.totalElements
      }
    },
    // 左侧表格数据
    async getLeftLists() {
      let data = {}
      if (this.queryDate) {
        data.startTime = this.queryDate[0]
        data.endTime = this.queryDate[1]
      } else {
        data.startTime = ''
        data.endTime = ''
      }
      data.billStatusValue = this.orderType
      data.page = this.leftPage.num - 1
      data.size = this.leftPage.size
      let res = await getLeftList(data)
      if (res.code === 0) {
        this.legtTableData = res.data.content
        this.leftPage.total = res.data.totalElements
      }
    },
    //选择状态
    selectTypetList(val) {
      console.log(val)
      this.leftPage.num = 1
      this.moreQueryList = {}
      this.getLeftLists()
    },
    //切换页面
    selectNum(val) {
      this.leftPage.num = val
      if (JSON.stringify(this.moreQueryList) == '{}') {
        this.getLeftLists()
      } else {
        this.getmoreyLeftLists()
      }
    },
    //切换页数
    selectPage(val) {
      this.leftPage.num = 1
      this.leftPage.size = val
      if (JSON.stringify(this.moreQueryList) == '{}') {
        this.getLeftLists()
      } else {
        this.getmoreyLeftLists()
      }
    },
    //点击获取当前信息
    clickOnesList(data) {
       this.settleTypeList.CS00107=[]
      this.taxRate = this.settleTypeList.CS00107.filter(item => { return item.itemCode == data.row.billTypeId })[0]
      this.formPlan = data.row
      if (this.taxRate) {
        this.formPlan.taxRate = this.taxRate.itemValueOne || ''
        this.formPlan.taxSign = this.taxRate.itemValueTwo || ''
      }
    },
    //更换票据类型获取税率
    getBillType(val) {
      this.taxRate = this.settleTypeList.CS00107.filter(item => { return item.itemCode == val })[0]
      if (this.taxRate) {
        this.formPlan.taxRate = this.taxRate.itemValueOne || ''
        this.formPlan.taxSign = this.taxRate.itemValueTwo || ''
      }

      if (this.formPlan.details && this.formPlan.details.length > 0) {
        this.$nextTick(
          () => {
            this.$set(this.formPlan.details, 1, this.formPlan.details[0])
          }
        )
      }

    },
    //获取客户属性
    async getType() {
      let data = {}
      //107票据类型`
      //106结算方式
      data = ['CS00106', 'CS00107']
      let res = await getDigitalDictionary(data)
      if (res.code == 0) {
        this.settleTypeList = res.data
      }
    },
    //获取公司
    async getAllClient() {
      let res = await getSupplierList({})
      if (res.code === 0) {
        this.client = res.data
      }
    },
    // 获取仓库
    async getWarehouse() {
      this.$refs.formPlan.resetFields()
      let res = await getWarehouseList({ groupId: this.$store.state.user.userData.groupId })
      if (res.code === 0) {
        if(res.code === 0){
          this.WarehouseList = res.data
          res.data.map(item => {
            if(item.isDefault == true){
              this.formPlan.storeId = item.id
              this.StoreId = item.id
            }
          })
        }

      }
    },

    //改变客户
    async changeClient(value) {
      // console.log('44444',value)
      if (!value) {
        return false;
      }
      let oneClient = []
      oneClient = this.client.filter( item => {
        return   item.id === value
      })

      console.log(oneClient,5656)
      for(var i  in  oneClient){
        this.formPlan.billTypeId=oneClient[i].billTypeId
        this.formPlan.settleTypeId=oneClient[i].settTypeId

      }
      console.log( this.formPlan.billTypeId,  this.formPlan.settleTypeId)
    },
    //计算表格内总价格数据
    countAmount(row) {
      return this.$utils.toNumber(row.orderQty) * this.$utils.toNumber(row.orderPrice)
    },
    //计算表格内不含税单价
    countTaxRate(row) {
      if (this.taxRate && this.taxRate.itemValueTwo == 1) {
        return this.$utils.toNumber(row.orderPrice) / (1 + (+this.taxRate.itemValueOne))
      } else {
        return this.$utils.toNumber(row.orderPrice)
      }
    },
    // 计算表格内不含税总价
    countTaxRateAll(row) {
      if (this.taxRate && this.taxRate.itemValueTwo == 1) {
        return this.$utils.toNumber(row.orderPrice) / (1 + (+this.taxRate.itemValueOne)) * this.$utils.toNumber(row.orderQty)
      } else {
        return this.$utils.toNumber(row.orderPrice) * this.$utils.toNumber(row.orderQty)
      }
    },

    // 在值发生改变时更新表尾合计
    updateFooterEvent(params) {
      let xTable = this.$refs.xTable
      xTable.updateFooter()
    },
    // 计算尾部总和
    countAllAmount(data) {
      let count = 0
      data.forEach(row => {
        count += +this.countAmount(row)
      })
      count = count.toFixed(2)
      return count
    },
    //计算尾部不含税单价总和
    countTaxAll(data) {
      let count = 0
      data.forEach(row => {
        count += +this.countTaxRateAll(row)
      })
      count = count.toFixed(2)
      return count
    },
    //计算尾部不含税总价
    countAll(data) {
      let count = 0
      data.forEach(row => {
        count += +this.countTaxRate(row)
      })
      count = count.toFixed(2)
      return count
    },
    //获取尾部总数
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '和值'
          }
          if (['orderQty', 'orderPrice', 'orderAmt', 'noTaxPrice', 'noTaxAmt'].includes(column.property)) {
            return this.$utils.sum(data, column.property).toFixed(2)
          }
          if (columnIndex === 7) {
            return ` ${this.countAllAmount(data)} `
          }
          if (columnIndex === 9) {

            return ` ${this.countAll(data)} `
          }
          if (columnIndex === 10) {
            return ` ${this.countTaxAll(data)} `
          }
          return null
        })
      ]
    },
    //计算采购总额
    async getCalculateALL() {
      let data = {}
      data.guestId = this.formPlan.guestId
      let res = await getCalculate(data)
      if (res.code === 0) {
        this.allMoney = res.data
      }
    },
    // 费用登记
    showFee() {
      if (!this.formPlan.serviceId) return this.$Message.error('请先保存数据');
      this.$refs.feeRegistration.init()
    },
    //采购订单打开
    selectPlan() {
      // if (!this.formPlan.guestId) return this.$Message.error('一条有效的数据');
      this.$refs.procurementModal.init()
    },
    //获取采购订单数据
    getPlanOrder(val) {
      this.formPlan.pchsOrderId = val.id
      this.$refs.formPlan.validate(async (valid) => {
        if (valid) {
          try {
            await this.$refs.xTable.validate()
            this.formPlan.orderDate = moment(this.formPlan.orderDate).format('YYYY-MM-DD HH:mm:ss')
            let res = await saveList(this.formPlan)
            if (res.code === 0) {
              this.getLeftLists()
              this.formPlan = {
                billStatusValue: 0,
                code: ''

              }
              this.allMoney = 0
              this.$Message.success('保存成功');
            }
          } catch (errMap) {
            this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
          }
        } else {
          this.$Message.error('*为必填项');
        }
      })

    },

    //保存
    save() {
      this.$refs.formPlan.validate(async (valid) => {
        if (valid) {
          try {
            await this.$refs.xTable.validate()
            this.formPlan.orderDate = moment(this.formPlan.orderDate).format('YYYY-MM-DD HH:mm:ss')
            let res = await saveList(this.formPlan)
            if (res.code === 0) {
              this.getLeftLists()
              this.formPlan = {
                billStatusValue: 0,
                code: ''

              }
              this.allMoney = 0
              this.$Message.success('保存成功');
            }
          } catch (errMap) {
            this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
          }
        } else {
          this.$Message.error('*为必填项');
        }
      })

    },

    //入库
    godown() {
      if (this.formPlan.details && this.formPlan.details.length < 1) {
        this.$message.error('请至少选择一条配件')
        return
      }
      this.$Modal.confirm({
        title: '是否确定入库',
        onOk: async () => {
          this.$refs.formPlan.validate(async (valid) => {
            if (valid) {

              try {
                await this.$refs.xTable.validate()
                this.formPlan.billStatusValue = 4
                this.formPlan.orderDate = moment(this.formPlan.orderDate).format('YYYY-MM-DD HH:mm:ss')
                let res = await saveList(this.formPlan)
                if (res.code === 0) {
                  this.getLeftLists()
                  this.formPlan = {
                    billStatusValue: 0,
                    code: ''
                  }
                  this.allMoney = 0
                  this.$Message.success('保存成功');
                }
              } catch (errMap) {
                this.$XModal.message({ status: 'error', message: '表格校验不通过！' })
              }
            } else {
              this.$Message.error('*为必填项');
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消成功');
        },
      })


    },

    //打开添加配件模态框
    addMountings() {
      this.$refs.selectPartCom.init()
    },
    //添加配件
    getPartNameList(val) {
      this.$refs.formPlan.validate(async (valid) => {
        if (valid) {
          let data = {}
          this.formPlan.orderDate = moment(this.formPlan.orderDate).format('YYYY-MM-DD HH:mm:ss')
          data = this.formPlan
          data.details = conversionList(val)
          let res = await saveList(data)
          if (res.code === 0) {
            this.getLeftLists()
            this.formPlan = {
              billStatusValue: 0
            }
            this.allMoney = 0
          }
        } else {
          this.$Message.error('*为必填项');
        }
      })

    },
    //新增
    addNew() {
      this.formPlan = {
        billStatusValue: 0,
        billStatusName: '草稿',
        details: [],
        code: '',
        storeId :this.StoreId, //调入仓库
        orderMan: this.$store.state.user.userData.staffName

      }
      this.legtTableData.unshift(this.formPlan)
    },
    //右侧表格多选
    selectSameList(val) {
      console.log(val.selection)
      this.rightList = val.selection
    },
    //右侧全选
    selectAllList(val) {
      this.rightList = val.selection
    },
    //删除
    async delect() {
      if (this.rightList.length < 1) return this.$message.error('至少选择一条数据')
      // let list = []
      //     this.rightList.forEach( item => {
      //       list.push( item.id)
      //     })
      let res = await deletList(this.rightList)
      if (res.code === 0) {
        this.getLeftLists()
        this.formPlan = {
          billStatusValue: 0,
          code: ''
        }
        this.allMoney = 0
      }
    },
    getRUl() {
      this.upurl = getup + '?id=' + this.formPlan.id
    },

    //批量上传失败
    onFormatError(file) {
      // console.log(file)
      this.$Message.error('只支持xls xlsx后缀的文件')
    },
    // 上传成功函数
    onSuccess(response) {
      if (response.code == 0) {
        if (response.data.list && response.data.list.length > 0) {
          this.warning(response.data.list[0])
        }
        this.getLeftLists()
        this.formPlan = {
          billStatusValue: 0,
          code: ''
        }
        this.allMoney = 0
        this.$Message.success('保存成功');
      } else {
        this.$Message.error('上传失败')
      }
    },
    warning(nodesc) {
      this.$Notice.warning({
        title: '上传错误信息',
        desc: nodesc
      });
    },
    //上传之前清空
    beforeUpload() {
      this.$refs.upload.clearFiles()
    },
  },
  watch: {
    formPlan: {
      handler(old, olv) {
        if (olv.guestId != old.guestId && old.guestId) {
          this.getCalculateALL()
        }
      },
      deep: true
    }
  }

}

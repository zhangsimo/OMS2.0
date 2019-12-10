import QuickDate from '../../../components/getDate/dateget' //日期查询
import MoreQuery from './moreQuery'  // 更多窗口
import {getLeftList, getLeftMoreList , saveList , getCalculate} from '@/api/business/procurementAndStorage'
import {getWarehouseList} from '@/api/salesManagment/salesOrder'
import {getClient} from '@/api/salesManagment/salesOrder'
import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'
import moment from 'moment'


export default {
  name: "market",
  components: {
    QuickDate,
    MoreQuery,
  },
  data() {
    let changeNumber = (rule, value, callback) => {
      if (!value && value != '0') {
        callback(new Error("请输入大于或等于0的正整数"));
      } else {
        const reg = /^([0]|[1-9][0-9]*)$/
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入大于或等于0的正整数"));

        }
      }
    };
    let money = (rule, value, callback) => {
      if (!value && value != '0') {
        callback(new Error("最多保留4位小数"));
      } else {
        const reg = /^[+-]?\d+\.\d{0,4}$/i
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("最多保留4位小数"));

        }
      }
    };
    return {
      moment: moment,
      advanced: false, //更多模块的弹框
      orderType: 99,
      typeList: [
        {value: 99, name: '全部'},
        {value: 0, name: '草稿'},
        {value: 4, name: '已入库'},
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
        billStatusId:0
      },//点击获取左侧数据
      settleTypeList: {},//结账类型
      client: [], //客户
      WarehouseList: [],//仓库
      ruleValidate: {
        guestId: [
          {required: true, type: 'string', message: ' ', trigger: 'change'}
        ],
        orderMan:[
          {required: true, message: '  ', trigger: 'blur'}
        ],
        orderDate:[
          {required:true ,type: 'string', message: ' ' , trigger:'change' }
        ],
        billTypeId:[
          {required: true, type: 'string', message: ' ', trigger: 'change'}
        ],
        settleTypeId:[
          {required: true, type: 'string', message: ' ', trigger: 'change'}
        ],
        storeId:[
          {required: true, type: 'string', message: ' ', trigger: 'change'}
        ]
      },//表单校验
      validRules: {
        orderQty: [
          { required: true,validator:changeNumber },

        ],
        orderPrice: [
          { required: true, validator:money }
        ]
      }, //表格校验
      allMoney:0,//总价
      taxRate:{},//税率
    }
  },
  mounted() {
    this.getLeftLists()
    this.getType()
    this.getWarehouse()
    this.getAllClient()
  },
  methods: {
    //快速查询获取日期
    getDataQuick(v) {
      this.queryDate = v
      this.leftPage.num = 1
      this.moreQueryList = {}
      this.getLeftLists()
    },
    //打印表格
    printTable() {
      // this.$refs.printBox.openModal()
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
      data.billStatusId = this.orderType
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
     this.taxRate = this.settleTypeList.CS00107.filter( item => { return item.id == data.row.billTypeId})[0]
      this.formPlan = data.row
      console.log(data.row, 9999)
      this.formPlan.taxRate = this.taxRate.itemValueOne || ''
      this.formPlan.taxSign = this.taxRate.itemValueTwo || ''
    },
    //更换票据类型获取税率
    getBillType(val){
      this.taxRate = this.settleTypeList.CS00107.filter( item => { return item.id == val})[0]
      this.formPlan.taxRate = this.taxRate.itemValueOne || ''
      this.formPlan.taxSign = this.taxRate.itemValueTwo || ''
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
      let res = await getClient()
      if (res.code === 0) {
        this.client = res.data
      }
    },
    // 获取仓库
    async getWarehouse() {
      let res = await getWarehouseList({groupId: this.$store.state.user.userData.groupId})
      if (res.code === 0) {
        this.WarehouseList = res.data
      }
    },
    //计算表格内总价格数据
    countAmount (row) {
      return this.$utils.toNumber(row.orderQty) * this.$utils.toNumber(row.orderPrice)
    },
    //计算表格内不含税
    countTaxRate(row) {
      if(this.taxRate.itemValueTwo ==1){
        return this.$utils.toNumber(row.orderPrice)/(1 +  (+this.taxRate.itemValueOne))
      }else{
        return this.$utils.toNumber(row.orderPrice)
      }
    },
    // 计算尾部总和
    countAllAmount (data) {
      let count = 0
      data.forEach(row => {
        count += +this.countAmount(row)
      })
      count = count.toFixed(2)
      return count
    },
    //获取尾部总数
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '和值'
          }
          if (['orderQty', 'orderPrice','orderAmt','noTaxPrice','noTaxAmt'].includes(column.property)) {
            return this.$utils.sum(data, column.property)
          }
          if (columnIndex === 7) {
            return ` ${this.countAllAmount(data)} `
          }
          return null
        })
      ]
    },
    //计算采购总额
   async getCalculateALL(){
     let data = {}
     data.guestId = this.formPlan.guestId
     let res = await getCalculate(data)
     if( res.code === 0){
       this.allMoney = res.data
     }
    },
    //保存
    save(){
      this.$refs.formPlan.validate(async (valid) => {
        if (valid) {
          try {
            await this.$refs.xTable.validate()
            let res = await saveList(this.formPlan)
            if(res.code === 0){
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

    //更改订单事件
    setOrderDate(val){
      this.formPlan.orderDate = val
    },
  },
watch:{
  formPlan:{
    handler(old , olv){
      if (olv.guestId != old.guestId && old.guestId ){
        this.getCalculateALL()
      }
    },
    deep:true
  }
}

}

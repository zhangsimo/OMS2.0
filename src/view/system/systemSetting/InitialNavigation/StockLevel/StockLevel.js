const data = function() {
  return {
    split: 0.33,
    // modal显示
    modal: false,
    // tab索引
    tabIndex: 0,
    // 级别名称
    level: {
      loading: false,
      columns: [
        {
          title: "序号",
          align: "left",
          type: "index",
          minWidth: 80,
        },
        {
          title: "级别名称",
          align: "left",
          Width: 150,
          render: (h, params) => {
            const vm = this;
            if (params.row.isEdit) {
              return h("input", {
                class: "edit",
                domProps: {
                  autofocus: "autofocus",
                  value: params.row.name
                },
                on: {
                  input(event) {
                    params.row.name = event.target.value;
                    vm.level.tbdata[params.index] = params.row;
                    // vm.upOrSaveArr.push()
                  },
                  blur() {
                    params.row.isEdit = false;
                  }
                }
              });
            } else {
              return h(
                "div",
                {
                  class: "edit",
                  on: {
                    dblclick(event) {
                      params.row.isEdit = !params.row.isEdit;
                    }
                  }
                },
                params.row.name
              );
            }
          },
          minWidth: 200
        },
        {
          title: "状态",
          align: "left",
          // key: "isDisable",
          minWidth: 80,
          render:(h,params) => {
            let vm = this;
            return h('Select', {
                props: {
                  value: params.row.isDisable
                },
                style: {
                  width: "100%"
                },
                on: {
                  'on-change': (event) => {
                    params.row.isDisable = event;
                    vm.level.tbdata[params.index] = params.row;
                  }
                },
              },
              [
                h('Option', {
                  props: {
                    value: 0
                  }
                }, '启用'),
                h('Option', {
                  props: {
                    value: 1
                  }
                }, '禁用')
              ])
          }
      },
      ],
      tbdata: [],
    },
    // 右边内容
    customer: {
      pinyin: "", //客户拼音
      fullname: "", //客户全称
      // 表头
      columns: [
        {
          title: "序号",
          align: "left",
          type: "index",
          minWidth: 80
        },
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "配件编码",
          align: "left",
          key: "partCode",
          minWidth: 120
        },
        {
          title: "配件名称",
          align: "left",
          key: "partName",
          minWidth: 120
        },
        {
          title: "配件全称",
          align: "left",
          key: "fullName",
          minWidth: 120
        },
        {
          title: "备注",
          align: "left",
          key: "remark",
          minWidth: 120
        },
        {
          title: "操作人",
          align: "left",
          key: "createUname",
          minWidth: 120
        },
        {
          title: "操作日期",
          align: "left",
          key: "createTime",
          minWidth: 120
        }
      ],
      // 表身
      tbdata: [],
      // 表格加载
      loading: false,
      // 分页
      page: {
        num: 1,
        total: 10,
        size: 10
      }
    },
    QueryType: [
      {
        value: 0,
        label: '编码'
      },
      {
        value: 1,
        label: '名称'
      }
    ],
    //默认为编码
    Type: 0,
    //多选数组
    checkboxArr: [],
    //从子组件获取的数组
    getArr: [],
    //合并的数组
    tbdataArr:[],
    //后台所需id
    levelId:'',
    num:1
  }
};

const mounted = function() {
  this.leftgetList()
};

const methods = {
  /**==============左侧============= */
  // 保存
  async save() {
    let data = this.level.tbdata.map(el => {
      let item = {};
      if(el.id) {
        item.id = el.id;
      }
      item.name = el.name;
      item.isDisable = el.isDisable;
      return item;
    });
    console.log(data)
   await stockLevelSave(data);
    this.leftgetList()
  },
  // 新增
  add() {
    this.level.tbdata.push({ name: " ", isEdit: false, oid: Date.now() });
  },
  // 删除
  remove() {},
  // tab切换
  setTab(index) {
    this.tabIndex = index;
  },
  /**============客户信息============ */
  // 翻页-客户信息
  changePageCus(p) {
    this.customer.page.num = p;
  },
  // 修改每页显示条数-客户信息
  changeSizeCus(size) {
    this.customer.page.num = 1;
    this.customer.page.size = size;
  },
  // 查询配件
  queryCustomer() {
    this.customer.page.num = 1
    this.rightgetList()
  },
  // 添加配件
  addCustomer() {
    if(this.levelId){
      // this.modal = true;
      // this.num += this.num
      // this.$store.commit('setDialog',this.num )
      // console.log(this.$refs.MsgThree)
      this.$refs.MsgThree.init()
      // this.getArr = []
    }else{
      this.$Message.warning('请选择备货级别设置')
    }

  },
  // 删除配件
  removeCustomer() {
    if(this.checkboxArr.length === 0){
      this.$Message.warning('请选择要删除的对象')
    }else{
      let needArr = this.checkboxArr.map((ele,index) => {
        return  ele.id
      })
      // console.log(needArr)
      Delete(needArr).then(res => {
        this.rightgetList()
        this.$Message.warning('删除成功')
        this.checkboxArr = []
      })
    }
  },
  // 保存配件
  saveCustomer() {
    this.customer.page.num = 1;
     this.getArr.map(item => {
      item.levelId = this.levelId
       delete item.id
      })
    // let repeatArr = this.unique(this.getArr)
    // console.log(repeatArr)
    stockLevelPartSave(this.getArr).then(res => {
      this.getArr = []
      this.rightgetList()
    })
  },
  /**============配件============ */
  // 翻页-配件价格
  changePagePagePart(p) {
    this.customer.page.num = p;
    this.rightgetList()
  },
  // 修改每页显示条数-配件价格
  changeSizePagePart(size) {
    this.customer.page.num = 1;
    this.customer.page.size = size;
  },
  // 查询配件
  queryPart() {},
  // 保存配件
  savePart() {},
  //左边内容初始化
  leftgetList(){
    let params = {}
    this.level.loading = true
    stockLevel(params).then(res => {
      this.level.loading = false
      if (res.code === 0) {
        this.level.tbdata = res.data.map(el => {
          el.oid = el.id;
          el.isEdit = false;
          return el;
        });
      }
    })
  },
  //右边内容初始化
  rightgetList(){
    let params = {}
    // let data = {}
      if(this.Type === 0 && this.customer.fullname !== ''){
        params.partCode = this.customer.fullname
      }
      if(this.Type === 1 && this.customer.fullname !== ''){
        params.partName = this.customer.fullname
      }
      if(this.levelId){
        params.levelId = this.levelId
      }
      params.page = this.customer.page.num - 1
      params.size = this.customer.page.size

      this.customer.loading = true
      RightqueryAll(params).then(res => {
        this.customer.loading = false
        if (res.code === 0){
          this.customer.tbdata = res.data.content || []
          // console.log(this.customer.tbdata)
          this.customer.page.total = res.data.totalElements
        }
      })
  },
  //多选框
  selection(a){
    this.checkboxArr = a
    console.log(this.checkboxArr)
  },
  //子组件的参数
  getMsg2(a){
    console.log(a)
    a.map(item => {
        item.partCode =  item.code,
        item.partName = item.partStandardName,
        item.partId = item.id,
        item.fullName = item.fullName,
        item.remark = item.remark
    })
    this.getArr = a

   // this.getArr.Map( item => {})
    this.customer.tbdata = [...this.customer.tbdata,...a]
    this.customer.tbdata = this.unique(this.customer.tbdata)
    // console.log(this.customer.tbdata)
  },
  //左边内容单某行
  selction(a){
    console.log(a)
    let arrr = []
    arrr.push(a)
   let arrrr =  arrr.map(item => {
      return {
        levelId : item.id
      }
    })
    // console.log(arrrr)
    this.levelId = arrrr[0].levelId
    if(this.levelId){
      this.rightgetList()
      // this.$refs.Msg.chooseArr = []
    }
  },
  //去重方法
  unique(arr) { // 根据唯一标识orderId来对数组进行过滤
    const res = new Map();  //定义常量 res,值为一个Map对象实例
    //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    return arr.filter((arr) => !res.has(arr.partId) && res.set(arr.partId, 1))
  },
  //Model的关闭
  closedTap(){
    // this.$refs.Msg.chooseArr = []
  }
};
import {stockLevel,stockLevelSave,RightqueryAll,Delete,stockLevelPartSave} from '../../../../../api/system/systemSetting/Initialization'
import DiaLog from '../../../../../components/Accessories/dialog';
import selectPartCom from '../../../../goods/goodsList/components/selectPartCom'
const components = {
  DiaLog,
  selectPartCom
}

export default {
  name: "StockLevel",
  data,
  components,
  mounted,
  methods
};

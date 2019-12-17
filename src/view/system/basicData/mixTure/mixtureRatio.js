const data = function () {
  return {
    split: 0.2,
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
          title: "配件编码",
          align: "left",
          key: 'partCode',
          Width: 100,
          // render:(h,params) => {
          //   const vm = this
          //   return h('Input',{
          //     //给div绑定value属性
          //     props: {
          //       value:params.row.partCode
          //     },
          //     //给div绑定样式
          //     style:{
          //       width:'100%'
          //     },
          //     //给div绑定点击事件　　
          //     on: {
          //       input(event) {
          //         params.row.partCode = event;
          //         vm.level.tbdata[params.index] = params.row;
          //       }
          //     },
          //   })
          // },
          minWidth: 150
        },
        {
          title: "配件名称",
          align: "left",
          Width: 150,
          key: 'partName',
          minWidth: 150
        },
        {
          title: "状态",
          align: "left",
          // key: "isDisable",
          minWidth: 80,
          render: (h, params) => {
            let vm = this;
            return h('Select', {
              props: {
                value: params.row.isDisabled
              },
              style: {
                width: "100%"
              },
              on: {
                'on-change': (event) => {
                  params.row.isDisabled = event;
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
          title: "数量",
          align: "left",
          minWidth: 120,
          render: (h, params) => {
            const vm = this
            return h('Input', {
              //给div绑定value属性
              props: {
                value: params.row.qty
              },
              //给div绑定样式
              style: {
                width: '100%'
              },
              //给div绑定点击事件　　
              on: {
                input(event) {
                  params.row.qty = event;
                  vm.customer.tbdata[params.index] = params.row;
                },
                "on-blur": (event)=>  {
                  let val = event.target.value;
                  let reg = /^\d{1,3}$/
                  if (!reg.test(val)) {
                    this.$Message.error("请输入0-100的正整数")
                    params.row.qty = ''
                  }
                },
                "on-enter":(event)=> {
                  event.target.blur()
                }
              },
            })
          }
        },
        {
          title: '成本比例（0-1）',
          align: 'left',
          key: 'deductRate',
          minWidth: 120,
          render: (h, params) => {
            const vm = this
            return h('Input', {
              //给div绑定value属性
              props: {
                value: params.row.ratio
              },
              //给div绑定样式
              style: {
                width: '100%'
              },
              //给div绑定点击事件　　
              on: {
                input(event) {
                  params.row.ratio = event;
                  vm.customer.tbdata[params.index] = params.row;
                },
                "on-blur": (e) => {
                  if (!e.target.value.match(/^[0]\.\d{1,2}$/)) {
                    this.$Message.error('请输入0-1数值')
                    params.row.ratio = ''
                  }
                },
                "on-enter":(event)=> {
                  event.target.blur()
                }
              },
            })
          }
        },
        {
          title: "备注",
          align: "left",
          key: "remark",
          minWidth: 120,
          render: (h, params) => {
            const vm = this
            return h('Input', {
              //给div绑定value属性
              props: {
                value: params.row.remark
              },
              //给div绑定样式
              style: {
                width: '100%'
              },
              //给div绑定点击事件　　
              on: {
                input(event) {
                  params.row.remark = event;
                  vm.tbdata[params.index] = params.row;
                }
              },
            })
          }
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
    //从子组件获取的数组左
    getArr: [],
    //从子组件获取的数组右
    getArrRight: [],
    //合并的数组
    tbdataArr: [],
    //后台所需id
    levelId: '',
    num: 1,
    model_left: false, //左边弹框
  }
};

const mounted = function () {
  this.leftgetList()
};

const methods = {
  /**==============左侧============= */
  // 配比清单保存
  async save() {
    // console.log(this.level.tbdata)
    this.level.tbdata = this.unique(this.level.tbdata)
    let data = this.level.tbdata.map(el => {
      let item = {};
      if (el.id) {
        item.id = el.id;
      }
      item.partName = el.partName;
      item.isDisabled = el.isDisabled;
      item.partCode = el.partCode
      item.partId = el.partId
      return item;
    });
    // console.log(data)
    await partMatchingSave(data);
    this.leftgetList()
  },
  // 新增
  add() {
    // this.level.tbdata.push({ name: " ", isEdit: false, oid: Date.now() });
    // this.model_left = true
    this.$refs.Msg1.init()
  },
  // 删除
  remove() { },
  // tab切换
  setTab(index) {
    this.tabIndex = index;
  },
  /**============ 配件信息 ============ */
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
    if (this.levelId) {
      // this.modal = true;
      this.$refs.Msg2.init()
      this.num += this.num
      this.$store.commit('setDialog', this.num)
    } else {
      this.$Message.warning('请选择备配比清单')
    }
  },
  // 删除配件
  removeCustomer() {
    if (this.checkboxArr.length === 0) {
      this.$Message.warning('请选择要删除的对象')
    } else {
      let needArr = []
      needArr = this.checkboxArr.map((ele, index) => {
        return ele.id
      })
      console.log(needArr, 2313)
      partMatchingdelete(needArr).then(res => {
        this.rightgetList()
        this.$Message.warning('删除成功')
      })
    }
  },
  // 保存配件
  saveCustomer() {
    this.customer.page.num = 1;
    this.customer.tbdata.forEach(item => {
      item.parentId = this.levelId
    })
    // console.log(this.customer.tbdata)
    this.customer.tbdata = this.unique(this.customer.tbdata)
    partMatchingDetailSave(this.customer.tbdata).then(res => {
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
  queryPart() { },
  // 保存配件
  savePart() { },
  //左边内容初始化
  leftgetList() {
    let params = {}
    this.level.loading = true
    partMatching(params).then(res => {
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
  rightgetList() {
    let params = {}
    if (this.Type === 0 && this.customer.fullname !== '') {
      params.partCode = this.customer.fullname
    }
    if (this.Type === 1 && this.customer.fullname !== '') {
      params.fullname = this.customer.fullname
    }
    if (this.levelId) {
      params.parentId = this.levelId
    }
    params.page = this.customer.page.num - 1
    params.size = this.customer.page.size

    this.customer.loading = true
    partMatchingDetail(params).then(res => {
      this.customer.loading = false
      if (res.code === 0) {
        this.customer.tbdata = res.data.content || []
        // console.log(this.customer.tbdata)
        this.customer.page.total = res.data.totalElements
      }
    })
  },
  //多选框
  selection(a) {
    this.checkboxArr = a
    console.log(this.checkboxArr)
  },
  //子组件的参数
  getMsg2(a) {
    console.log(a)
    let newA = a.map(item => {
      return {
        partCode: item.partCode,
        partName: item.partName,
        partId: item.id,
      }
    })
    this.level.tbdata = [...this.level.tbdata, ...newA]

    console.log(this.level.tbdata, "left数据")
    // this.level.tbdata = this.unique(this.level.tbdata) //暂时不去重，后台数据id为null，无法通过partId去重。
    // console.log(this.getArr)
  },
  // 父组件右部分获取子组件的参数
  getMsgTwo(a) {
    // console.log(a)
    let newA = a.map(item => {
      return {
        partCode: item.code,
        partName: item.partBrandName,
        partId: item.id,
        fullName: item.fullName,
        remark: item.remarks
      }
    })
    this.getArrRight = newA
    console.log(this.getArrRight)
    this.customer.tbdata = [...this.customer.tbdata, ...this.getArrRight]
    this.customer.tbdata = this.unique(this.customer.tbdata)
  },
  //左边内容单某行
  selction(a) {
    // console.log(a)
    let arrr = []
    arrr.push(a)
    // console.log(arrr)
    let arrrr = arrr.map(item => {
      return {
        levelId: item.id
      }
    })
    console.log(arrrr)
    this.levelId = arrrr[0].levelId
    // console.log(this.levelId)
    if (this.levelId) {
      this.rightgetList()
      this.$refs.Msg1.chooseArr = []
    }
  },
  //去重方法
  unique(arr) { // 根据唯一标识orderId来对数组进行过滤
    const res = new Map();  //定义常量 res,值为一个Map对象实例
    //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    return arr.filter((arr) => !res.has(arr.partId) && res.set(arr.partId, 1))
  },
  //Model的关闭
  closedTap() {
    this.$refs.Msg.chooseArr = []
  }
};
import { partMatching, partMatchingSave, partMatchingDetail, partMatchingdelete, partMatchingDetailSave } from '@/api/system/systemSetting/Initialization'
import DiaLog from '../../../../components/Accessories/dialog';
import selectPartCom from '@/view/salesManagement/salesOrder/components/selectSupplier'
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

import * as api from "_api/system/priceManage";

const data = function() {
  return {
    split: 0.36,
    // 按钮禁用
    disabled: true,
    // modal显示
    modal: false,
    // tab索引
    tabIndex: 0,
    // 选中的行
    currRow: null,
    // 选中是否第一行
    curronly: false,
    // 级别修改和新增数据
    levelupOrSaveArr: [],
    // 级别删除的数据
    leveldelarr: [],
    // 级别名称
    level: {
      loading: false,
      name: "", // 修改的级别名称
      columns: [
        {
          title: "序号",
          type: "index",
          minWidth: 80
        },
        {
          title: "级别名称",
          render: (h, params) => {
            const vm = this;
            if (params.row.isEdit && !params.row.readonly) {
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
          minWidth: 240
        }
      ],
      tbdata: [{name: '统一售价', readonly: true}],
    },
    // 选择的客户-从弹窗获取的
    selectCrr: [],
    // 右边选择的客户
    selectRightCR: [],
    // 右边删除的客户
    removeRightCr: [],
    // 客户信息
    customer: {
      pinyin: "", //客户拼音
      fullname: "", //客户全程
      // 表头
      columns: [
        {
          title: "序号",
          type: "index",
          minWidth: 60
        },
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "客户全称",
          key: "fullName",
          minWidth: 120
        },
        {
          title: "客户简称",
          key: "shortName",
          minWidth: 120
        },
        {
          title: "操作人",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "操作日期",
          key: "brandName",
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
        total: 0,
        size: 10
      }
    },
    // 配件
    part: {
      pinyin: "", // 拼音
      code: "", // 编码
      fullname: "", // 名称
      // 表头
      columns: [
        {
          title: "序号",
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
          key: "brandName",
          minWidth: 120
        },
        {
          title: "配件全称",
          key: "brandName",
          minWidth: 240
        },
        {
          title: "成本单价",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "销售单价",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "操作人",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "操作日期",
          key: "brandName",
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
        total: 0,
        size: 10
      }
    },
  };
};

const mounted = function() {
  this.getLevelList();
};

const methods = {
  /**==============左侧============= */
  // 获取表格
  async getLevelList() {
    let res = await api.sellPsList();
    if (res.code === 0) {
      res.data.forEach(el => {
        el.oid = el.id;
        el.isEdit = false;
        this.level.tbdata.push(el);
      });
    }
    this.leveldelarr = [];
  },
  // 获取客户
  async getCus() {
    this.selectCrr = [];
    this.removeRightCr = [];
    this.selectRightCR = [];
    this.$refs.curs.custarr = [];
    this.$refs.curs.tbdata = [];
    this.$refs.curs.fullname = "";
    this.$refs.curs.code = "";
    this.$refs.curs.mobile = "";
    this.$refs.curs.page = { num: 1, size: 10, total: 100 };
    let params = {};
    let data = {};
    if(this.customer.fullname) {
      data.fullName = this.customer.fullname;
    }
    if(this.customer.pinyin) {
      data.pyName = this.customer.pinyin;
    }
    params.strategyId = this.currRow.id;
    params.page = this.customer.page.num - 1;
    params.size = this.customer.page.size;
    let res = await api.findAllCus(params, data);
    if(res.code == 0) {
      this.customer.tbdata = res.data.content;
      this.customer.tbdata.forEach(el => {
        el.oid = el.id;
      })
      this.customer.page.total = res.data.totalElements;
    }
  },
  // 获取配件
  async getPart() {
    let data = {}
    let params = {}
    if(this.part.fullname) {
      data.fullName = this.part.fullname;
    }
    if(this.part.pinyin) {
      data.pinyin = this.part.pinyin;
    }
    if(this.part.code) {
      data.code = this.part.code;
    }
    data.strategyId = this.currRow.id;
    params.page = this.part.page.num - 1;
    params.size = this.part.page.size;
    let res = await api.queryPart(params, data);
    if(res.code == 0) {
      this.part.tbdata = res.data.content;
      this.part.page.total = res.data.totalElements;
    }
  }, 
  // 保存级别
  async save() {
    let data = {
      addList: [],
    }
    data.addList = JSON.parse(JSON.stringify(this.level.tbdata));
    if(this.leveldelarr.length > 0 ) {
      data.delList = this.leveldelarr;
    }
    data.addList.forEach((el, index, arr) => {
      if(el.readonly) {
        arr.splice(index, 1);
      }
    })
    let res = await api.sellPsSave(data);
    if(res.code === 0) {
      this.$Message.success('保存成功');
      this.getLevelList();
    }
  },
  // 新增
  add() {
    this.level.tbdata.push({ name: " ", isEdit: false, oid: Date.now() });
  },
  // 单选行
  selectRow(row) {
    this.currRow = row;
    this.disabled = false;
    this.selectCrr = [];
    this.removeRightCr = [];
    this.selectRightCR = [];
    this.$refs.curs.custarr = [];
    this.customer.pinyin = "";
    this.customer.fullname = '';
    this.part.pinyin = "";
    this.part.code = "";
    this.part.fullname = "";
    if(row.readonly) {
      this.curronly = true;
      this.tabIndex = 1;
    } else {
      this.curronly = false;
      this.tabIndex = 0;
    }
    this.customer.page = {
      num: 1,
      total: 100,
      size: 10
    };
    this.part.page = {
      num: 1,
      total: 100,
      size: 10
    };
    this.getCus();
    // this.getPart();
  },
  // 删除
  remove() {
    this.level.tbdata.forEach((el, index, arr) => {
      if(this.currRow.oid === el.oid && !el.readonly) {
        arr.splice(index, 1);
        el.id && this.leveldelarr.push(el);
      }
    });
  },
  // tab切换
  setTab(index) {
    this.tabIndex = index;
  },
  /**============客户信息============ */
  // 翻页-客户信息
  changePageCus(p) {
    this.customer.page.num = p;
    this.getCus();
  },
  // 修改每页显示条数-客户信息
  changeSizeCus(size) {
    this.customer.page.num = 1;
    this.customer.page.size = size;
    this.getCus();
  },
  // 查询客户
  queryCustomer() {
    this.getCus();
  },
  // 添加客户
  addCustomer() {
    this.selectCrr = [];
    this.selectRightCR = [];
    this.removeRightCr = [];
    this.$refs.curs.custarr = [];
    this.$refs.curs.tbdata = [];
    this.$refs.curs.fullname = "";
    this.$refs.curs.code = "";
    this.$refs.curs.mobile = "";
    this.$refs.curs.page = { num: 1, size: 10, total: 100 };
    this.modal = true;
  },
  // 添加客户
  addcu(val) {
    var obj = {};
    this.selectCrr = val;
    this.customer.tbdata = this.customer.tbdata.concat(val);
    this.customer.tbdata = this.customer.tbdata.reduce((item, next) => {
      obj[next.id] ? '' : obj[next.id] = true && item.push(next);
      return item;
    }, [])
  },
  // 右侧-选择客户
  selectrightcus(selection, row) {
    this.selectRightCR = selection;
  },
  // 右侧-取消单选
  selectCancelrightcus(selection, row) {
    this.selectRightCR = selection;
  },
  // 右侧-全选客户
  selectAllrightcus(selection) {
    this.selectRightCR = selection;
  },
  // 右侧-取消全选客户
  selectCancelAllrightcus() {
    this.selectRightCR = [];
  },
  // 删除客户
  removeCustomer() {
    if(this.selectRightCR.length <= 0) {
      return this.$Message.error('请选择客户');
    }
    this.removeRightCr = this.removeRightCr.concat(...this.selectRightCR);
    this.removeRightCr.forEach(rs => {
      this.customer.tbdata.forEach((el, index, arr) => {
        if(rs.id === el.id) {
          arr.splice(index, 1);
        }
      });
      this.selectRightCR.forEach((el, index, arr) => {
        if(rs.id === el.id) {
          arr.splice(index, 1);
        }
      });
      this.$refs.curs.custarr.forEach((el, index, arr) => {
        if(rs.id === el.id) {
          arr.splice(index, 1);
        }
      });
    });
  },
  // 保存客户
  async saveCustomer() {
    let data = {
      addList: [],
      delList: [],
    };
    data.addList = this.selectRightCR;
    this.removeRightCr.forEach(el => {
      if(el.oid) {
        data.delList.push(el);
      }
    });
    if(this.selectRightCR.length <= 0 && data.delList.length <= 0) {
      return this.$Message.error('请选择客户');
    }
    data.addList.forEach(el => {
      el.strategyId = this.currRow.id;
      el.guestId = el.id;
      Reflect.deleteProperty(el, 'id');
    })
    let res = await api.sellcussave(data);
    if(res.code === 0) {
      this.$Message.success('保存成功');
      this.getCus();
    }
  },
  /**============配件============ */
  // 翻页-配件价格
  changePagePagePart(p) {
    this.part.page.num = p;
    this.getPart();
  },
  // 修改每页显示条数-配件价格
  changeSizePagePart(size) {
    this.part.page.num = 1;
    this.part.page.size = size;
    this.getPart();
  },
  // 查询配件
  queryPart() {},
  // 保存配件
  savePart() {},
};

import DiaLog from "./dialog";
const components = {
  DiaLog
};

export default {
  name: "priceManage",
  components,
  data,
  mounted,
  methods
};
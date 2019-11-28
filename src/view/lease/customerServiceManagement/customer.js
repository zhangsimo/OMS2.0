import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
import * as api from "_api/lease/customerSM";
const sexEnum = {
  0: "男",
  1: "女"
};

let checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("手机号不能为空"));
  } else {
    const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};

let checkQQ = (rule, value, callback) => {
  if (!value) {
    callback(new Error("QQ号不能为空"));
  } else {
    const reg = /^[1-9]\d{4,9}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的QQ号"));
    } else {
      callback();
    }
  }
};

let checkwx = (rule, value, callback) => {
  if (!value) {
    callback(new Error("微信号不能为空"));
  } else {
    const reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的微信号"));
    } else {
      callback();
    }
  }
};

let checWxUrl = (rule, value, callback) => {
  if (!value) {
    callback(new Error("微信二维码不能为空"));
  } else {
    if (value.length <= 0) {
      callback(new Error("请上传微信二维码"));
    } else {
      callback();
    }
  }
};

const data = () => {
  return {
    split: 0.5,
    headers: {
      Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
    },
    wxImgUrl: api.wxImgUrl,
    // 显示弹窗
    modal: false,
    // 弹窗数据
    initmodalData: {
      name: "",
      sex: 0,
      mobile: "",
      birthday: "", //生日
      qq: "",
      wechat: "",
      email: "",
      signature: "", // 签名
      src: "", // 二维码图片
      id: "",
    },
    new: true, // true新增,false修改
    modalData: {
      name: "",
      sex: 0,
      mobile: "",
      birthday: "", //生日
      qq: "",
      wechat: "",
      email: "",
      signature: "", // 签名
      src: "", // 二维码图片
      id: "",
    },
    ruleValidate: {
      name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
      mobile: [
        {
          required: true,
          validator: checkPhone,
          trigger: "blur"
        }
      ],
      birthday: [
        {
          required: true,
          type: "date",
          message: "必须选择生日",
          trigger: "change"
        }
      ],
      qq: [
        {
          required: true,
          validator: checkQQ,
          trigger: "blur"
        }
      ],
      wechat: [
        {
          required: true,
          validator: checkwx,
          trigger: "blur"
        }
      ],
      src: [
        {
          required: true,
          validator: checWxUrl,
          trigger: "change"
        }
      ]
    },
    name: "", // 姓名
    mobile: "", // 手机号
    tableL: {
      currentRow: null, // 选中的行(客服)
      thdata: [
        {
          title: "姓名",
          key: "name",
          minWidth: 80
        },
        {
          title: "手机号码",
          key: "mobile",
          minWidth: 120
        },
        {
          title: "性别",
          minWidth: 80,
          render: (h, params) => {
            let sexKey = params.row.sex;
            let sexVal = sexEnum[sexKey];
            return h("span", sexVal);
          }
        },
        {
          title: "创建人",
          key: "createUname",
          minWidth: 80
        },
        {
          title: "创建日期",
          key: "createTime",
          minWidth: 120
        }
      ], // 左侧表格表头
      tbdata: [], // 左侧表格内容
      loading: false
    },
    tableR: {
      thdata: [
        {
          type: "selection",
          width: 60,
        },
        {
          title: "租户名称",
          key: "tenantName",
          minWidth: 80
        },
        {
          title: "租户ID",
          key: "tenantId",
          minWidth: 80
        },
        {
          title: "联系人",
          key: "manager",
          minWidth: 80
        },
        {
          title: "联系电话",
          key: "mobile",
          minWidth: 120
        }
      ], // 右侧表格表头
      tbdata: [], // 右侧表格内容
      loading: false
    },
    pageL: {
      page: { num: 1, size: 10, total: 0 }
    },
    pageR: {
      page: { num: 1, size: 10, total: 0 }
    },
    // 选中的租户id数组
    selectedArr: new Set(),
    // 取消的租户id数组
    cancelArr: new Set(),
  };
};

const mounted = function() {
  this.initCustomer();
};

const methods = {
  // 查询客服
  async initCustomer() {
    this.tableL.loading = true;
    let params = {};
    params.page = this.pageL.page.num - 1;
    params.size = this.pageL.page.size;
    if (this.name != "") {
      params.name = this.name;
    }
    if (this.mobile != "") {
      params.mobile = this.mobile;
    }
    const res = await api.getCustomerAll(params);
    if (res.code === 0) {
      if(res.data != null) {
        this.tableL.tbdata = res.data.content || [];
      }
      this.pageL.page.total = res.data.totalElements;
      this.tableL.loading = false;
    }
  },
  // 查询租户
  async queryTenant() {
    let params = {};
    params.page = this.pageR.page.num - 1;
    params.size = this.pageR.page.size;
    this.tableR.loading = true;
    const customerId = this.tableL.currentRow.id;
    const bindres = await api.getTenantIds({ customerId }); // 客服绑定的所有租户
    let bindTenids = []; // 客服绑定的所有租户ids;
    if(bindres.code == 0) {
      bindTenids = bindres.data || [];
    }
    params.customerId = customerId;
    const Tenres = await api.getTenants(params); // 租户
    if(Tenres.code === 0) {
      if(Tenres.data != null) {
        this.tableR.tbdata = Tenres.data.content || [];
      }
      this.tableR.tbdata.forEach(el => {
        el._checked = false;
        el._orginChecked = false;
        bindTenids.forEach(ten => {
          if(el.id === ten.tenantId) {
            el._checked = true;
            el._orginChecked = true;
          }
        });
        this.selectedArr.forEach(id => {
          if(id === el.id) {
            el._checked = true;
          }
        });
        this.cancelArr.forEach(id => {
          if(id === el.id) {
            el._checked = false;
          }
        });
      });
      this.pageR.page.total = Tenres.data.totalElements;
      this.tableR.loading = false;
    }
  },
  // 查询
  query() {
    this.initCustomer();
    this.tableR.tbdata = [];
    this.pageR.page = { num: 1, size: 10, total: 0 };
    this.selectedArr = new Set();
    this.cancelArr = new Set();
  },
  // 新增
  add() {
    this.modalData = this._.cloneDeep(this.initmodalData);
    this.new = true;
    this.modal = true;
  },
  // 修改
  update() {
    if (!this.tableL.currentRow) {
      this.$Message.error("必须选择客服进行修改");
      return;
    }
    this.$refs.formValidate.resetFields();
    this.modalData.id = this.tableL.currentRow.id;
    this.modalData.name = this.tableL.currentRow.name;
    this.modalData.sex = this.tableL.currentRow.sex;
    this.modalData.birthday = this.tableL.currentRow.birthday;
    this.modalData.mobile = this.tableL.currentRow.mobile;
    this.modalData.qq = this.tableL.currentRow.qq;
    this.modalData.wechat = this.tableL.currentRow.wechat;
    this.modalData.email = this.tableL.currentRow.email;
    this.modalData.signature = this.tableL.currentRow.sign;
    this.modalData.src = this.tableL.currentRow.wechatPhoto;
    this.new = false;
    this.modal = true;
  },
  // 保存
  async save() {
    if(this.selectedArr.size <= 0 && this.cancelArr.size <= 0) {
      this.$Message.error('没有选择要改变的租户');
      return;
    }
    let addList = [];
    let delList = [];
    const customerId = this.tableL.currentRow.id;
     const bindres = await api.getTenantIds({ customerId }); // 客服绑定的所有租户
    let bindTenids = []; // 客服绑定的所有租户ids;
    if(bindres.code == 0) {
      bindTenids = bindres.data || [];
    }
    this.selectedArr.forEach(id => {
      addList.push({customerId, tenantId: id});
    });
    this.cancelArr.forEach(id => {
      bindTenids.forEach(el => {
        if(el.tenantId === id) {
          delList.push({customerId, tenantId: id, id: el.id});
        }
      });
    });
    let data = {
      addList,
      delList,
    }
    let res = await api.changeCT(data);
    if(res.code === 0) {
      this.$Message.success('保存成功');
      this.queryTenant();
    }
  },
  // 选择行
  selectRow(selection, row) {
    if(!row._orginChecked) {
      this.selectedArr.add(row.id);
    }
    this.cancelArr.delete(row.id);
  },
  // 取消选择行
  cancelSelectRow(selection, row) {
    if(row._orginChecked) {
      this.selectedArr.delete(row.id);
      if(row._checked) {
        this.cancelArr.add(row.id);
      }
    }
  },
  // 全选
  seleteAll(selection) {
    selection.forEach(el => {
      if(!el._checked && !el._orginChecked) {
        this.selectedArr.add(el.id);
      }
      this.cancelArr.delete(el.id);
    });
  },
  // 取消全选
  cancelAll(selection) {
    this.tableR.tbdata.forEach(el => {
      this.selectedArr.delete(el.id);
      if(el._checked) {
        this.cancelArr.add(el.id);
      }
    });
  },
  // 翻页
  changePageLeft(p) {
    this.pageL.page.num = p;
    this.initCustomer();
  },
  // 修改每页显示条数
  changeSizeLeft(size) {
    this.pageL.page.num = 1;
    this.pageL.page.size = size;
    this.initCustomer();
  },
  // 翻页
  changePageRight(p) {
    this.pageR.page.num = p;
    this.queryTenant();
  },
  // 修改每页显示条数
  changeSizeRight(size) {
    this.pageR.page.num = 1;
    this.pageR.page.size = size;
    this.queryTenant();
  },
  // 上传前
  handleBeforeUpload() {
    this.$refs.upload.clearFiles();
  },
  // 上传成功
  handleSuccess(res, file){
    if(res.code == 0) {
      this.modalData.src = api.getfile+res.data.url
    }
  },
  // 弹窗保存-保存/修改客服信息
  ok(name) {
    this.$refs[name].validate(async (valid) => {
      if (valid) {
          let data = {};
          if(!this.new) {
            data.id = this.modalData.id;
          }
          data.name = this.modalData.name;
          data.sex = Number(this.modalData.sex);
          data.birthday = this.modalData.birthday;
          data.mobile = this.modalData.mobile;
          data.qq = this.modalData.qq;
          data.wechat = this.modalData.wechat;
          data.email = this.modalData.email;
          data.sign = this.modalData.signature;
          data.wechatPhoto = this.modalData.src;
          let res = await api.saveCustomer(data);
          if(res.code === 0) {
            this.$Message.success('保存成功');
            this.cancel();
            this.initCustomer();
          }
      } else {
          this.$Message.error('请正确提交信息!');
      }
    })
  },
  // 弹窗取消
  cancel() {
    this.modal = false;
  },
  changeVisible() {
    if(this.new) {
      this.$refs.formValidate.resetFields();
    }
  },
  // 选择客服列表(左侧)行
  selectedRow(currentRow) {
    this.selectedArr = new Set();
    this.cancelArr = new Set();
    this.pageR.page = { num: 1, size: 10, total: 0 };
    this.tableL.currentRow = currentRow;
    this.queryTenant();
  }
};

export default {
  name: "customerServiceManagement",
  data,
  mounted,
  methods
};

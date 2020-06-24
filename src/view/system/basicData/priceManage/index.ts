import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/system/priceManage";
import DiaLog from "./dialog.vue";
import selectPartCom from "@/view/AlotManagement/transferringOrder/stockRemoval/compontents/selectPartCom";
import importXLS from '@/view/settlementManagement/components/importXLS'


@Component({
  components: {
    DiaLog,selectPartCom,importXLS
  }
})
export default class PriceManage extends Vue {
  private split: number = 0.34;
  // 按钮禁用
  private disabled: boolean = true;
  // 价格启用禁用按钮 是否可以点击
  private priceEnableBool:boolean=true
  // 价格启用禁用
  private priceEnable:string = "启用";
  // 左侧所被选中的行
  private rowPriceManege:any
  // modal显示
  private modal: boolean = false;
  // tab索引
  private tabIndex: number = 0;
  // 选中的行
  private currRow: any = null;
  // 选中是否第一行
  private curronly: boolean = false;
  // 级别修改和新增数据
  private levelupOrSaveArr: Array<any> = new Array();
  // 级别删除的数据
  private leveldelarr: Array<any> = new Array();
  // 级别名称
  private level: any = {
    loading: false,
    name: "", // 修改的级别名称
    tbdata: [{ name: "统一售价", readonly: true }]
  };
  // 选择的客户-从弹窗获取的
  private selectCrr: Array<any> = new Array();
  // 右边选择的客户
  private selectRightCR: Array<any> = new Array();
  // 右边删除的客户
  private removeRightCr: Array<any> = new Array();
  // 客户信息
  private customer = {
    pinyin: "", //客户拼音
    fullname: "", //客户全程
    // 表头
    // 表身
    tbdata: new Array(),
    // 表格加载
    loading: false,
    // 分页
    page: {
      num: 1,
      total: 0,
      size: 10
    }
  };
  // 配件
  private part = {
    pinyin: "", // 拼音
    code: "", // 编码
    fullname: "", // 名称
    // 表身
    tbdata: new Array(),
    // 表格加载
    loading: false,
    // 分页
    page: {
      num: 1,
      total: 0,
      size: 10
    }
  };
  private impirtUrl:any={
    downId: '1600000000',
    upUrl:api.impUrl
  }
  /**methods */
  /**==============左侧============= */
  // 获取表格
  private async getLevelList() {
    this.rowPriceManege={}?this.priceEnableBool=true:this.priceEnableBool=false
    this.level.tbdata = [{ name: "统一售价", readonly: true }];
    // isDisabled:0 启用
    // isDisabled:1 禁用
    let res = await api.sellPsList();
    if (res.code === 0) {
      console.log(res.data)
      res.data.forEach(el => {
        el.oid = el.id;
        this.level.tbdata.push(el);
      });
    }
    this.leveldelarr = [];
  }
  // 获取客户
  private async getCus() {
    this.customer.loading = true;
    this.selectCrr = [];
    this.removeRightCr = [];
    this.selectRightCR = [];
    let params: any = {};
    let data: any = {};
    if (this.customer.fullname) {
      data.fullName = this.customer.fullname.trim();
    }
    if (this.customer.pinyin) {
      data.pyName = this.customer.pinyin.trim();
    }
    data.strategyId = this.currRow.id;
    params.page = this.customer.page.num - 1;
    params.size = this.customer.page.size;
    let res = await api.findAllCus(params, data);
    if (res.code == 0) {
      this.customer.loading = false;
      this.customer.tbdata = res.data.content;
      this.customer.tbdata.forEach(el => {
        el.oid = el.id;
      });
      this.customer.page.total = res.data.totalElements;
    }
  }
  // 获取配件
  private async getPart() {
    this.part.loading = true;
    let data: any = {};
    let params: any = {};
    if (this.part.fullname) {
      data.fullName = this.part.fullname;
    }
    if (this.part.pinyin) {
      data.pinyin = this.part.pinyin;
    }
    if (this.part.code) {
      data.partCode = this.part.code;
    }
    params.strategyId = this.currRow.id;
    params.page = this.part.page.num - 1;
    params.size = this.part.page.size;
    let res = await api.queryPart(params, data);
    if (res.code == 0) {
      this.part.loading = false;
      this.part.tbdata = res.data.content.map((el: any) => {
        el.sellPrice =parseFloat(el.sellPrice).toFixed(2);
        el.costPrice = parseFloat(el.costPrice).toFixed(2);
        return el;
      });
      this.part.page.total = res.data.totalElements;
    }
  }
  // rest
  private restTbdata() {
    this.customer = {
      pinyin: "", //客户拼音
      fullname: "", //客户全程
      // 表头
      // 表身
      tbdata: new Array(),
      // 表格加载
      loading: false,
      // 分页
      page: {
        num: 1,
        total: 0,
        size: 10
      }
    };
    this.part = {
      pinyin: "", // 拼音
      code: "", // 编码
      fullname: "", // 名称
      // 表身
      tbdata: new Array(),
      // 表格加载
      loading: false,
      // 分页
      page: {
        num: 1,
        total: 0,
        size: 10
      }
    };
  }
  // 保存级别
  private async save() {
    let data: any = {
      addList: new Array()
    };
    data.addList = JSON.parse(JSON.stringify(this.level.tbdata));
    if (this.leveldelarr.length > 0) {
      data.delList = this.leveldelarr;
    }
    data.addList.forEach((el, index, arr) => {
      if (el.readonly) {
        arr.splice(index, 1);
      }
    });
    let isOk: boolean = data.addList.every((el: any) => {
      let name: string = el.name.trim();
      if (name && name.length >= 1) {
        return true;
      }
      return false;
    });
    if (!isOk) {
      return this.$Message.error("级别名称未输入");
    }
    let res = await api.sellPsSave(data);
    if (res.code === 0) {
      this.$Message.success("保存成功");
      this.getLevelList();
      this.restTbdata();
    }
  }
  // 新增
  private add() {
    this.level.tbdata.push({ name: "", isNew: true, oid: Date.now() });
  }
  // 单选行
  private selectRow({ row }) {
    this.rowPriceManege=row
    row.isDisabled==0?this.priceEnable="禁用":this.priceEnable="启用"
    const curs: any = this.$refs.curs;
    curs.custarr = new Array();
    this.currRow = row;
    this.disabled = false;
    this.selectCrr = new Array();
    this.removeRightCr = new Array();
    this.selectRightCR = new Array();
    this.customer.pinyin = "";
    this.customer.fullname = "";
    this.part.pinyin = "";
    this.part.code = "";
    this.part.fullname = "";
    if (row.readonly) {
      this.curronly = true;
      this.tabIndex = 1;
    } else {
      this.curronly = false;
      this.tabIndex = 0;
    }
    this.customer.page = {
      num: 1,
      total: 0,
      size: 10
    };
    this.part.page = {
      num: 1,
      total: 0,
      size: 10
    };
    if (row.isNew) return false;
    if (!this.curronly) {
      this.getCus();
    }
    this.getPart();
  }
  // 删除
  private remove() {
    if(!this.currRow) {
      return this.$Message.error("请先选中一个级别名称");
    }
    this.level.tbdata.forEach((el: any, index: number, arr: Array<any>) => {
      if (this.currRow.oid === el.oid && !el.readonly) {
        arr.splice(index, 1);
        el.id && this.leveldelarr.push(el);
      }
    });
    this.currRow = null;
  }
  // 切换价格启用禁用
  private priceEnableFun(){
    let data:any={}
    data.id=this.rowPriceManege.id
    api.sellPsList(data)
  }
  // tab切换
  private setTab(index: number) {
    this.tabIndex = index;
  }
  /**============客户信息============ */
  // 翻页-客户信息
  private changePageCus(p: number) {
    this.customer.page.num = p;
    this.getCus();
  }
  // 修改每页显示条数-客户信息
  private changeSizeCus(size: number) {
    this.customer.page.num = 1;
    this.customer.page.size = size;
    this.getCus();
  }
  // 查询客户
  private queryCustomer() {
    this.customer.page.num = 1;
    this.getCus();
  }
  // 添加客户
  private addCustomer() {
    const curs: any = this.$refs.curs;
    this.selectCrr = new Array();
    this.selectRightCR = new Array();
    this.removeRightCr = new Array();
    curs.init();
    this.modal = true;
  }
  // 添加客户
  private addcu(val) {
    this.modal = false;
    var obj = {};
    this.selectCrr = val;
    this.customer.tbdata = this.customer.tbdata.concat(val);
    this.customer.tbdata = this.customer.tbdata.reduce((item, next) => {
      obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
      return item;
    }, []);
  }
  // 右侧-选择客户
  private selectRC({ selection }) {
    this.selectRightCR = selection;
  }
  // 右侧-全选客户
  private selectAllrightcus({ selection }) {
    this.selectRightCR = selection;
  }
  // 删除客户
  private removeCustomer() {
    if (this.selectRightCR.length <= 0) {
      return this.$Message.error("请选择客户");
    }
    const curs: any = this.$refs.curs;
    this.removeRightCr = this.removeRightCr.concat(...this.selectRightCR);
    this.removeRightCr.forEach(rs => {
      this.customer.tbdata.forEach((el, index, arr) => {
        if (rs.id === el.id) {
          arr.splice(index, 1);
        }
      });
      this.selectRightCR.forEach((el, index, arr) => {
        if (rs.id === el.id) {
          arr.splice(index, 1);
        }
      });
      curs.custarr.forEach((el: any, index: number, arr: Array<any>) => {
        if (rs.id === el.id) {
          arr.splice(index, 1);
        }
      });
    });
  }
  // 保存客户
  private async saveCustomer() {
    let data: any = {
      addList: new Array(),
      delList: new Array()
    };
    data.addList = this.customer.tbdata.filter((el: any) => el.new);
    this.removeRightCr.forEach(el => {
      if (el.oid) {
        data.delList.push(el);
      }
    });
    if (data.addList.length <= 0 && data.delList.length <= 0) {
      return this.$Message.error("没有修改过数据");
    }
    data.addList.forEach(el => {
      el.strategyId = this.currRow.id;
      el.guestId = el.id||el.guestId;
      Reflect.deleteProperty(el, "id");
    });
    let res = await api.sellcussave(data);
    if (res.code === 0) {
      const curs: any = this.$refs.curs;
      curs.custarr = new Array();
      this.$Message.success("保存成功");
      this.getCus();
    }
  }
  /**============配件============ */
  // 翻页-配件价格
  private changePagePagePart(p: number) {
    this.part.page.num = p;
    this.getPart();
  }
  // 修改每页显示条数-配件价格
  private changeSizePagePart(size: number) {
    this.part.page.num = 1;
    this.part.page.size = size;
    this.getPart();
  }
  // 查询配件
  private queryPart() {
    this.part.page.num = 1;
    this.getPart();
  }
  // 添加配件
  private addAccessories(){
    this.$refs.selectPartCom.init()
  }
  //配件返回的参数
  private getPartNameList(val:any) {
    var arr = []
    val.forEach(item => {
      item.partName = item.partStandardName;
      item.hasAcceptQty = undefined;
      item.carBrandName = item.adapterCarModel;
      item.orderPrice = item.minUnit;
      item.oemCode = item.oeCode;
      item.spec = item.specifications;
      item.partId = item.orgid;
      item.partInnerId = item.code;
      item.unit = item.minUnit;
      let el = Object.assign({}, item);
      delete el.id;
      delete el.orderPrice;
      arr.push(el)
    });
    var allArr = []; //新数组
    this.Leftcurrentrow.detailVOS = [
      ...this.Leftcurrentrow.detailVOS,
      ...arr
    ];
    var allArr = [];
    var oldArr = this.Leftcurrentrow.detailVOS;
    for (var i = 0; i < oldArr.length; i++) {
      var flag = true;
      for (var j = 0; j < allArr.length; j++) {
        if (oldArr[i].oemCode == allArr[j].oemCode) {
          flag = false;
        }
      }
      if (flag) {
        allArr.push(oldArr[i]);
      }
    }
    this.Leftcurrentrow.detailVOS = allArr;
    setTimeout(()=>{
      this.$Message.success("已添加");
    },0)
  }
  // 导入模板
  private importModule(){
    this.$refs.imp.openModal()
  }
  //导入成功后刷新页
  private getNew(data){}
  // 保存配件
  private async savePart() {
    let res: any;

    let data = [...this.part.tbdata];
    data.forEach((el: any) => {
      el.pchsPrice = el.costPrice;
    });
    console.log(data, "data ==>383");
    if (this.curronly) {
      res = await api.partPriceSave(data);
    } else {
      data.map((el: any) => {
        el.strategyId = this.currRow.id;
        return el;
      });
      res = await api.partLevelSave(data);
    }
    if (res.code == 0) {
      this.$Message.success("保存成功");
      this.queryPart();
    }
  }

  /**mounted */
  private mounted() {
    this.getLevelList();
  }
}

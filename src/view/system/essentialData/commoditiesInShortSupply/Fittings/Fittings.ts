import { Vue, Component } from "vue-property-decorator";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
// @ts-ignore
import * as api from "_api/system/partManager";
// @ts-ignore
import * as tools from "_utils/tools";
// @ts-ignore
import accessories from "./modal/Accessories";
// @ts-ignore
import { getCarPartClass } from "_api/parts";


import {
  getSaveNewTight,
  getCloudList,
  getLocalList,
  getGmList
} from "@/api/system/essentialData/commoditiesInShortSupply";

@Component({
  components: {
    accessories
  }
})
export default class Fittings extends Vue {
  /**===================Data======================== */
  private isSys: boolean = true; // window.localStorage.tenantId == 0;
  // 品牌列表
  private bands: SelectTypes[] = [
    {
      value: "0",
      label: "全部"
    }
  ];
  // 侧树形菜单
  private treeData: Array<Tree> = [];
  // 查询条件数组
  private queryList: SelectTypes[] = [
    {
      value: "0",
      label: "编码"
    },
    {
      value: "1",
      label: "名称"
    },
    {
      value: "2",
      label: "车型"
    },
    // {
    //   value: "3",
    //   label: "拼音"
    // }
  ];
  // local cloud表头字段
  tcolumns: Tableth = [
    {
      title: "基础信息",
      key: "brandName",
      children: [
        {
          type: "selection",
          minWidth: 60,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          minWidth: 80
        },
        {
          title: "内码",
          key: "partId",
          minWidth: 120
        },
        {
          title: "编码",
          key: "partCode",
          minWidth: 120
        },
        {
          title: "名称",
          key: "partStandardName",
          minWidth: 120
        },
        {
          title: "品牌车型",
          key: "carModelName",
          minWidth: 120
        },
        {
          title: "规格",
          key: "spec",
          minWidth: 120
        },
        {
          title: "型号",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "品质",
          key: "qualityName",
          minWidth: 120
        },
        {
          title: "品牌",
          key: "partBrandName",
          minWidth: 120
        },
        {
          title: "OEM码",
          key: "oeCode",
          minWidth: 120
        },
        {
          title: "单位",
          key: "unitld",
          minWidth: 120
        },
        {
          title: "一级分类",
          minWidth: 120,
          render: (h, params) => {
            return h("span", params.row.carTypefName||"");
          }
        },
        {
          title: "二级分类",
          minWidth: 120,
          render: (h, params) => {
            return h("span", params.row.carTypesName||"");
          }
        },
        {
          title: "产地",
          key: "placeOfOrigin",
          minWidth: 120
        },
        {
          title: "生产厂家",
          key: "manufactor",
          minWidth: 120
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 120
        },
        {
          title: "状态",
          minWidth: 80,
          render: (h, params) => {
            let text: string = params.row.isDisabled ? "禁用" : "启用";
            return h("span", text);
          }
        },
        {
          title: "禁售",
          minWidth: 80,
          render: (h, params) => {
            let text: string = params.row.isSale ? "禁售" : "可售";
            return h("span", text);
          }
        },
        {
          title: "全称",
          key: "fullName",
          minWidth: 240
        },
      ]
    },
  ];
  //日期控件不可选择
  private options3: any = {
    disabledDate(date) {
      return date && date.valueOf() < Date.now() - 86400000;
    }
  };

  private expireDate: string = ""; //过期时间
  // local表格
  private local: any = {
    // 表头
    columns: this.tcolumns,
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
  };
  // 平台
  private cloud: any = {
    // 表头
    columns: this.tcolumns,
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
  };
  private split: number = 0.33;
  private queryValue: string = ""; // 选中的查询条件
  private query: string = ""; // 查询条件文字
  private band: string = ""; // 选中的品牌
  private selectTreeId: string = ""; // 选中的树形菜单
  // 禁售和可售 true可售
  private isSale: boolean = true;
  // 启用禁用 true启用
  private isDisable: boolean = true;
  // tab索引
  private tabIndex: number = 0;
  // 选中的行
  private currRow: any = null;
  // 按钮可用
  private isCanbutton: boolean = false;
  // 上传 请求头
  private headers = {
    Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
  };
  private upurl = api.upxlxs;
  /**===================Mounted======================== */
  private mounted() {
    // if(this.isSys) {
    //   this.tabIndex = 1;
    // };
    this.tabIndex = 1;
    this.getBand();
    this.treeInit();
    // this.initLocalPartInfo();
    // this.initCloudPartInfo();
  }

  /**===================Methods======================== */

  // 还原参数
  private restParams() {
    let page = {
      num: 1,
      total: 0,
      size: 10
    };
    this.local.page = this._.cloneDeep(page);
    this.cloud.page = this._.cloneDeep(page);
  }

  // 初始化配件分类
  private async treeInit() {
    let res: any = await getCarPartClass();
    this.treeData = res;
  }
  // 获取品牌
  private async getBand() {
    let res = await api.getWbPartBrand();
    if (res.code == 0) {
      for (let quality of res.data.content) {
        if (quality.children.length <= 0) {
          break;
        }
        quality.children.forEach((el: any) => {
          el.label = el.name;
          el.value = el.code;
          this.bands.push(el);
        });
      }
      // res.data.content.forEach((el: any) => {
      //   el.label = el.name;
      //   el.value = el.id;
      //   this.bands.push(el);
      // })
    }
  }

  // 初始化本地配件资料 - 维保
  private async initLocalPartInfo() {
    this.local.loading = true;
    let ref:any = this.$parent.$parent;
    let params: Kv = {};
    let data: Kv = {};
    params.page = this.local.page.num - 1;
    params.size = this.local.page.size;
    const queryValue = this.queryValue.trim();
    if (queryValue.length > 0) {
      data.partCode = queryValue;
    }
    if (this.band != "0") {
      data.brandCode = this.band;
    }
    if (this.selectTreeId) {
      // data.carTypeIdThr = this.selectTreeId;
      data.typeId = this.selectTreeId;
    }
    data.stockId = ref.storeId||"";
    let res: any = await api.attrQueryAllPage(params, data);
    if (res.code == 0) {
      this.local.tbdata = res.data.content;
      this.local.page.total = res.data.totalElements;
      this.local.loading = false;
    }
  }
  // 初始化平台配件资料 - wb 维保
  private async initCloudPartInfo() {
    this.cloud.loading = true;
    let ref:any = this.$parent.$parent;
    let params: Kv = {};
    let data: Kv = {};
    params.tenantId = 0;
    params.page = this.cloud.page.num - 1;
    params.size = this.cloud.page.size;
    const queryValue = this.queryValue.trim();
    if (queryValue.length > 0) {
      data.partCode = queryValue;
    }
    // console.log(this.query)
    if (this.band&&this.band != "0") {
      data.partBrandId = this.band;
      // data.partBrandCode = this.band;
    }
    if (this.selectTreeId) {
      // data.carTypeIdThr = this.selectTreeId;
      data.typeId = this.selectTreeId;
    }
    data.stockId = ref.storeId||"";
    // console.log(params,data)
    let res: any = await getLocalList({ ...params, ...data });
    if (res.code == 0) {
      this.cloud.tbdata = res.data.content;
      res.data.content.map(item => {
        if (item.isTight == 0) {
          item._disabled = true;
        }
      });
      this.cloud.page.total = res.data.totalElements;
      this.cloud.loading = false;
    } else {
      this.$Message.error("添加失败");
    }
  }
  // 查询
  private queryHandle() {
    this.cloud.page.num = 0;
    if (this.tabIndex === 0) {
      this.initLocalPartInfo();
    } else {
      this.initCloudPartInfo();
    }
  }
  // 选中树形菜单
  private selectedTree(tree: Array<Tree>, data: Tree) {
    this.restParams();
    this.selectTreeId = data.typeId;
    // this.initLocalPartInfo();
    this.initCloudPartInfo();
  }
  // tab切换
  private setTab(index: number) {
    this.tabIndex = index;
  }
  /* 本地平台 */
  // 新增
  private add() {
    let accessories: any = this.$refs.accessories;
    accessories.proModal = true;
  }
  // 修改
  private change() {
    let partid = this.currRow.id;
    let accessories: any = this.$refs.accessories;
    accessories.update = true;
    accessories.id = partid;
    accessories.proModal = true;
  }
  //修改时间
  private changTime(data) {
    this.expireDate = data;
  }

  // 选择数据
  private async changeDisable() {
    let self: any = this;
    if (!self.expireDate) {
      self.$Message.error("请先选中结束日期");
      return false;
    }
    if (!self.currRow) {
      self.$Message.error("至少选中一条信息");
      return false;
    }
    let data: any = [];
    let pastTime: any = self.expireDate + " " + "23:59:59";
    self.currRow.forEach(item => {
      item.passTime = pastTime;
      data.push(item);
    });
    let res: any = await getSaveNewTight(data);
    if (res.code == 0) {
      this.$emit("getNewList", res);
      if (this.isSys) {
        this.initCloudPartInfo();
        this.$Message.success("保存成功");
      } else {
        this.initLocalPartInfo();
      }
    }
  }
  //关闭新增页面
  private closeShow() {
    this.$emit("setShow", this.currRow);
  }
  // 导入
  private importOpen() {}
  // 下载模板
  private downTemplate() {}
  // 刷新
  private refresh() {
    this.initLocalPartInfo();
  }
  // 可售 禁售
  private async changeSale() {
    let self: any = this;
    let id = this.currRow.id;
    let res: any = await api.toggleSale(id);
    let success: string = "";
    if (this.isDisable) {
      success = "禁售成功";
    } else {
      success = "可售成功";
    }
    if (res.code == 0) {
      self.$Message.success(success);
    }
    if (this.isSys) {
      this.initCloudPartInfo();
    } else {
      this.initLocalPartInfo();
    }
  }
  // 单选行
  private selectRow(row: any) {
    this.currRow = row;
    // this.isCanbutton = true;
    this.isDisable = row.isDisabled;
    // this.isSale = row.isSell == 0 ? true : false;
  }
  // 翻页-本地
  private changePagelocal(p: number) {
    this.local.page.num = p;
    this.initLocalPartInfo();
  }
  // 修改每页显示条数-本地
  private changeSizelocal(size: number) {
    this.local.page.num = 1;
    this.local.page.size = size;
    this.initLocalPartInfo();
  }
  /**平台 */
  //  翻页-平台
  private changePageCloud(p: number) {
    this.cloud.page.num = p;
    this.initCloudPartInfo();
  }
  // 修改每页显示条数-平台
  private changeSizeCloud(size: number) {
    this.cloud.page.num = 1;
    this.cloud.page.size = size;
    this.initCloudPartInfo();
  }
  // 刷新-平台
  private couldRefresh() {
    this.initCloudPartInfo();
  }
  // 上传前
  private handleBeforeUpload() {
    let refs: any = this.$refs;
    refs.upload.clearFiles();
  }
  // 上传成功
  private handleSuccess(res, file) {
    let self: any = this;
    if (res.code == 0) {
      self.$Message.success("导入成功");
      if (this.isSys) {
        this.initCloudPartInfo();
      } else {
        this.initLocalPartInfo();
      }
    } else {
      self.$Message.error(res.message);
    }
  }
}

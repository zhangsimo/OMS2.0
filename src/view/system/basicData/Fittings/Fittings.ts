import { Vue, Component } from "vue-property-decorator";
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
// @ts-ignore
import * as api from "_api/system/partManager";
// @ts-ignore
import * as tools from "_utils/tools";
// @ts-ignore
import accessories from './modal/Accessories';

@Component({
  components: {
    accessories
  }
})
export default class Fittings extends Vue {
  /**===================Data======================== */
  private isSys: boolean = window.localStorage.tenantId == 0;
  // 品牌列表
  private bands: SelectTypes[] = [{
    value: "0",
    label: "全部"
  }];
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
    {
      value: "3",
      label: "拼音"
    }
  ];
  // local cloud表头字段
  tcolumns: Tableth = [
    {
      title: "基础信息",
      key: "brandName",
      children: [
        {
          title: "序号",
          type: "index",
          minWidth: 80
        },
        {
          title: "内码",
          key: "id",
          minWidth: 120
        },
        {
          title: "品质",
          key: "qualityTypeName",
          minWidth: 120
        },
        {
          title: "品牌",
          key: "partBrandName",
          minWidth: 120
        },
        {
          title: "编码",
          key: "code",
          minWidth: 120
        },
        {
          title: "名称",
          key: "name",
          minWidth: 120
        },
        {
          title: "全称",
          key: "fullName",
          minWidth: 120
        },
        {
          title: "OEM码",
          key: "oemCode",
          minWidth: 120
        },
        {
          title: "产地",
          key: "origin",
          minWidth: 120
        },
        {
          title: "单位",
          key: "unit",
          minWidth: 120
        },
      ]
    },
    {
      title: " ",
      key: "brandName",
      children: [
        {
          title: "规格",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "型号",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "品牌车型",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "一级分类",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "二级分类",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "三级分类",
          key: "brandName",
          minWidth: 120
        },
      ]
    },
    {
      title: "辅助信息",
      key: "brandName",
      children: [
        {
          title: "备注",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "状态",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "禁售",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "生产厂家",
          key: "brandName",
          minWidth: 120
        },
      ]
    },
  ];
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
    },
  }
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
    },
  }
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
  private isCanbutton:boolean = false;
  // 上传 请求头
  private headers = {
    Authorization:'Bearer ' + Cookies.get(TOKEN_KEY)
  }
  private upurl = api.upxlxs;
  /**===================Mounted======================== */
  private mounted() {
    if(this.isSys) {
      this.tabIndex = 1;
    };
    this.getBand();
    this.treeInit();
    this.initLocalPartInfo();
    this.initCloudPartInfo();
  }

  /**===================Methods======================== */

  // 还原参数
  private restParams() {
    let page = {
      num: 1,
      total: 0,
      size: 10
    }
    this.local.page = this._.cloneDeep(page);
    this.cloud.page = this._.cloneDeep(page);
  }

  // 初始化配件分类
  private async treeInit() {
    let res: any = await api.findAllByTree();
    if (res.code == 0) {
      this.treeData = res.data;
      tools.transTree(this.treeData);
    }
  }
  // 获取品牌
  private async getBand() {
    let res = await api.getPartBrand();
    if (res.code == 0) {
      res.data.forEach((el: any) => {
        if (el.parentId != '0') {
          el.label = el.name;
          el.value = el.id;
          this.bands.push(el);
        }
      })
    }
  }

  // 初始化本地配件资料
  private async initLocalPartInfo() {
    this.local.loading = true;
    let params: Kv = {};
    let data: Kv = {};
    params.page = this.local.page.num - 1;
    params.size = this.local.page.size;
    switch (this.queryValue) {
      case "0":
        data.queryCode = this.query;
        break;
      case "1":
        data.fullName = this.query;
        break;
      case "2":
        data.applyCarModel = this.query;
        break;
      case "3":
        data.namePy = this.query;
        break;
      default:
        break;
    }
    if (this.band != "0") {
      data.partBrandId = this.band;
    }
    if (this.selectTreeId) {
      data.carTypeIdThr = this.selectTreeId;
    }
    let res: any = await api.attrQueryAllPage(params, data);
    if (res.code == 0) {
      this.local.tbdata = res.data.content;
      this.local.page.total = res.data.totalElements;
      this.local.loading = false;
    }
  }
  // 初始化平台配件资料
  private async initCloudPartInfo() {
    this.cloud.loading = true;
    let params: Kv = {};
    let data: Kv = {};
    params.tenantId = 0;
    params.page = this.cloud.page.num - 1;
    params.size = this.cloud.page.size;
    switch (this.queryValue) {
      case "0":
        data.queryCode = this.query;
        break;
      case "1":
        data.fullName = this.query;
        break;
      case "2":
        data.applyCarModel = this.query;
        break;
      case "3":
        data.namePy = this.query;
        break;
      default:
        break;
    }
    if (this.band != "0") {
      data.partBrandId = this.band;
    }
    if (this.selectTreeId) {
      data.carTypeIdThr = this.selectTreeId;
    }
    let res: any;
    if(this.isSys) {
      res = await api.sysAll(params, data);
    } else {
      res = await api.attrQueryAll(params, data);
    }
    if (res.code == 0) {
      this.cloud.tbdata = res.data.content;
      this.cloud.page.total = res.data.totalElements;
      this.cloud.loading = false;
    }
  }
  // 查询
  private queryHandle() {
    if (this.tabIndex === 0) {
      this.initLocalPartInfo();
    } else {
      this.initCloudPartInfo();
    }
  }
  // 选中树形菜单
  private selectedTree(tree: Array<Tree>, data: Tree) {
    this.restParams();
    this.selectTreeId = data.id;
    this.initLocalPartInfo();
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
    accessories.update = false;
    accessories.proModal = true;
    accessories.formValidate =  {
      qualityTypeId: "", //品质
      partBrandId: "", //品牌
      code: "", //配件编码
      name: "", //配件名称
      unit: "", //配件单位
      unitname: "", // 配件单位名称
      oemCode: "", //oe码
      spec: "", //规格
      model: "", //型号
      applyCarbrandId: "", //适用车型Id
      explain: "", //车型说明
      commonCode: "", //通用编码
      produceFactory: "", //生产厂家
      origin: "", //产地
      fullName: "", //配件全称
      customClassName: "",
      remarks: "", //备注
      specVOList: new Array(), //规格list
      valueVOS: new Array() //单位换算list
    }
  }
  // 修改
  private change() {
    let partid = this.currRow.id;
    let accessories: any = this.$refs.accessories;
    accessories.update = true;
    accessories.id = partid;
    accessories.proModal = true;
  }
  // 启用 禁用
  private async changeDisable() {
    let self:any = this;
    let id = this.currRow.id;
    let res:any = await api.toggleDis(id);
    let success:string = '';
    if(this.isDisable) {
      success = '禁用成功';
    } else {
      success = '启用成功';
    }
    if(res.code == 0) {
      self.$Message.success(success);
    }
    if(this.isSys) {
      this.initCloudPartInfo();
    } else {
      this.initLocalPartInfo();
    }
  }
  // 导入
  private importOpen() { }
  // 下载模板
  private downTemplate() {}
  // 刷新
  private refresh() {
    this.initLocalPartInfo();
  }
  // 可售 禁售
  private async changeSale() {
    let self:any = this;
    let id = this.currRow.id;
    let res:any = await api.toggleSale(id);
    let success:string = '';
    if(this.isDisable) {
      success = '禁售成功';
    } else {
      success = '可售成功';
    }
    if(res.code == 0) {
      self.$Message.success(success);
    }
    if(this.isSys) {
      this.initCloudPartInfo();
    } else {
      this.initLocalPartInfo();
    }
  }
  // 单选行
  private selectRow(row: any) {
    this.currRow = row;
    this.isCanbutton = true;
    this.isDisable = row.disabled == 0 ? true : false;
    this.isSale = row.isSell == 0 ? true : false;
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
    let refs:any =  this.$refs;
    refs.upload.clearFiles();
  }
  // 上传成功
  private handleSuccess(res, file){
    let self:any = this;
    if(res.code == 0) {
      self.$Message.success('导入成功');
      if(this.isSys) {
        this.initCloudPartInfo();
      } else {
        this.initLocalPartInfo();
      }
    } else {
      self.$Message.error(res.message);
    }
  }
}
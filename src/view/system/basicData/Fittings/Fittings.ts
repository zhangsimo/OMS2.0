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
  private isSys: boolean = true; // window.localStorage.tenantId == 0;
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
          key: "code",
          minWidth: 120
        },
        {
          title: "品质",
          key: "quality",
          minWidth: 120
        },
        {
          title: "品牌",
          key: "partBrand",
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
          title: "全称",
          key: "fullName",
          minWidth: 240
        },
        {
          title: "OEM码",
          key: "oeCode",
          minWidth: 120
        },
        {
          title: "产地",
          key: "placeOfOrigin",
          minWidth: 120
        },
        {
          title: "单位",
          key: "minUnit",
          minWidth: 120
        },
      ]
    },
    {
      title: " ",
      key: "",
      children: [
        {
          title: "规格",
          key: "specifications",
          minWidth: 120
        },
        {
          title: "型号",
          key: "brandName",
          minWidth: 120
        },
        {
          title: "品牌车型",
          key: "adapterCarModel",
          minWidth: 120
        },
        {
          title: "一级分类",
          minWidth: 120,
          render: (h, params) => {
            let text:string = '';
            try {
              text = params.row.baseType.firstType.typeName
            } catch(e) {}
            return h('span', text);
          }
        },
        {
          title: "二级分类",
          minWidth: 120,
          render: (h, params) => {
            let text:string = ''
            try {
              text = params.row.baseType.secondType.typeName
            } catch(e) {}
            return h('span', text);
          }
        },
        {
          title: "三级分类",
          minWidth: 120,
          render: (h, params) => {
            let text:string = ''
            try {
              text = params.row.baseType.thirdType.typeName
            } catch(e) {}
            return h('span', text);
          }
        },
      ]
    },
    {
      title: "辅助信息",
      key: "",
      children: [
        {
          title: "备注",
          key: "remark",
          minWidth: 120
        },
        {
          title: "状态",
          minWidth: 80,
          render: (h, params) => {
            let text:string = params.row.isDisabled ? '禁用' : '启用';
            return h('span', text);
          }
        },
        {
          title: "禁售",
          minWidth: 80,
          render: (h, params) => {
            let text:string = params.row.isSale ? '禁售' : '可售';
            return h('span', text);
          }
        },
        {
          title: "生产厂家",
          key: "manufactor",
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
    // if(this.isSys) {
    //   this.tabIndex = 1;
    // };
    this.tabIndex = 1;
    this.getBand();
    this.treeInit();
    // this.initLocalPartInfo();
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
    let res: any = await api.findWbAllByTree();
    if (res.code == 0) {
      this.treeData = res.data.content;
      tools.transTree(this.treeData, 'typeName');
    }
  }
  // 获取品牌
  private async getBand() {
    let res = await api.getWbPartBrand();
    if (res.code == 0) {
      for(let quality of res.data.content) {
        if(quality.children.length <= 0) {
          break;
        }
        quality.children.forEach((el:any) => {
          el.label = el.name;
          el.value = el.code;
          this.bands.push(el);
        })
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
    let params: Kv = {};
    let data: Kv = {};
    params.page = this.local.page.num - 1;
    params.size = this.local.page.size;
    // switch (this.queryValue) {
    //   case "0":
    //     data.queryCode = this.query;
    //     break;
    //   case "1":
    //     data.fullName = this.query;
    //     break;
    //   case "2":
    //     data.applyCarModel = this.query;
    //     break;
    //   case "3":
    //     data.namePy = this.query;
    //     break;
    //   default:
    //     break;
    // }
    switch (this.queryValue) {
        case "0":
          data.partCode = this.query;
          break;
        case "1":
          data.fullName = this.query;
          break;
        case "2":
          data.applyCarModel = this.query;
          break;
        case "3":
          data.keyWord = this.query;
          break;
        default:
          break;
      }
    if (this.band != "0") {
      // data.partBrandId = this.band;
      data.brandCode = this.band;
    }
    if (this.selectTreeId) {
      // data.carTypeIdThr = this.selectTreeId;
      data.typeId = this.selectTreeId;
    }
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
    let params: Kv = {};
    let data: Kv = {};
    params.tenantId = 0;
    params.page = this.cloud.page.num - 1;
    params.size = this.cloud.page.size;
    switch (this.queryValue) {
      case "0":
        data.partCode = this.query;
        break;
      case "1":
        data.fullName = this.query;
        break;
      case "2":
        data.applyCarModel = this.query;
        break;
      case "3":
        data.keyWord = this.query;
        break;
      default:
        break;
    }
    if (this.band != "0") {
      // data.partBrandId = this.band;
      data.partBrandCode = this.band;
    }
    if (this.selectTreeId) {
      // data.carTypeIdThr = this.selectTreeId;
      data.typeId = this.selectTreeId;
    }
    let res: any = await api.getwbParts({...params, ...data});
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
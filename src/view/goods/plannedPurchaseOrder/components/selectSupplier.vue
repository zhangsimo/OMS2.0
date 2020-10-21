<template>
  <div>
    <Modal v-model="searchPartLayer" :title="headerTit" width="1000">
      <div class="partCheck-hd">
        <!--<Input class="w100 mr10" v-model="fullName" placeholder="名称" />-->
        <!--<Input class="w100 mr10" v-model="code" placeholder="编码" />-->
        <!--<Input class="w100 mr10" v-model="contactorTel" placeholder="电话" />-->
        <el-input class="w250 mr10" v-model="fullName" ref="focusInput" placeholder="全称/简称/编码/拼音" @keyup.enter.native="search"></el-input>
        <!-- <Checkbox class="mr20 ml10" v-model="single" @on-change="search"> 显示禁用</Checkbox> -->
        <Button @click="search" class="mr10" type="primary"
          ><Icon type="ios-search" size="14" /> 查询</Button
        >
        <Button class="mr10" type="default" @click="throwData"
          ><Icon type="md-checkmark" /> 选择</Button
        >
        <Button class="mr10" type="default"
          @click="cancel"
          ><Icon type="md-close" /> 取消</Button
        >
        <!--<Button type='default' @click="addPartModal=true"><Icon type="md-add" /> 新增配件名称</Button>-->
      </div>
      <div class="partCheck-main clearfix">
        <div class="partCheck-left fl">
          <div class="partCheck-left-tit">供应商分类</div>
          <div class="partCheck-left-tree">
            <Tree
              v-loading="treeLoading"
              :data="treeData"
              @on-select-change="selectTree"
            ></Tree>
          </div>
        </div>
        <div class="fr partCheck-right" style="width: 758px">
          <Table
            height="389"
            @on-current-change="selectTabelData"
            @on-row-dblclick="dblclick"
            highlight-row
            :loading="loading"
            border
            :stripe="true"
            :columns="columnsPart"
            :data="partData"
          ></Table>
          <Page
            size="small"
            class-name="page-con fr pt10"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
          ></Page>
        </div>
      </div>
      <div slot="footer">
        <!--<Button type='primary' @click='submit("proModal")'>确定</Button>-->
        <!--<Button type='default' @click='proModal = false'>取消</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";

@Component
export default class SelectSupplier extends Vue {
  @Prop(String)
  private readonly headerTit;

  private loading: boolean = false;
  private treeLoading: boolean = false;

  private searchPartLayer: boolean = false; // 配件名称查询层
  private fullName: string = ""; // 供应商名称查询
  private code: string = ""; // 供应商编码查询
  private contactorTel: string | number = ""; // 供应商电话询
  private single: boolean = false; // 是否显示禁用
  private treeData: Array<Tree> = new Array(); //系统分类树形数据
  //配件名称查询层表头
  private columnsPart: Array<Tableth> = [
    {
      title: "序号",
      width: 50,
      type: "index"
    },
    {
      title: "供应商名称",
      key: "fullName",
      minWidth: 200,
      tooltip: true,
    },
    {
      title: "编码",
      key: "code",
      minWidth: 100,
      tooltip: true,
    },
    {
      title: "简称",
      key: "shortName",
      minWidth: 100
    },
    {
      title: "状态",
      key: "auditSign",
      minWidth: 80,
      render: (h, params) => {
        let auditSign:any;
        let val:string = '';
        try {
          auditSign = JSON.parse(params.row.auditSign);
          val = auditSign.name;
          return h('span', val);
        } catch(e) {
          return h('span', val);
        }
      }
    },
    {
      title: "联系人",
      key: "contactor",
      minWidth: 80
    },
    {
      title: "联系人手机号",
      key: "contactorTel",
      minWidth: 120
    },
    {
      title: "业务员",
      key: "salesman",
      minWidth: 80
    },
    {
      title: "业务员电话",
      key: "salesmanTel",
      minWidth: 120
    },
    {
      title: "票据类型",
      key: "billTypeName",
      minWidth: 80
    },
    {
      title: "结算方式",
      key: "settTypeName",
      minWidth: 100
    },
    {
      title: "是否内部供应商",
      key: "isSupplier",
      minWidth: 120,
      render: (h, p) => {
        let val:string = p.row.isSupplier ? '是' : '否';
        return h('span', val);
      }
    },
    {
      title: "优势品牌/产品",
      key: "advantageCarbrandId",
      minWidth: 120
    }
  ];
  //配件名称查询层配件数据
  private partData: Array<any> = new Array();
  //配件数据选中的数据
  private selectTableItem: any = null;
  //树形选中数据
  private selectTreeItem: any = null;
  //分页obj
  private page: Page = {
    num: 1,
    size: 10,
    total: 0
  };

  //获取系统分类
  private async getCarClassifysFun() {
    this.treeLoading = true;
    let res: any = await api.getSupplierType();
    if (res.code == 0) {
      this.treeLoading = false;
      this.treeData = this.resetData(res.data);
    }
  }
  //树形数组递归加入新属性
  private resetData(treeData) {
    treeData.map(item => {
      if (item.children && item.children.length > 0) {
        item.children = this.resetData(item.children);
      }
    });
    return treeData;
  }

  // 获取表格数据
  private async getList() {
    this.loading = true;
    let params: any = {};
    params.page = this.page.num - 1;
    params.size = this.page.size;
    params.isDisabled = 0;//供应商是否禁用 0非禁用 1禁用
    params.approveStatus = 1//供应商是否审批通过 1审批通过 2审批不通过 0 审核中
    let arr = [
      'fullName',
      'code',
      'contactorTel',
    ];
    arr.forEach(key => {
      if(this[key].trim().length > 0) {
        params[key] = this[key];
      }
    })
    if (this.selectTreeItem) {
      params.supplierTypeFirst = this.selectTreeItem.id;
    }
    let res = await api.getSupplier(params);
    if (res.code == 0) {
      this.loading = false;
      this.partData = (res.data.content || [])
      this.page.total = res.data.totalElements;
    }
  }

  // 搜索
  private search() {
    this.page.num = 1;
    this.getList();
  }
  //系统分类树形节点点击数据
  private selectTree(v) {
    if(v.length > 0) {
      this.selectTreeItem = v[0];
      this.getList();
    }
  }
  //显示层
  private init() {
    this.fullName = "";
    this.code = "";
    this.contactorTel = "";
    this.selectTableItem = null;
    this.searchPartLayer = true;
    this.getCarClassifysFun();
    this.getList();

    let inputFocus:any = this.$refs['focusInput'];
    this.$nextTick(()=>{
      inputFocus.focus();
    })
  }
  //配件表格点击的行
  private selectTabelData(v) {
    this.selectTableItem = v;
  }
  // 选择
  @Emit('selectSearchName')
  private throwData() {
    if(!this.selectTableItem) {
      this.$Message.error('请选择供应商');
      return null;
    }
    this.searchPartLayer = false;
    return this.selectTableItem;
  }
  dblclick(){
    this.throwData();
  }
  // 取消
  private cancel() {
    this.selectTableItem = null;
    this.searchPartLayer = false;
  }
  //分页
  private changePage(p) {
    this.page.num = p;
    this.getList();
  }
  private changeSize(size) {
    this.page.num = 1;
    this.page.size = size;
    this.getList();
  }
}
</script>

<style lang="less" scoped>
.partCheck-hd {
  //border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.partCheck-left {
  border: 1px solid #ddd;
  width: 200px;
  .partCheck-left-tit {
    text-align: center;
    border-bottom: 1px solid #ddd;
    line-height: 36px;
  }
}
.partCheck-left-tree {
  padding: 10px;
  height: 350px;
  overflow-y: auto;
}

.custom-main {
  border-top: 1px solid #ddd;
  .custom-type-hd {
    padding: 10px 0 6px;
  }
  .tag-span {
    cursor: pointer;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    padding: 4px 10px;
    border-radius: 2px;
    display: inline-block;
    &.active {
      background: #fd5c5c;
      border-color: #fd5c5c;
      color: #fff;
    }
  }
}
</style>

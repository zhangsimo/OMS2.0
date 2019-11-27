<template>
  <div>
    <Modal v-model="searchPartLayer" :title="headerTit" width="1000">
      <div class="partCheck-hd">
        <Input class="w100 mr10" v-model="supplierName" placeholder="名称" />
        <Input class="w100 mr10" v-model="supplierCode" placeholder="编码" />
        <Input class="w100 mr10" v-model="supplierTel" placeholder="电话" />
        │
        <Checkbox class="mr20 ml10" v-model="single"> 显示禁用</Checkbox>
        <Button @click="search" class="mr10" type="primary"
          ><Icon type="ios-search" size="14" /> 查询</Button
        >
        <Button class="mr10" type="default" @click="throwData"
          ><Icon type="md-checkmark" /> 选择</Button
        >
        <Button class="mr10" type="default"
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
import { Vue, Component, Prop } from "vue-property-decorator";
// import * as api from "_api/system/partManager";
@Component
export default class SelectSupplier extends Vue {
  @Prop(String)
  private readonly headerTit;

  private loading: boolean = false;
  private treeLoading: boolean = false;

  private searchPartLayer: boolean = false; // 配件名称查询层
  private supplierName: string = ""; // 供应商名称查询
  private supplierCode: string = ""; // 供应商编码查询
  private supplierTel: string | number = ""; // 供应商电话询
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
      key: "groupName",
      minWidth: 120
    },
    {
      title: "编码",
      key: "groupName",
      minWidth: 120
    },
    {
      title: "简称",
      key: "groupName",
      minWidth: 100
    },
    {
      title: "状态",
      key: "groupName",
      minWidth: 80
    },
    {
      title: "联系人",
      key: "groupName",
      minWidth: 80
    },
    {
      title: "联系人手机号",
      key: "groupName",
      minWidth: 120
    },
    {
      title: "业务员",
      key: "groupName",
      minWidth: 80
    },
    {
      title: "业务员电话",
      key: "groupName",
      minWidth: 120
    },
    {
      title: "票据类型",
      key: "groupName",
      minWidth: 80
    },
    {
      title: "结算方式",
      key: "groupName",
      minWidth: 100
    },
    {
      title: "是否内部供应商",
      key: "groupName",
      minWidth: 120
    },
    {
      title: "优势品牌/产品",
      key: "groupName",
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
  private getCarClassifysFun() {
    this.treeLoading = true;
  }
  //树形数组递归加入新属性
  private resetData(treeData) {
    treeData.map(item => {
      item.title = item.typeName;
      if (item.children && item.children.length > 0) {
        item.children = this.resetData(item.children);
      }
    });
    return treeData;
  }

  // 获取表格数据
  private getList() {}

  private search() {
    this.page.num = 1;
    this.getList();
  }
  //系统分类树形节点点击数据
  private selectTree(v) {
  }
  //显示层
  private init() {
    this.searchPartLayer = true;
  }
  //配件表格点击的行
  private selectTabelData(v) {
    this.selectTableItem = v;
  }
  // 选择
  private throwData() {
    this.$emit("selectSearchName", this.selectTableItem);
    this.searchPartLayer = false;
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
    &.active {
      background: #fd5c5c;
      border-color: #fd5c5c;
      color: #fff;
    }
  }
}
</style>

<template>
    <vxe-modal className="vxe-modal-table" v-model="searchPartLayer" title="配件名称查询" id="myModal6" width="1000" height="450" min-width="460" min-height="320" resize remember transfer mask-closable :zIndex="999999999">
      <template v-slot>
            <vxe-grid
              border
              resizable
              show-overflow
              auto-resize
              height="auto"
              :loading="loading"
              :sync-resize="searchPartLayer"
              highlight-current-row
              size="mini"
              stripe
              :columns="tableColumn"
              @current-change="selectTabelData"
              @cell-dblclick="dblclickData"
              :data="partData">

              <template v-slot:top>
                <div class="partCheck-hd" style="height: 40px">
                  <vxe-input v-model="partName" class="w200 mr10" style="vertical-align: middle;height: 30px" placeholder="请输入配件名称" @keyup="keyupEvent"></vxe-input>
                  <Button @click="search" class="mr10" type="primary">
                    <Icon type="ios-search" size="14" />查询
                  </Button>
                  <Button class="mr10" type="default" @click="throwData">
                    <Icon type="md-checkmark" />选择
                  </Button>
                  <span style="color: #888;margin-left: 10px">（提示：双击即可选入）</span>
                  <!--<Button type='default' @click="addPartModal=true"><Icon type="md-add" /> 新增配件名称</Button>-->
                </div>
              </template>
              <template v-slot:bottom>
                <div style="height: 50px;">
                  <div class="pt10">
                    <vxe-pager
                      background
                      :current-page.sync="page.num"
                      :page-size.sync="page.size"
                      :total="page.total"
                      :page-sizes="[100,200,300]"
                      @page-change="changePage"
                      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
                    </vxe-pager>
                  </div>
                </div>
              </template>
            </vxe-grid>
      </template>
    </vxe-modal>
</template>

<script>
import {
  getAllBrand,
  getCarClassifys,
  getCarPartName
} from "_api/system/partsExamine/partsExamineApi";
export default {
  name: "searchPartName",
  data() {
    return {
      objectValue: "",
      loading: false,
      treeLoading: false,

      searchPartLayer: false, //配件名称查询层
      partName: "", //配件名称查询名字
      treeData: [], //系统分类树形数据
      //配件名称查询层表头
      tableColumn: [
        { type: 'seq', width: 50,title:'序号' },
        {
          title: '配件名称',
          align:'center',
          children: [
            { field: 'name', title: '标准名称' },
            { field: 'direction', title: '方向' },
            { field: 'groupName', title: '别名' }
          ]
        }
      ],
      columnsPart: [
        {
          title: "序号",
          width: 50,
          type: "index"
        },
        {
          title: "配件名称",
          key: "venderSkuNo",
          align: "center",
          children: [
            {
              title: "标准名称",
              key: "name",
              minWidth: 70
            },
            {
              title: "方向",
              key: "direction",
              minWidth: 70
            },
            {
              title: "别名",
              key: "groupName",
              minWidth: 70
            }
          ]
        }
      ],
      //配件名称查询层配件数据
      partData: [],
      //配件数据选中的数据
      selectTableItem: {},
      //树形选中数据
      selectTreeItem: {},
      //分页obj
      page: {
        num: 1,
        size: 100,
        total: 0
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    keyupEvent({ $event }){
      if($event.keyCode==13){
        this.search();
      }
    },

    //获取系统分类
    getCarClassifysFun() {
      this.treeLoading = true;
      getCarClassifys({ page: 1, pageSize: 500 }).then(res => {
        this.treeLoading = false;
        this.treeData = this.resetData(res.data.content || []);
      });
    },
    //树形数组递归加入新属性
    resetData(treeData) {
      treeData.map(item => {
        item.title = item.typeName;
        if (item.children && item.children.length > 0) {
          item.children = this.resetData(item.children);
        }
      });
      return treeData;
    },
    getList() {
      this.loading = true;
      let params = {};
      let req = {};
      // req.typeId = this.selectTreeItem.id;
      if (this.partName.trim()) {
        req.name = this.partName.trim();
      }
      params.page = this.page.num - 1;
      params.size = this.page.size;
      getCarPartName(params, req).then(res => {
        if(res.data){
          this.objectValue = res.data.content[0];
          this.selectTableItem = this.objectValue;
          this.loading = false;
          this.partData = res.data.content || [];
          this.page.total = res.data.totalElements;
        }
      });
    },
    search() {
      this.page.num = 1;
      this.getList();
    },
    //系统分类树形节点点击数据
    selectTree(v) {
      if (v.length > 0) {
        this.selectTreeItem = v[0];
        this.getList();
      }
    },
    //显示层
    init() {
      this.searchPartLayer = true;
      // this.getCarClassifysFun();
    },
    //配件表格点击的行
    selectTabelData({row}) {
      this.selectTableItem = row;
    },
    dblclickData({row}){
      this.selectTableItem = row;
      this.throwData();
    },
    throwData() {
      this.$emit("selectSearchName", this.selectTableItem);
      this.searchPartLayer = false;
    },
    //分页
    changePage({currentPage, pageSize}) {
      this.page.num = currentPage;
      this.page.size = pageSize;
      this.getList();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    }
  }
};
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
</style>

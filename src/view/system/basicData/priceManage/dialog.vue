<template>
  <main class="dia-log">
    <!--上部-->
    <section class="opers-box">
      <div class="oper-top flex">
        <div class="wlf center">
          <div class="title center">
            <Input
              v-model="fullname"
              placeholder="请输入名称"
              style="width: 140px;"
              class="mr10"
            />
            <Input
              v-model="code"
              placeholder="请输入编码"
              style="width: 140px;"
              class="mr10"
            />
            <Input
              v-model="mobile"
              placeholder="请输入电话"
              style="width: 140px;"
              class="mr10"
            />
          </div>
          <div class="ml10">
            显示禁用:
            <Checkbox v-model="showDis"></Checkbox>
          </div>
          <Button class="mr10 w90" @click="query" type="warning">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
          <Button class="mr10 w90" @click="selected">
            <span class="center"> <Icon type="md-checkmark" />选择 </span>
          </Button>
          <Button class="mr10 w90" @click="cancel">
            <span class="center"> <Icon type="md-close" />取消 </span>
          </Button>
        </div>
      </div>
    </section>
    <!--主要-->
    <section class="con-box dia-main" style="width: 984px; position: relative">
      <div class="left pt10 pb10 pl10" style="width: 22%">
        <Tree :data="treeData" @on-select-change="treeSelect"></Tree>
      </div>
      <div class="right tab-warp" style="width: 78%">
        <Table
          border
          highlight-row
          size="small"
          :loading="loading"
          :stripe="true"
          :columns="columns"
          :data="tbdata"
          @on-current-change="selectRow"
          height="460"
        ></Table>
        <div class="page-warp">
          <Page
            class-name="page-con"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import * as api from "_api/system/priceManage";
import { area } from "_api/lease/registerApi.js";
import { getCustomerInformation } from "_api/system/essentialData/clientManagement.js";
export default {
  name: "dia-log",
  data() {
    return {
      split5: 0.2,
      // 名称
      fullname: "",
      // 编码
      code: "",
      // 电话
      mobile: "",
      // 选中的类型
      selectTypes: "",
      selectTree: null,
      // 选择类型
      typesList: [
        {
          value: "0",
          label: "汽车销售客户"
        },
        {
          value: "1",
          label: "配件销售客户"
        },
        {
          value: "2",
          label: "汽车维修客户"
        },
        {
          value: "3",
          label: "保险公司"
        }
      ],
      // 显示禁用
      showDis: false,
      // 省市区
      treeData: [],
      // 加载中
      loading: false,
      // 表头
      columns: [
        {
          title: "序号",
          type: "index",
          minWidth: 80
        },
        {
          title: "往来基本信息",
          children: [
            {
              title: "简称",
              key: "shortName",
              minWidth: 120
            },
            {
              title: "全称",
              key: "fullName",
              minWidth: 120
            },
            {
              title: "票据类型",
              key: "billTypeName",
              minWidth: 120
            },
            {
              title: "结算方式",
              key: "billTypeName",
              minWidth: 120
            },
            {
              title: "是否内部供应商",
              minWidth: 120,
              render: (h, params) => {
                let text = params.row.isSupplier == 1 ? "是" : "否";
                return h("span", text);
              }
            },
            {
              title: "联系人",
              key: "contactor",
              minWidth: 120
            },
            {
              title: "联系人手机",
              key: "contactorTel",
              minWidth: 120
            },
            {
              title: "业务员",
              key: "salesman",
              minWidth: 120
            },
            {
              title: "业务员电话",
              key: "salesmanTel",
              minWidth: 120
            },
            {
              title: "编码",
              key: "code",
              minWidth: 120
            },
            {
              title: "状态",
              key: "isDisabled",
              minWidth: 120,
              render: (h, params) => {
                let text = params.row.isDisabled == 0 ? "启用" : "禁用";
                return h("span", text);
              }
            }
          ]
        }
      ],
      // 表身
      tbdata: [],
      // 当前选中
      currentrow: null,
      // 选中客户
      custarr: [],
      // 分页
      page: { num: 1, size: 10, total: 100 },
      // 省
      Provinces: {},
      // 市
      City: {},
      // 区
      Area: {},
      loadArea: false,
    };
  },
  async mounted() {
    this.custarr = new Array();
  },
  methods: {
    init() {
      this.tbdata = new Array();
      this.selectTree = null;
      this.fullname = "";
      this.code = "";
      this.mobile = "";
      this.currentrow = null;
      this.custarr = new Array();
      this.page = { num: 1, size: 10, total: 0 };
      if(!this.loadArea) {
        this.getArea();
      }
      this.initList();
    },
    // 获取省市区
    async getArea() {
      // 省市区 树状图
      let areares = await area();
      if (areares.code === 0) {
        areares.data.forEach(el => {
          // object
          if (el.grade === "1") {
            if (!this.Provinces[el.parentId]) {
              this.Provinces[el.parentId] = [];
            }
            this.Provinces[el.parentId].push(el);
            // tree
            let province = { ...el };
            province.title = el.name;
            province.expand = false;
            this.treeData.push(province);
          }
          if (el.grade === "2") {
            if (!this.City[el.parentId]) {
              this.City[el.parentId] = [];
            }
            this.City[el.parentId].push(el);
          }
          if (el.grade === "3") {
            if (!this.Area[el.parentId]) {
              this.Area[el.parentId] = [];
            }
            this.Area[el.parentId].push(el);
          }
        });
        // tree
        this.treeData.forEach(el => {
          this.City[el.id].forEach(cy => {
            if (!el.children) {
              el.children = [];
            }
            let city = { ...cy };
            city.title = cy.name;
            city.expand = false;
            el.children.push(city);
          });
        });
        // 区
        this.treeData.forEach(tree => {
          tree.children.forEach(ch => {
            if(Array.isArray(this.Area[ch.id])) {
              this.Area[ch.id].forEach(ar => {
                let area = {...ar};
                area.title = area.name;
                if(!ch.children) {
                  ch.children = [];
                }
                ch.children.push(area);
              })
            }
          })
        });
        this.loadArea = true;
      }
    },
    // 客户表
    async initList() {
      this.loading = true;
      let data = {};
      data.page = this.page.num - 1;
      data.size = this.page.size;
      if(this.code && this.code.trim().length > 1) {
        data.code = this.code.trim();
      }
      if(this.fullname && this.fullname.trim().length > 1) {
        data.fullName = this.fullname.trim();
      }
      if(this.mobile && this.mobile.trim().length > 1) {
        data.contactorTel = this.mobile.trim();
      }
      if (this.selectTree != null) {
        if (this.selectTree.grade == "1") {
          data.provinceId = this.selectTree.id;
        }
        if (this.selectTree.grade == "2") {
          data.cityId = this.selectTree.id;
        }
        if(this.selectTree.grade == "3") {
          data.areaId = this.selectTree.id;
        }
      }
      if (!this.showDis) {
        data.isDisabled = 0;
      } else {
        data.isDisabled = 1;
      }
      data.strategyId = this.$parent.$parent.currRow.id||"";
      let res = await getCustomerInformation(data);
      if (res.code === 0) {
        this.loading = false;
        this.tbdata = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    // 查询
    query() {
      this.page = { num: 1, size: 10, total: 100 };
      this.initList();
    },
    // 选中行
    selectRow(row) {
      this.currentrow = row;
    },
    // 选择
    selected() {
      if (this.currentrow == null) {
        return this.$Message.error("请选择客户");
      }
      if(this.currentrow.existInCurrent===1){
        return this.$Message.error("不可重复添加客户");
      }
      if(this.currentrow.existInOther===1){
        return this.$Message.error("同一客户只能存在于一个价格体系中");
      }

      if (this.custarr.length <= 0) {
        this.currentrow.new = true;
        this.custarr.push(this.currentrow);
      } else {
        let res = this.custarr.every(el => el.id != this.currentrow.id);
        if (res) {
          this.currentrow.new = true;
          this.custarr.push(this.currentrow);
        } else {
          this.$Message.error("该客户已选择");
        }
      }

      this.$emit("addcu", this.custarr);
    },
    // 取消
    cancel() {
      this.tbdata = [];
      this.currentrow = null;
      this.$emit("update:show", false);
    },
    // 翻页
    changePage(p) {
      this.page.num = p;
      this.initList();
    },
    // 修改每页显示条数
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.initList();
    },
    // 树状图选择
    treeSelect(arr, item) {
      this.selectTree = item;
      this.query();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../lease/tenantres/icon");
.dia-log {
  padding-bottom: 20px;
  .opers-box {
    margin-bottom: 16px;
  }
  .left {
    border-right: solid 1px #ddd;
  }
  .riget {
    flex: auto;
  }
  .wlf > div {
    padding-top: 0;
  }
  .dia-main {
    height: 530px;
    border: solid 1px #ddd;
    display: flex;
  }

  .dia-main {
    .left {
      overflow: auto;
      height: 530px;
    }
    .tab-warp {
      height: 530px;
      overflow-y: auto;
      .page-warp {
        padding: 10px 20px;
        text-align: right;
      }
    }
  }
}
</style>

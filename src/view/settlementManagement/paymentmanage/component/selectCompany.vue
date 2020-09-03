<template>
  <Modal v-model="addressShow" title="往来单位" width="1000" class="modalBox">
    <div>
      <header class="titleHeader">
        <Input v-model="clientName" placeholder="名称" class="mr10" style="width: 150px" />
        <Input v-model="clientCode" placeholder="编码" class="mr10" style="width: 150px" />
        <Input v-model="clientPhone" placeholder="电话" class="mr10" style="width: 150px" />
        <Select v-model="type" class="mr10 w200" placeholder="请选择类型">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="warning" class="mr10" @click="query">
          <Icon custom="iconfont iconchaxunicon icons" />查询
        </Button>
        <Button class="mr10" @click="select" type="default">
          <Icon type="md-checkmark" />选择
        </Button>
        <Button class="mr10" type="default">
          <Icon type="md-close" />取消
        </Button>
      </header>
      <div class="clientBody">
        <div class="demo-split">
          <Split v-model="split1">
            <div slot="left" class="demo-split-pane">
              <div class="tableBox">
                <Tree :data="treeData" @on-select-change="clickTree"></Tree>
              </div>
            </div>
            <div slot="right" class="demo-split-pane">
              <div style="overflow: auto">
                <vxe-table
                  border
                  resizable
                  :data="tableData"
                  stripe
                  size="mini"
                  align="center"
                  :auto-resize="true"
                  highlight-hover-row
                  highlight-current-row
                  @current-change="getOneClinet"
                  show-overflow
                  height="400"
                  style="width: 1500px"
                  v-if="flag"
                >
                  <vxe-table-column type="seq" width="50" title="序号"></vxe-table-column>
                  <vxe-table-column field="fullName" title="名称" show-overflow></vxe-table-column>
                  <vxe-table-column field="code" title="编码"></vxe-table-column>
                  <vxe-table-column title="状态">
                    <template v-slot="{ row }">{{ row.isDisabled == 1 ? '无效' : '有效' }}</template>
                  </vxe-table-column>
                  <vxe-table-column field="billTypeName" title="票据类型"></vxe-table-column>
                  <vxe-table-column field="settTypeName" title="结算方式"></vxe-table-column>
                  <vxe-table-column field="contactor" title="联系人"></vxe-table-column>
                  <vxe-table-column field="contactorTel" title="联系人手机号"></vxe-table-column>
                  <vxe-table-column field="salesman" title="业务员"></vxe-table-column>
                  <vxe-table-column field="salesmanTel" title="业务员电话"></vxe-table-column>
                  <vxe-table-column title="是否内部供应商">
                    <template v-slot="{ row }">{{ row.isSupplier == 1 ? '是' : '否' }}</template>
                  </vxe-table-column>
                  <vxe-table-column field="advantageCarbrandId" title="优势品牌/产品"></vxe-table-column>
                </vxe-table>
                <Table
                  class="table-highlight-row w1200"
                  highlight-row
                  height="400"
                  border
                  :stripe="true"
                  :columns="columns"
                  :data="managementList"
                  @on-current-change="getOneClinet"
                  v-else
                ></Table>
              </div>
              <Page
                size="small"
                :total="page1.total"
                :page-size="page1.size"
                :current="page1.num"
                :page-size-opts="page1.sizeOpts"
                show-sizer
                show-total
                @on-change="selectNum"
                @on-page-size-change="selectPage"
                style="float: right;margin-top: 10px"
              />
            </div>
          </Split>
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { area } from "@/api/lease/registerApi";
import { getTreeClient, getClientType } from "@/api/salesManagment/salesOrder";
import {
  getSupplierTreeList,
  getSupplierformation
} from "@/api/system/essentialData/supplierManagement";
export default {
  name: "SelectTheCustomer",
  data() {
    return {
      columns: [
        { title: "序号", align: "center", type: "index", key: "name" },
        {
          title: "基本信息",
          align: "center",
          children: [
            {
              title: "序号",
              align: "center",
              render: (h, params) => {
                return h("span", { class: "table-radio" });
              }
            },
            {
              title: "供应商简称",
              key: "shortName",
              align: "center"
            },
            {
              title: "供应商全称",
              key: "fullName",
              align: "center"
            }
          ]
        },
        {
          title: "联系人信息",
          align: "center",
          children: [
            {
              title: "联系人",
              key: "contactor",
              align: "center"
            },
            {
              title: "职务",
              key: "salesmanDutyName",
              align: "center"
            },
            {
              title: "联系人手机",
              key: "contactorTel",
              align: "center"
            },
            {
              title: "业务员",
              key: "salesman",
              align: "center"
            },
            {
              title: "业务员手机",
              key: "salesmanTel",
              align: "center"
            }
          ]
        },
        {
          title: "财务信息",
          align: "center",
          children: [
            {
              title: "票据类型",
              key: "billTypeName",
              align: "center"
            },
            {
              title: "结算方式",
              key: "settTypeName",
              align: "center"
            }
          ]
        },
        {
          title: "其他信息",
          align: "center",
          children: [
            {
              title: "省份",
              key: "provinceName",
              align: "center"
            },
            {
              title: "城市",
              key: "cityName",
              align: "center"
            },
            {
              title: "电话",
              key: "tel",
              align: "center"
            },
            {
              title: "供应商类型",
              key: "supplierTypeName",
              align: "center"
            },
            {
              title: "优势品牌/产品",
              key: "advantageCarbrandId",
              align: "center"
            },
            {
              title: "传真",
              key: "fax",
              align: "center"
            },
            {
              title: "备注",
              key: "remark",
              align: "center"
            }
          ]
        },
        {
          title: "操作信息",
          align: "center",
          children: [
            {
              title: "最后操作人",
              key: "updateUname",
              align: "center"
            },
            {
              title: "最后操作时间",
              key: "updateTime",
              align: "center"
            },
            {
              title: "禁用",

              align: "center",
              render: (h, params) => {
                let text = "";
                params.row.isDisabled == 0 ? (text = "否") : (text = "是");
                return h("span", {}, text);
              }
            },
            {
              title: "供应商编码",
              key: "code",
              align: "center"
            }
          ]
        }
      ],
      managementList: [],
      addressShow: false,
      clientName: "", //名称
      clientCode: "", //编码
      clientPhone: "", //电话
      clientType: [], //类型
      split1: 0.3, //分割线
      Loading: true, //加载中
      treeList: [], //树形图数组
      page1: {
        num: 1,
        total: 0,
        size: 20,
        sizeOpts: [20, 40, 60, 80, 100]
      },
      tableData: [{ name: 23 }],
      type: 0, //选择类型
      typeList: [
        {
          value: 0,
          label: "客户"
        },
        {
          value: 1,
          label: "供应商"
        }
      ],
      flag: true,
      treeData: [], //全国地址
      // 省
      Provinces: {},
      // 市
      City: {},
      // 区
      Area: {},
      clickCity: {}, //当前获取的地址
      queryType: {}, //获取到当前类型
      oneClinet: {} //点击当前的信息
    };
  },
  mounted() {
    this.getAdress();
    this.getClientTypeList();
  },
  methods: {
    openModel() {
      this.addressShow = true;
    },
    //获取地级市
    getAdress() {
      area().then(res => {
        if (res.code == 0) {
          res.data.forEach(el => {
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
        }
      });
    },
    //点击树形图获取信息
    clickTree(val) {
      this.clickCity = val[0];
      if (this.type) {
        this.getSupplier();
      } else {
        this.getList();
      }
    },
    // 获取供应商
    getSupplier() {
      let obj = {
        page: this.page1.num - 1,
        size: this.page1.size,
        supplierTypeFirst: this.clickCity.id
      };
      getSupplierformation(obj).then(res => {
        if (res.code === 0) {
          this.managementList = res.data.content;
          this.page1.total = res.data.totalElements;
        }
      });
    },
    // 获取客户
    async getList() {
      let data = {};
      data.grade = this.clickCity.grade;
      data.id = this.clickCity.id;
      data.page = this.page1.num - 1;
      data.size = this.page1.size;
      data.lever = this.queryType.lever;
      data.leverId = this.queryType.id;
      data.code = this.clientCode;
      data.shortName = this.clientName;
      data.tel = this.clientPhone;
      let res = await getTreeClient(data);
      if (res.code === 0) {
        this.tableData = res.data.content;
        this.page1.total = res.data.totalElements;
      }
    },
    //点击获取当前客户
    getOneClinet(data) {
      this.oneClinet = data.row;
    },
    //客户类型获取
    async getClientTypeList() {
      let res = await getClientType();
      if (res.code === 0) {
        let data = res.data;
        data.map(item => {
          item.value = item.id;
          item.label = item.title;
          if (item.children) {
            item.children.map(val => {
              val.value = val.id;
              val.label = item.title;
            });
          } else {
            delete item.children;
          }
        });
        this.clientType = res.data;
      }
    },
    //切换页面
    selectNum(val) {
      this.page1.num = val;
      this.getList();
    },
    //切换页数
    selectPage(val) {
      this.page1.num = 1;
      this.page1.size = val;
      this.getList();
    },
    //级联选择器
    getType(value, selectedData) {
      this.queryType = selectedData[selectedData.length - 1];
    },
    //查询
    query() {
      this.page1.num = 1;
      this.clickCity = {};
      if (this.type) {
        this.flag = false;
        getSupplierTreeList().then(res => {
          this.treeData = res.data;
        });
      } else {
        this.flag = true;
        this.getList();
      }
    },
    //选择
    select() {
      if (this.oneClinet.isDisabled == 1) {
        this.$message.error("该客户已被禁用");
        return false;
      } else {
        this.$emit("getOne", this.oneClinet);
        this.addressShow = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.titleHeader {
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  padding-left: 10px;
}
.clientBody {
  height: 600px;
}
.tableBox {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
}
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding-left: 10px;
  padding-top: 10px;
  height: 100%;
}
</style>
<style scoped>
.modalBox >>> .ivu-modal-body {
  padding: 0px;
}
</style>

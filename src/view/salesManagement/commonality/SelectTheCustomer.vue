<template>
  <Modal v-model="addressShow" title="选择客户" width="1000" class="modalBox">
    <div>
      <header class="titleHeader">
        <el-input class="w250 mr10" v-model="fullName" ref="focusInput" placeholder="全称/简称/编码/拼音" @keyup.enter.native="query"></el-input>
        <!--<Input-->
          <!--v-model="pyName"-->
          <!--placeholder="拼音"-->
          <!--class="mr10"-->
          <!--style="width: 150px"-->
        <!--/>-->
        <Cascader
          :data="clientType"
          @on-change="getType"
          change-on-select
          placeholder="请选择类型"
          class="mr10 w200"
          style="display: inline-block"
        ></Cascader>

        <Button type="warning" class="mr10" @click="query">
          <Icon custom="iconfont iconchaxunicon icons" />查询
        </Button>
        <Button class="mr10" @click="select" type="default">
          <Icon type="md-checkmark" />选择
        </Button>
        <Button class="mr10" type="default" @click="addressShow = false">
          <Icon type="md-close" />取消
        </Button>
      </header>
      <div class="clientBody pt10">
        <div class="demo-split">
          <!-- <div class="demo-split-pane fl" style="width: 30%">
            <div class="tableBox">
              <Tree :data="treeData" @on-select-change="clickTree"></Tree>
            </div>
          </div> -->
          <div class="demo-split-pane fr" style="width: 100%">
            <div>
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
                @cell-dblclick="dblclick"
                height="500"
                show-overflow="tooltip"
              >
                <vxe-table-column
                  type="index"
                  width="50"
                  title="序号"
                ></vxe-table-column>
                <vxe-table-column
                  field="shortName"
                  width="200"
                  title="名称"
                  show-overflow="tooltip"
                ></vxe-table-column>
                <vxe-table-column field="code" width="200" title="编码" show-overflow="tooltip"></vxe-table-column>
                <vxe-table-column
                  field="creditLimit"
                  width="100"
                  title="固定额度"
                ></vxe-table-column>
                <vxe-table-column width="100" field="tempCreditLimit" title="临时额度">
                  <template v-slot="{ row }">{{
                    s2d(row)
                  }}</template>
                </vxe-table-column>
                <vxe-table-column field="" width="100" title="可用额度">
                  <template v-slot="{ row }">
                    <Poptip title="可用额度" transfer>
                      <span slot="content" >{{ content }}</span>
                      <a @click="show(row)">查看</a>
                    </Poptip>
                  </template>
                </vxe-table-column>
                <vxe-table-column width="100" title="状态">
                  <template v-slot="{ row }">{{
                    row.isDisabled == 1 ? "无效" : "有效"
                  }}</template>
                </vxe-table-column>
                <vxe-table-column
                  field="billTypeName"
                  width="100"
                  title="票据类型"
                ></vxe-table-column>
                <vxe-table-column
                  field="settTypeName"
                  width="100"
                  title="结算方式"
                ></vxe-table-column>
                <vxe-table-column
                  field="pyName"
                  width="100"
                  title="拼音"
                ></vxe-table-column>
                <vxe-table-column
                  field="contactor"
                  width="100"
                  title="联系人"
                ></vxe-table-column>
                <vxe-table-column
                  field="contactorTel"
                  width="100"
                  title="联系人手机号"
                ></vxe-table-column>
                <vxe-table-column
                  field="salesman"
                  width="100"
                  title="业务员"
                ></vxe-table-column>
                <vxe-table-column
                  field="salesmanTel"
                  width="100"
                  title="业务员电话"
                ></vxe-table-column>
                <vxe-table-column width="120" title="是否内部供应商">
                  <template v-slot="{ row }">{{
                    row.isSupplier == 1 ? "是" : "否"
                  }}</template>
                </vxe-table-column>
                <vxe-table-column
                  field="advantageCarbrandId"
                  width="100"
                  title="优势品牌/产品"
                ></vxe-table-column>
              </vxe-table>
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
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import { area } from "@/api/lease/registerApi";
import { getTreeClient, getClientType } from "@/api/salesManagment/salesOrder";
import { getLimit } from "@/api/salesManagment/salesOrder";

export default {
  name: "SelectTheCustomer",
  data() {
    return {
      addressShow: false,
      fullName: "", //名称
      clientCode: "", //编码
      pyName: "", //电话
      clientType: [], //类型
      clientList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        }
      ],
      split1: 0.3, //分割线
      Loading: true, //加载中
      treeList: [], //树形图数组
      page1: {
        num: 1,
        total: 0,
        size: 20,
        sizeOpts: [20, 40, 60, 80, 100]
      },
      tableData: [],
      treeData: [], //全国地址
      // 省
      Provinces: {},
      // 市
      City: {},
      // 区
      Area: {},
      clickCity: {}, //当前获取的地址
      queryType: {}, //获取到当前类型
      oneClinet: {}, //点击当前的信息
      content: 0,
    };
  },
  mounted() {
    // this.getList()
    // this.getAdress();
    // this.getClientTypeList();
  },
  methods: {
    s2d(row) {
      let date = row.tempEnd;
      if(date == null) return 0;
      date = date.substring(0,19);
      date = date.replace(/-/g,'/');
      let timestamp = new Date(date).getTime();
      let now = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
      if(timestamp < now) {
        return row.tempCreditLimit
      }
      return 0;
    },
    async show(row) {
      //获取客户额度
      let data = {};
      data.guestId = row.id;
      let res = await getLimit(data);
      if (res.code === 0) {
        this.content = res.data.sumAmt;
      }
    },
    openModel() {
      this.reset();
      this.getList(true);
      // this.getAdress();
      this.getClientTypeList();
      this.addressShow = true;
      this.$nextTick(()=>this.$refs.focusInput.focus())
    },
    reset() {
      this.fullName = "";
      this.pyName = "";
      this.clientCode = "";
      this.page1 = {
        num: 1,
        total: 0,
        size: 20,
        sizeOpts: [20, 40, 60, 80, 100]
      };
    },
    //获取地级市
    getAdress() {
      if (this.treeData.length > 0) {
        return;
      }
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
      this.getList(true);
    },
    // 获取客户
    async getList(isget = false) {
      // if(this.tableData.length > 0 && this.page1.num == 1 && !isget) {
      //   return;
      // }
      let data = {};
      if (this.clickCity.grade) {
        data.grade = this.clickCity.grade;
        data.id = this.clickCity.id;
      }
      data.page = this.page1.num - 1;
      data.size = this.page1.size;
      if (this.queryType !== undefined) {
        data.lever = this.queryType.lever;
        data.leverId = this.queryType.id;
      }
      if (this.clientCode) {
        data.code = this.clientCode;
      }
      if (this.fullName) {
        data.shortName = this.fullName;
      }
      if (this.pyName) {
        data.pyName = this.pyName;
      }
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
      if (this.clientType.length > 0) {
        return;
      }
      let res = await getClientType();
      if (res.code === 0) {
        let data = res.data;
        data.map(item => {
          item.value = item.id;
          item.label = item.title;
          if (item.children) {
            item.children.map(val => {
              val.value = val.id;
              val.label = val.title;
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
      this.getList(true);
    },
    //切换页数
    selectPage(val) {
      this.page1.num = 1;
      this.page1.size = val;
      this.getList(true);
    },
    //级联选择器
    getType(value, selectedData) {
      this.queryType = selectedData[selectedData.length - 1];
    },
    //查询
    query() {
      this.page1.num = 1;
      this.clickCity = {};
      this.getList(true);
    },
    //选择
    select() {
      if (Object.keys(this.oneClinet).length !== 0) {
        if (this.oneClinet.isDisabled == 1) {
          this.$message.error("改客户已被禁用");
          return false;
        } else {
          this.$emit("getOne", this.oneClinet);
          this.addressShow = false;
        }
      } else {
        this.$message.error("请选择客户");
      }
    },
    dblclick() {
      this.select();
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

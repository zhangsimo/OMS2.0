<template>
  <div style="height:100%">
    <div class="header-box">
      <Input v-model="fasttipsTitle" style="width: 150px" class="mr10" placeholder="请输入公司名称" />
      <Button type="warning" class="w90 mr10" @click="queryList">
        <span class="center">
          <Icon custom="iconfont iconchaxunicon icons" />查询
        </span>
      </Button>
      <Button class="w90 mr10" @click="addClient" v-has="'addClient'">
        <span class="center">
          <Icon type="md-add" />新增
        </span>
      </Button>
      <Button class="w90 mr10" @click="changeClient" v-has="'changeClient'">
        <span class="center">
          <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
        </span>
      </Button>
      <Button class="mr15" v-if="pitchSupplierOne.isDisabled == 1" @click="changeDisabled" v-has="'enable'">
        <span class="center">
          <Icon custom="iconfont iconqiyongicon icons" />启用
        </span>
      </Button>
      <Button class="mr15" v-else @click="changeDisabled" v-has="'enable'">
        <span class="center">
          <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
        </span>
      </Button>
    </div>
    <div class="tabeBox">
      <div>
        <Table
          class="table-highlight-row"
          size="small"
          highlight-row
          border
          :stripe="true"
          :columns="columns"
          :data="managementList"
          @on-current-change="pitchSupplier"
          ref="currtable"
        ></Table>
      </div>
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
        class="mr10"
      ></Page>
    </div>
    <!--      客户资料-->
    <Modal v-model="clientDataShow" title="门店资料" width="900" @on-visible-change="cancelChange">
      <ClientData
        :data="clientList"
        :provincearr="provinceArr"
        :treelist="treeDiagramList"
        ref="child"
      ></ClientData>
      <div slot="footer">
        <Button type="primary" @click="addNewSupplier">确定</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ClientData from "./ClientData";
import {
  getSupplierformation,
  getNewSupplier,
  setDisabled
} from "@/api/system/systemSetting/storeManagement";
import { area } from "@/api/lease/registerApi";
import moment from "moment";

export default {
  name: "CustomerData",
  components: {
    ClientData
  },
  props: {
    treeDiagramList: ""
  },
  data() {
    return {
      moment: moment,
      fasttipsTitle: "", //快速查询内容
      moreQueryOne: {},
      loading: true,
      provinceArr: "",
      page: {
        size: 10,
        num: 1,
        total: 0
      },
      columns: [
        {
          title: "选择",
          align: "center",
          key: "",
          render: (h, params) => {
            return h("span", { class: "table-radio" });
          }
        },
        { title: "企业号", align: "center", key: "firm" },
        { title: "公司全称", align: "center", key: "name" },
        { title: "公司简称", align: "center", key: "shortName" },
        { title: "电话", align: "center", key: "tel" },
        { title: "省份", align: "center", key: "province" },
        { title: "城市", align: "center", key: "city" },
        { title: "地址", align: "center", key: "streetAddress" },
        {
          title: "状态",
          align: "center",
          key: "isDisabled",
          render: (h, params) => {
            let txt = "";
            params.row.isDisabled == 1 ? (txt = "禁用") : (txt = "启用");
            return h("span", {}, txt);
          }
        },
        { title: "开店日期", align: "center", key: "softOpenDate" },
        { title: "建档人", align: "center", key: "recorder" },
        { title: "建档日期", align: "center", key: "recordDate" }
      ],
      managementList: [],
      clientDataShow: false,
      clientList: {},
      supplierTypeOne: "", //供应商类型
      pitchSupplierOne: "",
      Pid: "",
      disableShow: true
    };
  },
  created() {
    this.getAdress();
  },
  computed: {
    newpid() {
      return this.$store.state.user.treePid;
    }
  },
  methods: {
    // 门店资料关闭
    cancelChange(type) {
      if (!type) {
        // this.$refs.child.resetFields();
      }
    },
    //获取全部表格数据
    async getlist() {
      this.loading = true;
      let data = {};
      data.page = this.page.num - 1;
      data.size = this.page.size;
      data.name = this.fasttipsTitle;
      if (this.Pid.parentId == 0) {
        data.supplierTypeFirst = this.Pid.id;
      } else {
        data.supplierTypeSecond = this.Pid.id;
      }
      let res = await getSupplierformation(data);
      if (res.code == 0) {
        this.pitchSupplierOne = {}
        this.loading = false;
        this.managementList = res.data.content;
        this.page.total = res.data.totalElements;
      }
    },
    //获取地址
    getAdress() {
      area().then(res => {
        if (res.code == 0) {
          this.provinceArr = res.data;
        }
      });
    },
    //分页
    changePage(data) {
      this.page.num = data;
      this.getlist();
    },
    //条数
    changeSize(data) {
      this.page.num = 1;
      this.page.size = data;
      this.getlist();
    },
    //搜索
    queryList() {
      this.Pid = "";
      this.getlist();
    },
    //选中一条信息
    pitchSupplier(currentRow) {
      this.pitchSupplierOne = currentRow;
    },
    //修改状态禁用
    async changeDisabled() {
      if (!this.pitchSupplierOne.id)
        return this.$message.error("请至少选择一条数据");
      let data = {};
      data.id = this.pitchSupplierOne.id;
      let res = await setDisabled(this.pitchSupplierOne);
      if (res.code == 0) {
        if(this.pitchSupplierOne.isDisabled==1){
          this.$message.success("启用成功");
        }else{
          this.$message.success("禁用成功");
        }
        this.getlist();
      }
    },
    addClient() {
      this.$refs.currtable.clearCurrentRow()
      this.pitchSupplierOne = {}
      this.$refs.child.resetFields();
      this.clientList = {};
      this.$refs.child.addPicture();
      this.clientDataShow = true;
    },
    //确认添加一条信息
    addNewSupplier() {
      this.$refs.child.handleSubmit(async () => {
        let data = JSON.parse(JSON.stringify(this.clientList))
        data.softOpenDate = this.changeTime(data.softOpenDate);
        let res = await getNewSupplier(data);
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.clientDataShow = false;
          this.pitchSupplierOne = {};
          this.clientList = {}
          this.$refs.child.resetFields();
          this.getlist();
        }
      });
    },
    changeTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    cancel() {
      this.pitchSupplierOne = {};
      this.getlist();
      this.clientDataShow = false;
    },
    //修改客户资料
    changeClient() {
      if (Object.keys(this.pitchSupplierOne).length == 0) {
        this.$Message.error("请至少选择一条数据");
        return false;
      }
      this.clientDataShow = true;
      this.clientList = this.pitchSupplierOne;
      this.$refs.child.valuePic();
    }
  },
  watch: {
    newpid: {
      handler(v, ov) {
        this.Pid = v;
        this.getlist();
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="less">
.header-box {
  line-height: 57px;
  padding-left: 20px;
  border-bottom: 1px solid #dcdee2;
}
.tabeBox {
  overflow-y: scroll;
  overflow-x: initial;
  padding: 10px;
  height: calc(~"100% - 57px");
}
</style>

<template>
  <div style="height:100%">
    <div class="header-box">
      <span>快速查询:</span>
      <Select v-model="fasttipsType" style="width:120px" class="mr10">
        <Option v-for="item in fasttipsList" :key="item.id" :value="item.id">{{ item.name}}</Option>
      </Select>
      <Input v-model="fasttipsTitle" style="width: 150px" class="mr10"/>
      <span class="mr5">供应商类型:</span>
      <Select v-model="supplierTypeOne" style="width:120px" class="mr10">
        <Option
          v-for="item in supplierType.CS00111"
          :key="item.itemCode"
          :value="item.itemCode"
        >{{ item.itemName}}
        </Option>
      </Select>
      <Button type="warning" class="w90 mr10" @click="queryList">
        <span class="center">
          <Icon custom="iconfont iconchaxunicon icons"/>查询
        </span>
      </Button>
    </div>
    <div class="operation">
      <Button class="w90 mr10" @click="addClient" v-has="'addRight'">
        <span class="center">
          <Icon type="md-add"/>新增
        </span>
      </Button>
      <Button class="w90 mr10" @click="changeClient" v-has="'changeRight'">
        <span class="center">
          <Icon custom="iconfont iconbianjixiugaiicon icons"/>修改
        </span>
      </Button>
      <Upload
        ref="upload"
        style="display: inline-block"
        :show-upload-list="false"
        :action="upurl"
        :headers="headers"
        :format="['xlsx','xls']"
        :on-format-error="onFormatError"
        :on-success="onSuccess"
        :before-upload="beforeUpload"
      >
        <Button type="default" class="mr10" v-has="'import'">
          <Icon custom="iconfont icondaoruicon icons"/>
          导入
        </Button>
      </Upload>
      <Button class="mr10" @click="downTemplate" v-has="'down'">
        <span class="center">
          <Icon custom="iconfont iconxiazaiicon icons"/>下载模板
        </span>
      </Button>
    </div>
    <div class="tabeBox">
      <Table
        ref="table"
        class="table-highlight-row"
        :loading="loading"
        size="small"
        highlight-row
        border
        :stripe="true"
        :columns="columns"
        :data="managementList"
        max-height="600"
        @on-current-change="pitchSupplier"
      ></Table>
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
    <Modal
      v-model="clientDataShow"
      title="供应商资料"
      @on-visible-change="openOrClose"
      width="700"
      height="2100"
    >
      <ClientData
        :data="clientList"
        :provincearr="provinceArr"
        :treelist="treeDiagramList"
        :dis="nameChange"
        ref="child"
      ></ClientData>
      <div class="footerMargin" slot="footer">
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
    getup,
    down
  } from "@/api/system/essentialData/supplierManagement";
  import {area} from "@/api/lease/registerApi";
  import {getDigitalDictionary} from "@/api/system/essentialData/clientManagement";
  import Cookies from "js-cookie";
  import {TOKEN_KEY} from "@/libs/util";
  import baseUrl from "_conf/url";
  import {showLoading, hideLoading} from "../../../../utils/loading";

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
        provinceArr: "",
        page: {
          size: 10,
          num: 1,
          total: 0
        },
        loading: true,
        fasttipsList: [
          {name: "供应商全称", id: "fullName"},
          {name: "优势品牌/产品", id: "advantageCarbrandId"},
          {name: "联系人电话", id: "contactorTel"}
        ], //快速查询下拉框
        supplierType: "", //客户种类
        fasttipsType: "fullName", //快速查询种类
        fasttipsTitle: "", //快速查询内容
        columns: [
          {title: "序号", align: "center", type: "index", key: "name", width: 50},
          {
            title: "基本信息",
            align: "center",
            children: [
              {
                title: "选择",
                align: "center",
                width: 50,
                render: (h, params) => {
                  return h("span", {class: "table-radio"});
                }
              },
              {
                title: "供应商简称",
                key: "shortName",
                align: "center",
                width: 120
              },
              {
                title: "供应商全称",
                key: "fullName",
                align: "center",
                width: 200
              },
              {
                title: "禁用",
                align: "center",
                width: 80,
                render: (h, params) => {
                  let text = "";
                  params.row.isDisabled == 0 ? (text = "否") : (text = "是");
                  return h("span", {}, text);
                }
              },
              {
                title: "审批状态",
                align: "center",
                width: 100,
                render: (h, params) => {
                  let text = "";
                  switch (params.row.approveStatus) {
                    case "0" | 0:
                      text = "待审批"
                      break;
                    case "1" | 1:
                      text = "通过"
                      break;
                    case "2" | 2:
                      text = "审批不通过"
                      break;
                  }
                  return h("span", {}, text);
                }
              },
            ]
          },
          {
            title: "联系人信息",
            align: "center",
            children: [
              {
                title: "联系人",
                key: "contactor",
                align: "center",
                width: 100
              },
              {
                title: "职务",
                key: "salesmanDutyName",
                align: "center",
                width: 100
              },
              {
                title: "联系人手机",
                key: "contactorTel",
                align: "center",
                width: 120,
              },
              {
                title: "业务员",
                key: "salesman",
                align: "center",
                width: 100
              },
              {
                title: "业务员手机",
                key: "salesmanTel",
                align: "center",
                width: 120
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
                align: "center",
                width: 120
              },
              {
                title: "结算方式",
                key: "settTypeName",
                align: "center",
                width: 120
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
                align: "center",
                width: 100
              },
              {
                title: "城市",
                key: "cityName",
                align: "center",
                width: 100
              },
              {
                title: "电话",
                key: "tel",
                align: "center",
                width: 120
              },
              {
                title: "供应商类型",
                key: "supplierTypeName",
                align: "center",
                width: 120
              },
              {
                title: "优势品牌/产品",
                key: "advantageCarbrandId",
                align: "center",
                width: 120
              },
              {
                title: "传真",
                key: "fax",
                align: "center",
                width: 100
              },
              {
                title: "备注",
                key: "remark",
                align: "center",
                width: 180
              }
            ]
          },
          {
            title: "操作信息",
            align: "center",
            width: 450,
            children: [
              {
                title: "最后操作人",
                key: "updateUname",
                align: "center",
                width: 150
              },
              {
                title: "最后操作时间",
                key: "updateTime",
                align: "center",
                width: 150
              },
              {
                title: "供应商编码",
                key: "code",
                align: "center",
                width: 150
              }
            ]
          }
        ],
        managementList: [],
        clientDataShow: false,
        clientList: {},
        nameChange: false,
        supplierTypeOne: "", //供应商类型
        pitchSupplierOne: "",
        supplier: "", //左侧id
        headers: {
          Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
        }, //请求头
        upurl: getup //批量导入地址
      };
    },
    created() {
      this.getlist();
      this.getAdress();
      this.getsupplierTypeList();
    },
    computed: {
      newsupplierId() {
        return this.$store.state.user.supplierId;
      }
    },
    methods: {
      //下载模板
      downTemplate() {
        location.href =
          baseUrl.downApi +
          "/file/get?fileId=" +
          1300000000 +
          "&access_token=" +
          Cookies.get(TOKEN_KEY);
      },
      //获取全部表格数据
      async getlist() {
        this.loading = true;
        let data = {};
        let type = this.salesmanDuty || "";
        data.page = this.page.num - 1;
        data.size = this.page.size;
        // this.$set(data,this.salesmanDuty,this.fasttipsTitle)
        data[this.fasttipsType] = this.fasttipsTitle;
        data.supplierType = this.supplierTypeOne;
        data.supplierTypeFirst = this.supplier.id;
        let res = await getSupplierformation(data);
        if (res.code == 0) {
          this.loading = false;
          this.pitchSupplierOne = {};
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
      //数字字典
      async getsupplierTypeList() {
        let data = {};
        data = ["CS00111"];
        let res = await getDigitalDictionary(data);
        if (res.code == 0) {
          this.supplierType = res.data;
          this.supplierType.CS00111.unshift({
            itemCode: "",
            id: "",
            itemName: "全部"
          });
        }
      },
      //搜索
      queryList() {
        // this.supplier = "";
        this.getlist();
      },
      //选中一条信息
      pitchSupplier(currentRow) {
        this.pitchSupplierOne = currentRow;
      },
      addClient() {
        this.clientList = {};
        this.clientDataShow = true;
        this.nameChange = false;
        this.$refs.child.$refs.form.resetFields();
        this.$refs.child.financeList = []
        this.$refs.child.invoice = []
        this.$refs.child.selectFinTab = {}
      },
      cancel() {
        this.clientDataShow = false;
        this.$refs.child.resetFields();
      },
      //确认添加一条信息
      addNewSupplier() {
        this.$refs.child.$refs.form.validate(async valid => {
          if (this.clientList.supplierTypeFirst == "0") {
            valid = false;
          }
          if (valid) {
            let data = this.clientList;
            data.isDisabled ? (data.isDisabled = 1) : (data.isDisabled = 0);
            data.isClient ? (data.isClient = 1) : (data.isClient = 0);
            showLoading()
            let res = await getNewSupplier(data);
            if (res.code === 0) {
              this.clientDataShow = false;
              this.getlist();
              hideLoading()
            } else {
              hideLoading()
            }
          } else {
            this.$Message.error("信息填写错误");
          }
        });
      },
      openOrClose() {
        this.$refs.table.clearCurrentRow();
        this.pitchSupplierOne = {};
      },
      //修改客户资料
      changeClient() {
        this.$refs.child.resetFields();
        if (Object.keys(this.pitchSupplierOne).length == 0) {
          this.$Message.error("请先选中一个供应商信息");
          return false;
        }
        this.clientDataShow = true;
        this.pitchSupplierOne.isDisabled == 1
          ? (this.pitchSupplierOne.isDisabled = true)
          : (this.pitchSupplierOne.isDisabled = false);
        this.pitchSupplierOne.isClient == 1
          ? (this.pitchSupplierOne.isClient = true)
          : (this.pitchSupplierOne.isClient = false);
        this.pitchSupplierOne.belongSystem = JSON.parse(
          this.pitchSupplierOne.belongSystem
        ).value;
        this.clientList = this.pitchSupplierOne;
        this.$refs.child.financeList = this.clientList.guestAccountVoList
        this.$refs.child.invoice = this.clientList.guestTaxpayerVOList
        this.nameChange = true;
      },
      //批量上传失败
      onFormatError(file) {
        // console.log(file)
        this.$Message.error("只支持xls xlsx后缀的文件");
      },
      // 上传成功函数
      onSuccess(response) {
        this.getlist();
        if (response.code != 0) {
          this.$Notice.warning({
            title: "导入失败",
            desc: response.message
          });
        } else {
          this.$Notice.success({
            title: "导入成功",
            desc: response.message
          });
        }
      },
      //上传之前清空
      beforeUpload() {
        this.$refs.upload.clearFiles();
      }
    },
    watch: {
      newsupplierId: {
        handler(v, ov) {
          this.supplier = v;
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

  .operation {
    line-height: 40px;
    padding-left: 10px;
    /*border-bottom: 1px solid #dcdee2;*/
  }

  .tabeBox {
    overflow: hidden;
    overflow-x: initial;
  }

  // .footerMargin {
  //   // margin-top: 100px;
  // }
</style>

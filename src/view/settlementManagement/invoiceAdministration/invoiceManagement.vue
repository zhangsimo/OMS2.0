<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize flexd">
      <Upload
        ref="upload"
        :show-upload-list="false"
        :headers="headers"
        :action="upurl"
        :format="['xlsx', 'xls', 'csv']"
        :before-upload="handleBeforeUpload"
        :on-format-error="onFormatError"
        :on-success="handleSuccess"
      >
        <Button @click="uploading" class="mr10">导入</Button>
      </Upload>
      <!-- <Button class="mr10"  v-has="'export'" @click="operation(1)">导入</Button>  -->
      <Button class="mr10" v-has="'export'" @click="operation(2)">修改</Button>
      <Button class="mr10" v-has="'export'" @click="operation(3)">删除</Button>
      <Button class="mr10" v-has="'export'" @click="operation(4)">智能核销</Button>
      <Button class="mr10" v-has="'export'" @click="operation(5)">发票退回</Button>
      <Button class="mr10" v-has="'export'" @click="operation(6)">红字进项转出</Button>
      <!-- <Button class="mr10" v-has="'export'" @click="exportCertification">导入勾选认证时间</Button> -->
      <Upload
        ref="upload"
        :show-upload-list="false"
        :headers="headers"
        :action="authenticationUpurl"
        :format="['xlsx', 'xls', 'csv']"
        :before-upload="handleBeforeUpload"
        :on-format-error="onFormatError"
        :on-success="handleSuccess"
      >
        <Button @click="importCertification" class="mr10">导入勾选认证时间</Button>
      </Upload>
      <!-- <Button class="mr10" v-has="'export'" @click="exportCertification">导入勾选认证时间</Button> -->
      <Button class="mr10" v-has="'export'" @click="exportDown">导出模板</Button>
    </section>
    <div class="mt20">
      <Button class="mr10" :type="isActive===''?'info':'default'" @click="chooseTable('')">全部显示</Button>
      <Button class="mr10" :type="isActive===1?'info':'default'" @click="chooseTable(1)">已核销</Button>
      <Button :type="isActive===0?'info':'default'" @click="chooseTable(0)">未核销</Button>
    </div>
    <section class="con-box">
      <div class>
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          show-summary
          highlight-row
          :summary-method="handleSummary"
          @on-selection-change="requires"
          @on-row-click="election"
          max-height="400"
        ></Table>
        <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          show-total
          @on-change="pageNumChange"
          @on-page-size-change="pageSizeChange"
          size="small"
        />
      </div>
    </section>
    <!-- 弹出框 -->
    <Modal v-model="proModal" title="进项发票修改" width="650">
      <Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="130">
        <Row>
          <Col span="11">
            <FormItem label="发票采购方名称：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税额：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="店号：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税率：" prop="type">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票代码：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="往来单位：" prop="type">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票号：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="付款方式：" prop="type">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票销售方名称：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票清单类型：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票日期：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票分类：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="价税合计金额：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="金额：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="备注：" prop="remark">
              <Input
                v-model="formValidate.remark"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('proModal')">保存</Button>
        <Button type="default" @click="proModal = false">返回</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getManageList,
  deletetManageList,
  invoiceReturnList,
  invoiceRedHedgedList,
  getup,
  authenticationGetup
} from "_api/salesManagment/invoiceAdministration";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
export default {
  data() {
    return {
      columns: [
        {
          title: "选择",
          width: 40,
          type: "selection",
          className: "tc"
        },
        {
          type: "index",
          title: "序号",
          className: "tc"
        },
        {
          title: "登记日期",
          key: "registrationDate",
          className: "tc"
        },
        {
          title: "发票采购方名称",
          key: "invoicePurchaserName",
          className: "tc"
        },
        {
          title: "店号",
          key: "shopNo",
          className: "tc"
        },
        {
          title: "发票代码",
          key: "invoiceCode",
          className: "tc"
        },
        {
          title: "发票号",
          key: "invoiceNo",
          className: "tc"
        },
        {
          title: "发票销售方名称",
          key: "invoiceSellerName",
          className: "tc"
        },
        {
          title: "开票日期",
          key: "billingDate",
          className: "tc"
        },
        {
          title: "价税合计金额",
          key: "totalAmt",
          className: "tc"
        },
        {
          title: "金额",
          key: "invoiceAmt",
          className: "tc"
        },
        {
          title: "税额",
          key: "taxAmt",
          className: "tc"
        },
        {
          title: "税率",
          key: "taxRate",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "付款方式",
          key: "payTypeName",
          className: "tc"
        },
        {
          title: "发票分类",
          key: "invoiceSortName",
          className: "tc"
        },
        {
          title: "开票清单类型",
          key: "billingTypeName",
          className: "tc"
        },
        {
          title: "增加类型",
          key: "addTypeName",
          className: "tc"
        },
        {
          title: "导入经办人",
          key: "importUname",
          className: "tc"
        },
        {
          title: "登记时间",
          key: "registrationTime",
          className: "tc"
        },
        {
          title: "勾选认证时间",
          key: "checkCertificationTime",
          className: "tc"
        },
        {
          title: "是否退回",
          key: "returned",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.returned ? "是" : "否");
          }
        },
        {
          title: "退回经办人",
          key: "returnUname",
          className: "tc"
        },
        {
          title: "退回时间",
          key: "returnTime",
          className: "tc"
        },
        {
          title: "是否红字转出",
          key: "redHedged",
          className: "tc",
          render: (h, params) => {
            return h("span", params.row.redHedged ? "是" : "否");
          }
        },
        {
          title: "红冲经办人",
          key: "hedgeUname",
          className: "tc"
        },
        {
          title: "红冲时间",
          key: "hedgeTime",
          className: "tc"
        }
      ],
      data: [],
      pagetotal: 0,
      isActive: "",
      proModal: false,
      formValidate: {
        name: "",
        remark: ""
      },
      ruleValidate: {
        name: [
          // { required: true, message: "产品名称不能为空", trigger: "blur" }
        ]
      },
      proType: [],
      form: {
        page: 1,
        size: 10,
        canceled: ""
      },
      allTablist: [],
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
      upurl: getup, // 导入地址
      authenticationUpurl: authenticationGetup // 导入地址
    };
  },
  methods: {
    //操作
    operation(num) {
      switch (num) {
        case 1:
          break;
        case 2:
          this.proModal = true;
          break;
        case 3:
          this.deleteTabList("delete");
          break;
        case 4:
          this.proModal = true;
          break;
        case 5:
          this.deleteTabList("return");
          break;
        case 6:
          this.deleteTabList("rewors");
          break;
      }
    },
    //删除
    deleteTabList(type) {
      if (!this.allTablist.length) {
        let content = "";
        if (type == "delete") {
          this.$Message.warning("请选择要删除的数据！");
        } else if (type == "return") {
          this.$Message.warning("请选择要退回的数据！");
        } else if (type == "rewors") {
          this.$Message.warning("请选择要进项转出的数据！");
        }
        return;
      } else {
        let tittle = "";
        if (type == "delete") {
          tittle = "<p>确认要删除选中的数据？</p>";
        } else if (type == "return") {
          tittle = "<p>确认要退回选中的数据？</p>";
        } else if (type == "rewors") {
          tittle = "<p>确认要进项转出选中的数据？</p>";
        }
        this.$Modal.confirm({
          title: "警告",
          content: tittle,
          onOk: () => {
            let message = "";
            let deleteList = [];
            this.allTablist.forEach((item, index) => {
              deleteList.push({
                id: item.id
              });
            });
            if (type == "delete") {
              deletetManageList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("删除成功！");
                    this.getTabList(this.form);
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "return") {
              invoiceReturnList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("退回成功！");
                    this.getTabList(this.form);
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "rewors") {
              invoiceRedHedgedList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("进项转出成功！");
                    this.getTabList(this.form);
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
          },
          onCancel: () => {}
        });
      }
    },
    //选择操作项目
    chooseTable(num) {
      this.isActive = num;
      this.form.page = 1;
      this.form.canceled = num;
      this.getTabList(this.form);
    },
    //单选
    election() {},
    handleBeforeUpload() {},
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    handleSuccess(response) {
      if (response.code == 0) {
        let txt = "上传成功";
        if (response.data.length > 0) {
          txt = response.data.join(",");
        }
        this.$Notice.warning({
          title: "导入成功",
          desc: txt,
          duration: 0
        });
        // this.getList()
      } else {
        this.$Message.error(response.message);
      }
    },
    //表格全选
    requires(val) {
      this.allTablist = val;
    },
    handleSummary() {},
    //获取列表
    getTabList(data) {
      data.page -= 1;
      getManageList(data)
        .then(res => {
          if (res.code === 0) {
            this.data = res.data.content;
            this.pagetotal = res.data.totalElements;
          }
        })
        .catch(err => {});
    },
    pageNumChange(pageNum) {
      this.form.page = pageNum;
      this.getTabList(this.form);
    },
    pageSizeChange(pageSize) {
      this.form.page = 1;
      this.form.size = pageSize;
      this.getTabList(this.form);
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        // if (valid) {
        // } else {}
      });
    },
    // 导出模板
    exportDown() {
      location.href =
        baseUrl.omsApi +
        "/entryRegistration/template?access_token=" +
        Cookies.get(TOKEN_KEY);
    },
    //  导出勾选认证时间模板
    // exportCertification() {
    //   location.href =
    //     baseUrl.omsApi +
    //     "/entryRegistration/checkTemplate?access_token=" +
    //     Cookies.get(TOKEN_KEY);
    // },
    //  导入进项管理
    uploading() {
      this.upurl = getup;
    },
    //  导入勾选认证时间
    importCertification() {
      this.authenticationUpurl = authenticationGetup;
    }
  },
  mounted() {
    this.getTabList(this.form);
  }
};
</script>
<style lang="less" scoped>
.flexd {
  display: flex;
}
</style>

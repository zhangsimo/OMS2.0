<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
      <Button class="mr10" v-has="'export'" @click="operation(1)">导入发票</Button>
      <Button class="mr10" v-has="'export'" @click="operation(2)">修改</Button>
      <Button class="mr10" v-has="'export'" @click="operation(3)">删除导入</Button>
      <Button class="mr10" v-has="'export'" @click="operation(4)">发票作废</Button>
      <Button class="mr10" v-has="'export'" @click="operation(5)">红字核销</Button>
      <div class="mt20">
        <Button class="mr10" :type="isActive===''?'info':'default'" @click="chooseTable('')">全部显示</Button>
        <Button class="mr10" :type="isActive===1?'info':'default'" @click="chooseTable(1)">已核销</Button>
        <Button :type="isActive===0?'info':'default'" @click="chooseTable(0)">未核销</Button>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div style="overflow-x: scroll">
        <Table
          border
          :columns="columns"
          :data="data"
          ref="summary"
          highlight-row
          @on-selection-change="requires"
          max-height="500"
         style="width: 3200px;"
        ></Table>
        </div>
        <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          @on-change="pageNumChange"
          @on-page-size-change="pageSizeChange"
          show-total
          size="small"
        />
      </div>
    </section>


    <!-- 弹出框 -->
    <Modal v-model="proModal" title="销售发票修改" width="650">
      <Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="130">
        <Row>
          <Col span="11">
            <FormItem label="发票类型：" prop="invoiceType">
              <Select v-model="formValidate.invoiceType">
                <Option
                  v-for="item in invoiceTypeOption"
                  :value="item.itemCode"
                  :key="item.itemCode"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票种类：" prop="priceTaxTotal">
              <Select v-model="formValidate.priceTaxTotal">
                <Option
                  v-for="item in invoiceTypeOption"
                  :value="item.itemCode"
                  :key="item.itemCode"
                >{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="购方名称：" prop="invoiceUnit">
              <Input v-model="formValidate.invoiceUnit"/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票代码：" prop="invoiceAmount">
              <Input v-model="formValidate.invoiceAmount" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票号码：" prop="invoiceAmount">
              <Input v-model="formValidate.invoiceAmount" />
            </FormItem>

<!--            <FormItem label="部门门店：" prop="orgBranchId">-->
<!--              <Select v-model="formValidate.orgBranchId">-->
<!--                <Option v-for="item in proTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
          </Col>
          <Col span="11">
            <FormItem label="购方税号：" prop="invoiceTaxAmount">
              <Input v-model="formValidate.invoiceTaxAmount" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="购方手机号：" prop="orgCode">
              <Input v-model="formValidate.orgCode" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="购方邮箱：" prop="guestName">
              <Input v-model="formValidate.guestName" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="购方开户行及账号：" prop="guestName">
              <Input v-model="formValidate.guestName" />
            </FormItem>
<!--            <FormItem label="开票清单类型：" prop="species">-->
<!--              <Select v-model="formValidate.species" clearable>-->
<!--                <Option-->
<!--                  v-for="item in speciesOptionList"-->
<!--                  :value="item.itemCode"-->
<!--                  :key="item.itemCode"-->
<!--                >{{item.itemName}}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
          </Col>
          <Col span="11">
            <FormItem label="购方地址、电话：" prop="guestName">
              <Input v-model="formValidate.guestName" />
            </FormItem>
<!--            <FormItem label="收款方式：" prop="collectionType">-->
<!--              <Select v-model="formValidate.collectionType">-->
<!--                <Option-->
<!--                  v-for="item in collectionTypeOption"-->
<!--                  :value="item.itemCode"-->
<!--                  :key="item.itemCode"-->
<!--                >{{item.itemName}}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="合计含税金额：" prop="invoiceNo">
              <Input v-model="formValidate.invoiceNo" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="合计不含税金额：" prop="invoiceNo">
              <Input v-model="formValidate.invoiceNo" />
            </FormItem>
<!--            <FormItem label="开票业务：" prop="invoiceService">-->
<!--              <Select v-model="formValidate.invoiceService">-->
<!--                <Option-->
<!--                  v-for="item in invoiceServiceOption"-->
<!--                  :value="item.itemCode"-->
<!--                  :key="item.itemCode"-->
<!--                >{{item.itemName}}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="合计税额：" prop="invoiceUnit">
              <Input v-model="formValidate.invoiceUnit" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="复核人：" prop="invoiceUnit">
              <Input v-model="formValidate.invoiceUnit" />
            </FormItem>
<!--            <FormItem label="税率：" prop="invoiceTax">-->
<!--              <Select v-model="formValidate.invoiceTax" clearable>-->
<!--                <Option-->
<!--                  v-for="item in taxOptionList"-->
<!--                  :value="item.itemValueOne"-->
<!--                  :key="item.value"-->
<!--                >{{Math.floor(item.itemValueOne * 100)}} %</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
          </Col>
        </Row>
        <Row>
          <Col span="11">
              <FormItem label="部门门店：" prop="orgBranchId">
                <Select v-model="formValidate.orgBranchId">
                  <Option v-for="item in proTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
          </Col>
          <Col span="11">
              <FormItem label="开票方式：" prop="orgCode">
                <Input v-model="formValidate.orgCode" />
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票时间：" prop="invoiceDate">
              <DatePicker
                type="date"
                :value="formValidate.invoiceDate"
                @on-change="beginTimeChange"
                placeholder="开始时间"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票员：" prop="guestName">
              <Input v-model="formValidate.guestName" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="收款人：" prop="orgCode">
              <Input v-model="formValidate.orgCode" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="备注信息：" prop="remark">
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


    <Modal v-model="exportData" title="发票导入" width="400">
      <p class="mt20 mb20">导入前请先下载模板</p>
      <div slot="footer" class="exportBtn">
        <Button type="info" v-has="'export'" @click="exportDown">模板下载</Button>
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
          <Button type="success" @click="uploading" class="mr10">导入</Button>
        </Upload>
        <!-- <Button type="primary" @click="submit">保存</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getSalesList,
  saveSalesList,
  getOptionSalesList,
  getOptionFdList,
  getOptionCpList,
  getup,
  deletetSalesList,
  voidSalesList,
  writeSalesList
} from "_api/salesManagment/salesInvoice";
import {down } from "@/api/system/essentialData/commoditiesInShortSupply.js"
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
export default {
  data() {
    return {
      exportData: false,
      upurl: getup,
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
      form: {
        page: 0,
        size: 10,
        writeOffStatus: 0
      },
      formValidate: {
        invoiceDate: '',
        id: '',
        invoiceType: "",
        priceTaxTotal: "",
        invoiceUnit: "",
        invoiceAmount: "",
        orgBranchId: "",
        invoiceTaxAmount: "",
        orgCode: "",
        guestName: "",
        species: "",
        collectionType: "",
        invoiceNo: "",
        invoiceService: "",
        invoiceTax: "",
        remark: ""
      },
      columns: [
        {
          title: "选择",
          width: 50,
          type: "selection"
        },
        {
          key: "index",
          title: "序号",
          width: 40,
          className: "tc",
          render: (h, params) => {
            return h(
              "span",
              params.index + this.form.page * this.form.size + 1
            );
          }
        },
        {
          title: "开票申请单号",
          key: "requestCode",
          className: "tc"
        },
        {
          title: "创建时间",
          key: "createTime",
          className: "tc"
        },
        {
          title: "开票时间",
          key: "invoiceDate",
          className: "tc"
        },
        {
          title: "开票类型",
          key: "species",
          className: "tc"
        },
        {
          title: "发票种类",
          key: "invoiceType",
          className: "tc"
        },
        {
          title: "发票代码",
          key: "invoiceNo",
          className: "tc"
        },
        {
          title: "发票号码",
          key: "invoiceNo",
          className: "tc"
        },
        {
          title: "购方名称",
          key: "receiptUnit",
          className: "tc"
        },
        {
          title: "购方税号",
          key: "customDuty",
          className: "tc"
        },
        {
          title: "购方手机号",
          key: "customPhone",
          className: "tc"
          // render: (h,params) =>{
          //     return h('span',(params.row.invoiceAmount).toFixed(2))
          // }
        },
        {
          title: "购方邮箱",
          key: "customMail",
          className: "tc"
        },
        {
          title: "购方开户行及账号",
          key: "customAccount",
          className: "tc"
        },
        {
          title: "购方地址、电话",
          key: "customAddress",
          className: "tc"
        },
        {
          title: "合计含税金额",
          key: "priceTaxTotal",
          className: "tc"
        },
        {
          title: "合计不含税金额",
          key: "invoiceAmount",
          className: "tc"
        },
        {
          title: "合计税额",
          key: "invoiceTaxAmount",
          className: "tc"
        },
        {
          title: "备注信息",
          key: "remark",
          className: "tc"
        },
        {
          title: "部门门店",
          key: "createTime",
          className: "tc"
        },
        {
          title: "开票方式",
          key: "invoiceWay",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.status === 0 ? "否" : "是");
          // }
        },
        {
          title: "开票员",
          key: "invoiceName",
          className: "tc"
        },
        {
          title: "收款人",
          key: "payeeName",
          className: "tc"
        },
        {
          title: "复核人",
          key: "reviewerName",
          className: "tc",
          // render: (h, params) => {
          //   return h("span", params.row.redRushStatus === 0 ? "否" : "是");
          // }
        },
        {
          title: "开票公司",
          key: "invoiceUnit",
          className: "tc"
        },
        {
          title: "分店",
          key: "orgName",
          className: "tc"
        },
        {
          title: "店号",
          key: "orgCode",
          className: "tc"
        },
        {
          title: "收款方式",
          key: "collectionType",
          className: "tc"
        },
        {
          title: "往来单位",
          key: "guestName",
          className: "tc"
        },
        {
          title: "开票清单类型（配件/油品）",
          key: "writeOffStatus",
          className: "tc"
        },
        {
          title: "开票业务（销售、房租、会议费、推广费）",
          key: "writeOffStatus",
          className: "tc"
        },
        {
          title: "导入人/修改人",
          key: "createUname",
          className: "tc"
        },
        {
          title: "导入/修改时间",
          key: "importTime",
          className: "tc"
        },
        {
          title: "是否作废",
          key: "writeOffStatus",
          className: "tc",
          render:(h,params)=>{
            return h("span", params.row.status === 0 ? "否" : "是");
          }
        },
        {
          title: "作废经办人",
          key: "nullifyDate",
          className: "tc"
        },
        {
          title: "作废时间",
          key: "nullifyDate",
          className: "tc"
        },
        {
          title: "是否红冲核销",
          key: "writeOffStatus",
          className: "tc",
          render:(h , params) => {
            return h('span' ,params.row.redRushStatus === 0 ? "否" : "是")
          }
        },
        {
          title: "红冲经办人",
          key: "redRushId",
          className: "tc"
        },
        {
          title: "红冲时间",
          key: "redRushDate",
          className: "tc"
        },
        {
          title: "核销开票申请单号",
          key: "writeOffNo",
          className: "tc"
        },
        {
          title: "所属对账单号",
          key: "writeOffStatus",
          className: "tc"
        },
        {
          title: "核销人",
          key: "writeOff",
          className: "tc"
        },
        {
          title: "核销时间",
          key: "writeOffDate",
          className: "tc"
        },

      ],
      data: [],
      pagetotal: 0,
      isActive: "",
      proModal: false,
      flag: true,
      ruleValidate: {
        name: [
          // { required: true, message: "产品名称不能为空", trigger: "blur" }
        ]
      },
      proType: [],
      allTablist: [],
      invoiceTypeOption: [], //发票类型
      taxOptionList: [], //税率
      collectionTypeOption: [], //收款方式
      speciesOptionList: [], //开票清单类型
      proTypeList: [], //分店
      invoiceServiceOption: [], //开票业务
      invoiceUnitOption: [] //开票公司
    };
  },
  methods: {
    //模板下载
    exportDown() {
      down(1700000000)
    },
    handleBeforeUpload() {},
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    handleSuccess(response) {
      if (response.code == 0) {
        let txt = "上传成功";
        if (response.data) {
          txt = response.data;
        }
        this.$Notice.success({
          title: "导入成功",
          desc: txt,
          duration: 0
        });
        this.exportData = false;
        this.getTabList();
      } else {
        this.$Message.error(response.message);
      }
    },
    uploading() {
      this.upurl = getup;
    },
    //选择查询条件
    chooseTable(num) {
      this.isActive = num;
      this.form.page = 0;
      this.form.writeOffStatus = num;
      this.getTabList();
    },
    beginTimeChange(dataTime) {
      this.formValidate.invoiceDate = dataTime;
    },
    //操作
    operation(num) {
      switch (num) {
        case 1:
          this.exportData = true;
          break;
        case 2:
          this.modifyData();
          break;
        case 3:
          this.deleteList("delete");
          break;
        case 4:
          this.deleteList("void");
          break;
        case 5:
          this.deleteList("write");
          break;
      }
    },
    //修改
    modifyData() {
      if (!this.allTablist.length) {
        this.$Message.warning("请选择要修改数据！");
        return;
      } else if (this.allTablist.length >= 2) {
        this.$Message.warning("请选择一条要修改数据！");
      } else {
        this.allTablist.forEach((item, index) => {
          if (item.writeOffStatus == 1) {
            return (this.flag = false);
          } else {
            return (this.flag = true);
          }
          if (item.status === 1 || item.redRushStatus === 1) {
            return (this.flags = false);
          } else {
            return (this.flags = true);
          }
        });
        if (this.flag == false) {
          this.$Message.warning("该数据中存在已核销数据，请选择未核销数据");
        } else if ((this.flags = false)) {
          this.$Message.warning(
            "该数据中存在已作废或红字核销数据，请选择重新选择"
          );
        } else {
          this.getDetailInfor();
          this.proModal = true;
        }
      }
    },
    //操作项内容
    deleteList(type) {
      if (!this.allTablist.length) {
        let content = "";
        if (type == "delete") {
          this.$Message.warning("请选择要删除的数据！");
        } else if (type == "void") {
          this.$Message.warning("请选择要作废的数据！");
        } else {
          this.$Message.warning("请选择要核销的数据！");
        }
        return;
      } else {
        let tittle = "";
        if (type == "delete") {
          tittle = "<p>确认要删除选中的数据？</p>";
        } else if (type == "void") {
          tittle = "<p>确认要作废选中的数据？</p>";
        } else {
          tittle = "<p>确认要核销选中的数据？</p>";
        }
        this.allTablist.forEach((item, index) => {
          if (item.writeOffNo == 1) {
            return (this.flag = false);
          } else {
            this.flag = true;
          }
          if (item.status === 1 || item.redRushStatus === 1) {
            return (this.flags = false);
          } else {
            return (this.flags = true);
          }
        });
        if (this.flag == false) {
          this.$Message.warning("该数据中存在已核销数据，请选择未核销数据");
          return;
        }
        if (type == "delete" && this.flags == false) {
          return this.$Message.warning(
            "该数据中存在已作废或红字核销数据，请重新选择"
          );
        }
        if (type == "void" && this.flags == false) {
          return this.$Message.warning("该数据中存在红字核销数据，请重新选择");
        }
        if (type == "write" && this.flags == false) {
          return this.$Message.warning("该数据中存在已作废数据，请重新选择");
        }
        this.$Modal.confirm({
          title: "警告",
          content: tittle,
          onOk: () => {
            let message = "";
            let deleteList = [];
            this.allTablist.forEach((item, index) => {
              deleteList.push(item.id);
            });
            if (type == "delete") {
              deletetSalesList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("删除成功！");
                    this.allTablist = [];
                    this.getTabList();
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "void") {
              voidSalesList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("发票作废成功！");
                    this.allTablist = [];
                    this.getTabList();
                  }
                })
                .catch(err => {
                  this.$Message.error(res.message);
                });
            }
            if (type == "write") {
              writeSalesList(deleteList)
                .then(res => {
                  if (res.code === 0) {
                    this.$Message.success("红字核销成功！");
                    this.allTablist = [];
                    this.getTabList();
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
    //查看详情
    getDetailInfor() {
      // await this.getSelectOptions()
      console.log(this.formValidate);
      console.log(this.proTypeList);
      for (let key in this.formValidate) {
        this.formValidate[key] = this.allTablist[0][key];
      }
    },
    //表格全选的时候
    requires(val) {
      this.allTablist = val;
    },
    //获取列表数据
    getTabList() {
      getSalesList(this.form).then(res => {
        if (res.code === 0) {
          this.data = res.data.content;
          this.pagetotal = res.data.totalElements;
        }
      });
    },
    //字典匹配
    async getOption() {
      await getOptionSalesList("CS00107").then(res => {
        if (res.code === 0) {
          this.taxOptionList = res.data;
        }
      });
      await getOptionSalesList("INVOICE_TYPES").then(res => {
        if (res.code === 0) {
          this.invoiceTypeOption = res.data;
        }
      });
      await getOptionSalesList("RECEIVABLE_TYPE").then(res => {
        if (res.code === 0) {
          this.collectionTypeOption = res.data;
        }
      });
      await getOptionSalesList("BILL_LIST_TYPE").then(res => {
        if (res.code === 0) {
          this.speciesOptionList = res.data;
        }
      });
      await getOptionSalesList("BILL_SERVICE").then(res => {
        if (res.code === 0) {
          this.invoiceServiceOption = res.data;
        }
      });
      await getOptionFdList().then(res => {
        if (res.code === 0) {
          this.proTypeList = res.data;
        }
      });
      await getOptionSalesList("KPDW").then(res => {
        if (res.code === 0) {
          this.invoiceUnitOption = res.data;
        }
      });
    },
    //分页
    pageNumChange(pageNum) {
      this.form.page = pageNum;
      this.getTabList();
    },
    pageSizeChange(pageSize) {
      this.form.page = 1;
      this.form.size = pageSize;
      this.getTabList();
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          saveSalesList(this.formValidate)
            .then(res => {
              if (res.code === 0) {
                this.$Message.success("修改成功！");
                this.proModal = false;
                this.getTabList();
              }
            })
            .catch(err => {});
        }
      });
    }
  },
  mounted() {
    this.getTabList();
    this.getOption();
  }
};
</script>
<style lang="less" scoped>
.exportBtn {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}
</style>

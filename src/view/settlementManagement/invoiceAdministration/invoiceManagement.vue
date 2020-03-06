<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize flexd">
      <Button class="mr10" v-has="'export'" @click="operation(1)">导入</Button>
      <Button class="mr10" v-has="'export'" @click="operation(2)">修改</Button>
      <Button class="mr10" v-has="'export'" @click="operation(3)">删除</Button>
      <Button class="mr10" v-has="'export'" @click="operation(4)">智能核销</Button>
      <Button class="mr10" v-has="'export'" @click="operation(5)">发票退回</Button>
      <Button class="mr10" v-has="'export'" @click="operation(6)">红字进项转出</Button>
      <Button class="mr10" v-has="'export'" @click="operation(7)">导入勾选认证时间</Button>
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
          max-height="600"
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
    <!-- 导入 -->
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
    <Modal v-model="exportTime" title="勾选认证时间导入" width="400">
      <p class="mt20 mb20">导入前请先下载模板</p>
      <div slot="footer" class="exportBtn">
        <Button type="info" @click="exportCertification">模板下载</Button>
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
          <Button type="success" @click="importCertification" class="mr10">导入</Button>
        </Upload>
      </div>
    </Modal>
    <!-- 弹出框 -->
    <Modal v-model="proModal" title="进项发票修改" width="650">
      <Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="130">
        <Row>
          <Col span="11">
            <FormItem label="发票采购方名称：" prop="invoicePurchaserId">
              <Select v-model="formValidate.invoicePurchaserId" clearable>
                <Option v-for="item in purchaserOptionList" :value="item.id" :key="item.value">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税额：" prop="taxAmt">
              <Input v-model="formValidate.taxAmt" clearable/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="店号：" prop="shopNo">
              <Input v-model="formValidate.shopNo" clearable/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税率：" prop="taxRate">
              <Select v-model="formValidate.taxRate" clearable>
                <Option v-for="item in taxOptionList" :value="Number(item.itemValueOne)" :key="item.value">{{item.itemValueOne}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票代码：" prop="invoiceCode">
              <Input v-model="formValidate.invoiceCode" clearable/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="往来单位：" prop="guestName">
              <!-- <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select> -->
              <Input v-model="formValidate.guestName" clearable/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票号：" prop="invoiceNo">
              <Input v-model="formValidate.invoiceNo" clearable/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="付款方式：" prop="payType">
              <Select v-model="formValidate.payType" clearable>
                <Option v-for="item in payOptionList" :value="item.itemCode" :key="item.value">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票销售方名称：" prop="invoiceSellerName">
              <Input v-model="formValidate.invoiceSellerName" clearable/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票清单类型：" prop="billingType">
              <Select v-model="formValidate.billingType" clearable>
                <Option v-for="item in billingOptionList" :value="item.itemCode" :key="item.itemCode">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票日期：" prop="billingDate">
              <Input v-model="formValidate.billingDate" clearable/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票分类：" prop="invoiceSort">
              <Select v-model="formValidate.invoiceSort" clearable>
                <Option v-for="item in invoiceOptionList" :value="item.itemCode" :key="item.value">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="价税合计金额：" prop="totalAmt">
              <Input v-model="formValidate.totalAmt" clearable/>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="金额：" prop="invoiceAmt">
                <Input v-model="formValidate.invoiceAmt" clearable/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="备注：" prop="remark">
              <Input
                v-model="formValidate.remark"
                clearable
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
    <!-- 核销弹框 -->
    <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <span>核销成功</span>
        </p>
        <div style="text-align:center">
            <p>已成功核销{{total}}条数据</p>
        </div>
        <div slot="footer">
            <Button type="success" @click="modal2=false">确定</Button>
        </div>
    </Modal>
    <modelToast ref="Toast"></modelToast>
  </div>
</template>
<script>
import {
  getManageList,
  deletetManageList,
  invoiceReturnList,
  invoiceRedHedgedList,
  getup,
  authenticationGetup,
  getOptions1,
  getOptions2,
  getOptions3,
  getOptions4,
  getOptions5,
  savDetailInfor,
  invoiceWriteoff
} from "_api/salesManagment/invoiceAdministration";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
import modelToast from './modelToast.vue'
export default {
  components:{
    modelToast
  },
  data() {
    return {
      columns: [
        {
          title: "选择",
          width: 40,
          type: "selection",
        },
        {
          type: "index",
          title: "序号",
        },
        {
          title: "登记日期",
          key: "registrationDate",
        },
        {
          title: "发票采购方名称",
          key: "invoicePurchaserName",
        },
        {
          title: "店号",
          key: "shopNo",
        },
        {
          title: "发票代码",
          key: "invoiceCode",
        },
        {
          title: "发票号",
          key: "invoiceNo",
        },
        {
          title: "发票销售方名称",
          key: "invoiceSellerName",
        },
        {
          title: "开票日期",
          key: "billingDate",
        },
        {
          title: "价税合计金额",
          key: "totalAmt",
        },
        {
          title: "金额",
          key: "invoiceAmt",
        },
        {
          title: "税额",
          key: "taxAmt",
        },
        {
          title: "税率",
          key: "taxRate",
        },
        {
          title: "往来单位",
          key: "guestName",
        },
        {
          title: "付款方式",
          key: "payTypeName",
        },
        {
          title: "发票分类",
          key: "invoiceSortName",
        },
        {
          title: "开票清单类型",
          key: "billingTypeName",
        },
        {
          title: "增加类型",
          key: "addTypeName",
        },
        {
          title: "导入经办人",
          key: "importUname",
        },
        {
          title: "登记时间",
          key: "registrationTime",
          className: "tc"
        },
        {
          title: "勾选认证时间",
          key: "checkCertificationTime",
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
        },
        {
          title: "退回时间",
          key: "returnTime",
        },
        {
          title: "是否红字转出",
          key: "redHedged",
          render: (h, params) => {
            return h("span", params.row.redHedged ? "是" : "否");
          }
        },
        {
          title: "红冲经办人",
          key: "hedgeUname",
          minWinth:180
        },
        {
          title: "红冲时间",
          key: "hedgeTime",
        },
        {
          title: "对号账单",
          key: "accountNo",
          render: (h, params) => {
            let arr = []
            params.row.accountNo.forEach((item,i)=>{
              arr.push(
                h("span",{
                  style:{
                    color:'red',
                  },
                  on: {
                    click: () => {
                      this.$refs.Toast.modal6=true
                      this.$refs.Toast.accountNo=item
                      this.$refs.Toast.getToastData()
                    }
                  }
                },item)
              )
            })
            return h('div',arr)
          }
        },
        {
          title: "核销人",
          key: "cancelUname",
        },
        {
          title: "核销时间",
          key: "cancelTime",
        }
      ],
      flag:true,
      modal2:false,
      data: [],
      pagetotal: 0,
      isActive: "",
      proModal: false,
      formValidate: {
        id:"",
        guestName:"",
        shopNo:"",
        payType:"",
        billingType:"",
        invoicePurchaserId:"",
        billingDate:"",
        invoiceSort:"",
        invoiceNo:"",
        invoiceCode:"",
        taxAmt:"",
        taxRate:"",
        invoiceAmt:"",
        invoiceSellerName:"",
        totalAmt:"",
        remark: ""
      },
      ruleValidate: {
        // invoicePurchaserId:[
        //   { required: true, message: "请选择发票采购方名称", trigger: "change" }
        // ],
        // taxRate:[
        //   { required: true, message: "请选择发票税率", trigger: "change" }
        // ]
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
      authenticationUpurl: authenticationGetup, // 导入地址
      exportData: false,
      exportTime: false,
      billingOptionList:[],//开票清单类型
      payOptionList:[], //付款方式
      taxOptionList:[], //税率
      invoiceOptionList:[],//发票分类
      purchaserOptionList:[],//发票采购方
      total:0,//核销数量
    };
  },
  methods: {
    //操作
    operation(num) {
      switch (num) {
        case 1:
          this.exportData = true;
          break;
        case 2:
          this.modifyData()
          break;
        case 3:
          this.deleteTabList("delete");
          break;
        case 4:
          this.deleteTabList("writeoff")
          break;
        case 5:
          this.deleteTabList("return");
          break;
        case 6:
          this.deleteTabList("rewors");
          break;
        case 7:
          this.exportTime = true;
          break;
      }
    },
    //操作项
    deleteTabList(type) {
      if (!this.allTablist.length) {
        let content = "";
        if (type == "delete") {
          this.$Message.warning("请选择要删除的数据！");
        } else if (type == "return") {
          this.$Message.warning("请选择要退回的数据！");
        } else if (type == "rewors") {
          this.$Message.warning("请选择要进项转出的数据！");
        }else{
          this.$Message.warning("请选择要核销的数据！");
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
        }else{
          tittle = "<p>确认要核销选中的数据？</p>";
        }
        this.allTablist.forEach((item,index)=>{
          if(item.canceled==1){
            return this.flag=false
          }
        })
        if(this.flag==false&&type=='writeoff'){
          this.$Message.warning("该数据中存在已核销数据，请重新未核销数据");
        }else{
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
                      this.allTablist=[]
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
                      this.allTablist=[]
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
                      this.allTablist=[]
                      this.getTabList(this.form);
                    }
                  })
                  .catch(err => {
                    this.$Message.error(res.message);
                  });
              }
              if(type == "writeoff"){
                invoiceWriteoff(deleteList)
                  .then(res=>{
                    if(res.code===0){
                      // this.total=res.num
                      this.allTablist=[]
                      this.getTabList(this.form)
                      this.modal2=true
                    }
                  }).catch(err=>{
                    this.$Message.error(res.message);
                  })
              }
            },
            onCancel: () => {}
          });
        }
      }
    },
    //修改
    modifyData(){
      if(!this.allTablist.length){
        this.$Message.warning("请选择要修改数据！");
        return
      }else if(this.allTablist.length>=2){
        this.$Message.warning("请选择一条要修改数据！");
      }else{
        this.getDetailInfor()
        this.proModal = true;
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
    // election(val) {
    // },
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
    //获取下拉菜单
    getSelectOptions(){
      //清单类型
      getOptions1({dictCode:"BILL_LIST_TYPE"}).then(res=>{
        if(res.code===0){
          this.billingOptionList=res.data
        }
      }).catch(err=>{
        console.log(err)
      })
      //发票分类
      getOptions2({dictCode:"INVOICE_TYPE"}).then(res=>{
        if(res.code===0){
          this.invoiceOptionList =res.data
        }
      }).catch(err=>{
          console.log(err)
      })
      //付款方式
      getOptions3({dictCode:"PAYMENT_TYPE"}).then(res=>{
        if(res.code===0){
          this.payOptionList=res.data
        }
      }).catch(err=>{
        console.log(err)
      })
      //税率
      getOptions4({dictCode:"CS00107"}).then(res=>{
        if(res.code===0){
          this.taxOptionList=res.data
        }
      }).catch(err=>{
          console.log(err)
      })
      //发票采购方
      getOptions5({tenantId:0}).then(res=>{
        if(res.code===0){
          this.purchaserOptionList = res.data
        }
      }).catch(err=>{
          console.log(err)
      })
    },
    //查看详情
    getDetailInfor(){
      // await this.getSelectOptions()
      for( let key in this.formValidate){
        this.formValidate[key] = this.allTablist[0][key];
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
        if (valid) {
          savDetailInfor(this.formValidate).then(res=>{
            if(res.code===0){
              this.$Message.success("修改成功")
              this.proModal = false;
              this.getTabList(this.form);
            }
          }).catch(err=>{
              this.$Message.success(res.message)
          })
        }
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
    exportCertification() {
      location.href =
        baseUrl.omsApi +
        "/entryRegistration/checkTemplate?access_token=" +
        Cookies.get(TOKEN_KEY);
    },
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
    this.getSelectOptions()
  }
};
</script>
<style lang="less" scoped>
.flexd {
  display: flex;
}
.exportBtn {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}
</style>

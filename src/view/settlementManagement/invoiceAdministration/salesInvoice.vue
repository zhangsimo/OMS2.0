<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
         <Button class="mr10"  v-has="'export'" @click="operation(1)">导入发票</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(2)">修改</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(3)">删除导入</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(4)">发票作废</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(5)">红字核销</Button>
         <div class="mt20">
            <Button class="mr10" :type="isActive===''?'info':'default'" @click="chooseTable('')">全部显示</Button>
            <Button class="mr10" :type="isActive===1?'info':'default'" @click="chooseTable(1)">已核销</Button>
            <Button :type="isActive===0?'info':'default'" @click="chooseTable(0)">未核销</Button>
        </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row :summary-method="handleSummary"
          @on-selection-change="requires" max-height="400"></Table>
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
            <FormItem label="发票类型：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="价税合计：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票公司：" prop="type">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票金额：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="分店：" prop="type">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="发票税额：" prop="name">
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
            <FormItem label="往来单位：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票清单类型：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="收款方式：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="发票号码：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="开票业务：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票单位：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="税率(%)：" prop="name">
              <Select v-model="formValidate.name">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开票日期：" prop="remark">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
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
import { getSalesList } from '_api/salesManagment/salesInvoice'
export default {
    data(){
      return{
        form:{
          page:1,
          size:10,
          writeOffStatus:""
        },
        columns:[
            {
            title: "选择",
            width: 50,
            type: "selection"
            },
            {
            key:'index',
            title: "序号",
            width: 40,
            className: "tc"
            },
            {
            title: "发票类型",
            key: "invoiceType",
            className: "tc"
            },
            {
            title: "开票公司",
            key: "tenantName",
            className: "tc"
            },
            {
            title: "分店",
            key: "branchStore",
            className: "tc"
            },
            {
            title: "店号",
            key: "branchStoreId",
            className: "tc"
            },
            {
            title: "收款方式",
            key: "collectionType",
            className: "tc"
            },
            {
            title: "发票号码",
            key: "invoiceNo",
            className: "tc"
            },
            {
            title: "开票单位",
            key: "storeName",
            className: "tc"
            },
            {
            title: "开票日期",
            key: "invoiceDate",
            className: "tc"
            },
            {
            title: "价税合计",
            key: "priceTaxTotal",
            className: "tc"
            },
            {
            title: "发票金额",
            key: "invoiceAmount",
            className: "tc",
            // render: (h,params) =>{
            //     return h('span',(params.row.invoiceAmount).toFixed(2))
            // }
            },
            {
            title: "发票税额",
            key: "invoiceTax",
            className: "tc"
            },
            {
            title: "往来单位",
            key: "",
            className: "tc"
            },
            {
            title: "开票清单类型",
            key: "species",
            className: "tc"
            },
            {
            title: "开票业务",
            key: "invoiceService",
            className: "tc"
            },
            {
            title: "税率",
            key: "tax",
            className: "tc"
            },
            {
            title: "备注",
            key: "remark",
            className: "tc"
            },
            {
            title: "导入人",
            key: "",
            className: "tc"
            },
            {
            title: "导入时间",
            key: "",
            className: "tc"
            },
            {
            title: "是否作废",
            key: "status",
            className: "tc"
            },
            {
            title: "作废经办人",
            key: "nullifyId",
            className: "tc"
            },
            {
            title: "作废时间",
            key: "nullifyDate",
            className: "tc"
            },
            {
            title: "是否红冲核销",
            key: "redRushStatus",
            className: "tc"
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
            key: "writeOffStatus",
            className: "tc"
            },
        ],
        data:[],
        pagetotal: 0,
        isActive:'',
        proModal:false,
        formValidate: {
          name: "",
          remark:""
        },
        ruleValidate: {
          name: [
            // { required: true, message: "产品名称不能为空", trigger: "blur" }
          ]
        },
        proType:[],
        allTablist:[]
      }
    },
    methods:{
        //选择查询条件
        chooseTable(num) {
          this.isActive = num;
          this.form.page = 1;
          this.form.writeOffStatus = num;
          this.getTabList(this.form);
        },
        //操作
        operation(num){
          switch (num){
              case 1:
                break;
              case 2:
               this.modifyData()
                break;
          }
        },
        //发票修改
        //修改
        modifyData() {
          if (!this.allTablist.length) {
            this.$Message.warning("请选择要修改数据！");
            return;
          } else if (this.allTablist.length >= 2) {
            this.$Message.warning("请选择一条要修改数据！");
          } else {
            this.getDetailInfor();
            this.proModal = true;
          }
        },
        //查看详情
        getDetailInfor() {
          // await this.getSelectOptions()
          for (let key in this.formValidate) {
            this.formValidate[key] = this.allTablist[0][key];
          }
        },
        //表格全选的时候
        requires(val){
          this.allTablist = val;
        },
        //获取列表数据
        getTabList(){
          this.form.page -= 1;
          getSalesList(this.form).then(res=>{
            if(res.code===0){
              this.data = res.data.content
              this.pagetotal = res.data.totalElements;
            }
          })
        },
        handleSummary(){

        },
        //分页
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

            }
          });
        },
    },
    mounted(){
      this.getTabList()
    }
}
</script>
<style lang="less" scoped>

</style>

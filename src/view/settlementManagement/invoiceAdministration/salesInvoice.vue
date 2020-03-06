<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
         <Button class="mr10"  v-has="'export'" @click="operation(1)">导入发票</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(2)">修改</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(3)">删除导入</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(4)">发票作废</Button>
         <Button class="mr10"  v-has="'export'" @click="operation(5)">红字核销</Button>
         <div class="mt20">
            <Button class="mr10" :type="isActive==1?'info':'default'" @click="chooseTable(1)">全部显示</Button>
            <Button class="mr10" :type="isActive==2?'info':'default'" @click="chooseTable(2)">已核销</Button>
            <Button :type="isActive==3?'info':'default'" @click="chooseTable(3)">未核销</Button>
        </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table border :columns="columns" :data="data" ref="summary" show-summary highlight-row :summary-method="handleSummary"
          @on-row-click="election" max-height="400"></Table>
         <Page
          :total="pagetotal"
          show-elevator
          class="mt10 fr"
          show-sizer
          @on-change="pageCode"
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
export default {
    data(){
      return{
        columns:[
            {
            key:'index',
            title: "序号",
            width: 40,
            className: "tc"
            },
            {
            title: "发票类型",
            key: "guestOrgName",
            className: "tc"
            },
            {
            title: "开票公司",
            key: "serviceId",
            className: "tc"
            },
            {
            title: "分店",
            key: "sourceType",
            className: "tc"
            },
            {
            title: "店号",
            key: "guestName",
            className: "tc"
            },
            {
            title: "收款方式",
            key: "guestId",
            className: "tc"
            },
            {
            title: "发票号码",
            key: "belongSystem",
            className: "tc"
            },
            {
            title: "开票单位",
            key: "storeName",
            className: "tc"
            },
            {
            title: "开票日期",
            key: "createUname",
            className: "tc"
            },
            {
            title: "价税合计",
            key: "createTime",
            className: "tc"
            },
            {
            title: "发票金额",
            key: "orderAmt",
            className: "tc",
            render: (h,params) =>{
                return h('span',(params.row.orderAmt).toFixed(2))
            }
            },
            {
            title: "发票税额",
            key: "remark",
            className: "tc"
            },
            {
            title: "往来单位",
            key: "billstate",
            className: "tc"
            },
            {
            title: "开票清单类型",
            key: "billstate",
            className: "tc"
            },
            {
            title: "开票业务",
            key: "billstate",
            className: "tc"
            },
            {
            title: "税率",
            key: "billstate",
            className: "tc"
            },
            {
            title: "备注",
            key: "billstate",
            className: "tc"
            },
            {
            title: "导入人",
            key: "billstate",
            className: "tc"
            },
            {
            title: "导入时间",
            key: "billstate",
            className: "tc"
            },
            {
            title: "是否作废",
            key: "billstate",
            className: "tc"
            },
            {
            title: "作废经办人",
            key: "billstate",
            className: "tc"
            },
            {
            title: "作废时间",
            key: "billstate",
            className: "tc"
            },
            {
            title: "是否红冲核销",
            key: "billstate",
            className: "tc"
            },
            {
            title: "红冲经办人",
            key: "billstate",
            className: "tc"
            },
            {
            title: "红冲时间",
            key: "billstate",
            className: "tc"
            },
            {
            title: "核销开票申请单号",
            key: "billstate",
            className: "tc"
            },
        ],
        data:[],
        pagetotal: 0,
        isActive:1,
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
        proType:[]
      }
    },
    methods:{
        //选择查询条件
        chooseTable(num){
            this.isActive=num
        },
        //操作
        //操作
        operation(num){
          switch (num){
              case 1:
                break;
              case 2:
                this.proModal = true
                break;
          }
        },
        election(){

        },
        handleSummary(){

        },
        pageCode(){

        },
        submit(name) {
          this.$refs[name].validate(valid => {
            if (valid) {

            }
          });
        },
    }
}
</script>
<style lang="less" scoped>

</style>

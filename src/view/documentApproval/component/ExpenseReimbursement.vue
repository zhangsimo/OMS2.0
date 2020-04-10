<template>
  <Modal
    v-model="model"
    title="费用报销 申请单"
    width="1000px"
    >
   <div class="clearfix">
     <div class="fr">
       <Button class="mr10" >保存草稿</Button>
       <Button class="mr10">提交申请</Button>
       <Button class="mr10">取消</Button>
     </div>
   </div>
    <Form ref="formInline" :model="formInline" :label-width="80"  :rules="ruleValidate">
      <FormItem label="申请单号：">
        <Input type="text" v-model="formInline.user" style="width: 200px" disabled="">
        </Input>
      </FormItem>
      <Row class="tableBox">
        <Col class="inner" span="4">申请人</Col>
        <Col class="inner" span="4">{{formInline.staffName || ''}}</Col>
        <Col class="inner" span="4">部门名称</Col>
        <Col class="inner" span="4">{{formInline.tenantCompanyName || ' '}}</Col>
        <Col class="inner" span="4">门店店号</Col>
        <Col class="inner" span="4">{{formInline.shopCode || ' '}}</Col>
      </Row>
      <Row class="tableBox twoTable">
        <Col class="inner" span="4">门店名称</Col>
        <Col class="inner" span="4">{{formInline.shopName || ' '}}</Col>
        <Col class="inner" span="4">申请类型</Col>
        <Col class="inner" span="4">{{formInline.type || ' '}}</Col>
        <Col class="inner" span="4">申请时间</Col>
        <Col class="inner" span="4">{{formInline.date}}</Col>
      </Row>

      <div class="tableBox2 mt20">
        <div class="tableline tableright">
          <div class="applyTitle">请示单号</div>
          <a>{{formInline.code || ''}}</a>
          <a class="fr" @click="openSelect">选择</a>
        </div>
        <div class="tableright">
          <FormItem label="主题" style="margin-bottom: 0px" prop="use">
            <Input type="text"  v-model="formInline.use" style="width: 100%">
            </Input>
          </FormItem>
        </div>
      </div>

      <h5 class="mt20 mb10" style="font-size: 18px">费用支出明显</h5>
      <vxe-table
        border
        resizable
        size="mine"
        align="center"
        :data="expenditureTableData"
        :edit-config="{trigger: 'click', mode: 'cell'}"
        >
        <vxe-table-column width="50">
          <template v-slot="item">
            <a v-if="item.seq != item.data.length" @click="dele(row)">删除行</a>
            <a v-else>添加行</a>
          </template>
        </vxe-table-column>
        <vxe-table-column field="name" title="摘要" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
        <vxe-table-column field="sex" title="费用类型" :edit-render="{name: 'select', options: moneyTypeList , optionProps: {value: 'id', label: 'name'}}"></vxe-table-column>
        <vxe-table-column field="subjectType" title="入账科目" :edit-render="{name: 'input',events: {focus: getSubject}}">
<!--          <template v-slot="{row}">-->
<!--            <a></a>-->
<!--          </template>-->
        </vxe-table-column>
        <vxe-table-column field="name" title="价税合计" >

        </vxe-table-column>
        <vxe-table-column field="name" title="税率" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
        <vxe-table-column field="name" title="税额" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
        <vxe-table-column field="name" title="不含税金额" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
        <vxe-table-column field="name" title="备注" :edit-render="{name: 'input', attrs: {type: 'text'}}" width="200"></vxe-table-column>
      </vxe-table>
    </Form>

<!--    选择的模态框-->
    <requestCode ref="request" @backList = 'getBackList'></requestCode>

<!--    入账科目模态框-->
    <div slot='footer'></div>
  </Modal>
</template>

<script>
  import  moment from 'moment'
  import requestCode from './requestCode'
    export default {
        name: "ExpenseReimbursement",
      components:{
        requestCode,
      },
      props:{
          list:''
      },
      data(){
          return {
            model: true, //模态框开关
            formInline:{},//所有数据对象
            //表单校验
            ruleValidate: {
              use: [
                {required: true, message: '主题为必填', trigger: 'blur'}
              ],
            },
            expenditureTableData:[
              {name:'zs',sex:1,subjectType:'选择'},
              {name:'ls',sex:1,subjectType:'选择'},
              {name:'we',sex:1,subjectType:'选择'},
              {name:'zz',sex:1,subjectType:'选择'},

            ],//支出表格数据
            //费用类型
            moneyTypeList:[
              {name:"买入",id:"1"},
              {name:"支出",id:"3"},
              {name:"赊账",id:"4"},
            ],

          }
      },
      methods:{
          //模态框打开
          open(){
            console.log(this.list)
            this.model = true
            let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                user = this.$store.state.user.userData
            this.formInline.staffName = user.staffName
            this.formInline.tenantCompanyName = user.tenantCompanyName|| ' 　　'
            this.formInline.shopCode = user.shopCode || ' 　　'
            this.formInline.shopName = user.shopName
            this.formInline.type = '费用报销'
            this.formInline.date = date
          },

        //打开选择模态框
        openSelect(){
          this.$refs.request.open()
        },

        //获取选择的信息
        getBackList(row){
            // console.log(row ,789)
        },

        //科目获取焦点
        getSubject({column}){
          console.log(column , 888)
          // this.$refs.subjects.subjectModelShow = true
        },

        //删除行
        dele(row){
            console.log(row)
        }

      }
    }
</script>

<style scoped lang="less">
.tableBox {
  line-height: 38px;
  text-align: center;
  border: #cccccc 1px solid;
  border-right: none;
  .inner {
    border-right: #cccccc 1px solid;
    height: 38px;
  }
  .inner:nth-child(2n-1) {
    background: #f9f9f9;
  }
}
.tableBox2{
  line-height: 38px;
  border: #cccccc 1px solid;
  border-right: none;
}
  .twoTable {
    border-top: none;
  }
.tableline {
  border-bottom: #cccccc 1px solid;
  padding-right: 10px;
}
.tableright {
  border-right: #cccccc 1px solid;
}
.applyTitle {
  width: 80px;
  border-right: #cccccc 1px solid;
  text-align: center;
  background-color: #f9f9f9;
  display: inline-block;
}
</style>
<style scoped>
  .tableright >>> .ivu-form-item-label {
    text-align: center;
    border-right: #cccccc 1px solid;
    background-color: #f9f9f9;
  }
</style>

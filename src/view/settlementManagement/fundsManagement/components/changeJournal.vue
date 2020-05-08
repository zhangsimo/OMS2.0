<template>
  <Modal v-model="modalShow" title="对账单号明细" width="700" >
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" label-colon>
      <Row>
        <Col span="12">
          <FormItem label="所属区域" prop="areaId" >
            <Select v-model="formCustom.areaId" style="width:150px" @on-change="changeArea">
              <Option v-for="item in areaList" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="所属门店" prop="shopId">
            <Select v-model="formCustom.shopId" style="width:150px" @on-change='getShopCode'>
              <Option v-for="item in shopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="所属店号" >
            <Input  v-model="formCustom.shopCode" class="w150" disabled />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="账户" prop="accountCode">
            <Select v-model="formCustom.accountCode" style="width:150px">
              <Option v-for="item in accountList" :value="item.id" :key="item.value">{{ item.accountName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="账号" prop="accountName">
            <Input  v-model="formCustom.accountName" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="开户行" prop="bankName">
            <Input  v-model="formCustom.bankName" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对应科目" prop="mateAccountCode">
            <Select v-model="formCustom.mateAccountCode" style="width:150px">
              <Option v-for="item in subJectList" :value="item.id" :key="item.id">{{ item.titleName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="发生日期" prop="createTime" >
            <DatePicker type="date"  v-model="formCustom.createTime" style="width: 150px"></DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="收入金额" prop="incomeMoney">
            <Input  v-model="formCustom.incomeMoney" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="支出金额" prop="paidMoney">
            <Input  v-model="formCustom.paidMoney" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对方户名" prop="reciprocalAccountName">
            <Input  v-model="formCustom.reciprocalAccountName" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对账账号" prop="checkAccount">
            <Input  v-model="formCustom.checkAccount" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对方开户行" prop="reciprocalBankName">
            <Input v-model="formCustom.reciprocalBankName" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="交易备注" prop="tradingNote">
            <Input  v-model="formCustom.tradingNote" class="w150"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="业务类别" prop="businessCode">
            <Select v-model="formCustom.businessCode" style="width:150px">
              <Option v-for="item in businessList" :value="item.id" :key="item.value">{{ item.ItemName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="认领店号">
            <Select v-model="formCustom.claimShopCode" style="width:150px">
              <Option v-for="item in claimShopList" :value="item.id" :key="item.id">{{ item.code }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>


    </Form>
    <div slot="footer">
      <Button type="primary" @click="save">保存</Button>
      <Button @click="modalShow=false">返回</Button>
    </div>
  </Modal>
</template>

<script>
  import {are , goshop , goAccountList , gosubjectType , changeSave} from '@/api/settlementManagement/fundsManagement/capitalChain'
  import {getTableList}from '@/api/accountant/accountant'
  import moment from 'moment'


  export default {
    props:{
      list:''
    },
    data() {
      return {
        modalShow: false, //模态框状态
        formCustom:{},//form表单数据
        ruleCustom:{
          areaId:[
            { required: true, message: '所属区域必选', trigger: 'change' }
          ],
          shopId:[
            { required: true, message: '所属门店必选', trigger: 'change' }
          ],
          accountCode:[
            { required: true, type:'number', message: '账户必选', trigger: 'change' }
          ],
          accountName:[
            { required: true, message: '账号必填', trigger: 'blur' }
          ],
          bankName:[
            { required: true, message: '开户行必填', trigger: 'blur' }
          ],
          mateAccountCode:[
            { required: true, message: '对应科目必选', trigger: 'change' }
          ],
          createTime:[
            { required: true, type: 'date', message: '日期为必选', trigger: 'change' }
          ],
          incomeMoney:[
            { required: true, message: '收入金额必填', trigger: 'blur' }
          ],
          paidMoney:[
            { required: true, message: '支出金额必填', trigger: 'blur' }
          ],
          reciprocalAccountName:[
            { required: true, message: '对方户名必填', trigger: 'blur' }
          ],
          checkAccount:[
            { required: true, message: '对方账号必填', trigger: 'blur' }
          ],
          reciprocalBankName:[
            { required: true, message: '对方开户行必填', trigger: 'blur' }
          ],
          tradingNote:[
            { required: true, message: '备注必填', trigger: 'blur' }
          ],
          businessCode:[
            { required: true, type:'number', message: '业务类别必选', trigger: 'change' }

          ],
        },//表单校验
        areaList: [],//地址列表
        shopList:[],//门店
        businessList:[],//业务列表
        accountList:[],//账户列表
        subJectList:[],//科目列表
        claimShopList:[],//认领店号
      };
    },
    mounted(){
      this.getAllArea()
      this.getsubjectType()
      this.getSubject()
      this.getAccount()
      this.getclaimShop()
    },
    methods: {
    open(){
      this.handleReset()
        this.formCustom = JSON.parse(JSON.stringify(this.list))
      this.modalShow = true
      this.getShopList()
    },
      //获取区域
    async getAllArea(){
      let res = await are()
      if(res.code === 0) return  this.areaList = res.data
    },

    //获取所属门店
    async getShopList(){
      let data ={}
      data.supplierTypeSecond = this.formCustom.areaId
      let  res = await goshop(data)
      if (res.code === 0) return this.shopList = res.data
    },

      //获取认领店号
      async getclaimShop(){
        let data ={}
        data.supplierTypeSecond = 0
        let  res = await goshop(data)
        if (res.code === 0) return this.claimShopList = res.data
      },

    //账户
    async getAccount(){
      let data ={}
      data.shopNumber = this.$store.state.user.userData.shopId
     let res = await  goAccountList(data)
      if (res.code === 0) return  this.accountList  = res.data
    },

    //获取业务类别
    async getsubjectType(){
      let res = await gosubjectType()
      if (res.code === 0) return  this.businessList = res.data
    },

    //获取科目
      async getSubject(){
        let data = {}
        data.parentCode = 101
        let res = await getTableList(data)
        if(res.code === 0) return this.subJectList =  res.data
      },

     //切换区域清除数据
      async changeArea(){
        this.formCustom.shopId = ''
        this.formCustom.shopCode = ''
        let data ={}
        data.supplierTypeSecond = this.formCustom.areaId
        let res = await goshop(data)
        if (res.code === 0) return this.shopList = res.data
      },

      //切换门店刷新店号
      getShopCode(value){
      if (!value) return
      let shopArr = this.shopList.filter(item => item.id == value)
        let code = shopArr[0].code
        this.$set(this.formCustom , 'shopCode' ,  code)
      },

      //清空校验
      handleReset () {
        this.$refs.formCustom.resetFields();
      },

    //保存
     save(){
      this.$refs.formCustom.validate(async (valid) => {
        if (valid) {
          this.formCustom.createTime = moment(this.formCustom.createTime).startOf('day').format("YYYY-MM-DD HH:mm:ss")
          let res = await changeSave(this.formCustom)
          if (res.code === 0) {
            this.$Message.success('修改成功')
            this.modalShow = false
            this.$emit('getNewList' ,{})
          }
        }
      })
    }
    }

  };
</script>

<template>
  <Modal v-model="modalShow" title="修改日记账" width="750">
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustomRalus" :label-width="100" label-colon>
      <Row>
        <Col span="12">
          <FormItem label="所属门店" >
            <Input  v-model="formCustom.shopName" class="w200" disabled />
            <!--            <Select v-model="formCustom.shopId" style="width:150px" @on-change='getShopCode'>-->
            <!--              <Option v-for="item in shopList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
            <!--            </Select>-->
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="所属区域" >
            <Input  v-model="formCustom.areaName" class="w200" disabled />
            <!--            <Select v-model="formCustom.areaId" style="width:150px" @on-change="changeArea">-->
            <!--              <Option v-for="item in areaList" :value="item.id" :key="item.id">{{ item.companyName }}</Option>-->
            <!--            </Select>-->
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="所属店号">
            <Input v-model="formCustom.shopCode" class="w200" disabled/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="账户" prop="accountId">
            <Select v-model="formCustom.accountId" style="width:150px" @on-change='changeAccount' disabled>
              <Option v-for="item in accountList" :value="item.id" :key="item.id">{{item.accountName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="账号" prop="accountCode">
            <Input v-model="formCustom.accountCode" class="w200" disabled></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="开户行" prop="bankName">
            <Input v-model="formCustom.bankName" class="w200" disabled></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对应科目" prop="mateAccountName">
            <Input v-model="formCustom.mateAccountName" class="w200" disabled></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="发生日期" prop="createTime">
            <DatePicker type="datetime" v-model="formCustom.createTime" :options="options1" class="w200"></DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="收入金额">
            <Input v-model="formCustom.incomeMoney" class="w200"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="支出金额">
            <Input v-model="formCustom.paidMoney" class="w200"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对方户名">
            <Input v-model="formCustom.reciprocalAccountName" class="w200"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对账账号">
            <Input v-model="formCustom.checkAccount" class="w200"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="对方开户行">
            <Input v-model="formCustom.reciprocalBankName" class="w200"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="交易备注">
            <Input v-model="formCustom.tradingNote" class="w200"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="业务类别">
            <Select v-model="formCustom.businessCode" style="width:150px">
              <Option v-for="item in businessList" :value="item.ItemCode" :key="item.ItemCode">{{ item.ItemName }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="认领店号">
            <Select v-model="formCustom.claimShopCode" style="width:150px" :disabled="$route.name=='shopJournal'||$route.name=='cashJournal'">
              <Option v-for="item in claimShopList" :value="item.code" :key="item.id">{{ item.code }}</Option>
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
  import {
    are,
    goshop,
    goAccountList,
    gosubjectType,
    changeSave,
    getSubjectType
  } from '@/api/settlementManagement/fundsManagement/capitalChain'
  import moment from 'moment'


  export default {
    props: {
      list: ''
    },
    data() {
      let NumberValue = (rule, value, callback) => {
        let reg = /^[0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error("只能输入数字且不能为空!"));
        } else {
          callback();
        }
      };
      return {
        modalShow: false, //模态框状态
        formCustom: {},//form表单数据
        options1: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          }
        },
        ruleCustomRalus: {
          areaId: [
            {required: true, message: '所属区域必选', trigger: 'change'}
          ],
          shopId: [
            {required: true, message: '所属门店必选', trigger: 'change'}
          ],
          accountId: [
            { required: true, type:'string', message: '账户必选', trigger: 'change' }
          ],
          accountCode: [
            {required: true, message: '账号必填', trigger: 'blur'}
          ],
          bankName: [
            {required: true, message: '开户行必填', trigger: 'blur'}
          ],
          mateAccountCode: [
            {required: true, message: '对应科目必选', trigger: 'change'}
          ],
          createTime: [
            {required: true,type:"date" ,message: '日期为必选', trigger: 'change'}
          ],
          incomeMoney: [
            {required: true, message: '只能输入数字且不能为空', validator: NumberValue, trigger: 'blur'}
          ],
          paidMoney: [
            {required: true, message: '只能输入数字且不能为空', validator: NumberValue, trigger: 'blur'}
          ],
          reciprocalAccountName: [
            {required: true, message: '对方户名必填', trigger: 'blur'}
          ],
          checkAccount: [
            {required: true, message: '对方账号必填', trigger: 'blur'}
          ],
          reciprocalBankName: [
            {required: true, message: '对方开户行必填', trigger: 'blur'}
          ],
          tradingNote: [
            {required: true, message: '备注必填', trigger: 'blur'}
          ],
          // businessCode: [
          //   {required: true, type: 'string', message: '业务类别必选', trigger: 'change'}
          // ],
        },//表单校验
        areaList: [],//地址列表
        shopList: [],//门店
        businessList: [],//业务列表
        accountList: [],//账户列表
        subJectList: [],//科目列表
        claimShopList: [],//认领店号
      };
    },
    mounted() {
      this.getsubjectType()
      this.getclaimShop()
      this.getAccount()
    },
    methods: {
      open() {
        this.handleReset()
        this.getSubject()
        setTimeout(()=>{
          this.modalShow = true
          this.formCustom = {...this.list}
          // console.log(this.formCustom.mateAccountCode,11111)
        },0)
      },
      //获取区域
      async getAllArea() {
        let res = await are()
        if (res.code === 0) return this.areaList = res.data
      },
      disabledDate(){

      },
      //获取所属门店
      async getShopList() {
        let data = {}
        data.supplierTypeSecond = this.formCustom.areaId
        let res = await goshop(data)
        if (res.code === 0) return this.shopList = res.data
      },

      //获取认领店号
      async getclaimShop() {
        let data = {}
        data.supplierTypeSecond = 0
        let res = await goshop(data)
        if (res.code === 0) return this.claimShopList = res.data
      },

      //账户
      async getAccount() {
        let data = {}
        data.shopNumber = this.$store.state.user.userData.shopId
        let res = await goAccountList(data)
        if (res.code === 0) {
          if(res.data.length>0){
            this.accountList = res.data
          }
        }
      },

      //获取业务类别
      async getsubjectType() {
        let res = await gosubjectType()
        if (res.code === 0) return this.businessList = res.data
      },

      //获取科目
      async getSubject() {
        let res = await getSubjectType()
        if (res.code === 0) {
          this.subJectList = res.data
          // console.log(this.subJectList,1111)
          this.formCustom.mateAccountCode = res.data[0].id
        }
      },
      //切换区域清除数据
      async changeArea() {
        this.formCustom.shopId = ''
        this.formCustom.shopCode = ''
        let data = {}
        data.supplierTypeSecond = this.formCustom.areaId
        let res = await goshop(data)
        if (res.code === 0) return this.shopList = res.data
      },

      //切换门店刷新店号
      getShopCode(value) {
        if (!value) return
        let shopArr = this.shopList.filter(item => item.id == value)
        let code = shopArr[0].code
        this.$set(this.formCustom, 'shopCode', code)
      },

      //切换账户
      changeAccount(value) {
        if (!value) return
        let shopArr = this.accountList.filter(item => item.id == value)
        this.$set(this.formCustom, 'accountName', shopArr[0].accountCode)
        this.$set(this.formCustom, 'bankName', shopArr[0].bankName)
      },

      //清空校验
      handleReset() {
        this.$refs.formCustom.resetFields();
      },

      //保存
      save() {
        this.$refs.formCustom.validate(async (valid) => {
          if (valid) {
            let req = {...this.formCustom}
            req.createTime = moment(req.createTime).format("YYYY-MM-DD HH:mm:ss")
            let res = await changeSave(req)
            if (res.code === 0) {
              this.$Message.success('修改成功')
              this.modalShow = false
              this.$emit('getNewList', {})
              this.$emit("update")
            }
          }
        })
      },
      //  返回
      back(){
        this.modalShow=false
        this.$emit("update")
      }
    }

  };
</script>

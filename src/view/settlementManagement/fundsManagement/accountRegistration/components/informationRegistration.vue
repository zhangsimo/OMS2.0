<template>
  <Modal v-model="information" title="账户信息登记" width="750">
    <Form :model="ChangeData"  :label-width="90"  ref="ModelValidate" :rules="ruleValidate">
      <Row>
        <Col span="12">
          <FormItem label="所属区域：" prop="areaId">
            <Select v-model="ChangeData.areaId" style="width:200px" @on-change = 'changeArea'>
              <Option v-for="item in Branchstore" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="所属门店：" prop="shopId">
            <Select v-model="ChangeData.shopId" style="width:200px" @on-change = 'changeShop'>
              <Option v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="所属店号：" prop="shopCode">
            <Input class="w200" v-model="ChangeData.shopCode" disabled></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="账户：" prop="accountName">
            <Input class="w200" v-model="ChangeData.accountName" ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="账号：" prop="accountCode">
            <Input class="w200" v-model="ChangeData.accountCode" ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="开户行：" prop="bankName">
            <Input class="w200" v-model="ChangeData.bankName" ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="对应科目：" prop="mateAccountName">
            <Input class="w300 mr15" v-model="ChangeData.mateAccountName" disabled></Input>
            <Button @click="openSubject">选择</Button>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="连锁待分配款项显示门店：">
            <Input class="w300 mr15" v-model="ChangeData.shopList" disabled></Input>
            <Button @click="openStoreModal">选择</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="informationSave" class="mr10">保存</Button>
      <Button type="default" @click="informationHidden">返回</Button>
    </div>
    <div>
      <!--会计科目弹框-->
      <accounting-subject ref="subjectModal" @ChildContent="GetContent"></accounting-subject>
      <!--显示门店弹框-->
      <store-alocated ref="StoreModal" @TreeValue="getTreeValue"></store-alocated>
    </div>
  </Modal>
</template>

<script>
  import { are , goshop } from '@/api/settlementManagement/fundsManagement/capitalChain'
  import accountingSubject from './components/accountingSubject'
  import StoreAlocated from './components/StoreAlocated'
  import { findListPageAll , addData , updateData , deleterowData } from '@/api/settlementManagement/fundsManagement/accountRegistration'


  export default {
        name: "informationRegistration",
        components: {
          accountingSubject,
          StoreAlocated
        },
        props:{
          ChangeData:{
            type: Object,
            required: true
          }
        },
        data(){
          return {
            ruleValidate:{
              areaId:[{ required: true, message: "请选择", trigger: 'change' }],
              shopId:[{ required: true, message: "请选择", trigger: 'change' }],
              // shopCode:[{ required: true, message: '必填', trigger: 'blur' }],
              accountName:[{ required: true, message: '必填', trigger: 'blur' }],
              accountCode:[{ required: true, message: '必填', trigger: 'blur' }],
              bankName:[{ required: true, message: '必填', trigger: 'blur' }],
              mateAccountName:[{ required: true, message: '必填', trigger: 'change' }],
            }, //表单校验
            information: false,
            Branchstore: [{id:"0" ,companyName:'全部'}], //区域数组
            shopListArr: [{id: "0" , name:'全部'}], //门店数组
            subjectData: '', //保存子组件的内容
          }
        },
        methods: {
          //保存
          informationSave(){
            this.$refs.ModelValidate.validate((valid) => {
              if (valid) {
                if(this.ChangeData.id){
                  alert("编辑")
                  this.information = true;
                } else {
                  alert("新增")
                  let data = this.ChangeData;
                  console.log(data)
                  addData(data).then(res => {
                    if(res.code == 0){
                      this.$Message.success(' 保存成功! ');
                    }
                  })
                  this.information = true;
                }
              } else {
                this.$Message.error(' *为必填项! ');
              }
            })
          },

          //会计科目弹框
          openSubject(){
            this.$refs.subjectModal.subjectModelShow = true;
          },

          //显示门店弹框
          openStoreModal(){
            this.$refs.StoreModal.StoreAlocatedShow = true;
          },

          //获取子组件会计科目的内容
          GetContent(content){
            // console.log(content)
            this.subjectData = content;
            this.ChangeData.mateAccountName = content.titleName;
          },

          //获取子组件显示门店
          getTreeValue(value){
          let newArr = value.map(item => {
              return item.title
            })
            this.ChangeData.shopList = newArr.toString().replace(",",";");
            // console.log(newArr.toString().replace(",",";"))
          },

          //获取全部地址
          async getAllAre(){
            let res = await are()
            if (res.code === 0){
              this.Branchstore = [...this.Branchstore ,...res.data]
            }
          },

          //获取门店
          async getShop(){
            let data ={}
            data.supplierTypeSecond = this.ChangeData.areaId;
            this.shopListArr = [{id:"0" , name:'全部'}]
            let res = await goshop(data)
            if (res.code === 0) {
              this.shopListArr = [...this.shopListArr , ...res.data]
              this.$nextTick( () => {
                this.ChangeData.shopId = this.$store.state.user.userData.shopId
              })
              if (this.$store.state.user.userData.shopkeeper != 0){
                // this.getThisArea()//获取当前门店地址
              }
            }
          },

          //切换地址重新调取门店接口
          changeArea(val){
            // console.log(val)
            if (this.$store.state.user.userData.shopkeeper == 0) {
              // this.ChangeData.shopId = "0";
              this.getShop()
            }
          },

          //所属门店改变
          changeShop(val){
            console.log(val)
            console.log(this.shopListArr)
          },

          //返回
          informationHidden(){
            this.information = false;
            this.$refs.ModelValidate.resetFields();
          },
        },
      mounted(){
        this.getAllAre() //获取区域
        this.getShop()  //获取门店
      },
    // watch:{
    //   newList:{
    //     handler(o ,v){
    //       console.log(o , 123)
    //     },
    //     deep:true
    //   }
    // }

    }
</script>

<style scoped>

</style>

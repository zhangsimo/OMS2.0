<template>
  <Modal v-model="information" title="账户信息登记" width="750">
    <Form :model="ChangeData" :label-width="90" ref="ModelValidate" :rules="ruleValidate">
      <Row>
        <Col span="12">
          <FormItem label="所属区域：" prop="areaId">
            <Select v-model="ChangeData.areaId" style="width:200px" @on-change='changeArea' label-in-value>
              <Option v-for="item in Branchstore" :value="item.id" :key="item.id">{{ item.companyName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="所属门店：" prop="shopNumber">
            <Select v-model="ChangeData.shopNumber" style="width:200px" @on-change='changeShop' label-in-value>
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
            <Input class="w200" v-model="ChangeData.accountName"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="账号：" prop="accountCode">
            <Input class="w200" v-model="ChangeData.accountCode"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="开户行：" prop="bankName">
            <Input class="w200" v-model="ChangeData.bankName"></Input>
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
            <Input class="w300 mr15" v-model="ChangeData.shopListName" disabled></Input>
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
  import {are, goshop} from '@/api/settlementManagement/fundsManagement/capitalChain'
  import accountingSubject from './components/accountingSubject'
  import StoreAlocated from './components/StoreAlocated'
  import {
    findListPageAll,
    addData,
    updateData,
    deleterowData,
    findAreaShopList
  } from '@/api/settlementManagement/fundsManagement/accountRegistration'


  export default {
    name: "informationRegistration",
    components: {
      accountingSubject,
      StoreAlocated
    },
    props: {
      ChangeData: {
        type: Object,
        required: true
      }
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
        ruleValidate: {
          areaId: [{required: true, message: "请选择", trigger: 'change'}],
          shopNumber: [{required: true, message: "请选择", trigger: 'change'}],
          shopCode: [{required: true, message: '必填', trigger: 'change'}],
          accountName: [{required: true, message: '必填', trigger: 'blur'}],
          accountCode: [{required: true, message: '只能输入数字且不能为空', validator: NumberValue, trigger: 'blur'}],
          bankName: [{required: true, message: '必填', trigger: 'blur'}],
          mateAccountName: [{required: true, message: '必填', trigger: 'change'}],
        }, //表单校验
        information: false,
        Branchstore: [{id: "0", companyName: '全部'}], //区域数组
        shopListArr: [{id: "0", name: '全部'}], //门店数组
        subjectData: '', //保存子组件的内容
        shopName: '',//所属门店公司名称
        area: '',//所属区域名称
        // mateAccountCode: '', //对应科目code
        shopList: [], //给后端发的shopList格式
        TreeData: [],//树
      }
    },
    methods: {
      //保存
      informationSave() {
        this.$refs.ModelValidate.validate((valid) => {
          if (valid) {
            if (this.ChangeData.id) {
              let data = this.ChangeData;
              if (this.shopList.length > 0) {
                data.shopList = this.shopList;
              }
              let dataShopList=data.shopList
              let dataShopListArr=new Array()
              if(data.shopList.length>0){
                for(var i=0;i<dataShopList.length;i++){
                  let dataL={}
                  dataL.id=dataShopList[i]
                  dataL.shopName=data.shopListName.split(",")[i]
                  dataShopListArr.push(dataL)
                }
                data.shopList=Array.from(new Set(dataShopListArr))
              }
              updateData(data).then(res => {
                if (res.code == 0) {
                  this.$Message.success('修改成功！')
                  this.information = false;
                  this.shopList = [];
                  this.$parent.getList()
                } else {
                  this.information = true;
                  this.shopList = [];
                }
              })
              this.information = true;
            } else {
              let data = this.ChangeData;
              data.shopList = this.shopList;
              data.shopNumber = data.shopNumber ? data.shopNumber : this.$store.state.user.userData.shopId;
              addData(data).then(res => {
                if (res.code == 0) {
                  this.$Message.success('新增成功! ');
                  this.information = false;
                  this.shopList = [];
                  this.$parent.getList()
                } else {
                  this.shopList = [];
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
      openSubject() {
        this.$refs.subjectModal.subjectModelShow = true;
      },

      //显示门店弹框
      openStoreModal() {
        this.$refs.StoreModal.StoreAlocatedShow = true;
      },

      //获取子组件会计科目的内容
      GetContent(content) {
        // console.log(content)
        this.subjectData = content;
        this.ChangeData.mateAccountName = content.titleName;
        this.ChangeData.mateAccountCode = content.titleCode;
      },

      //获取子组件显示门店
      getTreeValue(value) {
        let newArr = value.map(item => {
          return item.title
        })
        this.shopList = value.map(item => {
          return item.id;
        })
        this.ChangeData.shopListName = newArr.toString().replace(",", ";");
        this.shopList=Array.from(new Set(this.shopList))
        // console.log(this.shopList,value,1111)
      },

      //获取全部地址
      async getAllAre() {
        let res = await are()
        if (res.code === 0) {
          this.Branchstore = [...this.Branchstore, ...res.data]
        }
      },

      //当前非管理员状态情况下获取门店地址
      async getThisArea() {
        let data = {}
        data.shopkeeper = 1
        data.shopNumber = this.$store.state.user.userData.shopId
        data.tenantId = this.$store.state.user.userData.tenantId
        let res = await are(data)

        if (res.code === 0) {
          this.ChangeData.areaId = res.data[0].id
        }
      },

      //获取门店
      async getShop() {
        let data = {}
        data.supplierTypeSecond = this.ChangeData.areaId ? this.ChangeData.areaId : '0';
        // console.log(this.ChangeData.areaId)
        this.shopListArr = [{id: "0", name: '全部'}]
        let res = await goshop(data)
        if (res.code === 0) {
          this.shopListArr = [...this.shopListArr, ...res.data]
          this.$nextTick(() => {
            this.ChangeData.shopNumber = this.$store.state.user.userData.shopId;
            if (this.ChangeData.shopNumber) {
              this.ChangeData.shopCode = this.shopListArr.filter(item => item.id == this.ChangeData.shopNumber)[0].code;
              this.ChangeData.shopName = this.shopListArr.filter(item => item.id == this.ChangeData.shopNumber)[0].name;
            }
          })
          if (this.$store.state.user.userData.shopkeeper != 0) {
            this.getThisArea()//获取当前门店地址
          }
        }
      },

      //切换地址重新调取门店接口
      changeArea(val) {
        this.ChangeData.area = val.label;
        if (this.$store.state.user.userData.shopkeeper == 0) {
          this.ChangeData.shopNumber = "0";
          this.getShop()
        }
      },

      //所属门店改变
      changeShop(val) {
        if (val) {
          this.ChangeData.shopName = val.label;
          let arr = this.shopListArr.filter(item => item.id == val.value)
          // console.log(arr)
          this.ChangeData.shopCode = arr[0].code;
          // console.log(this.ChangeData.shopCode)
        } else {
          this.ChangeData.shopCode = ''
        }

      },

      //返回
      informationHidden() {
        this.information = false;
        this.$parent.getList();
        // this.$refs.ModelValidate.resetFields();
      },

      //连锁待分配款项显示门店_Pass
      getTreeList() {
        let params = {};
        findAreaShopList(params).then(res => {
          if (res.code == 0) {
            // console.log(res.data)
            res.data.map(item => {
              this.TreeData.push(item);
              item.childs.map(item => {
                this.TreeData.push(item);
                item.childs.map(item => {
                  this.TreeData.push(item);
                })
              })
            })
          }
        })
      }
    },
    mounted() {
      this.getAllAre() //获取区域
      this.getShop()  //获取门店
      this.getTreeList() //子组件的数据接口
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

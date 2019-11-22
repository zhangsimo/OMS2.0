<template>
 <Form :label-width="100"  :model='data' :rules="rules" ref="form">
   <div class="header-box clearfix">
          <span class="isDisabeld">
          是否禁用
          <Checkbox v-model="data.isDisabled"></Checkbox>
        </span>
     <span class="isDisabeld">
          供应商
          <Checkbox v-model="data.isSupplier"></Checkbox>
        </span>
     <span class="isDisabeld">
          客户
          <Checkbox v-model="clinet" disabled></Checkbox>
        </span>
   </div>
<!--   切换栏-->
   <div class="tabList">
     <Tabs type="card">
       <TabPane label="基本信息">
         <div style="display: flex">
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='客户属性:'  prop="guestProperty">
               <Select v-model="data.guestProperty" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00105" :value="item.itemCode" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
             <FormItem label='客户简称:' prop="shortName">
               <Input v-model='data.shortName' style="width: 180px" ></Input>
             </FormItem>
           </div>
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='结算方式:' prop="settTypeId" >
               <Select v-model="data.settTypeId" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00106" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
             <FormItem label='票据类型:' prop="billTypeId">
               <Select v-model="data.billTypeId" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00107" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
           </div>
         </div>
         <FormItem label='客户全称:' prop="fullName">
           <Input v-model='data.fullName' style="width: 380px" ></Input>
         </FormItem>
         <div style="display: flex">
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='联系人:' prop="contactor">
               <Input v-model='data.contactor' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='省份:' prop="provinceId">
               <Select v-model="data.provinceId" style="width:180px" class="mr10">
                 <Option v-for="item in provincearr" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
               </Select>
             </FormItem>
           </div>
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='联系人手机:' prop="contactorTel">
               <Input v-model='data.contactorTel' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='城市:' prop="contactorTel">
               <Select v-model="data.cityId" style="width:180px" class="mr10">
                 <Option v-for="item in provincearr" v-if="data.provinceId==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
               </Select>
             </FormItem>
           </div>
         </div>
         <FormItem label='地址:' >
           <Input v-model='data.streetAddress' style="width: 380px" ></Input>
         </FormItem>
         <div style="display: flex">
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='业务员:' >
               <Input v-model='data.salesman' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='信用等级:' >
               <Select v-model="data.tgradeName" style="width:180px" class="mr10">
                 <Option v-for="item in dataList.CS00112" :value="item.itemCode" :key="item.id">{{ item.itemName }}</Option>
               </Select>
             </FormItem>
             <FormItem label='电话:' >
               <Input v-model='data.tel' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='备注:' >
               <Input v-model='data.remark' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='一级分类:' prop="guestType">
               <Select v-model="data.guestType" style="width:180px" class="mr10">
                 <Option v-for="item in treelist" v-if="item.lever == 1" :value="item.id" :key="item.code">{{ item.title }}</Option>
               </Select>
             </FormItem>
           </div>
           <div style="flex-flow: row nowrap;width: 100%" >
             <FormItem label='业务员手机:' >
                 <Input v-model='data.salesmanTel' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='信誉额度:' >
                 <Input v-model='data.creditLimit' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='QQ/微信:' >
               <Input v-model='data.instantMsg' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='默认物流:' >
               <Input v-model='data.defaultLogistics' style="width: 180px" ></Input>
             </FormItem>
             <FormItem label='二级分类:' prop="guestTypeFloor">
               <Select v-model="data.guestTypeFloor" style="width:180px" class="mr10">
                 <Option v-for="item in treelist "  v-if="data.guestType == item.parentId" :value="item.id" :key="item.id">{{ item.title }}</Option>
               </Select>
             </FormItem>
           </div>
         </div>
         <span style="margin-left: 100px">
          <Checkbox v-model="data.isNeedPack"></Checkbox>
           需求打包发货
        </span>
       </TabPane>
       <TabPane label="其他信息">
         <div>
           <p style="margin-bottom: 10px">财务信息</p>
             <div>
             <FormItem label='银行账号:' >
               <Input v-model='data.accountBankNo' style="width: 450px" ></Input>
             </FormItem>
             <FormItem label='开户银行:' >
               <Input v-model='data.accountBank' style="width: 450px" ></Input>
             </FormItem>
             <div style="display: flex">
               <div style="flex-flow: row nowrap;width: 100%" >
                 <FormItem label='纳税人编码:' prop="phone">
                   <Input  v-model='data.taxpayerCode' style="width: 150px" ></Input>
                 </FormItem>
               </div>
               <div style="flex-flow: row nowrap;width: 100%" >
                 <FormItem label='纳税人电话:' prop="phone">
                   <Input v-model='data.taxpayerTel' style="width: 150px" ></Input>
                 </FormItem>
               </div>
             </div>
             <FormItem label='纳税人名称:' >
               <Input v-model='data.taxpayerName' style="width: 450px" ></Input>
             </FormItem>
           </div>
           <p style="margin-bottom: 10px">其他信息</p>
           <FormItem label='网址:' >
             <Input v-model='data.website' style="width: 450px" ></Input>
           </FormItem>
           <FormItem label='传真:' >
             <Input v-model='data.fax' style="width: 450px" ></Input>
           </FormItem>
           <FormItem label='经营地址:' >
             <Input v-model='data.addr' style="width: 450px" ></Input>
           </FormItem>
           <FormItem label='会员卡号:' >
             <Input v-model='data.memCarNo' style="width: 450px" ></Input>
           </FormItem>
           <div style="display: flex">
             <div style="flex-flow: row nowrap;width: 100%" >
               <FormItem label='会员等级:' prop="phone">
                 <Input  v-model='data.memLevelId' style="width: 150px" ></Input>
               </FormItem>
             </div>
             <div style="flex-flow: row nowrap;width: 100%" >
               <FormItem label='邮政编码:' prop="phone">
                 <Input  v-model='data.postalCode' style="width: 150px" ></Input>
               </FormItem>
             </div>
           </div>
         </div>
       </TabPane>
       <TabPane label="收货地址">
         <div>
          <div class="place">
            <a class="mr10" @click="addPlace"><Icon custom="iconfont iconxinzengicon icons"/> 新增 </a>
            <a class="mr10" @click="changeplage"><Icon custom="iconfont iconbianjixiugaiicon icons"/> 修改</a>
            <a class="mr10" @click="deletPlace"><Icon custom="iconfont iconlajitongicon icons"/> 删除</a>
          </div>
           <Table  border height="400"  size="small" highlight-row   :stripe="true" :columns="columns" :data="placeList" @on-current-change="selection"></Table>
         </div>
         <Modal v-model="newplace" :title="title" width="700">
           <Newplace :data="oneNew" :place="provincearr" ref="child"></Newplace>
           <div slot='footer'>
             <Button type='primary' @click="addplaceSure">确定</Button>
             <Button type='default' @click='newplace = false'>取消</Button>
           </div>
         </Modal>
       </TabPane>
       <TabPane label="关联客户">
         <div>
           <div class="place">
             <span> 客户名称:</span>
             <Input type="text" v-model="customerName" class="staff-name mr10"></Input>
             <Button type="warning" class="w90 mr10"  @click="queryClientList">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
             </Button>
             <Button type="warning" class="w90 mr10" @click="joinClientList">
             <span class="center">
               <Icon custom="iconfont iconxuanzetichengchengyuanicon" />选入
              </span>
             </Button>
           </div>
           <div>
             <Table  size="small" :loading="loading1"  border :stripe="true" :columns="columns1" :data="relevanceClient" height="200" @on-selection-change ='pitchOnClient' ></Table>
             <div class="clearfix" style="margin-bottom: 10px">
             <Page
               class-name="page-con"
               :current="page.num"
               :total="page.total"
               :page-size="page.size"
               @on-change="changePage1"
               @on-page-size-change="changeSize1"
               show-sizer
               show-total
               show-elevator
               style="float: right;margin-top: 10px"
               class="mr10"
             ></Page>
             </div>
             <div>
              <div class="place">
                <span>已选择的客户</span>
                <Button class="mr10 w90" @click="deletAllClient">
                <span class="center">
                  <Icon custom="iconfont iconlajitongicon icons" />删除
                </span>
                </Button>
              </div>
               <Table size="small" border :stripe="true" :columns="columns2" :data="relevanceClientShow" height="200" @on-selection-change="deleteClient"></Table>
             </div>
           </div>
         </div>
       </TabPane>
       <TabPane label="开票信息">
         <div>
           <div class="place">
             <a class="mr10" @click="addInoice"><Icon custom="iconfont iconxinzengicon icons"/> 新增 </a>
             <a class="mr10" @click="changeBank"><Icon custom="iconfont iconbianjixiugaiicon icons"/> 修改</a>
             <a class="mr10" @click="deletBank"><Icon custom="iconfont iconlajitongicon icons"/> 删除</a>
           </div>
           <Table size="small" border :stripe="true" highlight-row :columns="columns3" :data="invoice" @on-current-change="pitchOnBank"></Table>
         </div>
         <Modal v-model="newInoiceShow" title="新增开票">
           <AddInoice :data="addInoiceOne"></AddInoice>
           <div slot='footer'>
             <Button type='primary' @click="addNewBank">确定</Button>
             <Button type='default' @click='newInoiceShow = false'>取消</Button>
           </div>
         </Modal>
       </TabPane>
     </Tabs>
   </div>
 </Form>
</template>

<script>
  import Newplace from "./Newplace";
  import AddInoice from "./AddInoice";
  import {getDigitalDictionary ,getCustomerInformation} from '@/api/system/essentialData/clientManagement'

  export default {
        name: "Data",
        components:{
            Newplace,
            AddInoice
        },
        props:{
            data:'',
            provincearr:'',
            treelist:''
        },
        data(){
            return {
                tree: this.treelist,
                clinet:true,//是否客户 //是
                list:[
                    {
                        label: 123,
                        value:1
                    },
                    {
                        label: 456,
                        value:2
                    }
                ],
                columns:[
                    {
                        title: '收货单位',
                        align: 'center',
                        key: 'receiveCompName'
                    },
                    {
                        title: '收货人',
                        align: 'center',
                        key: 'receiveMan',
                        minWidth: 80
                    },
                    {
                        title: '联系方式',
                        align: 'center',
                        key: 'contactor',
                    },
                    {
                        title: '收货地址',
                        align: 'center',
                        key: 'address',
                    },
                    {
                        title: '默认',
                        key: 'id',
                        align: 'isDefault',
                        render: (h, params) => {
                            let text = ''
                            params.row.isDefault ? text = '是' : text='否'
                            return h('span',{} , text)
                        }
                    },
                ],
                columns1:[
                    {
                        title: '序号',
                        align: 'center',
                        type:'index'
                    },
                    {
                        key: 'id',
                        align: 'center',
                        type:'selection',
                        width:40
                    },
                    {
                        title: '客户简称',
                        align: 'center',
                        key: 'shortName',
                        minWidth: 80
                    },
                    {
                        title: '客户全称',
                        align: 'center',
                        key: 'fullName',
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: 'createTime',
                    },

                ],
                columns2:[
                    {
                        title: '序号',
                        align: 'center',
                        type:'index'
                    },
                    {
                        key: 'id',
                        align: 'center',
                        type:'selection',
                        width:40
                    },
                    {
                        title: '客户简称',
                        align: 'center',
                        key: 'shortName',
                        minWidth: 80
                    },
                    {
                        title: '客户全称',
                        align: 'center',
                        key: 'fullName',
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: 'createTime',
                    },

                ],
                columns3:[
                    {
                        title: '序号',
                        align: 'center',
                        type:'index'
                    },
                    {
                        title: '开票名称',
                        align: 'center',
                        key:'taxpayerName',

                    },
                    {
                        title: '税号',
                        align: 'center',
                        key:'taxpayerCode'
                    },
                    {
                        title: '地址电话',
                        align: 'center',
                        key:'taxpayerTel'
                    },
                    {
                        title: '开户行及账号',
                        align: 'center',
                        key:'accountBankNo'
                    },
                ],
                relevanceClientShow:[],
                invoice:[],
                page:{
                    num:1,
                    size:10,
                    total:0
                },
                placeList:[],
                newplace:false,  //收货地址
                newInoiceShow:false, //开票
                loading:true,
                loading1:true,
                title:'新增用户',
                oneNew:{},
                relevanceClient:[],
                addInoiceOne:{},
                rules:{
                    guestProperty:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                    shortName:[
                        {required: true,message:' ', trigger: 'blur'}
                    ],
                    settTypeId:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                    billTypeId:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                    fullName:[
                        {required: true,message:' ', trigger: 'blur'}
                    ],
                    contactor:[
                        {required: true,message:' ', trigger: 'blur'}
                    ],
                    provinceId:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                    contactorTel:[
                        {required: true,message:' ', trigger: 'blur'}
                    ],
                    cityId:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                    guestType:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                    guestTypeFloor:[
                        {required: true,message:' ', trigger: 'change'}
                    ],
                },
                dataList:'',
                id:0,
                bankId:0,
                customerName:'',//客户名称
                pitchOnClientList:[], //选中关联客户
                deleteOneClient:[],//获取删除项
                pitchOneBank:[],
            }
        },
      mounted(){
          console.log(this.data.guestLogisticsVOList,471)
          console.log(this.data.guestVOList,472)
          console.log(this.data.guestTaxpayerVOList,473)
          this.placeList = this.data.guestLogisticsVOList || []
          this.relevanceClientShow =this.data.guestVOList || []
          this.invoice =this.data.guestTaxpayerVOList || []
          this.getList()
            this.getClienlist()
      },
        methods:{
            //获取关联客户
            async getClienlist(){
                this.loading1 =true
                let data = {}
                data.page = this.page.num -1
                data.size = this.page.size
                data.fullName = this.customerName
                let res = await getCustomerInformation(data)
                if (res.code == 0){
                    this.loading1 = false
                    this.relevanceClient = res.data.content
                    this.page.total = res.data.totalElements
                }
            },
            //获取客户属性
          async getList(){
                 let data ={}
                data =['CS00105','CS00106','CS00107','CS00112']
              let res = await getDigitalDictionary(data)
              console.log(res)
              if(res.code == 0){
                  this.dataList = res.data
              }

            },
            //清除内容
            resetFields() {
                this.$refs.form.resetFields()
            },
            //校验表单
            handleSubmit (callback) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        callback && callback()
                    } else {
                        this.$Message.error('带*为必填');
                    }
                })
            },
            // 获取新增地址
            selection( item){
                this.oneNew = item
                this.oneNew.isDefault == 1 ? this.oneNew.isDefault = true : this.oneNew.isDefault = false
            },
            //新增地址表单校验
            addplaceSure(){
              this.$refs.child.handleSubmit( ()=> {
                  if( this.placeList.some( item => item.id ==  this.oneNew.id)){
                      this.oneNew.isDefault ? this.oneNew.isDefault = 1 : this.oneNew.isDefault = 0
                    let idx = this.placeList.findIndex( item => item.id == this.oneNew.id)
                      this.$set(this.placeList ,idx , this.oneNew)
                      this.data.guestLogisticsVOList = this.placeList
                      this.newplace = false
                      this.oneNew ={}
                  }else {
                      this.oneNew.isDefault ? this.oneNew.isDefault = 1 : this.oneNew.isDefault = 0
                      let newarr = {}
                      newarr = JSON.parse(JSON.stringify(this.oneNew))
                      newarr.id = this.id
                      this.id++
                      this.placeList.push(newarr)
                      this.data.guestLogisticsVOList = this.placeList
                      this.newplace = false
                  }
               })
            },
            //修改地址表单
            changeplage(){
                console.log(this.oneNew)
              if (Object.keys(this.oneNew).length == 0  ){
              this.$Message.error('至少选项一条地址')
              return false
              }
              if(this.oneNew.cityId == undefined || this.oneNew.provinceId == undefined){
                  this.$Message.error('至少选项一条地址')
                  return false
              }
              this.newplace =true
            },
            //新增地址
            addPlace(){
                this.oneNew ={}
                this.newplace =true
            },
            //删除地址
            deletPlace(){
                if (Object.keys(this.oneNew).length == 0){
                    this.$Message.error('至少选项一条地址')
                    return false
                }
                this.placeList = this.placeList.filter( item => item.id !=this.oneNew.id)
                this.data.guestLogisticsVOList = this.placeList
                this.oneNew ={}
            },
            //查询关联客户
            queryClientList(){
                this.getClienlist()
            },
            //查询关联客户分页
            changePage1(data){
                this.page.num = data
                this.getClienlist()
            },
            //查询关联客户切换条数
            changeSize1(){
                this.page.num = 1
                this.page.size = data
                this.getClienlist()
            },
            //选中查询关联客户
            pitchOnClient(selection){
                this.pitchOnClientList = selection
            },
            //加入查询
            joinClientList(){
                let can = true
                this.pitchOnClientList.forEach( item => {
                    this.relevanceClientShow.forEach( val => {
                        if (item.id == val.id){
                            can =  false
                        }
                    })
                })
                if(can){
                 this.relevanceClientShow =  [...this.relevanceClientShow , ...this.pitchOnClientList]
                 this.data.guestVOList = this.relevanceClientShow
                } else{
                    this.$Message.error('选择重复')
                }
            },
            //获取删除关联客户
            deleteClient(selection){
                this.deleteOneClient = selection
            },
            //删除
            deletAllClient(){
                let newarr =[]
                this.deleteOneClient.forEach( item => {
                    this.relevanceClientShow.forEach( val => {
                        if (val.id !== item.id){
                            newarr.push(val)
                        }
                    })
                })
                this.relevanceClientShow = newarr
                this.data.guestVOList = this.relevanceClientShow
            },
            //新增银行
            addInoice(){
              this.addInoiceOne ={}
              this.newInoiceShow =true
            },
            // 确认新增银行
            addNewBank(){
                console.log(this.addInoiceOne)
                if( this.invoice.some( item => item.bankId ==  this.addInoiceOne.bankId)){
                    let idx = this.invoice.findIndex( item => item.bankId == this.addInoiceOne.bankId)
                    console.log(idx)
                    this.$set(this.invoice ,idx , this.addInoiceOne)
                    this.data.guestTaxpayerVOList = this.invoice
                    this.newInoiceShow =false
                    this.addInoiceOne ={}
                }else {
                    let newarr = {}
                    newarr = JSON.parse(JSON.stringify(this.addInoiceOne))
                    newarr.bankId = this.bankId
                    this.bankId++
                    this.invoice.push(newarr)
                    console.log(newarr,638)
                    this.data.guestTaxpayerVOList = this.invoice
                    this.newInoiceShow =false
                }
            },
            //选中银行
            pitchOnBank(selection){
                this.addInoiceOne = selection
            },
            //修改银行
            changeBank(){
                if (Object.keys(this.addInoiceOne).length == 0){
                    this.$Message.error('至少选项一条地址')
                    return false
                }
                this.newInoiceShow =true
            },
            //删除银行
            deletBank(){
                if (Object.keys(this.addInoiceOne).length == 0){
                    this.$Message.error('至少选项一条地址')
                    return false
                }
                this.invoice = this.invoice.filter( item => item.bankId !=this.addInoiceOne.bankId)
                this.data.guestLogisticsVOList = this.invoice
                this.addInoiceOne ={}
            }
        }
    }
</script>

<style scoped lang="less">
.isDisabeld {
  float: right;
}
.place{
  line-height: 40px;
  padding-left: 10px;
  border: 1px solid #eee;
}
.staff-name {
  width: 200px;
}
</style>
<style scoped>
.tabList>>>.ivu-form-item {
  margin-bottom: 10px;
}

</style>

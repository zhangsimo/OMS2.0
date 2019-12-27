<template>
    <div class="logistics-box">
      <div class="logistics-header">
        <span>查询项:</span>
        <Select v-model="logisticsSelect" style="width:150px" class="mr10">
          <Option v-for="item in logisticList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-model="logisticsInquirts" class="mr10" placeholder="输入查询条件" style="width: 150px" />
        <span>状态:</span>
        <Select v-model="logisticsState" style="width:100px" class="mr10">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span>类型:</span>
        <Select v-model="logisticsType" style="width:100px" class="mr10">
          <Option v-for="item in typeList " :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
        </Select>
        <span>结算方式:</span>
        <Select v-model="clearing" style="width:100px" class="mr20">
          <Option v-for="item in clearingList" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>
        </Select>
        <Button type="warning" class="w90 mr10" @click="inquireLogistics">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
        </Button>
        <Button class="w90 mr10" @click="add">
              <span class="center">
                <Icon type="md-add"/>新增
              </span>
        </Button>
        <Button class="w90 mr10" @click="change">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
        </Button>
      </div>
      <div style="overflow: hidden;overflow-x: scroll;">
    <div class="logisticsTable">
      <Table class="table-highlight-row"  highlight-row  :columns="columns" :data="list" stripe border :loading="Loading" @on-current-change="selection"></Table>
    </div>
      </div>
      <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
       class="mr10"  @on-change="selectNum" @on-page-size-change="selectPage"></Page>

<!--      新增修改-->
      <Modal v-model='modalShow' :title="title" width="700px">
        <AddLogistics :data ='logisticsOne' ref="child" :provincearr="provinceArr" :typelist="newTypeList" :clearinglist="newClearingList"></AddLogistics>
        <div slot='footer'>
          <Button type='primary' @click="addNewSure">确定</Button>
          <Button type='default' @click="cancel">取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import AddLogistics from "./AddLogistics";
  import {getLogisticsList,getNewLogistics} from  "@/api/system/essentialData/logistics"
  import {area} from '@/api/lease/registerApi'
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'

    export default {
        name: "logistics",
        components:{
            AddLogistics
        },
        data(){
            return {
                logisticsInquirts:'',
                logisticsSelect:'fullName', //查询项
                logisticList:[
                    {label:'物流快递名称' , value:'fullName'},
                    {label:'物流快递编码' , value:'code'},
                    {label:'联系人' , value:'contactor'},
                    {label:'联系电话' , value:'contactorTel'},
                    {label:'联系地址' , value:'streetAddress'},
                    {label:'公司电话' , value:'tel'},
                ],
                stateList:[
                    {label:'全部', value: -1},
                    {label:'启用', value: 0},
                    {label:'禁用', value: 1},
                ],
                typeList:[
                    {itemName:'全部' ,itemCode:-1}
                ],
                clearingList:[
                    {itemName:'全部' ,itemCode:-1}
                ], //结算方式数据
                logisticsState:-1,//状态值
                logisticsType:-1,//类型值
                clearing:-1,//结算方式
                columns:[
                    {
                        title: '选择',
                        key: 'id',
                        width: 70,
                        align: 'center',
                        render: (h, params) => {
                            return h('span',{class:'table-radio'})
                        }
                    },
                    {
                        title: '序号',
                        align: 'center',
                        type: 'index',
                        key: 'userName'
                    },
                    {
                        title: '物流快递名称',
                        align: 'center',
                        key: 'fullName',
                        minWidth: 40
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: '',
                        render:(h ,params)=>{
                            let text = params.row.isDisabled == 0 ? '启用' : '禁用'
                            return h('span' ,{}, text)
                        }
                    },
                    {
                        title: '物流快递编码',
                        align: 'center',
                        key: 'code',
                        minWidth: 40,
                    },
                    {
                        title:'业务类型',
                        align: 'center',
                        minWidth: 40,
                        key:'logisticsTypeName'
                    },
                    {
                        title:'联系人',
                        align: 'center',
                        minWidth: 40,
                        key:'contactor',
                    },
                    {
                        title:'联系电话',
                        align: 'center',
                        minWidth: 40,
                        key:'contactorTel'
                    },
                    {
                        title:'联系地址',
                        align: 'center',
                        minWidth: 40,
                        key:'streetAddress'
                    },
                    {
                        title:'结算方式',
                        align: 'center',
                        minWidth: 40,
                        key:'settTypeName',
                        // render: (h, params) => {
                        //     return h('span', {}, transTime(params.row.createTime))
                        // },
                    },
                    {
                        title:'公司电话',
                        align: 'center',
                        minWidth: 40,
                        key:'tel',
                        // render: (h, params) => {
                        //     return h('span', {}, transTime(params.row.createTime))
                        // },
                    },
                    {
                        title:'公司地址',
                        align: 'center',
                        minWidth: 40,
                        key:'propertyFeatures',
                    },
                    {
                        title:'邮编',
                        align: 'center',
                        key:'postalCode'
                    },
                    {
                        title:'开户银行',
                        minWidth: 40,
                        align: 'center',
                        key:'accountBank'
                    },
                    {
                        title:'银行账户',
                        align: 'center',
                        key:'accountBankNo'
                    },
                    {
                        title:'开户人名称',
                        align: 'center',
                        key:'accountName'
                    },
                    {
                        title:'备注',
                        align: 'center',
                        key:'remark'
                    },
                    {
                        title:'创建单位',
                        align: 'center',
                        key:'createUname'
                    },
                    {
                        title:'创建人',
                        align: 'center',
                        key:'createUid'
                    },
                    {
                        title:'创建日期',
                        align: 'center',
                        key:'createTime'
                    },
                    {
                        title:'最后修改人',
                        align: 'center',
                        key:'updateUname'
                    },
                    {
                        title:'最后修改日期',
                        align: 'center',
                        key:'updateTime'
                    },
                ],
                list:[],
                provinceArr:[], //城市
                data1:[],
                Loading:true,
                modalShow:false,
                title:'物流快递资料',
                page: {
                    size: 10,
                    num: 1,
                    total: 0
                },
                // newLoistics:{
                //   isDisabled: false,
                //     fullName:'',
                //     code:'',
                //     logisticsType:'',
                //     contactor:'' ,//联系人
                //     contactorTel:'',//练习电话
                //     streetAddress:'',
                //     settTypeId:'',
                //     tel:'',
                //     propertyFeatures:'',
                //     postalCode:'',
                //     accountBank:'',
                //     accountBankNo:'',
                //     createName:''
                // },
                logisticsOne:{},
                newTypeList:[],
                newClearingList:[],
              id:'',//点击左侧获取的id
            }
        },
        mounted(){
            //获取数据
            this.getList()
            //获取状态
            this.getStyle()
            //获取结算方式
            this.getclearing()
            //获取地址
            this.getAdress()
        },
        methods:{
            //调用接口
            getList(){
                let data = {}
                data.num = this.page.num
                data.size = this.page .size
                data[this.logisticsSelect] =this.logisticsInquirts
                data.isDisabled = this.logisticsState
                data.logisticsType = this.logisticsType
                data.settTypeId = this.clearing
                getLogisticsList(data).then( res => {
                    if(res.code == 0){
                        this.Loading =false
                    this.page.total = res.data.totalElements
                    this.list = res.data.content
                    }

                })
            },
            //获取状态 结算方式
            getStyle(){
                let data = {}
                data = ['CS00109']
                getDigitalDictionary(data).then( res => {
                    if (res.code == 0){
                        this.typeList = this.typeList.concat(res.data.CS00109)
                        this.newTypeList = res.data.CS00109
                    }
                })
            },
            //结算方式
            getclearing(){
                let data ={}
                data = ['CS00106']
                getDigitalDictionary(data).then( res => {
                    if (res.code == 0){
                        this.clearingList = this.clearingList.concat(res.data.CS00106)
                        this.newClearingList = res.data.CS00106
                    }
                })
            },
            //获取地址
            getAdress(){
                area().then(res => {
                    if(res.code == 0){
                        this.provinceArr = res.data
                    }
                })
            },
            //获取当前选中的数据
            selection(currentRow){
                this.logisticsOne = currentRow;
                this.id= currentRow.id
                // currentRow.isDisabled == 0 ? this.logisticsOne.isDisabled =true : this.logisticsOne.isDisabled = false
                this.logisticsOne.isDisabled= this.logisticsOne.isDisabled ? this.logisticsOne.isDisabled :0
            },
            add(){
                this.clear()
                this.modalShow = true
                this.getList()
            },
            change(){
              if(!this.id){
                return this.$Message.info('请先选中需要修改的物流快递信息');
              }
                this.modalShow = true
            },
            //查询
            inquireLogistics(){
                this.getList()
            },
            //切换分页条数
            selectPage(size) {
                this.page.size = size
                this.page.num = 1
                this.getList()
            },
            //分页
            selectNum(num) {
                this.page.num = num
                this.getList()
            },
            //清除表格内容
            clear(){
                this.logisticsOne = {}
                // this.logisticsOne.isDisabled = false
                this.$refs.child.resetFields()
            },
            addNewSure(){
                this.$refs.child.handleSubmit(() => {
                        let stop = this.$loading();
                    this.logisticsOne.isDisabled= this.logisticsOne.isDisabled ? this.logisticsOne.isDisabled :0
                    getNewLogistics(this.logisticsOne).then( res=> {
                        stop()
                        this.modalShow = false
                        this.getList()
                    })
                    }
                )
            },
          cancel(){
            this.$refs.child.resetFields()
            this.modalShow = false
          }

        }
    }
</script>

<style scoped lang="less">
  .logistics-box {
    background-color: #fff;
    height: 100%;
  }
.logistics-header{
  line-height: 57px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}
.logisticsTable {
  width: 3000px;
  padding: 10px;
}
</style>

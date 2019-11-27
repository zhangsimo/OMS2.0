<template>
    <div style="height:100%">
      <div class="header-box">
        <Input v-model="fasttipsTitle"  style="width: 150px" class="mr10"/>
        <Button type="warning" class="w90 mr10" @click="queryList">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
        </Button>
        <Button class="w90 mr10" @click="addClient">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
        </Button>
        <Button class="w90 mr10" @click="changeClient" >
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
        </Button>
        <Button  class="mr15" v-if="pitchSupplierOne.isDisabled == 1" @click="changeDisabled">
          <span class="center">
            <Icon custom="iconfont iconqiyongicon icons"/>启用
          </span>
        </Button>
        <Button  class="mr15"  v-else @click="changeDisabled">
          <span class="center">
            <Icon custom="iconfont iconjinzhijinyongicon icons"/>禁用
          </span>
        </Button>
      </div>
      <div class="tabeBox" >
      <div>
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="managementList" @on-current-change="pitchSupplier"></Table>
      </div>
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-sizer
          show-total
          show-elevator
          class="mr10"
        ></Page>
      </div>
<!--      客户资料-->
      <Modal v-model="clientDataShow" title="供应商资料资料"  width="850" >
        <ClientData :data="clientList" :provincearr="provinceArr" :treelist="treeDiagramList" ref="child"></ClientData>
        <div slot='footer'>
          <Button type='primary' @click="addNewSupplier">确定</Button>
          <Button type='default' @click='clientDataShow = false'>取消</Button>
        </div>
      </Modal>

    </div>
</template>

<script>
  import ClientData from './ClientData'
  import {getSupplierformation , getNewSupplier} from '@/api/system/systemSetting/storeManagement'
  import {area} from '@/api/lease/registerApi'


  export default {
        name: "CustomerData",
        components:{
            ClientData
        },
      props:{
          treeDiagramList:''
      },
        data(){
            return {
                fasttipsTitle:'',//快速查询内容
                moreQueryOne:{},
                loading: true,
                provinceArr:'',
                page:{
                    size:10,
                    num:1,
                    total:0
                },
                columns:[
                    {title:'选择',
                     align:'center',
                     key:'',
                     render:(h,params) =>{
                        return h('span',{class:'table-radio'})
                    }
                    },
                    {title: '企业号',
                     align: 'center',
                     key: 'name',
                    },
                    {title: '公司全称',
                        align: 'center',
                        key: 'name',
                    },
                    {title: '公司简称',
                        align: 'center',
                        key: 'shortName',
                    },
                    {title: '电话',
                        align: 'center',
                        key: 'tel',
                    },
                    {title: '省份',
                        align: 'center',
                        key: 'province',
                    },
                    {title: '城市',
                        align: 'center',
                        key: 'city',
                    },
                    {title: '地址',
                        align: 'center',
                        key: 'streetAddress',
                    },
                    {title: '状态',
                        align: 'center',
                        key: 'isDisabled',
                        render:(h ,params) => {
                         let txt=''
                            params.row.isDisabled == 1 ? txt='是' : txt='否'
                        return h('sapn' ,{},txt)
                        }
                    },
                    {title: '开店日期',
                        align: 'center',
                        key: 'softOpenDate',
                    },
                    {title: '建档人',
                        align: 'center',
                        key: 'recorder',
                    },
                    {title: '建档日期',
                        align: 'center',
                        key: 'recordDate',
                    },
                ],
                managementList:[],
                clientDataShow:false,
                clientList:{},
                supplierTypeOne: '', //供应商类型
                pitchSupplierOne:'',
                Pid: '',
                disableShow: true,
            }
        },
        created(){
            this.getAdress()
        },
      computed: {
          newpid() {
              return this.$store.state.user.treePid;
          }
      },
        methods:{
            //获取全部表格数据
            async getlist(){
                this.loading =true
                let data = {}
                data.page = this.page.num - 1
                data.size = this.page.size
                data.name = this.fasttipsTitle
                if (this.Pid.lever == 1){
                  data.supplierTypeFirst = this.Pid.id
                }else{
                  data.supplierTypeSecond = this.Pid.id
                }
         let res = await getSupplierformation(data)
                if (res.code == 0){
                    this.loading = false
                    this.managementList = res.data.content
                    this.page.total = res.data.totalElements
                }
            },
            //获取地址
            getAdress(){
                area().then(res => {
                    if(res.code == 0){
                        this.provinceArr = res.data
                    }
                })
            },
            //分页
            changePage(data){
                this.page.num = data
                    this.getlist()
            },
            //条数
            changeSize( data){
                this.page.num = 1
                this.page.size = data
                    this.getlist()
            },
            //搜索
            queryList(){
                this.getlist()
            },
            //选中一条信息
            pitchSupplier(currentRow){
                this.pitchSupplierOne = currentRow
            },
            //修改状态禁用
            async   changeDisabled(){
                this.pitchSupplierOne.isDisabled == 0? this.pitchSupplierOne.isDisabled =1 : this.pitchSupplierOne.isDisabled =0
                let res = await  getNewSupplier(this.pitchSupplierOne)
                if(res.code == 0){
                    this.getlist()
                }

            },
            addClient(){
                this.clientList ={}
               this.clientDataShow = true
            },
            //确认添加一条信息
            addNewSupplier(){
                // this.$refs.child.handleSubmit( async () => {
                //     let data = this.clientList
                //     data.isDisabled ? data.isDisabled = 1 : data.isDisabled = 0
                //     data.isClient ? data.isClient =1 : data.isClient = 0
                //     console.log(data)
                //     let  d = new Date(data.Time);
                //          d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                //          data.Time = d
                //
                //     let res = await  getNewSupplier(data)
                //     if(res.code == 0){
                //         this.getlist()
                //     }
                //     this.clientDataShow = false
                // })
            },
            //修改客户资料
            changeClient(){
                if (Object.keys(this.pitchSupplierOne).length == 0  ){
                    this.$Message.error('至少选项一条地址')
                    return false
                }
                this.pitchSupplierOne.isDisabled == 1? this.pitchSupplierOne.isDisabled = true : this.pitchSupplierOne.isDisabled = false
                this.pitchSupplierOne.isClient == 1? this.pitchSupplierOne.isClient = true : this.pitchSupplierOne.isClient = false
                this.clientList =this.pitchSupplierOne
                this.clientDataShow = true
            }
        },
      watch:{
          newpid:{
              handler(v,ov){
                  this.Pid = v
                  this.getlist()
              },
              deep:true
          }
      }
    }
</script>

<style scoped lang="less">
  .header-box {
    line-height: 57px;
    padding-left: 20px;
    border-bottom: 1px solid #dcdee2;
  }
.tabeBox {
  overflow: hidden;
  overflow-x:initial;
  padding: 10px;
  height: calc(~"100% - 57px");
}
</style>

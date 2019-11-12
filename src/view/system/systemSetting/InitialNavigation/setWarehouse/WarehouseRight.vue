<template>
    <div>
      <div class="warehouseHeader">
        <span class="mr10">仓位定义:</span>
        <Button class="mr10" @click="openNewWarehouse" ><span class="center"><Icon custom="iconfont iconxinzengicon icons" />新增仓位</span></Button>
        <Button class="mr10 w90" @click="save">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
        </Button>
        <Button class="mr10" @click="changeType" v-if="oneWarehouse.isDisabled">
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />启用
              </span>
        </Button>
        <Button  class="mr15" @click="changeType" v-else>
          <span class="center">
            <Icon custom="iconfont iconjinzhijinyongicon icons"/>禁用
          </span>
        </Button>
      </div>
      <div style="padding: 10px  ; border-bottom: 1px #dcdee2 solid;">
        <vxe-table
          border
          resizable
          align="center"
          size="mini"
          :loading="loading"
          highlight-current-row
          highlight-hover-row
          :edit-rules="validRules"
          @current-change="clOnewList"
          height="330"
          :data="warehouseList"
          :edit-config="{trigger: 'dblclick', mode: 'cell'}">
          <vxe-table-column type="index" title="序号"></vxe-table-column>
          <vxe-table-column field="name" title="仓位" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="area" title="区域" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column  title="是否禁用">
            <template v-slot="{ row }">{{ row.isDisabled ? '是' : '否' }}</template>
          </vxe-table-column>
          <vxe-table-column field="createUname" title="建档人"></vxe-table-column>
          <vxe-table-column field="createTime" title="建档时间"></vxe-table-column>
          <vxe-table-column field="updateUname" title="修改人"></vxe-table-column>
          <vxe-table-column field="updateTime" title="修改时间"></vxe-table-column>
        </vxe-table>

      </div>
        <div class="warehouseHeader">
          <span class="mr10">员工配置:</span>
          <Button class="mr10 w130"><span class="center"><Icon custom="iconfont iconxinzengicon icons" />添加员工</span></Button>
          <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconlajitongicon icons" />删除</span></Button>
        </div>
      <div style="padding: 10px">
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns1" :data="warehouseList" height="330"></Table>
      </div>
<!--      新增模态框-->
      <Modal title="仓位定义" v-model="warehouseIsShow" width="800">
        <AddNewWarehouse :data="newWarehouseOne" :wareHouse="storeId" ref="child"></AddNewWarehouse>
        <div slot='footer'>
          <Button type='primary' @click="sureNew" >确定</Button>
          <Button type='default' >取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import {getWarehouseList , getAddWarehouse,getSaveWarehouse,getAdd} from  '@/api/system/setWarehouse'
  import AddNewWarehouse from "./AddNewWarehouse";
    export default {
        name: "WarehouseRight",
        components:{
            AddNewWarehouse
        },
        data(){
            return {
                loading:true,
                columns1:[
                    {
                        title: '序号',
                        align: 'center',
                        key: '',
                        type:'index'
                    },
                    {
                        type: 'selection',
                        align: 'center'
                    },
                    {
                        title: '员工名称',
                        align: 'center',
                        key: '',
                    },
                    {
                        title: '建档人',
                        align: 'center',
                        key: '',
                    },
                    {
                        title: '建档时间',
                        align: 'center',
                        key: '',
                    },
                ],
                warehouseIsShow:false,
                warehouseList:[],
                validRules: {
                    name: [
                        { required: true, message: '不能为空' },
                    ],
                },
                storeId:'',
                oneWarehouse:'',
                newWarehouseOne:{}
            }
        },
        computed: {
            newstoreId() {
                return this.$store.state.user.storeId;
            }
        },
        methods:{
          async  getAllWarehouseList(){
              this.loading =true
              let id = this.storeId.id
              let res = await getWarehouseList(id)
              if(res.code == 0 ){
                  this.warehouseList = res.data
                  this.loading = false
              }
            },
            //获取当前点击的信息
            clOnewList(data){
              this.oneWarehouse = data.row
            },
            //保存
            save(){
              console.log(this.warehouseList)
                getSaveWarehouse(this.warehouseList).then( res => {
                    if(res.code == 0){
                        this.getAllWarehouseList()
                    }
                })
            },
            //切换状态
            changeType(){
              let id = this.oneWarehouse.id
              getAddWarehouse({id:id}).then( res => {
                  console.log(res)
                  if(res.code == 0){
                      this.getAllWarehouseList()
                  }
              })
            },
            //打开新增
            openNewWarehouse(){
              this.newWarehouseOne = {}
              this.warehouseIsShow = true
            },
            //确认新增
            sureNew(){
              this.$refs.child.handleSubmit( ()=> {
                  this.newWarehouseOne.storeId = this.storeId.id
                  getAdd(this.newWarehouseOne).then( res => {
                      if(res.code == 0){
                          this.warehouseIsShow = false
                          this.getAllWarehouseList()
                      }
                  })

              })
            }
        },
        watch:{
            newstoreId:{
                handler(v,ov){
                    this.storeId = v
                    console.log(v)
                    this.getAllWarehouseList()
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="less">
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .warehouseHeader {
    line-height: 57px;
    padding-left: 16px;
    border-bottom: 1px #dcdee2 solid;
  }
  .freight{
    border: none;
  }
</style>

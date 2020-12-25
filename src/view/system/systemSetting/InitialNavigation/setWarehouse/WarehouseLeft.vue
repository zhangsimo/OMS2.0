<template>
  <div>
    <div class='left'>
      <span class="mr10">仓库定义:</span>
      <Button class="mr10" @click="addWarehouse" v-has="'addWarehouse'"><span class="center"><Icon custom="iconfont iconxinzengicon icons" />新增</span></Button>
      <Button class="mr10" @click="changeWarehouse" v-has="'changeWarehouse'"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改</span></Button>
    </div>
    <div class="houseTitle">
      <ul ref="lists">
        <li v-for="(item,index) in list" :key="item.id">
        <div class="line"></div>
        <div class="vertical"></div>
          <span class="oneWarhouse"  @click="getWareHouseId(item , index)" :class="{active:index===number}">
       <Icon class="iconfont iconyuejieduizhangicon icons"/> {{item.name}}
          </span>
      </li>
      </ul>
    </div>
    <Modal v-model="showNewWareHouse" title="仓库定义">
      <Form :model='warehouseData' :label-width="130" :rules='rules' ref="formValidate">
        <FormItem label='仓库名称：' prop="name">
          <Input v-model='warehouseData.name' style="width: 250px" maxlength="50"></Input>
        </FormItem>
         <Row>
           <Col span="12">
             <FormItem label='是否禁用：' >
               <Checkbox v-model="warehouseData.isDisabled"></Checkbox>
             </FormItem>
           </Col>
           <Col span="12">
             <FormItem label='是否启用WMS：' >
               <Checkbox v-model="warehouseData.isWms"></Checkbox>
             </FormItem>
           </Col>
         </Row>
        <Row>
          <Col span="12">
            <FormItem label='是否禁止销售：' >
              <Checkbox v-model="warehouseData.sellSign"></Checkbox>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label='是否为默认仓：' >
              <Checkbox v-model="warehouseData.isDefault"></Checkbox>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label='是否对外隐藏：' >
              <Checkbox v-model="warehouseData.isShow"></Checkbox>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click="add('formValidate')">确定</Button>
        <Button type='default' @click="showNewWareHouse =false">取消</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getwarehouse,getNewWarehouse} from  '@/api/system/setWarehouse'
    export default {
        name: "WarehouseLeft",
        data(){
            return {
                list:'',
                showNewWareHouse: false,
                warehouseData:{},
                rules:{
                    name: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ]
                },
                number:''
            }
        },
        created(){
            this.getList()
        },
        methods:{
         async getList(){
           let data ={}
           data.shopNumber = this.$store.state.user.userData.currentCompany ? this.$store.state.user.userData.currentCompany.id ? this.$store.state.user.userData.currentCompany.id : '' : ''
            let res = await getwarehouse(data)
             if(res.code == 0){
                 this.list = res.data
             }
          },
            getWareHouseId(data,index){
                this.warehouseData = JSON.parse(JSON.stringify(data))
                this.$store.commit('setStoreId',data)
                this.number =  index
            },
            addWarehouse(){
                this.warehouseData ={}
             this.showNewWareHouse =true
            },
            add (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = this.warehouseData;
                        data.isWms=this.warehouseData.isWms?this.warehouseData.isWms:false;
                        data.isDisabled=this.warehouseData.isDisabled?this.warehouseData.isDisabled:false;
                        data.sellSign=this.warehouseData.sellSign?this.warehouseData.sellSign:false;
                        data.isDefault=this.warehouseData.isDefault?this.warehouseData.isDefault:false;
                        getNewWarehouse(data).then( res => {
                            this.getList()
                            this.showNewWareHouse =false
                        })
                    } else {
                        this.$Message.error('信息填写完整!');
                    }
                })
            },
            changeWarehouse(){
                if (Object.keys(this.warehouseData).length == 0  ){
                    this.$Message.error('至少选项一个仓库')
                    return false
                }
                this.showNewWareHouse =true
            }
        }
    }
</script>

<style scoped lang="less">
.left {
  padding-left: 10px;
  line-height: 57px;
  border-bottom: 1px #cccccc solid;
}
  .houseTitle{
    padding: 10px;
  }
ul {
  list-style: none;
  padding-top: 10px;
  li {
    line-height: 24px;
    /*border-left: 1px #cccccc dashed;*/
    padding-left: 12px;
    position: relative;
    .line{
      width: 10px;
      position: absolute;
      left: 0;
      top:12px;
      border-bottom: 1px #cccccc dashed;
    }
    .vertical{
      height: 20px;
      position: absolute;
      left: 0px;
      top: -10px;
      border-left: 1px #cccccc dashed;
    }
  }
  .oneWarhouse {
    cursor:pointer;
  }
  .oneWarhouse:hover {
    color: #40a6ff;
  }
  .active {
    color: #40a6ff;
  }
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

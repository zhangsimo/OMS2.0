<template>
  <div>
    <div class='left'>
      <span class="mr10">仓库定义:</span>
      <Button class="mr10" @click="addWarehouse"><span class="center"><Icon custom="iconfont iconxinzengicon icons" />新增</span></Button>
      <Button class="mr10" ><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改</span></Button>
    </div>
    <div class="houseTitle">
      <ul>
        <li v-for="item in list" :key="item.id">
        <div class="line"></div>
        <div class="vertical"></div>
          <span class="oneWarhouse" @click="getWareHouseId(item)">
       <Icon class="iconfont iconyuejieduizhangicon icons"/> {{item.name}}
          </span>
      </li>
      </ul>
    </div>
    <Modal v-model="showNewWareHouse" title="仓库定义">
      <Form :model='warehouseData' :label-width="130">
        <FormItem label='仓库名称：' >
          <Input v-model='warehouseData.name' style="width: 250px" ></Input>
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
      </Form>
      <div slot='footer'>
        <Button type='primary' @click="add">确定</Button>
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
                warehouseData:{}
            }
        },
        created(){
            this.getList()
        },
        methods:{
         async getList(){
            let res = await getwarehouse()
             if(res.code == 0){
                 this.list = res.data
             }
          },
            getWareHouseId(data){
             console.log(data,123)
            },
            addWarehouse(){
             this.showNewWareHouse =true
            },
            add(){
             let data = this.warehouseData
                getNewWarehouse(data).then( res => {
                    console.log(data)
                })

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
}
</style>

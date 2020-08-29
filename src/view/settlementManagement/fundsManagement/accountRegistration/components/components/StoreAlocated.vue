<template>
    <Modal v-model="StoreAlocatedShow" title="连锁待分配款项显示门店" width="500">
      <div class="mb10">
        <!--<Button class="mr10">全选</Button>-->
        <!--<Button>取消全选</Button>-->
      </div>
      <Tree :data="TreeData" show-checkbox multiple @on-check-change="checkedData" check-directly></Tree>
      <div slot='footer'>
        <Button type='primary' @click="StoreConfirm" class="mr10">保存</Button>
        <Button type='default' @click="StoreAlocatedShow = false">取消</Button>
      </div>
    </Modal>
</template>

<script>
  import { findAreaShopList } from '@/api/settlementManagement/fundsManagement/accountRegistration'

  export default {
        name: "StoreAlocated",
      data(){
          return {
            StoreAlocatedShow: false, //弹框显示隐藏
            TreeData: [], //表格树
            TreeDataValue: [], //选中的表格树数据
          }
      },
      methods: {
          //打开模态框
        openModal(val= null){
          if (val.shopList){
          this.geCheckBox(this.TreeData , val.shopList)
          }
          this.StoreAlocatedShow = true
        },

        //获取已选数据
        geCheckBox(treeList , shopList){
          return  treeList.map(item => {
             if(shopList.indexOf(item.id) != -1){
              this.$set(item,'checked' ,true)
             }
             if (item.children) {
               this.geCheckBox( item.children , shopList)
             }
           })
        },
          //保存按钮
        StoreConfirm(){
          if(this.TreeDataValue.length > 0){
            this.StoreAlocatedShow = false;
            this.$emit('TreeValue',this.TreeDataValue);
            this.getTreeList()
          }else {
            this.$Message.warning('请选择数据')
          }
        },

        //获取节点
        checkedData(value){
          this.TreeDataValue =  value.filter(item => item.children == null);
        },

        //连锁待分配款项显示门店_Pass
        getTreeList(){
          let params = {};
          findAreaShopList(params).then(res => {
            if(res.code == 0){
              // console.log(res)
              let treeArr = res.data;
              treeArr.map(item => {
                item.children = item.childs;
                item.title = item.name;
                item.expand =  true;
                delete item.childs;
                delete item.name;
                item.children.map(item => {
                  item.children = item.childs;
                  item.title = item.name;
                  item.expand =  true;
                  delete item.childs;
                  delete item.name;
                  item.children.map(item => {
                    item.children = item.childs;
                    item.title = item.name;
                    item.expand =  true;
                    delete item.childs;
                    delete item.name;
                  })
                })
              })
              this.TreeData = treeArr
            }
          })
        }
      },
      mounted(){
        this.getTreeList(); //待分配显示门店
      }
    }
</script>

<style scoped>

</style>

<template>
    <Modal v-model="StoreAlocatedShow" title="连锁待分配款项显示门店" width="500">
      <div class="mb10">
        <!--<Button class="mr10">全选</Button>-->
        <!--<Button>取消全选</Button>-->
      </div>
      <Tree :data="TreeData" show-checkbox multiple @on-check-change="checkedData"></Tree>
      <div slot='footer'>
        <Button type='primary' @click="StoreConfirm" class="mr10">保存</Button>
        <Button type='default' @click="StoreAlocatedShow = false">取消</Button>
      </div>
    </Modal>
</template>

<script>
    export default {
        name: "StoreAlocated",
      data(){
          return {
            StoreAlocatedShow: false, //弹框显示隐藏
            TreeData: [
              {
                title: 'parent 1',
                expand: true,
                children: [
                  {
                    title: 'parent 1-1',
                    expand: true,
                    children: [
                      {
                        title: 'leaf 1-1-1',
                      },
                      {
                        title: 'leaf 1-1-2'
                      }
                    ]
                  },
                  {
                    title: 'parent 1-2',
                    expand: true,
                    children: [
                      {
                        title: 'leaf 1-2-1',
                      },
                      {
                        title: 'leaf 1-2-1'
                      }
                    ]
                  }
                ]
              }
            ], //表格树
            TreeDataValue: [], //选中的表格树数据
          }
      },
      methods: {
          //保存按钮
        StoreConfirm(){
          if(this.TreeDataValue.length > 0){
            // alert(1)
            this.StoreAlocatedShow = false;
            this.$emit('TreeValue',this.TreeDataValue)
          }else {
            this.$Message.warning('请选择数据')
          }
        },
        //获取节点
        checkedData(value){
          this.TreeDataValue = value;
        }
      }
    }
</script>

<style scoped>

</style>

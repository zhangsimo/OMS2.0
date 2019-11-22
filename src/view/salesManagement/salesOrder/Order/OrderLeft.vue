<template>
    <div>
      <div class="orderList">
        <h5>销售订单列表</h5>
      </div>
      <div class="orderCenter">
        <vxe-table
          border
          align="center"
          size="mini"
          @current-change="clickOnesList"
          highlight-hover-row
          highlight-current-row
          style="width: 1000px"
          height="500"
          :data="tableData">
          <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="状态"></vxe-table-column>
          <vxe-table-column field="sex" title="客户"></vxe-table-column>
          <vxe-table-column field="age" title="创建日期"></vxe-table-column>
          <vxe-table-column field="age" title="销售员"></vxe-table-column>
          <vxe-table-column field="age" title="销售订单单号"></vxe-table-column>
          <vxe-table-column field="age" title="打印次数"></vxe-table-column>
          <vxe-table-column field="age" title="提交人"></vxe-table-column>
          <vxe-table-column field="age" title="提交日期"></vxe-table-column>
          <vxe-table-column field="age" title="创建人"></vxe-table-column>
        </vxe-table>
        <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
              @on-change="selectNum" @on-page-size-change="selectPage" class="mr10"></Page>
      </div>
    </div>
</template>

<script>
    export default {
        name: "OrderLeft",
        data(){
            return {
                page:{
                    total:0,
                    size:10,
                    num:1
                }
            }
        },
        methods:{
            //切换页面
            selectNum(){},
            //切换页数
            selectPage(){},
            //点击获取当前信息
            clickOnesList(data){
                console.log(data.row)
            }
        }
    }
</script>

<style scoped lang="less">
.orderList {
  line-height: 30px;
  padding-left: 10px;
  /*border-bottom: 1px solid #dcdee2;*/
  background-color: #f8f8f8;

}
  .orderCenter{
    overflow: hidden;
    overflow-x: scroll;
  }
</style>

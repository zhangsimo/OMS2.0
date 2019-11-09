<template>
<div class="commodbigbox">
  <div class="oper-top">
    <span class="mr10">查询项：</span>
    <Select v-model="searchType1" class="w100 mr10">
      <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
    </Select>
    <Input  class="mr10"  style="width: 150px" />
    <Button type="warning" class="mr20" ><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
    <Button type="warning" class="mr20"  >新增紧俏品</Button>
    <Button type="default" class="mr10 w90"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
    <Button type="default"  class="mr10 w90"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>
    <Button type="default" class="mr10"  > <Icon custom="iconfont icondaoruicon icons" /> 批量导入紧俏品</Button>

  </div>
  <div class="tableCenter">
    <Table stripe  :columns="columns" :data="List" size="small" :loading="Loading" border ></Table>
    <Page class="mr10" :total="page.total"  :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"></Page>
  </div>

<!--  新增紧俏品-->
  <Modal v-model="addCommodShow" title="新增紧俏品">
    <div slot='footer'>
      <Button type='primary' >确定</Button>
      <Button type='default' >取消</Button>
    </div>
  </Modal>

<!--  批量导入紧俏品-->
  <Modal v-model="allAddCommodShow" title="紧俏品导入">
    <div slot='footer'>
      <Button type='primary' >确定</Button>
      <Button type='default' >取消</Button>
    </div>
  </Modal>
</div>
</template>

<script>
    export default {
        name: "commoditiesInShortSupply",
        data(){
            return {
                columns:[
                    {title:'选择',
                     key:'',
                     align:'center',
                    render:(h ,params) =>{
                      return  h('checkbox',{})
                    },
                    },
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '配件内编码',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '编码',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '品质',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '规格',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '可售数量',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '库存数量',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '在途数量',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '过期日期',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '创建人',
                        align: 'center',
                        key: 'name',
                    },

                ],
                page:{
                    num:1,
                    page:10,
                    total:0
                },
                Loading: false,
                List:[
                    {name:'zs',
                        value:18}
                ],
                searchType1:'',
                addCommodShow:false,
                allAddCommodShow:true
            }
        }
    }
</script>

<style scoped lang="less">
.commodbigbox {
  background-color: #fff;
  height: 100%;
  width: 100%;
  .oper-top {
    line-height: 57px;
    padding-left: 10px;
    border-bottom: 1px solid #eee;
  }
  .tableCenter{
    padding: 10px;
  }
}
</style>

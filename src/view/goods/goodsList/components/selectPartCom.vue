<template>
  <div>
    <Modal v-model="searchPartLayer" title="配件选择" width="1000">
      <div class="partCheck-hd">
        <Select style="z-index: 9999" v-model="searchType" class="w100 mr10">
          <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
        <Input class="w150 mr10" v-model="partName" placeholder="名称"></Input>

        <Select placeholder="选择品牌" filterable v-model="selectBrand" class="w150 mr10">
          <Option v-for="item in partBrandData" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
        <Button @click="search" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
        <Button class="mr10" type='default' @click="throwData"><Icon type="md-checkmark" /> 选择</Button>
        <Button class="mr10" type='default' @click="throwData"><Icon type="md-close" /> 取消</Button>
        <Button type='default' @click="applyPart"><Icon type="md-add" /> 配件申请</Button>
      </div>
      <div class="partCheck-main clearfix">
        <div class="partCheck-left fl">
          <div class="partCheck-left-tit">系统分类</div>
          <div class="partCheck-left-tree">
            <Tree v-loading="treeLoading" :data="treeData" @on-select-change="selectTree"></Tree>
          </div>
        </div>
        <div class="fr partCheck-right" style="width: 758px">
          <Table height="389" @on-current-change="selectTabelData" highlight-row :loading="loading" border :stripe="true" :columns="columnsPart" :data="partData"></Table>
          <Page size="small" class-name="page-con fr pt10" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
                @on-page-size-change="changeSize" show-sizer show-total></Page>
        </div>
      </div>
      <div slot='footer'>
        <!--<Button type='primary' @click='submit("proModal")'>确定</Button>-->
        <!--<Button type='default' @click='proModal = false'>取消</Button>-->
      </div>
    </Modal>
    <part-info ref="partInfo"></part-info>
  </div>
</template>

<script>
  import {getAllBrand,getCarClassifys,getCarPartName} from "_api/system/partsExamine/partsExamineApi";
  import PartInfo from "../../../../components/partInfo/partInfo";
  import {mixSelectPartCom} from "./mixSelectPartCom";

  export default {
    name: "selectPartCom",
    mixins:[mixSelectPartCom],
    components: {PartInfo},
    data(){
      return {
        loading:false,
        treeLoading:false,

        searchPartLayer:false,//配件名称查询层
        partName:'',//配件名称查询名字
        treeData:[],//系统分类树形数据
        //查询选择

        //配件名称查询层表头
        columnsPart:[
          {
            title: '序号',
            width: 50,
            type:'index'
          },
          {
            title: '配件名称',
            key: 'venderSkuNo',
            align: 'center',
            children: [
              {
                title: '标准名称',
                key: 'name',
                minWidth: 70,
              },
              {
                title: '方向',
                key: 'direction',
                minWidth: 70,
              },
              {
                title: '别名',
                key: 'groupName',
                minWidth: 70,
              },
            ]
          }
        ],
        //配件名称查询层配件数据
        partData:[],
        //配件数据选中的数据
        selectTableItem:{},
        //树形选中数据
        selectTreeItem:{},
        //分页obj
        page: {
          num: 1,
          size: 20,
          total: 0
        },
      }
    },
    methods:{
      //获取系统分类
      getCarClassifysFun(){
        this.treeLoading = true
        getCarClassifys({page: 1,pageSize: 500}).then(res => {
          this.treeLoading = false
          this.treeData = this.resetData(res.data.content||[])
        })
      },
      //树形数组递归加入新属性
      resetData(treeData){
        treeData.map(item => {
          item.title = item.typeName
          if(item.children&&item.children.length>0){
            item.children = this.resetData(item.children)
          }
        })
        return treeData
      },
      getList(){
        this.loading = true
        let req = {}
        req.typeId = this.selectTreeItem.id
        if(this.partName.trim()){
          req.name = this.partName.trim()
        }
        req.page = this.page.num
        req.size = this.page.size
        getCarPartName(req).then(res => {
          this.loading = false;
          this.partData = res.data.content||[];
          this.page.total = res.data.total
        })
      },
      search(){
        this.page.num=1
        this.getList()
      },
      //系统分类树形节点点击数据
      selectTree(v){
        if(v.length>0){
          this.selectTreeItem = v[0];
          this.getList();
        }
      },
      //显示层
      init(){
        this.searchPartLayer = true;
        this.getCarClassifysFun();
      },
      //配件表格点击的行
      selectTabelData(v){
        this.selectTableItem = v
      },
      throwData(){
        this.$emit('selectSearchName',this.selectTableItem);
        this.searchPartLayer = false;
      },
      //分页
      changePage(p) {
        this.page.num = p
        this.getList()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
      //申请配件按钮
      applyPart(){
        this.searchPartLayer = false;
        this.$refs.partInfo.init();
      }
    }
  }
</script>

<style lang="less" scoped>
  .partCheck-hd{
    //border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  .partCheck-left{
    border:1px solid #ddd;
    width: 200px;
    .partCheck-left-tit{
      text-align: center;
      border-bottom: 1px solid #ddd;
      line-height: 36px;
    }
  }
  .partCheck-left-tree{
    padding: 10px;
    height: 350px;
    overflow-y: auto;
  }

  .custom-main{
    border-top: 1px solid #ddd;
    .custom-type-hd{
      padding: 10px 0 6px;
    }
    .tag-span{
      cursor: pointer;
      background: #f8f8f8;
      border: 1px solid #e8e8e8;
      padding: 4px 10px;
      border-radius: 2px;
      &.active{
        background: #fd5c5c;
        border-color: #fd5c5c;
        color: #fff;
      }
    }
  }
</style>

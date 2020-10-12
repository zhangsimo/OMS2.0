<template>
  <div>
    <Modal v-model="searchPartLayer" :title="headerTit" width="1000">
      <div class="partCheck-hd">
        <!--<Input class="w150 mr10" v-model="fullName" placeholder="名称"></Input>-->
        <!--<Input class="w200 mr10" v-model="code" placeholder="编码"></Input>-->
        <!--<Input class="w150 mr10" v-model="contactorTel" placeholder="电话"></Input>-->
        <el-input class="w250 mr10" v-model="fullName" ref="focusInput" placeholder="全称/简称/编码/拼音" @keyup.enter.native="search"></el-input>
        <!--│-->
        <!--<Checkbox class="mr20 ml10" v-model="isDisable" @show="isShow"> 显示禁用</Checkbox>-->
        <Button @click="search" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
        <Button class="mr10" type='default' @click="throwData"><Icon type="md-checkmark" /> 选择</Button>
        <Button class="mr10" type='default' @click="searchPartLayer=false">取消</Button>
        <!--<Button type='default' @click="addPartModal=true"><Icon type="md-add" /> 新增配件名称</Button>-->
      </div>
      <div class="partCheck-main clearfix">
        <div class="partCheck-left fl">
          <div class="partCheck-left-tit">供应商分类</div>
          <div class="partCheck-left-tree" >
            <Tree :data="treeData" v-loading="treeLoading" @on-select-change="selectTree"></Tree>
          </div>
        </div>
        <div class="fr partCheck-right" style="width: 758px">
          <Table ref="tableRef" height="389" @on-current-change="selectTabelData" highlight-row :loading="loading" border :stripe="true" @on-row-dblclick="dblclick" :columns="columnsPart" :data="partData"></Table>
          <Page size="small" class-name="page-con fr pt10" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
                @on-page-size-change="changeSize" show-sizer show-total></Page>
        </div>
      </div>
      <div slot='footer'>
        <!--<Button type='primary' @click='submit("proModal")'>确定</Button>-->
        <!--<Button type='default' @click='proModal = false'>取消</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>

  import {mixSelectSupplier} from "./minxSelectSupplier";

  export default {
    name: "selectSupplier",
    mixins:[mixSelectSupplier],
    props:{
      headerTit:'',
      Show: 'fasle'
    },
    data(){
      return {

      }
    },
    methods:{

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
      display: inline-block;
      &.active{
        background: #fd5c5c;
        border-color: #fd5c5c;
        color: #fff;
      }
    }
  }
</style>

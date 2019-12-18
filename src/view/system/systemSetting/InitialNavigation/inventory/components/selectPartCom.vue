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
<!--        <Button class="mr10" type='default' @click="throwData"><Icon type="md-close" /> 取消</Button>-->
      </div>
      <div class="partCheck-main clearfix">
        <div class="partCheck-left fl">
          <div class="partCheck-left-tit">系统分类</div>
          <div class="partCheck-left-tree">
            <Tree v-loading="treeLoading" :data="treeData" @on-select-change="selectTree"></Tree>
          </div>
        </div>
        <div class="fr partCheck-right" style="width: 758px">
          <Table height="389" @on-row-click="selectTabelData" :loading="loading" border :stripe="true" :columns="columnsPart" :data="partData"></Table>
          <Page size="small" class-name="page-con fr pt10" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
                @on-page-size-change="changeSize" show-sizer show-total></Page>
        </div>
      </div>
      <div slot='footer'>
      </div>
    </Modal>
    <Modal
      v-model="numberAmount"
      title="入库数量金额">
      <Form ref="formInfo" :model="formInfo" :rules="ruleValidate" :label-width="80">
        <div class="formItem">
          <FormItem label="配件编码:" prop="partCode">
            <Input v-model="this.selectTableItem.partCode" disabled></Input>
          </FormItem>
          <FormItem label="配件名称:" prop="partStandardName">
            <Input v-model="this.selectTableItem.partStandardName" disabled></Input>
          </FormItem>
        </div>
        <FormItem label="配件全称:" prop="fullName">
          <Input v-model="this.selectTableItem.fullName" disabled></Input>
        </FormItem>
        <div class="formItem">
          <FormItem label="单位:" prop="minUnit">
            <Input v-model="this.selectTableItem.minUnit" disabled></Input>
          </FormItem>
          <FormItem label="仓库:" prop="storeName">
            <Input v-model="this.mainData.storeName" disabled></Input>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="数量:" prop="enterQty">
            <Input v-model="formInfo.enterQty"></Input>
          </FormItem>
          <FormItem label="单价:" prop="enterPrice">
            <Input v-model="formInfo.enterPrice"></Input>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="金额:" prop="enterAmt">
            <Input v-model="inputMoney"></Input>
          </FormItem>
          <FormItem label="备注:" prop="remark">
            <Input v-model="formInfo.remark"></Input>
          </FormItem>
        </div>
      </Form>
      <div slot='footer'>
        <Button type='text' @click="cancel">取消</Button>
        <Button type='primary' @click="addAccessories">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import PartInfo from "_c/partInfo/partInfo";
  import {mixSelectPartCom} from "./mixSelectPartCom";

  export default {
    name: "selectPartCom",
    mixins:[mixSelectPartCom],
    components: {PartInfo},
    props:{
      isShowAddPartBtn:false,
        mainData:''
    },
    computed:{
      // inputMoney:function(){
      //   if (this.formInfo.enterQty != ''&& this.formInfo.enterPrice !='') {
      //       return this.formInfo.enterQty * this.formInfo.enterPrice
      //   }
      // },
      inputMoney: {
                get:function () {     //getter读取数据
                    if (this.formInfo.enterQty != ''&& this.formInfo.enterPrice !='') {
                        return this.formInfo.enterQty * this.formInfo.enterPrice
                    }
                },
                set:function (val) {    //setter 需要时触发
                    console.log(val,'val')
                    this.formInfo.enterPrice = val / this.formInfo.enterQty
                }
            }
    },
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
  .formItem{
    display: flex;
    justify-content:space-around;
  }
</style>

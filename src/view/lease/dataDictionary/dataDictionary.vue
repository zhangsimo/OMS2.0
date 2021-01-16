<template>
  <div class="content-oper content-oper-flex" style="height: 100%">
    <section class="con-box">
      <div class="con-split con-datadictionary-split" ref="paneLeft">
        <Split v-model="split" min="200" max="500">
          <div slot="left" ref="dataLeft" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
            <div :style="dataWidth">
              <div class="pane-made-hd">
                数据字典类型
              </div>
              <div class="data-dic-search clearfix p10">
                <div class="fl">
                  <span>字典编码：</span>
                  <Input v-model="dicTypeCode" placeholder="字典编码" class="w100 mr10"></Input>
                </div>
                <div class="fl">
                  <span>字典名称：</span>
                  <Input v-model="dicTypeName" placeholder="字典名称" class="w100 mr10"></Input>
                </div>
                <div class="fl">
                  <Button @click="getList" type="warning" class="mr10 w90"><Icon type="ios-search" size="14"/> 查询</Button>
                </div>
              </div>
              <div class="p10 dicTypeTop">
                <Button type="default" @click="addNewModelFun" class="mr10 w90" v-has="'addLedt'"><Icon type="md-add" size="14" /> 新增</Button>
                <Button @click="changeModelFun" type="default" class="mr10 w90" v-has="'changeLedt'"><i class="iconfont mr5 iconbianjixiugaiicon"></i>修改</Button>
              </div>
              <div class="data-dic-wrap">
                <Tree :data="treeData"></Tree>
              </div>
            </div>
          </div>
          <div slot="right" class="con-split-pane-right pl5">
            <div class="pane-made-hd">
              数据字典项
            </div>
            <div class="p10">
              <Button type="default" @click="addNew" class="mr10 w90" v-has="'addRight'"><Icon type="md-add" size="14" /> 新增</Button>
              <Button @click="changeNew" type="default" class="mr10 w90" v-has="'changeRight'"><i class="iconfont mr5 iconbianjixiugaiicon"></i>修改</Button>
            </div>
            <Table class="table-highlight-row" @on-current-change="selectTable"  size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>

          </div>
        </Split>
      </div>
    </section>
    <Modal v-model="addNewModal" :title="changeTreeItemTitle" width="400">
      <Form ref="proModal" :model="formModelData" :rules="ruleModelData" :label-width="110">
        <FormItem label="类型编码：" prop="dictCode">
          <Input class="w200" v-model="formModelData.dictCode" disabled></Input>
        </FormItem>
        <FormItem label="类型名称：" prop="dictName">
          <Input class="w200" v-model="formModelData.dictName"></Input>
        </FormItem>
        <FormItem label="备注：" prop="dictDescribe">
          <Input class="w200" v-model="formModelData.dictDescribe"></Input>
        </FormItem>
        <FormItem label="上级菜单：" prop="parentMenu">
          <Cascader change-on-select class="w200" :data="this.treeData[0].children" v-model="formModelData.parentMenu"></Cascader>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click='submitType("proModal")'>确定</Button>
        <Button type='default' @click='addNewModal = false'>取消</Button>
      </div>
    </Modal>
    <Modal v-model="addNewItem" :title="changeTabelItemTitle" width="400">
      <Form ref="proModal2" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <FormItem label="类型名称：">
          {{formValidate.dicTypeName}}
        </FormItem>
        <FormItem label="字典项代码：" prop="dicCode">
          <Input class="w200" v-model="formValidate.dicCode" disabled></Input>
        </FormItem>
        <FormItem label="字典项名称：" prop="dicName">
          <Input class="w200" v-model="formValidate.dicName"></Input>
        </FormItem>
        <FormItem label="是否有效：" prop="isDisable">
          <Select class="w200" v-model="formValidate.isDisable">
            <Option value='1'>是</Option>
            <Option value='0'>否</Option>
          </Select>
        </FormItem>
        <FormItem label="属性值1：" prop="itemValueOne">
          <Input class="w200" v-model="formValidate.itemValueOne"></Input>
        </FormItem>
        <FormItem label="属性值2：" prop="itemValueTwo">
          <Input class="w200" v-model="formValidate.itemValueTwo"></Input>
        </FormItem>
        <FormItem label="属性值3：" prop="itemValueThree">
          <Input class="w200" v-model="formValidate.itemValueThree"></Input>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click='submit("proModal2")'>确定</Button>
        <Button type='default' @click='addNewItem = false'>取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import '../product/lease.less'
  import {dataMixin} from './datamixin'


  export default {
    name: 'dataDictionary',
    mixins:[dataMixin],
    data(){
      return {
        dataWidth:{
          "minWidth":"100%"
        },
        tenantId:'',
        addNewModal:false,
        addNewItem:false,
        columns:[
          {
            title: '选择',
            align:'center',
            key: 'venderSkuNo',
            minWidth: 80,
            render:(h,params) => {
              return h('span',{
                class:'table-radio'
              })
            }
          },
          {
            title: '数据项编码',
            key: 'itemCode',
            minWidth: 170,
          },
          {
            title: '数据项名称',
            key: 'itemName',
            minWidth: 170
          },
          {
            title: '属性值1',
            key: 'itemValueOne',
            minWidth: 170
          },
          {
            title: '属性值2',
            key: 'itemValueTwo',
            minWidth: 170
          },
          {
            title: '属性值3',
            key: 'itemValueThree',
            minWidth: 170
          },
          {
            title: '有效',
            key: 'name',
            minWidth: 170,
            render:(h,params)=>{
              return h('span',(params.row.isDisable&&params.row.isDisable==1)?'是':'否')
            }
          },
        ],
        tbdata:[],
        loading:false,
      }
    },
    mounted(){
      setTimeout(()=>{
        this.dataWidth.minWidth = '900px'
      },0)
      this.getList()
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>

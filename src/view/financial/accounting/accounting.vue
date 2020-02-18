<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane" style="overflow-y: auto; height: 100%;">
        <Tree :data="treeList" @on-select-change="clickTree"></Tree>
      </div>
      <div slot="right" class="demo-split-pane" style="overflow-y: auto; height: 100%;">
        <Button @click="add" type="warning" class="mr10 w90">新增科目</Button>
        <vxe-table
          border
          class="mt10"
          resizable
          :data="tableData"
          stripe
          size="mini"
          align="center"
          :auto-resize="true"
          highlight-hover-row
          highlight-current-row
          show-overflow
        >
          <vxe-table-column type="index"  title="操作">
            <template v-slot="{row}">
              <a @click="addNewChildren(row)" class="mr10">新增子科目</a>
              <a @click="change(row)" class="mr10">修改</a>
              <a @click="deleteOne(row)">删除</a>
            </template>
          </vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="fullName" title="科目名称"></vxe-table-column>
          <vxe-table-column field="titleTypeName" title="科目类别"></vxe-table-column>
          <vxe-table-column field="balanceDirection" title="余额方向"></vxe-table-column>
          <vxe-table-column field="auxiliaryAccountingName" title="辅助核算"></vxe-table-column>
          <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          <vxe-table-column title="状态">
            <template v-slot="{ row }">{{ row.status == 1 ? '无效' : '有效' }}</template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </Split>
    <Modal v-model="addNewModal" title="编辑会计科目" width="800">
      <Form ref="proModal" :model="formData"  :label-width="110">
        <Row>
          <Col span="12">
            <FormItem label="上级科目：">
              <Input class="w200" v-model="formData.parentCode" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目类别：">
              <Input class="w200" v-model="formData.titleTypeCode" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="科目编码：">
              <Input class="w200" v-model="formData.titleCode" ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目名称：">
              <Input class="w200" v-model="formData.titleName" ></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="科目全称：">
          <Input style="width: 585px" v-model="formData.fullName" ></Input>
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="余额方向：">
              <RadioGroup v-model="formData.balanceDirection">
                <Radio :label="0">借</Radio>
                <Radio :label="1">贷</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目状态：">
              <RadioGroup v-model="formData.status">
                <Radio :label="1">启用</Radio>
                <Radio :label="0">禁用</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="辅助核算：">
          <Select v-model="formData.auxiliaryAccountingCode" style="width:200px">
            <Option v-for="item in assistList" :value="item.itemCode" :key="item.id">{{ item.itemName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click="addSave">保存</Button>
        <Button type='default' @click="addNewModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
    import {getTreeList ,getTableList , fzType , getSave , kmType ,deletTableList}from '@/api/accountant/accountant'

    export default {
        name: "accounting",
        data(){
            return {
                split1: 0.2,
                treeList:[],//树形图数据
                oneTreeList:{},//点击获取一级以下树形数据
                tableData:[],//表格数据
                subjectList:[], //科目类别
                addNewModal:false,//新增模块显示
                formData:{},//新增数据
                assistList:[{itemName: '暂无' , itemCode: 'null'}],// 辅助列表
            }
        },
        mounted(){
           this.getTreeList()
           this.getAssistList()
            this.getSubjectType()
        },
        methods: {
            //获取左侧树形图数据
           async getTreeList(){
                let res = await getTreeList()
               if ( res.code === 0){
                   this.treeList = res.data
                   this.changeTree( this.treeList )
                   if( JSON.stringify(this.oneTreeList) == '{}'){
                       this.$nextTick( () =>{
                               this.oneTreeList = this.treeList[0]
                           }
                       )
                   }

               }
            },

            //处理树形数据
            changeTree(data){
               data.map( item => {
                    item.title = item.titleCode + '-' +  item.titleName
                   // item.expand = true
                   if(item.children && item.children.length > 0){
                       this.changeTree(item.children)
                   }
               })
            },

            //点击树形数据
            clickTree(data){
                   this.oneTreeList = data[0]
                console.log(data)
            },

            //获取辅助列表
            async getAssistList(){
               let res = await fzType()
                if(res.code === 0){
                   this.assistList = [...this.assistList ,...res.data]
                }
            },

            //获取科目类别
            async getSubjectType(){
              let res = await kmType()
              if(res.code == 0){
                  this.subjectList = res.data
                  console.log(res)
              }
            },

            //新增
            add(){
              this.addNewModal = true
              this.formData ={}
              this.formData.parentCode = this.oneTreeList.titleCode
              this.formData.titleTypeCode = this.oneTreeList.titleTypeCode
              this.formData.auxiliaryAccountingCode = 'null'
              this.formData.titleLevel = this.oneTreeList.titleLevel + 1
            },

            //保存
            async addSave(){
               let res = await getSave( this.formData )
                if(res.code == 0){
                    this.getTreeList()
                    let arr = await getTableList(data)
                    if(arr.code == 0 ){
                        this.tableData = arr.data
                    }
                    this.addNewModal = false

                }
            },

            //新增子节点
            addNewChildren(row){
                this.addNewModal = true
                this.formData ={}
                this.formData.parentCode = row.titleCode
                this.formData.titleTypeCode = row.titleTypeCode
                this.formData.auxiliaryAccountingCode = 'null'
                this.formData.titleLevel = row.titleLevel + 1
            },

            //修改节点数据
            change(row){
                this.formData = row
                this.addNewModal = true
            },

            //删除
           async deleteOne(row){
               let data = {}
               data = row
              let res = await  deletTableList(data)
               if(res.code == 0){
                   this.getTreeList()
                   let arr = await getTableList(data)
                   if(arr.code === 0 ){
                       this.tableData = arr.data
                   }
               }
            }
        },
        watch:{
            oneTreeList:{
       async  handler(newVal ,oldVal) {
           let data = {}
              data.parentCode = newVal.titleCode
           let res = await getTableList(data)
           if(res.code === 0 ){
               this.tableData = res.data
           }
            },
          deep: true
         }
        }
    }
</script>

<style scoped>
  .demo-split{
    height: 100%;
    border: 1px solid #dcdee2;
    background-color: #fff;
    /*overflow: hidden;*/
  }
  .demo-split-pane{
    padding: 10px;
  }
</style>

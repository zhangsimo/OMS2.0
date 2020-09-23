<template>
  <Modal v-model="artificialShow" title="人工分配" width="600px">
    <div>
      <p class="headerTitle pl10 ">需分配金额</p>
      <Row class="box mb10">
        <Col span="12" class="title rigt">收入金额</Col>
        <Col span="12" class="title">支出金额</Col>
        <Col span="12" class="rigt">{{list.incomeMoney}}</Col>
        <Col span="12">{{list.paidMoney}}</Col>
      </Row>
     <div class="mb10">
      <Button class="mr10 w90" @click="add">
        <Icon type="md-add" />添加
      </Button>
      <Button type="default" class="mr10 w90" @click="delet">删除</Button>
     </div>

      <vxe-table
      border
      ref="xTable"
      align="center"
      show-footer
      resizable
      auto-resize
      height="200px"
      size="mini"
      :data="tableData"
      :footer-span-method="footerColspanMethod"
      :footer-method="footerMethod"
      @checkbox-change="getOneList"
      @checkbox-all ='getAllList'
      :edit-rules="validRules"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
        <vxe-table-column type="checkbox" width="50"></vxe-table-column>
        <vxe-table-column field="claimShopCode"  title="分配店号" >
        <template v-slot="{row}">
          <Select v-model="row.claimShopCode" transfer>
            <Option v-for="item in shopList" :value="item.shopCode" :key="item.shopId">{{ item.shopCode }}{{ item.shortName }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="incomeMoney" title="收入金额" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template v-slot:edit="{ row }">
          <vxe-input digits="2" min="0" :disabled="!row.claimShopCode||((row.paidMoney&&row.paidMoney!=0)?true:false)" type="float" v-model="row.incomeMoney"></vxe-input>
        </template>
        <template v-slot="{ row }">
          {{row.incomeMoney}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="paidMoney" title="支出金额" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template v-slot:edit="{ row }">
          <vxe-input digits="2" min="0" :disabled="!row.claimShopCode||((row.incomeMoney&&row.incomeMoney!=0)?true:false)" type="float" v-model="row.paidMoney"></vxe-input>
        </template>
        <template v-slot="{ row }">
          {{row.paidMoney}}
        </template>
      </vxe-table-column>
    </vxe-table>
    <div></div>
    </div>

    <div slot="footer">
      <Button type="primary" @click="sure">确定</Button>
      <Button type="default" @click="artificialShow = false">取消</Button>
    </div>
  </Modal>

</template>

<script>
  import {assignShop , manpowerChange} from '@/api/settlementManagement/fundsManagement/capitalChain'


  export default {
        name: "artificial",
      props:{
          list:''
      },
      data(){
          return {
            artificialShow : false,//模态框状态
            tableData:[],//表格数据
            shopList:[],
            oneList:{},//当前行数据
            checkTheSpending:0,//核对支出
            checkTheIncome: 0 ,//核对收入

            incomeMoneyTotal:0,//收入合计
            paidMoneyTotal:0,//支出合计
            validRules:{
              claimShopCode:[
                { required: true, message: '分配店号必填',trigger:'change' }
              ]
            }
          }
      },
      methods:{
         //打开模态框
        openModal(){
          this.artificialShow = true
          this.oneList = []
          setTimeout(()=>{
            this.tableData=[{"claimShopCode":"","paidMoney":this.list.paidMoney?this.list.paidMoney:0,"incomeMoney":this.list.incomeMoney?this.list.incomeMoney:0}]
          },10)
          this.getshopList()
        },

        //获取分配店号
       async getshopList(){
          let res = await  assignShop()
         if (res.code === 0) return  this.shopList = res.data
        },

        //表格校验必选门店
        editActivedEvent({row}){
          let xTable = this.$refs.xTable
          let incomeMoneyColumn = xTable.getColumnByField('incomeMoney'),
              paidMoneyColumn = xTable.getColumnByField('paidMoney'),
              isNameDisabled = row. claimShopCode ? false : true
              incomeMoneyColumn.editRender.attrs.disabled = row.paidMoney?true:isNameDisabled
              paidMoneyColumn.editRender.attrs.disabled = row.incomeMoney?true:isNameDisabled
        },

        // 在值发生改变时更新表尾合计
        updateFooterEvent (params) {
          let xTable = this.$refs.xTable
          xTable.updateFooter()
        },

        //表格尾部合计
        footerMethod ({ columns, data }) {
          return [
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '分配合计'
              }
              if (['incomeMoney', 'paidMoney'].includes(column.property)) {
                if(column.property=='incomeMoney'){
                  this.incomeMoneyTotal = this.$utils.sum(data, column.property);
                  return this.incomeMoneyTotal
                }
                if(column.property=='paidMoney'){
                  this.paidMoneyTotal = this.$utils.sum(data, column.property);
                  return this.paidMoneyTotal
                }
              }
              return null
            }),
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return '核对'
              }
              if (['incomeMoney'].includes(column.property)) {
                 this.checkTheIncome =  this.list.incomeMoney - this.$utils.sum(data, column.property)
                return this.checkTheIncome
              }
              if (['paidMoney'].includes(column.property)) {
                 this.checkTheSpending = this.list.paidMoney - this.$utils.sum(data, column.property)
                return this.checkTheSpending
              }
              return null
            })
          ]
        },

        //表格合并
        footerColspanMethod ({ columnIndex }) {
          if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 3
            }
          }else if (columnIndex === 1 || columnIndex === 2) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        },

        //点击获取当前行数据
        getOneList(v){
          this.oneList = v.selection
        },

        //全选
        getAllList(v){
          this.oneList = v.selection
        },

        //添加行
        add(){
          this.tableData.push({})
        },

      //删除选中行
        delet(){
          if (this.oneList.length == 0) return this.$Message.error('至少选择一条数据删除')
          this.oneList.forEach( item => {
           this.tableData.forEach( (el , index) => {
              if(el._XID == item._XID){
                this.tableData.splice(index , 1)
              }
            })
          })
          this.oneList = []
        },

        //确定
       async sure(){
          // if(this.checkTheSpending  !== 0 || this.checkTheIncome !== 0 ) return this.$Message.error('核对金额必须为0')
         const errMap = await this.$refs.xTable.fullValidate().catch(errMap => errMap)
         if(errMap){
         }else{
           if(this.list.incomeMoney-this.list.paidMoney!=this.incomeMoneyTotal-this.paidMoneyTotal){
             return this.$Message.error('需分配金额与分配金额不符')
           }
           let data = []
           this.tableData.forEach( item => {
             if (item.claimShopCode){
               item.id = this.list.id
               item.incomeMoney = item.incomeMoney ? item.incomeMoney : 0
               item.paidMoney = item.paidMoney ? item.paidMoney : 0
               data.push(item)
             }
           })
           let res = await manpowerChange(data)
           if(res.code === 0 ) {
             this.artificialShow = false
             this.$Message.success('人工分配完成')
             this.$emit('getNew' ,{})
           }
         }

        }
      }
    }
</script>

<style scoped lang="less">
.headerTitle {
  line-height: 24px;
  background-color: #cccccc;
  /*font-size: 20px;*/
  font-weight: 700;
}
.box {
  border: 1px #cccccc solid;
  line-height: 28px;
  text-align: center;
  .title {
    border-bottom: 1px #cccccc solid;
  }
  .rigt{
    border-right:1px #cccccc solid ;
  }
}
</style>

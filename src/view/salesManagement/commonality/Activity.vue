<template>
  <Modal v-model="showInfo" class="activity-model" title="选择活动" width="1300">
    <div class="OutboundInfo">
      <div class="header">
        <Form ref="formOne" :model="Outform" :label-width="60" inline>
          <FormItem label="配件：">
            <Input
              type="text"
              placeholder="配件编码/名称/OEM"
              class="w250"
              v-model="Outform.partCode"
            />
          </FormItem>
          <FormItem label="活动：">
            <Input
              type="text"
              placeholder="活动名称"
              class="w250"
              v-model="Outform.activityName"
            />
          </FormItem>
          <Button class="mr10" type='warning' @click="query"><Icon type="ios-search" size="14" /> 查询</Button>
          <Button class="mr10" type='default' @click="add"><Icon type="md-checkmark" /> 确定</Button>
        </Form>
      </div>
      <div class="main clearfix">
        <vxe-table
          height='350'
          border
          resizable
          auto-resize
          align="center"
          size="mini"
          highlight-hover-row
          highlight-current-row
          show-overflow="title"
          @current-change="getOneActivity"
          :data="tableDataBottom"
        >
          <vxe-table-column
            type="seq"
            width="50"
            title="序号"
          ></vxe-table-column>

          <vxe-table-column
            field="activityName"
            title="活动名称"
          ></vxe-table-column>
          <vxe-table-column
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column
            field="partBrandName"
            title="品牌"
          ></vxe-table-column>
          <vxe-table-column
            field="num"
            title="活动数量"
          ></vxe-table-column>
          <vxe-table-column
            field="price"
            title="活动单价"
          ></vxe-table-column>
          <vxe-table-column
            title="是否赠送"
          >
            <template v-slot="{row }">
              <Checkbox :value="row.isGift == 1" disabled></Checkbox>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="oemCode"
            title="OEM编码"
          ></vxe-table-column>
          <vxe-table-column
            field="carModelName"
            title="车型"
          ></vxe-table-column>
          <vxe-table-column
            field="activityId"
            title="活动ID"
          ></vxe-table-column>
          <vxe-table-column
            field="remark"
            title="备注"
          ></vxe-table-column>
          <vxe-table-column
            field="beginDate"
            title="开始日期"
          ></vxe-table-column>
          <vxe-table-column
            field="endDate"
            title="结束日期"
          ></vxe-table-column>

        </vxe-table>
      </div>
    </div>
    <div slot='footer'>
    </div>
  </Modal>
</template>

<script>
    import {getActivity} from '@/api/salesManagment/salesOrder'

    export default {
        name:'SalesOutBound',
        data(){
            return {
                showInfo: false, // 销售出库订单信息——表单
                Outform :{
                    partCode: "",
                    activityName: ""
                },
                tableDataBottom:[], //下面表格数据
                oneList:{},//获取点击到的信息
            }

        },
        methods: {
            //打开模态框
            openModal() {
                this.showInfo = true;
                this.getList()
            },
            //获取活动内容
           async getList(){
                let data ={}
                if(this.Outform.partCode.trim()){
                  data.partName = this.Outform.partCode.replace(/\s+/g,'');
                }
                if(this.Outform.activityName.trim()){
                  data.activityName = this.Outform.activityName.trim()
                }
               let res = await getActivity(data)
                  if(res.code === 0){
                      this.tableDataBottom = res.data
                  }
           },
            //查询
            query(){
                this.getList()
            },
            //获取当前点击到的数据
            getOneActivity(val){
              this.oneList = val.row
            },
            //确定
            add(){
              if( this.oneList.id==null){
                return this.$message.error('请先选择一条数据')
              }
              let arr = this.tableDataBottom.filter(el => el.activityId == this.oneList.activityId);
              this.$emit('getActivity' , arr)
              this.showInfo = false
            }
            //getActivity
        }
    }
</script>

<style lang="less" scoped>
  .bgc {
    color: #000;
    background-color: #e8e8e8;
  }
  .h40 {
    line-height: 40px;
    padding-left: 5px;
  }
</style>

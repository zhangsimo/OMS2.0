<template>
  <vxe-modal className="vxe-modal-table" v-model="showInfo" title="选择活动" id="myModal2" width="1000" height="450" min-width="900" min-height="320" resize remember transfer mask-closable :zIndex="9999">
    <template v-solt>
      <div class="OutboundInfo">
        <div class="header">
          <Form ref="formOne" :model="Outform" :label-width="60" inline>
            <FormItem label="配件：" style="margin-bottom: 10px">
              <Input
                type="text"
                placeholder="配件编码/名称/OEM"
                class="w250"
                v-model="Outform.partCode"
                @on-enter="query"
              />
            </FormItem>
            <FormItem label="活动：" style="margin-bottom: 10px">
              <Input
                type="text"
                placeholder="活动名称"
                class="w250"
                v-model="Outform.activityName"
                @on-enter="query"
              />
            </FormItem>
            <Button class="mr10" type='warning' @click="query"><Icon type="ios-search" size="14" /> 查询</Button>
            <Button class="mr10" type='default' @click="add"><Icon type="md-checkmark" /> 确定</Button>
          </Form>
        </div>
        <div class="main clearfix" style="height: 100%">
          <vxe-table
            height='auto'
            border
            resizable
            auto-resize
            align="center"
            :loading="loading"
            size="mini"
            highlight-hover-row
            highlight-current-row
            show-overflow="title"
            @current-change="getOneActivity"
            @cell-dblclick="dblclickFun"
            :data="tableDataBottom"
          >
            <vxe-table-column
              type="seq"
              width="46"
              title="序号"
            ></vxe-table-column>

            <vxe-table-column
              field="activityName"
              title="活动名称"
              min-width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="partCode"
              title="配件编码"
              min-width="90"
            ></vxe-table-column>
            <vxe-table-column
              field="partName"
              title="配件名称"
              min-width="90"
            ></vxe-table-column>
            <vxe-table-column
              field="partBrandName"
              title="品牌"
              min-width="70"
            ></vxe-table-column>
            <vxe-table-column
              field="num"
              title="活动数量"
              min-width="66"
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="活动单价"
              min-width="70"
            ></vxe-table-column>
            <vxe-table-column
              title="是否赠送"
              min-width="60"
            >
              <template v-slot="{row }">
                <Checkbox :value="row.isGift == 1" disabled></Checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="oemCode"
              title="OEM编码"
              min-width="90"
            ></vxe-table-column>
            <vxe-table-column
              field="carModelName"
              title="车型"
              min-width="70"
            ></vxe-table-column>
            <vxe-table-column
              field="activityId"
              title="活动ID"
              min-width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="remark"
              title="备注"
              min-width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="beginDate"
              title="开始日期"
              min-width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="endDate"
              title="结束日期"
              min-width="100"
            ></vxe-table-column>
          </vxe-table>
        </div>
        <div>
          <vxe-pager
            background
            size="mini"
            :current-page.sync="page.num"
            :page-size.sync="page.size"
            :total="page.total"
            :page-sizes="[10,20,30,40,50]"
            @page-change="changePage"
            :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
          </vxe-pager>
        </div>
      </div>
    </template>
  </vxe-modal>
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
              loading:false,
              page:{
                num:1,
                size:100,
                total:0
              }

            }

        },
        methods: {
          changePage({currentPage, pageSize}){
            this.page.num = currentPage;
            this.page.size = pageSize;
            this.getList();
          },
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
               data.page = this.page.num - 1;
               data.size = this.page.size;
               this.loading = true;
               let res = await getActivity(data)
                this.loading = false;
                  if(res.code === 0){
                      this.tableDataBottom = res.data.content||[];
                      this.page.total = res.data.totalElements;
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
            dblclickFun({row}){
              this.oneList = row;
              this.add();
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
  .OutboundInfo{
    height: 100%;
    display: flex;
    flex-flow: column;
  }
</style>

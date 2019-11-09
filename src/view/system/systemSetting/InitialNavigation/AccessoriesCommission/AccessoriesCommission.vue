<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10">
              <Select v-model="searchType" class="w100">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db mr10">
              <Input v-model="searchNav" placeholder="请输入查询条件" style="width: 120px"></Input>
            </div>
            <div class="db">
              <Button class="mr10 w90" type="warning" @click="Search"><span class="center"><Icon custom="iconfont iconchaxunicon icons" />查询</span></Button>
              <Button class="mr10 w90" @click="Add"><span class="center"><Icon type="md-add"/>添加配件</span></Button>
              <Button class="mr10 w90" @click="Remove"><span class="center"><Icon custom="iconfont iconlajitongicon icons" />删除配件</span></Button>
              <Button class="mr10 w90" @click="Save"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <Table class="table-highlight-row" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata" on-selection-change="selection"></Table>
        <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
              @on-page-size-change="changeSize" show-sizer show-total>
        </Page>
      </section>
        <!--配件选择弹框-->
      <Modal v-model="modal" title="配件选择" :footer-hide="true" width="1020">
        <Dia-log></Dia-log>
      </Modal>
    </div>
</template>

<script>
  import DiaLog from '../../../../../components/Accessories/dialog';
    export default {
        name: "AccessoriesCommission",
        components:{
          DiaLog
        },
      data(){
          return {
            List: [
              {
                value: 0,
                name: '编码'
              },
              {
                value: 1,
                name: '名称'
              }],
            searchType: 0,
            searchNav: '',
            columns: [
              {
                title: '序号',
                align: 'center',
                width: 70,
                type: 'index'
              },
              {
                title: '',
                type:'selection',
                align:'center',
                Width: 70
              },
              {
                title: '配件名称',
                align:'left',
                key: '',
                minWidth: 120
              },
              {
                title: '销售提成类型',
                align:'left',
                key: '',
                minWidth: 170
              },
              {
                title: '销售提成比例（%）',
                align:'left',
                key: '',
                minWidth: 120
              },
              {
                title: '备注',
                align:'left',
                key: '',
                minWidth: 120
              },
              {
                title: '操作人',
                align:'left',
                key: '',
                minWidth: 120
              },
              {
                title: '操作日期',
                align:'left',
                key: '',
                minWidth: 120
              }
            ],
            loading:false,
            tbdata: [],
            page: {
              num: 1,
              size: 10,
              total: 0
            },
            modal: false
          }
      },
      methods:{
          //获取数据
        //搜索
        Search(){},
        //添加
        Add(){},
        //移除
        Remove(){},
        //保存
        Save(){},
        //分页
        changePage(p) {
          // console.log(p)
          this.page.num = p
          // this.getList()
        },
        changeSize(size) {
          // console.log(size)
          this.page.num = 1
          this.page.size = size
          // this.getList()
        },
      }
    }
</script>

<style scoped>
 @import "../../../../lease/lease/index.css";
</style>

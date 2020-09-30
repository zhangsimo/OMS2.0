<template>
  <Modal v-model="SelectAccountSet" title="选择账套" width="750px">
    <div>
      <Form inline :label-width="100">
        <FormItem label="单位/门店：">
          <Input v-model="monad" style="width: 200px" placeholder="编码或简称、全称" class="mr10" />
          <Button type="warning" class="mr10" @click="searchMonad">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div>
      <vxe-table
        border
        resizable
        :data="AssistTableDataKeHu"
        stripe
        size="mini"
        align="center"
        :auto-resize="true"
        @radio-change="radioChangeEventClient"
        highlight-hover-row
        highlight-current-row
        show-overflow
        height="400"
      >
        <vxe-table-column type="radio" title="选择"></vxe-table-column>
        <vxe-table-column field="code" title="单位/门店编码"></vxe-table-column>
        <vxe-table-column field="shortName" title="单位/门店简称"></vxe-table-column>
        <vxe-table-column field="name" title="单位/门店全称"></vxe-table-column>
      </vxe-table>
    </div>
    <div class="h50">
      <Page
        size="small"
        :total="client.page.total"
        :page-size="client.page.size"
        :current="client.page.num"
        :page-size-opts="client.page.sizeOpts"
        show-sizer
        show-total
        show-elevator
        @on-change="selectNumClient"
        @on-page-size-change="selectPageClient"
        style="float: right;margin-top: 10px;margin-right: 10px"
      />
    </div>
    <div slot="footer">
      <Button type="primary" @click="SubjectConfirm" class="mr10">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { findAccountCompanyPage,getSupplierformation/**区域资产负债表搜索*/ } from "@/api/financialStatements/index.js";
export default {
  data() {
    return {
      OneData:{},//选中的数据
      SelectAccountSet: false,
      monad: "", //单位/门店
      AssistTableDataKeHu: [],
      client: {
        page: {
          num: 1,
          size: 10,
          total: 0,
          sizeOpts: [10, 20, 30, 40, 50]
        } //分页
      }
    };
  },
  methods: {
    //单位/门店弹框查询
    searchMonad() {
      this.GetListTwo();
    },
    //确认
    SubjectConfirm() {
      if(Object.keys(this.OneData).length!==0){
        this.$emit("companyClient", this.OneData);
        this.SelectAccountSet=false
      } else {
        this.$message({message:'请先选择数据',type:'error',customClass:'zZindex'})
      }
    },
    //客户分页切换页数
    selectNumClient(page) {
      this.client.page.num = page;
      this.GetListTwo();
    },
    //客户切换分页条数
    selectPageClient(size) {
      this.client.page.num = 1;
      this.client.page.size = size;
      this.GetListTwo();
    },
    //门店弹框的表格单选
    radioChangeEventClient({ row }) {
      this.OneData = row;
    },
    //初始化列表
    GetListTwo() {
      // findAccountCompanyPage().then(res => {
      //   if (res.code === 0) {
      //     this.AssistTableDataKeHu = res.data.content;
      //     this.client.page.total = res.data.totalElements;
      //   }
      // });
      let data={}
      data.page=this.client.page.num-1
      data.size=this.client.page.size
      data.name=this.monad
      getSupplierformation(data).then(res=>{
        this.AssistTableDataKeHu = res.data.content;
        this.client.page.total = res.data.totalElements;
      })
    }
  }
};
</script>
<style scoped>
.zZindex{
   z-index:3000 !important;
}
</style>

<template>
  <div>
    <div class="orderList">
      <h5>销售订单列表</h5>
    </div>
    <div class="orderCenter">
      <vxe-table
        border
        align="center"
        size="mini"
        @current-change="clickOnesList"
        highlight-hover-row
        highlight-current-row
        style="width: 1000px"
        height="593"
        :data="tableData"
      >
        <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="billStatusId" title="状态">
          <template v-slot="{ row }">
            <span>{{row.billStatusId.name}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="guestName" title="客户"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建日期"></vxe-table-column>
        <vxe-table-column field="orderMan" title="销售员"></vxe-table-column>
        <vxe-table-column field="serviceId" title="销售订单单号"></vxe-table-column>
        <vxe-table-column field="printTimes" title="打印次数"></vxe-table-column>
        <vxe-table-column field="auditor" title="提交人"></vxe-table-column>
        <vxe-table-column field="auditDate" title="提交日期"></vxe-table-column>
        <vxe-table-column field="createUname" title="创建人"></vxe-table-column>
      </vxe-table>
    </div>
    <Page
      :total="page.total"
      :page-size="page.size"
      size="small"
      :current="page.num"
      show-sizer
      show-total
      class-name="page-con"
      @on-change="selectNum"
      @on-page-size-change="selectPage"
      :page-size-opts="[10,20,30,40,50]"
      class="mr10"
    ></Page>
  </div>
</template>

<script>
import { getLeftList } from "@/api/salesManagment/salesOrder";

export default {
  name: "OrderLeft",
  props: {
    queryTime: "", //时间查询
    orderType: "", //状态查询
    changeLeftList: "" //改变list
  },
  data() {
    return {
      page: {
        total: 0,
        size: 10,
        num: 1
      },
      tableData: [],
      isAdd:true,//判断是否新增
      query: {
        showPerson: 1
      } //更多搜索信息
    };
  },
  mounted() {
    this.gitlistValue();
  },
  computed: {
    queryall() {
      return this.$store.state.dataList.orederQueryList;
    },
    getRightType() {
      return this.$store.state.dataList.leftList;
    }
  },
  methods: {
    // 新增展示
    getAdd() {
      if (!this.isAdd) {
        return this.$Message.error('请先保存数据');
      }
      this.isAdd=false
      this.tableData.unshift({
        billStatusId: { enum: "", value: "", name: "" },
        orderMan: this.$store.state.user.userData.staffName,
        orderManId:  this.$store.state.user.userData.id
      });
    },
    //获取表格数据
    async gitlistValue() {
      let data = {};
      data.startTime = this.queryTime[0] || "";
      data.endTime = this.queryTime[1] || "";
      data.billStatusId = this.orderType;
      // data = this.query
      let page = this.page.num - 1;
      let size = this.page.size;
      let res = await getLeftList(page, size, data);
      if (res.code === 0) {
        // res.data.content.map( item => item.billStatusId = JSON.parse(item.billStatusId))
        this.tableData = res.data.content;
        this.page.total = res.data.totalElements;
        this.$store.commit("setOneOrder", {});
      }
    },
    //切换页面
    selectNum(val) {
      this.page.num = val;
      this.gitlistValue();
    },
    //切换页数
    selectPage(val) {
      this.page.num = 1;
      this.page.size = val;
      this.gitlistValue();
    },
    //点击获取当前信息
    clickOnesList(data) {
      console.log('00000',data)
      this.$emit("getOneOrder", data.row);
      this.$store.commit("setOneOrder", data.row);
    }
  },
  watch: {
    //监听时间
    queryTime: function(val, old) {
      this.page.num = 1;
      this.page.size = 10;
      this.gitlistValue();
    },
    //监听状态
    orderType: function(val, old) {
      this.page.num = 1;
      this.page.size = 10;
      this.gitlistValue();
    },
    //更多搜索
    queryall: {
      handler(v, ov) {
        v.showPerson = v.showPerson ? 1 : 0;
        this.page.num = 1;
        // this.page.size = 10;
        let page = this.page.num - 1;
        let size = this.page.size;
        getLeftList(page, size, v).then(res => {
          if (res.code === 0) {
            // res.data.content.map( item => {item.billStatusId = JSON.parse(item.billStatusId)})
            this.tableData = res.data.content;
            this.page.total = res.data.totalElements;
          }
        });
      },
      deep: true
    },
    //改变左侧list
    changeLeftList: {
      handler(v, ov) {
        this.page.num = 1;
        this.page.size = 10;
        this.gitlistValue();
      },
      deep: true
    },
    //右侧保存 提交
    getRightType: {
      handler(v, ov) {
        if (v.code === 0) {
          this.page.num = 1;
          this.page.size = 10;
          this.gitlistValue();
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="less">
.orderList {
  line-height: 30px;
  padding-left: 10px;
  /*border-bottom: 1px solid #dcdee2;*/
  background-color: #f8f8f8;
}
.orderCenter {
  overflow: hidden;
  overflow-x: scroll;
}
</style>

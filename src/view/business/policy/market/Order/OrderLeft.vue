<template>
  <div>
    <div class="orderList">
      <h5>销售出库单列表</h5>
    </div>
    <div class="orderCenter">
      <vxe-table
        border
        ref="xTab"
        align="center"
        size="mini"
        @current-change="clickOnesList"
        highlight-hover-row
        highlight-current-row
        style="width: 1000px"
        height="593"
        :data="tableData"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="billTypeName" title="状态"></vxe-table-column>
        <vxe-table-column field="guestName" title="客户"></vxe-table-column>
        <vxe-table-column field="orderMan" title="销售员"></vxe-table-column>
        <vxe-table-column field="serviceId" title="出库单号"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建日期"></vxe-table-column>
        <vxe-table-column field="createUname" title="创建人"></vxe-table-column>
        <vxe-table-column field="print" title="打印次数"></vxe-table-column>
        <vxe-table-column field="outDate" title="出库日期"></vxe-table-column>
        <vxe-table-column field="outMan" title="出库人"></vxe-table-column>
      </vxe-table>
    </div>
    <Page
      :total="page.total"
      :page-size="page.size"
      size="small"
      :page-size-opts="[20, 50, 100, 200]"
      :current="page.num"
      show-sizer
      show-total
      class-name="page-con"
      @on-change="selectNum"
      @on-page-size-change="selectPage"
      class="mr10"
    ></Page>
  </div>
</template>

<script>
import { getList1 } from "@/api/business/market.js";
import moment from "moment";

export default {
  name: "OrderLeft",
  props: {
    queryTime: "", //时间查询
    orderType: "", //状态查询
    changeLeftList: "" //改变list
  },
  data() {
    return {
      flag: 0,
      rightFlag:0,//0为初始化时候，1为保存、修改、作废等操作回调
      leftClickItemId:"",
      page: {
        total: 0,
        size: 20,
        num: 1
      },
      tableData: [],
      query: {
        showPerson: 1
      } //更多搜索信息
    };
  },
  watch: {
    changeLeftList: {
      handler(newVal) {
        // console.log(newVal)
        this.tableData = newVal;
      },
      deep: true
    }
  },
  mounted() {
    this.getList();
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
    addItem() {
      this.flag = 1
      if (this.tableData.length === 0) {
      } else {
        if (this.tableData[0]["xinzeng"] === "1") {
          this.$Message.info(
            "当前销售出库列表已有一个新增单等待操作,请先保存当前操作新增单据"
          );
          return;
        }
      }
      const item = {
        index: 1,
        xinzeng: "1",
        billTypeName: "草稿",
        billStatusId: 0,
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        orderMan: this.$store.state.user.userData.staffName,
        orderManId: this.$store.state.user.userData.id,
        remark: "",
        guestId: "",
        // storeId: this.$parent.$parent.$refs.right.WarehouseList[0].id||"",
        serviceId: "",
        details: []
      };
      this.$parent.$parent.$refs.right.WarehouseList.forEach(el => {
        if(el.isDefault && !el.isDisabled) {
          item.storeId = el.id
        }
      })
      this.tableData.unshift(item);
      this.tableData.map((item, index) => {
        item.index = index + 1;
      });
      this.$parent.$parent.orderlistType = 0;
      this.$refs.xTab.setCurrentRow(item);
      this.$store.commit("setOneOrder", item);
      this.leftClickItemId = "";
    },
    getData(data) {
      // console.log(data, '该值')
      this.tableData = data.content;
      this.page.size = 20;
      this.page.num = 0;
      this.page.total = data.totalElements;
    },
    //获取表格数据
    async getList() {
      let data = {};
      data.startTime = this.queryTime[0] || "";
      data.endTime = this.queryTime[1] || "";
      data.billStatusId = this.orderType;
      // console.log(this.orderType)
      // data = this.query
      let page = this.page.num - 1;
      let size = this.page.size;
      let res = await getList1(page, size, data);
      if (res.code === 0) {
        this.$parent.$parent.$refs.right.$refs.formPlan.resetFields();
        // res.data.content.map( item => item.billStatusId = JSON.parse(item.billStatusId))
        this.tableData = res.data.content;
        this.page.total = res.data.totalElements;
        this.$store.commit("setOneOrder", {});
        //点击保存按钮右侧数据保存成功后执行
        if(this.rightFlag){
          this.rightFlag = 0
          //解除禁用保存按钮
          this.$parent.$parent.isSaveClick = false
          if(this.leftClickItemId){
            for(let item of this.tableData){
              if(item.id==this.leftClickItemId){
                this.$refs.xTab.setCurrentRow(item)
                this.clickOnesList({row:item})
                break
              }
            }
            // this.leftClickItemId = "";
          }else{
            this.$refs.xTab.setCurrentRow(this.tableData[0])
            this.clickOnesList({row:this.tableData[0]})
          }
        }
      }
    },
    //右侧保存成功调用
    dataSaveSuccess(){
      this.flag = 0;
      this.rightFlag = 1;
      this.getList();
    },
    //切换页面
    selectNum(val) {
      this.page.num = val;
      this.getList();
    },
    //切换页数
    selectPage(val) {
      this.page.num = 1;
      this.page.size = val;
      this.getList();
    },
    //点击获取当前信息
    clickOnesList(data) {
      if (this.flag) {
        this.$Modal.confirm({
          title: "您正在编辑单据，是否需要保存",
          onOk: () => {
            this.$parent.$parent.setSave()
          },
          onCancel: () => {
            this.getList();
            this.flag = 0;
          }
        });
        return;
      }
      if(data.row.id){
        this.leftClickItemId = data.row.id;
      }
      this.$parent.$parent.$refs.right.$refs.formPlan.resetFields();
      let obj = {};
      obj = JSON.parse(JSON.stringify(data.row));
      this.$emit("getOneOrder", obj);
      this.$store.commit("setOneOrder", obj);
    }
  },
  watch: {
    //监听时间
    queryTime: function(val, old) {
      this.page.num = 1;
      this.page.size = 20;
      this.getList();
    },
    //监听状态
    orderType: function(val, old) {
      this.page.num = 1;
      this.page.size = 20;
      this.getList();
    },
    //更多搜索
    // queryall: {
    //   handler(v, ov) {
    //     v.showPerson = v.showPerson ? 1 : 0;
    //     this.page.num = 1;
    //     this.page.size = 20;
    //     let page = this.page.num - 1;
    //     let size = this.page.size;
    //     getList1(page, size, v).then(res => {
    //       console.log(v)
    //       if (res.code === 0) {
    //         res.data.content.map(
    //           item => (item.billStatusId = JSON.parse(item.billStatusId))
    //         );
    //         this.tableData = res.data.content;
    //         this.page.total = res.data.totalElements;
    //       }
    //     });
    //   },
    //   deep: true
    // },
    //改变左侧list
    changeLeftList: {
      handler(v, ov) {
        this.page.num = 1;
        this.page.size = 20;
        //作废
        this.flag = 0;
        this.rightFlag = 1;

        this.getList();
      },
      deep: true
    },
    //右侧保存 提交
    getRightType: {
      handler(v, ov) {
        if (v.code === 0) {
          this.page.num = 1;
          this.page.size = 20;
          this.getList();
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

<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>快速查询：</span>
            <quickDate @quickDate="getData"></quickDate>
          </div>
          <div class="db flex">
            <span>开始日期：</span>
            <DatePicker
              @on-change="selectDate"
              @on-clear="aaa"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr20"
            ></DatePicker>
          </div>
          <div class="db mr10">
            <Select v-model="searchType2" class="w100">
              <Option v-for="item in ListTwo" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <!--<Input v-model="productName" placeholder="请输入申请公司" style="width: 120px" class="mr10"></Input>-->
            <Select v-model="productName" class="w100 mr10">
              <Option
                v-for="item in purchaseNameArr"
                :value="item.id"
                :key="item.id"
              >{{item.fullName}}</Option>
            </Select>
            <Button type="warning" class="mr10 w90" @click="search">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="boxbox">
        <div class="top">
          <div>
            <div class="pl10 pr10 Tablebox">
              <vxe-table
                class="aaabox"
                border
                resizable
                :data="topRight.tbdata"
                :edit-config="{trigger: 'click', mode: 'cell'}"
                @current-change="clickOnesList"
                highlight-hover-row
                highlight-current-row
                @edit-actived="editActivedEvent"
                @edit-closed="editClosedEvent"
              >
                <vxe-table-column title="序号" type="index" width="60"></vxe-table-column>
                <vxe-table-column field title="操作">
                  <template v-slot="{row,rowIndex}">
                    <div v-show="row.status.value === 1">
                      <vxe-button type="primary" size="small" @click="acceptance">受理</vxe-button>
                      <vxe-button size="small" @click="refuse">拒绝</vxe-button>
                    </div>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="guestName" title="申请公司"></vxe-table-column>
                <vxe-table-column field="serviceId" title="调拨申请单号"></vxe-table-column>
                <vxe-table-column field="status" title="状态">
                  <template v-slot="{row,rowIndex}">
                    <span>{{row.status.name}}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="createTime" title="提交日期"></vxe-table-column>
                <vxe-table-column field="orderDate" title="申请日期"></vxe-table-column>
                <vxe-table-column field="remark" title="备注"></vxe-table-column>
                <vxe-table-column field title="受理人"></vxe-table-column>
                <vxe-table-column field title="受理日期"></vxe-table-column>
              </vxe-table>
              <Page
                class-name="page-con"
                :current="topRight.page.num"
                :total="topRight.page.total"
                :page-size="topRight.page.size"
                @on-change="changePageTop"
                @on-page-size-change="changeSizeTop"
                show-sizer
                show-total
              ></Page>
            </div>
          </div>
        </div>
        <div class="bottom pt10">
          <div class="pl10 pr10 Tablebox">
            <vxe-table
              class="BottomBox"
              border
              resizable
              show-footer
              :data="Bottom.tbdata"
              :edit-config="{trigger: 'click', mode: 'cell'}"
              :footer-method="footerMethod"
              @edit-actived="editActivedEvent"
              @edit-closed="editClosedEvent"
            >
              <vxe-table-column title="序号" type="index" width="60"></vxe-table-column>
              <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
              <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
              <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
              <vxe-table-column field="unit" title="单位"></vxe-table-column>
              <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
              <vxe-table-column field="applyQty" title="申请数量"></vxe-table-column>
              <vxe-table-column field title="紧销品" type="checkbox">
                <template v-slot="{ row,rowIndex }">
                  <Checkbox disabled :value="row.isTightPart == 1"></Checkbox>
                </template>
              </vxe-table-column>
              <vxe-table-column field="remark" title="备注"></vxe-table-column>
            </vxe-table>
            <!--<Page class-name="page-con" :current="Bottom.page.num" :total="Bottom.page.total" :page-size="Bottom.page.size" @on-change="changePageBottom"-->
            <!--@on-page-size-change="changeSizeBottom" show-sizer show-total>-->
            <!--</Page>-->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QuickDate from "../../../../components/getDate/dateget";
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
import {
  findAll,
  findById,
  getSupplierList,
  allotMainAccept
} from "../../../../api/AlotManagement/transferringOrder";
import { findForAllot } from "_api/purchasing/purchasePlan";
export default {
  name: "Acceptances",
  components: {
    QuickDate
  },
  data() {
    return {
      rightTableHeight: 0,
      purchaseNameArr: [{ fullName: "全部", id: "9999" }], //申请公司名称
      selectOne: "", //定义变量赋值日期子组件的数据
      searchType2: "9999", //绑定的下拉框
      ListTwo: [
        { label: "所有", value: "9999" },
        { label: "待受理", value: "UNACCEPTED" },
        { label: "已受理", value: "ACCEPTED" },
        { label: "已拒绝", value: "REJECTED" }
      ],
      productName: "9999",
      topRight: {
        loading: false,
        tbdata: [],
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        newArr: [] //表格新数组，用于赋值
      },
      Bottom: {
        loading: false,
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        tbdata: []
      },
      RowMessage: [] //上半部分当前行
    };
  },
  methods: {
    //  日期选择器从子组件哪来的数据
    getData(A) {
      this.selectOne = A;
    },
    //选中的日期
    selectDate(date) {
      this.dateTime = date;
    },
    //搜索
    search() {
      this.getList();
    },
    //底部的每行点击事件
    selctionBottom(a) {},
    //多选框
    selctionTopBottom(a) {},
    // 单元格被激活事件
    editActivedEvent({ row, column }, event) {
      console.log(`打开 ${column.title} 列编辑`);
    },
    // 单元格被关闭事件
    editClosedEvent({ row, column }, event) {
      console.log(`关闭 ${column.title} 列编辑`);
    },
    //合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            let tex = this.Bottom.tbdata.length;
            return tex;
          }
          if (["applyQty"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    //分页上部分
    changePageTop(p) {
      this.topRight.page.num = p;
      this.getList();
    },
    changeSizeTop(size) {
      this.topRight.page.num = 1;
      this.topRight.page.size = size;
      this.getList();
    },
    //分页下部分
    changePageBottom(p) {
      this.Bottom.page.num = p;
      // this.getList()
    },
    changeSizeBottom(size) {
      this.Bottom.page.num = 1;
      this.Bottom.page.size = size;
      // this.getList()
    },
    aaa() {},
    //点击一行
    clickOnesList(a) {
      this.RowMessage = a.row;
      // console.log(a.row)
      // console.log(this.RowMessage)
      let params = {};
      params.id = this.RowMessage.id;
      findById(params).then(res => {
        this.Bottom.tbdata = res.data.detailVOS;
      });
    },
    // 初始化
    getList() {
      let params = {};
      params.page = this.topRight.page.num - 1;
      params.size = this.topRight.page.size;
      if (this.selectOne !== "9999") {
        params.startTime = this.selectOne[0];
        params.endTime = this.selectOne[1];
      }
      if (this.dateTime) {
        params.startDate = this.dateTime[0] + " 00:00:00";
        params.endDate = this.dateTime[1] + " 23:59:59";
      }
      if (this.searchType2 !== "9999") {
        params.status = this.searchType2;
      }
      if (this.productName !== "9999") {
        params.guestId = this.productName;
      }
      findAll(params).then(res => {
        if (res.code === 0) {
          this.topRight.tbdata = res.data.content;
          this.topRight.page.total = res.data.totalElements;
        }
      });
    },
    //受理
    acceptance() {
      this.$Modal.confirm({
        title: "是否受理",
        onOk: async () => {
          let data = this.RowMessage;
          data.detailVOS = this.Bottom.tbdata;
          data.status = 2;
          data.orderTypeId = this.RowMessage.orderTypeId.value;
          data.settleStatus = this.RowMessage.settleStatus.value;
          // console.log(data)
          let res = await allotMainAccept(data);
          if (res.code === 0) {
            this.$Message.success("受理成功");
            this.getList();
          }
        },
        onCancel: () => {
          this.$Message.info("受理取消");
        }
      });
    },
    refuse() {
      this.$Modal.confirm({
        title: "是否拒绝调拨受理",
        onOk: async () => {
          let data = this.RowMessage;
          data.detailVOS = this.Bottom.tbdata;
          data.orderTypeId = this.RowMessage.orderTypeId.value;
          data.settleStatus = this.RowMessage.settleStatus.value;
          data.status = "7";
          // console.log(data)
          let res = await allotMainAccept(data);
          if (res.code === 0) {
            this.$Message.success("受理成功");
            this.getList();
          }
        },
        onCancel: () => {
          this.$Message.info("取消拒绝");
        }
      });
    },
    // 供应商
    supplier() {
      let params = {};
      findForAllot(params).then(res => {
        if (res.code === 0) {
          this.purchaseNameArr.push(...res.data.content);
        }
      });
    }
  },
  mounted() {
    this.getList();
    this.supplier();
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}
.boxbox {
  height: 700px;
  background: #ffffff;
}
.top,
.bottom {
  width: 100%;
  height: 50%;
}
.top {
  border-bottom: 1px solid lightgray;
}
.Tablebox {
  height: 320px;
  overflow-y: auto;
}
</style>

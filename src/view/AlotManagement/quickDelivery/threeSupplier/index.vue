<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span class="mr10">快速：</span>
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span class="mr10">提交日期：</span>
            <DatePicker
              @on-change="selectDate"
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              class="w200 mr20"
            ></DatePicker>
          </div>
          <div class="db mr10">
            <Select v-model="form.billStatusId " class="w100 mr10" clearable>
              <Option value="2" label="待入库"></Option>
              <Option value="3" label="已入库"></Option>
              <Option value="4" label="部分入库"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input v-model="form.serviceId" placeholder="业务单号" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Select
              v-model="form.guestId"
              class="w100 mr10"
              placeholder="选择客户"
              filterable
              clearable
            >
              <Option
                v-for="item in customerListOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input v-model="form.partCode" placeholder="配件编码" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Input v-model="form.partName" placeholder="配件名称" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20" @click="search(form)">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section class="con-box">
      <!--         上表格-->
      <div class="topTableDate" style="height:45%">
        <vxe-table
          border
          resizable
          highlight-current-row
          highlight-hover-row
          @current-change="currentChangeEvent"
          size="mini"
          height="auto"
          :data="TopTableData"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column type="index" title="序号"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row,rowIndex }">
              <Button type="text" @click="ruku">到货入库</Button>
            </template>
          </vxe-table-column>

          <vxe-table-column field="serviceId" title="业务单号"></vxe-table-column>
          <vxe-table-column field="guestName" title="供应商名称"></vxe-table-column>
          <vxe-table-column field="billStatusName" title="状态"></vxe-table-column>

          <vxe-table-column field="orderMan" title="采购员"></vxe-table-column>
          <vxe-table-column field="billTypeName" title="票据类型"></vxe-table-column>
          <vxe-table-column field="settleTypeName" title="结算方式" width="100"></vxe-table-column>
          <vxe-table-column field="auditor" title="提交人" width="100"></vxe-table-column>
          <vxe-table-column field="auditDate" title="提交日期"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column
            field="enterStoreId"
            title="入库仓库"
            :edit-render="{name: 'select', options: storeArray,events: {change: roleChangeEvent}}"
          ></vxe-table-column>
          <vxe-table-column field="enterTime" title="入库日期" width="100"></vxe-table-column>
          <vxe-table-column field="enterUname" title="操作人" width="100"></vxe-table-column>
        </vxe-table>
      </div>
      <Modal v-model="modal2" title="提示" @on-ok="ok1" @on-cancel="cancel">
        <span>
          <Icon type="information"></Icon>是否确认已到货入库!
        </span>
      </Modal>
      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page+1"
              :total="pageList.total"
              :page-size="pageList.size"
              :page-size-opts="pageList.pageSizeOpts"
              show-sizer
              @on-change="changePage"
              @on-page-size-change="changeSize"
            />
          </div>
        </Col>
      </Row>
      <!--        下表格-->
      <div class="bottomTableDate" style="height:45%">
        <vxe-table
          border
          resizable
          highlight-current-row
          highlight-hover-row
          size="mini"
          height="auto"
          :data="BottomTableData"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
        >
          <vxe-table-column type="index" title="序号"></vxe-table-column>

          <!-- <vxe-table-column title="操作" width="80">
                <template v-slot="{ row }">
                  <Button type="text">查看</Button>
                </template>
          </vxe-table-column>-->

          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="orderQty" title="订单数量"></vxe-table-column>

          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column field="trueEnterQty" title="已入库数量"></vxe-table-column>
          <vxe-table-column field="adjustQty" title="已取消数量"></vxe-table-column>
          <vxe-table-column
            field="thisQty"
            title="本次入库数量"
            :edit-render="{name: 'input', attrs: {type: 'number'},events: {change: numChangeEvent}}"
          ></vxe-table-column>

          <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column field="spec" title="规格"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
  </div>
</template>

<script>
import QuickDate from "../../../../components/getDate/dateget";
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
import {
  zongbuzhidiaoList,
  ListDetail,
  getbayer,
  daohuoruku,
  getcangku
} from "../../../../api/AlotManagement/threeSupplier.js";
export default {
  name: "threeSupplier",
  components: {
    QuickDate
  },
  data() {
    return {
      modal2: false,
      form: {
        auditStartDate: "",
        auditEndDate: "",
        startDate: "",
        endDate: "",
        billStatusId: "",
        serviceId: "",
        guestId: "",
        partCode: "",
        partName: "",
        step: 4
      },
      TopTableData: [], //上侧表格list
      BottomTableData: [], //下侧表格list
      // 分页数据
      pageList: {
        page: 0,
        total: 0,
        pageSize: 10,
        pageSizeOpts: [10, 20, 30, 40, 50]
      },
      pageTotal: 10,
      selectOne: "",
      dateTime: "",
      currentrow: {},
      storeArray: [],
      customerListOptions: []
    };
  },
  created() {
    this.log();
    this.search();
  },
  methods: {
    log() {
      getcangku().then(res => {
        if (res.code === 0) {
          res.data.forEach(element => {
            this.storeArray.push({ value: element.id, label: element.name });
          });
          //console.log(11, this.storeArray);
        }
      });
      getbayer()
        .then(res => {
          if (res.code == 0) {
            //console.log(res);
            res.data.content.forEach(element => {
              this.customerListOptions.push({
                value: element.id,
                label: element.fullName
              });
            });
          }
        })
        .catch(e => {
          this.$Message.info("拒绝失败");
        });
    },
    //time1
    getDataQuick(val) {
      this.form.auditStartDate = val[0];
      this.form.auditEndDate = val[1];
    },
    //time2
    selectDate(val) {
      this.form.auditStartDate = val[0] + " " + "00:00:00";
      this.form.auditEndDate = val[1] + " " + "23:59:59";
    },
    //搜索
    search() {
      let page = this.pageList.page;
      let size = this.pageList.size;
      //console.log(this.form, "this.form");
      zongbuzhidiaoList(page, size, this.form).then(res => {
        if (res.code === 0) {
          this.TopTableData = res.data.content || [];
          this.pageList.total = res.totalElements;
          for (var i = 0; i < this.TopTableData.length; i++) {
            this.TopTableData[i].enterStoreId = this.storeArray[0].value;
          }
          //console.log(this.TopTableData, "this.TopTableData ==>257");
        }
      });
    },
    changeSize(s) {
      this.pageList.page = 0;
      this.pageList.size = s;
      this.search(this.form);
    },
    changePage(p) {
      this.pageList.page = p;
      this.search(this.form);
    },
    //点击当前
    currentChangeEvent({ row }) {
      //console.log("当前行" + row);
      this.BottomTableData = row.details;
      this.currentrow = row;
    },

    ok1() {
      daohuoruku(this.currentrow)
        .then(res => {
          if (res.code === 0) {
            //console.log(res);
            this.$Message.info("入库成功");
          }
        })
        .catch(e => {
          this.$Message.info("入库失败");
        });
    },
    cancel() {
      this.$Message.info("点击了取消");
    },
    ruku() {
      this.modal2 = true;
    },
    numChangeEvent({ row }, evnt) {
      //console.log(evnt.target.value);
      this.currentrow.details.trueEnterQty = evnt.target.value;
    },
    roleChangeEvent({ row }, evnt) {
      // 使用内置 select 需要手动更新，使用第三方组件如果是 v-model 就不需要手动赋值
      //console.log(evnt.target.value);
      this.currentrow.enterStoreId = evnt.target.value;
    }
  }
};
</script>

<style scoped>
</style>



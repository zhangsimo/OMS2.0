<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span class="mr10">快速查询：</span>
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span class="mr10">出库日期：</span>
            <DatePicker
              @on-change="selectDate"
              v-model="form.dateValue"
              type="daterange"
              placeholder="选择日期"
              class="w200 mr20"
            ></DatePicker>
          </div>
          <div class="db mr10">
            <Select v-model="form.isEnter" class="w100 mr10" clearable>
              <Option value="0" label="待入库"></Option>
              <Option value="1" label="已入库"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input v-model="form.serviceId" placeholder="受理单号" style="width: 160px" class="mr10"></Input>
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
    <Modal v-model="modal2" title="提示" @on-ok="ok1" @on-cancel="cancel">
      <span>
        <Icon type="information"></Icon>是否确认已到货入库!
      </span>
    </Modal>
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
          <vxe-table-column field="orgName" title="调出方"></vxe-table-column>
          <vxe-table-column field="code" title="受理单号"></vxe-table-column>
          <vxe-table-column field="serviceId" title="出库单号"></vxe-table-column>
          <vxe-table-column field="enterStatus" title="状态"></vxe-table-column>
          <vxe-table-column field="createTime" title="出库日期"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <!-- <vxe-table-column
            field="enterStoreId"
            title="入库仓库"
            :edit-render="{name: 'select', options: storeArray,events: {change: roleChangeEvent}}"
          ></vxe-table-column>-->
          <!-- <vxe-table-column title="入库仓库"> -->
          <!-- <template v-slot="{ row,rowIndex }">
              <select >
                <option
                  v-for="(item,index) in storeArray"
                  :key="index"
                  :value="item.value"
                >{{item.label}}</option>
              </select>
            </template>
          </vxe-table-column>-->
          <vxe-table-column
            field="enterStoreId"
            title="入库仓库"
            :edit-render="{name: 'select', options: storeArray,events: {change: roleChangeEvent}}"
          ></vxe-table-column>
          <vxe-table-column field="enterDate" title="入库日期" width="100"></vxe-table-column>
          <vxe-table-column field="enterUname" title="操作人" width="100"></vxe-table-column>
        </vxe-table>
      </div>
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
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="hasOutQty" title="出库数量"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column
            field="hasInQty"
            title="入库数量"
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
  getcangku,
  zongbuzhidiaoList,
  daohuoruku
} from "../../../../api/AlotManagement/threeHeadquarters.js";
export default {
  name: "threeHeadquarters",
  components: {
    QuickDate
  },
  data() {
    return {
      modal2: false,
      //查询条件
      form: {
        auditStartDate: "",
        auditEndDate: "",
        startDate: "",
        endDate: "",
        isEnter: "",
        serviceId: "",
        code: "",
        partCode: "",
        partName: "",
        dateValue: ""
      },
      // 快速查询数据1
      quickArray: [
        {
          value: "本周",
          label: "本周"
        },
        {
          value: "上周",
          label: "上周"
        },
        {
          value: "本月",
          label: "本月"
        },
        {
          value: "上月",
          label: "上月"
        },
        {
          label: "本年",
          value: "本年"
        }
      ],
      // 代销售条件查询
      penSalesData: {
        character: "", // 快速查询
        company: "", //公司选择
        customer: "" //客户
      },
      customerListOptions: [], //选择客户下拉列表
      companyListOptions: [], //选择公司下拉列表
      //上表
      TopTableData: [],
      //下侧表格list
      BottomTableData: [],
      // 分页数据
      pageList: {
        page: 0,
        total: 0,
        size: 50,
        pageSizeOpts: [50, 100, 150, 200]
      },
      storeArray: []
    };
  },
  created() {
    this.search();
    this.log();
  },
  methods: {
    log() {
      getcangku().then(res => {
        if (res.code === 0) {
          //console.log(res.data, "res.data==>225");
          res.data.forEach(element => {
            this.storeArray.push({ value: element.id, label: element.name });
          });
          ////console.log(11, this.storeArray);
        }
      });
    },
    //搜索
    search() {
      let page = this.pageList.page;
      let size = this.pageList.size;

      //console.log(this.form, "this.form");
      zongbuzhidiaoList(page, size, this.form)
        .then(res => {
          if (res.code === 0) {
            this.TopTableData = res.data.content || [];
            this.pageList.total = res.totalElements;
            for (var i = 0; i < this.TopTableData.length; i++) {
              this.TopTableData[i].enterStoreId = this.storeArray[0].value;
            }
            //console.log(this.TopTableData, "this.TopTableData ==>257");
          }
        })
        .catch(e => {
          this.$Message.info("获取直调列表失败");
        });
    },
    //time1
    getDataQuick(val) {
      ////console.log(val);
      this.form.auditStartDate = val[0];
      this.form.auditEndDate = val[1];
    },
    //time2
    selectDate(val) {
      //console.log(val, "value");

      if (val[0] != "") {
        this.form.startDate = val[0] + " " + "00:00:00";
        this.form.endDate = val[1] + " " + "23:59:59";
      } else {
        this.form.startDate = "";
        this.form.endDate = "";
      }
    },
    //选择当前行
    currentChangeEvent({ row }) {
      ////console.log("当前行" + row);
      this.BottomTableData = row.details;
      this.currentrow = row;
      //console.log(row, "row ==>272");
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

    ok1() {
      //console.log(this.currentrow, "this.currentrow =>286");
      this.currentrow.settleStatus = this.currentrow.settleStatus.value;
      // this.currentrowthis.enterStoreId = this.storeArray[0].value;
      daohuoruku(this.currentrow)
        .then(res => {
          if (res.code == 0) {
            ////console.log(res);
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
      ////console.log(evnt.target.value);
      this.currentrow.details.trueEnterQty = evnt.target.value;
    },
    roleChangeEvent({ row }, evnt) {
      // 使用内置 select 需要手动更新，使用第三方组件如果是 v-model 就不需要手动赋值
      ////console.log(evnt.target.value);
      this.currentrow.enterStoreId = evnt.target.value;
    }
  }
};
</script>

<style scoped>
</style>



<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>查询：</span>
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
          </div>

          <div class="db mt40 mrt10">
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
            <Select v-model="form.status" class="w100 mr10" clearable>
              <Option value="UNACCEPTED" label="待受理"></Option>
              <Option value="ACCEPTED" label="已受理"></Option>
              <Option value="REJECTED" label="已拒绝"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="form.id" class="w100 mr10" placeholder="选择客户" filterable clearable>
              <Option
                v-for="item in customerListOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <!-- <div class="db mr10">
            <Select
              v-model="form.company"
              class="w200 mr10"
              placeholder="选择公司"
              filterable
              clearable
            >
              <Option
                v-for="item in companyListOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>-->
          <div class="db mr10">
            <Input
              v-model="form.serviceId"
              placeholder="调入退回申请单号"
              style="width: 160px"
              class="mr10"
            ></Input>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20" @click="search">
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
          size="mini"
          height="auto"
          :data="TopTableData"
          @current-change="currentChangeEvent"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column type="index" title="序号"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row,rowIndex }">
              <Button v-show="row.status.name == '待受理'" type="text" @click="shouli(row, 2)">受理</Button>
              <Button v-show="row.status.name == '待受理'" type="text" @click="shouli(row, 7)">拒绝</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column field="orgName" title="申请方"></vxe-table-column>
          <vxe-table-column field="serviceId" title="调入退回申请单号"></vxe-table-column>
          <vxe-table-column field="status.name" title="状态"></vxe-table-column>

          <vxe-table-column field="createTime" title="提交日期"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column
            field="defaultValue"
            title="受理仓库"
            :edit-render="{name: 'select', options: storeArray,events: {change: roleChangeEvent}}"
          ></vxe-table-column>

          <!-- <vxe-table-column
            field="defaultValue"
            title="受理仓库"
            :edit-render="{name: 'select', options: storeArray}"
          ></vxe-table-column>-->

          <!-- <vxe-table-column title="受理仓库">
            <template v-slot="{ row,rowIndex }">
              <select>
                <option
                  v-for="(item,index) in storeArray"
                  :key="index"
                  :value="item.value"
                >{{item.label}}</option>
              </select>
            </template>
          </vxe-table-column>-->
          <vxe-table-column field="orderDate" title="受理日期" width="100"></vxe-table-column>
          <vxe-table-column field="acceptUname" title="受理人" width="100"></vxe-table-column>
        </vxe-table>
      </div>
      <Modal v-model="modal1" title="提示" @on-ok="ok" @on-cancel="cancel">
        <span>
          <Icon type="information"></Icon>是否确认受理 !
        </span>
      </Modal>
      <Modal v-model="modal3" title="提示" @on-ok="ok3" @on-cancel="cancel">
        <p>
          <Icon type="information"></Icon>受理成功, 已生成调出退回单
        </p>
        <span class="courier">
          <input
            type="text"
            readonly
            v-model="danhao"
            id="danhao"
            style="border:none;background-color: #ffff"
          />
        </span>
        <span class="sp1" @click="copy">复制单号</span>
      </Modal>
      <Modal v-model="modal2" title="提示" @on-ok="ok1" @on-cancel="cancel">
        <span>
          <Icon type="information"></Icon>是否拒绝!
        </span>
      </Modal>
      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page"
              :total="pageList.total"
              :page-size="pageList.pageSize"
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
          size="mini"
          height="auto"
          highlight-current-row
          highlight-hover-row
          :data="BottomTableData"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
        >
          <vxe-table-column type="index" title="序号"></vxe-table-column>
          <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
          <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="applyQty" title="申请退回数量"></vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
        </vxe-table>
      </div>
    </section>
  </div>
</template>

<script>
import { findForAllot } from "_api/purchasing/purchasePlan";
import QuickDate from "../../../../components/getDate/dateget";
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
import {
  getcangku,
  getbayer,
  tuihuishouli,
  tuihuishouliliebiao,
  tuihuishouliliebiaomingxi
} from "../../../../api/AlotManagement/twoBackAccept.js";
export default {
  name: "twoBackAccept",
  components: {
    QuickDate
  },
  data() {
    return {
      valueId: "",
      danhao: "",
      modal3: false,
      modal1: false,
      modal2: false,
      form: {
        createTime: "",
        endTime: "",
        createDate: "",
        endDate: "",
        status: "",
        id: "",
        serviceId: ""
      },
      productName: "",
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
      // companyListOptions: [], //选择公司下拉列表
      TopTableData: [], //上侧表格list
      BottomTableData: [], //下侧表格list
      // 分页数据
      pageList: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizeOpts: [10, 20, 30, 40, 50]
      },

      storeArray: [],
      currentrow: {}
    };
  },
  created() {
    this.log();
    this.search();
  },
  methods: {
    log() {
      let params = {};
      findForAllot(params)
        .then(res => {
          if (res.code == 0) {
            // console.log(res)
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
      getcangku()
        .then(res => {
          if (res.code == 0) {
            console.log(res, "res==286");
            res.data.forEach(element => {
              this.storeArray.push({ value: element.id, label: element.name });
              console.log(this.storeArray, "this.storeArray ==>298");
            });
          }
        })
        .catch(e => {
          this.$Message.info("获取仓库失败");
        });
    },
    //time1
    getDataQuick(val) {
      console.log(val);
      this.form.startTime = val[0];
      this.form.endTime = val[1];
    },
    //time2
    selectDate(val) {
      console.log(val);
      this.form.commitDateStart = val[0] + " " + "00:00:00";
      this.form.commitDateEnd = val[1] + " " + "23:59:59";
    },
    //搜索
    search() {
      tuihuishouliliebiao(this.form, this.pageList.pageSize, this.pageList.page)
        .then(res => {
          if (res.code == 0) {
            console.log(res);
            this.TopTableData = res.data.content || [];
            // console.log(this.TopTableData, "this.TopTableData ==>323");
            // for (var i = 0; i < this.TopTableData.length; i++) {
            //   this.TopTableData[i]["storeIdValue"] = "受理默认仓库";
            // }
            this.pageList.total = res.totalElements;
            // console.log(this.TopTableData, "this.TopTableData");
            for (var i = 0; i < this.TopTableData.length; i++) {
              this.TopTableData[i]["defaultValue"] = "受理默认仓库";
            }
          }
        })
        .catch(e => {
          this.$Message.info("获取受理列表失败");
        });
    },
    //current
    async currentChangeEvent({ row }) {
      console.log("当前行" + row);
      const params = {
        mainId: row.id
      };
      const res = await tuihuishouliliebiaomingxi(params);
      this.BottomTableData = res.data;
    },
    copy() {
      var number = document.getElementById("danhao").value; //获取需要复制的值(innerHTML)
      document.getElementById("danhao").select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      console.log(number);
    },
    ok() {
      const params = {
        id: this.currentrow.id,
        storeId: this.currentrow.defaultValue,
        status: 2
      };
      // this.currentrow.orderTypeId = this.currentrow.orderTypeId.value;
      // this.currentrow.settleStatus = this.currentrow.settleStatus.value;
      // this.currentrow.status = 2;
      // let params = this.currentrow;
      // params['']
      tuihuishouli(params)
        .then(res => {
          if (res.code == 0) {
            this.tbdata = res.data || [];
            this.modal3 = true;
            this.danhao = res.data.serviceId;
          } else if (res.code == 1) {
            this.$Message.info("请选择受理仓库");
          }
        })
        .catch(e => {
          this.$Message.info("受理失败");
        });
    },
    ok1() {
      // const params = {
      //   id: this.currentrow.id,
      //   storeId: this.currentrow.storeId,
      //   status: 7
      // }'
      this.currentrow.orderTypeId = this.currentrow.orderTypeId.value;
      this.currentrow.settleStatus = this.currentrow.settleStatus.value;
      this.currentrow.status = 7;
      let params = this.currentrow;
      tuihuishouli(params)
        .then(res => {
          if (res.code == 0) {
            if (res.code == 0) {
              console.log(1);
            } else if (res.code == 1) {
              this.$Message.info("请选择受理仓库");
            }
          }
        })
        .catch(e => {
          this.$Message.info("拒绝失败");
        });
    },
    ok3() {
      this.$router.push(`/allot/two/backInStorage`);
    },
    cancel() {
      this.$Message.info("点击了取消");
    },
    shouli(row, index) {
      // console.log(row, "row=>407");
      this.currentrow = row;
      // console.log(this.currentrow.defaultValue, "this.currentrow.defaultValue");
      if (this.currentrow.defaultValue == "受理默认仓库") {
        this.currentrow.defaultValue = "1212664645509201920";
      }
      console.log(row);
      if (index === 2) {
        this.modal1 = true;
      } else {
        this.modal2 = true;
      }
    },
    roleChangeEvent({ row }, evnt) {
      // 使用内置 select 需要手动更新，使用第三方组件如果是 v-model 就不需要手动赋值
      this.currentrow.defaultValue = evnt.target.value;
      console.log(evnt.target.value, "1212");
    }
  }
};
</script>

<style scoped>
</style>



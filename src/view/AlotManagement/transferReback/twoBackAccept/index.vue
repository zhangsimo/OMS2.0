<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
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
            <Select v-model="form.status" class="w100 mr10" clearable @on-change="search">
              <Option value="UNACCEPTED" label="待受理"></Option>
              <Option value="ACCEPTED" label="已受理"></Option>
              <Option value="REJECTED" label="已拒绝"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="form.orgid" class="w100 mr10" placeholder="选择公司" filterable clearable @on-change="search">
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
          <vxe-table-column  show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" title="操作">
            <template v-slot="{ row,rowIndex }">
              <Button :loading="isSaveClick" v-show="row.status.name == '待受理'" type="text" @click="shouli(row, 2)">受理</Button>
              <Button v-show="row.status.name == '待受理'" type="text" @click="shouli(row, 7)">拒绝</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="guestName" title="申请方"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="serviceId" title="调入退回申请单号"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="status.name" title="状态"></vxe-table-column>

          <vxe-table-column  show-overflow="tooltip" field="commitDate" title="提交日期"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="remark" title="备注"></vxe-table-column>
          <!--<vxe-table-column  show-overflow="tooltip"-->
            <!--field="storeId"-->
            <!--title="受理仓库"-->
            <!--:edit-render="{name: 'select', options: storeArray,events: {change: roleChangeEvent}}"-->
          <!--&gt;-->
            <!---->
          <!--</vxe-table-column>-->

          <!-- <vxe-table-column  show-overflow="tooltip"
            field="defaultValue"
            title="受理仓库"
            :edit-render="{name: 'select', options: storeArray}"
          ></vxe-table-column>-->

          <vxe-table-column  show-overflow="tooltip" title="受理仓库" field="defaultValue">
            <template v-slot="{ row,rowIndex }">
              <vxe-select transfer v-model="row.defaultValue">
                <vxe-option v-for="(num,index) in storeArray" :key="index" :value="num.value" :label="`${num.label}`"></vxe-option>
              </vxe-select>
            </template>
          </vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="auditDate" title="受理日期" width="100"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="auditor" title="受理人" width="100"></vxe-table-column>
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
        <span style="width:300px" class="courier">
          <input
            type="text"
            readonly
            v-model="danhao"
            id="danhao"
            style="border:none;background-color: #ffff;width:200px"
          />
        </span>
        <span class="sp1" @click="copy(danhao)">复制单号</span>
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
              show-sizer
              :page-size-opts="[20,40,60,80,100]"
              @on-change="changePage"
              @on-page-size-change="changeSize"
            ></Page>
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
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column  show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="partCode" title="配件编码"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="partName" title="配件名称" width="100"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="unit" title="单位"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="applyQty" title="申请退回数量"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="remark" title="备注"></vxe-table-column>
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
import {showLoading, hideLoading} from "@/utils/loading"
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
        orgid: "",
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
        pageSize: 20,
        pageSizeOpts: [20, 40, 60, 80, 100]
      },

      storeArray: [],
      currentrow: {},
      isSaveClick:false,
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
            res.data.content.forEach(element => {
              this.customerListOptions.push({
                value: element.orgid,
                label: element.shortName
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
            res.data.forEach(element => {
              this.storeArray.push({ value: element.id, label: element.name,isDefault:element.isDefault });
            });
          }
        })
        .catch(e => {
          this.$Message.info("获取仓库失败");
        });
    },
    //time1
    getDataQuick(val) {
      this.form.createTimeStart = val[0];
      this.form.createTimeEnd = val[1];
      this.search();
    },
    //time2
    selectDate(val) {
      if(Array.isArray(val) && val[0] != "" && val[1] != "" ) {
        this.form.commitDateStart = val[0] + " " + "00:00:00";
        this.form.commitDateEnd = val[1] + " " + "23:59:59";
      } else {
        delete this.form.commitDateStart;
        delete this.form.commitDateEnd;
      }
      this.search();
    },
    changePage(p) {
      this.pageList.page = p
      this.search();
    },
    changeSize(size) {
      this.pageList.page = 1
      this.pageList.pageSize = size
      this.search();
    },
    //搜索
    search() {
      showLoading(".loadingClass")
      tuihuishouliliebiao(this.form, this.pageList.pageSize, this.pageList.page)
        .then(res => {
          this.isSaveClick = false;
          if (res.code == 0) {
            let arrData = res.data.content || [];

            //
            let defaultArr = this.storeArray.filter(item => item.isDefault)[0].value||this.storeArray[0].value;
            arrData.map(item => {
              if(item.status){
                item.defaultValue = item.status.value===4?item.storeId:defaultArr
              }
            })

            this.TopTableData = arrData;
            this.pageList.total = res.totalElements;

            // for (var i = 0; i < this.TopTableData.length; i++) {
            //   this.TopTableData[i]["defaultValue"] = this.storeArray[0].value;
            // }
          }
          hideLoading()
        })
        .catch(e => {
          this.$Message.info("获取受理列表失败");
          hideLoading()
        });
    },
    //current
    async currentChangeEvent({ row }) {
      const params = {
        mainId: row.id
      };
      const res = await tuihuishouliliebiaomingxi(params);
      this.BottomTableData = res.data;
    },
    copy(str) {
      var save = function(e) {
        e.clipboardData.setData('text/plain', str);
        e.preventDefault();
      };
      document.querySelector(".sp1").addEventListener('copy', save);
      document.execCommand('copy');
      document.removeEventListener('copy', save);
      console.log(str)
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
      this.isSaveClick = true
      tuihuishouli(params)
        .then(res => {
          if(!res){
            this.isSaveClick = false
          }
          if (res.code == 0) {
            this.tbdata = res.data || [];
            this.modal3 = true;
            this.danhao = res.data.serviceId;
            this.search();
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
                location.reload()
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
      this.currentrow = row;
      console.log(row)
      if (index === 2) {
        this.modal1 = true;
      } else {
        this.modal2 = true;
      }
    },
    roleChangeEvent({ row }, evnt) {
      // 使用内置 select 需要手动更新，使用第三方组件如果是 v-model 就不需要手动赋值
      this.currentrow.defaultValue = evnt.target.value;
    }
  }
};
</script>

<style scoped>
.sp1 {
  cursor: pointer;
}
</style>



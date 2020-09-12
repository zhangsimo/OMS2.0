<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
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
            <Select
              @on-change="selectStatus"
              v-model="form.billStatusId"
              class="w100 mr10"
              clearable
            >
              <Option value="2" label="待入库"></Option>
              <Option value="4" label="已入库"></Option>
              <Option value="3" label="部分入库"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input
              v-model="form.serviceId"
              placeholder="业务单号"
              style="width: 160px"
              class="mr10"
            ></Input>
          </div>
          <div class="db mr10">
            <GoodCus
              style="width: 120px"
              :title="form.supplyName"
              placeholder="请输入供应商"
              :search-value="form.supplyName"
              @throwName="throwNameFun"
              :disabled-prop="false"
            ></GoodCus>
<!--            <Select-->
<!--              style="width:110px"-->
<!--              v-model="form.guestId"-->
<!--              placeholder="选择供应商"-->
<!--              filterable-->
<!--              clearable-->
<!--              @on-change="selectOption"-->
<!--            >-->
<!--              <Option-->
<!--                v-for="item in customerListOptions"-->
<!--                :value="item.value"-->
<!--                :key="item.value"-->
<!--                >{{ item.label }}</Option-->
<!--              >-->
<!--            </Select>-->
          </div>
          <div class="db mr10">
            <Input
              v-model="form.partCode"
              placeholder="配件编码"
              style="width: 160px"
              class="mr10"
            ></Input>
          </div>
          <div class="db mr10">
            <Input
              v-model="form.partName"
              placeholder="配件名称"
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
          @current-change="currentChangeEvent"
          size="mini"
          height="auto"
          :loading="loadingEnter"
          :data="TopTableData"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column  show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" title="操作">
            <template v-slot="{ row, rowIndex }">
              <Button type="text" @click="ruku">到货入库</Button>
            </template>
          </vxe-table-column>

          <vxe-table-column  show-overflow="tooltip"
            field="serviceId"
            title="业务单号"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="guestName"
            title="供应商名称"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="billStatusName"
            title="状态"
          ></vxe-table-column>

          <vxe-table-column  show-overflow="tooltip" field="orderMan" title="采购员"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="billTypeName"
            title="票据类型"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="settleTypeName"
            title="结算方式"
            width="100"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="auditor"
            title="提交人"
            width="100"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="auditDate"
            title="提交日期"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="remark" title="备注"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            width="160"
            field="enterStoreId"
            title="入库仓库"
          >
            <!-- :edit-render="{
              name: 'select',
              options: storeArray,
              events: { change: roleChangeEvent }
            }" -->
            <template v-slot="{ row }">
              <vxe-select v-model="row.enterStoreId" @change="getPartPosition(row)" transfer>
                <vxe-option v-for="item in storeArray" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="enterTime"
            title="入库日期"
            width="100"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="enterUname"
            title="操作人"
            width="100"
          ></vxe-table-column>
        </vxe-table>
      </div>
      <Modal v-model="modal2" title="提示" @on-ok="ok1" @on-cancel="cancel">
        <span> <Icon type="information"></Icon>是否确认已到货入库! </span>
      </Modal>
      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page + 1"
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
          highlight-current-row
          highlight-hover-row
          size="mini"
          height="auto"
          :loading="loadingEnter"
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
          @keydown="keydown"
          :data="BottomTableData"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column  show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>

          <!-- <vxe-table-column  show-overflow="tooltip" title="操作" width="80">
                <template v-slot="{ row }">
                  <Button type="text">查看</Button>
                </template>
          </vxe-table-column>-->

          <vxe-table-column  show-overflow="tooltip"
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="partName"
            title="配件名称"
            width="100"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="partBrand" title="品牌"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="unit" title="单位"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="orderQty"
            title="订单数量"
          ></vxe-table-column>

          <vxe-table-column  show-overflow="tooltip" field="remark" title="备注"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="trueEnterQty"
            title="已入库数量"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="adjustQty"
            title="已取消数量"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="thisQty"
            title="本次入库数量"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'number',min:0 },
              events: { change: numChangeEvent }
            }"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="storeShelf"
            title="仓位"
            :edit-render="{
              name: 'input',
              immediate: true,
              events: { blur: checkSelf }
            }"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="spec" title="规格"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="partInnerId" title="配件内码" width="120"></vxe-table-column>
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
  getcangku,
  getPartPos
} from "../../../../api/AlotManagement/threeSupplier.js";
import { checkStore } from "@/api/system/systemApi";
import GoodCus from "_c/allocation/GoodCus.vue";

export default {
  name: "threeSupplier",
  components: {
    QuickDate,
    GoodCus
  },
  data() {
    return {
      isSelfOk: true,
      modal2: false,
      form: {
        auditStartDate: "",
        auditEndDate: "",
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
        pageSize: 20,
        pageSizeOpts: [20, 40, 60, 80, 100]
      },
      pageTotal: 10,
      selectOne: "",
      dateTime: "",
      currentrow: {},
      storeArray: [],
      customerListOptions: [],
      loadingEnter:false
    };
  },
  created() {
    this.log();
    this.search();
  },
  methods: {

    //------------------------------------------------------------------------//
    //表格tab切换可编辑部位
    async editNextCell($table){
      // @ts-ignore
      const { row, column, $rowIndex, $columnIndex, columnIndex, rowIndex } = await $table.getActiveRecord() || {}
      if (row) { // 当前为编辑状态
        // console.log('row', row)
        // 当前列属性
        const nowField = column.property
        // 获取展示的列
        const { visibleColumn } = $table.getTableColumn()
        // 当前列属性（可以编辑的属性）
        const columnsField = visibleColumn.reduce((a, v, i) => {
          if (i !== 0 && i !== visibleColumn.length - 1 && v.editRender) { // 不是操作和序号且不可以编辑
            a.push(v.property)
          }
          return a
        }, [])
        const nowIndex = columnsField.findIndex(v => v === nowField)
        // 判断当前是否是可编辑倒数地二行
        const isLastColumn = nowIndex === columnsField.length - 2
        // console.log('isLastColumn', isLastColumn)
        if (isLastColumn) {
          // 插入数据

          // 跳转到下一行
          // 判断当前是否为临时数据
          const isInsertByRow = $table.isInsertByRow(row)
          const ROW_INDEX = isInsertByRow ? await $table.$getRowIndex(row) : rowIndex
          const insertRecords = $table.getInsertRecords() // 临时数据
          let nextRow = {}
          // 不是最后一条临时数据
          if (isInsertByRow && insertRecords.length - 1 !== ROW_INDEX) {
            nextRow = $table.getInsertRecords()[ROW_INDEX + 1]
          } else {
            // 当前是最后一条临时数据
            if (isInsertByRow) {
              nextRow = $table.getData()[0]
            } else {
              nextRow = $table.getData()[ROW_INDEX + 1]
            }
          }
          if (nextRow) {
            await $table.scrollTo(0)
            await $table.setActiveCell(nextRow, columnsField[0])
          }
        } else {
          // 跳转下一个编辑
          await $table.setActiveCell(row, columnsField[nowIndex + 1])
        }
      }
    },

    keydown($event){
      if ($event.$event.keyCode == 9){
        this.editNextCell($event.$table)
      }
    },

    //------------------------------------------------------------------------//
    checkSelf({ row: { storeShelf } }) {
      if (storeShelf == "") {
        this.isSelfOk = true;
      } else {
        checkStore({
          storeId: this.currentrow.enterStoreId,
          name: storeShelf
        }).then(res => {
          if (res.code == 0 && res.data != null) {
            this.isSelfOk = true;
          } else {
            this.isSelfOk = false;
          }
        });
      }
    },
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
    selectOption() {
      this.search();
    },
    //time1
    getDataQuick(val) {
      this.form.auditStartDate = val[0];
      this.form.auditEndDate = val[1];
      this.search();
    },
    //time2
    selectDate(val) {
      if (val[0] != "") {
        this.form.auditStartDate = val[0] + " " + "00:00:00";
        this.form.auditEndDate = val[1] + " " + "23:59:59";
      } else {
        this.form.auditStartDate = "";
        this.form.auditEndDate = "";
      }
      this.search();
    },
    selectStatus() {
      this.search();
    },
    //搜索
    search() {
      let page = this.pageList.page;
      let size = this.pageList.pageSize;
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
    throwNameFun(v) {
      this.getSupplierName(v);
    },
    //获取选中供应商
    getSupplierName(v) {
      if (v) {
        //赋值供应商名称
        this.form.supplyName = v.fullName || "";
        //赋值供应商id
        this.form.guestId = v.id || "";
        //赋值票据类型id
        // this.form.billType = v.billTypeId || "";
      }
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
      if(row&&row.details&&row.details.length>0) {
        this.getPartPosition(row);
      }
    },

    //获取仓位
    async getPartPosition(row){
      let partIds = row.details.filter(item => item.partId).map(b => b.partId);
      let reqObj = {
        storeId:row.enterStoreId,
        partIds:partIds
      }
      let rep = await getPartPos(reqObj);
      if(rep.code==0){
        this.BottomTableData.map(item => {
          let filterData = rep.data.filter(iv => iv.partId == item.partId);
          if(filterData.length>0){
            item.storeShelf = filterData[0].shelf||"";
          }else{
            item.storeShelf = "";
          }
        })
      }
    },

    ok1() {
      if(!this.isSelfOk) {
        return this.$message.error("请填写正确的仓位!")
       }
      this.loadingEnter = true;
      const msg = this.$Message.loading({
        content: '数据处理中...',
        duration: 0
      });
      daohuoruku(this.currentrow)
        .then(res => {
          this.loadingEnter = false;
          msg();
          if (res.code === 0) {
            //console.log(res);
            this.$Message.info("入库成功");
          }
        })
        .catch(e => {
          this.loadingEnter = false;
          msg();
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
      if(parseInt(evnt.target.value)<0){
        this.$Message.error("本次入库数量不能小于零")
        this.currentrow.details.trueEnterQty=0
        row.thisQty=0
        return
      }
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

<style scoped></style>

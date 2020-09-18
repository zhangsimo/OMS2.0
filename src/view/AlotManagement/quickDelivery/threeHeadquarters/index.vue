<template>
  <div class="content-oper content-oper-flex loadingClass">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
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
            <Select v-model="form.isEnter" class="w100 mr10" clearable @on-change="search">
              <Option value="0" label="待入库"></Option>
              <Option value="1" label="已入库"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input
              v-model="form.serviceId"
              placeholder="调拨出库单号"
              style="width: 160px"
              class="mr10"
            ></Input>
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
    <Modal v-model="modal2" title="提示" @on-ok="ok1" @on-cancel="cancel">
      <span> <Icon type="information"></Icon>是否确认已到货入库! </span>
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
          <vxe-table-column  show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" title="操作">
            <template v-slot="{ row, rowIndex }">
              <Button :loading="isSaveClick" type="text" @click="ruku">到货入库</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="orgName" title="调出方"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="code" title="受理单号"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="serviceId"
            title="出库单号"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="enterStatus" title="状态"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="createTime"
            title="出库日期"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="remark" title="备注"></vxe-table-column>
          <!-- <vxe-table-column  show-overflow="tooltip"
            field="enterStoreId"
            title="入库仓库"
            :edit-render="{name: 'select', options: storeArray,events: {change: roleChangeEvent}}"
          ></vxe-table-column>-->
          <!-- <vxe-table-column  show-overflow="tooltip" title="入库仓库"> -->
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
          <vxe-table-column  show-overflow="tooltip"
            field="enterStoreId"
            title="入库仓库"
            :edit-render="{
              name: 'select',
              options: storeArray,
              events: { change: roleChangeEvent }
            }"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="enterDate"
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
      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12" offset="12" style="text-align:right">
          <div>
            <Page
              :current="pageList.page + 1"
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
          :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true}"
          @keydown="keydown"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column  show-overflow="tooltip" type="seq" title="序号"></vxe-table-column>
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
            field="hasOutQty"
            title="出库数量"
          ></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip" field="remark" title="备注"></vxe-table-column>
          <vxe-table-column  show-overflow="tooltip"
            field="hasInQty"
            title="入库数量"
            :edit-render="{
              name: 'input',
              attrs: { type: 'number' },
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
import QuickDate from "../../../../components/getDate/dateget1";
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
import {
  getcangku,
  zongbuzhidiaoList,
  daohuoruku
} from "../../../../api/AlotManagement/threeHeadquarters.js";
import { checkStore } from '@/api/system/systemApi'
import {showLoading, hideLoading} from "@/utils/loading"

export default {
  name: "threeHeadquarters",
  components: {
    QuickDate
  },
  inject: ["reload"],
  data() {
    return {
      isSelfOk: true,
      modal2: false,
      //查询条件
      form: {
        startDate: "",
        endDate: "",
        // startDate: "",
        // endDate: "",
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
      storeArray: [],
      isSaveClick:false
    };
  },
  created() {
    this.search();
    this.log();
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
        const isLastColumn = nowIndex === columnsField.length - 1
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
    checkSelf({ row : { storeShelf } }) {
      if(storeShelf == "") {
        this.isSelfOk = true;
      } else {
        checkStore({ storeId: this.currentrow.enterStoreId, name: storeShelf }).then(res => {
          if(res.code == 0 && res.data != null) {
            this.isSelfOk = true;
          } else {
            this.isSelfOk = false;
          }
        })
      }
    },
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
      showLoading(".loadingClass")
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
          hideLoading()
        })
        .catch(e => {
          hideLoading()
          this.$Message.info("获取直调列表失败");
        });
    },
    //time1
    getDataQuick(val) {
      console.log(val, "val");
      if (val.length > 1) {
        this.form.startDate = val[0];
        this.form.endDate = val[1];
        this.search(this.form);
      } else {
        this.form.startDate = "";
        this.form.endDate = "";
      }
    },
    //time2
    selectDate(val) {
      if (val[0] != "") {
        this.form.startDate = val[0] + " " + "00:00:00";
        this.form.endDate = val[1] + " " + "23:59:59";
      } else {
        this.form.startDate = "";
        this.form.endDate = "";
      }
      this.search();
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
      if(!this.isSelfOk) {
        return this.$message.error("请填写正确的仓位!")
      }
      //console.log(this.currentrow, "this.currentrow =>286");
      this.currentrow.settleStatus = this.currentrow.settleStatus.value;
      // this.currentrowthis.enterStoreId = this.storeArray[0].value;
      this.isSaveClick = true
      daohuoruku(this.currentrow)
        .then(res => {
          this.isSaveClick = false
          if (res.code == 0) {
            ////console.log(res);
            this.$Message.success("入库成功");
            this.reload();
          }
        })
        .catch(e => {
          this.$Message.error("入库失败");
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

<style scoped></style>

<template>
  <main class="inventory">
    <div style="line-height:57px">
      <Button class="mr10 w90" @click="insertEvent(-1)">
        <Icon type="md-add" />新增
      </Button>
      <Button type="default" class="mr10 w90" @click="saveList">
        <i class="iconfont mr5 iconbaocunicon"></i>保存
      </Button>
      <Button class="mr10 w90" type="default" v-show="oneWarehouse.auditSign == 0">
        <Icon type="md-checkmark" />审核
      </Button>
    </div>
    <vxe-table
      ref="xTable"
      border
      resizable
      align="center"
      @current-change="clOnewList"
                highlight-current-row
          highlight-hover-row
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :data="tableData"
      :edit-config="{trigger: 'dblclick', mode: 'row'}"
      @edit-actived="editActivedEvent"
    >
      <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="serviceId" title="入库单号"></vxe-table-column>
      <vxe-table-column>
      <template v-slot='{row}'>
            <Select v-model="row.storeId" :disabled='row.auditSign == 1'>
        <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column title="是否审核">
        <template v-slot="{ row }">{{ row.auditSign == 1 ? '已审核' : '未审核' }}</template>
      </vxe-table-column>
      <vxe-table-column field="orderMan" title="业务员" :edit-render="{name: 'input', attrs: {disabled: isAgeDisabled}}"></vxe-table-column>
      <vxe-table-column field="marker" title="备注" :edit-render="{name: 'input', attrs: {disabled: isAgeDisabled}}"></vxe-table-column>
      <vxe-table-column field="taxAmt" title="总金额"></vxe-table-column>
      <vxe-table-column field="createUname" title="制单人"></vxe-table-column>
      <vxe-table-column field="createTime" title="制单日期"></vxe-table-column>
    </vxe-table>
    <div style="line-height:57px">
      <Button class="mr10 w90" @click="AddAttention">
        <Icon type="md-add" />添加
      </Button>
      <Button type="md-delete" class="mr10 w90">
        <i class="iconfont mr5 iconbaocunicon"></i>删除
      </Button>
      <Button class="mr10 w90">
        <span class="center">
          <Icon custom="iconfont icondaoruicon icons" />导入
        </span>
      </Button>
      <Button type="default" class="w90 mr10">下载模板</Button>
    </div>
    <vxe-grid
      border
      stripe
      height="450"
      align="center"
      :columns="tableColumnTwo"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      @select-all="selectAllEvent"
      @select-change="selectChangeEvent"
      @toolbar-button-click="toolbarButtonClickEvent"
    ></vxe-grid>
    <!-- 添加按钮模态框 -->
    <Modal v-model="modal" title="配件选择" :footer-hide="true" width="1020">
      <!-- <Atten-tion @childrenMsg="getMsg" ref="FatherMsg"></Atten-tion> -->
      <div slot="footer">
        <Button type="default">取消</Button>
        <Button type="primary">确定</Button>
      </div>
    </Modal>
  </main>
</template>

<script>
import { getList,saveList } from "@/api/system/systemSetting/inventory";
import { getwarehouse } from "@/api/system/setWarehouse";

export default {
  data() {
    return {
      //模态框默认隐藏
      modal: false,
      //加载图标显示
      isShow: true,
      //默认仓库选项
      roleList: [],
      tableData: [],
      //表1列配置
      tableColumn: [
        {
          title: "基础信息",
          children: [
            { type: "index", width: 60, title: "序号" },
            { field: "serviceId", title: "入库单号" },
            {
              field: "storeName",
              title: "默认仓库",
              editRender: {
                name: "select",
                options: [
                  { label: "213123", value: "1" },
                  { label: "zs", value: "2" }
                ]
              }
            },
            { field: "auditSign", title: "是否审核" },
            {
              field: "orderMan",
              title: "业务员",
              editRender: { name: "input" }
            },
            { field: "marker", title: "备注", editRender: { name: "input" } },
            { field: "taxAmt", title: "总金额" },
            { field: "createUname", title: "制单人" },
            { field: "createTime", title: "制单日期" }
          ]
        }
      ],
      //表2列配置   field:列属性
      tableColumnTwo: [
        { type: "index", width: 60, title: "序号" },
        {
          title: "配件信息",
          children: [
            { type: "checkbox", width: 30 },
            { field: "rate", title: "配件ID" },
            { field: "rate1", title: "配件编码" },
            { field: "rate2", title: "配件名称" },
            { field: "rate3", title: "品牌" },
            { field: "rate4", title: "品牌车型" },
            { field: "rate5", title: "单位" }
          ]
        },
        {
          title: "数量金额信息",
          children: [
            { field: "rate1", title: "数量" },
            { field: "rate2", title: "单价" },
            { field: "rate3", title: "销售价" },
            { field: "rate4", title: "金额" },
            { field: "rate5", title: "备注" }
          ]
        },
        {
          title: "辅助信息",
          children: [
            { field: "rate1", title: "仓位" },
            { field: "rate2", title: "仓库" },
            { field: "rate3", title: "OE码" },
            { field: "rate4", title: "规格/方向/颜色" }
          ]
        },
        {
          title: "不含税信息",
          children: [
            { field: "rate1", title: "单价" },
            { field: "rate2", title: "金额" }
          ]
        },
        {
          title: "含税信息",
          children: [
            { field: "rate1", title: "税率" },
            { field: "rate2", title: "单价" },
            { field: "rate3", title: "金额" }
          ]
        }
      ],
      oneWarehouse: "",
      //判断是否可编辑
      isAgeDisabled: false
    };
  },
  created() {
    //获取选择仓库
    this.getStoreHoure();
  },

  mounted() {
    this.getList();
  },

  methods: {
    //获取表1全部信息
    async getList() {
      this.isShow = true;
      let res = await getList({});
      if (res.code == 0) {
        this.isShow = false;
        res.data.map(item => {
          item.initBalance = +item.initBalance;
        });
        this.tableData = res.data;
      }
    },
    //获取仓库下拉选择信息
    async getStoreHoure() {
      let res = await getwarehouse({});

      if (res.code == 0) {
        //getColumnByField(fileid) 根据列的字段名获取列
        // console.log(column, 123123123);
        res.data.map(item => {
          item.store = item.id;
        });
        this.roleList = res.data;
      }
    },
    //保存
    async saveList(){
      let res = await saveList(this.oneWarehouse)
      if(res.code==0){
        this.getList()
      }

    },
    //禁止编辑
      editActivedEvent ({ row, rowIndex }) {
              // 已审核不能编辑
              console.log(row,123312312)
              this.isAgeDisabled = row.auditSign == 1
            },
    toolbarButtonClickEvent({ code }, event) {
      switch (code) {
        case "myBtn":
          this.$XModal.alert(code);
          break;
      }
    },
    //全选框
    selectAllEvent({ checked }) {
      // console.log(checked ? "所有勾选事件" : "所有取消事件");
    },
    //单选框
    selectChangeEvent({ checked, row }) {
      // console.log(checked ? "勾选事件" : "取消事件");
    },
    getSelectEvent() {
      let selectRecords = this.$refs.xTable1.getSelectRecords();
      this.$XModal.alert(selectRecords.length);
    },
    //新增按钮功能
    insertEvent(row) {
      let record = {
        sex: "1"
      };
      this.$refs.xTable
        .insertAt(record, row)
        .then(({ row }) => this.$refs.xTable.setActiveCell(row, "sex"));
    },
    //点击添加弹出modal
    AddAttention() {
      this.modal = true;
    },
    //modal的关闭按钮事件
    closedTap() {
      this.$refs.FatherMsg.handleSelectAll(false);
    },
    getMsg() {},
    //获取当前点击的信息
    clOnewList(data) {
      this.oneWarehouse = data.row;
      console.log(data.row)
    }
  }
};
</script>

<style scoped>
/* inventory >>>  */
</style>

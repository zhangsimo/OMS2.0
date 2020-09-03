<template>
  <main class="inventory">
    <!-- z主表工具按钮 -->
    <div style="line-height:45px">
      <Button class="mr10 w90" @click="insertEvent(-1)">
        <Icon type="md-add" />新增
      </Button>
      <Button type="default" class="mr10 w90" @click="save" v-show="oneWarehouse.auditSign == 0">
        <i class="iconfont mr5 iconbaocunicon"></i>保存
      </Button>
      <Button
        class="mr10 w90"
        type="default"
        v-show="oneWarehouse.auditSign == 0 && oneWarehouse.hasOwnProperty('id')"
        @click="check"
      >
        <Icon type="md-checkmark" />审核
      </Button>
    </div>

    <!-- 主表 -->
    <vxe-table
      ref="xTable"
      max-height="360"
      border
      resizable
      align="center"
      :loading="Loading"
      @current-change="clOnewList"
      highlight-current-row
      highlight-hover-row
      :edit-rules="validRules"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      :data="tableData"
      :edit-config="{trigger: 'click', mode: 'row'}"
      @edit-actived="editActivedEvent"
    >
      <!-- 主表每一项 -->
      <vxe-table-column title="基础信息">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="serviceId" title="入库单号"></vxe-table-column>
        <vxe-table-column field="storeName" title="默认仓库">
          <template v-slot="{row}">
            <Select v-model="row.storeId" :disabled="row.auditSign == 1">
              <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </template>
        </vxe-table-column>
        <vxe-table-column title="是否审核">
          <template v-slot="{ row }">{{ row.auditSign == 1 ? '已审核' : '未审核' }}</template>
        </vxe-table-column>
        <vxe-table-column
          field="orderMan"
          title="业务员"
          :edit-render="{name: 'input', attrs: {disabled: isAgeDisabled}}"
        ></vxe-table-column>
        <vxe-table-column
          field="marker"
          title="备注"
          :edit-render="{name: 'input', attrs: {disabled: isAgeDisabled}}"
        ></vxe-table-column>
        <vxe-table-column field="taxAmt" title="总金额"></vxe-table-column>
        <vxe-table-column field="createUname" title="制单人"></vxe-table-column>
        <vxe-table-column field="createTime" title="制单日期"></vxe-table-column>
      </vxe-table-column>
    </vxe-table>

    <!-- 副表工具按钮 -->
    <div style="line-height:57px">
      <Button class="mr10 w90" @click="AddAttention" v-show="oneWarehouse.auditSign == 0">
        <Icon type="md-add" />添加
      </Button>
      <Button type="md-delete" class="mr10 w90" v-show="oneWarehouse.auditSign == 0" @click="del">
        <i class="iconfont mr5 iconbaocunicon"></i>删除
      </Button>
      <Button class="mr10 w90" v-show="oneWarehouse.auditSign == 0">
        <span class="center">
          <Icon custom="iconfont icondaoruicon icons" />导入
        </span>
      </Button>
      <Button type="default" class="w90 mr10">下载模板</Button>
    </div>
    <!-- 副表 -->
    <vxe-grid
      ref="xTable2"
      border
      stripe
      height="300"
      align="center"
      :edit-rules="validRules"
      :columns="tableColumnTwo"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      :data="twoList"
      :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
      @select-all="selectAllEvent"
      @select-change="selectChangeEvent"
    ></vxe-grid>

    <!-- 副表添加的modal窗 -->
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
import {
  getList,
  saveList,
  deleteList,
  checkList
} from "@/api/system/systemSetting/inventory";
import { getwarehouse } from "@/api/system/setWarehouse";

export default {
  data() {
    return {
      //模态框默认隐藏
      modal: false,
      //加载图标显示
      isShow: true,
      //默认仓库选项
      storeList: [],
      //存放主表的全部数据
      tableData: [],
      //副表 配件信息项  field:列属性
      tableColumnTwo: [
        { type: "index", width: 60, title: "序号" },
        {
          title: "配件信息",
          children: [
            { type: "checkbox", width: 30 },
            { field: "partId", title: "配件ID" },
            { field: "partCode", title: "配件编码" },
            { field: "partName", title: "配件名称" },
            { field: "rate3", title: "品牌" },
            { field: "rate4", title: "品牌车型" },
            { field: "systemUnitId", title: "单位" }
          ]
        },
        {
          title: "数量金额信息",
          children: [
            { field: "enterQty", title: "数量", editRender: { name: "input" } },
            {
              field: "enterPrice",
              title: "单价",
              editRender: { name: "input" }
            },
            {
              field: "sellPrice",
              title: "销售价",
              editRender: { name: "input" }
            },
            { field: "enterAmt", title: "金额" },
            { field: "remark", title: "备注", editRender: { name: "input" } }
          ]
        },
        {
          title: "辅助信息",
          children: [
            {
              field: "storeShelf",
              title: "仓位",
              editRender: { name: "input" }
            },
            { field: "storeName", title: "仓库" },
            { field: "oemCode", title: "OE码" },
            { field: "rate4", title: "规格/方向/颜色" }
          ]
        },
        {
          title: "不含税信息",
          children: [
            { field: "noTaxPrice", title: "单价" },
            { field: "noTaxAmt", title: "金额" }
          ]
        },
        {
          title: "含税信息",
          children: [
            { field: "taxRate", title: "税率" },
            { field: "taxPrice", title: "单价" },
            { field: "taxAmt", title: "金额" }
          ]
        }
      ],
      //存放当前获取到的响应数据
      oneWarehouse: {},
      //判断是否可编辑
      isAgeDisabled: false,
      //检验规则
      validRules: {
        storeName: [{ required: true, message: "仓库不可为空" }],
        enterQty: [{ type: "number", message: "请输入数字" }],
        enterPrice: [{ type: "number", message: "请输入数字" }],
        sellPrice: [{ type: "number", message: "请输入数字" }]
      },
      //选择删除配件信息项的id存放
      ids: [],
      //二级表格数据
      twoList: [],
      //刷新页面
      Loading: true
    };
  },
  created() {
    //获取选择仓库信息
    this.getStoreHoure();
    this.getList();
  },
  methods: {
    //获取表1全部信息
    async getList() {
      this.isShow = true;
      this.Loading = true;
      let res = await getList({});
      if (res.code == 0) {
        this.isShow = false;
        this.Loading = false;
        res.data.map(item => {
          item.initBalance = +item.initBalance;
        });
        this.tableData = res.data;
      }
    },

    //获取当前点击的信息
    clOnewList(data) {
      // console.log(data);
      // let el = data
      this.oneWarehouse = data.row;
      // console.log(this.oneWarehouse);

      this.twoList = data.row.details;
      console.log(this.twoList); //新增为保存状态下是 undefinde
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
        this.storeList = res.data;
      }
    },

    //校验+保存
    async save() {
      let storeIdFind = this.oneWarehouse.hasOwnProperty("storeId");
      // console.log(storeIdFind)
      // console.log('保存')
      if (!storeIdFind) {
        this.$message.error("仓库不可为空");
        return false;
      }
      let res = await saveList(this.oneWarehouse);
      if (res.code == 0) {
        this.oneWarehouse = {};
        consoel.log("save");
        this.getList();
        this.$message.success("保存成功");
      } else {
        // this.$message.error('请求错误')
      }
    },

    //删除
    async del() {
      // console.log(this.ids, 1312);
      if (this.ids.length < 1) {
        this.$message.error("请至少选择一项");
        return false;
      }
      let arr = [];
      this.ids.forEach(item => {
        arr.push(item.id);
      });

      let res = await deleteList({ ids: arr });
      if (res.code == 0) {
        this.ids = [];
        this.twoList = [];
        this.$message.success("删除成功");
        this.getList();
      }
      // console.log(res);
    },

    //审核
    async check() {
      let twoListData = this.twoList;
      console.log(twoListData, 111);
      if (twoListData == null) {
        this.$message.error("请至少在仓库中添加一个配件！");
        return false;
      }
      let res = await checkList(this.oneWarehouse);
      if (res.code == 0) {
        this.$message.success("已审核");
        this.getList();
      } else {
        this.$message.error("审核请求错误");
      }

      // let res=await checkList(this.oneWarehouse)
      // console.log(res)

      // if(!res.details == 'null'|| res.details.length<1){
      //     this.$message.error("仓库不可为空");
      // }else {
      //     this.$message.success(('已审核'))
      //     this.getList()
      // }
    },

    //禁止编辑
    editActivedEvent({ row, rowIndex }) {
      // 已审核不能编辑
      this.isAgeDisabled = row.auditSign == 1;
    },

    //全选框
    selectAllEvent({ checked, row }) {
      // console.log(checked ? "所有勾选事件" : "所有取消事件");
      if (checked) {
        this.ids = row;
      } else {
        this.ids = [];
      }
    },

    //单选框
    selectChangeEvent({ checked, row }) {
      // console.log(checked ? "勾选事件" : "取消事件");
      if (checked) {
        this.ids.push(row);
      } else {
        this.ids = this.ids.filter(item => item.id != row.id);
      }
      // console.log(this.ids, 12312313123);
    },
    //新增
    insertEvent(row) {
      let record = {
        auditSign: 0
      };
      this.$refs.xTable
        //insertAt(records, row) 往表格插入临时数据，从指定位置插入一行或多行；第二个参数：row 指定位置（不支持树表格）、null从第一行插入、-1 从最后插入
        .insertAt(record, row)
        //setActiveCell :激活单元格编辑状态
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
    getMsg() {}
  }
  // computed: {
  //     sum: {
  //         get() {
  //             return this.twoList.enterQty * this.twoList.enterPrice
  //             console.log("get触发")
  //         },
  //         set(value) {
  //             this.twoList.enterAmt = value
  //             console.log('set触发')
  //         }
  //     }
  // }
};
</script>

<style>
/*.vxe-table .vxe-body--row.row--current {*/
/*   position: relative;*/
/*}*/
</style>

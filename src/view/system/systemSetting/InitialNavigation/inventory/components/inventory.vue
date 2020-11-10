<template>
  <main class="inventory">
    <!-- z主表工具按钮 -->
    <div style="line-height:45px">
      <Button class="mr10 w90" @click="insertEvent(-1)" v-has="'insertEvent'">
        <Icon type="md-add" />新增
      </Button>
      <Button type="default" class="mr10 w90" @click="save" v-has="'save'">
        <i class="iconfont mr5 iconbaocunicon"></i>保存
      </Button>
      <Button class="mr10 w90" type="default" @click="check" v-if="flag" v-has="'check'">
        <Icon type="md-checkmark" />审核
      </Button>
    </div>
    <!-- 主表 -->
    <vxe-table
      ref="xTable"
      height="360"
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
          field="remark"
          title="备注"
          :edit-render="{name: 'input', attrs: {disabled: isAgeDisabled}}"
        ></vxe-table-column>
        <vxe-table-column field="enterAmt" title="总金额">
          <template v-slot="{row}">
            {{row.enterAmt|priceFilters}}
          </template>
        </vxe-table-column>
        <vxe-table-column field="createUname" title="制单人"></vxe-table-column>
        <vxe-table-column field="createTime" title="制单日期"></vxe-table-column>
      </vxe-table-column>
    </vxe-table>

    <!-- 副表工具按钮 -->
    <div style="line-height:57px" class="flex">
     <!-- <div class="db">
        <Button class="mr10 w90" @click="AddAttention" v-show="oneWarehouse.auditSign == 0">
          <Icon type="md-add" />添加
        </Button>
      </div>-->
      <div class="db">
        <!-- <Button type="md-delete" class="mr10 w90" v-show="oneWarehouse.auditSign == 0" @click="del">
          <i class="iconfont mr5 iconbaocunicon"></i>删除
        </Button>-->
        <Poptip
          v-show="oneWarehouse.auditSign == 0"
          confirm
          title="您确认删除这条内容吗？"
          @on-ok="confirm"
          @on-cancel="cancel"
        >
          <i-button class="mr10 w90">
            <i class="iconfont mr5 iconbaocunicon"></i>删除
          </i-button>
        </Poptip>
      </div>
      <div class="db">
        <Upload
          ref="upload"
          :show-upload-list="false"
          :action="upurl"
          :format="['xlsx','xls','csv']"
          :headers="headers"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :data="{mainId:mid}"
        >
          <Button class="mr10 w90" v-show="oneWarehouse.auditSign == 0" v-has="'upload'">
            <span class="center">
              <Icon custom="iconfont icondaoruicon icons" />导入
            </span>
          </Button>
        </Upload>
      </div>
      <div class="db">
        <Button type="default" @click="downloadFormwork" class="w90 mr10" v-has="'download'">下载模板</Button>
      </div>
    </div>
    <!--  副表 -->
    <vxe-table
      ref="xTable2"
      border
      stripe
      height="460"
      align="center"
      :edit-rules="validRules"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      :data="twoList"
      @select-all="selectAllEvent"
      @select-change="selectChangeEvent"
    >
      <vxe-table-column title="配件信息">
        <vxe-table-column type="checkbox" width="auto"></vxe-table-column>
        <vxe-table-column field="partId" width="auto" title="配件ID"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
        <vxe-table-column field="partName" title="配件名称"></vxe-table-column>
        <vxe-table-column field="partBrand" title="品牌"></vxe-table-column>
        <vxe-table-column field="carModelName" title="品牌车型"></vxe-table-column>
        <vxe-table-column field="systemUnitId" title="单位"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="数量金额信息">
        <vxe-table-column
          field="enterQty"
          title="数量"
          :edit-render="{name: 'input', attrs: {type: 'number'}}"
        ></vxe-table-column>
        <vxe-table-column
          field="enterPrice"
          title="单价"
          :edit-render="{name: 'input', attrs: {type: 'number'}}"
        ></vxe-table-column>
        <vxe-table-column
          field="sellPrice"
          title="销售价"
          :edit-render="{name: 'input', attrs: {type: 'number'}}"
        ></vxe-table-column>
        <vxe-table-column title="金额" :edit-render="{name: 'input', attrs: {type: 'number'}}">
          <template v-slot="{row}">
            <span>{{ parseFloat(row.enterPrice)*parseFloat(row.enterQty) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="辅助信息">
        <vxe-table-column field="storeShelf" title="仓位"></vxe-table-column>
        <vxe-table-column field="storeName" title="仓库"></vxe-table-column>
        <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
        <vxe-table-column field="spec" title="规格/方向/颜色"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="不含税信息">
        <vxe-table-column field="noTaxPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="noTaxAmt" title="金额"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="含税信息">
        <vxe-table-column field="taxRate" title="税率"></vxe-table-column>
        <vxe-table-column field="taxPrice" title="单价"></vxe-table-column>
        <vxe-table-column field="taxAmt" title="金额"></vxe-table-column>
      </vxe-table-column>
    </vxe-table>

    <!-- 副表添加的modal窗 -->
    <Modal v-model="modal" title="配件选择" :footer-hide="true" width="1020">
      <!-- <Atten-tion @childrenMsg="getMsg" ref="FatherMsg"></Atten-tion> -->
      <div slot="footer">
        <Button type="default">取消</Button>
        <Button type="primary">确定</Button>
      </div>
    </Modal>
    <select-part-com ref="addParCom" @selectPartName="getPartList" :mainData="oneWarehouse"></select-part-com>
  </main>
</template>
<script>
import {
  getList,
  saveList,
  deleteList,
  checkList,
  url
} from "@/api/system/systemSetting/inventory";
import { getwarehouse } from "@/api/system/setWarehouse";
import selectPartCom from "./selectPartCom";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import axios from "axios";
import baseUrl from "_conf/url";

export default {
  name: "inventory",
  components: {
    selectPartCom
  },
  data() {
    return {
      flag: false, //审核按钮是否展示
      //模态框默认隐藏
      modal: false,
      //加载图标显示
      isShow: true,
      //默认仓库选项
      storeList: [],
      //存放主表的全部数据
      tableData: [],
      //副表 配件信息项  field:列属性
      // tableColumnTwo: [
      //     {type: "index", width: 60, title: "序号"},
      //     {
      //         title: "配件信息",
      //         children: [
      //             {type: "checkbox", width: 30},
      //             {field: "partId", title: "配件ID"},
      //             {field: "partCode", title: "配件编码"},
      //             {field: "partName", title: "配件名称"},
      //             {field: "brand ", title: "品牌"},
      //             {field: "applyCarModel ", title: "品牌车型"},
      //             {field: "systemUnitId", title: "单位"}
      //         ]
      //     },
      //     {
      //         title: "数量金额信息",
      //         children: [
      //             {field: "enterQty", title: "数量", editRender: {name: 'input'}},
      //             {field: "enterPrice", title: "单价", editRender: {name: 'input'}},
      //             {field: "sellPrice", title: "销售价", editRender: {name: 'input'}},
      //             {field: "enterAmt", title: "金额"},
      //             {field: "remark", title: "备注", editRender: {name: 'input'}}
      //         ]
      //     },
      //     {
      //         title: "辅助信息",
      //         children: [
      //             {field: "storeShelf", title: "仓位", editRender: {name: 'input'}},
      //             {field: "storeName", title: "仓库"},
      //             {field: "oemCode", title: "OE码"},
      //             {field: "spec", title: "规格/方向/颜色"}
      //         ]
      //     },
      //     {
      //         title: "不含税信息",
      //         children: [
      //             {field: "noTaxPrice", title: "单价"},
      //             {field: "noTaxAmt", title: "金额"}
      //         ]
      //     },
      //     {
      //         title: "含税信息",
      //         children: [
      //             {field: "taxRate", title: "税率"},
      //             {field: "taxPrice", title: "单价"},
      //             {field: "taxAmt", title: "金额"}
      //         ]
      //     }
      // ],
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
      Loading: true,
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      },
      upurl: "",
      mid: ""
    };
  },
  created() {
    //获取选择仓库信息
    this.getStoreHoure();
    this.getList();
    this.upurl = url;
  },
  methods: {
    //获取表1全部信息
    async getList() {
      this.isShow = true;
      this.Loading = true;
      let res = await getList({});
      if (res.code == 0) {
        // console.log(res, "res =>286");
        this.isShow = false;
        this.Loading = false;
        res.data.map(item => {
          item.initBalance = +item.initBalance;
        });
        this.tableData = res.data;
        // console.log(this.tableData,"表一的所有信息")
      }
    },

    //获取当前点击的信息
    clOnewList(data) {
      // let el = data
      this.flag = data.row.auditSign ? false : true;
      this.oneWarehouse = data.row;
      this.mid = data.row.id;
      // console.log(this.mid,77777)
      // console.log(this.oneWarehouse, "选择表一的数据");
      this.twoList = data.row.details;
      // console.log(1212);
      // console.log(this.twoList, "表二的信息 数组")  //新增为保存状态下是 undefinde
    },
    //获取仓库下拉选择信息
    async getStoreHoure() {
      let shopNum=this.$store.state.user.userData.currentCompany?this.$store.state.user.userData.currentCompany.id:""
      let res = await getwarehouse({shopNumber:shopNum});
      if (res.code == 0) {
        // console.log(res, "res=>31");
        //getColumnByField(fileid) 根据列的字段名获取列
        // console.log(column, 123123123);
        res.data.map(item => {
          item.store = item.id;
        });
        this.storeList = res.data;
        // console.log(this.storeList,"默认仓库选项")
      } else {
        // console.log('22')
      }
    },

    //校验+保存
    async save() {
      if(this.oneWarehouse.lf) {
        return this.$message.error("请先新增数据");
      }
      let storeIdFind = this.oneWarehouse.hasOwnProperty("storeId");
      // console.log(storeIdFind)
      // console.log('保存')
      if (!storeIdFind) {
        this.$message.error("仓库不可为空");
        return false;
      }
      let res = await saveList(this.oneWarehouse);
      if (res.code == 0) {
        this.oneWarehouse = { lf: true };
        this.$message.success("保存成功");
        this.getList();
      } else {
        // this.$message.error('请求错误')
      }
    },
    async confirm() {
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
      }
      this.getList();

      // console.log(res);
      // this.$Message.info("点击了确定");
    },
    cancel() {
      // this.$Message.info("点击了取消");
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
        this.getList();
        this.ids = [];
        // this.twoList = [];
        this.$message.success("删除成功");
        this.clOnewList();
      }
      // console.log(res);
    },

    //审核
    async check() {
      let twoListData = this.twoList;
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
    },
    //  点击下载模板
    downloadFormwork() {
      window.location.href =
        baseUrl.omsOrder +
        "/enterMain/template?access_token=" +
        Cookies.get(TOKEN_KEY);
    },

    //禁止编辑
    editActivedEvent({ row, rowIndex }) {
      // 已审核不能编辑
      this.isAgeDisabled = row.auditSign == 1;
    },

    //全选框
    selectAllEvent({ checked, row }) {
      this.ids = this.$refs.xTable2.getSelectRecords();
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
      // this.modal = true;
      this.$refs.addParCom.init();
      this.getList();
    },
    //modal的关闭按钮事件
    closedTap() {
      this.$refs.FatherMsg.handleSelectAll(false);
    },
    //接收抛出来的数据
    getPartList(v) {
      // console.log(v, 222)
    },
    // 上传前
    handleBeforeUpload() {
      if(!this.mid) {
        return this.$message.error("请选择保存后的单据再导入!")
      }
      let refs = this.$refs;
      refs.upload.clearFiles();
    },
    // 上传成功
    handleSuccess(res, file) {
      let self = this;
      if (res.code == 0) {
        this.$message.success(res.message);
        this.getList();
        res.data.forEach(item => this.twoList.push(item));
        console.log(this.twoList.length);
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>

<style>
</style>

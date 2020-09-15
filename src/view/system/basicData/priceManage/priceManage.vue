<template>
  <main class="price-manage page">
    <!--上部-->
    <section class="price-main">
      <Split v-model="split" min="400" max="588">
        <div slot="left" class="left">
          <div class="db btn-title">
            <p class="mr10">级别定义:</p>
            <Button class="mr10 w90" @click="add" v-has="'addLeft'">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
            </Button>
            <Button class="mr10 w90" @click="save" v-has="'saveLeft'">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
            <Button class="mr10 w90" :disabled="curronly" @click="remove" v-has="'deleteLeft'">
              <span class="center">
                <Icon custom="iconfont iconlajitongicon icons" />删除
              </span>
            </Button>
            <Button class="mr10 w90" :disabled="priceEnableBool" @click="priceEnableFun">
              <span class="center">{{priceEnable}}</span>
            </Button>
          </div>
          <vxe-table
            class="level"
            border
            resizable
            auto-resize
            height="549"
            :loading="level.loading"
            :data="level.tbdata"
            :row-style="rowPriceLevelStyle"
            highlight-current-row
            @current-change="selectRow"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            <!-- :row-style="rowPriceLevelStyle" -->
            <vxe-table-column type="seq" width="80" title="序号"></vxe-table-column>
            <vxe-table-column
              field="name"
              title="级别名称"
              min-width="200"
              :edit-render="{ name: 'input' }"
            >
              <template v-slot:edit="{ row }">
                <Input v-model="row.name" :disabled="row.readonly" v-if="row.name === '最低售价'" />
                <Input v-model="row.name" :disabled="row.isDisabled == 1" v-else />
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div slot="right" class="right">
          <div class="db pl10 tabs-ulwarp">
            <ul class="tabs">
              <li
                v-if="!curronly"
                class="center"
                :class="{ 'tab-active': tabIndex == 0 }"
                @click="setTab(0)"
              >客户信息</li>
              <li class="center" :class="{ 'tab-active': tabIndex == 1 }" @click="setTab(1)">配件价格</li>
            </ul>
          </div>
          <div class="tabs-warp" v-show="tabIndex == 0">
            <div class="btns-warp">
              <Input
                v-model="customer.fullname"
                placeholder="请输入全称"
                style="width: 140px;"
                class="mr10"
              />
              <Button :disabled="disabled" class="mr10 w90" @click="queryCustomer" type="warning">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="addCustomer" v-has="'addRight'">
                <span class="center">
                  <Icon type="md-add" />添加客户
                </span>
              </Button>
              <Button
                :disabled="disabled"
                class="mr10 w90"
                @click="removeCustomer"
                v-has="'deleteRight'"
              >
                <span class="center">
                  <Icon custom="iconfont iconlajitongicon icons" />删除客户
                </span>
              </Button>
              <Button
                :disabled="disabled"
                class="mr10 w90"
                @click="saveCustomer"
                v-has="'saveRight'"
              >
                <span class="center">
                  <Icon custom="iconfont iconbaocunicon icons" />保存
                </span>
              </Button>
            </div>
            <vxe-table
              border
              resizable
              auto-resize
              stripe
              sheetName="n1"
              id="n1"
              ref="xTable1"
              height="440"
              :loading="customer.loading"
              :data="customer.tbdata"
              @select-all="selectAllrightcus"
              @select-change="selectRC"
            >
              <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column field="fullName" title="客户全称"></vxe-table-column>
              <vxe-table-column field="shortName" title="客户简称"></vxe-table-column>
              <vxe-table-column field="createUname" title="操作人"></vxe-table-column>
              <vxe-table-column field="createTime" title="操作日期"></vxe-table-column>
            </vxe-table>
          </div>
          <div class="tabs-warp" v-show="tabIndex == 1">
            <div class="btns-warp">
              <Input v-model="part.code" placeholder="请输入编码" style="width: 140px;" class="mr10" />
              <Input
                v-model="part.fullname"
                placeholder="请输入名称"
                style="width: 140px;"
                class="mr10"
              />
              <Input v-model="part.partInner" placeholder="请输入内码" style="width: 140px;" class="mr10" />
              <Input v-model="part.oemCode" placeholder="请输入OE码" style="width: 140px;" class="mr10" />
              <Button :disabled="disabled" class="mr10 w90" @click="queryPart" type="warning">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="addAccessories">
                <span class="center">
                  <Icon type="md-add" />添加配件
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="importModule">
                <span class="center">
                  <Icon type="md-add" />导入
                </span>
              </Button>
              <Button class="mr10 w90" @click="deletePart">
                <span class="center">
                  <Icon type="md-add" />删除
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="savePart" v-has="'saveRight3'">
                <span class="center">
                  <Icon custom="iconfont iconbaocunicon icons" />保存
                </span>
              </Button>
            </div>
            <vxe-table
              border
              resizable
              auto-resize
              stripe
              sheetName="n1"
              row-id="id"
              id="n1"
              height="440"
              ref="part"
              keep-source
              :loading="part.loading"
              @checkbox-all="removeLimitChangeAll"
              @checkbox-change="removeLimitChange"
              :data="part.tbdata"
              highlight-current-row
              :edit-config="{ trigger: 'click', mode: 'cell',showStatus: true}"
            >
              <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
              <vxe-table-column field="partId" title="配件内码"></vxe-table-column>
              <vxe-table-column field="oemCode" title="配件OE码"></vxe-table-column>
              <vxe-table-column field="fullName" title="配件全称"></vxe-table-column>
              <!-- <vxe-table-column field="costPrice" title="成本单价" v-if="rowPriceManege.name=='统一售价'"></vxe-table-column> -->
              <vxe-table-column
                field="sellPrice"
                :title="sellPriceTitle"
                min-width="60"
                :edit-render="{ name: 'input' }"
              >
                <template v-slot:edit="{ row }">
                  <el-input-number
                    :min="0"
                    :precision="2"
                    v-model="row.sellPrice"
                    :controls="false"
                    size="mini"
                  />
                </template>
              </vxe-table-column>
              <vxe-table-column
                field="minRequiredQty"
                title="最低要求数量"
                min-width="60"
                v-if="rowPriceManege.name=='最低售价'"
                :edit-render="{ name: 'input' }"
              >
                <template v-slot:edit="{ row }">
                  <el-input-number
                    :min="0"
                    v-model="row.minRequiredQty"
                    :controls="false"
                    size="mini"
                  />
                </template>
              </vxe-table-column>
              <vxe-table-column
                field="maxRequiredQty"
                title="最高要求数量"
                min-width="60"
                v-if="rowPriceManege.name=='最低售价'"
                :edit-render="{ name: 'input' }"
              >
                <template v-slot:edit="{ row }">
                  <el-input-number
                    :min="0"
                    v-model="row.maxRequiredQty"
                    :controls="false"
                    size="mini"
                  />
                </template>
              </vxe-table-column>
              <vxe-table-column
                title="解除限制"
                v-if="rowPriceManege.name=='最低售价'"
                field="removeLimitCheckBox"
                :edit-render="{}"
              >
                <template v-slot:edit="{ row }">
                  <vxe-checkbox v-model="row.removeLimitCheckBox"></vxe-checkbox>
                </template>
                <template v-slot="{ row }">
                  <vxe-checkbox v-model="row.removeLimitCheckBox"></vxe-checkbox>
                </template>
              </vxe-table-column>
              <vxe-table-column field="operationName" title="操作人"></vxe-table-column>
              <vxe-table-column field="operationTime" title="操作日期"></vxe-table-column>
            </vxe-table>
          </div>
          <div class="page-warp">
            <Page
              v-if="tabIndex == 0"
              class-name="page-con"
              :current="customer.page.num"
              :total="customer.page.total"
              :page-size="customer.page.size"
              @on-change="changePageCus"
              @on-page-size-change="changeSizeCus"
              show-sizer
              show-total
              show-elevator
            ></Page>
            <Page
              v-else
              class-name="page-con"
              :current="part.page.num"
              :total="part.page.total"
              :page-size="part.page.size"
              @on-change="changePagePagePart"
              @on-page-size-change="changeSizePagePart"
              show-sizer
              show-total
              show-elevator
            ></Page>
          </div>
        </div>
      </Split>
    </section>
    <Modal v-model="modal" title="客户资料" :footer-hide="true" width="1020">
      <Dia-log ref="curs" :show.sync="modal" @addcu="addcu"></Dia-log>
    </Modal>
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!-- 导入模板弹窗组件-->
    <importXLS :URL="impirtUrl" ref="imp" @getNewList="getNew"></importXLS>
  </main>
</template>

<script>
import * as api from "_api/system/priceManage";
import DiaLog from "./dialog.vue";
// import selectPartCom from "@/view/AlotManagement/transferringOrder/stockRemoval/compontents/selectPartCom.vue";
import selectPartCom from "@/view/system/basicData/priceManage/components/selectPartCom.vue";
import importXLS from "@/view/settlementManagement/components/importXLS.vue";
// strategyId
export default {
  name: "priceManage",
  inject: ["reload"],
  data() {
    return {
      split: 0.34,
      // 按钮禁用
      disabled: true,
      // 价格启用禁用按钮 是否可以点击
      priceEnableBool: true,
      // 价格启用禁用
      priceEnable: "启用",
      // 左侧所被选中的行
      rowPriceManege: {},
      // 最低销价
      sellPriceTitle: "最低销价",
      // modal显示
      modal: false,
      // tab索引
      tabIndex: 0,
      // 选中的行
      currRow: null,
      // 选中是否第一行
      curronly: false,
      // 级别修改和新增数据
      levelupOrSaveArr: [],
      // 级别删除的数据
      leveldelarr: [],
      // 级别名称
      level: {
        loading: false,
        name: "", // 修改的级别名称
        tbdata: [{ name: "最低售价", readonly: true }]
      },
      selectCrr: [],
      // 右边选择的客户
      selectRightCR: [],
      // 右边删除的客户
      removeRightCr: [],
      // 客户信息
      customer: {
        pinyin: "", //客户拼音
        fullname: "", //客户全程
        // 表头
        // 表身
        tbdata: [],
        // 表格加载
        loading: false,
        // 分页
        page: {
          num: 1,
          total: 0,
          size: 10
        }
      },
      part: {
        pinyin: "", // 拼音
        code: "", // 编码
        fullname: "", // 名称
        partInner: "",
        oemCode: "",
        // 表身
        tbdata: new Array(),
        // 表格加载
        loading: false,
        // 分页
        page: {
          num: 1,
          total: 0,
          size: 10
        }
      },
      impirtUrl: {
        downId: "",
        upUrl: api.impUrl
      },
      // 配件表格中默认选中
      defaultSelecteRows: []
    };
  },
  components: {
    DiaLog,
    selectPartCom,
    importXLS
  },
  methods: {
    /**methods */
    /**==============左侧============= */
    // 获取表格
    async getLevelList() {
      this.rowPriceManege = {}
        ? (this.priceEnableBool = true)
        : (this.priceEnableBool = false);
      this.level.tbdata = [{ name: "最低售价", readonly: true }];
      // isDisabled:0 启用
      // isDisabled:1 禁用
      let res = await api.sellPsList();
      if (res.code === 0) {
        res.data.forEach(el => {
          el.oid = el.id;
          // el.readonly = el.isDisabled == 1 ? true : false;
          this.level.tbdata.push(el);
        });
      }
      this.leveldelarr = [];
    },
    // 获取客户
    async getCus() {
      this.customer.loading = true;
      this.selectCrr = [];
      this.removeRightCr = [];
      this.selectRightCR = [];
      let params = {};
      let data = {};
      if (this.customer.fullname) {
        data.fullName = this.customer.fullname.trim();
      }
      if (this.customer.pinyin) {
        data.pyName = this.customer.pinyin.trim();
      }
      data.strategyId = this.currRow.id;
      params.page = this.customer.page.num - 1;
      params.size = this.customer.page.size;
      let res = await api.findAllCus(params, data);
      if (res.code == 0) {
        this.customer.loading = false;
        this.customer.tbdata = res.data.content;
        this.customer.tbdata.forEach(el => {
          el.oid = el.id;
        });
        this.customer.page.total = res.data.totalElements;
      }
    },
    // 获取配件
    async getPart() {
      this.part.loading = true;
      let data = {};
      let params = {};
      if (this.part.fullname.trim()) {
        data.fullName = this.part.fullname.trim();
      }
      if (this.part.code.trim()) {
        data.partCode = this.part.code.trim();
      }
      if (this.part.partInner.trim()) {
        data.partId = this.part.partInner.trim()
      }
      if (this.part.oemCode.trim()) {
        data.oemCode = this.part.oemCode.trim()
      }
      if (this.part.partInner.trim()) {
        data.partId = this.part.partInner
      }
      if (this.part.oemCode.trim()) {
        data.oemCode = this.part.oemCode
      }
      params.strategyId = this.currRow.id;
      params.page = this.part.page.num - 1;
      params.size = this.part.page.size;
      let res = await api.queryPart(params, data);
      if (res.code == 0) {
        console.log(res)
        this.part.loading = false;
        this.part.tbdata = res.data.content.map(el => {
          let data = {};
          data = el;
          el.sellPrice = parseFloat(el.sellPrice).toFixed(2);
          el.costPrice = parseFloat(el.costPrice).toFixed(2);
          el.minRequiredQty = parseInt(el.minRequiredQty);
          el.maxRequiredQty = parseInt(el.maxRequiredQty);
          if (el.removeLimit == 1) {
            this.defaultSelecteRows.push(data.id);
          }
          if(el.hasOwnProperty('removeLimit')){
            el.removeLimitCheckBox = el.removeLimit === 1?true:false
          }
          return data;
        });
        this.part.page.total = res.data.totalElements;
      }
    },
    rowPriceLevelStyle(row) {
      if (row.row.isDisabled == 1) {
        return `backgroundColor:#f2f2f2 !important;`;
      }
    },
    selectPartName(selectPartName) {
      // this.getPart()
      this.part.tbdata.push(selectPartName);
    },
    removeLimitChange(checkbox) {
      console.log(checkbox.selection)
      // if (checkbox == true) {
      //   this.$refs.part.setCheckboxRow(this.part.tbdata[checkbox.$rowIndex],true);
      // } else {
      //   // this.$refs.part.setCheckboxRow(this.part.tbdata[checkbox.$rowIndex],false);
      //   // this.$refs.part.clearCheckboxRow(this.part.tbdata[checkbox.$rowIndex]);
      // }
      // this.part.tbdata.map(item => {
      //   if (item.id == checkbox.row.id) {
      //     checkbox.checked == true
      //       ? (item.removeLimit = 1)
      //       : (item.removeLimit = 0);
      //   }
      // });
    },
    removeLimitChangeAll({ checked, records }) {
      // if (checked == true) {
      //
      //   this.part.tbdata.map(item=>{
      //     item.removeLimit=1
      //   })
      // } else {
      //   this.part.tbdata.map(item=>{
      //     item.removeLimit=0
      //   })
      // }
    },
    // rest
    restTbdata() {
      this.customer = {
        pinyin: "", //客户拼音
        fullname: "", //客户全程
        // 表头
        // 表身
        tbdata: new Array(),
        // 表格加载
        loading: false,
        // 分页
        page: {
          num: 1,
          total: 0,
          size: 10
        }
      };
      this.part = {
        pinyin: "", // 拼音
        code: "", // 编码
        fullname: "", // 名称
        // 表身
        tbdata: new Array(),
        // 表格加载
        loading: false,
        // 分页
        page: {
          num: 1,
          total: 0,
          size: 10
        }
      };
    },
    // 保存级别
    async save() {
      let data = {
        addList: []
      };
      data.addList = JSON.parse(JSON.stringify(this.level.tbdata));
      if (this.leveldelarr.length > 0) {
        data.delList = this.leveldelarr;
      }
      data.addList.forEach((el, index, arr) => {
        if (el.readonly) {
          arr.splice(index, 1);
        }
      });
      let isOk = data.addList.every(el => {
        let name = el.name.trim();
        if (name && name.length >= 1) {
          return true;
        }
        return false;
      });
      if (!isOk) {
        return this.$Message.error("级别名称未输入");
      }
      let res = await api.sellPsSave(data);
      if (res.code === 0) {
        this.$Message.success("保存成功");
        this.getLevelList();
        this.restTbdata();
      }
    },
    // 新增
    add() {
      this.level.tbdata.push({ name: "", isNew: true, oid: Date.now() });
    },
    // 单选行
    async selectRow({ row },tabIndex1) {
      // console.log(row);
      this.rowPriceManege = row;
      // this.rowPriceLevelStyle(row);
      this.rowPriceManege.isDisabled == 0
        ? (this.priceEnable = "禁用")
        : (this.priceEnable = "启用");
      this.rowPriceManege.readonly == true
        ? (this.priceEnableBool = true)
        : (this.priceEnableBool = false);
      this.rowPriceManege.readonly == true
        ? (this.sellPriceTitle = "最低销价")
        : (this.sellPriceTitle = "销售价格");
      this.rowPriceManege.readonly == true
        ? await (this.impirtUrl.upUrl = `${api.impUrl}`)
        : await (this.impirtUrl.upUrl = `${api.impUrl}?strategyId=${this.rowPriceManege.id}`);
      const curs = this.$refs.curs;
      curs.custarr = new Array();
      this.currRow = row;
      this.disabled = false;
      this.selectCrr = new Array();
      this.removeRightCr = new Array();
      this.selectRightCR = new Array();
      this.customer.pinyin = "";
      this.customer.fullname = "";
      this.part.pinyin = "";
      this.part.code = "";
      this.part.fullname = "";
      this.part.partInner = "";
      this.part.oemCode = "";
      if (row.readonly) {
        this.curronly = true;
        this.tabIndex = 1;
      } else {
        this.curronly = false;
        this.tabIndex = 0;
      }
      this.customer.page = {
        num: 1,
        total: 0,
        size: 10
      };
      this.part.page = {
        num: 1,
        total: 0,
        size: 10
      };
      if (row.isNew) return false;
      if (!this.curronly) {
        this.getCus();
      }
      this.getPart();
    },
    // 删除
    remove() {
      if (!this.currRow) {
        return this.$Message.error("请先选中一个级别名称");
      }
      this.level.tbdata.forEach((el, index, arr) => {
        if (this.currRow.oid === el.oid && !el.readonly) {
          arr.splice(index, 1);
          el.id && this.leveldelarr.push(el);
        }
      });
      this.currRow = null;
    },
    // 切换价格启用禁用
    priceEnableFun() {
      let data = {};
      data.id = this.rowPriceManege.id;
      api.tabPriceEnable(data).then(() => {
        if (this.rowPriceManege.isDisabled == 0) {
          this.priceEnable = "禁用";
        } else {
          this.priceEnable = "启用";
        }
        this.$Message.success(`价格${this.priceEnable}成功`);
        this.getLevelList();
        this.rowPriceManege.isDisabled == 0
          ? (this.priceEnable = "禁用")
          : (this.priceEnable = "启用");
      });
    },
    // tab切换
    setTab(index) {
      this.tabIndex = index;
    },
    /**============客户信息============ */
    // 翻页-客户信息
    changePageCus(p) {
      this.customer.page.num = p;
      this.getCus();
    },
    // 修改每页显示条数-客户信息
    changeSizeCus(size) {
      this.customer.page.num = 1;
      this.customer.page.size = size;
      this.getCus();
    },
    // 查询客户
    queryCustomer() {
      this.customer.page.num = 1;
      this.getCus();
    },
    // 添加客户
    addCustomer() {
      const curs = this.$refs.curs;
      this.selectCrr = new Array();
      this.selectRightCR = new Array();
      this.removeRightCr = new Array();
      curs.init();
      this.modal = true;
    },
    // 添加客户
    addcu(val) {
      this.modal = false;
      var obj = {};
      this.selectCrr = val;
      this.customer.tbdata = this.customer.tbdata.concat(val);
      this.customer.tbdata = this.customer.tbdata.reduce((item, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
        return item;
      }, []);
    },
    // 右侧-选择客户
    selectRC({ selection }) {
      this.selectRightCR = selection;
    },
    // 右侧-全选客户
    selectAllrightcus({ selection }) {
      this.selectRightCR = selection;
    },
    // 删除客户
    removeCustomer() {
      if (this.selectRightCR.length <= 0) {
        return this.$Message.error("请选择客户");
      }
      const curs = this.$refs.curs;
      this.removeRightCr = this.removeRightCr.concat(...this.selectRightCR);
      this.removeRightCr.forEach(rs => {
        this.customer.tbdata.forEach((el, index, arr) => {
          if (rs.id === el.id) {
            arr.splice(index, 1);
          }
        });
        this.selectRightCR.forEach((el, index, arr) => {
          if (rs.id === el.id) {
            arr.splice(index, 1);
          }
        });
        curs.custarr.forEach((el, index, arr) => {
          if (rs.id === el.id) {
            arr.splice(index, 1);
          }
        });
      });
    },
    // 保存客户
    async saveCustomer() {
      let data = {
        addList: new Array(),
        delList: new Array()
      };
      data.addList = this.customer.tbdata.filter(el => el.new);
      this.removeRightCr.forEach(el => {
        if (el.oid) {
          data.delList.push(el);
        }
      });
      if (data.addList.length <= 0 && data.delList.length <= 0) {
        return this.$Message.error("没有修改过数据");
      }
      data.addList.forEach(el => {
        el.strategyId = this.currRow.id;
        el.guestId = el.id || el.guestId;
        Reflect.deleteProperty(el, "id");
      });
      let res = await api.sellcussave(data);
      if (res.code === 0) {
        const curs = this.$refs.curs;
        curs.custarr = new Array();
        this.$Message.success("保存成功");
        this.getCus();
      }
    },
    /**============配件============ */
    // 添加配件
    addAccessories() {
      if (this.rowPriceManege != {}) {
        this.rowPriceManege.name == "最低售价"
          ? (this.$refs.selectPartCom.apiDataId = "")
          : (this.$refs.selectPartCom.apiDataId = this.rowPriceManege.id);
        this.$refs.selectPartCom.init();
      } else {
        this.$Message.error("请选择一个价格");
      }
    },
    //配件返回的参数
    async getPartNameList(val) {
      var arr = [];
      val.forEach(item => {
        item.partName = item.partStandardName;
        item.hasAcceptQty = undefined;
        item.carBrandName = item.adapterCarModel;
        item.orderPrice = item.minUnit;
        item.oemCode = item.oeCode;
        item.spec = item.specifications;
        item.partId = item.orgid;
        item.partInnerId = item.code;
        item.unit = item.minUnit;
        item.minRequiredQty = 0;
        item.maxRequiredQty = 0;
        item.sellPrice = parseFloat(0).toFixed(2);
        let el = Object.assign({}, item);
        delete el.id;
        delete el.orderPrice;
        arr.push(el);
      });
      let params = {};
      if(this.rowPriceManege.id != undefined) {
        params.strategyId = this.rowPriceManege.id
      }
      let res = await api.addWbParts(params, arr);
      if (!res == false) {
        this.$Message.success("添加成功");
        this.getPart();
      }
    },
    // 导入模板
    importModule() {
      this.rowPriceManege.name == "最低售价"
        ? (this.impirtUrl.downId = "2600000000")
        : (this.impirtUrl.downId = "2700000000");
      this.$refs.imp.openModal();
    },
    // 翻页-配件价格
    changePagePagePart(p) {
      this.part.page.num = p;
      this.getPart();
    },
    // 修改每页显示条数-配件价格
    changeSizePagePart(size) {
      this.part.page.num = 1;
      this.part.page.size = size;
      this.getPart();
    },
    // 查询配件
    queryPart() {
      this.part.page.num = 1;
      this.getPart();
    },
    //导入成功后刷新页
    getNew(data) {
      if(data.code == 0) {
        // this.reload();
        this.queryPart();
      }
    },
    // 保存配件
    async savePart() {
      let updateRecords = this.$refs.part.getUpdateRecords();
      // console.log(updateRecords)
      // return
      let res;
      // let data = [...this.part.tbdata];
      let data = [...updateRecords];
      data.map(item => {

        if(item.hasOwnProperty('removeLimitCheckBox')){
          item.removeLimit = item.removeLimitCheckBox ?1:0
        }
      })
      if (this.curronly) {
        res = await api.partPriceSave(data);
      } else {
        res = await api.partLevelSave(data);
      }
      if (res.code == 0) {
        this.$Message.success("保存成功");
        this.queryPart();
      }
    },
    async deletePart(){
      let selectRecords = this.$refs.part.getCheckboxRecords();
      if(selectRecords.length==0){
        this.$Message.error("请选择一条配件记录");
      }else {
        let ids = selectRecords.map(item => {
          let objData = {
            id:item.id
          }
          return objData
        })
        if(this.rowPriceManege.readonly){
          let rep = await api.deleteLastPricePart(ids);
          if(rep.code==0){
            this.$Message.success("删除成功");
            this.getPart();
          }
        }else{
          let rep = await api.deletePricePart(ids);
          if(rep.code==0){
            this.$Message.success("删除成功");
            this.getPart();
          }
        }
      }

    }
  },
  mounted() {
    this.getLevelList();
  }
};
</script>
<style lang="less" scoped>
@import url("../../../lease/tenantres/icon");
@import url("./index");
</style>
<style>
.edit {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  outline: none;
  border: 0;
  background-color: transparent;
}
</style>

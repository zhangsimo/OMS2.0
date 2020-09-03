<template>
  <Modal v-model="isCost" title="费用登记" width="1100">
    <div class="costBox clearfix con-split">
      <div class="fl mr10">
        <div class="leftT mb15">
          <Select style="width:100px" class="mr15" v-model="selectValue">
            <Option value="0">往来单位名称</Option>
            <Option value="1">往来单位编码</Option>
          </Select>
          <Input
            placeholder="请输入查询内容"
            style="width: 200px"
            v-model="inputval"
            class="mr15"
          />
          <Button type="primary" @click="query">查询</Button>
        </div>
        <div class="pane-made-hd">往来单位列表</div>
        <div>
          <vxe-table
            border
            stripe
            resizable
            height="420"
            size="mini"
            :data="tableData"
            :loading="loading"
            highlight-current-row
            @current-change="currentChangeEvent"
          >
            <vxe-table-column
              type="seq"
              width="100"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column field="name" title="操作" width="100">
              <template v-slot="{ row }">
                <a href="javascript:;" @click="add(row)">添加</a>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="fullName"
              title="往来单位"
              width="140"
            ></vxe-table-column>
            <vxe-table-column
              field="code"
              title="编码"
              width="140"
            ></vxe-table-column>
          </vxe-table>
          <Page
            size="small"
            class="mr10 mt10"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            show-elevator
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changeSize"
          />
        </div>
      </div>
      <div class="fr right">
        <div class="mb15">
          <Button type="primary" class="mr10" :disabled="dsiabled" @click="save"
            >保存</Button
          >
          <Button @click="cancel">取消</Button>
        </div>
        <div>
          <vxe-table
            class="vxe-table-iview"
            border
            resizable
            stripe
            size="mini"
            :data="tableInfoData"
            height="450"
            :loading="loading2"
            highlight-current-row
            ref="xTable"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            >
            <vxe-table-column
              type="seq"
              width="60"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column width="60" title="操作">
              <template v-slot="{ row, rowIndex }">
                <a href="javascript:;" @click="del(rowIndex)">删除</a>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="fullName"
              title="往来单位"
              width="120"
            ></vxe-table-column>
            <!-- <vxe-table-column field="serviceType" title="收支项目" width="120"
            :edit-render="{name: 'Select', options: revenueTypes}"
            ></vxe-table-column> -->
            <vxe-table-column
              title="收支项目"
              width="120"
              field="serviceType"
              :edit-render="{ type: 'Select' }"
            >
              <template v-slot:edit="scope">
                <Select
                  transfer
                  style="width:100px"
                  v-model="scope.row.serviceType"
                  @on-change="changeSelect(scope)"
                >
                  <Option
                    v-for="item in revenueTypes"
                    :value="item.value"
                    :key="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</Option
                  >
                </Select>
              </template>
              <template v-slot="{ row }">{{
                getSelectLabel(row.serviceType, revenueTypes)
              }}</template>
            </vxe-table-column>
            <vxe-table-column
              field="rpAmt"
              title="应付金额"
              width="160"
              :edit-render="{ name: 'input' }"
            >
              <template v-slot:edit="{ row }">
                <el-input-number
                  :max="999999"
                  :min="0"
                  :precision="2"
                  v-model="row.rpAmt"
                  :controls="false"
                  size="mini"
                />
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="remark"
              title="备注"
              width="120"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="createUname"
              title="创建人"
              width="80"
            ></vxe-table-column>
            <vxe-table-column
              field="createTime"
              title="创建日期"
              width="100"
            ></vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
// @ts-ignore
import * as api from "_api/procurement/plan";
import { orderState } from "../global";
import * as tools from "../../../../utils/tools";

enum Revenue {
  "运杂费" = 8,
  "业务费",
  "预提费",
  "收支保费",
  "行政采购",
  "保险销售其他费用",
  "关税费",
  "增值税费"
}

@Component
export default class FeeRegistration extends Vue {
  @State("user") user;

  @Prop(String) readonly serviceId;
  @Prop({ type: [String, Number] }) readonly state;

  private isCost: boolean = false;
  private selectValue: string = "";
  private inputval: string = "";
  private page: Page = {
    num: 1,
    size: 10,
    total: 0
  };
  private loading: boolean = false;
  private loading2: boolean = false;
  private tableData: Array<any> = new Array();
  private tableInfoData: Array<any> = new Array();

  // 选中行
  private selectrow: any = null;

  private revenueTypes = [
    { disabled: false, value: "8", label: "运杂费" },
    { disabled: false, value: "9", label: "业务费" },
    { disabled: false, value: "10", label: "预提费" },
    { disabled: false, value: "11", label: "收支保费" },
    { disabled: false, value: "12", label: "行政采购" },
    { disabled: false, value: "13", label: "保险销售其他费用" },
    { disabled: false, value: "14", label: "关税费" },
    { disabled: false, value: "15", label: "增值税费" }
  ];

  get dsiabled(): boolean {
    const stat: string = this.state; // orderState[];
    if (["草稿", "待收货"].includes(stat)) {
      return false;
    }
    return true;
  }

  private init() {
    this.isCost = true;
    this.tableData = new Array();
    this.tableInfoData = new Array();
    this.selectrow = null;
    this.loading = false;
    this.loading2 = false;
    this.page = {
      num: 1,
      size: 10,
      total: 0
    };
    this.revenueTypes = [
      { disabled: false, value: "8", label: "运杂费" },
      { disabled: false, value: "9", label: "业务费" },
      { disabled: false, value: "10", label: "预提费" },
      { disabled: false, value: "11", label: "收支保费" },
      { disabled: false, value: "12", label: "行政采购" },
      { disabled: false, value: "13", label: "保险销售其他费用" },
      { disabled: false, value: "14", label: "关税费" },
      { disabled: false, value: "15", label: "增值税费" }
    ];
    this.getList();
    this.getInfo();
  }

  private query() {
    if (!this.selectValue) return this.$Message.error("请选择筛选条件");
    this.tableInfoData = new Array();
    this.selectrow = null;
    this.getList();
  }

  private async getList() {
    this.loading = true;
    let data: any = {};
    let params: any = {
      size: this.page.size,
      page: this.page.num - 1
    };
    if (this.selectValue == "0") {
      data.fullName = this.inputval.trim();
    }
    if (this.selectValue == "1") {
      data.code = this.inputval.trim();
    }
    let res: any = await api.findPageByguest(params, data);
    if (res.code == 0) {
      this.loading = false;
      this.tableData = res.data.content;
      this.page.total = res.data.totalElements;
    }
  }

  private changePage(p: number) {
    this.page.num = p;
    this.getList();
  }
  private changeSize(size: number) {
    this.page.num = 1;
    this.page.size = size;
    this.getList();
  }

  private async getInfo() {
    this.tableInfoData = new Array();
    this.loading2 = true;
    let res: any = await api.getFee({}, { serviceId: this.serviceId });
    if (res.code == 0) {
      this.loading2 = false;
      let resData = res.data || [];
      this.tableInfoData = resData.map((el: any) => {
        el.serviceType = el.serviceType.value;
        el.fullName = el.guestName;
        for (let index in this.revenueTypes) {
          let o = this.revenueTypes[index]
          if (o.value == el.serviceType) {
            o.disabled = true;
            break;
          }
        }
        return el;
      });
    }
  }

  // 选中行
  private currentChangeEvent({ row }) {
    row.revenueTypes = this._.cloneDeep(this.revenueTypes);
    this.selectrow = row;
  }

  private async save() {
    let isOk: boolean = this.tableInfoData.every((el: any) =>
      el.serviceType ? true : false
    );
    if (!isOk) return this.$Message.error("请选择收支项目");
    let data: Array<any> = this.tableInfoData.map(el => {
      let obj = { ...el };
      obj.serviceId = this.serviceId;
      obj.guestId = this.selectrow.id;
      return obj;
    });
    this.loading2 = true;
    let res: any = await api.saveFee(data);
    if (res.code == 0) {
      this.$Message.success("保存成功");
      this.tableInfoData = res.data.map((el:any) => {
        el.fullName = el.guestName;
        el.serviceType = el.serviceType.value;
        return el;
      });
      this.loading2 = false;
    }
  }

  private cancel() {
    this.isCost = false;
  }

  private getSelectLabel(
    value,
    list,
    valueProp = "value",
    labelField = "label"
  ) {
    let item = this.$utils.find(list, item => item[valueProp] == value);
    return item ? item[labelField] : null;
  }

  private changeSelect(scope) {
    const row = scope.row;
    const val = row.serviceType;
    this.revenueTypes = this.revenueTypes.map((el: any) => {
      el.disabled = false;
      if (el.value == val) {
        el.disabled = true;
      }
      return el;
    });
    this.tableInfoData.forEach((el: any) => {
      this.revenueTypes.forEach((els: any) => {
        if (el.serviceType == els.value) {
          els.disabled = true;
        }
      });
    });
    const ref: any = this.$refs.xTable;
    ref.updateStatus(scope);
  }

  // 添加
  private add(selectRow: any) {
    // if(!this.selectrow) {
    //   return this.$Message.error("请先选择往来单位");
    // }

    if (this.tableInfoData.length >= this.revenueTypes.length) {
      return this.$Message.error("总条数不能超过收支项目条数");
    }
    let row = {
      guestName: "",
      duePayableAmt: 0,
      remark: "",
      serviceType: "",
      fullName: selectRow.fullName,
      createUname: this.user.userData.staffName,
      createTime: tools.transTime(new Date()),
      guestId: selectRow.id,
    };
    this.tableInfoData.push(row);
  }

  // 删除
  private async del(index: number) {
    const row = this.tableInfoData[index];
    const val = row.serviceType;
    // console.log(row)
    this.revenueTypes = this.revenueTypes.map((el: any) => {
      if (el.value == val) {
        el.disabled = false;
      }
      return el;
    });
    if(row.id) {
      let res:any = await api.delFee(row.id);
    }
    this.tableInfoData.splice(index, 1);
  }
}
</script>

<style lang="less">
.costBox {
  display: flex;
  justify-content: space-between;
  .pane-made-hd {
    line-height: 20px;
    padding: 5px;
    background-color: #e8e8e8;
  }
  .fl {
    flex: auto;
  }
  .fr {
    width: 580px;
    overflow-x: auto;
  }
}
</style>

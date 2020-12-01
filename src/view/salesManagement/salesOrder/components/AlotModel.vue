<template>
  <div>
    <Modal v-model="model" title="调拨申请" width="1000">
      <div class="warp">
        <div class="partCheck-hd pb15">
          <Button class="mr10" @click="createOrder">生成调拨申请</Button>
          <Button @click="cancel">取消</Button>
        </div>
        <div class="warp_center">
          <Form
            inline
            :model="formPlan"
            ref="formPlan"
            :rules="ruleValidate"
            :label-width="120"
          >
            <Row>
              <Col span="12">
                <FormItem label="调出方：" prop="guestName">
                  <Row>
                    <Col span="22">
                      <Input
                        placeholder="请选择调出方"
                        v-model="formPlan.guestName"
                        readonly
                        disabled
                      />
                    </Col>
                    <Col span="2">
                      <Button
                        class="ml5"
                        size="small"
                        type="default"
                        @click="addSuppler"
                        ><i class="iconfont iconxuanzetichengchengyuanicon"></i
                      ></Button>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem class="formItem" label="调入仓库：" prop="storeId">
                  <Select
                    class="w160"
                    v-model="formPlan.storeId"
                    @on-change="selectStoreId"
                  >
                    <Option
                      :disabled="item.isDisabled"
                      v-for="item in List"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="调拨申请日期：" prop="orderDate">
                  <DatePicker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width: 180px"
                    placeholder="请选择调拨申请日期"
                    :options="options1"
                    v-model="formPlan.orderDate"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem class="formItem" label="备注：" prop="remark">
                  <Input v-model="formPlan.remark" :maxlength="100" />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div class="bottom_warp">
          <Row class="mb10">
            <Button @click="delPart">删除配件</Button>
          </Row>
          <Row>
            <vxe-table
              ref="xTable"
              border
              resizable
              highlight-current-row
              highlight-hover-row
              show-overflow="title"
              size="mini"
              height="400"
              @current-change="currentChangeEvent"
              :edit-rules="validRules"
              :data="tbdata"
              :edit-config="{ trigger: 'click', mode: 'cell' }"
            >
              <vxe-table-column
                field="partCode"
                title="配件编码"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="partName"
                title="配件名称"
                width="120"
              ></vxe-table-column>
              <vxe-table-column
                field="partBrand"
                title="品牌"
                width="70"
              ></vxe-table-column>
              <vxe-table-column
                field="applyQty"
                title="申请数量"
                :edit-render="{ name: 'input', attrs: { disabled: false } }"
                width="100"
              >
              </vxe-table-column>
              <vxe-table-column field="itQty" title="对方库存" width="90"></vxe-table-column>
              <vxe-table-column field="unit" title="单位" width="50"></vxe-table-column>
              <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
              <vxe-table-column field="" title="品牌车型" width="100">
                <template v-slot="{ row }"
                  >{{ row.carBrandName }} {{ row.carModelName }}</template
                >
              </vxe-table-column>
              <vxe-table-column field="spec" title="规格" width="80"></vxe-table-column>
              <vxe-table-column
                field="showDirection"
                title="方向"
                width="60"
              ></vxe-table-column>
              <vxe-table-column field="partInnerId" title="配件内码"></vxe-table-column>
            </vxe-table>
          </Row>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <select-supplier
      ref="selectSupplier"
      header-tit="供应商资料"
      @selectSupplierName="getSupplierName"
    ></select-supplier>
  </div>
</template>

<script>
import { queryByOrgid } from "_api/AlotManagement/transferringOrder";
import SelectSupplier from "@/view/AlotManagement/transferringOrder/applyFor/compontents/supplier/selectSupplier2";
import * as api from "@/api/salesManagment/salesOrder";
import * as tools from "_utils/tools";
export default {
  components: {
    SelectSupplier
  },
  data() {
    let changeNumber = ({ cellValue }) => {
      const reg = /^[1-9]\d{0,}$/;
      if (!reg.test(cellValue) || cellValue <= 0) {
        return Promise.reject(new Error("数量输入不正确"));
      }
    };
    return {
      model: false,
      options1: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      validRules: {
        applyQty: [{ required: true, validator: changeNumber }]
      },
      tbdata: [],
      List: [],
      currRow: undefined,
      guestidId: "",
      isInternalId: "",
      formPlan: {
        guestName: "",
        storeId: "",
        orderDate: "",
        remark: ""
      },
      ruleValidate: {
        guestName: [
          {
            required: true,
            type: "string",
            message: "调出方不能为空",
            trigger: "change"
          }
        ],
        storeId: [
          {
            required: true,
            type: "string",
            message: "调入仓库不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    init(orderId, data) {
      this.tbdata = data.map(el => {
          el.applyQty = el.stockOutQty * 1;
          return el;
      });
      this.formPlan = {
        guestName: "",
        storeId: "",
        orderDate: new Date(),
        remark: orderId,
      };
      this.currRow = undefined;
      this.warehouse();
      this.model = true;
    },
    // 仓库下拉框
    warehouse() {
      queryByOrgid().then(res => {
        if (res.code === 0) {
          this.List = res.data;
          res.data.map(item => {
            if (item.isDefault == true) {
              this.formPlan.storeId = item.id;
              this.StoreId = item.id;
            }
          });
        }
      });
    },
    //供应商弹框
    addSuppler() {
      this.$refs.selectSupplier.init();
    },
    getSupplierName(a) {
      this.formPlan.guestOrgid = a.id;
      this.formPlan.guestName = a.shortName || "";
      this.guestidId = a.guestId;
      this.isInternalId = a.id;
      this.getpartStock();
    },
    // 获取对方库存
    async getpartStock() {
        let data = {
            orgid: this.isInternalId,
            partIds: this.tbdata.map(el => el.partId),
        }
        let res = await api.partStock(data);
        if(res.code == 0 && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach(el => {
            this.tbdata.forEach(item => {
              if(el.partId === item.partId) {
                item.itQty = el.outableQty || 0;
              }
            })
          })
        } else {
          this.tbdata.forEach(item => {
            item.itQty = 0;
          })
        }
        this.tbdata.push();
    },
    // 调入仓库下拉改变事件
    selectStoreId(val) {
      // console.log(val)
    },
    // 是否紧俏品
    async isT() {
      let data = {
        orgid: this.isInternalId,
        partIds: this.tbdata.map(el => el.partId),
      }
      let res = await api.findAllByDTO(data);
      return res.data || [];
    },
    currentChangeEvent({ row }) {
      this.currRow = row;
    },
    delPart() {
      if (!this.currRow) {
        return this.$message.error("请选择要删除的配件!");
      }
      this.tbdata = this.tbdata.filter(el => el._XID != this.currRow._XID);
      this.$message.success("删除成功!");
    },
    createOrder() {
      this.$Modal.confirm({
        content: "<p>是否确定生成调拨申请单！</p>",
        onOk: async () => {
          // if (this.tbdata.length <= 0) {
          //   return this.$message.error("无配件明细!");
          // }
          // if (this.formPlan.guestName == "") {
          //   return this.$message.error("请选择调出方!");
          // }
          let hasZero = this.tbdata.find(el => {
            return el.applyQty <= 0 || !el.applyQty;
          })
          if(hasZero) {
              return this.$message.error("单据明细申请数量不规范！");
          }
          this.save();
        },
        onCancel: () => {}
      });
    },
    cancel() {
      this.model = false;
    },
    save() {
      this.$refs.formPlan.validate(async valid => {
        if (valid) {
          let arr = await this.isT();
          arr.forEach(el => {
            this.tbdata.forEach(item => {
              if(el.partId === item.partId) {
                item.isTight = 1;
              }
            })
          })
          let data = {}
          data.guestId = this.guestidId;
          data.guestOrgid = this.isInternalId;
          data.guestOrgid = this.formPlan.guestOrgid;
          data.storeId = this.formPlan.storeId;
          data.remark = this.formPlan.remark;
          data.orderDate = tools.transTime(this.formPlan.orderDate);
          data.detailVOS = [...this.tbdata];
          let res = await api.allotApplySave(data);
          this.$message.success("操作成功!");
          this.cancel();
        } else {
          this.$message.error("请完善信息！");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.warp {
  background-color: #ccc;
  & > div {
    background-color: #fff;
  }
  .warp_center {
    margin: 1px 0;
    padding: 20px 0 0px;
  }
  .bottom_warp {
    padding: 15px 0;
  }
}
</style>

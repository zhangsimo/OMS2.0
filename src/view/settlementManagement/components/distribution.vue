<template>
  <Modal v-model="modal1" title="人工分配" width="800" @on-visible-change="visChange">
    <Table :columns="money" :data="moneyList" border></Table>
    <Button class="mt10 mr10" @click="addLine">添加行</Button>
    <Button class="mt10" @click="deleteLine">删除行</Button>
    <vxe-table
      border
      show-footer
      show-overflow
      auto-resize
      stripe
      highlightCurrentRow
      class="mt10"
      ref="xTable"
      align="center"
      height="300"
      :data="tableData"
      @current-change="currChange"
      :footer-method="footerMethod"
      :footer-span-method="footerRowspanMethod"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="分配店号">
        <template v-slot="{row}">
          <Select v-model="row.name">
            <Option v-for="item in shopList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="age" title="收入金额">
        <template v-slot="{row}">
          <InputNumber v-model="row.age" />
        </template>
      </vxe-table-column>
      <vxe-table-column field="date" title="支出金额">
        <template v-slot="{row}">
          <InputNumber v-model="row.date" />
        </template>
      </vxe-table-column>
    </vxe-table>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
      <Button @click="modal1=false">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      modal1: false, //弹框
      money: [
        {
          title: "需分配金额",
          children: [
            {
              title: "收入金额",
              key: "age",
              align: "center"
            },
            {
              title: "支出金额",
              key: "age",
              align: "center"
            }
          ]
        }
      ], //金额数据
      moneyList: [], //金额数据
      tableData: [{ name: "11" }], //金额表格
      shopList: [
        {
          label: 11,
          value: 1
        }
      ], //分配店号下拉框
      currentRow: {}, //选中行数据
      falg:false,//判断核对金额
    };
  },
  methods: {
    //弹框是否打开
    visChange(type) {
      if (type) {
        // console.log(this.$parent);
      }
    },
    //确定
    determine() {
      if(!this.falg) {}else{
        this.$Message.error('核对金额不为0，无法保存')
      }
    },
    //添加行
    addLine() {
      this.tableData.push({
        age: 0,
        date: 0
      });
    },
    //删除行
    deleteLine() {
      if (Object.keys(this.currentRow).length !== 0) {
        this.$refs.xTable.remove(this.currentRow);
        this.tableData = this.tableData.filter(
          itm => !this.currentRow._XID.includes(itm._XID)
        );
      } else {
        this.$message.error("请选择要删除的数据");
      }
    },
    //选中行
    currChange({ row }) {
      this.currentRow = row;
    },
    //表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "分配合计";
          }
          if (["age", "date"].includes(column.property)) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        }),
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "核对";
          }
          if (["age"].includes(column.property)) {
            if(column.property) this.falg = true
            return this.$utils.sum(data, column.property);
          } else if (["date"].includes(column.property)) {
            if(column.property) this.falg = true
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    //表尾合并列方法
    footerRowspanMethod({ columnIndex }) {
      if (columnIndex === 1) {
        return {
          rowspan: 0,
          colspan: 0
        };
      } else if (!columnIndex) {
        return {
          rowspan: 1,
          colspan: 2
        };
      }
    }
  }
};
</script>
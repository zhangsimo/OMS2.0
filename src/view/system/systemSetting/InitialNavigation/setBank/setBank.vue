<template>
  <div class="bank-box">
    <div class="bank-header">
      <Button class="mr20 w90" @click="validEvent" v-has="'validEvent'">
        <span class="center">
          <Icon custom="iconfont iconbaocunicon icons" />保存
        </span>
      </Button>
      <Button class="mr10 w90" @click="setAuit" v-if="oneBankList.isInit == 0" v-has="'setAuit'">
        <span class="center">
          <Icon custom="iconfont iconshenheicon icons" />审核
        </span>
      </Button>
      <Button class="mr10 w90" @click="refresh" v-has="'refresh'">
        <span class="center">
          <Icon custom="iconfont iconshuaxinicon icons" />刷新
        </span>
      </Button>
    </div>
    <div class="bank-center">
      <div>
        <vxe-table
          border
          ref="xTable"
          :loading="isShow"
          resizable
          height="500"
          align="center"
          highlight-current-row
          @current-change="clOnewList"
          highlight-hover-row
          :edit-rules="validRules"
          size="mini"
          show-overflow
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'row'}"
        >
          <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="code" title="账户编码"></vxe-table-column>
          <vxe-table-column field="name" title="账户名称"></vxe-table-column>
          <vxe-table-column field="accountTypeId" title="账户类型" :formatter="getType"></vxe-table-column>
          <vxe-table-column field="initBalance" title="初期金额" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="isInit" title="是否审核">
            <template v-slot="{ row }">{{ row.isInit == 1 ? '是' : '否' }}</template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column field="updateUname" title="最近修改人"></vxe-table-column>
          <vxe-table-column field="updateTime" title="最近修改日期"></vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>


<script>
import {
  getBankList,
  getAudit,
  saveAudit
} from "@/api/system/systemSetting/setBank";
export default {
  name: "setBank",
  data() {
    return {
      tableData: [],
      isShow: true,
      validRules: {
        initBalance: [{ required: true, message:'请输入大于等于0的小数(小数点后两位)/正整数', pattern: /^\d+(\.\d{1,2})?$/ }]
      },
      oneBankList: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取全部信息
    async getList() {
      this.isShow = true;
      let user = this.$store.state.user.userData;
      let res = await getBankList(user.groupId);
      if (res.code == 0) {
        this.isShow = false;
        res.data.map(item => {
          item.initBalance = +item.initBalance;
        });
        this.tableData = res.data;
      }
    },
    //保存校验
    validEvent() {
      this.$refs.xTable.validate(valid => {
        if (!valid) {
          this.$message.error("校验不通过");
        } else {
          saveAudit({ settleAccount: this.tableData }).then(res => {
            if (res.code == 0) {
              this.getList();
            }
          });
        }
      });
    },
    getType({ cellValue }) {
      let text = "";
      switch (cellValue) {
        case 0:
          text = "现金";
          break;
        case 1:
          text = "银行存款";
          break;
        case 2:
          text = "积分/卡券";
          break;
      }
      return text;
    },
    //获取当前点击的数据
    clOnewList(data) {
      this.oneBankList = data.row;
    },
    //审核
    setAuit() {
      let data = {};
      data.id = this.oneBankList.id;
      data.initBalance = this.oneBankList.initBalance;
      data.isDisabled = this.oneBankList.isDisabled;
      data.isInit = this.oneBankList.isInit;
      data.orgid = this.oneBankList.orgid;
      getAudit({ settleAccount: [data] }).then(res => {
        if (res.code == 0) {
          this.getList();
        }
      });
    },
    //刷新
    refresh() {
      this.getList();
    }
  }
};
</script>

<style scoped lang="less">
.bank-box {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bank-header {
  line-height: 57px;
  border-bottom: 1px #e0e0e0 solid;
  padding-left: 10px;
}
.bank-center {
  padding: 10px;
  height: 100%;
}
</style>

<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <queryCriteria ref="queryCriteria" :flag="flag" :store="true"/>
          <div>
            <Button class="mr10" type="warning" @click="query">查询</Button>
            <Button type="warning" @click="exportData">导出</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <vxe-table
          show-footer
          height="400"
          border
          resizable
          ref="xTable"
          :data="liablitiesData"
          header-align="center"
          footer-align="center"
          :footer-method="footerMethod"
        >
          <vxe-table-column title="基本信息" fixed="left">
            <vxe-table-column  show-overflow="tooltip" field="area" fixed="left" title="区域" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="shopNo" fixed="left" title="店号" width="60"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="shopName" fixed="left" title="店名" width="60"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="state" fixed="left" title="状态" width="60"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="资产类">
            <vxe-table-column  show-overflow="tooltip" field="hbzj" title="货币资金" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="yspj" title="应收票据" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="yszk" title="应收账款" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="hzzb" title="坏账准备" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="yszkje" title="应收账款净额" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="yfzk" title="预付账款" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="qtysk" title="其它应收款" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="ycl" title="原材料" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="clcbcy" title="材料成本差异" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="dzyhp" title="低值易耗品" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="kcsp" title="库存商品" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="zxcb" title="在修成本" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="chdjzb" title="存货跌价准备" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="cqtz" title="长期投资" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="dtfy" title="待摊费用" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="gdzcyj" title="固定资产原价" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="ljzj" title="累计折旧" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="gdzcql" title="固定资产清理" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="gdzcjz" title="固定资产净值" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="zjgc" title="在建工程" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="wxzc" title="无形资产" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="wxzctx" title="无形资产摊销" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="wxzcjz" title="无形资产净值" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="sy" title="商誉" width="100"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="cqdtfy" title="长期待摊费用" width="120"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="dclldzcss" title="待处理流动资产损失" width="160"></vxe-table-column>
            <vxe-table-column  show-overflow="tooltip" field="nbwl" title="内部往来" width="100"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="合计">
            <vxe-table-column show-overflow="tooltip" field="hjZcl" title="资产类合计" width="100"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="负债类">
            <vxe-table-column show-overflow="tooltip" field="dqjk" title="短期借款" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="yflr" title="应付利润" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="yfpj" title="应付票据" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="fzYfzk" title="应付账款" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="fzYszk" title="预收账款" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="ytfy" title="预提费用" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="yfgz" title="应付工资" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="yjsj" title="应交税金" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="yfgl" title="应付股利" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="qtyfk" title="其它应付款" width="100"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="合计">
            <vxe-table-column show-overflow="tooltip" field="hjFz" title="负债合计" width="100"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="所有者权益类">
            <vxe-table-column show-overflow="tooltip" field="sszb" title="实收资本" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="zbgj" title="资本公积" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="yygj" title="盈余公积" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="kcg" title="库存股" width="100"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="wfplr" title="未分配利润" width="100"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="合计">
            <vxe-table-column show-overflow="tooltip" field="hjSyzqy" title="所有者权益类合计" width="140"></vxe-table-column>
            <vxe-table-column show-overflow="tooltip" field="hjFzSyzqy" title="负债及所有者权益类合计" width="180"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="核对栏">
            <vxe-table-column show-overflow="tooltip" field="hdl" title="资产类合计平衡" width="130"></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
      </div>
    </section>
  </div>
</template>
<script>
import queryCriteria from "../components/queryCriteria";
import { groupBalanceSheet } from "_api/financialStatements/index.js";
export default {
  components: { queryCriteria },
  data() {
    return {
      liablitiesData: [], //表格
      flag: true //快速查询标识
    };
  },
  methods: {
    //查询接口
    getList() {
      let obj = {
        fiscalYear: this.$refs.queryCriteria.yearParticular,
        fiscalMonth: this.$refs.queryCriteria.monthParticular
      };
      if(this.$refs.queryCriteria.shopId != "") {
        obj.shopId = this.$refs.queryCriteria.shopId
      }
      groupBalanceSheet(obj).then(res => {
        if (res.code === 0) {
          this.liablitiesData = res.data.groupBalanceSheetVoList;
        }
      });
    },
    //查询
    query() {
      this.getList();
    },
    //表格合计
    footerMethod({ columns, data }) {
      const footerData = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "总价";
          }
          if (["shopName"].includes(column.property)) {
            return data.length + "家";
          }
          if (columnIndex>3) {
            return this.$utils.sum(data, column.property);
          }
          return null;
        })
      ];
      return footerData;
    },
    //导出
    exportData() {
      if (this.liablitiesData.length !== 0) {
        this.$refs.xTable.exportData({
          filename: "集团资产负债表",
          isHeader: true,
          isFooter: true
        });
      } else {
        this.$message.error("暂无数据");
      }
    }
  }
};
</script>

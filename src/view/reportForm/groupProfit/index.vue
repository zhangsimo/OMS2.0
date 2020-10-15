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
        <Table height="600" border :columns="profit" :data="profitData" ref="table"></Table>
      </div>
    </section>
  </div>
</template>
<script>
import queryCriteria from "../components/queryCriteria";
import { groupProfitSheet } from "_api/financialStatements/index.js";
export default {
  components: { queryCriteria },
  data() {
    return {
      profit: [
        {
          title: "基本信息",
          fixed: "left",
          align: "center",
          width: 400,
          tooltip: true,
          children: [
            {
              title: "区域",
              key: "area",
              fixed: "left",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "店号",
              key: "shopNo",
              fixed: "left",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "店名",
              key: "shopName",
              fixed: "left",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "结账状态",
              key: "state",
              fixed: "left",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "外部收入",
          align: "center",
          width: 300,
          tooltip: true,

          children: [
            {
              title: "外部收入",
              key: "wbsr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "外部折扣折让",
              key: "wbzkzr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "外部净收入",
              key: "wbjsr",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "内部收入",
          align: "center",
          width: 300,
          tooltip: true,

          children: [
            {
              title: "内部收入",
              key: "nbsr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "内部折扣折让",
              key: "nbzkzr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "内部净收入",
              key: "nbjsr",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "HS收入",
          align: "center",
          width: 300,
          tooltip: true,

          children: [
            {
              title: "HS收入",
              key: "hssr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "HS折扣折让",
              key: "hszkzr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "HS净收入",
              key: "hsjsr",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "成本",
          align: "center",
          width: 1300,
          tooltip: true,

          children: [
            {
              title: "外部成本",
              key: "wbcb",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "内部成本",
              key: "nbcb",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "HS成本",
              key: "hscb",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "配件管理费",
              key: "pjglf",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "供应商差价",
              key: "gyscj",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "供应商返利",
              key: "gysfl",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "其他",
              key: "qt",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "返工及索赔款",
              key: "fgjspk",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "存货盘盈或盘亏",
              key: "chpyhpk",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "存货跌价准备",
              key: "chdjzb",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "库存成本差异",
              key: "kccbcy",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "成本合计",
              key: "cbhj",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "税金及附加",
              key: "sjjfj",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "毛利",
          align: "center",
          width: 100,
          tooltip: true,

          children: [
            {
              title: "财务毛利",
              key: "cwml",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "费用",
          align: "center",
          width: 800,
          tooltip: true,

          children: [
            {
              title: "其他业务收入",
              key: "qtywsr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "其他业务支出",
              key: "qtywzc",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "营业费用",
              key: "yyfy",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "管理费用",
              key: "glfy",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "财务费用",
              key: "cwfy",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "营业外收入",
              key: "yywsr",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "营业外支出",
              key: "yywzc",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "费用总额",
              key: "fyze",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "投资收入",
          align: "center",
          width: 100,
          tooltip: true,

          children: [
            {
              title: "投资收益",
              key: "tzsy",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "利润",
          align: "center",
          width: 100,
          tooltip: true,

          children: [
            {
              title: "净利润",
              key: "jlr",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        },
        {
          title: "损益调整",
          align: "center",
          width: 120,
          tooltip: true,

          children: [
            {
              title: "以前年度损益调整",
              key: "yqndsytz",
              align: "center",
              tooltip: true,

              width: 120
            }
          ]
        },
        {
          title: "百分比",
          align: "center",
          width: 700,
          tooltip: true,

          children: [
            {
              title: "毛利率(%)",
              key: "mll",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "营业费用率(%)",
              key: "yyfyl",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "管理费用率(%)",
              key: "glfyl",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "财务费用率(%)",
              key: "cwfyl",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "其它费用率(%)",
              key: "qtfyl",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "税负率((%)",
              key: "sfl",
              align: "center",
              tooltip: true,

              width: 100
            },
            {
              title: "利润率((%)",
              key: "lrl",
              align: "center",
              tooltip: true,

              width: 100
            }
          ]
        }
      ], //主表
      profitData: [], //主表
      flag: false //快速查询标识
    };
  },
  methods: {
    //查询接口
    getList() {
      const m1 =
        this.$refs.queryCriteria.monthParticular < 10
          ? "0" + this.$refs.queryCriteria.monthParticular
          : this.$refs.queryCriteria.monthParticular;
      const m2 =
        this.$refs.queryCriteria.monthParticular1 < 10
          ? "0" + this.$refs.queryCriteria.monthParticular1
          : this.$refs.queryCriteria.monthParticular1;
      let obj = {
        startYearMonth: this.$refs.queryCriteria.yearParticular.toFixed() + m1,
        endYearMonth: this.$refs.queryCriteria.yearParticular1.toFixed() + m2
      };
      if(this.$refs.queryCriteria.shopId != "") {
        obj.shopNumber = this.$refs.queryCriteria.shopId
      }
      groupProfitSheet(obj).then(res => {
        if (res.code === 0) {
          this.profitData = res.data;
        }
      });
    },
    //查询
    query() {
      this.getList();
    },
    //导出
    exportData() {
      if (this.profitData.length !== 0) {
        this.$refs.table.exportCsv({
          filename: "集团利润表"
        });
      } else {
        this.$message.error("暂无数据");
      }
    }
  }
};
</script>

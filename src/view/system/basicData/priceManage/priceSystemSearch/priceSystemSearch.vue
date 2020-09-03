<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="partCheck-hd oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <Input class="w250 mr10" v-model="partCode" placeholder="请输入配件内码/编码/名称/OE码"></Input>
          </div>
          <div class="db mr10">
            <Select placeholder="选择品牌" filterable v-model="selectBrandId" class="w150 mr10">
              <Option
                v-for="item in partBrandData"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Button @click="search" class="mr10" type="primary">
              <Icon type="ios-search" size="14" />查询
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="topTableDate">
          <vxe-table
            border
            stripe
            resizable
            auto-resize
            :loading="loading"
            width="100"
            height="500"
            max-height="500"
            size="mini"
            show-overflow
            :data="tableData"
            align="center"
            highlight-current-row
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            <vxe-table-column type="seq" width="60" title="序号" fixed="left"></vxe-table-column>
            <vxe-table-column field="partId" title="内码" fixed="left"></vxe-table-column>
            <vxe-table-column field="partCode" title="配件编码" fixed="left"></vxe-table-column>
            <vxe-table-column field="partStandardName" title="名称" fixed="left"></vxe-table-column>
            <vxe-table-column field="partBrand" title="配件品牌" fixed="left"></vxe-table-column>
            <vxe-table-column field="adapterCarBrand" title="品牌车型" fixed="left"></vxe-table-column>
            <vxe-table-column
              :title="item2.name"
              width="120"
              v-for="(item2,index2) in level.tbdata"
              :key="index2"
              v-slot="{ row }"
            >
              <template>
                <div v-for="(item3,index3) in row.priceListRen" :key="index3">
                  <span v-if="item3.idTwo==item2.id && item3.idOne==row.id">{{item3.priceNum}}</span>
                  <span v-else></span>
                </div>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <Row class="mt10 mb10">
          <Col span="24">
            <div>
              <Page
                class-name="fr pt10 page-con"
                :current="page.num"
                :total="page.total"
                :page-size="page.size"
                @on-change="selectNum"
                @on-page-size-change="selectPage"
                show-sizer
                show-total
              ></Page>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  </div>
</template>
<script>
import * as api from "@/api/system/priceSystemSearch";
import { getAllBrand } from "@/api/system/partsExamine/partsExamineApi";
import { sellPsList } from "@/api/system/priceManage";
export default {
  name: "priceSystemSearch",
  data() {
    return {
      partCode: "", //配件名称查询名字
      selectBrandId: null, //所选配件品牌Id
      partBrandData: [
        {
          label: "全部",
          value: ""
        }
      ],
      loading: false,
      level: {
        tbdata: []
      },
      //分页
      page: {
        size: 10,
        num: 1,
        total: 0
      },
      priceSystemManage: [],
      tableData: []
    };
  },
  mounted() {
    this.getLevelList();
    this.getPartBrandAll();
    // this.getAccessories();
  },

  methods: {
    //获取配件品牌
    getPartBrandAll() {
      getAllBrand({ page: 1, pageSize: 1000 }).then(res => {
        let filterData = res.data.content.filter(
          item => item.qualityCode == "000070" || item.qualityCode == "000071"
        );
        if (filterData.length > 0) {
          if (filterData[0].children && filterData[0].children.length > 0) {
            filterData[0].children.map(item => {
              let objData = {};
              objData.label = item.name;
              objData.value = item.code;
              this.partBrandData.push(objData);
            });
          }
        }
      });
    },
    // 获取左侧整体表格数据 以及 对整体表格数据处理
    async getAccessories() {
      this.loading = true;
      let params = {};
      params.page = this.page.num - 1;
      params.size = this.page.size;
      let dataApi = {};
      dataApi.partCode = this.partCode;
      dataApi.partBrandId = this.selectBrandId;
      let res = await api.getPriceSystemSearchTable(params, dataApi);
      let arrPriceSystem = [];
      let that = this;
      if (res.code === 0) {
        this.loading = false;
        let data = {};
        this.tableData = res.data.content;
        this.tableData.map(item => {
          data = item;
          data.priceListRen = [];
          item.priceList.map(item2 => {
            this.level.tbdata.map(item3 => {
              let data2 = {};
              data2.idOne = item.id; //配件id
              data2.idTwo = item2.strategyId; //价格id
              data2.name = item3.name; //价格名称
              if (item2.strategyId == item3.id) {
                data2.priceNum = item2.sellPrice; //价格
              }
              data.priceListRen.push(data2);
            });
          });
          let priceListRen = new Set(data.priceListRen);
          item.priceListRen = priceListRen;
        });
        this.page.total = res.data.totalElements;
      }
    },
    // 获取右侧价格
    getLevelList() {
      // isDisabled:0 启用
      // isDisabled:1 禁用
      api.getPriceNotEnable().then(res => {
        if (res.code == 0) {
          this.level.tbdata = res.data;
          this.getAccessories();
        }
      });
    },
    //切换页面
    selectNum(val) {
      this.page.num = val;
      this.getAccessories();
    },
    //切换页数
    selectPage(val) {
      this.page.num = 1;
      this.page.size = val;
      this.getAccessories();
    },
    search() {
      this.page.num = 1;
      this.getAccessories();
      // this.partCode = "";
    }
  }
};
</script>
<style lang="less" scoped>
.partCheck-hd {
  //border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
* {
  font-size: 12px !important;
}
.topTableDate {
  height: 500px;
  border: 1px solid #f1f1f1;
}
.ivu-form-item {
  margin-bottom: 0px;
}

.wlf-center {
  display: flex;
  align-items: center;
}

.main .ivu-layout .page-con {
  text-align: left;
  padding-left: 10px;
}

.ivu-row {
  margin-right: 10px;
}
</style>

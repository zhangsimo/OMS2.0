<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
        <div class="db mr10">
          <span>快速查询：</span>
          <Select v-model="conditionData.character" class="w100 mr10" clearable>
            <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="db mr10">
          <span class="mr10">日期：</span>
          <Date-picker
            type="daterange"
            class="w200 mr10"
            :options="options3"

            placeholder="年/月/日-年/月/日"
          >
          </Date-picker>
        </div>
        <div class="db mr10">
          <Select v-model="conditionData.status" class="w100 mr10" clearable>
            <Option value="1" label="待受理"></Option>
            <Option value="3" label="已受理"></Option>
            <Option value="2" label="部分受理"></Option>
          </Select>
        </div>
        <div class="db mr10">
          <Select v-model="penSalesData.customer" class="w100 mr10" placeholder="选择客户" filterable clearable>
            <Option v-for="item in customerListOptions" :value="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="db mr10">
          <Select v-model="penSalesData.company" class="w200 mr10" placeholder="选择公司" filterable clearable>
            <Option v-for="item in companyListOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="db mr10">
          <Button type="warning" class="mr20">
            <Icon custom="iconfont iconchaxunicon icons"/>
            查询
          </Button>
        </div>
        </div>
      </div>
    </section>


    <section class="con-box">
      <div class="inner-box">
      <!--         上表格-->
      <div class="topTableDate">
        <vxe-table
          border
          resizable
          size="mini"
          height='400'
          :data="TopTableData"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
        >
          <vxe-table-column
            type="index"
            title="序号"
          ></vxe-table-column>
          <vxe-table-column title="操作" width="120">
            <template v-slot="{ row,rowIndex }">
              <vxe-button type="text"  @click="showNewOrder">生成采购单</vxe-button>
            </template>
          </vxe-table-column>

          <vxe-table-column
            field="name"
            title="公司"

          ></vxe-table-column>
          <vxe-table-column
            field="customer"
            title="客户"

          ></vxe-table-column>
          <vxe-table-column
            field="preId"
            title="预售单号"

          ></vxe-table-column>

          <vxe-table-column
            field="status"
            title="状态"

          ></vxe-table-column>
          <vxe-table-column field="num" title="订单数量">
            <template v-slot:edit="{ row }">
              <InputNumber
                :max="9999"
                :min="0"
                v-model="row.num"
              ></InputNumber>
            </template>
          </vxe-table-column>
          <vxe-table-column title="订单金额" filed="totalprice">
            <template v-slot="{ row }">
              {{ (row.price * row.num) | priceFilters }}
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="num6"
            title="提交日期"
          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="预计发货日期"
          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="预计到货日期"
          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="备注"

          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="采购单号"

          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="受理人"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="受理日期"
            width="100"
          ></vxe-table-column>

        </vxe-table>
      </div>

      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12">
          <div>
            <Page

              :current="pageList.page"
              :total="this.pageList.total"
              :page-size="pageList.pageSize"
              :page-size-opts="pageList.pageSizeOpts"
              show-sizer
            />
          </div>
        </Col>
        <Col span="12" class="mt10">
          <div style="text-align: right">
            每页{{this.pageList.size}}条,
            共{{this.pageList.total}}条
          </div>

        </Col>
      </Row>
      <!--        下表格-->
      <div class="bottomTableDate">

        <vxe-table
          border
          resizable
          size="mini"
          height='400'
          :data="BottomTableData"
          :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
        >
          <vxe-table-column
            type="index"

            title="序号"
          ></vxe-table-column>

          <!-- <vxe-table-column title="操作" width="80">
            <template v-slot="{ row }">
              <Button type="text">查看</Button>
            </template>
          </vxe-table-column> -->

          <vxe-table-column
            field="name"
            title="配件编码"

          ></vxe-table-column>
          <vxe-table-column
            field="role"
            title="配件名称"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            field="brand"
            title="品牌"

          ></vxe-table-column>
          <vxe-table-column field="num" title="数量">
            <template v-slot:edit="{ row }">
              <InputNumber
                :max="9999"
                :min="0"
                v-model="row.num"
              ></InputNumber>
            </template>
          </vxe-table-column>

          <vxe-table-column field="price" title="销价">
            <template v-slot:edit="{ row }">
              <InputNumber
                :max="9999"
                :min="0"
                v-model="row.price"
              ></InputNumber>
            </template>
            <template v-slot="{ row }">
              {{ row.price | priceFilters }}
            </template>
          </vxe-table-column>
          <vxe-table-column title="金额" filed="totalprice">
            <template v-slot="{ row }">
              {{ (row.price * row.num) | priceFilters }}
            </template>
          </vxe-table-column>

          <vxe-table-column
            field="date12"
            title="备注"
          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="品牌车型"

          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="品牌车型"

          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="单位"

          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="OE码"

          ></vxe-table-column>
          <vxe-table-column
            field="date12"
            title="规格"

          ></vxe-table-column>

          <vxe-table-column
            field="date12"
            title="配件内码"

          ></vxe-table-column>
        </vxe-table>
      </div>
    </div>
    </section>
<!--    新增采购订单-->
    <new-order ref="newOrder"></new-order>
  </div>
</template>

<script>
  import NewOrder from './components/NewOrder';
  export default {
    name: "acceptance",
    components:{
      NewOrder
    },
    data() {
      return {
        conditionData: {
          character: "",  // 快速查询
          status: '1',  //受理状态
        },
        // 快速查询数据1
        quickArray: [
          {
            value: "本周",
            label: "本周"
          },
          {
            value: "上周",
            label: "上周"
          },
          {
            value: "本月",
            label: "本月"
          },
          {
            value: "上月",
            label: "上月"
          },
          {
            label: "本年",
            value: "本年"
          }
        ],
        // 日期数据
        options3: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          }
        },
        // 代销售条件查询
        penSalesData: {
          character: '', // 快速查询
          company: '', //公司选择
          customer: '', //客户
        },
        customerListOptions: [],//选择客户下拉列表
        companyListOptions: [],//选择公司下拉列表
        TopTableData: [{
          index: 1, name: 123, date12: 456
        }],//上侧表格list
        BottomTableData: [],//下侧表格list
        // 分页数据
        pageList: {
          page: 1,
          total: 0,
          size: 10,
          pageSize: 10,
          pageSizeOpts: [10, 20, 30, 40, 50]
        },
        pageTotal: 10,
      }

    },
    methods:{
      showNewOrder(){
        this.$refs.newOrder.openModal()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../lease/product/lease.less");


  * {
    font-size: 12px !important;
  }

  .ivu-form-item {
    margin-bottom: 0px;
  }

  .wlf-center {
    display: flex;
    align-items: center;
  }

</style>

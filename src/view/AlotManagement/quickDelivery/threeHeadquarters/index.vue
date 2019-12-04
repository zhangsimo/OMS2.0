<template>
    <div class="content-oper content-oper-flex">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
          <div class="db mr10">
            <span class="mr10">快速查询：</span>
            <Select v-model="conditionData.character" class="w100 mr10" clearable>
              <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">出库日期：</span>
            <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
            </DatePicker>
          </div>
          <div class="db mr10">
            <Select v-model="conditionData.status" class="w100 mr10" clearable>
              <Option value="1" label="待入库"></Option>
              <Option value="3" label="已入库"></Option>
              <Option value="2" label="部分入库"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input v-model="productName" placeholder="调拨出库单号" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Input v-model="productName1" placeholder="配件编码" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Input v-model="productName2" placeholder="配件名称" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
          </div>
        </div>
        </div>
      </section>


      <section class="con-box">
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
            <vxe-table-column  title="操作" >
              <template v-slot="{ row,rowIndex }">
                <Button type="text">到货入库</Button>
              </template>
            </vxe-table-column>

            <vxe-table-column
              field="name"
              title="调出方"

            ></vxe-table-column>
            <vxe-table-column
              field="customer"
              title="调拨出库单号"

            ></vxe-table-column>
            <vxe-table-column
              field="preId"
              title="状态"

            ></vxe-table-column>

            <vxe-table-column
              field="status"
              title="出库日期"

            ></vxe-table-column>
            <vxe-table-column
              field="status1"
              title="备注"

            ></vxe-table-column>
            <vxe-table-column
              field="date12"
              title="入库日期"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="date123"
              title="操作人"
              width="100"
            ></vxe-table-column>

          </vxe-table>
        </div>

        <!--     分页-->
        <Row class="mt10 mb10">
          <Col span="12">
            <div><Page
              :current="pageList.page"
              :total="this.pageList.total"
              :page-size="pageList.pageSize"
              :page-size-opts="pageList.pageSizeOpts"
              show-sizer
            /></div>
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
              <vxe-table-column
                field="brand1"
                title="单位"

              ></vxe-table-column>
              <vxe-table-column
                field="date12"
                title="数量"

              ></vxe-table-column>

              <vxe-table-column
                field="date123"
                title="备注"
              ></vxe-table-column>
              <vxe-table-column field="num" title="入库数量" :edit-render="{name: 'input', attrs: {type: 'number'}}">
              </vxe-table-column>
              <vxe-table-column field="numName" title="入库仓库" :edit-render="{name: 'select', options: quickArray}">
            </vxe-table-column>
            <vxe-table-column
                field="date1243"
                title="OE码"
              ></vxe-table-column>
              <vxe-table-column
                field="date124"
                title="规格"
              ></vxe-table-column>
            </vxe-table>
        </div>
      </section>
  </div>
</template>

<script>
import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
    export default {
        name: "threeHeadquarters",
       data(){
        return{
          productName: '',
          productName1: '',
          productName2: '',
          conditionData: {
            character: "本周",  // 快速查询
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
            disabledDate (date) {
              return date && date.valueOf() > Date.now();
            }
          },
          // 代销售条件查询
          penSalesData: {
            character: '', // 快速查询
            company: '', //公司选择
            customer: '', //客户
          },
          customerListOptions:[],//选择客户下拉列表
          companyListOptions:[],//选择公司下拉列表
          TopTableData:[{
            name: '奥特曼',
            customer: 'mz-280dfjj',
            preId: '调出中',
            status: '2019-12-2 12:12:12',
            status1: '顺丰快递',
            date12: '2019-12-3 13:13:13',
            date123: '鲨鱼辣椒'
          }],//上侧表格list
          BottomTableData:[{
            name: 'gtxT8094',
            role: '钢铁侠-t8094',
            brand: '斯塔克',
            brand1: '件',
            date12: '1',
            date123: '全球限量版',
            num: '12',
            numName: '本周',
            date1243: 'OET93432',
            date124: 'XM'
          }],//下侧表格list
          // 分页数据
          pageList: {
            page: 1,
            total: 0,
            size: 50,
            pageSize: 50,
            pageSizeOpts: [50, 100, 150, 200]
          },
          pageTotal: 10,
          selectOne: '',
          dateTime: ''
        }

      },
       methods: {
        //  日期选择器从子组件哪来的数据
        getData(A){
          console.log(A)
          this.selectOne = A
        },
        //选中的日期
        selectDate(date){
          this.dateTime = date
          console.log(this.dateTime)
        },
        //搜索
        search(){
          // this.getList()
        }
      }
    }
</script>

<style scoped>
</style>



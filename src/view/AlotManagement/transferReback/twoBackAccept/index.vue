<template>
    <div class="acceptanceComponent">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="db mr10">
            <span class="mr10">快速查询：</span>
            <Select v-model="conditionData.character" class="w100 mr10" clearable>
              <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mt40 mrt10">
            <span class="mr10">提交日期：</span>
            <Date-picker type="date" style="width: 120px" placeholder="选择日期"></Date-picker>
            至
            <Date-picker type="date" style="width: 120px" placeholder="选择日期"></Date-picker>
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
            <Input v-model="productName" placeholder="调入退回申请单号" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
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
                <Button type="text">受理</Button>
                <Button type="text">拒绝</Button>
              </template>
            </vxe-table-column>

            <vxe-table-column
              field="name"
              title="申请方"

            ></vxe-table-column>
            <vxe-table-column
              field="customer"
              title="调入退回申请单号"

            ></vxe-table-column>
            <vxe-table-column
              field="preId"
              title="状态"

            ></vxe-table-column>

            <vxe-table-column
              field="status"
              title="提交日期"

            ></vxe-table-column>
            <vxe-table-column
              field="status1"
              title="备注"

            ></vxe-table-column>
            <vxe-table-column field="num" title="受理仓库">
              <template v-slot:edit="{ row }">
                <Select v-model="conditionData.character" class="w100 mr10" clearable>
                  <Option v-for="item in quickArray" :value="item.value" :key="item.value" placeholder="--请选择--">{{ item.label }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="date12"
              title="受理日期"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="date12"
              title="受理人"
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
                title="申请退回数量"

              ></vxe-table-column>

              <vxe-table-column
                field="date12"
                title="备注"
              ></vxe-table-column>
            </vxe-table>
        </div>
      </section>
  </div>
</template>

<script>
    export default {
        name: "twoBackAccept",
       data(){
        return{
          productName: '',
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
          TopTableData:[],//上侧表格list
          BottomTableData:[],//下侧表格list
          // 分页数据
          pageList: {
            page: 1,
            total: 0,
            size: 50,
            pageSize: 50,
            pageSizeOpts: [50, 100, 150, 200]
          },
          pageTotal: 10,
        }

      }
    }
</script>

<style scoped>
.mr10{
  margin-top: 6px;
}
.mr20{
  margin-top: 10px;
}
.mr30{
  margin-top: 28px;
}
.mt40{
  margin-top: 12px;
}
.mrt10{
  margin-right: 10px;
}
</style>



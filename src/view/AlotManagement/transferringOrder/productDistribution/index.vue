<template>
    <div class="acceptanceComponent">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="db mr10">
            <Input v-model="productName" placeholder="配件编码" style="width: 160px" class="mr10"></Input>
            <Input v-model="productName1" placeholder="配件名称/拼音" style="width: 160px" class="mr10"></Input>
            <Select v-model="conditionData.character" class="w100 mr10" clearable placeholder="--品牌--">
              <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="conditionData.status" class="w100 mr10" clearable>
              <Option value="1" label="主仓"></Option>
              <Option value="3" label="副仓"></Option>
              <Option value="2" label="待选仓"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
          </div>
          <div class="db mr10">
            <Button class="mr20" @click="modal1 = true">锁定数量调整</Button>
            <Modal v-model="modal1" title="锁定数量调整">
                <i-form :model="formItem" :label-width="80" style="padding: 0 40px">
                  <Form-item label="配件编码:">
                    <i-input :value.sync="formItem.input1" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="配件名称:">
                    <i-input :value.sync="formItem.input2" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="品牌:">
                    <i-input :value.sync="formItem.input3" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="库存数量:">
                      <i-input :value.sync="formItem.input4" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="可售数量:">
                    <i-input :value.sync="formItem.input5" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="锁定数量:">
                    <i-input :value.sync="formItem.input6" placeholder="请输入"></i-input>
                  </Form-item>
              </i-form>
              <div slot="footer">
                <Row>
                    <i-col span="12">
                      <i-button type="primary">确认</i-button>
                    </i-col>
                    <i-col span="12">
                      <i-button style="margin-left: 8px">取消</i-button>
                    </i-col>
                </Row> 
              </div>
            </Modal>
          </div>
          <div class="db mr10">
            <Button class="mr20">导出</Button>
          </div>
          <div class="db mr30">
            <Checkbox :checked.sync="single">今日到货产品</Checkbox>
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
            <!-- <vxe-table-column  title="操作" >
              <template v-slot="{ row,rowIndex }">
                <a>查看</a>
              </template>
            </vxe-table-column> -->

            <vxe-table-column
              field="name"
              title="配件编码"

            ></vxe-table-column>
            <vxe-table-column
              field="customer"
              title="配件名称"

            ></vxe-table-column>
            <vxe-table-column
              field="preId"
              title="品牌"

            ></vxe-table-column>

            <vxe-table-column
              field="status"
              title="单位"

            ></vxe-table-column>
            <vxe-table-column
              field="status1"
              title="OE码"

            ></vxe-table-column>
            <vxe-table-column
              field="status2"
              title="品牌车型"

            ></vxe-table-column>
            <vxe-table-column
              field="status3"
              title="规格"

            ></vxe-table-column>
            <vxe-table-column
              field="status4"
              title="方向"

            ></vxe-table-column>
            <vxe-table-column
              field="status5"
              title="库存数量"

            ></vxe-table-column>
            <vxe-table-column
              field="status6"
              title="可售数量"

            ></vxe-table-column>
            <vxe-table-column
              field="status7"
              title="锁定数量"

            ></vxe-table-column>
            <vxe-table-column
              field="status8"
              title="采购在途数量"

            ></vxe-table-column>
            <vxe-table-column
              field="status9"
              title="最后订货日期"

            ></vxe-table-column>
            <vxe-table-column
              field="status10"
              title="最新预计到货日期"
              width="140"

            ></vxe-table-column>
            <vxe-table-column
              field="status11"
              title="创建日期"

            ></vxe-table-column>
            <vxe-table-column
              field="status12"
              title="结束日期"

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

              <vxe-table-column title="操作" width="80">
                <template v-slot="{ row }">
                  <Button type="text">分配完成</Button>
                  <Button type="text">保存</Button>
                </template>
              </vxe-table-column>

              <vxe-table-column
                field="name"
                title="申请方"

              ></vxe-table-column>
              <vxe-table-column
                field="role"
                title="调拨申请单号"
                width="100"
              ></vxe-table-column>
              <vxe-table-column
                field="brand"
                title="配件编码"

              ></vxe-table-column>
              <vxe-table-column
                field="brand1"
                title="配件名称"

              ></vxe-table-column>
              <vxe-table-column
                field="brand2"
                title="提交日期"

              ></vxe-table-column>
              <vxe-table-column
                field="brand3"
                title="申请数量"

              ></vxe-table-column>
              <vxe-table-column field="num" title="分配数量">
                <template v-slot:edit="{ row }">
                  <InputNumber
                    :max="9999"
                    :min="0"
                    v-model="row.num"
                  ></InputNumber>
                </template>
              </vxe-table-column>

              <vxe-table-column
                field="date12"
                title="缺货数量"

              ></vxe-table-column>
            </vxe-table>
        </div>
      </section>
  </div>
</template>

<script>
    export default {
      name: "productDistribution",
      data(){
        return {
          modal1: false,
          productName: '',
          productName1: '',
          formItem: {
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            input5: '',
            input6: ''
          },
          conditionData: {
            character: "",  // 快速查询
            status: '1',  //受理状态
          },
          single: false,
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
            pageSizeOpts: [10, 20, 30, 40, 50]
          },
          pageTotal: 10
        }
      },
      methods: {
          ok () {
              this.$Message.info('点击了确定');
          },
          cancel () {
              this.$Message.info('点击了取消');
          }
      }
    }
</script>

<style scoped>
.mr10{
  margin-top: 10px;
}
.mr20{
  margin-top: 10px;
}
.mr30{
  margin-top: 28px;
}
</style>



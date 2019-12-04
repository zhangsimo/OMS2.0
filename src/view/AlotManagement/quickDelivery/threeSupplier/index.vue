<template>
    <div class="content-oper content-oper-flex">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
          <div class="db mr10">
            <span class="mr10">快速查询：</span>
            <Select v-model="form.fast" class="w100 mr10" clearable>
              <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">提交日期：</span>
            <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
            </DatePicker>
          </div>
          <div class="db mr10">
            <Select v-model="form.status" class="w100 mr10" clearable>
              <Option value="1" label="待入库"></Option>
              <Option value="3" label="已入库"></Option>
              <Option value="2" label="部分入库"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input v-model="form.No" placeholder="业务单号" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Input v-model="form.customer" placeholder="供应商" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Input v-model="form.peijianCode" placeholder="配件编码" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Input v-model="form.peijianName" placeholder="配件名称" style="width: 160px" class="mr10"></Input>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20" @click="search(form)"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
          </div>
        </div>
        </div>
      </section>


      <section class="con-box">
<!--         上表格-->
        <div class="topTableDate" style="height:45%">
          <vxe-table
            border
            resizable
            highlight-current-row
            highlight-hover-row
            @current-change="currentChangeEvent"
            size="mini"
            height='auto'
            :data="TopTableData"
            :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
          >
            <vxe-table-column
              type="index"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column  title="操作" >
              <template v-slot="{ row,rowIndex }">
                <Button type="text" @click="ruku(row)">到货入库</Button>
              </template>
            </vxe-table-column>

            <vxe-table-column
              field="name"
              title="业务单号"

            ></vxe-table-column>
            <vxe-table-column
              field="customer"
              title="供应商名称"

            ></vxe-table-column>
            <vxe-table-column
              field="preId"
              title="状态"

            ></vxe-table-column>

            <vxe-table-column
              field="status"
              title="采购员"

            ></vxe-table-column>
            <vxe-table-column
              field="status1"
              title="票据类型"

            ></vxe-table-column>
            <vxe-table-column
              field="date12"
              title="结算方式"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="date123"
              title="提交人"
              width="100"
            ></vxe-table-column>
              <vxe-table-column
              field="status9"
              title="提交日期"

            ></vxe-table-column>
            <vxe-table-column
              field="status10"
              title="备注"

            ></vxe-table-column>
            <vxe-table-column
              field="date1223"
              title="入库日期"
              width="100"
            ></vxe-table-column>
            <vxe-table-column
              field="date12123"
              title="操作人"
              width="100"
            ></vxe-table-column>

          </vxe-table>
        </div>
          <Modal
            v-model="modal2"
            title="提示"
            @on-ok="ok1"
            @on-cancel="cancel">
            <span><Icon type="information"></Icon>是否确认已到货入库!</span>
        </Modal>
        <!--     分页-->
        <Row class="mt10 mb10">
          <Col span="12" offset="12" style="text-align:right">
            <div><Page
              :current="pageList.page"
              :total="this.pageList.total"
              :page-size="pageList.pageSize"
              :page-size-opts="pageList.pageSizeOpts"
              show-sizer
            /></div>
          </Col>
        </Row>
<!--        下表格-->
        <div class="bottomTableDate" style="height:45%">

            <vxe-table
              border
              resizable
              highlight-current-row
              highlight-hover-row
              size="mini"
              height='auto'
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
                title="订单数量"

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
                field="date123"
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
  import { zongbuzhidiaoList, ListDetail, daohuoruku } from '../../../../api/threeSupplier/index'
    export default {
        name: "threeSupplier",
       data(){
        return{
          modal2: false,
         form: {
            fast: '本周',
            dataTime: [],
            status: '1',
            No: '',
            customer: '',
            peijianCode: '',
            peijianName: ''
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
            name: 'so1239923',
            customer: '天地一号',
            preId: '发货中',
            status: '叮当猫',
            status1: '电子发票',
            date12: '到付',
            date123: '小毛驴',
            status9: '2019-12-3 12:12:12',
            status10: '划水一天',
            date1223: '2019-12-3 19:12:14',
            date12123: '大野兔'
          }],//上侧表格list
          BottomTableData:[{
            name: 'lsc19238',
            role: '雷神锤',
            brand: '阿斯加德',
            brand1: '炳',
            date12: '80',
            date123: '钞能力',
            num: '1200',
            numName: '本周',
            date123: 'OE23898101',
            date124: 'XMM'
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
          dateTime: '',
          currentrow: {}
        }

      },
      methods: {
        currentChangeEvent({ row }) {
           console.log('当前行'+ row)
           this.getList(row)
        },
        //  日期选择器从子组件哪来的数据
        getData(A){
          console.log(A)
          this.selectOne = A
        },
        //选中的日期
        selectDate(date){
          this.form.dateTime = date
        },
        //搜索
        search(form){
           zongbuzhidiaoList(form).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
            }).catch(e => {
              this.$Message.info('获取直调列表失败')
            })
        },
        getList(row) {
          const params = {
            id: row.id
          }
          ListDetail(params).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
            }).catch(e => {
              this.$Message.info('请求明细失败')
            })
        },
        ok1 () {
           const params = {
            id: this.currentrow.id,
            list: this.BottomTableData
          }
          ListDetail(params).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
            }).catch(e => {
              this.$Message.info('入库失败')
            })
          },
          cancel () {
              this.$Message.info('点击了取消');
          },
        ruku(row) {
          this.modal2 = true
          this.currentrow = row
        }
      }
    }
</script>

<style scoped>
</style>



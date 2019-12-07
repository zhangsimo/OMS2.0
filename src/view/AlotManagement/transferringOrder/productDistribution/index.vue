<template>
    <div class="content-oper content-oper-flex">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
          <div class="db mr10">
            <Input v-model="form.peijianCode" placeholder="配件编码" style="width: 160px" class="mr10"></Input>
            <Input v-model="form.peijianmingcheng" placeholder="配件名称/拼音" style="width: 160px" class="mr10"></Input>
            <Select v-model="form.brand" class="w100 mr10" clearable placeholder="--品牌--">
              <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="form.warehouse" class="w100 mr10" clearable>
              <Option value="1" label="主仓"></Option>
              <Option value="3" label="副仓"></Option>
              <Option value="2" label="待选仓"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20" @click="search(form)"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
          </div>
          <div class="db mr10">
            <Button class="mr20" @click="suoding">锁定数量调整</Button>
            <Modal v-model="modal1" title="锁定数量调整">
                <i-form :model="formItem" :label-width="80" style="padding: 0 40px">
                  <Form-item label="配件编码:">
                    <i-input :value.sync="formItem.peijianCode" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="配件名称:">
                    <i-input :value.sync="formItem.name" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="品牌:">
                    <i-input :value.sync="formItem.preId" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="库存数量:">
                      <i-input :value.sync="formItem.status5" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="可售数量:">
                    <i-input :value.sync="formItem.status6" disabled placeholder="请输入"></i-input>
                  </Form-item>
                  <Form-item label="锁定数量:">
                    <i-input :value.sync="formItem.status7" placeholder="请输入"></i-input>
                  </Form-item>
              </i-form>
              <div slot="footer">
                <Row>
                    <i-col span="12">
                      <i-button type="primary" @click="update(formItem)">确认</i-button>
                    </i-col>
                    <i-col span="12">
                      <i-button style="margin-left: 8px" @click="modal1 = false">取消</i-button>
                    </i-col>
                </Row> 
              </div>
            </Modal>
          </div>
          <div class="db mr10">
            <Button class="mr20" @click="export1">导出</Button>
          </div>
          <div class="db mr10">
            <Checkbox :checked.sync="form.single">今日到货产品</Checkbox>
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
            size="mini"
            height='auto'
            highlight-current-row
            highlight-hover-row
            @current-change="currentChangeEvent"
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
              field="peijianCode"
              title="配件编码"

            ></vxe-table-column>
            <vxe-table-column
              field="name"
              title="配件名称"

            ></vxe-table-column>
            <vxe-table-column
              field="preId"
              title="品牌"

            ></vxe-table-column>

            <vxe-table-column
              field="danwei"
              title="单位"

            ></vxe-table-column>
            <vxe-table-column
              field="OECode"
              title="OE码"

            ></vxe-table-column>
            <vxe-table-column
              field="pingpaichexing"
              title="品牌车型"

            ></vxe-table-column>
            <vxe-table-column
              field="specifications"
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
        <Modal
            v-model="modal2"
            title="提示"
            @on-ok="ok1"
            @on-cancel="cancel">
            <span><Icon type="information"></Icon>是否确认分配完成!</span>
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
              size="mini"
              height='auto'
              highlight-current-row
              highlight-hover-row
              :data="BottomTableData"
              :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
            >
              <vxe-table-column
                type="index"

                title="序号"
              ></vxe-table-column>

              <vxe-table-column title="操作" width="180">
                <template v-slot="{ row }">
                  <Button type="text" @click="fenpei(row)">分配完成</Button>
                  <Button type="text" @click="baocun(row)">保存</Button>
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
              <vxe-table-column field="num" title="分配数量" :edit-render="{name: 'input', attrs: {type: 'number'}}">
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
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
  import { genxin, jinqiaopinliebiao, fenpeiwancheng, baocun, shenqingdanliebiao, daochu } from '../../../../api/productDistribution/index'
    export default {
      name: "productDistribution",
      data(){
        return {
          modal1: false,
          modal2: false,
          formItem: {
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            input5: '',
            input6: ''
          },
          form: {
            peijianCode: '',
            peijianmingcheng: '',
            brand: '',
            single: true,
            warehouse: '1'
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
            peijianCode: '1234ftt',
            name: '一号零件',
            preId: '大宗',
            danwei: '千克',
            OECode: '2859wofdk',
            pingpaichexing: '宝马',
            specifications: '大',
            status4: '南',
            status5: '30',
            status6: '20',
            status7: '50',
            status8: '80',
            status9: '2019-12-3 10:23:25',
            status10: '2019-12-13 08:23:35',
            status11: '2019-12-1 09:45:23',
            status12: '2019-12-3 10:23:25'
          }],//上侧表格list
          BottomTableData:[{
            name: '胡歌',
            role: '213777839sdfhk',
            brand: 'sie2138',
            brand1: '一号零件',
            brand2: '2019-12-2 10:34:56',
            brand3: '80',
            num: '60',
            date12: '30'
          }],//下侧表格list
          // 分页数据
          pageList: {
            page: 1,
            total: 0,
            size: 50,
            pageSize: 50,
            pageSizeOpts: [10, 20, 30, 40, 50]
          },
          pageTotal: 10,
          currentrow: {},
          fenpeiCurrent: {}
        }
      },
      methods: {
        export1() {
          daochu().then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
            }).catch(e => {
              this.$Message.info('导出失败')
            })
        },
        baocun(row) {
          if (row.num === '' || row.num === '0' ) {
              this.$Message.info('请输入分配数');
              return
          }
          baocun(row).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
              // 获取申请单列表
            }).catch(e => {
              this.$Message.info('保存失败')
            })
        },
        fenpei(row) {
          this.fenpeiCurrent = row
          if (this.fenpeiCurrent.num === '' || this.fenpeiCurrent.num === '0' ) {
              this.$Message.info('请输入分配数');
              return
          }
          this.modal2 = true
        },
        update(formItem) {
          // 更新列表信息
          genxin(formItem).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
              // 获取列表
              this.search(form)
            }).catch(e => {
              this.$Message.info('更新锁定数量失败')
            })
        },
        search(form) {
            jinqiaopinliebiao(form).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
            }).catch(e => {
              this.$Message.info('获取列表信息失败失败')
            })
        },
        suoding() {
          if (!this.currentrow.name) {
            this.$Message.info('请先点击列表选择更改项')
            return
          }
          this.formItem = this.currentrow
          this.modal1 = true
        },
        currentChangeEvent({ row }) {
           console.log('当前行'+ row)
           this.currentrow = row
            this.getList(row)
         },
          ok () {
              this.$Message.info('点击了确定');
          },
          ok1 () {
              fenpeiwancheng(this.fenpeiCurrent).then(res => {
              if (res.code == 0) {
                this.tbdata = res.data || []
                this.page.total = res.totalElements
              }
            }).catch(e => {
              this.$Message.info('分配失败')
            })

          },
          cancel () {
              this.$Message.info('点击了取消');
          },
          getList(row) {
              const params = {
                id: row.id
              }
            shenqingdanliebiao(params).then(res => {
                if (res.code == 0) {
                  this.tbdata = res.data || []
                  this.page.total = res.totalElements
                }
              }).catch(e => {
                this.$Message.info('请求申请单列表失败')
              })
        }
      }
    }
</script>

<style scoped>
</style>



<template>
  <div class="content-oper" style="background: #fff">
    <Tabs style="min-height: 500px">
      <TabPane label="采购订单明细表">
        <section class="oper-box">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db mr10">
                <quick-date></quick-date>
              </div>
              <div class="db">
                <span>提交日期：</span>
                <DatePicker @on-change="selectDate" type="date" placement="bottom-start" placeholder="选择日期"
                            class="w140 mr10">
                </DatePicker>
              </div>
              <div class="db">
                <Input v-model="searchValue" placeholder="配件编码/名称" class="w200 mr10" clearable></Input>
              </div>
              <div class="db mr10">
                <Select v-model="searchType" class="w120">
                  <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
              </div>
              <div class="db">
                <Input v-model="searchValue" placeholder="选择供应商" class="w200 mr10" clearable></Input>
              </div>
              <div class="db mr10">
                <Select v-model="searchType" class="w120">
                  <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
              </div>
              <div class="db">
                <Button type="warning" @click="search" class="mr10">查询</Button>
                <Button @click="search" class="mr10">更多查询</Button>
                <Button @click="search">导出</Button>
              </div>
            </div>
          </div>
        </section>
        <section class="con-box">
          <vxe-table
            border
            align="center"
            size="mini"
            ref="xTable"
            height="400"
            :data="tableData">
            <vxe-table-column field="group0" title="">
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group1" title="订单信息">
              <vxe-table-column field="name" title="订单单号" width="180"></vxe-table-column>
              <vxe-table-column field="age" title="供应商" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="采购员" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="票据类型" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="结算方式" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="订货日期" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="仓库" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="订单类型" width="120"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group2" title="配件信息">
              <vxe-table-column field="role" title="配件编码" width="300"></vxe-table-column>
              <vxe-table-column field="sex" title="配件名称" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="OE码" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="品牌" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="品牌车型" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="单位" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="规格" width="200"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group3" title="数量/价格">
              <vxe-table-column field="sex" title="订单数量" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="采购单价" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="调整数量" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="入库数量" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="备注" width="120"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group4" title="税率信息">
              <vxe-table-column field="date3" title="是否含税" width="140"></vxe-table-column>
              <vxe-table-column field="address" title="税率" width="200" show-overflow></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group4" title="国际采购各项费用">
              <vxe-table-column field="date3" title="币种" width="140"></vxe-table-column>
              <vxe-table-column field="address" title="汇率" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="裸价外币" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="裸价人民币" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="裸价金额" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="关税费" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="运杂费" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="增值税费" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="其他费用" width="200" show-overflow></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group4" title="其他">
              <vxe-table-column field="date3" title="提交人" width="140"></vxe-table-column>
              <vxe-table-column field="address" title="提交日期" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="订单备注" width="200" show-overflow></vxe-table-column>
            </vxe-table-column>
          </vxe-table>
          <!--<Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>-->
          <!--<Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"-->
                <!--@on-page-size-change="changeSize" show-sizer show-total></Page>-->
        </section>
      </TabPane>
      <TabPane label="采购入库明细表">
        <section class="oper-box">
          <div class="oper-top flex">
            <div class="wlf">
              <div class="db mr10">
                <quick-date></quick-date>
              </div>
              <div class="db">
                <span>提交日期：</span>
                <DatePicker @on-change="selectDate" type="date" placement="bottom-start" placeholder="选择日期"
                            class="w140 mr10">
                </DatePicker>
              </div>
              <div class="db">
                <Input v-model="searchValue" placeholder="配件编码/名称" class="w200 mr10" clearable></Input>
              </div>
              <div class="db mr10">
                <Select v-model="searchType" class="w120">
                  <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
              </div>
              <div class="db">
                <Input v-model="searchValue" placeholder="选择供应商" class="w200 mr10" clearable></Input>
              </div>
              <div class="db mr10">
                <Select v-model="searchType" class="w120">
                  <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
              </div>
              <div class="db">
                <Button type="warning" @click="search" class="mr10">查询</Button>
                <Button @click="search" class="mr10">更多查询</Button>
                <Button @click="search">导出</Button>
              </div>
            </div>
          </div>
        </section>
        <section class="con-box">
          <vxe-table
            border
            align="center"
            size="mini"
            ref="xTable"
            height="400"
            :data="tableData">
            <vxe-table-column field="group0" title="">
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group1" title="订单信息">
              <vxe-table-column field="name" title="订单单号" width="180"></vxe-table-column>
              <vxe-table-column field="age" title="供应商" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="采购员" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="票据类型" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="结算方式" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="订货日期" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="仓库" width="120"></vxe-table-column>
              <vxe-table-column field="age" title="订单类型" width="120"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group2" title="配件信息">
              <vxe-table-column field="role" title="配件编码" width="300"></vxe-table-column>
              <vxe-table-column field="sex" title="配件名称" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="OE码" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="品牌" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="品牌车型" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="单位" width="200"></vxe-table-column>
              <vxe-table-column field="sex" title="规格" width="200"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group3" title="数量/价格">
              <vxe-table-column field="sex" title="订单数量" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="采购单价" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="金额" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="调整数量" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="入库数量" width="120"></vxe-table-column>
              <vxe-table-column field="sex" title="备注" width="120"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group4" title="税率信息">
              <vxe-table-column field="date3" title="是否含税" width="140"></vxe-table-column>
              <vxe-table-column field="address" title="税率" width="200" show-overflow></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group4" title="国际采购各项费用">
              <vxe-table-column field="date3" title="币种" width="140"></vxe-table-column>
              <vxe-table-column field="address" title="汇率" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="裸价外币" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="裸价人民币" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="裸价金额" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="关税费" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="运杂费" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="增值税费" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="其他费用" width="200" show-overflow></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column field="group4" title="其他">
              <vxe-table-column field="date3" title="提交人" width="140"></vxe-table-column>
              <vxe-table-column field="address" title="提交日期" width="200" show-overflow></vxe-table-column>
              <vxe-table-column field="address" title="订单备注" width="200" show-overflow></vxe-table-column>
            </vxe-table-column>
          </vxe-table>
          <!--<Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>-->
          <!--<Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"-->
          <!--@on-page-size-change="changeSize" show-sizer show-total></Page>-->
        </section>
      </TabPane>
      <TabPane label="采购退货明细表">标签三的内容</TabPane>
      <TabPane label="采购计划明细表">采购计划明细表</TabPane>
    </Tabs>


    <Modal v-model="modal" :title="'修改最小销售规格'" width="400">
      <Form :label-width="120">
        <FormItem label="最小销售规格：" required>
          <InputNumber v-model="minSalesSpec" :min="0" :max="999999" :precision="0" :step="1" class="w200"/>
        </FormItem>
        <FormItem label="最小销售单位：">
          <Input v-model="minSalesUnit" placeholder="例如：箱" class="w200"/>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='text' @click='modal = false'>取消</Button>
        <Button type='primary' @click='submit'>确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

  import {queryAll, update} from '_api/business/goodsApi'
  import QuickDate from "../../../components/getDate/dateget";

  export default {
    name: 'reporIndex',
    components: {QuickDate},
    data() {
      return {
        modal: false,
        minSalesSpec: 0,
        minSalesUnit: '',
        skuId: '',
        fullNameState: false,
        searchValue: '',
        searchType: 'skuName',
        searchTypeArr: [
          {value: 'skuName', name:'配件名称'},
          {value: 'skuNo', name: '配件内码'},
          {value: 'venderSkuNo', name: '配件编码'}
        ],
        dateTime: '',
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '操作',
            align: 'center',
            width: 200,
            key: '',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  class: 'pointer',
                  on: {
                    click: () => {
                      this.skuId = params.row.id
                      let minSalesSpec = params.row.minSalesSpec
                      this.minSalesSpec = !minSalesSpec ? 0 : minSalesSpec
                      this.minSalesUnit = params.row.minSalesUnit || ''
                      this.modal = true
                    }
                  }
                }, '修改')
              ])
            }
          },
          {
            title: '配件内码',
            align:'center',
            minWidth: 120,
            key:'skuNo'
          },
          {
            title: '配件编码',
            align:'center',
            key: 'venderSkuNo',
            minWidth: 120
          },
          {
            title: '配件全称',
            align:'center',
            key: 'fullName',
            minWidth: 170
          },
          {
            title: '品牌名称',
            align:'center',
            key: 'brandName',
            minWidth: 120
          },
          {
            title: '厂牌名称',
            align:'center',
            key: 'applyBrandName',
            minWidth: 120
          },
          {
            title: '单位描述',
            align:'center',
            key: 'skuUnitDesc',
            minWidth: 120
          },
          {
            title: '规格',
            align:'center',
            key: 'specification',
            minWidth: 200
          },
          {
            title: '颜色',
            align:'center',
            key: 'colour',
            minWidth: 100
          },
          // {
          //   title: '品质',
          //   align:'center',
          //   key: 'qualitySourceName',
          //   minWidth: 170,
          //   render:(h,params) => {
          //     return h('span',params.row.qualitySourceName)
          //   }
          // },
          {
            title: '配件类型',
            align:'center',
            key: 'categoryName',
            minWidth: 170
          },
          // {
          //   title: '旧件名称',
          //   align:'center',
          //   key: 'former',
          //   minWidth: 170
          // },
          // {
          //   title: '创建时间',
          //   align:'center',
          //   key: 'createTime',
          //   minWidth: 170
          // },
          // {
          //   title: '最后修改时间',
          //   align:'center',
          //   key: 'updateTime',
          //   minWidth: 170
          // },
          {
            title: '最小销售规格',
            align: 'center',
            key: 'minSalesSpec',
            minWidth: 120
          },
          {
            title: '最小销售单位',
            align: 'center',
            key: 'minSalesUnit',
            minWidth: 120
          }
        ],
        tbdata: []
      }
    },
    mounted() {
      this.initStart()
    },
    methods: {
      initStart() {
        this.getList()
      },
      submit () {
        if (this.minSalesSpec === null) {
          this.$Message.warning('最小销售规格不能为空')
          return
        }
        this.minSalesUnit = this.minSalesUnit.trim()
        // if (!this.minSalesUnit) {
        //   this.$Message.warning('最小销售单位不能为空')
        //   return
        // }
        let data = {
          id: this.skuId,
          minSalesSpec: this.minSalesSpec,
          minSalesUnit: this.minSalesUnit
        }
        let stop = this.$loading()
        update(data).then(res => {
          stop()
          this.modal = false
          if (res.code === 0) {
            this.$Message.success('修改成功')
            this.getList()
          }
        }).catch(() => {
          stop()
          this.modal = false
        })
      },
      //初始化
      getList() {
        const params = {}
        if (this.dateTime[0]) {
          params.startTime = this.dateTime[0] + " 00:00:00"
          params.endTime = this.dateTime[1] + " 23:59:59"
        }
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          if (this.searchType == 'fullName' && !this.fullNameState) {
            searchValue = `###${searchValue}###`
          }
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAll({params}).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data || []
            this.page.total = res.totalElements
          }
        })
      },
      //分页
      changePage(p) {
        this.page.num = p
        this.getList()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
      //搜索
      selectDate(date) {
        this.dateTime = date
        this.search()
      },
      search() {
        this.page.num = 1
        this.getList()
      }
    },
    computed: {
      placeh() {
        let returnText = ""
        this.searchTypeArr.filter((item) => {
          if (item.value == this.searchType) {
            returnText = "请填写" + item.name
          }
        })
        return returnText
      }
    },
  }
</script>

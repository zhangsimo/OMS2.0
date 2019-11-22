<template>
  <div class="brandComponent">
    <!-- 预订单列表头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name1'">
        <div class="wlf">
          <div class="db mr10">
            <span>快速查询：</span>
            <Select v-model="conditionData.quickSelect" class="w100 mr10" clearable>
              <Option v-for="item in quickArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">日期从：</span>
            <Date-picker
              type="daterange" 
              class="w200 mr10" 
              :options="options3"
              @on-change="dateChange" 
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <Select v-model="conditionData.status" class="w100 mr10">
              <Option value="1" label="待受理"></Option>
              <Option value="3" label="已受理"></Option>
              <Option value="2" label="部分受理"></Option>
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="conditionData.company" filterable class="w200 mr10" clearable placeholder="选择公司">
              <Option v-for="item in companyListOptions" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>品牌：</span>
              <Select v-model="conditionData.brand" filterable clearable class="w100 mr10" placeholder="选择品牌">
                <Option v-for="item in brandList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </div>
          <div class="db">
            <Button type="warning" class="mr20" @click="searchData"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
          </div>
        </div>
      </div>
    </section>

    <!-- 代采购配件头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name2'">
        <div class="wlf">
          <div class="db mr10">
            <span>快速查询：</span>
            <Select v-model="quickSelect2" class="w100 mr10" clearable>
              <Option v-for="item in quickArray2" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span class="mr10">日期从：</span>
            <Date-picker
              type="daterange" 
              class="w200 mr10" 
              :options="options3"
              @on-change="dateChange" 
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <Select v-model="company" class="w200 mr10" placeholder="选择公司">
              <Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>品牌：</span>
              <Select v-model="brand" class="w100 mr10" placeholder="选择品牌">
                <Option v-for="item in brandList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </div>
          <div class="db">
            <Button type="warning" class="mr20"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
            <Button class=" mr10" style="border: none" @click="addPurchaseOrderDialog = true">
              <span class="center" style="color: #27A2D2">
                <i class="iconfont iconxuanzetichengchengyuanicon"></i>生成采购订单
              </span>
            </Button>
            <Button class=" mr10" style="border: none" @click="directPurchaseOrderDialog = true">
              <span class="center" style="color: #27A2D2" >
                <i class="iconfont iconxuanzetichengchengyuanicon"></i>生成直发采购订单
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- tabs内容 -->
    <section class="con-box">
      <Tabs value="name1" type="card" @on-click="handleClickTab">
        <TabPane label="预订单列表" name="name1">
          <div>
            <Table
            @on-row-click="onRowClick"
              highlight-row
              :columns="columns"
              border
              :data="data"
              height="330"
            ></Table>
          </div>
          <div class="mt10 mb10"> 
            <Page
              @on-page-size-change="onPageSizeChange"
              @on-change="onChange"
              :current="pageList.page"
              :total="pageList.total" 
              :page-size="pageList.pageSize" 
              :page-size-opts="pageList.pageSizeOpts"
              show-total
              show-sizer
              />
          </div>
          <Table
              show-summary
              :summary-method="handleSummary"
              highlight-row
              :columns="columns2"
              border
              :data="data2"
              height="260"
            ></Table>
        </TabPane>
        <TabPane label="待采购配件" name="name2">
          <Table
            show-summary
            :summary-method="handleSummary"
            highlight-row
            :columns="columns3"
            border
            :data="data3"
            ></Table>
          <div class="mt10 mb10"> 
            <Page
              :current="pageList.page"
              :total="pageList.total" 
              :page-size="pageList.pageSize" 
              :page-size-opts="pageList.pageSizeOpts"
              show-total
              show-sizer
              />
          </div>
        </TabPane>
      </Tabs>
    </section>

    <!-- 新增采购订单窗口 -->
    <Modal
      width="700px"
      v-model="addPurchaseOrderDialog"
      title="新增采购订单">
      <section>
        <div>
          <Button class=" mr10" style="border: none" @click="addPurchaseOrderDialog = true">
            <span class="center" style="color: #27A2D2">
              <i class="iconfont iconbaocunicon"></i>保存
            </span>
          </Button>
          <Button class=" mr10" style="border: none">
            <span class="center" style="color: #27A2D2" >
              <i class="iconfont iconlajitongicon"></i>删除
            </span>
          </Button>
        </div>
        <Form :label-width="80">
          <Row>
            <Col span="24">
              <FormItem label="往来单位：">
                <Select v-model="transitUnit">
                  <Option v-for="item in transitUnitList" :key="item.id">{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="票据类型：">
                <Select v-model="ticketType">
                  <Option v-for="item in ticketTypeList" :key="item.id">{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式：">
                <Select v-model="settlementMethod">
                  <Option v-for="item in settlementMethodList" :key="item.id">{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="备注：">
                <Input type="textarea"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </section>
      <section>
        <Table
          highlight-row
          :columns="columns4"
          border
          :data="data4"
        ></Table>
      </section>
      <div slot="footer">
        <Button type="primary">确定</Button>
        <Button type="default">取消</Button>
      </div>
    </Modal>

    <!-- 生成直发采购订单 -->
    <Modal
      width="700px"
      v-model="directPurchaseOrderDialog"
      title="新增采购订单"
      >
      <section>
        <div>
          <Button class=" mr10" style="border: none">
            <span class="center" style="color: #27A2D2">
              <i class="iconfont iconbaocunicon"></i>保存
            </span>
          </Button>
          <Button class=" mr10" style="border: none">
            <span class="center" style="color: #27A2D2" >
              <i class="iconfont iconlajitongicon"></i>删除
            </span>
          </Button>
        </div>
        <Form :label-width="80">
          <Row>
            <Col span="24">
              <FormItem label="往来单位：">
                <Select v-model="transitUnit">
                  <Option v-for="item in transitUnitList" :key="item.id">{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="票据类型：">
                <Select v-model="ticketType">
                  <Option v-for="item in ticketTypeList" :key="item.id">{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结算方式：">
                <Select v-model="settlementMethod">
                  <Option v-for="item in settlementMethodList" :key="item.id">{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="直发门店：">
                <Input v-model="straightHairStore"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="备注：">
                <Input type="textarea"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </section>
      <section>
        <Table
          highlight-row
          :columns="columns4"
          border
          :data="data4"
        ></Table>
      </section>
      <div slot="footer">
        <Button type="primary">确定</Button>
        <Button type="default">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getBrandList,
  getPageList,
  selectCompany,
  searchBrandList
} from "../../../api/business/brandListApi"
  export default {
    name: 'brandList',
    data() {
      return {
        // 根据条件查询数据集合处
        conditionData: {
          quickSelect: "",
          status: "1",
          company: '',
          brand: '',

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
        quickSelect: "",
        // 快速查询数据2
        quickArray2: [
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
          ,
          {
            label: "上年",
            value: "上年"
          }
        ],
        quickSelect2: "",
        // 日期数据
        options3: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now();
          }
        },
        dateList: {},
        dateArray: [],
        // 受理状态
        acceptStatus: "",
        // 选择公司数据
        companyListOptions: [],
        company: '',
        // 品牌选择数据
        brandList: [
          {
            value: '马勒',
            label: '马勒'
          },
          {
            value: '博士',
            label: '博士'
          },
          {
            value: '马牌',
            label: '马牌'
          }
        ],
        brand: '',
        // 分页数据
        pageList: {
          page: 1,
          total: 0,
          size: 10,
          pageSize: 10,
          pageSizeOpts: [10, 20, 30, 40, 50]
        },
        pageTotal: 10,
        // tabs切换栏数据
        tabValue: "name1",
        // 预订单列表表格数据
        columns: [
          {
            type: "index",
            width: 60,
            align: "center",
            title: "序号"
          },
          {
            title: "操作",
            key: "caozuo",
            align: "center",
            render (h, params) {
              let JsonString = params.row.status
              let status = JSON.parse(JsonString)
              // console.log(auditsign)
              if (status.name === "待受理"){
                return h('span', {}, "受理")
              }
              
            }
          },
          {
            title: "公司",
            key: "company",
            align: "center"
          },
          {
            title: "预订单单号",
            key: "orderNo",
            align: "center"
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render (h, params) {
              let JsonString = params.row.status
              let status = JSON.parse(JsonString)
              // console.log(auditsign)
              return h('span', {}, status.name)
            }
          },
          {
            title: "期望到货日期",
            key: "expectedArrivalDate",
            align: "center"
          },
          {
            title: "提交日期",
            key: "commitTime",
            align: "center"
          },
          {
            title: "提交人",
            key: "commitUname",
            align: "center"
          },
          {
            title: "备注",
            key: "remark",
            align: "center"
          }
        ],
        data: [],
        // 预订单列表子表格数据
        columns2: [
          {
            type: "index",
            width: 60,
            align: "center",
            title: "序号"
          },
          {
            title: "配件编码",
            key: "partCode",
            align: "center"
          },
          {
            title: "配件名称",
            key: "partName",
            align: "center"
          },
          {
            title: "品牌",
            key: "brand",
            align: "center"
          },
          {
            title: "配件内码",
            key: "partId",
            align: "center"
          },
          {
            title: "单位",
            key: "unit",
            align: "center"
          },
          {
            title: "预定数量",
            key: "preQty",
            align: "center"
          },
          {
            title: "受理数量",
            key: "acceptQty",
            align: "center"
          },
          {
            title: "备注",
            key: "remark",
            align: "center"
          }
        ],
        data2: [],
        // 代采购表格数据
        columns3: [
          {
            type: "index",
            width: 60,
            align: "center",
            title: "序号"
          },
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: "配件编码",
            key: "partCode",
            align: "center"
          },
          {
            title: "配件名称",
            key: "partName",
            align: "center"
          },
          {
            title: "品牌",
            key: "partBrandName",
            align: "center"
          },
          {
            title: "配件内码",
            key: "partId",
            align: "center"
          },
          {
            title: "单位",
            key: "caozuo",
            align: "center"
          },
          {
            title: "预定数量",
            key: "applyDate",
            align: "center"
          },
          {
            title: "受理数量",
            key: "applyMan",
            align: "center"
          },
          {
            title: "公司",
            key: "company",
            align: "center"
          },
          {
            title: "预定单号",
            key: "company",
            align: "center"
          },
          {
            title: "备注",
            key: "remark",
            align: "center"
          },
          {
            title: "期望到货日期",
            key: "remark",
            align: "center"
          }
        ],
        data3: [],
        // 新增采购订单表格数据
        columns4: [
          {
            type: "index",
            width: 60,
            align: "center",
            title: "序号"
          },
          {
            title: "操作",
            width: 60,
            align: 'center',
            render (h, params) {
              return h('a', {}, "删除")
            }
          },
          {
            title: "配件编码",
            key: "partCode",
            align: "center"
          },
          {
            title: "配件名称",
            key: "partName",
            align: "center"
          },
          {
            title: "品牌",
            key: "partBrandName",
            align: "center"
          },
          {
            title: "单位",
            key: "caozuo",
            align: "center"
          },
          {
            title: "采购数量",
            key: "applyDate",
            align: "center",
            render (h, params) {
              return h('Input', {
                props: {
                  purchaseQuantity: ""
                }
              },)
            }
          },
          {
            title: "采购单价",
            key: "applyMan",
            align: "center",
            render (h, params) {
              return h('Input', {
                props: {
                  purchasePrices: ""
                }
              },)
            }
          }
        ],
        data4: [],
        // 新增采购订单窗口数据
        addPurchaseOrderDialog: false,
        // 往来公司数据
        transitUnit: "",
        transitUnitList: {},
        // 票据类型数据
        ticketType: "",
        ticketTypeList: {},
        // 结算方式
        settlementMethod: "",
        settlementMethodList: {},
        // 生成直发采购订单
        directPurchaseOrderDialog: false,
        // 直发门店
        straightHairStore: ""
      }
    },
    mounted() {
      this.getBrand()
      this.companyIfo()
    },
    methods: {
      // 获取页面数据
      getBrand () {
        getBrandList().then(res => {
          // console.log(res)
          if(res.code === 0) {
            this.data = res.data.content
            this.pageList.total = res.data.totalElements
          }
        })
      },
      // 快速查询数据
      quickDate (item) {
        // console.log(item)
        this.quickArray = item
        this.quickList.startTime = item[0]
        this.quickList.endTime = item[1]
      },
      // 获取日期
      dateChange (value) {
        // console.log(value)
        this.dateArray = [value]
        if(value[0] === ""){
          this.dateList = {}
        }else {
          this.dateList.commitTimeStart = value[0] + " " + "00:00:00"
          this.dateList.commitTimeEnd = value[1] + " " + "23:59:59"
        }
      },
      newArr (arr) {
      // console.log(arr)
      return arr.reduce((pre,cur) => {
        // console.log(pre, cur)
        let flag = Array.isArray(cur.childs) && Array.isArray(cur.childs)
        return pre.concat( flag? this.newArr(cur.childs): cur)
      },[])
    },
    toList (arr) {
      // console.log(arr)v
      return arr.reduce((ret, v) => {
          // console.log(ret, v)
          let item = this.deepClone(v)
          delete item.childs
          this.companyListOptions.push(item)
          let flag = Array.isArray(v.childs) && v.childs.length > 0
          return ret.concat(flag ? this.toList(v.childs) : v)
      }, [])
    },
    deepClone (obj) {
      let ret
      ret = JSON.stringify(obj)
      ret = JSON.parse(ret)
      return ret
    },
      // 公司信息获取
      companyIfo () {
        let user = this.$store.state.user.userData
        // console.log(user.tenantId)
        selectCompany({pId: user.tenantId}).then(res=> {
        // console.log(res)
        if (res.code === 0) {
          let data = res.data
          let item = this.deepClone(data)
          delete item.childs
          // console.log(item)
          this.companyListOptions.push(item)
          this.toList(data.childs)
          // console.log(this.companyListOptions)
        }
      })
    },
    // 查询
    searchData () {
      if (this.dateList){
        searchBrandList(this.dateList).then(res => {
        if(res.code === 0){
          this.data = res.data.content
        } 
      })
      }else {
        searchBrandList(this.conditionData).then(res => {
          if(res.code === 0){
            this.data = res.data.content
          } 
        })
      }
    },
      // 点击tabs切换头部
      handleClickTab(item) {
        this.tabValue = item
      },
      // 预订单受理表格单击
      onRowClick(value) {
        // console.log(value)
        this.data2 = value.detailVOList
      },
      // 页码切换
      onChange (value) {
        // console.log(`当前页码${value}`)
        this.pageList.page = value
        getPageList(this.pageList).then(res => {
          if (res.code === 0) {
            this.data = res.data.content
          }
        })
        this.data2 = []
      },
      // 每页条数切换
      onPageSizeChange (value) {
        // console.log(`每页条数${value}`)
        this.pageList.size = value
        getPageList(this.pageList).then(res => {
          if (res.code === 0) {
            this.data = res.data.content
          }
        })
        this.data2 = []
      },
      // 表格底部合计
      handleSummary({ columns, data }) {
        // console.log(columns, data);
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (key === "partCode") {
            sums[key] = {
              key,
              value: data.length
            };
            return;
          }
          if (key === "serviceId") {
            sums[key] = {
              key,
              value: data.length
            };
            return;
          }
          if (key === "serviceId") {
            sums[key] = {
              key,
              value: data.length
            };
            return;
          }
          sums[key] = {
            key,
            value: ""
          };
        });
        return sums;
      },
      // 弹出新增采购订单窗口
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
              this.$Message.success('Success!');
          } else {
              this.$Message.error('Fail!');
          }
        })
      }
      // showPurchaseOrder() {
      //   this.addPurchaseOrderDialog = true
      // }
    },
  }
</script>

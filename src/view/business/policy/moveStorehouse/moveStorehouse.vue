<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <!--      主菜单导航-->
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>
            <Select v-model="purchaseType" class="w90 mr10">
              <Option
                v-for="item in purchaseTypeArr"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="db">
            <Button type="default" @click="More" class="mr10">
              <i class="iconfont mr5 iconchaxunicon"></i>更多
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addProoo">
              <Icon type="md-add" />新增
            </Button>
          </div>
          <div class="db">
            <Button type="default" class="mr10">
              <i class="iconfont mr5 iconbaocunicon"></i>保存
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="audit">
              <Icon type="md-checkmark" size="14" />审核
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="cancellation">
              <Icon type="md-close" size="14" />作废
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="printTable">
              <i class="iconfont mr5 icondayinicon"></i> 打印
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500" @on-moving="getDomHeight">
            <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">配件组装列表</div>
              <Table
                :height="leftTableHeight"
                @on-current-change="selectTabelData"
                size="small"
                highlight-row
                border
                :stripe="true"
                :columns="Left.columns"
                :data="Left.tbdata"
              ></Table>
              <Page size="small" :total="Left.page.total" :page-size="Left.page.size" :current="Left.page.num" show-sizer show-total class-name="page-con"
                    @on-change="changePage" @on-page-size-change="changeSize" class="mr10"></Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5 goods-list-form">
              <div class="pane-made-hd">配件组装信息</div>
              <div class="clearfix purchase" ref="planForm">
                <Form inline :show-message="false" ref="formPlan" :label-width="100">
                  <FormItem label="移出仓库" >
                      <Select v-model="formPlan.storeId" style="width:100px" >
                        <Option v-for="item in warehouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                  <FormItem label="移入仓库" >
                      <Select v-model="formPlan.storeId" style="width:100px" >
                        <Option v-for="item in warehouseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                  <FormItem label="业务员：" prop="planDate">
                    <Input class="w160" value="吴力"></Input>
                  </FormItem>
                  <FormItem label="移仓日期" prop="remark">
                    <DatePicker type="date" class="w160" value="2019-09-25 20:00"></DatePicker>
                  </FormItem>
                  <FormItem label="移仓单号" prop="planOrderNum">
                    <Input class="w160" value="YCSDFD839239320"></Input>
                  </FormItem>
                </Form>
              </div>
              <div class="flex plan-cz-btn" ref="planBtn">
                <div class="clearfix">
                  <div class="fl mb5">
                    <Button size="small" class="mr10" @click="addPro">
                      <Icon type="md-add" />添加配件
                    </Button>
                  </div>
                  <div class="fl mb5">
                    <Button size="small" class="mr10">
                      <i class="iconfont mr5 iconlajitongicon"></i> 删除
                    </Button>
                  </div>
                </div>
              </div>
              <vxe-table
                border
                resizable
                @edit-closed="editClosedEvent"
                size="mini"
                :height="rightTableHeight"
                :data="tableData"
                :footer-method="addFooter"
                :edit-config="{trigger: 'click', mode: 'cell'}"
              >
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
                <vxe-table-column field="partName" title="配件名称" width="100"></vxe-table-column>
                <vxe-table-column field="partBrand" title="品牌" width="100"></vxe-table-column>
                <vxe-table-column field="orderQty" title="数量" width="100" :edit-render="{name: 'input'}"></vxe-table-column>
                <vxe-table-column field="stockOutQty" title="缺货数量" width="100"></vxe-table-column>
                <vxe-table-column field="carModelName" title="品牌车型" width="100"></vxe-table-column>
                <vxe-table-column field="systemUnitId" title="单位" width="100"></vxe-table-column>
                <vxe-table-column field="oemCode" title="OE码" width="100"></vxe-table-column>
                <vxe-table-column field="spec" title="规格" width="100"></vxe-table-column>
                <vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>
              </vxe-table>
            </div>
          </Split>
        </div>
      </div>
    </section>
    <!--添加配件-->
    <Select-part-com ref="SelectPartRef" @selectPartName="getPartNameList"></Select-part-com>
    <!--更多弹框-->
    <More :getShowMore="showMore" @getMoreStatus="getMoreStatus" @getMoreData="getMoreData"></More>
    <!-- 作废提示 -->
    <Modal v-model="showRemove" title="提示" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>是否确定作废</p>
    </Modal>
    <!-- 审核提示 -->
    <Modal v-model="showAudit" title="提示" @on-ok="auditOK" @on-cancel="auditCancel">
      <p>是否确定审核</p>
    </Modal>
    <!-- 打印 -->
    <Print-show ref="printBox"></Print-show>
  </div>
</template>

<script>
import {
  getLeftList,
  getstate,//仓库数据
  // getSubmitList,//提交
  // getCancellation,//作废
  // getDataQuickList,
  // getDataTypeList,
  // saveDataList,
  // submitDataList,
  // outDataList,
  // removeDataList,
  // stampDataList,
  // stampApplyDataList
} from '../../../../api/business/moveStorehouse.js'
import '../../../lease/product/lease.less'
import QuickDate from '../../../../components/getDate/dateget'
import SelectPartCom from '../../../salesManagement/salesOrder/components/selectPartCom'
import PrintShow from "./components/PrintShow"
import More from './components/More'
export default {
  name: 'moveStorehouse',
  components: {
    QuickDate,
    PrintShow,
    More,
    SelectPartCom
  },
  data() {
    return {
      split1: 0.2,
      tabIndex: 0,
      queryTime:"",//快速查询时间
      curronly: false,
      purchaseType: 999, //查询选项
      purchaseTypeArr: [
        {
          label: '所有',
          value: 999
        },
        {
          label: '草稿',
          value: 0
        },

        {
          label: '已提交',
          value: 1
        },
        {
          label: '已作废',
          value: 3
        }
      ],
      showMore: false, //更多模块的弹框
      //左侧表格高度
      leftTableHeight: 0,
      Left: {
        loading: false,
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        columns: [
          //key要修改
          {
            title: '序号',
            type: "index",
            minWidth: 50
          },
          {
            title: '状态',
            key: 'status',
            minWidth: 70
          },
          {
            title: '移仓日期',
            key: 'commitDate',
            minWidth: 170
          },
          {
            title: '业务员',
            key: 'createUname',
            minWidth: 120
          },
          {
            title: '移仓单号',
            key: 'serviceId',
            minWidth: 140
          },
          {
            title: '打印次数',
            key: 'printing',
            minWidth: 200
          },
          {
            title: '创建人',
            key: 'createUname',
            minWidth: 100
          },
          {
            title: '创建日期',
            align: 'createTime',
            key: 'left8',
            minWidth: 170
          },
          {
            title: '提交人',
            key: 'commitUname',
            minWidth: 170
          },
          {
            title: '提交日期',
            key: 'commitDate',
            minWidth: 170
          },
          // {
          //   title: '审核人',
          //   key: 'left9',
          //   minWidth: 170
          // },
          // {
          //   title: '审核日期',
          //   key: 'left9',
          //   minWidth: 170
          // }
        ],
        tbdata: [
          {
            left1: 1,
            left2: '草稿',
            left3: '公司名称',
            left4: '2019-10-01',
            left5: '李四',
            left6: 'GT11121223',
            left7: '张三',
            left8: '2019-10-21',
            left9: '10'
          }
        ]
      },
      tableData: [
        {
          name: 'a',
          role: 'a',
          sex: 'a',
          num6: '',
          date12: ''
        },
        {
          name: 'b',
          role: 'b',
          sex: 'b',
          num6: '',
          date12: ''
        },
        {
          name: 'c',
          role: 'c',
          sex: 'c',
          num6: '',
          date12: ''
        },
        {
          name: 'd',
          role: 'd',
          sex: 'd',
          num6: '',
          date12: ''
        }
      ],
       Right: {
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '序号',
            minWidth: 50,
            key: 'id'
          },
          {
            title: '状态',
            key: 'venderSkuNo',
            minWidth: 70
          },
          {
            title: '调出方',
            key: 'name',
            minWidth: 170
          },
          {
            title: '创建日期',
            key: 'address',
            minWidth: 120
          },
          {
            title: '申请人',
            key: 'isCycle',
            minWidth: 140
          },
          {
            title: '申请单号',
            key: 'disable',
            minWidth: 200
          },
          {
            title: '提交人',
            key: 'remark',
            minWidth: 100
          },
          {
            title: '提交日期',
            align: 'center',
            key: 'qualitySourceName',
            minWidth: 170
          },
          {
            title: '打印次数',
            key: 'categoryName',
            minWidth: 170
          }
        ],
        tbdata: []
      },
      // 所需零件数据
      components: [],
      //右侧表格高度
      rightTableHeight: 0,
      //配件组装信息 表单model
      formModel:[

      ],
      formPlan:{},//右边所有数据（含提交）
      showAudit: false, //审核提示
      showRemove: false, //作废提示
      isAddRight: true, //判断右侧是有数据
      showBayer: false, //出库方弹窗
      rightTableStatus: '' //右侧表格状态
    }
  },
  created(){
    this.getList()
  },
  methods: {
    //获取左侧列表
    getList() {
      debugger
      //获取右边仓库数据
      getstate()
        .then(res=> {
          if(res.code === 0){
            this.warehouseList = res.data
          }
        })
        .catch(err => {
            this.$Message.info('获取仓库信息失败') //获取仓库数据
        })
      //获取左边数据
      
      let data = {}
        if(this.purchaseType == "-1"){
            this.purchaseType = null
        }
        data.startTime = this.queryTime[0] || ''
        data.endTime = this.queryTime[1] || ''
        data.billStatusId = this.purchaseType
            // data = this.query
        let page = this.Left.page.num -1
        let size = this.Left.page.size
        debugger
        getLeftList(data,page,size)
          .then(res => {
            debugger
            console.log(res)
            if (res.code === 0) {
              this.Left.tbdata = res.data.content || []
              this.Left.page.total = res.data.totalElements
            }
          })
          .catch(err => {
            this.$Message.info('获取盘点列表失败')
        })
        console.log(this.$store.state.user.userData)
    },
    //获取表格高度
    getDomHeight() {
      this.$nextTick(() => {
        let wrapH = this.$refs.paneLeft.offsetHeight
        let planFormH = this.$refs.planForm.offsetHeight
        let planBtnH = this.$refs.planBtn.offsetHeight
        // let planPageH = this.$refs.planPage.offsetHeight;
        //获取左侧侧表格高度
        this.leftTableHeight = wrapH - 104
        //获取右侧表格高度
        this.rightTableHeight = wrapH - planFormH - planBtnH - 38
      })
    },
    //切换tab
    setTab(index) {
      this.tabIndex = index
      if (this.tabIndex == 1) {
        console.log('配件拆分')
      }
    },
    //快速查询日期
    getDataQuick(v) {
      this.queryTime = v;
      this.Left.page.num = 1;
      this.Left.page.size = 10;
      this.getList()
    },
     //改变盘点时间
    auditDate(data){
      this.formPlan.auditDate = data + ' '+ "00:00:00"
    },
    //更多按钮
    More() {
      this.showMore = true
    },
     //更多弹窗恢复false
    getMoreStatus(val) {
      this.showMore = val
    },
    //更多搜索接收调拨申请列表
    getMoreData(val) {
      this.Left.tbdata = val.data || []
      this.Left.page.total = bal.totalElements
    },
    //新增
    addProoo() {
      if (!this.isAddRight) {
        return this.$Message.error('请先保存数据')
      }

      let TrowLeft = {} //新增左侧
      let TrowRight = {} //新增右侧
      this.isAddRight = false
      this.Left.tbdata.push(TrowLeft)
      this.tableData.push(TrowRight)
    },
    // 提交
    editPro() {
      //判断是否为草稿状态
      if(this.Right.tbdata.length < 1){
        this.$Message.error('请选择数据')
        return
      }
      if(this.formPlan.billStatusId !== 0){
        this.$Message.error('只有草稿状态才能保存')
        return
      }
      if(!this.formPlan.auditDate || !this.formPlan.storeId ||!this.formPlan.orderMan ||!this.formPlan.serviceId){
        this.$Message.error('请填写盘点信息')
        return
      }
      this.formPlan.billStatusId = 1;
      getSubmitList(this.formPlan)
      .then(res => {
        console.log(res)
        if(res.code == 0){
          his.$Message.error('提交成功')
        }
      })
    },
    //作废
    //作废提示
    cancellation() {
      this.showRemove = true
    },
    //确认作废
    removeOk() {
      removeDataList()
        .then(res => {
          if (res.code === 0) {
            this.showRemove = false
          }
        })
        .catch(err => {
          this.showRemove = false
          this.$Message.info('作废草稿失败')
        })
    },
    removeCancel() {
      this.showRemove = false
    },
    //审核
    audit(){
      this.showAudit = true
    },
    //确认审核
    auditOK() {
      removeDataList()
        .then(res => {
          if (res.code === 0) {
            this.showAudit = false
          }
        })
        .catch(err => {
          this.showAudit = false
          this.$Message.info('确认审核失败')
        })
    },
    auditCancel() {
      this.showRemove = false
    },
    // 打印
    printTable() {
       this.$refs.printBox.openModal()
    },
    //添加配件
    addPro() {
      this.$refs.SelectPartRef.init()
    },
    //左边列表选中当前行
    selectTabelData() {},
    //分页
    changePage(p) {
      // this.page.num = p
      // this.getList()
    },
    changeSize(size) {
      // this.page.num = 1
      // this.page.size = size
      // this.getList()
    },
    //表格编辑状态下被关闭的事件
    editClosedEvent() {},
    //footer计算
    addFooter() {},
    // 确定
    Determined() {}
  },
  mounted() {
    setTimeout(() => {
      this.getDomHeight()
    }, 0)

    window.onresize = () => {
      this.getDomHeight()
    }
  }
}
</script>

<style lang="less" scoped>
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}
.tabs {
  list-style: none;
  display: flex;

  li {
    margin: 0;
    margin-right: 4px;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 32px;
    padding-bottom: 5px;
    background: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    border-color: #ddd;
    color: #fd5c5c;
  }
}
.page-warp {
  padding-right: 20px;
}
.look-nav {
  text-align: center;
  height: 40px;
  margin-top: 20px;
}
.con-box {
  height: 600px;
}
.w550 {
  width: 580px;
}
.mt20 {
  margin-top: 20px;
}
.look {
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}

.goods-list-form {
  * {
    font-size: 12px !important;
  }
  .ivu-form-item {
    margin-bottom: 0px;
  }
  .plan-cz-btn {
    border-top: 1px solid #ddd;
    margin-top: 6px;
    justify-content: space-between;
    padding: 8px 10px 4px;
    align-items: center;
  }
  .t-price {
    white-space: nowrap;
  }
}
</style>

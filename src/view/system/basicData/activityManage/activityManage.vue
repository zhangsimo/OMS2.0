<template>
  <div>
    <!-- 活动申请信息头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name1'">
        <div class="wlf">
          <div class="db mr10">
            <span>申请状态：</span>
            <Select class="w100 mr10">
              <Option v-for="item in list" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>创建时间：</span>
            <Date-picker
              class="w200 mr20"
              type="date"
              placeholder="选择开始日期"
            ></Date-picker>
            <Date-picker
              class="w200 mr20"
              type="date"
              placeholder="选择结束日期"
            ></Date-picker>
          </div>
          <div class="db">
            <Button type="warning" class="mr10 w90">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
            <Button type="warning" class="mr10 w90" @click="showApplication">申请活动</Button>
            <Button @click="cancelApply" type="warning" class="mr10 w90">取消申请</Button>
            <Button
              type="warning"
              class="mr10"
              @click="showApplication"
              :style="style1"
            >编辑/重新提交</Button>
            <Button :style="style" type="warning" class="mr10 w90" @click="showReview">审核</Button>
          </div>
        </div>
      </div>
    </section>

    <!-- 活动信息头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name2'">
        <div class="wlf">
          <div class="db mr">
            <span>指定公司：</span>
            <Select class="w100 mr10" @on-change="onSelectChange">
              <Option v-for="item in list" :value="item.value" :key="item.value">{{item.value}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>活动时间：</span>
            <Date-picker
              @on-change="getBeginDate"
              class="w200 mr20"
              type="date"
              placeholder="选择开始日期"
            ></Date-picker>
            <Date-picker
              @on-change="getEndDate"
              class="w200 mr20"
              type="date"
              placeholder="选择结束日期"
            ></Date-picker>
          </div>
          <div class="db mr10">
            <span>活动配件：</span>
            <Input ref="getDataObj" style="width:200px" class="mr20" v-model="getDataObj.partName"></Input>
          </div>
          <div class="db">
            <Button @click="getActivity" type="warning" class="mr20">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
            <Button @click="cancelActivity" type="warning" class="mr20">取消活动</Button>
          </div>
        </div>
      </div>
    </section>

    <!-- 过期活动头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name3'">
        <div class="wlf">
          <div class="db mr10">
            <span>活动时间：</span>
            <Date-picker
              @on-change="getBeginDate"
              class="w200 mr20"
              type="date"
              placeholder="选择开始日期"
            ></Date-picker>
            <Date-picker
              @on-change="getEndDate"
              class="w200 mr20"
              type="date"
              placeholder="选择结束日期"
            ></Date-picker>
          </div>
          <div class="db">
            <Button @click="getExpiredActivityIfo" type="warning" class="mr20">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- 内容 -->
    <section class="con-box">
      <Tabs value="name1" type="card" @on-click="handleClickTab">
        <TabPane label="活动申请信息" name="name1">
          <Table
            @on-row-click="onRowClick"
            show-summary
            :summary-method="handleSummary"
            highlight-row
            :columns="columns1"
            height="367px"
            border
            :data="data1"
          ></Table>
          <Table show-summary :summary-method="handleSummary" :columns="columns4" :data="data4" border></Table>
        </TabPane>
        <TabPane label="活动信息" name="name2">
          <Table show-summary :summary-method="handleSummary" @on-row-click="onRowClick2" highlight-row :data="data2" :columns="columns2" border></Table>
        </TabPane>
        <TabPane label="过期活动" name="name3">
          <Table show-summary :summary-method="handleSummary" highlight-row :columns="columns3" :data="data3" border></Table>
        </TabPane>
      </Tabs>
    </section>

    <!-- 申请活动弹框 -->
    <Modal width="900" v-model="applicationDialog" title="申请活动" :mask-closable="false">
      <div>
        <div class="header-box clearfix mb20">
          <span>
            是否厂家提供
            <Checkbox v-model="single"></Checkbox>
          </span>
          <span>
            是否低于成本
            <Checkbox v-model="single2"></Checkbox>
          </span>
        </div>
        <div class="mb20" style="width: 300px">
          <Form ref="formValidate" :model="formValidate" :rules="textRules" :label-width="50">
            <FormItem label="备注" prop="remark">
              <Input
                v-model="formValidate.remark"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
              ></Input>
            </FormItem>
          </Form>
        </div>
        <hr />
        <div class="place mt10">
          <Upload action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block">
            <Button type="primary" class="w90 mr10">活动导入</Button>
          </Upload>
          <Button type="default" class="w90 mr10">删除</Button>
          <Button type="default" class="w90 mr10">下载模板</Button>
        </div>
        <div>
          <!-- 弹窗表格部分 -->
          <Table highlight-row size="small" border :stripe="true" :columns="columns5" height="200"></Table>
        </div>
      </div>
      <div>
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-sizer
          show-total
          show-elevator
          class="mr10"
        ></Page>
      </div>
      <div slot="footer">
        <Button type="primary" @click="applicationDialog = false, applyEdit = true">保存</Button>
        <Button type="primary" @click="applicationActivity = false">保存并提交</Button>
        <Button type="default" @click="applicationDialog = false">取消</Button>
      </div>
    </Modal>

    <!-- 审核弹出框 -->
    <Modal v-model="reViewDialog" title="审核" :mask-closable="false">
      <div style="text-align: center">
        <RadioGroup style="height: 150px; line-height: 150px">
          <Radio label="审核通过" class="mr30"></Radio>
          <Radio label="审核不通过"></Radio>
        </RadioGroup>
      </div>
      <div slot="footer">
        <Button type="primary" @click="reViewDialog = false">确定</Button>
        <Button type="default" @click="reViewDialog = false">取消</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import expandTable from "./expandTable.vue";
import {
  getActivityList,
  getExpiredActivityList,
  getActApplicationTable,
  cancelActApply,
  getActivityIfo,
  getExpiredActTable,
  cancelAct,
  getActApplyTable
} from "../../../../api/system/activityManage.js";
export default {
  name: "activityManage",
  data() {
    return {
      list: [
        {
          value: 1,
          label: "草稿"
        },
        {
          value: 2,
          label: "待审核"
        },
        {
          value: 3,
          label: "已通过"
        },
        {
          value: 4,
          label: "不通过"
        },
        {
          value: 5,
          label: "已取消"
        }
      ],
      style: 'display: none',
      style1: 'display: none',
      tabValue: "name1",
      page: {
        total: 0,
        size: 10,
        num: 1
      },
      reViewDialog: false,
      editDialog: false,
      // 活动申请信息数据
      tableFormDate:{
        id: '',
        applyId: '',
        state: ''
      }, //单击表格返回的数据
      columns1: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "申请主表信息",
          key: "mainIfo",
          children: [
            {
              title: "申请分店",
              align: "center",
              key: "orgname"
            },
            {
              title: "申请单号",
              align: "center",
              key: "applyId"
            },
            {
              title: "是否厂家提供",
              align: "center",
              key: "isVender",
              render: (h, params) => {
                // console.log(params)
                let text = params.row.isCancelFlow ? '是' : '否'
                return h('span', {}, text)
              }
            },
            {
              title: "创建人",
              align: "center",
              key: "createUname"
            },
            {
              title: "创建日期",
              align: "center",
              key: "createTime"
            },
            {
              title: "审批状态",
              align: "center",
              key: "state",
            },
            {
              title: "是否为取消申请",
              align: "center",
              key: "isCancelFlow",
              render: (h, params) => {
                // console.log(params)
                let text = params.row.isCancelFlow ? '是' : '否'
                return h('span', {}, text)
              }
            },
            {
              title: "备注",
              align: "center",
              key: "remark"
            }
          ]
        }
      ],
      data1: [],
      // 活动信息数据
      getDataObj: {
        beginDate: "",
        endDate: "",
        orgname: "",
        partName: ""
      },
      columns2: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "活动名称",
          align: "center",
          key: "activityName"
        },
        {
          title: "指定公司",
          align: "center",
          key: "orgname"
        },
        {
          title: "配件内码",
          align: "center",
          key: "partId"
        },
        {
          title: "配件编码",
          align: "center",
          key: "partCode"
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName"
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrandName"
        },
        {
          title: "活动数量",
          align: "center",
          key: "num"
        },
        {
          title: "活动单价",
          align: "center",
          key: "price"
        },
        {
          title: "是否赠送",
          key: "isGift",
          align: "center",
          render: (h, params) => {
            return h('Checkbox', {
              props: {value: true}, 
              on: {
                'on-change': (e) => {
                  console.log(e)
                  }
                  }
               });
          }
        },
        {
          title: "OE码",
          align: "center",
          key: "oemCode"
        },
        {
          title: "车型",
          align: "center",
          key: "carModelName"
        },
        {
          title: "开始日期",
          align: "center",
          key: "beginDate"
        },
        {
          title: "结束日期",
          align: "center",
          key: "endDate"
        },
        {
          title: "活动ID",
          align: "center",
          key: "id"
        },
        {
          title: "备注",
          align: "center",
          key: "remark"
        }
      ],
      data2:[],
      actIfoTableData:{
        id: ''
      },
      actTableRowClickData:[],
      // 过期活动数据
      columns3: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "活动名称",
          align: "center",
          key: "activityName"
        },
        {
          title: "配件内码",
          align: "center",
          key: "partId"
        },
        {
          title: "配件编码",
          align: "center",
          key: "partCode"
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName"
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrandName"
        },
        {
          title: "活动数量",
          align: "center",
          key: "num"
        },
        {
          title: "活动单价",
          align: "center",
          key: "price"
        },
        {
          title: "是否赠送",
          key: "isGift",
          align: "center",
          render: (h, params) => {
            return h('Checkbox', {
              props: {value: true}, 
              on: {
                'on-change': (e) => {
                  console.log(e)
                  }
                  }
               });
          }
        },
        {
          title: "OEM码",
          align: "center",
          key: "oemCode"
        },
        {
          title: "车型",
          align: "center",
          key: "carModelName"
        },
        {
          title: "活动ID",
          align: "center",
          key: "id"
        },
        {
          title: "开始日期",
          align: "center",
          key: "beginDate"
        },
        {
          title: "结束日期",
          align: "center",
          key: "endDate"
        },
        {
          title: "创建人",
          align: "center",
          key: "createUname"
        },
        {
          title: "创建日期",
          align: "center",
          key: "createTime"
        }
      ],
      data3: [],
      // 活动申请页面第二个表格数据
      columns4: [
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "活动名称",
          align: "center",
          key: "activityName"
        },
        {
          title: "指定公司",
          align: "center",
          key: "orgname"
        },
        {
          title: "配件编码",
          align: "center",
          key: "partCode"
        },
        {
          title: "配件名称",
          align: "center",
          key: "partName"
        },
        {
          title: "品牌",
          align: "center",
          key: "partBrandName"
        },
        {
          title: "活动数量",
          align: "center",
          key: "num"
        },
        {
          title: "活动单价",
          align: "center",
          key: "price"
        },
        {
          title: "是否赠送",
          key: "isGift",
          align: "center",
          render: (h, params) => {
            return h('Checkbox', {
              props: {value: true}, 
              on: {
                'on-change': (e) => {
                  console.log(e)
                  }
                  }
               });
          }
        },
        {
          title: "OEM码",
          align: "center",
          key: "oemCode"
        },
        {
          title: "车型",
          align: "center",
          key: "carModelName"
        },
        {
          title: "活动ID",
          align: "center",
          key: "id"
        },
        {
          title: "备注",
          align: "center",
          key: "remark"
        },
        {
          title: "开始日期",
          align: "center",
          key: "beginDate"
        },
        {
          title: "结束日期",
          align: "center",
          key: "endDate"
        },
        {
          title: "创建人",
          align: "center",
          key: "createUname"
        },
        {
          title: "创建日期",
          align: "center",
          key: "createTime"
        }
      ],
      data4: [],
      // 申请活动窗口数据
      single: false,
      single2: false,
      formValidate: {
        remark: ""
      },
      textRules: {
        remark: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      applicationDialog: false,
      applyEdit: false,

      columns5: [
        {
          type: "expand",
          width: 60,
          render: (h, params) => {
            return h(expandTable, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号"
        },
        {
          title: "活动ID",
          align: "center",
          key: "id"
        },
        {
          title: "指定公司",
          align: "center",
          key: "orgname"
        },
        {
          title: "活动名称  ",
          align: "center",
          key: "activityName"
        },
        {
          title: "开始时间",
          align: "center",
          key: "beginDate"
        },
        {
          title: "结束时间",
          align: "center",
          key: "endDate"
        },
        {
          title: "备注",
          align: "center",
          key: "remark"
        }
      ]
    };
  },
  methods: {
    // 活动申请页面
    getActApplicationForm () {
      getActApplicationTable().then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.data1 = res.data
        }
      })
    },
    // 活动信息页面
    getActTable () {
      getActivityIfo().then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.data2 = res.data
        }
      })
    },
    // 过期活动页面
    getExpiredTable () {
      getExpiredActTable().then(res => {
        // console.log(res)
        this.data3 = res.data
      })
    },
    // 活动信息查询
    getActivity() {
      getActivityList(this.getDataObj).then(res => {
        // console.log(res);
        this.data2 = res.data;
      });
    },
    
    // 获取活动信息开始日期
    getBeginDate(item) {
      console.log(item);
      this.getDataObj.beginDate = item;
    },
    // 获取活动信息结束日期
    getEndDate(item) {
      console.log(item);
      this.getDataObj.endDate = item;
    },
    // 获取活动信息指定公司
    onSelectChange (v) {
      console.log(v)
    },
    // 过期活动查询
    getExpiredActivityIfo () {
      getExpiredActivityList(this.getDataObj).then(res => {
        this.data3 = res.data
      })
    },
    // 过期活动日期
    getExpiredDate (item1) {
      // console.log(item1)
      this.expiredDateForm.beginDate = item1[0];
      this.expiredDateForm.endDate = item1[1];
    },
    // 单击表格数据
    onRowClick (tableDate) {
      // 活动申请页面第二个表格数据
      getActApplyTable(this.tableFormDate).then(res => {
        // console.log(res)
        this.data4 = res.data
      })
    // console.log(tableDate)
      this.tableFormDate.id = tableDate.id
      this.tableFormDate.applyId = tableDate.applyId
      this.tableFormDate.state = tableDate.state
      switch(tableDate.state){
        case "待审核":
          this.style = 'display: inline'
          this.style1 = 'display: none'
          break
        case "草稿":
          this.style1 = 'display: inline'
          this.style = 'display: none'
      }
    },
    cancelApply() {
      //取消申请
      cancelActApply(this.tableFormDate).then(res => {
        // console.log(res)
      })
    },
    // 取消活动
    cancelActivity () {
      console.log('被点击了')
      this.$Message.success('成功了')
      //   cancelAct(this.actIfoTableData).then(res => {
      //   console.log(res)
      //   if (res.code === 0) {
      //     this.getActTable()
      //     this.$Message.config('操作成功')
      //   }
      // })

    },
    // 活动信息表格获取行数据
    onRowClick2 (rowValue) {
      console.log(rowValue)
      this.actIfoTableData.id = rowValue.id
      this.actTableRowClickData = rowValue
    },
    // 分页
    changePage() {},
    // 条数
    changeSize() {},
    showApplication() {
      // 弹出申请活动窗口
      this.applicationDialog = true;
    },
    showReview() {
      // 弹出审核窗口
      this.reViewDialog = true;
    },
    handleClickTab(item) {
      //点击tabs切换时
      // console.log(item)
      this.tabValue = item
    },
    handleSummary({ columns, data }) {
      // console.log(columns, data);
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (key === "applyId") {
          sums[key] = {
            key,
            value: data.length
          };
          return;
        }
        if (key === "id") {
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
    }
  },
  created () {
    this.getActApplicationForm()
    this.getActTable()
    this.getExpiredTable()
  }
};
</script>

<style lang="less">
.place {
  line-height: 40px;
  padding-left: 10px;
  border: 1px solid #eee;
}
.ivu-table-expanded-cell {
  padding: 0px !important;
  padding-left: 60px !important;
}
</style>

<template>
  <div class="actManage">
    <!-- 活动申请信息头部 -->
    <section class="oper-box">
      <div class="oper-top flex" v-if="tabValue === 'name1'">
        <div class="wlf">
          <div class="db mr10">
            <span>申请状态：</span>
            <Select class="w100 mr10" v-model="getDataObj.state" clearable>
              <Option
                v-for="item in applyStatusOption"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>创建时间：</span>
            <Date-picker
              @on-change="getBeginDate"
              :value="startTime"
              class="w200 mr20"
              type="date"
              placeholder="选择开始日期"
              :options="startTimeOption"
            ></Date-picker>
            <Date-picker
              @on-change="getEndDate"
              :value="endTime"
              class="w200 mr20"
              type="date"
              placeholder="选择结束日期"
              :options="endTimeOption"
            ></Date-picker>
          </div>
          <div class="db">
            <Button type="warning" class="mr10 w90" @click="selectActApply">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
            <Button
              type="warning"
              class="mr10 w90"
              @click="showApplication('apply')"
              v-has="'apply'"
            >申请活动</Button>
            <Button @click="cancelApply" type="warning" class="mr10 w90" v-has="'noApply'"
              v-if="checkedData[0] && checkedData[0].state != '待审核'"
            >取消申请</Button>
            <Button
              type="warning"
              class="mr10"
              @click="showApplication('edit')"
              v-show="this.checkedData.length > 0 && this.checkedData[0].state === '草稿'"
              v-has="'compile'"
            >编辑/重新提交</Button>
            <Button
              type="warning"
              class="mr10 w90"
              @click="showReview"
              v-has="'audit'"
              v-show="this.checkedData.length > 0 && this.checkedData[0].state === '待审核'&&!this.checkedData[0].processInstanceId"
            >审核</Button>
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
            <Select class="w100 mr10" v-model="getDataObj.orgname" clearable>
              <Option
                v-for="item in companyListOptions"
                :value="item.name? item.name: '未知'"
                :key="item.id"
              >{{item.name}}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>活动时间：</span>
            <Date-picker
              :value="startTime"
              @on-change="getBeginDate"
              :options="startTimeOption"
              class="w200 mr10"
              type="date"
              placeholder="选择开始日期"
            ></Date-picker>
            <Date-picker
              @on-change="getEndDate"
              :value="endTime"
              :options="endTimeOption"
              class="w200"
              type="date"
              placeholder="选择结束日期"
            ></Date-picker>
          </div>
          <div class="db mr10">
            <span>创建人：</span>
            <Input ref="getDataObj" style="width:200px" class="mr10" placeholder="请输入创建人" v-model="getDataObj.createUname" />
          </div>
          <div class="db mr10">
            <span>内码/编码/名称/OE码：</span>
            <Input ref="getDataObj" style="width:200px" class="mr20" placeholder="请输入内码/编码/名称/OE码" v-model="getDataObj.partName" />
          </div>
          <div class="db">
            <Button @click="getWrap" type="warning" class="mr20">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
            <Button @click="cancelActivity" type="warning" class="mr20" v-has="'cancel'">取消活动</Button>
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
              :value="startTime"
              :options="startTimeOption"
              @on-change="getBeginDate"
              class="w200 mr20"
              type="date"
              placeholder="选择开始日期"
            ></Date-picker>
            <Date-picker
              @on-change="getEndDate"
              :options="endTimeOption"
              :value="endTime"
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
      <Tabs value="name1" :animated="false" type="card" @on-click="handleClickTab">
        <TabPane label="活动申请信息" name="name1">
          <Table
            @on-row-click="onRowClick"
            show-summary
            :summary-method="handleSummary"
            highlight-row
            :columns="columns1"
            border
            :loading="loading2"
            :data="data1"
            max-height="290"
          ></Table>
          <Table
            show-summary
            :summary-method="handleSummary"
            :columns="columns4"
            :data="data4"
            border
            max-height="290"
          ></Table>
        </TabPane>
        <TabPane label="活动信息" name="name2">
          <Table
            max-height="600"
            show-summary
            :summary-method="handleSummary"
            @on-row-click="onRowClick2"
            highlight-row
            :data="data2"
            :columns="columns2"
            border
          ></Table>
          <Row>
              <Col id="row">
                <Page
                  id="page"
                  style="flex:right"
                  show-sizer
                  size="small"
                  show-total
                  :page-size-opts="pageSizeOpts"
                  :current="page"
                  :total="total"
                  placement="top"
                  :page-size="pageSize"
                  @on-change="pageChange"
                  @on-page-size-change="pageSizeChange"
                ></Page>
                  <!-- :current="List.page"
                  :total="List.total"
                  :page-size="List.pageSize"
                  @on-page-size-change="onPurchasePageSizeChange1"
                  @on-change="onPurchaseChange1" -->
              </Col>
            </Row>
        </TabPane>
        <TabPane label="过期活动" name="name3">
          <Table
            max-height="630"
            show-summary
            :summary-method="handleSummary"
            :columns="columns3"
            :data="data3"
            border
          ></Table>
        </TabPane>
      </Tabs>
    </section>

    <!-- 申请活动弹框 -->
    <Modal
      width="900"
      v-model="applicationDialog"
      title="申请活动"
      :mask-closable="false"
      @on-cancel="closeDialog"
    >
      <div>
        <div style="height:150px; padding-top: 30px">
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
            <Form ref="formValidate" :rules="textRules" :label-width="50" :model="formValidate">
              <FormItem label="备注" prop="remark">
                <Input
                  v-model="formValidate.remark"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </FormItem>
            </Form>
          </div>
        </div>
        <hr />
        <div class="place mt10">
          <Upload
            ref="upload"
            :action="upurl"
            :show-upload-list="false"
            :format="['xlsx','xls']"
            :on-format-error="onFormatError"
            :headers="headers"
            :before-upload="handleBeforeUpload"
            :on-success="onSuccess"
            style="display: inline-block"
          >
            <Button type="primary" class="w90 mr10">活动导入</Button>
          </Upload>
          <Button type="default" class="w90 mr10" @click="deleteDate5">删除</Button>
          <Button type="default" class="w90 mr10" @click="down">下载模板</Button>
        </div>
        <div>
          <!-- 弹窗表格部分 -->
          <Table
            highlight-row
            border
            :columns="columns5"
            :data="data5"
            height="300"
            @on-row-click="onRowClick3"
          ></Table>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveActApplly">保存</Button>
        <Button type="primary" @click="saveAndSubmit">保存并提交</Button>
        <Button type="default" @click="closeDialog">取消</Button>
      </div>
    </Modal>

    <!-- 审核弹出框 -->
    <Modal v-model="reViewDialog" title="审核" :mask-closable="false">
      <div style="text-align: center; height: 200px">
        <RadioGroup style="margin-top: 20%" v-model="radioCheck">
          <Radio label="审核通过" class="mr30"></Radio>
          <Radio label="审核不通过"></Radio>
        </RadioGroup>
      </div>
      <div slot="footer">
        <Button type="primary" @click="reViewAct">确定</Button>
        <Button type="default" @click="closeReview">取消</Button>
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
  getActApplyTable,
  actImport,
  upxlxs,
  getSelectActApply,
  saveDraft,
  saveSubmit,
  editAndSubmit,
  selectCompany,
  auditActivity
} from "../../../../api/system/activityManage.js";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
import baseUrl from "_conf/url";
const headers = {
  Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
};
export default {
  name: "activityManage",
  data() {
    return {
      applyStatusOption: [
        {
          value: "草稿",
          label: "草稿"
        },
        {
          value: "待审核",
          label: "待审核"
        },
        {
          value: "已通过",
          label: "已通过"
        },
        {
          value: "不通过",
          label: "不通过"
        },
        {
          value: "已取消",
          label: "已取消"
        }
      ],
      radioCheck: "",
      startTime: "",
      endTime: "",
      startTimeOption: {},
      endTimeOption: {},
      tabValue: "name1",
      reViewDialog: false,
      editDialog: false,
      // 详细活动信息/编辑并提交数据回显需要的参数
      tableFormDate: {
        id: "",
        applyId: "",
        state: ""
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
                let text = params.row.isBelowCost ? "是" : "否";
                return h("span", {}, text);
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
              key: "state"
            },
            {
              title: "是否为取消申请",
              align: "center",
              key: "isCancelFlow",
              render: (h, params) => {
                // console.log(params)
                let text = params.row.isCancelFlow ? "是" : "否";
                return h("span", {}, text);
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
      checkedData: [],
      // 活动信息数据
      getDataObj: {
        beginDate: "",
        endDate: "",
        orgname: "",
        partName: "",
        createUname: "",
        state: "",
        id: ""
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
          key: "partInnerId"
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
            return h("Checkbox", {
              props: {
                value: params.row.isGift == 0 ? false : true,
                disabled: true
              },
              on: {
                "on-change": e => {
                  console.log(e);
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
          key: "activityId"
        },
        {
          title: "创建人",
          align: "center",
          key: "createUname"
        },
        {
          title: "备注",
          align: "center",
          key: "remark"
        }
      ],
      data2: [],
      // 公司列表信息
      companyListOptions: [],
      checkedData2: [],
      actIfoTableData: {
        id: ""
      },
      actIfoTableData3: [],
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
          key: "partInnerId"
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
            return h("Checkbox", {
              props: {
                value: params.row.isGift == 0 ? false : true,
                disabled: true
              },
              on: {
                "on-change": e => {
                  console.log(e);
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
          key: "activityId"
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
        },
        {
          title: "备注",
          align: "center",
          key: "remark"
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
            return h("Checkbox", {
              props: {
                value: params.row.isGift == 0 ? false : true,
                disabled: true
              },
              on: {
                "on-change": e => {
                  console.log(e);
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
          key: "activityId"
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
      upurl: upxlxs,
      headers: headers,
      applicationDialog: false,
      applyEditDialog: false,

      columns5: [
        {
          type: "expand",
          width: 60,
          render: (h, params) => {
            return h(expandTable, {
              props: {
                row: params.row.parts
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
          key: "activityId"
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
      ],
      data5: [],
      data6: [],
      loading2:false,
      
      page: 1,
      total: 0,
      size: 20,
      pageSize: 10,
      pageSizeOpts: [10, 20, 30, 40, 50] 
    };
  },
  mounted() {
    this.companyIfo();
    this.getActApplicationForm();
  },
  methods: {
    pageChange(val){
      this.page = val;
      this.getActivity()
      // this.data2 = []
    },
    pageSizeChange(val){
      this.pageSize = val
      this.getActivity()
      // this.data2 = []
    },

    // 活动申请页面
    getActApplicationForm() {
      getActApplicationTable().then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.data1 = (res.data||[]).filter(item => item.state!='已取消');
        }
      });
    },
    // 根据条件查询活动申请
    selectActApply() {
      let data = {}
      // this.getDataObj.beginDate = this.getDataObj.beginDate ? this.getDataObj.beginDate + " 00:00:00" : "";
      // this.getDataObj.endDate = this.getDataObj.endDate ? this.getDataObj.endDate + " 23:59:59" : "";
      for (let key in this.getDataObj) {
        if(this.getDataObj[key]) {
          data[key] = this.getDataObj[key];
        }
      }
      this.loading2 = true;
      getSelectActApply(data).then(res => {
        this.loading2 = false;
        this.data1 = (res.data||[]).filter(item => item.state!='已取消');
        this.data4 = [];
      });
      this.checkedData.length = 0;
    },
    // 活动信息页面
    // getActTable() {
    //   let params = {}
    //   params.page = this.page
    //   params.size = this.pageSize
    //   getActivityIfo(params).then(res => {
    //     console.log(res)
    //     if (res.code === 0) {
    //       this.data2 = res.data.content;
    //     }
    //   });
    // },
    // newArr (arr) {
    //   console.log(arr)
    //   return arr.reduce((pre,cur) => {
    //     // console.log(pre, cur)
    //     let flag = Array.isArray(cur.childs) && Array.isArray(cur.childs)
    //     return pre.concat( flag? this.newArr(cur.childs): cur)
    //   },[])
    // },
    // toList (arr) {
    //     console.log(arr)
    //     return arr.reduce((ret, v) => {
    //         // console.log(ret, v)
    //         let item = this.deepClone(v)
    //         console.log(item)
    //         this.companyListOptions.push(item)
    //         let flag = Array.isArray(v.childs) && v.childs.length > 0
    //         return ret.concat(flag ? this.toList(v.childs) : v)
    //     }, [])
    // },
    // deepClone (obj) {
    //   let ret
    //   ret = JSON.stringify(obj)
    //   ret = JSON.parse(ret)
    //   return ret
    // },
    // 公司店面信息查询
    companyIfo() {
      let user = this.$store.state.user.userData;
      // console.log(user.tenantId)
      selectCompany({ pId: user.tenantId }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          console.log("sadfhkjas：" + res.data)
          let data = res.data;
          this.companyListOptions.push({
            name: '全部'
          })
          Object.keys(data).forEach(key=> {
           this.companyListOptions.push({
             id:key,
             name:data[key]
           })
          });
          // let item = this.deepClone(data)
          // console.log(item)
          // delete item.childs
          // for(let i in data) {
          //   console.log(i)
          // }
          // this.toList([data])
          //
          // console.log(this.companyListOptions)
        }
      });
    },
    // 过期活动页面
    getExpiredTable() {
      getExpiredActTable().then(res => {
        // console.log(res)
        this.data3 = res.data;
      });
    },
    //下载模板
    down() {
      location.href =
        baseUrl.downApi +
        "/file/get?fileId=" +
        1400000000 +
        "&access_token=" +
        Cookies.get(TOKEN_KEY);
    },
    getWrap(){
      this.page = 1
      let data = {}
      // console.log(this.getDataObj.beginDate, this.getDataObj.endDate)
      // this.getDataObj.beginDate = this.getDataObj.beginDate ? this.getDataObj.beginDate + " 00:00:00" : "";
      // this.getDataObj.endDate = this.getDataObj.endDate ? this.getDataObj.endDate + " 23:59:59" : "";
      // console.log(this.getDataObj.beginDate, this.getDataObj.endDate)
      for (let key in this.getDataObj) {
        if(this.getDataObj[key]) {
          data[key] = this.getDataObj[key];
        }
      }
      this.getDataObj = data
      this.getActivity()
    },
    // 根据条件查询活动信息
    getActivity() {
      // this.
      this.getDataObj.size = this.pageSize
      this.getDataObj.page = this.page - 1
      if (this.getDataObj.createUname.trim()){
        this.getDataObj.createUname = this.getDataObj.createUname.trim()
      }
      getActivityList(this.getDataObj).then(res => {
        this.data2 = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    // 获取活动信息开始日期
    getBeginDate(startTime) {
      // console.log(startTime);
      this.getDataObj.beginDate = ""
      this.endTimeOption = {
        disabledDate(endTime) {
          return endTime < new Date(startTime);
        }
      };
      this.getDataObj.beginDate = startTime ? startTime + " 00:00:00" : "";
    },
    // 获取活动信息结束日期
    getEndDate(endTime) {
      // console.log(endTime);
      this.getDataObj.endDate = ""
      this.startTimeOption = {
        disabledDate(startTime) {
          return startTime > new Date(endTime) || startTime > Date.now();
        }
      };
      this.getDataObj.endDate = endTime ? endTime + " 23:59:59" : "";
    },
    // 过期活动查询
    getExpiredActivityIfo() {
      getExpiredActivityList(this.getDataObj).then(res => {
        this.data3 = res.data;
      });
    },
    // 过期活动日期
    getExpiredDate(item1) {
      // console.log(item1)
      this.expiredDateForm.beginDate = item1[0];
      this.expiredDateForm.endDate = item1[1];
    },
    // 单击活动申请信息表格数据
    onRowClick(rowValue1) {
      // console.log(rowValue1)
      this.checkedData = [rowValue1];
      let item = this.checkedData[0];
      this.tableFormDate.id = item.id;
      this.tableFormDate.applyId = item.applyId;
      getActApplyTable({ applyId: this.tableFormDate.applyId }).then(res => {
        // console.log(res)
        this.data4 = [];
        Object.keys(res.data).forEach(key => {
          let item = res.data[key];
          if(Array.isArray(item)) {
            this.data4.push(...item)
          } else {
            this.data4.push(item)
          }
        })
      });
    },
    // 取消申请
    cancelApply() {
      let len = this.checkedData.length;
      if (len <= 0) {
        this.$Message.info("请选择一条申请");
        return;
      }
      let item = this.checkedData[0];
      this.actIfoTableData.id = item.id;
      cancelActApply(this.actIfoTableData).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$Message.success("操作成功");
          this.data4 = [];
          this.getActApplicationForm();
        }
      });
    },
    // 取消活动
    cancelActivity() {
      let len = this.checkedData2.length;
      if (len <= 0) {
        this.$Message.info("请选择一条活动");
        return;
      }
      cancelAct(this.actIfoTableData).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$Message.success("操作成功");
          this.getActivity();
        }
      });
    },
    // 单击活动信息表格获取行数据
    onRowClick2(rowValue2) {
      // console.log(rowValue2)
      this.actIfoTableData.id = rowValue2.id;
      this.checkedData2 = [rowValue2];
    },
    // 弹出申请活动窗口
    showApplication(status) {
      this.actIfoTableData = {
        id: ""
      };
      if (status == "edit") {
        this.applicationDialog = true;
        let item = this.checkedData[0];
        this.single = item. isVender=== 0 ? false : true;
        this.single2 = item. isBelowCost === 0 ? false : true;
        this.formValidate.remark = item.remark;
        editAndSubmit({ applyId: this.tableFormDate.applyId }).then(res => {
          // console.log(res)
          if (res.code === 0) {
            this.data5 = res.data;
          }
        });
      } else {
        this.applicationDialog = true;
        this.tableFormDate = [];
      }
    },
    // 关闭活动窗口
    closeDialog() {
      this.applicationDialog = false;
      this.formValidate.remark = "";
      this.single = false;
      this.single2 = false;
      this.data5 = [];
    },
    // 活动导入
    handleBeforeUpload(file) {
      //上传之前判断
    },
    // 成功函数
    onSuccess(response) {
      if (response.code === 0) {
        console.log(response);
        this.data5 = response.data;
      } else {
        this.$Message.error(response.message);
      }
    },
    onFormatError(file) {
      this.$Message.error("只支持xls xlsx后缀的文件");
    },
    // 删除活动配件的一项
    deleteDate5() {
      if(!this.actIfoTableData.activityId || this.actIfoTableData.activityId == "") {
        setTimeout(()=>{
          this.$Message.error("请选择一条记录");
        },0)
        return
      }
      let idx = this.data5.findIndex(
        item => item.activityId === this.actIfoTableData.activityId
      );
      this.actIfoTableData = {
        id: ""
      }
      this.data5.splice(idx, 1);
    },
    // 点击活动配件某一项
    onRowClick3(rowValue3) {
      this.actIfoTableData = rowValue3;
    },
    // 活动申请保存按钮
    saveActApplly() {
      if (this.formValidate.remark.trim() === "") {
        this.$Message.error("备注不能为空");
      } else if (this.data5.length === 0) {
        this.$Message.error("至少导入一条活动配件");
        return;
      } else {
        saveDraft({
          id: this.tableFormDate.id,
          remark: this.formValidate.remark,
          isBelowCost: this.single2 === false ? 0 : 1,
          isVender: this.single === false ? 0 : 1,
          details: this.data5
        }).then(res => {
          if (res.code === 0) {
            this.applicationDialog = false;
            this.getActApplicationForm();
            this.$Message.success(res.message);
            this.formValidate.remark = "";
            this.single = false;
            this.single2 = false;
            this.data5 = [];
            this.data4 = [];
          }
        });
      }
    },
    // 活动申请保存并提交按钮
    saveAndSubmit() {
      if (this.formValidate.remark === "") {
        this.$Message.error("备注不能为空");
      } else if (this.data5.length === 0) {
        this.$Message.error("至少导入一条活动配件");
        return;
      } else {
        saveSubmit({
          id: this.tableFormDate.id,
          remark: this.formValidate.remark,
          isBelowCost: this.single == false ? 0 : 1,
          isVender: this.single2 == false ? 0 : 1,
          details: this.data5
        }).then(res => {
          if (res.code === 0) {
            this.applicationDialog = false;
            this.getActApplicationForm();
            this.$Message.success(res.message);
            this.formValidate.remark = "";
            this.single = false;
            this.single2 = false;
            this.data5 = [];
            this.data4 = [];
          }
        });
      }
    },
    // 审核窗口
    showReview() {
      this.reViewDialog = true;
    },
    // 审核窗口确定按钮
    reViewAct() {
      if (this.radioCheck == "") {
        this.$Message.warning("请选择通过或者不通过");
        return;
      }
      this.reViewDialog = false;
      let item = this.checkedData[0];
      this.tableFormDate.id = item.id;
      auditActivity({
        id: this.tableFormDate.id,
        auditState: this.radioCheck == "审核通过" ? 1 : 0
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success(res.data);
          this.getActApplicationForm();
          this.data4 = [];
        }
      });
    },
    // 关闭审核窗口
    closeReview() {
      this.reViewDialog = false;
      this.radioCheck = "";
    },
    //点击tabs切换时
    handleClickTab(item) {
      this.tabValue = item;
      switch (item) {
        case "name1":
          // this.getActApplicationForm();
          this.checkedData = [];
          this.data4 = [];
          this.resetFiles();
        case "name2":
          this.getActivity();
          this.resetFiles();
        case "name3":
          this.getExpiredTable();
          this.resetFiles();
      }
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
    },
    // 重置信息
    resetFiles() {
      this.getDataObj.beginDate = "";
      this.getDataObj.endDate = "";
      this.getDataObj.state = "";
      this.getDataObj.partName = "";
      this.getDataObj.orgname = "";
      this.getDataObj.createUname = ""
    }
  }
};
</script>

<style lang="less">
@import url("./index.less");
#row {
  // height: 80px;
  margin-top: 10px;
  z-index: 999;
}
</style>

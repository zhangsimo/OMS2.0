<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf flex2">
          <div class="db mr10 flex">
            <span>是否付费：</span>
            <Select v-model="shState" class="w80">
              <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10 flex">
            <span>是否在用：</span>
            <Select v-model="YesOrNo" class="w80">
              <Option v-for="item in ListTwo" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10 flex">
            <span>到期：</span>
            <Select v-model="deadline" class="w90">
              <Option
                v-for="item in ListThree"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10 flex">
            <span>开通时间：</span>
            <Select v-model="opentime" class="w70">
              <Option v-for="item in ListFour" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db flex">
            <div class="aaaa">
              <Input v-model="lesseeID" placeholder="请输入租户ID" style="width: 100px" class="mr10" />
              <Input v-model="lesseeName" placeholder="请输入租户名称" style="width: 120px" class="mr10" />
              <Input
                v-model="lesseePhone"
                placeholder="请输入租户手机号"
                style="width: 130px"
                class="mr10"
              />
            </div>
            <div class="db xue">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" class="flex">
                <FormItem prop="province">
                  <Select
                    v-model="formValidate.province"
                    placeholder="请选择省份"
                    style="width: 105px"
                    class="mr5 plh"
                  >
                    <Option
                      v-for="item in provinceArr"
                      v-if="item.parentId==0"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem prop="city">
                  <Select
                    v-model="formValidate.city"
                    placeholder="请选择城市"
                    style="width: 105px"
                    class="mr10"
                  >
                    <Option
                      v-for="item in provinceArr"
                      v-if="formValidate.province==item.parentId"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.name}}</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
          </div>
          <div class="db flex Box">
            <Input v-model="salesman" placeholder="请输入业务员" style="width: 110px;" class="mr15" />
            <Input v-model="referrer" placeholder="请输入推荐人" style="width: 110px;" class="mr15" />
            <Button class="mr15 w90" type="warning" @click="search">
              <span>
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
            <Button v-has="'change'" class="mr15 w90"  @click="changeNav">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
            </Button>
            <Button
              @click="startUse"
              class="mr15 w90"
              type="success"
              v-has="'start'"
              v-if="Message.isDisabled == 1"
            >
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />启用
              </span>
            </Button>
            <Button
              @click="endUse"
              class="mr15 w90"
              type="primary"
              v-has="'start'"
              v-else-if="Message.isDisabled == 0 "
            >
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
              </span>
            </Button>
            <Button
              v-has="'start'"
              class="mr15 w90" type="warning" v-else>
              <span class="center">未选中</span>
            </Button>
            <Button class="mr15" @click="viewProduct">
              <span class="center">
                <Icon custom="iconfont iconchakanchanpinicon icons" />查看产品
              </span>
            </Button>
            <Button class="mr15" @click="viewOrder">
              <span class="center">
                <Icon custom="iconfont iconchakandingdanicon icons" />查看订单
              </span>
            </Button>
            <Button class="mr15" @click="viewMoney">
              <span class="center">
                <Icon custom="iconfont iconfeiyongchakanicon icons" />查看费用
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <Table
        class="table-highlight-row"
        size="small"
        highlight-row
        :loading="loading"
        border
        :stripe="true"
        :columns="columns"
        :data="tbdata"
        @on-row-click="selection"
      ></Table>
      <Page
        class-name="page-con"
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-sizer
        show-total
      ></Page>
    </section>

    <Modal v-model="changeAlert" title="修改用户" width="660px" on-visible-change="visChange">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="120">
        <FormItem label="租户名称：" prop="tenantName">
          <Input v-model="formValidate2.tenantName" />
        </FormItem>
        <FormItem label="管理员：" prop="salesManman">
          <Input v-model="formValidate2.salesManman" />
        </FormItem>
        <FormItem label="联系地址：" prop="address">
          <Input v-model="formValidate2.address" />
        </FormItem>
        <Row>
          <Col span="11">
            <FormItem label="联系电话：" prop="mobile">
              <Input v-model="formValidate2.mobile" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="管理员身份：" prop="tenantId">
              <Radio-group v-model="formValidate2.tenantId">
                <Radio label="老板" style="margin-right: 20px"></Radio>
                <Radio label="员工"></Radio>
              </Radio-group>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="业务员：" prop="salesman2">
              <Input v-model="formValidate2.salesman2" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="推荐员：" prop="Recommended_member">
              <Input v-model="formValidate2.Recommended_member" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="省份：" prop="province" style="margin-right: 15px">
              <Select v-model="formValidate2.province" style="width: 150px;" class="mr5">
                <Option
                  v-for="item in provinceArr"
                  v-if="item.parentId==0"
                  :key="item.id"
                  :value="item.id"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="城市：" prop="city" width="150px">
              <Select v-model="formValidate2.city" style="width: 150px">
                <Option
                  v-for="item in provinceArr"
                  v-if="item.parentId==formValidate2.province"
                  :key="item.id"
                  :value="item.id"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="开通时间：">
              <DatePicker
                type="date"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 150px"
                v-model="formValidate2.startDate"
                :options="options3"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="结束时间：">
              <DatePicker
                type="date"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 150px"
                v-model="formValidate2.endDate"
                :options="options3"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="首次付费金额：">
              <InputNumber v-model="formValidate2.FirstPay" style="width: 150px" ></InputNumber>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="是否付费：">
              <Checkbox v-model="formValidate2.payorno" style="width: 20px!important;"></Checkbox>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="下次付费时间：">
              <DatePicker
                type="date"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 150px"
                v-model="formValidate2.nextPayTime"
                :options="options4"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="下次付费金额：">
              <InputNumber v-model="formValidate2.nextPayMoney" style="width: 150px" ></InputNumber>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="hint">
        <span class="hint2">提示：带有*为必填项，手动输入必填项，不可为空！</span>
      </div>
      <div class="audit_nav3" slot="footer">
        <Button @click="Pass" class="mr20 w90" style="background: #fd5c5c;color: white">保存</Button>
        <Button @click="cancel" class="w90">取消</Button>
      </div>
    </Modal>
    <Modal v-model="View_product" title="查看产品" width="45%">
      <div class="audit_nav">
        <Table border :columns="columns2" :loading="loading2" :data="tbdata2"></Table>
      </div>
      <div class="audit_nav4">
        <Page
          class-name="page-con"
          :current="page2.num"
          :total="page2.total"
          :page-size="page2.size"
          @on-change="changePage2"
          @on-page-size-change="changeSize2"
          show-sizer
          show-total
        ></Page>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="View_Order" title="查看订单" width="70%">
      <div class="audit_nav">
        <Table border :columns="columns3" :loading="loading3" :data="tbdata3"></Table>
      </div>
      <div class="audit_nav4">
        <Page
          class-name="page-con"
          :current="page3.num"
          :total="page3.total"
          :page-size="page3.size"
          @on-change="changePage3"
          @on-page-size-change="changeSize3"
          show-sizer
          show-total
        ></Page>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="View_Money" title="查看费用" width="56%">
      <div class="audit_nav">
        <Table border :columns="columns4" :loading="loading4" :data="tbdata4"></Table>
      </div>
      <div class="audit_nav4">
        <Page
          class-name="page-con"
          :current="page4.num"
          :total="page4.total"
          :page-size="page4.size"
          @on-change="changePage4"
          @on-page-size-change="changeSize4"
          show-sizer
          show-total
        ></Page>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import {
  TenanInformation,
  area,
  aaa,
  FindByItemCode,
  Product,
  Order,
  Confirm,
  Money
} from "../../../api/lease/registerApi";
import { getRelativeDate } from "../../../libs/tools";
import * as tools from "../../../utils/tools";

export default {
  name: "lessee",
  data() {
    const mobileValidator = (rule, value, callback) => {
      if (value) {
        if (!value.match(/^1[3456789]\d{9}$/)) {
          callback(new Error("手机号格式不对"));
        } else {
          callback();
        }
      } else {
        callback(new Error("联系电话不能为空"));
      }
    };
    return {
      options3: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      options4: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      cityId: "",
      List: [
        {
          value: 9999,
          name: "所有"
        },
        {
          value: 1,
          name: "付费"
        },
        {
          value: 0,
          name: "免费"
        }
      ],
      ListTwo: [
        {
          value: 9999,
          name: "所有"
        },
        {
          value: 1,
          name: "停用"
        },
        {
          value: 0,
          name: "在用"
        }
      ],
      ListThree: [
        {
          value: 0,
          name: "一周内"
        },
        {
          value: 1,
          name: "一月内"
        },
        {
          value: 2,
          name: "所有"
        },
      ],
      ListFour: [
        {
          value: 0,
          name: "本周"
        },
        {
          value: 1,
          name: "本月"
        },
        {
          value: 2,
          name: "本年"
        },
        {
          value: 3,
          name: "上年"
        }
      ],
      //省市
      provinceArr: [],
      changeAlert: false,
      cities: "",
      formValidate: {},
      ruleValidate: {},
      formValidate2: {
        province: "",
        city: "",
        tenantName: "",
        salesManman: "",
        address: "",
        mobile: "",
        tenantId: "老板",
        startDate: "",
        endDate: "",
        salesman2: "",
        Recommended_member: "",
        FirstPay:0,
        nextPayTime: "",
        nextPayMoney: 0,
        payorno: ""
      },
      ruleValidate2: {
        tenantName: [
          { required: true, message: "租户名称不能为空", trigger: "change" }
        ],
        mobile: [
          {
            required: true,
            validator: mobileValidator,
            trigger: "change"
          }
        ],
        province: [
          {
            required: true,
            message: "省份不能为空",
            trigger: "change",
            type: "string"
          }
        ],
        city: [
          {
            required: true,
            message: "城市不能为空",
            trigger: "change",
            type: "string"
          }
        ]
      },
      shState: 9999,
      YesOrNo: 9999,
      deadline: 0,
      opentime: 0,
      lesseeID: "",
      lesseeName: "",
      lesseePhone: "",
      salesman: "",
      referrer: "",
      selected: true,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      identity2: "",
      View_Order: false,
      View_Money: false,
      View_product: false,
      columns: [
        {
          title: "选择",
          align: "center",
          width: 70,
          // key: 'choice',
          render: (h, params) => {
            return h("span", {
              class: "table-radio"
            });
          }
        },
        {
          title: "是否付费",
          align: "center",
          minWidth: 100,
          // key:'pay',
          render: (h, params) => {
            let isPay = params.row.isPay || 0;
            this.payorno = isPay === 1 ? true : false;
            // console.log(params.row)
            return h("checkbox", {
              props: {
               disabled: true,
                value: isPay === 1 ? true : false,

              }
            });
          }
        },
        {
          title: "是否在用",
          align: "center",
          minWidth: 100,
          // key:'use',
          render: (h, params) => {
            let isDisabled = params.row.isDisabled || 0;
            return h("checkbox", {
              props: {
                  disabled: true,
                  value: isDisabled === 1 ? false : true
              }
            });
          }
        },
        {
          title: "租户ID",
          align: "left",
          key: "tenantId",
          minWidth: 80
        },
        {
          title: "租户类型",
          align: "left",
          key: "tenantTypeName",
          minWidth: 170
          // render:(h,params) => {
          //   // console.log(params.row.type)
          //   let parameter = params.row.tenantType
          //   console.log(parameter)
          //   // FindByItemCode(parameter).then((res) => {
          //   //   // this.returnName = res.data.dictName
          //   //   console.log(res)
          //   // })
          //   return h('span',this.returnName)
          // },
        },
        {
          title: "租户名称",
          align: "left",
          key: "tenantName",
          minWidth: 200
        },
        {
          title: "省份",
          align: "left",
          key: "provinceName",
          minWidth: 120
        },
        {
          title: "城市",
          align: "left",
          key: "cityName",
          minWidth: 120
        },
        {
          title: "管理员",
          align: "left",
          key: "manager",
          minWidth: 120
        },
        {
          title: "管理员身份",
          align: "left",
          key: "managerIdentity",
          minWidth: 120,
          render: (h, params) => {
            //   // console.log(params)
            let Identity = params.row.managerIdentity;
            //   // console.log(params.row.tenantId)
            let zi = "";
            if (Identity === 0) {
              zi = "老板";
            }
            if (Identity === 1) {
              zi = "员工";
            }
            return h("span", zi);
          }
        },
        {
          title: "联系电话",
          align: "center",
          key: "mobile",
          minWidth: 130
        },
        {
          title: "联系地址",
          align: "left",
          key: "address",
          minWidth: 200
        },
        {
          title: "注册时间",
          align: "center",
          key: "registerTime",
          minWidth: 200
        },
        {
          title: "审核时间",
          align: "center",
          key: "auditDate",
          minWidth: 200
        },
        {
          title: "开通时间",
          align: "center",
          key: "startDate",
          minWidth: 200
        },
        {
          title: "结束时间",
          align: "center",
          key: "endDate",
          minWidth: 200
        }
      ],
      columns2: [
        {
          title: "产品名称",
          align: "center",
          width: 168,
          key: "productName"
        },
        {
          title: "产品类型",
          align: "center",
          minWidth: 168,
          key: "type",
          render: (h, params) => {
            let zi = "";
            if (params.row.type === 0) {
              zi = "功能模块";
            }
            if (params.row.type === 1) {
              zi = "接口调用";
            }
            return h("span", zi);
          }
        },
        {
          title: "开通时间",
          align: "center",
          minWidth: 168,
          key: "paymentDate"
        },
        {
          title: "结束时间",
          align: "center",
          key: "expiryDate",
          minWidth: 168
        }
      ],
      columns3: [
        {
          title: "订单单号",
          align: "center",
          width: 100,
          key: "orderNum"
        },
        {
          title: "订单时间",
          align: "center",
          minWidth: 170,
          key: "orderDate"
        },
        {
          title: "产品名称",
          align: "center",
          minWidth: 100,
          key: "productName"
        },
        {
          title: "产品类型",
          align: "center",
          // key: 'type',
          minWidth: 100,
          render: (h, params) => {
            let zi = "";
            if (params.row.type === 0) {
              zi = "功能模块";
            }
            if (params.row.type === 1) {
              zi = "接口调用";
            }
            return h("span", zi);
          }
        },
        {
          title: "开通时间",
          align: "center",
          key: "paymentDate",
          minWidth: 170
        },
        {
          title: "结束时间",
          align: "center",
          key: "expiryDate",
          minWidth: 170
        },
        {
          title: "是否付款",
          align: "center",
          key: "isPayment",
          minWidth: 100,
          render: (h, params) => {
            let zi = "";
            if (params.row.isPayment === 0) {
              zi = "未付款";
            }
            if (params.row.isPayment === 2) {
              zi = "已关闭";
            }
            if (params.row.isPayment === 1) {
              zi = "已付款";
            }
            return h("span", zi);
          }
        },
        {
          title: "付款时间",
          align: "center",
          key: "orderDate",
          render:(h, params) => {
            let t = params.row.isPayment === 1 ? params.row.orderDate : ''
            return h('span' ,t)
          },
          minWidth: 170
        },
        {
          title: "付款方式",
          align: "center",
          key: "paymentType",
          minWidth: 100,
          render: (h, params) => {
            let zi = "";
            if (params.row.paymentType === 0) {
              zi = "支付宝";
            }
            if (params.row.paymentType === 1) {
              zi = "微信";
            }
            return h("span", zi);
          }
        },
        {
          title: "订单状态 ",
          align: "center",
          key: "status",
          minWidth: 100,
          render: (h, params) => {
            let zi = "";
            if (params.row.isPayment === 1) {
              zi = "成功";
            }
            if (params.row.isPayment === 0) {
              zi = "失败";
            }
            return h("span", zi);
          }
        }
      ],
      columns4: [
        {
          title: "产品名称",
          align: "center",
          minWidth: 180,
          key: "productName"
        },
        {
          title: "付款方式",
          align: "center",
          minWidth: 180,
          key: "paymentType",
          render: (h, params) => {
            let zi = "";
            if (params.row.paymentType === 0) {
              zi = "支付宝";
            }
            if (params.row.paymentType === 1) {
              zi = "微信";
            }
            return h("span", zi);
          }
        },
        {
          title: "付款金额",
          align: "center",
          key: "costPrice",
          minWidth: 180
        },
        {
          title: "付款时间",
          align: "center",
          key: "paymentDate",
          minWidth: 180
        }
      ],
      tbdata2: [],
      tbdata: [],
      tbdata3: [],
      tbdata4: [],
      choose: "",
      Message: {
          isDisabled:1
      },
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      //产品分页
      page2: {
        num: 1,
        size: 10,
        total: 0
      },
      //订单分页
      page3: {
        num: 1,
        size: 10,
        total: 0
      },
      //费用分页
      page4: {
        num: 1,
        size: 10,
        total: 0
      },
      // buttonsShow:{},//权限按钮展示

    };
  },
  methods: {
    // 修改弹框
    visChange(type) {
      // this.$refs.formValidate2.resetFields();
    },
    //时间
    lt9(v) {
      return v > 9 ? v : "0" + v;
    },
    transTime(long) {
      if (!long) return "";
      let date = new Date(long);

      let year = date.getFullYear();
      let month = this.lt9(date.getMonth() + 1);
      let day = this.lt9(date.getDate());
      let hour = this.lt9(date.getHours());
      let minutes = this.lt9(date.getMinutes());
      let second = this.lt9(date.getSeconds());
      console.log(`${year}-${month}-${day} ${hour}:${minutes}:${second}`);
      return `${year}-${month}-${day} ${hour}:${minutes}:${second}`;
    },
    //分页
    changePage(p) {
      this.page.num = p;
      this.getList();
    },
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
      this.getList();
    },
    //查看产品分页
    changePage2(p) {
      this.page2.num = p;
      this.CheckProduct();
    },
    changeSize2(size) {
      this.page2.num = 1;
      this.page2.size = size;
      this.CheckProduct();
    },
    //查看订单分页
    changePage3(p) {
      this.page3.num = p;
      this.CheckOrder();
    },
    changeSize3(size) {
      this.page3.num = 1;
      this.page3.size = size;
      this.CheckOrder();
    },
    //查看费用分页
    changePage4(p) {
      this.page4.num = p;
      this.CheckMoney();
    },
    changeSize4(size) {
      this.page4.num = 1;
      this.page4.size = size;
      this.CheckMoney();
    },
    //搜索
    search() {
      this.page.num = 1;
      this.getList();
    },
    //保存
    Pass() {
      this.$refs.formValidate2.validate(valid => {
        if (valid) {
          let params = {};
          params.tenantName = this.formValidate2.tenantName;
          params.address = this.formValidate2.address;
          params.mobile = this.formValidate2.mobile;
          // params.managerIdentity =  this.formValidate2.tenantId
          if (this.formValidate2.tenantId === "老板") {
            params.managerIdentity = 0;
          }
          if (this.formValidate2.tenantId === "员工") {
            params.managerIdentity = 1;
          }
          params.startDate = tools.transTime(this.formValidate2.startDate) || "";
          params.endDate = tools.transTime(this.formValidate2.endDate) || "";
          params.provinceId = this.formValidate2.province;
          params.cityId = this.formValidate2.city;
          params.manager = this.formValidate2.salesManman;
          params.address = this.formValidate2.address;
          params.salesMan = this.formValidate2.salesman2;
          params.referee = this.formValidate2.Recommended_member;
          // params.firstPayAmt = parseInt(this.formValidate2.FirstPay);
          params.firstPayAmt = this.formValidate2.FirstPay
          // params.isPay = this.formValidate2.payorno
          if (this.formValidate2.payorno === true) {
            params.isPay = 1;
          } else {
            params.isPay = 0;
          }
          // params.nextRenewAmt = parseInt(this.formValidate2.nextPayMoney);
          params.nextRenewAmt = this.formValidate2.nextPayMoney
          params.nextRenewDate = this.transTime(this.formValidate2.nextPayTime);
          params.id = this.Message.id;
          Confirm(params).then(res => {
            if (res.code === 0) {
              this.getList();
              this.changeAlert = false;
              this.formValidate2.tenantName = "";
              this.formValidate2.address = "";
              this.formValidate2.mobile = "";
              this.formValidate2.tenantId = "";
              this.formValidate2.startDate = "";
              this.formValidate2.endDate = "";
              this.formValidate2.province = "";
              this.formValidate2.city = "";
              this.formValidate2.salesManman = "";
              this.formValidate2.salesman2 = "";
              this.formValidate2.Recommended_member = "";
              this.formValidate2.FirstPay = "";
              this.formValidate2.payorno = false;
              this.formValidate2.nextPayMoney = "";
              this.formValidate2.nextPayTime = "";
            }
          });
        } else {
          this.$message.error("带*必填");
        }
      });
    },
    cancel() {
      this.changeAlert = false;
    },
    //查看产品
    viewProduct() {
      if (this.choose !== "") {
        this.View_product = true;
        this.CheckProduct();
      } else {
        this.$Message.warning("请选择查看对象");
      }
    },
    //查看产品封装
    CheckProduct() {
      this.loading2 = true;
      // console.log(this.choose.tenantId)
      let params = {};
      // let tenantID = this.choose.tenantId
      params.page = this.page2.num - 1;
      params.size = this.page2.size;
      let data = {};
      data.tenantId = this.choose.tenantId;
      data.isPayment = 1;
      Product({ data: data, params: params }).then(res => {
        if (res.code === 0) {
          this.loading2 = false;
          this.page2.total = res.data.totalElements;
          // console.log(res.totalElements)
          this.tbdata2 = res.data.content || [];
        }
      });
    },
    //查看订单
    viewOrder() {
      if (this.choose !== "") {
        this.View_Order = true;
        this.CheckOrder();
      } else {
        this.$Message.warning("请选择查看对象");
      }
    },
    // 查看订单封装
    CheckOrder() {
      this.loading = true;
      let params = {};
      params.page = this.page3.num - 1;
      params.size = this.page3.size;
      let data = {};
      data.tenantId = this.choose.tenantId;
      Order({ params: params, data: data }).then(res => {
        this.loading = false;
        if (res.code === 0) {
          this.page3.total = res.data.totalElements;
          this.tbdata3 = res.data.content || [];
        }
      });
    },
    //查看费用
    viewMoney() {
      if (this.choose !== "") {
        this.View_Money = true;
        this.CheckMoney();
      } else {
        this.$Message.warning("请选择查看对象");
      }
    },
    //查看费用封装
    CheckMoney() {
      this.loading4 = true;
      let params = {};
      // let tenantID = this.choose.tenantId
      params.page = this.page4.num - 1;
      params.size = this.page4.size;
      let data = {};
      data.tenantId = this.choose.tenantId;
      Money({ params: params, data: data }).then(res => {
        this.loading4 = false;
        if (res.code === 0) {
          this.page4.total = res.data.totalElements;
          this.tbdata4 = res.data.content || [];
          // console.log(this.tbdata3)
        }
      });
    },
    //启用
    startUse() {
      // let status = this.Message.isDisabled
      let ID = this.Message.id;
      let params = {
        isDisabled: 0,
        id: ID
      };
      Confirm(params).then(res => {
        this.$Message.warning("启用成功");
        this.Message.isDisabled = 5;
        this.getList();
      });
    },
    // 禁用
    endUse() {
      // let status = this.Message.isDisabled
      let ID = this.Message.id;
      let params = {
        isDisabled: 1,
        id: ID
      };
      Confirm(params).then(res => {
        this.$Message.warning("禁用成功");
        this.Message.isDisabled = 5;
        this.getList();
      });
    },
    //初始化
    getList() {
      this.loading = true;
      let params = {};
      let data = {};
      if (this.shState !== 9999) {
        data.isPay = this.shState;
      }
      if (this.YesOrNo !== 9999) {
        data.isDisabled = this.YesOrNo;
      }
      if (this.lesseeID) {
        data.tenantId = this.lesseeID;
      }
      if (this.lesseeName) {
        data.tenantName = this.lesseeName;
      }
      if (this.lesseePhone) {
        data.mobile = this.lesseePhone;
      }
      if (this.formValidate.province) {
        data.provinceId = this.formValidate.province;
      }
      if (this.formValidate.city) {
        data.cityId = this.formValidate.city;
      }
      if (this.salesman) {
        data.salesMan = this.salesman;
      }
      if (this.referrer) {
        data.referee = this.referrer;
      }
      data.endTime = this.deadline;
      data.startTime = this.opentime;
      params.page = this.page.num - 1;
      params.size = this.page.size;
      TenanInformation({ params: params, data: data }).then(res => {
        this.loading = false;
        if (res.code === 0) {
          this.page.total = res.data.totalElements;
          this.tbdata = res.data.content || [];
        }
      });
    },
    //点击表格单选
    selection(a) {
      this.choose = a;
      this.Message = a;
      // console.log(this.Message)
    },
    //修改弹窗
    changeNav() {
      if (this.choose !== "") {
        this.changeAlert = true;
        this.formValidate2.tenantName = this.Message.tenantName;
        this.formValidate2.address = this.Message.address;
        this.formValidate2.mobile = this.Message.mobile;
        if (this.Message.managerIdentity == 0) {
          this.formValidate2.tenantId = "老板";
        } else {
          this.formValidate2.tenantId = "员工";
        }
        // this.tenantId = this.Message.managerIdentity
        this.formValidate2.startDate = this.Message.startDate;
        this.formValidate2.endDate = this.Message.endDate;
        this.formValidate2.province = this.Message.provinceId;
        this.formValidate2.city = this.Message.cityId;
        this.formValidate2.salesManman = this.Message.manager;
        this.formValidate2.address = this.Message.address;
        this.formValidate2.salesman2 = this.Message.salesMan;
        this.formValidate2.Recommended_member = this.Message.referee;
        this.formValidate2.FirstPay = this.Message.firstPayAmt;
        if (this.Message.isPay === 0) {
          this.formValidate2.payorno = false;
        } else {
          this.formValidate2.payorno = true;
        }

        this.formValidate2.nextPayMoney = this.Message.nextRenewAmt;
        this.formValidate2.nextPayTime = this.Message.nextRenewDate;
      } else {
        this.$Message.warning("请选择修改对象");
      }
    },
    selectProvince(v) {
      console.log(this.formValidate2.province);
      let arrData = this.provinceArr.filter(item => item.parentId == v);
      console.log(arrData);
    }
  },
  mounted() {
      // 获取按钮权限
      this.buttonsShow = this.$ButtonShow()
      this.getList();
    //省
    area().then(res => {
      // console.log(res)
      this.provinceArr = res.data;
    });
    // let data = toString(1001)
    // // let a = JSON.stringify(data)
    // aaa({leaseOrderVO:data}).then(res =>{
    //   console.log(res)
    // })
  }
};
</script>

<style scoped>
@import "index.css";
@import "Modify_user.css";
</style>
<style scoped>
.xue >>> .ivu-form-item {
  margin-bottom: 0 !important;
}
.xue >>> .ivu-form-item-content {
  height: 33px;
}
</style>

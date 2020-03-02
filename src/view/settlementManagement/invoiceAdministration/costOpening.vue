<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box paddinSize">
      <Button class="mr10" @click="operation(1)">保存草稿</Button>
      <Button class="mr10" @click="operation(2)">提交申请</Button>
    </section>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <div class="con-box">
        <div class="oper-top">
          <h3>基本信息</h3>
          <div class="wlf">
            <div class="db ml20">
              <FormItem label="分店名称：" prop="value">
                <Select v-model="formValidate.value" class="w150">
                  <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                </Select>
              </FormItem>
            </div>
            <div class="db ml20">
              <FormItem label="分店店号：" prop="value">
                <Select v-model="formValidate.value" class="w150">
                  <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                </Select>
              </FormItem>
            </div>
            <div class="db ml20">
              <FormItem label="往来单位：" prop="value">
                <input type="text" class="h30" v-model="formValidate.value" readonly />
                <i class="iconfont iconcaidan input" @click="Dealings"></i>
              </FormItem>
            </div>
            <div class="db ml20">
              <FormItem label="开票申请单号：" prop="value">
                <Input
                  v-model="formValidate.value"
                  placeholder="请输入开票申请单号"
                  clearable
                  style="width: 150px"
                />
              </FormItem>
            </div>
            <div class="db ml20">
              <FormItem label="申请时间：" prop="value">
                <Date-picker
                  format="yyyy-MM-dd"
                  :value="formValidate.value"
                  @on-change="changedate"
                  type="date"
                  placeholder="选择日期"
                  class="w150"
                ></Date-picker>
              </FormItem>
            </div>
          </div>
        </div>
        <div>
          <h3>发票信息</h3>
          <div class="contentMain">
            <div class="wlf">
              <div class="db ml20">
                <FormItem label="发票单位：" prop="name">
                  <input
                    type="text"
                    class="h30"
                    v-model="formValidate.name"
                    readonly
                    style="width: 150px"
                  />
                  <i class="iconfont iconcaidan input" @click="Dealings"></i>
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="税号：" prop="value">
                  <Input
                    disabled
                    v-model="formValidate.value"
                    placeholder="请输入税号"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="地址电话：" prop="value">
                  <Input
                    disabled
                    v-model="formValidate.value"
                    placeholder="请输入地址电话"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="开户行及账号：" prop="value">
                  <Input
                    disabled
                    v-model="formValidate.value"
                    placeholder="请输入开户行及账号"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="开票单位：" prop="name">
                  <Select v-model="formValidate.name" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="开票类型：" prop="name">
                  <Select v-model="formValidate.name" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="开票税率(%)：" prop="name">
                  <Input
                    v-model="formValidate.name"
                    placeholder="请输入开票税率"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="收款方式：" prop="value">
                  <Select v-model="formValidate.value" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
            <div class="wlf mt10 mb10">
              <div class="db ml20">
                <FormItem label="快递收件人：" prop="name">
                  <Input
                    v-model="formValidate.name"
                    placeholder="请输入快递收件人"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="收件地址：" prop="name">
                  <Input
                    v-model="formValidate.name"
                    placeholder="请输入收件地址"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="电话：" prop="name">
                  <Input
                    v-model="formValidate.name"
                    placeholder="请输入电话"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="寄件方式：" prop="name">
                  <Select v-model="formValidate.name" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="费用承担：" prop="name">
                  <Select v-model="formValidate.name" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="备注：" prop="value">
                  <Input
                    v-model="formValidate.value"
                    placeholder="请输入备注"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="费用类型：" prop="value">
                  <Select v-model="formValidate.value" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
            <div class="wlf">
              <div class="db ml20">
                <FormItem label="申请开票摘要：" prop="value">
                  <Input
                    v-model="formValidate.value"
                    placeholder="请输入申请开票摘要"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="申请金额：" prop="value">
                  <Input
                    v-model="formValidate.value"
                    placeholder="请输入申请申请金额"
                    clearable
                    style="width: 150px"
                  />
                </FormItem>
              </div>
              <div class="db ml20">
                <FormItem label="是否需要收款：" prop="value">
                  <Select v-model="formValidate.value" class="w150">
                    <Option v-for="item in Branchstore" :value="item" :key="item">{{ item}}</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div class="inner-box">
          <button class="mt30 mb20 ivu-btn ivu-btn-default" type="button">开票内容</button>
          <Table
            border
            :columns="columns"
            :data="data"
            ref="summary"
            show-summary
            highlight-row
            :summary-method="handleSummary"
            @on-row-click="election"
            max-height="400"
          ></Table>
          <h3>开票申请进度</h3>
          <Table :columns="columns1" :data="data1"></Table>
        </div>
      </div>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "序号",
          key: "guestOrgName",
          className: "tc"
        },
        {
          title: "开票单位",
          key: "guestOrgName",
          className: "tc"
        },
        {
          title: "客户税号",
          key: "serviceId",
          className: "tc"
        },
        {
          title: "地址电话",
          key: "sourceType",
          className: "tc"
        },
        {
          title: "银行账号",
          key: "guestName",
          className: "tc"
        },
        {
          title: "配件名称",
          key: "guestId",
          className: "tc"
        },
        {
          title: "配件编码",
          key: "belongSystem",
          className: "tc"
        },
        {
          title: "单位",
          key: "storeName",
          className: "tc"
        },
        {
          title: "数量",
          key: "createUname",
          className: "tc"
        },
        {
          title: "含税单价",
          key: "createTime",
          className: "tc"
        },
        {
          title: "含税金额",
          key: "orderAmt",
          className: "tc"
        },
        {
          title: "开票税率",
          key: "remark",
          className: "tc"
        }
      ],
      columns1: [
          {
              title: '开票申请流程',
              key: 'process',
          },
          {
              title: '提交人',
              key: 'submitter'
          },
          {
           renderHeader: (h, params) => {
                return h('div', [
                     h('span',
                    '店长'),
                    // h('img', {
                    //     attrs: {
                    //       src:require('../../../assets/images/jiantou.png')
                    //     },
                    //     style: {
                    //         width: '30px',
                    //         height: '12px'
                    //     }
                    // })
                    h('Icon',{
                      props:{
                        type:'md-arrow-forward'
                      },
                      style:{
                        fontSize:'18px'
                      }
                    })
                ]);
            },
            key: 'shopowner',
          },
          {
            title: '区总',
            key: 'district',
            renderHeader: (h, params) => {
              return h('div', [
                    h('span',
                  '区总'),
                  // h('img', {
                  //     attrs: {
                  //       src:require('../../../assets/images/jiantou.png')
                  //     },
                  //     style: {
                  //         width: '30px',
                  //         height: '12px'
                  //     }
                  // })
                  h('Icon',{
                    props:{
                      type:'md-arrow-forward'
                    },
                    style:{
                      fontSize:'18px'
                    }
                  })
              ]);
            },
          },
          {
            title: '营销总监',
            key: 'marketing',
            renderHeader: (h, params) => {
              return h('div', [
                    h('span',
                  '营销总监'),
                  // h('img', {
                  //     attrs: {
                  //       src:require('../../../assets/images/jiantou.png')
                  //     },
                  //     style: {
                  //         width: '30px',
                  //         height: '12px'
                  //     }
                  // })
                  h('Icon',{
                    props:{
                      type:'md-arrow-forward'
                    },
                    style:{
                      fontSize:'18px'
                    }
                  })
              ]);
            }
          },
          {
            title: '财务总监',
            key: 'financial',
            renderHeader: (h, params) => {
            return h('div', [
              h('span',
                '财务总监'),
                // h('img', {
                //     attrs: {
                //       src:require('../../../assets/images/jiantou.png')
                //     },
                //     style: {
                //         width: '30px',
                //         height: '12px'
                //     }
                // })
                h('Icon',{
                  props:{
                    type:'md-arrow-forward'
                  },
                  style:{
                    fontSize:'18px'
                  }
                })
              ]);
            }
          },
          {
              title: '会计',
              key: 'accounting',
          }
          
      ],
      data1:[
        {
          process: '审批人',
          submitter: 18,
          shopowner: '某某',
          district:'某某',
          marketing:'某某',
          financial:'某某',
          accounting:'某某'
        },
        {
          process: '审批时间',
          submitter: '2020-02-27',
          shopowner: '2020-02-27',
          district:'2020-02-27',
          marketing:'2020-02-27',
          financial:'2020-02-27',
          accounting:'2020-02-27'
        },
      ],
      data: [],
      value: "",
      Branchstore: [],
      model1: "",
      formValidate: {
        name: "",
        value: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "", trigger: "blur" }]
      }
    };
  },
  methods: {
    operation() {},
    election() {},
    handleSummary() {},
    // 选择日期
    changedate(daterange) {},
    //操作
    Dealings() {}
  }
};
</script>
<style lang="less" scoped>
h3 {
  background: #d7ebf9;
  height: 40px;
  line-height: 40px;
  margin-top: 20px;
}
.contentMain {
  display: flex;
  flex-direction: column;
}
.input {
  position: relative;
  left: -26px;
  bottom: -2px;
}
.wlf > div {
  height: 50px !important;
}
</style>

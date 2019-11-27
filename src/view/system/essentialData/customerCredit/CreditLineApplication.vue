<template>
  <div style="height: 475px;overflow: hidden;overflow-y: scroll">
    <Form :model="data" ref="form" :label-width="130" :ruls="ruls">
      <div style="margin-bottom: 10px">
        <span>客户名称:</span>
        <span class="mr20">{{ data.fullName }}</span>
        <span>申请人:</span>
        <span class="mr20">{{ sendMsg.currentUser }}</span>
        <span>申请时间:</span>
        <span class="mr20">{{ data.applyDate }}</span>
        <span>最高受信固定额度:</span>
        <span>100W</span>
      </div>
      <Row>
        <Col span="8">
          <FormItem label='调整前固定额度:' >
            <Input  v-model='data.creditLimit' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='调整前临时额度:' >
            <Input  v-model='data.tempCreditLimit' style="width: 150px" disabled  ></Input>
          </FormItem>

        </Col>
        <Col span="8">
          <FormItem label='申请增加固定额度:' >
            <Input v-model='data.applyQuota' style="width: 150px" @on-blur="increaseBlur"></Input>
          </FormItem>
          <FormItem label='申请增加临时额度:' >
            <!--tempQuota-->
            <Input v-model='data.tempQuota' style="width: 150px" @on-blur="increaseBlur22"></Input>
          </FormItem>
          <FormItem label='临时额度开始时间:' >
            <DatePicker :value="data.tempStart" format="yyyy/MM/dd"  :options="dateOptions" style="width: 150px"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='调整后固定额度:' >
            <Input :value='+ data.applyQuota + data.creditLimit' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='调整后临时额度:' >
            <Input  :value='+data.tempQuota + data.tempCreditLimit' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='临时额度结束时间:' >
            <DatePicker :value="data.tempEnd" format="yyyy/MM/dd"  :options="dateOptions"  style="width: 150px"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <FormItem label='调整前额度合计:' >
          <Input  v-model='data.creditLimit + data.tempCreditLimit' style="width: 150px" disabled  ></Input>
        </FormItem>
        <FormItem label='当前应付账款:' >
          <Input  v-model='payable.payableAmt' style="width: 150px" disabled ></Input>
        </FormItem>
          <FormItem label='信用等级:' >
            <!--&lt;!&ndash;<Input v-model='data.bizLicenseNo' style="width: 180px" ></Input>&ndash;&gt;nature-->
            <Select style="width:150px" v-model="data.tgrade">
              <Option v-for="item in quality" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='申请增加额度合计:' >
            <Input  :value='sum' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='当前应收账款:' >
            <Input  v-model='payable.receivableAmt' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='调整前剩余额度:' >
            <Input  v-model='sum2' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='调整后累计额度:' >
            <Input  :value='(+data.applyQuota+data.creditLimit) + (+data.tempQuota + data.tempCreditLimit)' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='当前欠款总额:' >
            <Input  v-model='payable.sumAmt' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='调整后剩余额度:' >
            <Input  v-model='sum3' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label='当前应收30天内:' >
            <Input  v-model='payable.thirtyAmt' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='当前应收30-60天:' >
            <Input  v-model='payable.sixtyAmt' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='当前应收60天以上:'>
            <Input  v-model='payable.moreSixtyAmt' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
      </Row>
      <FormItem label='申请额度说明:' prop="fullName">
        <Input  v-model='data.quotaReason' style="width: 650px"  ></Input>
      </FormItem>
    </Form>
    <div>
      <p class="title">近6个月及以上业绩情况</p>
      <div class=boxheight>
        <Table :columns="columnsEarnings" :data="sendMsg.sixMonthPerformance" border stripe size="small" height="200"  border show-summary :summary-method="handleSummary"></Table>
      </div>
    </div>
    <div>
      <p class="title">近6个月额度调整记录</p>
      <div class=boxheight>
        <Table :columns="columnsAdjust" :data="sendMsg.guestAdjustVOList" border stripe size="small" height="200"  border></Table>
        <div style="width: 100%;height: 40px;border: 1px solid lightgray;border-top: none!important;display: flex;align-items: center;padding-left: 50px">合计：<span>{{ sendMsg.applyTotalAmt }} 元</span></div>
      </div>
    </div>
    <div>
      <p class="title">未清销售订单</p>
      <div class=boxheight>
        <Table :columns="columnsIndent" :data="sendMsg.sellOrderList" border stripe size="small" height="200"  border  show-summary :summary-method="handleSummaryTwo"></Table>
      </div>
    </div>
  </div>
</template>

<script>
  // guestAdjustadjustInfo
  import { guestAdjustadjustInfo } from '../../../../api/system/CustomerManagement/CustomerManagement'
    export default {
        name: "CreditLineApplication",
        props:{
            data: '',
            sendMsg: '',
            payable: '',
            quality: ''
        },
        data(){
            return {
              // increase: 0, //申请增加额度
              // temporary:0, //申请临时额度
                dateOptions: {
                    disabledDate (date) {
                        return   Date.now()-86400* 1000 > date || date.valueOf() > Date.now() +86400* 1000*29
                    }
                },
                isLoading:true,
                value1: new Date(),
                value2: new Date(),
                ruls:{
                    fullName:[
                        {required: true, message: '申请额度说明必填', trigger: 'change'}
                    ]
                },
              columnsEarnings:[
                    {
                        title:'期间',
                        align: 'center',
                        key:'period'
                    },
                    {
                        title:'销售金额',
                        align: 'center',
                        key:'salesAmt'
                    },
                    {
                        title:'已回款金额',
                        align: 'center',
                        key:'paidAmt'
                    },
                    {
                        title:'未回款金额',
                        align: 'center',
                        key:'uncollectedAmt'
                    },
                    {
                        title:'采购金额',
                        align: 'center',
                        key:'purchaseAmt'
                    },
                    {
                        title:'已付款金额',
                        align: 'center',
                        key:'alreadyPaidAmt'
                    },
                    {
                        title:'未付款金额',
                        align: 'center',
                        key:'unpaidAmt'
                    },
                    {
                        title:'往来净额',
                        align: 'center',
                        key:"totalAmt"
                        // key:'allmoney',
                      // render:(h,params) => {
                      //   let mondy = (params.row.uncollectedAmt - params.row.unpaidAmt)
                      //     params.row.mondy = mondy
                      //   return h('span',mondy)
                      // }
                    },
                ],
              columnsAdjust:[
                {
                  title:'序号',
                  align: 'center',
                  type: 'index'
                },
                {
                  title:'调整生效日',
                  align: 'center',
                  key:'auditDate'
                },
                {
                  title:'增加固定额度',
                  align: 'center',
                  key:'applyQuota'
                },
                {
                  title:'增加临时额度',
                  align: 'center',
                  key:'tempQuota'
                },
                {
                  title:'增加后固定额度',
                  align: 'center',
                  key:'fixationQuotaTotal'
                },
                {
                  title:'增加后临时额度',
                  align: 'center',
                  key:'tempQuotaTotal'
                },
                {
                  title:'临时额度开始日期',
                  align: 'center',
                  key:'tempStart'
                },
                {
                  title:'临时额度结束日期',
                  align: 'center',
                  key:'tempEnd'
                },
                {
                  title:'申请原因',
                  align: 'center',
                  key:'quotaReason'
                }
              ],
              columnsIndent:[
                {
                  title:'序号',
                  align: 'center',
                  type: 'index'
                },
                {
                  title:'订单号',
                  align: 'center',
                  key:'serviceId'
                },
                {
                  title:'订单日期',
                  align: 'center',
                  key:'orderDate'
                },
                {
                  title:'订单金额',
                  align: 'center',
                  key:'orderAmt'
                }
              ]
            }
        },
        methods:{
            resetFields() {
                this.$refs.form.resetFields()
            },
            handleSubmit (callback) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        callback && callback()
                    } else {
                        this.$Message.error('信息填写错误');
                    }
                })
            },
            //6个月业绩合并总价
            handleSummary ({ columns, data }) {
                const sums = {};
                columns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key,
                            value: '合计'
                        };
                        return;
                    }
                    const values = data.map(item => Number(item[key]));
                    let v = ''
                    data.forEach( item => {
                        v += +item.allmoney
                    })
                    if (!values.every(value => isNaN(value))) {
                        const v = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        if (key == "totalAmt") {
                            sums[key] = {
                                key,
                                value: v + ' 元'
                            }
                        } else {
                            sums[key] = {
                                key,
                                value: ''
                            }
                        }
                    } else {
                        sums[key] = {
                            key,
                            value: ''
                        };
                    }
                });

                return sums;
            },
          //近6个月额度调整
          handleSummaryTwo ({ columns, data }) {
            const sums = {};
            columns.forEach((column, index) => {
              const key = column.key;
              if (index === 0) {
                sums[key] = {
                  key,
                  value: '合计'
                };
                return;
              }
              const values = data.map(item => Number(item[key]));
              let v = ''
              data.forEach( item => {
                v += +item.allmoney
              })
              if (!values.every(value => isNaN(value))) {
                const v = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
                if (key === "orderAmt") {
                  sums[key] = {
                    key,
                    value: v + ' 元'
                  }
                } else {
                  sums[key] = {
                    key,
                    value: ''
                  }
                }
              } else {
                sums[key] = {
                  key,
                  value: ''
                };
              }
            });

            return sums;
          },

          //申请增加额度失去焦点
          increaseBlur(){
            var reg = /^\+?[1-9]\d*$/;
            if(!reg.test(this.data.applyQuota)){
              this.$Message.error('请输入大于0的正整数!')
              this.data.applyQuota = 0
            }
            if((+this.data.applyQuota) + (+this.data.creditLimit) > 1000000){
              this.$Message.error('不能超过最高授信额度100万!')
              this.data.applyQuota = 0
            }
          },
          //临时额度失去焦点
          increaseBlur22(){
            var reg = /^\+?[1-9]\d*$/;
            if(!reg.test(this.data.tempQuota)){
              this.$Message.error('请输入大于0的正整数!')
              this.data.tempQuota = 0
            }
            if(+this.data.tempQuota + this.data.tempCreditLimit > 1000000){
              this.$Message.error('不能超过最高授信额度100万!')
              this.data.tempQuota = 0
            }
          }
        },
      mounted(){
        // this.data.applyQuota = ''
        // this.data.tempQuota = ''
      },
      computed: {
          sum(){
            this.data.tototo = (+ this.data.applyQuota) + (+ this.data.tempQuota);
            return isNaN((+ this.data.applyQuota) + (+ this.data.tempQuota)) ? 0 : (+ this.data.applyQuota) + (+ this.data.tempQuota);
        },
        //调整前剩余额度
        sum2(){
            let sum = (+this.data.creditLimit + this.data.tempCreditLimi) - (this.payable.sumAmt)
            return isNaN(sum) ? 0 : sum
        },
        //调整后剩余额度
        sum3(){
             this.data.totalSum = this.sum + this.sum2
            return isNaN(this.data.totalSum) ? 0 : this.data.totalSum
        }
      }
    }
</script>

<style scoped lang="less">
.title {
  line-height: 30px;
  border-bottom: 1px #e0e0e0 solid;
  margin: 10px 0;
}
  /*.boxheight {*/
  /*  height: 200px;*/
  /*}*/
</style>

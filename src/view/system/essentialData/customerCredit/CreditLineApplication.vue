<template>
  <div style="height: 475px;overflow: hidden;overflow-y: scroll">
    <Form :model="data" ref="form" :label-width="130" :ruls="ruls">
      <div style="margin-bottom: 10px">
        <span>客户名称:</span>
        <span class="mr20">{{ data.fullName }}</span>
        <span>申请人:</span>
        <span class="mr20">{{ data.applyMan}}</span>
        <span>申请时间:</span>
        <span class="mr20">{{ data.applyDate }}</span>
        <span>最高受信固定额度:</span>
        <span>100W</span>
      </div>
      <Row>
        <Col span="8">
          <FormItem label='调整前固定额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='调整前临时额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled  ></Input>
          </FormItem>

        </Col>
        <Col span="8">
          <FormItem label='申请增加固定额度:' >
            <Input v-model='data.fullName' style="width: 150px" ></Input>
          </FormItem>
          <FormItem label='申请增加临时额度:' >
            <Input v-model='data.fullName' style="width: 150px" ></Input>
          </FormItem>
          <FormItem label='临时额度开始时间:' >
            <DatePicker :value="value1" format="yyyy/MM/dd"  :options="dateOptions" style="width: 150px"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='调整后固定额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='调整后临时额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='临时额度结束时间:' >
            <DatePicker :value="value2" format="yyyy/MM/dd"  :options="dateOptions"  style="width: 150px"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
        <FormItem label='调整前额度合计:' >
          <Input  v-model='data.fullName' style="width: 150px" disabled  ></Input>
        </FormItem>
        <FormItem label='当前应付账款:' >
          <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
        </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='申请增加额度合计:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='当前应收账款:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='调整前剩余额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='调整后累计额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled  ></Input>
          </FormItem>
          <FormItem label='当前欠款总额:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
          <FormItem label='调整后剩余额度:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label='当前应收30天内:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='当前应收30-60天:' >
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='当前应收60天以上:'>
            <Input  v-model='data.fullName' style="width: 150px" disabled ></Input>
          </FormItem>
        </Col>
      </Row>
      <FormItem label='申请额度说明:' prop="fullName">
        <Input  v-model='data.fullName' style="width: 650px"  ></Input>
      </FormItem>
    </Form>
    <div>
      <p class="title">近6个月及以上业绩情况</p>
      <div class=boxheight>
        <Table :columns="columns" :data="performance" border stripe size="small" height="200"  border show-summary :summary-method="handleSummary"></Table>
      </div>
    </div>
    <div>
      <p class="title">近6个月额度调整记录</p>
      <div class=boxheight>
        <Table :columns="columns" :data="performance" border stripe size="small" height="200"  border show-summary :summary-method="handleSummary"></Table>
      </div>
    </div>
    <div>
      <p class="title">未清销售订单</p>
      <div class=boxheight>
        <Table :columns="columns" :data="performance" border stripe size="small" height="200"  border  ></Table>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "CreditLineApplication",
        props:{
            data: ''
        },
        data(){
            return {
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
                columns:[
                    {
                        title:'期间',
                        align: 'center',
                        key:'tiem'
                    },
                    {
                        title:'销售金额',
                        align: 'center',
                        key:'money'
                    },
                    {
                        title:'已回款金额',
                        align: 'center',
                        key:'backmoney'
                    },
                    {
                        title:'未回款金额',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'采购金额',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'已付款金额',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'未付款金额',
                        align: 'center',
                        key:'name'
                    },
                    {
                        title:'往来净额',
                        align: 'center',
                        key:'allmoney'
                    },
                ],
                performance:[
                    {tiem:2019-1,
                    money:100,
                    backmoney:200,
                    allmoney:-233},
                    {tiem:2019-1,
                        money:200,
                        backmoney:300,
                        allmoney:433},

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
            //6个月合并总价
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
                        if (key == "allmoney") {
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

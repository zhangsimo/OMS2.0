<template>
    <Form :model="data" ref="form" :label-width="130" :ruls="ruls">
      <div style="margin-bottom: 10px">
        <span>客户名称:</span>
        <span class="mr20">华盛集团XXX汽配店</span>
        <span>申请人:</span>
        <span class="mr20">XXXXXX</span>
        <span>申请时间:</span>
        <span class="mr20">2019-11-11</span>
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
            <Input v-model='data.fullName' style="width: 150px" disabled></Input>
          </FormItem>
          <FormItem label='申请增加临时额度:' >
            <Input v-model='data.fullName' style="width: 150px" disabled></Input>
          </FormItem>
          <FormItem label='临时额度开始时间:' >
            <DatePicker :value="value1" format="yyyy/MM/dd"  :options="dateOptions" style="width: 150px" disabled></DatePicker>
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
            <DatePicker :value="value2" format="yyyy/MM/dd"  :options="dateOptions"  style="width: 150px" disabled></DatePicker>
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
        <Input  v-model='data.fullName' style="width: 650px"  disabled></Input>
      </FormItem>
    </Form>
</template>

<script>
    export default {
        name: "CreditLineApplication",
        props:{
            data:''
        },
        data(){
            return {
                dateOptions: {
                    disabledDate (date) {
                        return   Date.now()-86400* 1000 > date || date.valueOf() > Date.now() +86400* 1000*29
                    }
                },
                value1: new Date(),
                value2: new Date(),
                ruls:{
                    fullName:[
                        {required: true, message: '申请额度说明必填', trigger: 'change'}
                    ]
                }
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
        }


    }
</script>

<style scoped>

</style>

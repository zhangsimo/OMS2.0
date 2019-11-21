<template>
  <div style="height: 300px;overflow: hidden;overflow-y: scroll">
    <Form :model="data" :label-width="150">
      <FormItem label='调整日期:' >
        <span>{{ date }}</span>
      </FormItem>
      <FormItem label='客户名称:' >
        <span>{{data.fullName}}</span>
      </FormItem>
      <FormItem label='调整时应付:' >
        <Input v-model='dataMsg.payableAmt' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='调整时应收:' >
        <Input v-model='dataMsg.receivableAmt' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='调整时应收应付合计:' >
        <Input v-model='dataMsg.sumAmt' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='应收30天金额:' >
        <Input v-model='dataMsg.thirtyAmt' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='应收30-60天:' >
        <Input v-model='dataMsg.sixtyAmt' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='应收60天以上:' >
        <Input v-model='dataMsg.moreSixtyAmt' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='客户当前额度:' >
        <Input v-model='+data.creditLimit + data.tempCreditLimit' style="width: 180px" disabled></Input>
      </FormItem>
      <FormItem label='调整后额度:'>
        <Input v-model='data.fixationQuotaTotal' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='是否禁止额度调整申请:' >
        <Checkbox v-model="data.isForbid"></Checkbox>是
      </FormItem>
      <FormItem label='额度调整/清零原因:' >
        <Input v-model='data.quotaReason' style="width: 180px" ></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
    export default {
        name: "QuotaAdjustment",
        props:{
            data:'',
          dataMsg:''
        },
      data(){
          return {
            date: ''
          }
      },
     mounted(){
       const ToDayStr = () => {
         var returnStr = '';
         var date = new Date();      //当前时间
         var year = date.getFullYear();
         var month = date.getMonth() + 1;
         var day = date.getDate();
         //var hour = date.getHours();
         //var minutes = date.getMinutes();
         //var second = date.getSeconds();
         month = month < 10 ? "0" + month : month;
         day = day < 10 ? "0" + day : day;
         returnStr = year + "年" + month + "月" + day + "日"
         return returnStr;
       }
       this.date = ToDayStr()
     }
    }
</script>

<style scoped>

</style>

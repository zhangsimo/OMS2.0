<template>
  <div style="height: 300px;overflow: hidden;overflow-y: scroll">
    <Form :model="data" :label-width="150">
      <FormItem label='调整日期:' >
        <span>2019</span>
      </FormItem>
      <FormItem label='客户名称:' >
        <span>汽修店</span>
      </FormItem>
      <FormItem label='调整时应付:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='调整时应收:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='调整时应收应付合计:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='应收30天金额:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='应收30-60天:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='客户当前额度:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='调整后额度:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
      <FormItem label='是否禁止额度调整申请:' >
        <Checkbox v-model="data.isSupplier"></Checkbox>是
      </FormItem>
      <FormItem label='额度调整/清零原因:' >
        <Input v-model='data.contactor' style="width: 180px" ></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
    export default {
        name: "QuotaAdjustment",
        props:{
            data:''
        }
    }
</script>

<style scoped>

</style>

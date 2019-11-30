<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
   >
    <div>
      <Form ref="formInline" :model="data" :label-width="100">
        <FormItem label="创建日期:">
          <DatePicker type="daterange" placement="bottom" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="提交日期:">
          <DatePicker type="daterange" placement="bottom" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <Select v-model="model11" filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default' @click="addressShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "MoreQuery",
        data(){
            return {
                moreQueryShow: true
            }
        }
    }
</script>

<style scoped>

</style>

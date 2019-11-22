<template>
    <div style="height: 100%;">
      <Form inline :show-message="false" ref="formPlan" :model="formPlan" :rules="rulePlan" :label-width="100">
      <div class="pane-made-hd">
        <span class="titler mr5">固定额度:</span>
        <span class="titler mr10">{{ 31231 |priceFilters}}</span>
        <span class="titler mr5">临时余额:</span>
        <span class="titler mr10">{{ 31231 |priceFilters}}</span>
        <span class="titler mr5">可用余额:</span>
        <span class="titler mr5">{{ 31231 |priceFilters}}</span>
      </div>
      <div class="clearfix purchase" ref="planForm">
        <Row>
          <Col span="9">
            <FormItem label="客户：" >
              <Input class="w180" v-model="formPlan.planDate"></Input>
              <Button  class="ml5" size="small" type="default"><Icon type="md-checkmark" /></Button>
              <Button  class="ml5" size="small" type="default"><Icon type="md-close" /></Button>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="销售员：" >
              <Input class="w160" v-model="formPlan.planDate"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="订单类型：" >
              <Input class="w160" v-model="formPlan.planDate"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="往来单号：" >
              <Input class="w160" v-model="formPlan.planDate"></Input>
            </FormItem>
          </Col>
        </Row>



      </div>
      </Form>
    </div>
</template>

<script>

    export default {
        name: "OrderRight",
        data(){
            return {
                formPlan:{}
            }
        }
    }
</script>

<style scoped lang="less">
.purchase {
padding-top: 10px;
}
  .pane-made-hd{
    line-height: 30px;
    border-bottom:1px #e8eaec solid;
    background-color: #f8f8f8;
    padding-left: 15px

  }

</style>

<template>
  <section
      class="title-box"
      style="border-bottom: 1px rgba(204, 204, 204, 1) solid ;border-top: 1px rgba(204, 204, 204, 1) solid"
    >
      <div
        style="width: 100%;height: 30px;background-color: rgba(215, 235, 249, 1);border-bottom: 1px rgba(204, 204, 204, 1) solid ;margin-bottom: 15px"
      ></div>
      <Form ref="formInline" :model="formInline" :label-width="100" label-position="right">
        <Row>
          <Col span="6">
            <FormItem label="昨日余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本日收款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本日付款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本日余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="本期期初余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本期累计收款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本期累计付款:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="本期期末余额:">
              <Input style="width: 50%" type="text" disabled />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
</template>
<script>
export default {
  data(){
    return {
      formInline:{}
    }
  }
}
</script>
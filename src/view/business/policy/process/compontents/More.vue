<template>
    <div class="navbox">
      <Row class="mt15">
        <Col span="12">
          <span class="w40">创建日期：</span>
          <DatePicker type="date" @on-change="establish" style="width: 180px"></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">至：</span>
          <DatePicker type="date" @on-change="establish" style="width: 180px"></DatePicker>
        </Col>
      </Row>
      <Row class="mt15">
        <Col span="12">
          <span class="w40">提交日期：</span>
          <DatePicker type="date" @on-change="submit" style="width: 180px"></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">至：</span>
          <DatePicker type="date" @on-change="submit" style="width: 180px"></DatePicker>
        </Col>
      </Row>
      <row class="mt15">
        <span class="ml5">成品编码：</span>
        <Input v-model="callout" style="width: 400px" />
      </row>
      <row class="mt15">
        <span>半成品编码：</span>
        <Input v-model="numbers" style="width: 350px" />
      </row>
      <row class="mt15">
        <span>单号：</span>
        <Input v-model="coding" style="width: 400px" />
      </row>
    </div>
</template>

<script>
    export default {
        name: "More",
      data(){
          return {
            callout: '', //成品编码
            numbers: '', //半成品编码
            coding: '', //单号
            Name: '', //配件名称
          }
      },
      methods: {
          //选择创建日期
        establish(date){
          console.log(date)
        },
        //选择提交日期
        submit(date){
          console.log(date)
        }
      }
    }
</script>
<style scoped>
  .navbox{
    padding: 20px;
  }
</style>


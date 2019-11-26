<template>
    <div class="navbox">
      <Row>
        <Col span="12">
          <span class="w40">创建日期：</span>
          <DatePicker type="daterange" placeholder="请选择创建日期！"  @on-change="establish" style="width: 180px"></DatePicker>
        </Col>
        <Col span="12">
          <span class="w40">提交日期：</span>
          <DatePicker type="daterange" placeholder="请选择提交日期！" @on-change="submit" style="width: 180px"></DatePicker>
        </Col>
      </Row>
      <row class="mt15">
        <span class="ml5">调 出 方：</span>
        <Input v-model="callout" icon="ios-clock-outline" placeholder="请选择调出方！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>申请单号：</span>
        <Input v-model="numbers" placeholder="请输入申请单号！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件编码：</span>
        <Input v-model="coding" placeholder="请输入配件编码！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span class="ml5">配 件 人：</span>
        <Input v-model="Accessories" placeholder="请输入配件人！" style="width: 450px" />
      </row>
      <row class="mt15">
        <span>配件名称：</span>
        <Input v-model="Name" placeholder="请输入配件名称" style="width: 450px" />
      </row>
    </div>
</template>

<script>
    export default {
        name: "More",
      data(){
          return {
            callout: '', //调出方
            numbers: '', //申请单号
            coding: '', //编码
            Accessories: '', //配件人
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

<style scoped>

</style>

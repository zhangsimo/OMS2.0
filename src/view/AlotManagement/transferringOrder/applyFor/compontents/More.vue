<template>
    <div>
      <Modal title="高级查询" width="600px" v-model="moreAndMore">
        <div class="navbox">
          <Row>
            <Col span="12">
              <span class="w40">创建日期：</span>
              <DatePicker type="daterange" placeholder="请选择创建日期！"  @on-change="establish" style="width: 180px" v-model="create"></DatePicker>
            </Col>
            <Col span="12">
              <span class="w40">提交日期：</span>
              <DatePicker type="daterange" placeholder="请选择提交日期！" @on-change="submit" style="width: 180px" v-model="submita"></DatePicker>
            </Col>
          </Row>
          <Row class="mt15">
            <span class="ml5">调 出 方：</span>
            <Input v-model="callout" placeholder="请选择调出方" style="width: 410px" disabled/>
            <Button class="ml5" size="small" type="default" @click="addSuppler"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button>
          </Row>
          <Row class="mt15">
            <span>申请单号：</span>
            <Input v-model="numbers" placeholder="请输入申请单号" style="width: 450px" />
          </Row>
          <Row class="mt15">
            <span>配件编码：</span>
            <Input v-model="coding" placeholder="请输入配件编码" style="width: 450px" />
          </Row>
          <Row class="mt15">
            <span class="ml5">创 建 人：</span>
            <Input v-model="Accessories" placeholder="请输入创建人" style="width: 450px" />
          </Row>
          <Row class="mt15">
            <span>配件名称：</span>
            <Input v-model="Name" placeholder="请输入配件名称" style="width: 450px" />
          </Row>
        </div>
        <div slot='footer'>
          <Button type='primary' @click="Determined">确定</Button>
          <Button type='default' >取消</Button>
        </div>
      </Modal>

      <select-supplier ref="selectSupplier" header-tit="供应商资料" @selectSupplierName="getSupplierNamea" ></select-supplier>
    </div>
</template>

<script>
  import SelectSupplier from "../../../../goods/goodsList/components/supplier/selectSupplier";
    export default {
        name: "More",
      components: {
        SelectSupplier
      },
      data(){
          return {
            callout: '', //调出方
            numbers: '', //申请单号
            coding: '', //编码
            Accessories: '', //配件人
            Name: '', //配件名称
            createData: '', //创建日期
            submitData: '', //提交日期
            moreAndMore: false,
            submita: '',
            create: '',
            guestId: ''
          }
      },
      methods: {
          //选择创建日期
        establish(date){
          this.createData = date
        },
        //选择提交日期
        submit(date){
          this.submitData = date
        },
        getSupplierNamea(a) {
          this.callout = a.fullName
          this.guestId = a.id
        },
        init(){
          this.moreAndMore = true
        },
        sendMsg(){
            let a = { callout: this.callout , numbers: this.numbers ,coding: this.coding, Accessories: this.Accessories,Name: this.Name,createData: this.createData,submitData:this.submitData,guestId:this.guestId}
            this.$emit('sendMsg', a)
        },
        //更多弹框的确定按钮
        Determined(){
          this.sendMsg()
          this.moreAndMore = false
          this.callout =  ''
          this.numbers = ''
          this.coding = ''
          this.Accessories = ''
          this.Name = ''
          this.create = ''
          this.submita = ''
        },
        //供应商弹框
        addSuppler(){
          this.$refs.selectSupplier.init()
        },
      }

    }
</script>
<style scoped>
  .navbox{
    padding: 20px;
  }
</style>


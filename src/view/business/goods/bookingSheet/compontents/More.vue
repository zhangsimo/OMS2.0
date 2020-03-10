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
            <span class="ml5">业 务 员：</span>
            <!--<Input v-model="callout" placeholder="请选择业务员" style="width: 410px" disabled/>-->
            <!--<Button class="ml5" size="small" type="default" @click="addSuppler"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button>-->
            <Select v-model="callout" filterable style="width: 450px">
              <Option v-for="item in cityList" :value="item.userName" :key="item.userName">{{ item.userName }}</Option>
            </Select>
          </Row>
          <Row class="mt15">
            <span>预定单号：</span>
            <Input v-model="numbers" placeholder="请输入预定单号" style="width: 450px" />
          </Row>
          <Row class="mt15">
            <span>配件编码：</span>
            <Input v-model="coding" placeholder="请输入配件编码" style="width: 450px" />
          </Row>
          <Row class="mt15">
            <span>配件名称：</span>
            <Input v-model="Name" placeholder="请输入配件名称" style="width: 450px" />
          </Row>
          <Row class="mt15">
            <span style="margin-left: 23px">品 &nbsp;牌：</span>
            <!--<Input v-model="brand" placeholder="请输入品牌" style="width: 450px" />-->
            <Select v-model="brand" filterable clearable placeholder="选择品牌" style="width:450px" @on-change="changeBrand">
              <Option v-for="item in brandList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Row>
          <Row class="mt15">
            <span class="ml5">提 交 人：</span>
            <Input v-model="Accessories" placeholder="请输入提交人" style="width: 450px" />
          </Row>
        </div>
        <div slot='footer'>
          <Button type='primary' @click="Determined">确定</Button>
          <Button type='default' @click="cancel">取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import { queryAll } from '../../../../../api/business/advanceOrder';
  import { allBrand } from "@/api/business/brandListApi";
  import {
    getPartBrandNoWB
  } from "@/api/business/stockSearch";
  export default {
        name: "More",
      data(){
          return {
            brand: '', //品牌
            callout: '', //调出方
            numbers: '', //预定单号
            coding: '', //编码
            Accessories: '', //提交人
            Name: '', //配件名称
            createData: null, //创建日期
            submitData: null, //提交日期
            moreAndMore: false,
            submita: '',
            create: '',
            guestId: '',
            cityList: [],
            // 品牌选择数据
            brandList: [],
          }
      },
      methods: {
          //选择创建日期
        establish(date){
          this.createData = date
          console.log(this.createData)
        },
        //选择提交日期
        submit(date){
          this.submitData = date
        },
        init(){
          this.moreAndMore = true
        },
        sendMsg(){
            let a = {
              callout: this.callout,
              numbers: this.numbers,
              coding: this.coding,
              Accessories: this.Accessories,
              Name: this.Name,
              createData: this.createData,
              create: this.create,
              submitData:this.submitData,
              guestId:this.guestId,
              brand: this.brand,
              submita: this.submita
            }
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
          this.brand = ''
          this.createData = null
          this.submitData = null
        },
        //取消
        cancel(){
          this.moreAndMore = false
        },
        // 品牌下拉改变
        changeBrand(val){
          // console.log(val)
          this.brand = val
        },
        //获取品牌
        async getAllBrand() {

          let res = await getPartBrandNoWB({ pageSize: 10000 });
          if (res.code === 0) {
            let arr = [];
            for(let v in res.data){
              let obj = {}
              obj.code = v;
              obj.id = v;
              obj.name = res.data[v]
              arr.push(obj)
            }
            this.brandList = arr;
          }
        },
      },
    mounted(){
          let params = {}
      queryAll(params).then(res => {
        if(res.code === 0){
          this.cityList = res.data.content
        }
      });
      this.getAllBrand()
    }
    }
</script>
<style scoped>
  .navbox{
    padding: 20px;
  }
</style>


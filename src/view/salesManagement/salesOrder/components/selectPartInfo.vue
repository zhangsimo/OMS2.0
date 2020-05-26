<template>
  <Modal v-model="searchPartLayer" title="添加配件录入" width="700">
    <Form :model="formItem" :label-width="80">
      <Row>
        <Col span="12">
          <FormItem label="配件编码：">
            <Input disabled v-model="formItem.partCode" class="w200" placeholder="配件编码"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="配件名称：">
            <Input disabled v-model="formItem.partStandardName" class="w200" placeholder="配件名称"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="品质：">
            <Input disabled v-model="formItem.quality" class="w200" placeholder="品质"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="品牌：">
            <Input disabled v-model="formItem.partBrand" class="w200" placeholder="品牌"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="厂牌：">
            <Input disabled v-model="formItem.adapterCarBrand" class="w200" placeholder="厂牌"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="品牌车型：">
            <Input disabled v-model="formItem.adapterCarModel" class="w200" placeholder="品牌车型"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="数量：">
            <InputNumber :min="1" class="w200" placeholder="数量" v-model="formItem.orderQty"></InputNumber>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="单位：">
            <Input disabled v-model="formItem.minUnit" class="w200" placeholder="单位"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="单价：">
            <InputNumber :min="0" class="w200" placeholder="单价" v-model="formItem.orderPrice" :precision="2" ></InputNumber>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="金额：">
            <Input disabled v-model="(formItem.orderPrice*formItem.orderQty).toFixed(2)" class="w200" placeholder="金额"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot='footer'>
      <Button type="primary" @click="submit">确定</Button>
      <Button @click="searchPartLayer=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
	export default {
		name: "selectPartInfo",
    data(){
		  return {
        searchPartLayer:false,
        formItem: {},
        prevPrice: 0,
      }
    },
    methods:{
		  init(v){
		    if(v){
          this.searchPartLayer = true;
          this.formItem = v;
          this.formItem.orderPrice = v.orderPrice*1
          this.prevPrice = v.orderPrice*1;
        }

      },
      changePrice(v){
		    let vl = v.target.value;
        let reg = /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/;
		    if(reg.test(vl)){
          this.formItem.orderPrice = vl;
          this.prevPrice = vl;
        }else{
          this.$set(this.formItem,'orderPrice',this.prevPrice);
        }
        return this.prevPrice;
      },
      submit(){
		    this.searchPartLayer = false;
		    this.$parent.$parent.getPartNameList([this.formItem]);

      }
    }
	}
</script>

<style scoped>

</style>

<template>
  <Modal v-model="searchPartLayer" title="添加配件录入" width="700">
    <Form :model="formItemData" :label-width="80" @keyup.enter.native="submit">
      <Row>
        <Col span="12">
          <FormItem label="配件编码：">
            <Input disabled v-model="formItemData.partCode" class="w200" placeholder="配件编码"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="配件名称：" v-if="$route.name=='OutsidePurchase' ||　$route.name=='goodsList' || $route.name=='TemporaryPurchase'">
            <Input disabled v-model="formItemData.fullName" class="w200" placeholder="配件名称"></Input>
          </FormItem>
          <FormItem label="配件名称：" v-else>
            <Input disabled v-model="formItemData.partStandardName" class="w200" placeholder="配件名称"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="品质：">
            <Input disabled v-model="formItemData.quality" class="w200" placeholder="品质"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="品牌：">
            <Input disabled v-model="formItemData.partBrand" class="w200" placeholder="品牌"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="厂牌：" v-if="$route.name=='OutsidePurchase' ||　$route.name=='goodsList' || $route.name=='TemporaryPurchase'">
            <Input disabled v-model="formItemData.carBrandName" class="w200" placeholder="厂牌"></Input>
          </FormItem>
          <FormItem label="厂牌：" v-else>
            <Input disabled v-model="formItemData.adapterCarBrand" class="w200" placeholder="厂牌"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="品牌车型：" v-if="$route.name=='OutsidePurchase' ||　$route.name=='goodsList' || $route.name=='TemporaryPurchase'">
            <Input disabled v-model="formItemData.carModelName" class="w200" placeholder="品牌车型"></Input>
          </FormItem>
          <FormItem label="品牌车型：" v-else>
            <Input disabled v-model="formItemData.adapterCarModel" class="w200" placeholder="品牌车型"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="数量：">
            <!--<InputNumber autofocus ref="orderQty" :min="0" class="w200" :precision="0" placeholder="数量" v-model="formItemData.orderQty"></InputNumber>-->
            <vxe-input type="number" ref="orderQty" placeholder="数量" class="w200" size="mini"  v-model="formItemData.orderQty" :min="0" digits="0"></vxe-input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="单位：" v-if="$route.name=='OutsidePurchase' ||　$route.name=='goodsList' || $route.name=='TemporaryPurchase'">
            <Input disabled v-model="formItemData.unit" class="w200" placeholder="单位"></Input>
          </FormItem>
          <FormItem label="单位：" v-else>
            <Input disabled v-model="formItemData.minUnit" class="w200" placeholder="单位"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="单价：" v-if="$route.name!='bookingSheet'">
            <!--<InputNumber :min="0" class="w200" placeholder="单价" v-model="formItemData.orderPrice" @on-focus="changeFocuse" @on-blur="changeblur" ></InputNumber>-->
            <vxe-input type="float" class="w200" size="mini"  v-model="formItemData.orderPrice" :min="0" digits="2"></vxe-input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="金额：" v-if="$route.name!='bookingSheet'">
            <Input disabled v-model="total" class="w200" placeholder="金额"></Input>
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
        formItemData: {},
      }
    },
    computed: {
      total() {
        let orderPrice = this.formItemData.orderPrice || 0;
        let qty = this.formItemData.orderQty || 0;
        return (orderPrice * qty).toFixed(2);
      }
    },
    methods:{
		  init(v){
		    // console.log(v)
		    if(v){
          this.searchPartLayer = true;
          this.formItemData = {...v};
          this.formItemData.orderQty = undefined;
          this.formItemData.orderPrice = v.orderPrice * 1===0?undefined:(v.orderPrice * 1).toFixed(2);
          this.$nextTick(()=>{
            this.$refs['orderQty'].focus();
            //this.enterKeyup();
          })
        }

      },
      changeFocuse(v){
        let vl = v.target.value;
        if(vl==0){
          this.formItemData.orderPrice = null;
        }
      },
      changeblur(){
		    if(this.formItemData.orderPrice&&this.formItemData.orderPrice>0){
          this.formItemData.orderPrice = this.formItemData.orderPrice.toFixed(2);
        }else{
          this.formItemData.orderPrice = 0;
        }
      },

      submit(){
        if(!this.formItemData.orderQty || this.formItemData.orderQty <= 0) {
          return this.$Message.error("数量不能为空");
        }
        if(!this.formItemData.orderPrice || this.formItemData.orderPrice < 0) {
          return this.$Message.error("单价不可为空");
        }
		    this.searchPartLayer = false;
		    //this.$parent.$parent.getPartNameList2([this.formItemData]);
		    this.$emit("throwData",[this.formItemData])
      },
    }
	}
</script>

<style scoped>

</style>

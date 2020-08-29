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
          <FormItem label="配件名称：">
            <Input disabled v-model="formItemData.partStandardName" class="w200" placeholder="配件名称"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="品质：">
            <Input disabled v-model="formItemData.qualityCode" class="w200" placeholder="品质"></Input>
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
          <FormItem label="厂牌：">
            <Input disabled v-model="formItemData.adapterCarBrand" class="w200" placeholder="厂牌"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="品牌车型：">
            <Input disabled v-model="formItemData.adapterCarModel" class="w200" placeholder="品牌车型"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="数量：">
            <!--<InputNumber autofocus @on-focus="changeNum" :min="0" class="w200" :precision="0" placeholder="数量" v-model="formItemData.orderQty"></InputNumber>-->
            <vxe-input type="number" ref="orderQty" placeholder="数量" class="w200" size="mini"  v-model="formItemData.orderQty" :min="0" digits="0"></vxe-input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="单位：">
            <Input disabled v-model="formItemData.minUnit" class="w200" placeholder="单位"></Input>
          </FormItem>
        </Col>
      </Row>
      <!--<Row>-->
        <!--<Col span="12">-->
          <!--<FormItem label="单价：">-->
            <!--<InputNumber :min="0" class="w200" placeholder="单价" v-model="formItemData.orderPrice" precision="2" ></InputNumber>-->
          <!--</FormItem>-->
        <!--</Col>-->
        <!--<Col span="12">-->
          <!--<FormItem label="金额：">-->
            <!--<Input disabled v-model="(formItemData.orderPrice*formItemData.orderQty).toFixed(2)" class="w200" placeholder="金额"></Input>-->
          <!--</FormItem>-->
        <!--</Col>-->
      <!--</Row>-->
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
        prevPrice: 0,
      }
    },
    methods:{
		  init(v){
		    if(v){
          this.searchPartLayer = true;
          v.orderQty = undefined;
          this.formItemData = {...v};
          this.$nextTick(()=>{
            this.$refs.orderQty.focus();
          })
        }

      },
      changePrice(v){
		    let vl = v.target.value;
        let reg = /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/;
		    if(reg.test(vl)){
          this.formItemData.orderPrice = vl;
          this.prevPrice = vl;
        }else{
          this.$set(this.formItemData,'orderPrice',this.prevPrice);
        }
        return this.prevPrice;
      },
      submit(){
		    if(this.formItemData.orderQty>0){
          this.searchPartLayer = false;
          // this.$parent.$parent.getPartNameList2([this.formItemData]);
          this.$emit("throwData2",[this.formItemData])
          if(this.$refs['orderQty']){
            this.$refs['orderQty'].blur();
          }
        }else{
		      setTimeout(() => {
            this.$message.error("数量请输入大于0的正整数")
          },50);

        }


      },
      changeNum(e){
		    if(e.target.value==0){
          this.formItemData.orderQty = null;
        }
      }
    }
	}
</script>

<style scoped>

</style>

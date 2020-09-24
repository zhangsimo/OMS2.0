<template>
  <Form ref="form" :label-width="100" :model="data" class="clearfix" :rules="rules">
    <FormItem label="收货单位:" prop="receiveCompName">
      <Input v-model="data.receiveCompName" style="width: 380px"/>
    </FormItem>
    <div style="display: flex">
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="收货人:" prop="receiveMan">
          <Input v-model="data.receiveMan" style="width: 180px"/>
        </FormItem>
        <FormItem label="省份:" prop="provinceId">
          <Select
            v-model="data.provinceId"
            filterable
            style="width:180px"
            class="mr10"
            @on-change="provinceName"
          >
            <Option
              v-for="item in place"
              v-if="item.parentId==0"
              :key="item.id"
              :value="item.id"
            >{{ item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="地区:" prop="countyId">
          <Select v-model="data.countyId" style="width:180px" class="mr10" @on-change="countyName">
            <Option
              v-for="item in place"
              v-if="data.cityId==item.parentId"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </div>
      <div style="flex-flow: row nowrap;width: 100%">
        <FormItem label="联系方式:" prop="receiveManTel">
          <Input v-model="data.receiveManTel" style="width: 180px"/>
        </FormItem>
        <FormItem label="城市:" prop="cityId">
          <Select v-model="data.cityId" filterable style="width:180px" class="mr10" @on-change="cityName">
            <Option
              v-for="item in place"
              v-if="data.provinceId==item.parentId"
              :key="item.id"
              :value="item.id"
            >{{ item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="街道:" prop="streetAddress">
          <Input v-model="data.streetAddress" style="width: 180px" @input="streetName"/>
        </FormItem>
      </div>
    </div>
    <FormItem label="详细地址:">
      <Input v-model="address" style="width: 400px" disabled/>
    </FormItem>
    <FormItem label="备注:" style="float: left">
      <Input v-model="data.remark" style="width: 330px"/>
    </FormItem>
    <div style="float: left;line-height: 30px;padding-left: 10px">
      <Checkbox v-model="data.isDefault"></Checkbox>
      是否默认
    </div>
  </Form>
</template>

<script>
  export default {
    name: "Newplace",
    props: {
      data: "",
      place: ""
    },
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空"));
        } else if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      };
      return {
        list: [],
        rules: {
          provinceId: [
            {required: true, message: "不能为空 ", trigger: "change"}
          ],
          cityId: [{required: true, message: "不能为空 ", trigger: "change"}],
          receiveMan: [{required: true, message: "不能为空 ", trigger: "blur"}],
          receiveCompName: [
            {required: true, message: "不能为空", trigger: "blur"}
          ],
          receiveManTel: [
            {required: true, validator: validatePhone, trigger: "blur"}
          ],
          streetAddress: [
            {required: true, message: "不能为空", trigger: "blur"}
          ],
          countyId: [{required: true, message: "地区不可为空", trigger: "blur"}]
        }
      };
    },
    computed: {
      address() {
        let one = "", two = "", three = ""
        let four = this.data.streetAddress||"";
        this.place.map(item => {
          if (item.id === this.data.provinceId && item.id != undefined) {
            one = item.name;
          }
          if (item.id === this.data.countyId && item.id != undefined) {
            two = item.name;
          }
          if (item.id === this.data.cityId && item.id != undefined) {
            three = item.name;
          }
          if (one != "" && two != "" && three != "") {
            return
          }
        });
        return (this.data.address = one + three + two + four || "");
      }
    },
    methods: {
      //清除内容
      resetFields() {
        this.$refs.form.resetFields();
      },
      //校验表单
      handleSubmit(callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            callback && callback();
          } else {
            this.$Message.error("带*为必填");
          }
        });
      },
      // 选择省份
      provinceName() {
        this.place.map(item => {
          if (item.id === this.data.provinceId) {
            this.data.address = item.name;
          }
        });
      },
      // 选择地区
      countyName() {
        this.place.map(item => {
          if (item.id === this.data.countyId) {
            this.data.address += item.name;
          }
        });
      },
      // 选择城市
      cityName() {
        this.place.map(item => {
          if (item.id === this.data.cityId) {
            this.data.address += item.name;
          }
        });
      },
      streetName(value) {
        this.data.address = "";
        this.provinceName();
        this.cityName();
        this.countyName();
        this.data.address += value;
      }
    }
  };
</script>

<style scoped>
</style>

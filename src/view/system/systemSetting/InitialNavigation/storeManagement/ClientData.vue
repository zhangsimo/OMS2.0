<template>
  <div style="height: 500px;overflow:hidden;overflow-y: scroll">
    <Form :label-width="100" :model="data" :rules="rules" ref="form">
      <div class="tabList">
        <FormItem label="LOGO图片:">
          <Upload
            v-model="data.file"
            ref="upload"
            :show-upload-list="false"
            :action="wxImgUrl"
            :format="['jpg','jpeg','png', 'gif']"
            :headers="headers"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
          >
            <div class="upwarp" style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="md-image" size="24" color="#dfdfdf" v-if="!uploadSrc" />
              <img
                class="wechatimg"
                width="56px"
                height="56px"
                :src="uploadSrc"
                alt="LOGO图片"
                v-else
              />
            </div>
          </Upload>
        </FormItem>
        <FormItem label="企业号:" prop="firm">
          <Input v-model="data.firm" style="width: 580px" />
        </FormItem>
        <Row>
          <Col span="16">
            <FormItem label="公司全称:" prop="name">
              <Input v-model="data.name" style="width: 440px" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="公司简称:" prop="shortName">
              <Input v-model="data.shortName" style="width: 180px" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="省份:" prop="provinceId">
              <Select
                v-model="data.provinceId"
                style="width:180px"
                class="mr10"
                label-in-value
                @on-change="selectProvinceId"
              >
                <Option
                  v-for="item in provincearr"
                  v-if="item.parentId==0"
                  :key="item.id"
                  :value="item.id"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="城市:" prop="cityId">
              <Select
                v-model="data.cityId"
                style="width:180px"
                class="mr10"
                label-in-value
                @on-change="selectCityId"
              >
                <Option
                  v-for="item in provincearr"
                  v-if="data.provinceId==item.parentId"
                  :key="item.id"
                  :value="item.id"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="地区:" prop="countyId">
              <Select
                v-model="data.countyId"
                style="width:180px"
                class="mr10"
                label-in-value
                @on-change="selectCountyId"
              >
                <Option
                  v-for="item in provincearr"
                  v-if="data.cityId==item.parentId"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="详细地址:" prop="streetAddress">
          <Input v-model="data.streetAddress" style="width: 580px" @on-blur="getAddress" />
        </FormItem>
        <FormItem label="组合地址:">
          <Input v-model="getZuheAddress" style="width: 580px" disabled />
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="经度:">
              <Input v-model="data.longitude" style="width: 280px" disabled />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="纬度:">
              <Input v-model="data.latitude" style="width: 280px" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开户银行:">
              <Input v-model="data.bankName" style="width: 280px" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="银行账号:" prop="bankAccountNumber">
              <Input v-model="data.bankAccountNumber" style="width: 280px" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开店日期:" prop="softOpenDate">
              <DatePicker
                v-model="data.softOpenDate"
                type="date"
                placeholder="请选择日期"
                style="width: 280px"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="公司电话:" prop="tel">
              <Input v-model="data.tel" style="width: 280px" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="网站:">
          <Input v-model="data.webaddress" style="width: 580px" />
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="一级分类:" prop="supplierTypeFirst">
              <Select v-model="data.supplierTypeFirst" style="width:180px" class="mr10">
                <Option
                  v-for="item in treelist"
                  v-if="item.parentId == 0"
                  :value="item.id"
                  :key="item.code"
                >{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="二级分类:" prop="supplierTypeSecond">
              <Select v-model="data.supplierTypeSecond" style="width:180px" class="mr10">
                <Option
                  v-for="item in treelist "
                  v-if="data.supplierTypeFirst == item.parentId"
                  :value="item.id"
                  :key="item.id"
                >{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="主修品牌:">
          <Input v-model="data.mainBrandId" style="width: 580px" />
        </FormItem>
        <FormItem label="救援电话:">
          <Input v-model="data.rescueTel" style="width: 580px" />
        </FormItem>
        <FormItem label="广告语:">
          <Input v-model="data.slogan1" style="width: 580px" />
        </FormItem>
        <FormItem label="备注:">
          <Input v-model="data.remark" style="width: 580px" />
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script>
import * as api from "_api/lease/customerSM";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/libs/util";
export default {
  name: "Data",
  components: {},
  props: {
    data: "",
    provincearr: "",
    treelist: ""
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    const validateUpload = (rule, value, callback) => {
      if (this.data.file && this.data.file.length == 0) {
        callback(new Error("请选择要上传的文件"));
      } else {
        callback();
      }
    };
    const valiiBank = (rule, value, callback) => {
      const regExp = /^\d{1,}$/;
      if(!value) {
        callback();
      } else if (!regExp.test(value)) {
        callback(new Error("银行账户填写错误"));
      } else {
        callback();
      }
    };
    return {
      wxImgUrl: api.wxImgUrl, //图片地址
      headers: {
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }, //获取token
      visible: false,
      clientDisable: true,
      rules: {
        bankAccountNumber: [{required: false, validator: valiiBank, trigger: "blur" }],
        firm: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        shortName: [{ required: true, message: "不能为空", trigger: "change" }],
        provinceId: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        cityId: [{ required: true, message: "不能为空", trigger: "change" }],
        countyId: [{ required: true, message: "不能为空", trigger: "change" }],
        streetAddress: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        supplierTypeFirst: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        softOpenDate: [
          {
            required: true,
            type: "date",
            message: "不能为空",
            trigger: "change"
          }
        ],
        supplierTypeSecond: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        tel: [{ required: true, message: "不能为空", trigger: "blur" }],
        file: [{ required: true, validator: validateUpload, trigger: "change" }]
      },
      uploadSrc: `dataPic`,
      province: "", //省份
      city: "", //城市
      county: "", //地区
      address: "" //详细地址
    };
  },
  computed:{
    //组合地址 = 省份 + 城市 + 地区 + 详细地址
    getZuheAddress(){
      let pro=this.data.province?this.data.province:this.province;
      let city=this.data.city?this.data.city:this.city;
      let county=this.data.district?this.data.district:this.county;
      let address=this.data.streetAddress?this.data.streetAddress:this.address
      return (this.data.address=pro+city+county+address)
    }
  },
  methods: {
    valuePic() {
      this.$nextTick(() => {
        // console.log(this.data.logoImg, "this.data.logoImg =>268");
        this.uploadSrc = this.data.logoImg;
      });
    },
    addPicture() {
      this.$nextTick(() => {
        // console.log(this.data.logoImg, "this.data.logoImg =>274");
        this.uploadSrc = "";
      });
    },
    // 上传前
    handleBeforeUpload() {
      this.$refs.upload.clearFiles();
    },
    // 上传成功
    handleSuccess(res, file) {
      if (res.code == 0) {
        this.uploadSrc = api.getfile + res.data.url;
        this.data.logoImg = api.getfile + res.data.url;
      }
    },
    //清除内容
    resetFields() {
      this.$refs.form.resetFields();
      this.uploadSrc = "";
      this.province='';
      this.city='';
      this.county='';
      this.address='';
    },
    //校验表单
    handleSubmit(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          callback && callback();
        } else {
          this.$Message.error("信息填写错误");
        }
      });
    },
    //获取选择的省份
    selectProvinceId(item) {
      this.province = item.label;
      this.data.province=this.province
      this.getAllAddress();
    },
    //获取选择的城市
    selectCityId(item) {
      this.city = item.label;
      this.data.city=this.city
      this.getAllAddress();
    },
    //获取地区
    selectCountyId(item) {
      this.county = item.label;
      this.data.district=this.county
      this.getAllAddress();
    },
    //获取详细地址
    getAddress() {
      if (this.data.streetAddress) {
        this.address = this.data.streetAddress.trim();
        this.data.streetAddress=this.address
        this.getAllAddress();
      }
    },
    //获取全部地址拼接
    getAllAddress() {
      if (this.province && this.city && this.county && this.address) {
        let that = this;
        this.$nextTick(async () => {
          this.$set(
            this.data,
            "address",
            this.province + this.city + this.county + this.address
          );
          this.ajaxAll
            .get(
              `https://restapi.amap.com/v3/geocode/geo?address=${JSON.stringify(
                this.data.address
              )}&output=json&key=53a2d993424e4c74fc40e8038698af67`
            )
            .then(function(response) {
              if (response.data.infocode == 10000) {
                let arr = response.data.geocodes[0].location;
                arr = arr.split(",");
                that.$set(that.data, "longitude", arr[0]);
                that.$set(that.data, "latitude", arr[1]);
              }
            })
            .catch(function(error) {
              this.$message.error("经纬度查询失败");
            });
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.isDisabeld {
  float: right;
}
.place {
  line-height: 40px;
  padding-left: 10px;
  border: 1px solid #eee;
}
.staff-name {
  width: 200px;
}
.upwarp {
  border-radius: 10px;
  border: dashed 1px #dfdfdf;
  text-align: center;
  cursor: pointer;
  object-fit: contain;
}
.wechatimg {
  display: inline-block;
  font-size: 10px;
  text-align: center;
}
</style>

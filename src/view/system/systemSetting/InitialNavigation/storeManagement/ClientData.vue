<template>
  <div style="height: 500px;overflow:hidden;overflow-y: scroll">
 <Form :label-width="80"  :model='data' :rules="rules" ref="form">
   <div class="tabList">
             <FormItem label='LOGO图片:'  >
               <div class="demo-upload-list" v-for="item in uploadList">
                 <template v-if="item.status === 'finished'">
                   <img :src="item.url">
                   <div class="demo-upload-list-cover">
                     <Icon type="ios-eye-outline" @click="handleView(item.name)"></Icon>
                     <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                   </div>
                 </template>
                 <template v-else>
                   <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                 </template>
               </div>
               <Upload
                 v-ref:upload
                 :show-upload-list="false"
                 :default-file-list="defaultList"
                 :on-success="handleSuccess"
                 :format="['jpg','jpeg','png']"
                 :max-size="2048"
                 :on-format-error="handleFormatError"
                 :on-exceeded-size="handleMaxSize"
                 :before-upload="handleBeforeUpload"
                 multiple
                 type="drag"
                 action="//jsonplaceholder.typicode.com/posts/"
                 style="display: inline-block;width:58px;">
                 <div style="width: 58px;height:58px;line-height: 58px;">
                   <img src="../../../../../assets/images/upImg.svg" width="58">
                 </div>
               </Upload>
               <Modal title="查看图片" :visible.sync="visible">
                 <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
               </Modal>
             </FormItem>
         <FormItem label='企业号:' prop="firm">
           <Input v-model='data.firm' style="width: 580px" ></Input>
         </FormItem>
     <Row>
       <Col span="16">
         <FormItem label='公司全称:' prop="name">
           <Input v-model='data.name' style="width: 440px" ></Input>
         </FormItem>
       </Col>
       <Col span="8">
         <FormItem label='公司简称:' prop="shortName">
           <Input v-model='data.shortName' style="width: 180px" ></Input>
         </FormItem>
       </Col>
     </Row>
     <Row>
       <Col span="8">
         <FormItem label='省份:' prop="provinceId">
           <Select v-model="data.provinceId" style="width:180px" class="mr10">
             <Option v-for="item in provincearr" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
           </Select>
         </FormItem>
       </Col>
       <Col span="8">
         <FormItem label='城市:' prop="cityId">
           <Select v-model="data.cityId" style="width:180px" class="mr10">
             <Option v-for="item in provincearr" v-if="data.provinceId==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
           </Select>
         </FormItem>
       </Col>
       <Col span="8">
         <FormItem label='地区:' prop="countyId">
           <Select v-model="data.countyId" style="width:180px" class="mr10">
             <Option v-for="item in provincearr"  v-if="data.cityId==item.parentId" :value="item.id" :key="item.id">{{ item.name }}</Option>
           </Select>
         </FormItem>
       </Col>
     </Row>
     <FormItem label='详细地址:' prop="streetAddress">
       <Input v-model='data.streetAddress' style="width: 580px" ></Input>
     </FormItem>
     <FormItem label='组合地址:'>
       <Input v-model='data.address' style="width: 580px" ></Input>
     </FormItem>
     <Row>
       <Col span="12">
         <FormItem label='经度:'>
           <Input v-model='data.longitude' style="width: 280px" ></Input>
         </FormItem>
       </Col>
       <Col span="12">
         <FormItem label='纬度:'>
           <Input v-model='data.latitude' style="width: 280px" ></Input>
         </FormItem>
       </Col>
     </Row>
     <Row>
       <Col span="12">
         <FormItem label='开户银行:'>
           <Input v-model='data.bankName' style="width: 280px" ></Input>
         </FormItem>
       </Col>
       <Col span="12">
         <FormItem label='银行账号:'>
           <Input v-model='data.bankAccountNumber' style="width: 280px" ></Input>
         </FormItem>
       </Col>
     </Row>
     <Row>
       <Col span="12">
         <FormItem label='开店日期:' prop="Time">
           <DatePicker   type="date" v-model="data.Time" @on-change="changeTime" placeholder="请选择日期"  style="width: 280px"></DatePicker>
         </FormItem>
       </Col>
       <Col span="12">
         <FormItem label='公司电话:' prop="tel">
           <Input v-model='data.tel' style="width: 280px" ></Input>
         </FormItem>
       </Col>
     </Row>
     <FormItem label='网站:'>
       <Input v-model='data.webaddress' style="width: 580px" ></Input>
     </FormItem>
         <Row>
           <Col span="12">
             <FormItem label='一级分类:' prop="supplierTypeFirst">
               <Select v-model="data.supplierTypeFirst" style="width:180px" class="mr10">
                 <Option v-for="item in treelist" v-if="item.lever == 1" :value="item.id" :key="item.code">{{ item.title }}</Option>
               </Select>
             </FormItem>
           </Col>
           <Col span="12">
             <FormItem label='二级分类:'prop="supplierTypeSecond">
               <Select v-model="data.supplierTypeSecond" style="width:180px" class="mr10">
                 <Option v-for="item in treelist "  v-if="data.supplierTypeFirst == item.pid" :value="item.id" :key="item.id">{{ item.title }}</Option>
               </Select>
             </FormItem>
           </Col>
         </Row>
     <FormItem label='主修品牌:'>
       <Input v-model='data.mainBrandId' style="width: 580px" ></Input>
     </FormItem>
     <FormItem label='救援电话:'>
       <Input v-model='data.rescueTel' style="width: 580px" ></Input>
     </FormItem>
     <FormItem label='广告语:'>
       <Input v-model='data.slogan1' style="width: 580px" ></Input>
     </FormItem>
     <FormItem label='备注:'>
       <Input v-model='data.remark' style="width: 580px" ></Input>
     </FormItem>
   </div>
 </Form>
  </div>
</template>

<script>

  export default {
        name: "Data",
        components:{
        },
        props:{
            data:'',
            provincearr:'',
            treelist:'',
        },
        data(){
            const validatePhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else if (!/^1[345789]\d{9}$/.test(value)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName: '',
                visible: false,
                clientDisable:true,
                rules:{
                    firm:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    name:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    shortName:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    provinceId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    cityId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    countyId:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    streetAddress:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    supplierTypeFirst:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    Time:[
                        {required: true,type: 'date', message: '不能为空', trigger: 'change'}
                    ],
                    supplierTypeSecond:[
                        {required: true, message: '不能为空', trigger: 'change'}
                    ],
                    tel:[
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],

                },
                uploadList:''
            }
        },
        created(){
          this.getList()
        },
        methods:{
            //清除内容
            resetFields() {
                this.$refs.form.resetFields()
            },
            //校验表单
            handleSubmit (callback) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        callback && callback()
                    } else {
                        this.$Message.error('信息填写错误');
                    }
                })
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            changeTime(data ,res){
                this.data.softOpenDate = data
            }
        }
    }
</script>

<style scoped lang="less">
.isDisabeld {
  float: right;
}
.place{
  line-height: 40px;
  padding-left: 10px;
  border: 1px solid #eee;
}
.staff-name {
  width: 200px;
}
</style>

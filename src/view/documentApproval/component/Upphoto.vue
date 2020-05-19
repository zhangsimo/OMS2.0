<template>
  <div>
  <div class="flex">
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <img :src="item" style="width: 58px;height:58px;line-height: 58px;" />
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
      </div>
    </div>
    <div class="flex" style="align-items: flex-end;">
      <span v-if="uploadListModal.length>5" class="mr5" @click="visible1=true" style="cursor: pointer;font-size:12px">查看全部</span>
    </div>
    <Upload
      ref="upload"
      type="drag"
      multiple
      :show-upload-list="false"
      :action="getfile"
      :max-size="1024"
      :format="['jpg','jpeg','png']"
      :on-exceeded-size="handleMaxSize"
      :headers="headers"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      v-if="status"
    >
      <div class="tc" style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
  </div>
    <p class="mt10">请上传凭证照片，支持格式 jpg、jpeg、gif、png; 最多50张每张图片不大于1MB</p>
  <Modal v-model="visible">
    <img :src="imgName " style="width: 100%" />
    <div slot="footer"></div>
  </Modal>
  <Modal v-model="visible1">
    <div class="demo-upload-list" v-for="(item,index) in uploadListModal" :key="index">
      <img :src="item" style="width: 58px;height:58px;line-height: 58px;" />
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
  </div>
</template>

<script>
  import Cookies from "js-cookie";
  import { TOKEN_KEY } from "@/libs/util";
  import * as api from "_api/lease/log.js";

  export default {
        name: "upphoto",
    props:{
          list:''
    },
    data(){
          return {
            visible: false, //图片弹框
            visible1:false,//查看全部弹框
            imgName: "", //看大图
            headers: {
              Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
            }, //获取token
            getfile: api.putImgUrl,
            uploadList: [],//5张图片
            uploadListModal:[],//全部图片
            status:true,//根据状态显示是否可以添加
          }
    },
    methods:{
      //图片查看
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },

      //图片删除
      handleRemove(index) {
        this.uploadList.splice(index, 1);
        this.uploadListModal.splice(index, 1);
      },

      //上传出错
      handleMaxSize(file) {
        this.$message.error("图片不能超过1M");
      },
      //上传前
      handleBeforeUpload() {
        const check = this.uploadListModal.length < 50;
        if (!check) {
          this.$Notice.warning({
            title: '最多上传50张图片'
          });
        }
        return check;
      },
      // 上传成功
      handleSuccess(res, file , fileList) {
        if (res.code == 0) {
          if (this.uploadListModal.length < 50) {
            if(this.uploadList.length<5){
              this.uploadList.push(api.getfile + res.data.url);
            }
            this.uploadListModal.push(api.getfile + res.data.url);
          } else {
            this.$message.error("只能上传50张图片");
          }
        }
      }
    },
    watch:{
      uploadListModal:{
        handler(val ,old){
          this.$emit('backUpImgList', {list: val})
        },
        deep:true
      },
      list:{
        handler(val , old){
          this.status = true
          if (val.billStatus == 1 || val.billStatus == 2 || val.billStatus == 3  ){
            this.status = false
          }
          if (val.voucherPictures.length < 5) {
            this.uploadList = val.voucherPictures
          }else {
            this.uploadList = val.voucherPictures.slice(0, 5)
            this.uploadListModal = val.voucherPictures
          }
        },
        deep:true
      }
    }

    }
</script>

<style scoped lang="less">
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

</style>

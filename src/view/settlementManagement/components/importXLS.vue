<template>
  <Modal v-model="importShow" title="资金导入" width="600px" >
    <div class="navbox">
      导入前请先下载模板
    </div>
    <div slot="footer">
      <Button type="default" @click="downLoding" class="mr20">下载模板</Button>
      <Upload
        ref="upload"
        style="display: inline-block"
        :show-upload-list="false"
        :action="URL.upUrl"
        :headers="headers"
        :format="['xlsx','xls']"
        :on-format-error="onFormatError"
        :on-success="onSuccess"
        :before-upload="beforeUpload"
      >
        <Button type="default" class="mr10" v-has="'import'">
          导入
        </Button>
      </Upload>
    </div>
  </Modal>
</template>

<script>
  import {down } from "@/api/system/essentialData/commoditiesInShortSupply.js"
  import Cookies from "js-cookie";
  import { TOKEN_KEY } from "@/libs/util";

  export default {
        name: "importXLS",
      props:{
        URL:''
      },
      data(){
          return {
            importShow:false,//模态框开关
            headers: {
              Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
            }, //请求头
          }
      },
      methods:{
          //打开模态框
          openModal(){
            this.importShow = true
          },

        //下载模板
        downLoding() {
          down(this.URL.downId)
        },

        //导入失败
        onFormatError(file) {
          // console.log(file)
          this.$Message.error("只支持xls xlsx后缀的文件");
        },

        // 上传成功函数
        onSuccess(response) {
          if (response.code != 0) {
            this.$Notice.warning({
              title: "导入失败",
              desc: response.message,
              duration:60
            })
            this.importShow = false

          } else {
            this.$Notice.success({
              title: "导入成功",
              desc: response.data,
            })
            this.importShow = false
            this.$emit('getNewList' ,response)
          }
        },

        //上传之前清空
        beforeUpload() {
          this.$refs.upload.clearFiles();
        },
      }
    }
</script>

<style scoped>

</style>

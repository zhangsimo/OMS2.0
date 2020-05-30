<template>
  <div class="content-oper content-oper-flex">
    <section class="con-box">
      <div class="inner-box">
        <Tabs v-model="tabsName" :animated="false" @on-click="changeTab">
          <TabPane label="模板" name="name1">
            <div class="pb20">
              <span>模板名称：</span>
              <Input v-model="searchData.partName" class="w250 mr10" />
              <Button class="mr15 w90" type="primary" @click="getTemplateList">
                查询
              </Button>
              <Upload
                style="display: inline-block;"
                ref="upload"
                :show-upload-list="false"
                :action="uploadFile"
                :format="['xlsx', 'xls', 'csv']"
                :headers="headers"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :on-format-error="onFormatError"
              >
                <Button>上传模板文件</Button>
              </Upload>
            </div>
            <Table size="small" height="389" ref="hsOrder" :loading="loading" border :stripe="true" :columns="columnsPart" :data="templateData"></Table>
          </TabPane>
          <TabPane label="文件" name="name2">
            <div class="pb20">
              <span>文件名称：</span>
              <Input v-model="searchData.fileName" class="w250 mr10" />
              <Button class="mr15 w90" type="primary" @click="getFileList">
                查询
              </Button>
              <!--<Upload-->
                <!--style="display: inline-block;"-->
                <!--ref="upload"-->
                <!--:show-upload-list="false"-->
                <!--:action="uploadFile"-->
                <!--:format="['xlsx', 'xls', 'csv']"-->
                <!--:headers="headers"-->
                <!--:before-upload="handleBeforeUpload"-->
                <!--:on-success="handleSuccess"-->
                <!--:on-format-error="onFormatError"-->
              <!--&gt;-->
                <!--<Button icon="ios-cloud-upload-outline">上传模板文件</Button>-->
              <!--</Upload>-->
            </div>
            <Table size="small" ref="hsOrder" height="389" :loading="loading" border :stripe="true" :columns="columnsPart" :data="fileData"></Table>
          </TabPane>
        </Tabs>
        <div ref="planPage">
          <Page size="small" class-name="page-con tr" :current="page.num" :total="page.total" :page-size="page.size" @on-change="selectNum"
                @on-page-size-change="selectPage" show-sizer show-total></Page>
        </div>
      </div>
    </section>
    <Modal
      v-model="templateModel"
      footer-hide
      title="修改模板">
      <Form ref="templateForm" :model="templateForm" :rules="ruleValidate" :label-width="120" style="padding-bottom: 20px">
        <FormItem label="模板名称：" prop="templateName">
          <Input class="w250" v-model="templateForm.fileOriginName" placeholder="请输入模板名称"></Input>
        </FormItem>
        <FormItem label="上传模板文件：" prop="file">
          <Upload
            style="display: inline-block;"
            ref="upDateFile"
            :action="upDateFile"
            :format="['xlsx', 'xls', 'csv']"
            :headers="headers"
            :data="templateForm"
            :before-upload="beforeUpdateTemplate"
            :on-success="UpdateTemplateSuccess"
            :on-format-error="UpdateTemplateError"
            :show-upload-list ="false"
          >
            <Button>上传模板文件</Button>
          </Upload>
          <span class="ml20" v-if="file !== null">{{file.name }}</span>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('templateForm')">提交</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {getAllTemplate,getAllFile} from "../../../../api/system/systemSetting/systemset";
  import api from '_conf/url'
  import { TOKEN_KEY } from "@/libs/util";
  import Cookies from "js-cookie";
  export default {
		name: "templateIndex",
    data(){
      const validateUpload = (rule, value, callback) => {
        if(value && value.name) {
          callback();
        } else {
          callback(new Error('请选择上传模板'));
        }
      }
      return {
        //分页
        page: {
          total: 0,
          size:10,
          num: 1
        },
        //配件名称查询层表头
        columnsPart: [
          {
            title: "序号",
            width: 50,
            type: "index"
          },
          {
            title: "操作",
            key: "id",
            minWidth: 60,
            render:(h,p)=>{
              let _this = this;
              return h('span',{
                class:'blue',
                style:{
                  "cursor":"pointer"
                },
                on:{
                  click:()=>{
                    _this.updateTemplate(p.row)
                  }
                }
              },'修改')
            }
          },
          {
            title: "ID",
            key: "id",
            minWidth: 150
          },
          {
            title: "文件名称",
            key: "fileOriginName",
            minWidth: 120
          },
          {
            title: "文件类型",
            key: "remark",
            minWidth: 120,
            render:(h,p)=>{
              let objData = p.row.fileType?JSON.parse(p.row.fileType):{};
              return h('span',objData.name)
            }
          },
          {
            title: "相同文件ID",
            key: "eqMD5Id",
            minWidth: 120
          },
          {
            title: "MD5",
            key: "fileMD5",
            minWidth: 120
          },
          {
            title: "使用次数",
            key: "reqCount",
            minWidth: 120
          },
          {
            title: "文件路径",
            key: "filePath",
            minWidth: 120
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 60
          },
          {
            title: "更新时间",
            key: "updateTime",
            minWidth: 120
          },
        ],

        loading:false,
        //tabs切换标签
        tabsName:'name1',
        //模板数据
        templateData:[],
        //文件数据
        fileData:[],
        //搜索条件
        searchData:{
          partName:'',
          fileName:''
        },
        //表格勾选数据
        selectTableDataArr:[],
        headers: {
          Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
        },
        //模板修改层
        templateModel:false,
        templateForm:{
          fileOriginName:'',
          id:'',
          file:null
        },
        ruleValidate:{
          fileOriginName: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],
          file: [
            { required: true, validator: validateUpload, trigger: 'change' }
          ],
        },
        file:null,
      }
    },
    computed:{
      uploadFile(){
        return `${api.templateApi}/file/uploadFileTemplate`
      },

      upDateFile(){
        return `${api.templateApi}/file/updateFileTemplate`
      },

    },
    mounted(){
		  this.getTemplateList();
		  // this.getFileList();
    },
    methods:{
		  async getTemplateList(){
		    let req = {};
		    let params = {};
		    if(this.searchData.partName.trim()){
		      req.fileOriginName = this.searchData.partName;
        }
        params.page = this.page.num - 1;
        params.size = this.page.size;
        this.loading = true;
        let rep = await getAllTemplate(req,params);
        this.loading = false;
        if(rep.code===0){
          this.templateData = rep.data.content||[];
          this.page.total = rep.data.totalElements;
        }
      },
      async getFileList(){
        let req = {};
        let params = {};
        if(this.searchData.fileName.trim()){
          req.fileOriginName = this.searchData.fileName;
        }
        params.page = this.page.num - 1;
        params.size = this.page.size;
        this.loading = true;
        let rep = await getAllFile(req,params);
        this.loading = false;
        if(rep.code===0){
          this.fileData = rep.data.content||[];
          this.page.total = rep.data.totalElements;
        }
      },
// 导入
      handleBeforeUpload() {
        let refs = this.$refs;
        refs.upload.clearFiles();
      },
      handleSuccess(res, file) {
        let self = this;
        if (res.code == 0) {
          if (res.data.errosMsg.length > 0) {
            this.warning(res.data.errosMsg);
          } else  {
            self.$Message.success("导入成功");
          }
        } else {
          self.$Message.error(res.message);
        }
      },
      warning(nodesc) {
        this.$Notice.warning({
          title: '上传错误信息',
          desc: nodesc
        });
      },
      onFormatError(file) {
        this.$Message.error('只支持xls xlsx后缀的文件')
      },
      changeTab(name){
        this.resetData();
        switch (name) {
          case 'name1':
            this.getTemplateList();
            break;
          case 'name2':
            this.getFileList();
            break;
        };
      },
      resetData(){
        this.page.num = 1;
        this.page.size = 10;
      },
      //切换页面
      selectNum(val) {
        this.page.num = val;
        switch (this.tabsName) {
          case 'name1':
            this.getTemplateList();
            break;
          case 'name2':
            this.getFileList();
            break;
        };
      },
      //切换页数
      selectPage(val) {
        this.page.num = 1;
        this.page.size = val;
        switch (this.tabsName) {
          case 'name1':
            this.getTemplateList();
            break;
          case 'name2':
            this.getFileList();
            break;
        };
      },
      updateTemplate(row){
		    if(row){
          this.templateModel = true
          this.templateForm.id = row.id;
        }
      },
      //修改模板提交
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            delete this.templateForm.file;
            this.$refs.upDateFile.post(this.file)
          }
        })
      },
      beforeUpdateTemplate(file){
        let refs = this.$refs;
        refs.upDateFile.clearFiles();
        this.templateForm.file = file;
        this.file = file
        return false;
      },
      UpdateTemplateSuccess(res){
		    if(res.code==0){
          this.$refs.templateForm.resetFields();
          this.templateForm.id = "";
          this.file = null;
          this.templateModel = false;
          this.$Message.success("上传成功");
          this.getTemplateList();
        }
      },
      UpdateTemplateError(){
        this.$Message.error("上传失败");
      }
    }
	}
</script>

<style scoped>

</style>

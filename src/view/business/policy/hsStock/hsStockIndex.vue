<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf wlf-center">
          <div class="db mr10">
            <span class="">订单日期：</span>
            <Date-picker
              type="datetimerange"
              clearable
              class="w320 mr10"
              @on-change="getvalue"
              placeholder="年/月/日-年/月/日"
            >
            </Date-picker>
          </div>
          <div class="db mr10">
            <span>华胜门店：</span>
            <Select v-model="company" class="w200 mr10" placeholder="选择公司" filterable clearable @on-change="getCompany">
              <Option v-for="item in hsStore" :value="item.id" :key="item.id">{{ item.fullName }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>配件编码/名称：</span>
            <Input v-model="searchData.partName" class="w150 mr10" />
          </div>
          <div class="db">
            <Button class="mr15 w90" type="primary" @click="resetData" v-has="'examine'">
              查询
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <Table size="small" height="389" ref="hsOrder" :loading="loading" border :stripe="true" :columns="columnsPart" :data="templateData"></Table>
        <div ref="planPage">
          <Page size="small" class-name="page-con tr" :current="page.num" :total="page.total" :page-size="page.size" @on-change="selectNum"
                @on-page-size-change="selectPage" show-sizer show-total></Page>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import {getAllTemplate,getAllFile} from "../../../../api/system/systemSetting/systemset";
  import api from '_conf/url'
  import { TOKEN_KEY } from "@/libs/util";
  import Cookies from "js-cookie";
  export default {
    name: "hsStockIndex",
    data(){
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
      }
    },
    computed:{
      uploadFile(){
        return `${api.templateApi}/file/uploadFileTemplate`
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
    }
  }
</script>

<style scoped>

</style>

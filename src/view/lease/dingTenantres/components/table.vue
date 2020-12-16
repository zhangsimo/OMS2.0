<template>
  <section>
    <vxe-table
      border
      align="center"
      size="mini"
      ref="xTable"
      height="400"
      auto-resize
      resizable
      highlight-hover-row
      highlight-current-row
      @current-change="selection"
      :data="tableData"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    >
      <vxe-table-column field="group0" title="基本信息">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="tenantId" title="租户ID" width="80"></vxe-table-column>
        <vxe-table-column field="corpId" title="企业编号" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.corpId}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="cropName" title="企业名称" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.cropName}}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group1" title="内部应用">
        <vxe-table-column title="agentId" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.enterpriseInsideConfig.agentId}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="app名称" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.enterpriseInsideConfig.appName}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="key" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.enterpriseInsideConfig.appKey}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="app秘钥" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.enterpriseInsideConfig.appSecret}}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group2" title="三方应用">
        <vxe-table-column field="id" title="appId" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.thirdPartyConfig.appId}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="id" title="suiteId" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.thirdPartyConfig.suiteId}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="appName" title="三方应用名称" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.thirdPartyConfig.suiteName}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="appKey" title="suiteKey" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.thirdPartyConfig.suiteKey}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="appSecret" title="三方应用秘钥" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.thirdPartyConfig.suiteSecret}}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group3" title="token信息">
        <vxe-table-column field="id" title="appId" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.tokenConfig.appId}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="id" title="秘钥" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.tokenConfig.appSecret}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="appName" title="token应用" width="100">
          <template v-slot="{row}">
            <span>{{row.configContent.tokenConfig.appName}}</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>
    </vxe-table>
    <Page
      class-name="page-con"
      :current="page.num"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="pageOpts"
      @on-change="changePage"
      @on-page-size-change="changeSize"
      show-sizer
      show-total
      transfer
    ></Page>
    <div class="db mr10 flex">
      <Button type="default" class="ml20 mb20 mr20">DING信息</Button>
    </div>
    <vxe-table
      border
      align="center"
      size="mini"
      ref="xTable2"
      height="400"
      auto-resize
      resizable
      :data="selectData"
      highlight-hover-row
      highlight-current-row
      @current-change="selection2"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column title="名称" field="name" width="200"></vxe-table-column>
      <vxe-table-column title="类型" field="type" width="50"></vxe-table-column>
      <vxe-table-column title="code" field="code"></vxe-table-column>
    </vxe-table>
  </section>
</template>

<script>
  import * as Api from "_api/lease/tenantres";
  import {TOKEN_KEY} from "@/libs/util";
  import Cookies from "js-cookie";


  import {v4} from "uuid";
  import api from "_conf/url";
  import Axios from 'axios'

  export default {
    data() {
      return {
        page: {
          page: 0,
          size: 10,
          total: 0
        },
        dingList: [],
        pageOpts: [10, 20, 30, 50],
        selectData: [],
        selectDataSel: {},
        selectDataId:0,
        tableData: [],
        searchData: {},
        selections: {}
      };
    },
    mounted() {
      // this.getList();
      this.getTypeList()
    },
    methods: {
      // 查询表
      getList(data = {}) {
        this.searchData = data;
        Axios.get(`${api.omsApi}/tenantConfig/queryAll`,
          {
            params: this.searchData,
            headers: {
              Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
            }
          }).then(res => {
          if (res.data.code === 0) {
            this.tableData = (res.data.data.content || [])
            this.page.total = res.data.data.totalElements;
          }
        })
      },
      //获取类型
      async getTypeList(){
        let res=await Api.getTypeList();
        if(res.code===0){
          this.dingList=res.data;
        }
      },
      //分页
      changePage(p) {
        this.page.page = p - 1;
        this.getList(this.searchData);
      },
      changeSize(size) {
        this.page.page = 0;
        this.page.size = size;
        this.getList(this.searchData);
      },
      changeDing(options) {
        this.selectDataSel.name = options.name;
        this.selectDataSel.type = options.value;
        this.selectData.map(el=>{
          if(el.selectDataId==this.selectDataId-1){
            el.name=options.name;
            el.type=options.value
          }
        })
      },
      add() {
        if (this.selection == {}) {
          return this.$Message.error("请选中一条数据")
        }
        let item={name:"",type:"",code:"",selectDataId:this.selectDataId,disabled:true}
        this.selectData.push(item)
        this.selectDataId++;
      },
      selection({row}) {
        this.selections = row
        this.selectData = row.configContent.dingTalkBpmsConfigs
      },
      selection2({row}){

      }
    }
  };
</script>
<style lang="css">
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .listChild {
    display: inline-block;
    border: 1px solid #e8eaec;
    flex: 1;
    line-height: 24px;
    padding: 0 5px;
  }

  .vxe-table .vxe-cell {
    padding: 0;
  }

  .vxe-table .vxe-body--column:not(.col--ellipsis) {
    padding: 0px 10px !important;
  }

  .el-input-number {
    width: 100px;
  }
</style>

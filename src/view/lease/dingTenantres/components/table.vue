<template>
  <section>
    <vxe-table
      border
      align="center"
      size="mini"
      ref="xTable"
      height="400"
      auto-resize
      resizeable
      resizable
      :data="tableData"
    >
      <vxe-table-column field="group0" title="基本信息">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
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
      <vxe-table-column field="group1" title="DING">
        <vxe-table-column title="名称" width="100">
          <template v-slot="{row}">
            <ul class="list">
              <li v-for="(item, index) of row.configContent.dingTalkBpmsConfigs" :key="index" class="flex">
                <span class="listChild">{{ item.name }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="类型" width="100">
          <template v-slot="{row}">
            <ul class="list">
              <li v-for="(item, index) of row.configContent.dingTalkBpmsConfigs" :key="index" class="flex">
                <span class="listChild">{{ item.type }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
        <vxe-table-column title="code" width="200">
          <template v-slot="{row}">
            <ul class="list">
              <li v-for="(item, index) of row.configContent.dingTalkBpmsConfigs" :key="index" class="flex">
                <span class="listChild">{{ item.code }}</span>
              </li>
            </ul>
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column field="group2" title="内部应用">
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
      <vxe-table-column field="group3" title="三方应用">
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
      <vxe-table-column field="group4" title="token信息">
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
  </section>
</template>

<script>
  // import * as api from "_api/lease/tenantres";
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
        pageOpts: [10, 20, 30, 50],
        tableData: [],
        searchData: {}
      };
    },
    mounted() {
      // this.getList();
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
    padding:0 5px;
  }
  .vxe-table .vxe-cell {
    padding: 0;
  }
  .vxe-table .vxe-body--column:not(.col--ellipsis) {
    padding: 0px 10px !important;
  }
  .el-input-number{
    width: 100px;
  }
</style>

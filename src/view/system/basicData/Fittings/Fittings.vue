<template>
  <main class="Fittings-res">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>快速查询:</span>
            <Select v-model="queryValue" style="width:140px">
              <Option
                v-for="item in queryList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Input v-model="query" placeholder="输入查询条件" style="width: 140px;" class="mr10" />
          </div>
          <div class="db mr10">
            <span>品牌:</span>
            <Select v-model="band" style="width:140px">
              <Option v-for="item in bands" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button class="mr10 w90" @click="queryHandle" type="warning">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="part-main con-box flex">
      <Split v-model="split" min="200" max="570">
        <div slot="left" class="tree-warp">
          <div class="title">配件分类</div>
          <Tree class="tree" :data="treeData" @on-select-change="selectedTree"></Tree>
        </div>
        <div slot="right" class="right table-warp">
          <div class="btn-title" v-if="tabIndex === 0 || isSys">
            <Button class="mr10 w90" @click="add">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
            </Button>
            <Button :disabled="!isCanbutton" class="mr10 w90" @click="change">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
            </Button>
            <Button class="mr10 w90" @click="changeDisable" v-if="!isDisable">
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />启用
              </span>
            </Button>
            <Button class="mr10 w90" @click="changeDisable" v-else>
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
              </span>
            </Button>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :action="upurl"
              :format="['xlsx','xls','csv']"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
            >
              <Button class="mr10 w90" @click="importOpen">
                <span class="center">
                  <Icon custom="iconfont icondaoruicon icons" />导入
                </span>
              </Button>
            </Upload>
            <Button class="mr10 w90" @click="refresh">
              <span class="center">
                <Icon custom="iconfont iconshuaxinicon icons" />刷新
              </span>
            </Button>
            <Button class="mr10 w90" @click="changeSale" v-if="isSale">
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁售
              </span>
            </Button>
            <Button class="mr10 w90" @click="changeSale" v-else>
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />可售
              </span>
            </Button>
            <Button class="mr10 w90" @click="downTemplate">
              <span class="center">
                <Icon custom="iconfont iconxiazaiicon icons" />下载模板
              </span>
            </Button>
          </div>
          <div class="btn-title" v-else>
            <Button class="mr10 w90" @click="couldRefresh">
              <span class="center">
                <Icon custom="iconfont iconshuaxinicon icons" />刷新
              </span>
            </Button>
          </div>
          <div class="db pl10 tabs-ulwarp">
            <ul class="tabs">
              <li v-if="!isSys" class="center" :class="{'tab-active': tabIndex == 0}" @click="setTab(0)">本地配件资料</li>
              <li class="center" :class="{'tab-active': tabIndex == 1}" @click="setTab(1)">云配件资料</li>
            </ul>
          </div>
          <div class="tabs-warp" v-if="tabIndex == 0">
              <Table
              border
              highlight-row
              size="small"
              :loading="local.loading"
              :stripe="true"
              :columns="local.columns"
              :data="local.tbdata"
              @on-current-change="selectRow"
            ></Table>
          </div>
          <div class="tabs-warp" v-else>
            <Table
              border
              highlight-row
              size="small"
              :loading="cloud.loading"
              :stripe="true"
              :columns="cloud.columns"
              :data="cloud.tbdata"
              @on-current-change="selectRow"
            ></Table>
          </div>
          <div class="page-warp">
              <Page
              v-if="tabIndex == 0"
              class-name="page-con"
              :current="local.page.num"
              :total="local.page.total"
              :page-size="local.page.size"
              @on-change="changePagelocal"
              @on-page-size-change="changeSizelocal"
              show-sizer
              show-total
              show-elevator
            ></Page>
            <Page
              v-else
              class-name="page-con"
              :current="cloud.page.num"
              :total="cloud.page.total"
              :page-size="cloud.page.size"
              @on-change="changePageCloud"
              @on-page-size-change="changeSizeCloud"
              show-sizer
              show-total
              show-elevator
            ></Page>
          </div>
        </div>
      </Split>
    </section>
    <accessories ref="accessories"></accessories>
  </main>
</template>

<script src="./Fittings.ts"></script>

<style lang="less" scoped>
@import url("../../../lease/tenantres/icon");
@import url("./index");
</style>
<template>
  <main class="Fittings-res page">
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
            <Select v-model="band" style="width:140px" filterable>
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
      <Split v-model="split" min="200" max="500">
        <div slot="left" class="tree-warp">
          <div class="title">配件分类</div>
          <Tree class="tree" :data="treeData" @on-select-change="selectedTree"></Tree>
        </div>
        <div slot="right" class="right table-warp">
          <div class="btn-title">
            <span class="mr10">过期时间:</span>
            <DatePicker type="date"   @on-change="changTime" :options="options3" placeholder="选择时间" style="width: 180px" class="mr10"></DatePicker>
            <Button @click="changeDisable" class="mr10" type='default'><Icon type="md-checkmark" /> 选择</Button>
            <Button  type='default' @click="closeShow"><Icon type="md-close"/> 取消</Button>
          </div>
          <div class="db pl10 tabs-ulwarp">
            <ul class="tabs">
              <li v-if="!isSys" class="center" :class="{'tab-active': tabIndex == 0}" @click="setTab(0)">本地配件资料</li>
              <li class="center" :class="{'tab-active': tabIndex == 1}" @click="setTab(1)">配件资料</li>
            </ul>
          </div>
          <div class="tabs-warp" v-if="tabIndex == 0">
            <Table
              border
              size="small"
              height="500"
              :loading="local.loading"
              :stripe="true"
              :columns="local.columns"
              :data="local.tbdata"
              @on-selection-change="selectRow"
            ></Table>
          </div>
          <div class="tabs-warp" v-else>
            <Table
              border
              height="500"
              size="small"
              :loading="cloud.loading"
              :stripe="true"
              :columns="cloud.columns"
              :data="cloud.tbdata"
              @on-selection-change="selectRow"
            ></Table>
          </div>
          <div class="p10">
              <Page
              size="small"
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
@import url("../../../../lease/tenantres/icon");
@import url("./index");
</style>

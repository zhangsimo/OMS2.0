<template>
  <main class="tenant-res page">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>查询项:</span>
            <Select v-model="fittingSelecteOption" style="width:140px">
              <Option
                v-for="item in fittingOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Input
              v-model="fittingSelectContent"
              placeholder="输入查询条件"
              style="width: 140px;"
              class="mr10"
            />
          </div>
          <div class="db">
            <Button class="mr10 w90" type="warning">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
          </div>
          <div class="db">
            <Button class="mr10">
              <span class="center"><Icon custom="iconfont icondaoruicon icons" />批量导入替换关系</span>
            </Button>
          </div>
          <div class="db">
            <Button class="mr10">
              <span class="center"><Icon custom="iconfont iconxiazaiicon icons" />下载模板</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="con-warp">
      <div class="box-list-top">
        <h5>员工列表</h5>
        <div class="tab-warps">
          <Table
            class="table"
            border
            size="small"
            :loading="fittingLoading"
            :stripe="true"
            :columns="fittingTableHead"
            :data="fittingData"
            height="160"
          ></Table>
          <Page
            class-name="page-con"
            :current="fittingPage.num"
            :total="fittingPage.total"
            :page-size="fittingPage.size"
            @on-change="fittingChangePage"
            @on-page-size-change="fittingChangeSize"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
      <div class="box-list-bottom">
        <h5>配件分配</h5>
        <div class="tab-warps trans-list">
          <div class="left target">
            <p>替换配件选择</p>
            <div class="button-warp">
              <div class="db mr10">
                <span>查询项:</span>
                <Select v-model="waitPartTransListSelecteOption" style="width:120px">
                  <Option
                    v-for="item in waitPartTransListOptions"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
              <div class="db">
                <Input
                  v-model="waitPartTransListContent"
                  placeholder="输入查询条件"
                  style="width: 140px;"
                  class="mr10"
                />
              </div>
              <div class="db">
                <Button class="mr10 w90" type="warning">
                  <span class="center">
                    <Icon custom="iconfont iconchaxunicon icons" />查询
                  </span>
                </Button>
              </div>
            </div>
            <Table
              class="table"
              border
              size="small"
              :loading="waitPartListLoading"
              :stripe="true"
              :columns="waitPartListTableHead"
              :data="waitPartListData"
              height="160"
            ></Table>
            <Page
              class-name="page-con"
              :current="waitPartListPage.num"
              :total="waitPartListPage.total"
              :page-size="waitPartListPage.size"
              @on-change="waitPartListChangePage"
              @on-page-size-change="waitPartListChangeSize"
              show-sizer
              show-total
              show-elevator
            ></Page>
          </div>
          <div class="trans-btn w110">
            <Button class="ml10 w90">
              <span class="center">
                <Icon custom="iconfont iconziyuan14 icons" />移入
              </span>
            </Button>
            <Button class="ml10 mt30 w90">
              <span class="center">
                <Icon custom="iconfont iconfanhuiicon icons" />移出
              </span>
            </Button>
          </div>
          <div class="right dist">
            <p>替换件列表</p>
            <Table
              class="table"
              border
              size="small"
              :stripe="true"
              :columns="waitPartListTableHead"
              :data="distPartListData"
              height="280"
            ></Table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import url("./index.less");
</style>
<template>
  <main class="history-log page">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <Button type="warning" class="w90 mr10" @click="putlog" v-has="'publish'">
              <span class="center">
                <Icon type="ios-arrow-dropdown" />发布日志
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="hsl-con-box">
        <div class="hsl-warp">
            <div class="hsl-item" v-for="item in logs" :key="item.id">
              <h5>
                <span class="date-leading">{{item.title}}</span>
                <span class="date-sub">更新日期：{{item.publishDate}}</span>
              </h5>
              <div class="log-item-main" v-html="item.content"></div>
              <footer>
                <Button type="warning" class="mr10" @click="goView(item.id)">
                  <span class="center">
                    <Icon custom="iconfont iconchaxunicon icons" />点击查看日志详情
                  </span>
                </Button>
              </footer>
            </div>
        </div>
      <div class="hsl-bottom">
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-sizer
          show-total
          show-elevator
        ></Page>
      </div>
    </section>
  </main>
</template>

<script src="./historylog.js"></script>

<style lang="less" scoped>
@import url("../tenantres/icon");
@import url("./log");
</style>

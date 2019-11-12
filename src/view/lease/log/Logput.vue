<template>
  <main class="log-put page">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db center">
            <Button class="w90 mr10" @click="save">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存草稿
              </span>
            </Button>
            <Button class="w90 mr10" @click="add">
              <span class="center">
                <Icon type="md-add" />发布
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="con-box">
      <editor-bar v-model="ueContent" :isClear="isClear"></editor-bar>
      <!-- <vue-ueditor-wrap v-model="ueContent" :config="myConfig"></vue-ueditor-wrap> -->
    </section>
  </main>
</template>

<script src="./logput.js"></script>

<style lang="less" scoped>
@import url("../tenantres/icon");
@import url("./log");
</style>
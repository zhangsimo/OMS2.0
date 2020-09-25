<template>
  <main class="tenant-res page">
    <!--主要部-->
    <section class="tenant-main">
      <Split v-model="split">
        <div slot="left" class="left-warp left pt10 pb10">
          <div class="db left title-warp pb10">
            <Button class="mr10" v-has="'save1'" @click="save" :disabled="!(selectTrees.length > 0 && tenantID.length > 0)">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
            <Button class="mr10 w30" @click="treeToggle(true)">
              <span class="center">
                <Icon custom="iconfont iconkuodaicon icons" />
              </span>
            </Button>
            <Button class="mr10 w30" @click="treeToggle(false)">
              <span class="center">
                <Icon custom="iconfont iconsuoxiaoicon icons" />
              </span>
            </Button>
            <Input v-model="treecontent" placeholder="请输入查询条件" style="width: 140px;" class="mr10" />
            <Button @click="treeQuery" type="warning">
              <span>
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
          </div>
          <div class="tree-warp">
            <Tree
              :data="treeData"
              children-key="childs"
              ref="tree"
              @on-select-change="selectedTree"
              @on-check-change="selectedTree"
              show-checkbox
            ></Tree>
          </div>
        </div>
        <div slot="right" class="right-warp tab-warp">
          <div class="db right ml10 btn-title">
            <Input v-model="tenantID" placeholder="租户ID" style="width: 200px;" class="mr10" />
<!--            <Input v-model="resID" placeholder="资源ID" style="width: 140px;" class="mr10" />-->
            <Select v-model='sysType' style='width: 120px' class="mr20">
              <Option v-for='item in sysTypeArr' :value="item.scope" :key="item.scope">{{item.title}}</Option>
            </Select>
            <Button class="mr10 w90" @click="qureyTable">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
<!--            <Button class="mr10 w90" @click="saveTable" v-has="'delete'">-->
<!--              <span class="center">-->
<!--                <Icon custom="iconfont iconlajitongicon icons" />删除-->
<!--              </span>-->
<!--            </Button>-->
            <!-- <Button class="mr10 w90" @click="saveTable" v-has="'save2'">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button> -->
          </div>
          <Table
            border
            highlight-row
            size="small"
            :loading="loading"
            :stripe="true"
            :columns="columns"
            :data="tbdata"
            height="440"
          ></Table>
        </div>
      </Split>
    </section>
  </main>
</template>

<script src="./tenant.js"></script>

<style lang="less" scoped>
@import url("./icon");
@import url("./tenantres");
</style>

<style>
p.edit {
  outline: none;
  border: none;
  height: 100%;
  line-height: 40px;
  padding: 0 10px;
}
.ivu-tree-empty {
  padding: 10px;
}
</style>

<template>
  <main class="price-manage page">
    <!--上部-->
    <section class="price-main">
      <Split v-model="split" min="402" max="588">
        <div slot="left" class="left">
          <div class="db btn-title">
            <p class="mr10">级别定义:</p>
            <Button class="mr10 w90" @click="add">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
            </Button>
            <Button class="mr10 w90" @click="save">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
            <Button class="mr10 w90" @click="remove">
              <span class="center">
                <Icon custom="iconfont iconlajitongicon icons" />删除
              </span>
            </Button>
          </div>
          <Table
            border
            highlight-row
            size="small"
            :loading="level.loading"
            :stripe="true"
            :columns="level.columns"
            :data="level.tbdata"
            @on-current-change="selectRow"
            height="549"
          ></Table>
        </div>
        <div slot="right" class="right">
          <div class="db pl10 tabs-ulwarp">
            <ul class="tabs">
              <li v-if="!curronly" class="center" :class="{'tab-active': tabIndex == 0}" @click="setTab(0)">客户信息</li>
              <li class="center" :class="{'tab-active': tabIndex == 1}" @click="setTab(1)">配件价格</li>
            </ul>
          </div>
          <div class="tabs-warp" v-if="tabIndex == 0">
            <div class="btn-warp">
              <Input v-model="customer.pinyin" placeholder="请输入拼音" style="width: 140px;" class="mr10" />
              <Input
                v-model="customer.fullname"
                placeholder="请输入全称"
                style="width: 140px;"
                class="mr10"
              />
              <Button :disabled="disabled" class="mr10 w90" @click="queryCustomer" type="warning">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="addCustomer">
                <span class="center">
                  <Icon type="md-add" />添加客户
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="removeCustomer">
                <span class="center">
                  <Icon custom="iconfont iconlajitongicon icons" />删除客户
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="saveCustomer">
                <span class="center">
                  <Icon custom="iconfont iconbaocunicon icons" />保存
                </span>
              </Button>
            </div>
            <Table
              class="table"
              border
              highlight-row
              size="small"
              :loading="customer.loading"
              :stripe="true"
              :columns="customer.columns"
              :data="customer.tbdata"
              height="440"
              @on-select="selectrightcus"
              @on-select-cancel="selectCancelrightcus"
              @on-select-all="selectAllrightcus"
              @on-select-all-cancel="selectCancelAllrightcus"
            ></Table>
          </div>
          <div class="tabs-warp" v-else>
            <div class="btn-warp">
              <Input v-model="part.pinyin" placeholder="请输入编码" style="width: 140px;" class="mr10" />
              <Input v-model="part.code" placeholder="请输入拼音" style="width: 140px;" class="mr10" />
              <Input v-model="part.fullname" placeholder="请输入名称" style="width: 140px;" class="mr10" />
              <Button :disabled="disabled" class="mr10 w90" @click="queryPart" type="warning">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="savePart">
                <span class="center">
                  <Icon custom="iconfont iconbaocunicon icons" />保存
                </span>
              </Button>
            </div>
            <Table
              class="table"
              border
              highlight-row
              size="small"
              :loading="part.loading"
              :stripe="true"
              :columns="part.columns"
              :data="part.tbdata"
              height="440"
            ></Table>
          </div>
          <div class="page-warp">
            <Page
              v-if="tabIndex == 0"
              class-name="page-con"
              :current="customer.page.num"
              :total="customer.page.total"
              :page-size="customer.page.size"
              @on-change="changePageCus"
              @on-page-size-change="changeSizeCus"
              show-sizer
              show-total
              show-elevator
            ></Page>
            <Page
              v-else
              class-name="page-con"
              :current="part.page.num"
              :total="part.page.total"
              :page-size="part.page.size"
              @on-change="changePagePagePart"
              @on-page-size-change="changeSizePagePart"
              show-sizer
              show-total
              show-elevator
            ></Page>
          </div>
        </div>
      </Split>
    </section>
    <Modal v-model="modal" title="客户资料" :footer-hide="true" width="1020">
      <Dia-log ref="curs" :show.sync="modal" @addcu="addcu"></Dia-log>
    </Modal>
  </main>
</template>

<script src="./priceManage.js"></script>

<style lang="less" scoped>
@import url("../../../lease/tenantres/icon");
@import url("./index");
</style>
<style>
.edit {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    outline: none;
    border: 0;
    background-color: transparent;
}
</style>
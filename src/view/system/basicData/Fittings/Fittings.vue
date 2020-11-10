<template>
  <main class="Fittings-res page">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <!-- <div class="db mr10">
            <Input
              v-model="query"
              placeholder="请输入配件内码/编码/名称/OE码"
              style="width: 200px;"
              class="mr10"
            />
          </div> -->
          <div class="db mr5">
            <span class="mr5">编码:</span>
            <el-input ref="input" style="width: 100px" placeholder="编码" v-model="partCode" @change="queryHandle"/>
          </div>
          <div class="db mr5">
            <span class="mr5">内码:</span>
            <el-input placeholder="内码" style="width: 100px" v-model="partId" @change="queryHandle"/>
          </div>
          <div class="db mr5">
            <span class="mr5">名称:</span>
            <el-input placeholder="名称" style="width: 100px" v-model="partName" @change="queryHandle"/>
          </div>
          <div class="db mr5">
            <span class="mr5">OE:</span>
            <el-input placeholder="OE码" style="width: 100px" v-model="oemCode" @change="queryHandle"/>
          </div>

          <div class="db mr10">
            <span class="mr5">品牌:</span>
            <Select v-model="band" style="width:140px" filterable>
              <Option
                v-for="item in bands"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
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
          <div class="title">配件分类
            <!--<Button class="ml20" @click="showChangeType">-->
              <!--修改-->
            <!--</Button>-->
          </div>
          <Tree
            class="tree"
            :data="treeData"
            @on-select-change="selectedTree"
          ></Tree>
        </div>
        <div slot="right" class="right table-warp">
          <div class="btn-title" v-if="tabIndex == 0">
            <!-- <Button class="mr10 w90" @click="add" v-has="'add'">
              <span class="center"> <Icon type="md-add" />新增 </span>
            </Button>
            <Button
              :disabled="!isCanbutton"
              class="mr10 w90"
              @click="change"
              v-has="'change'"
            >
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
            </Button>
            <Button
              class="mr10 w90"
              :disabled="!isCanbutton"
              @click="changeDisable"
              v-if="!isDisable"
              v-has="'disabled'"
            >
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />启用
              </span>
            </Button>
            <Button
              class="mr10 w90"
              @click="changeDisable"
              :disabled="!isCanbutton"
              v-has="'disabled'"
              v-else
            >
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
              </span>
            </Button>
            <Button
              class="mr10 w90"
              :disabled="!isCanbutton"
              @click="changeSale"
              v-if="isSale"
              v-has="'noSales'"
            >
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁售
              </span>
            </Button>
            <Button
              class="mr10 w90"
              :disabled="!isCanbutton"
              @click="changeSale"
              v-else
              v-has="'noSales'"
            >
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />可售
              </span>
            </Button> -->
            <Button class="mr10 w90" @click="refresh">
              <span class="center">
                <Icon custom="iconfont iconshuaxinicon icons" />刷新
              </span>
            </Button>
          </div>
          <div class="btn-title" v-else>
            <Button class="mr10 w90" @click="add" v-has="'add'">
              <span class="center"> <Icon type="md-add" />新增 </span>
            </Button>
            <Button
              :disabled="!isCanbutton"
              class="mr10 w90"
              @click="change"
              v-has="'change'"
            >
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
            </Button>
            <Button
              class="mr10 w90"
              :disabled="!isCanbutton"
              @click="changeDisable"
              v-if="isDisable"
              v-has="'disabled'"
            >
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />启用
              </span>
            </Button>
            <Button
              class="mr10 w90"
              @click="changeDisable"
              :disabled="!isCanbutton"
              v-has="'disabled'"
              v-else
            >
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
              </span>
            </Button>
            <Button
              class="mr10 w90"
              :disabled="!isCanbutton"
              @click="changeSale"
              v-if="!isSale"
              v-has="'noSales'"
            >
              <span class="center">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁售
              </span>
            </Button>
            <Button
              class="mr10 w90"
              :disabled="!isCanbutton"
              @click="changeSale"
              v-else
              v-has="'noSales'"
            >
              <span class="center">
                <Icon custom="iconfont iconqiyongicon icons" />可售
              </span>
            </Button>
            <Button class="mr10 w90" @click="couldRefresh">
              <span class="center">
                <Icon custom="iconfont iconshuaxinicon icons" />刷新
              </span>
            </Button>
          </div>
          <div class="db pl10 tabs-ulwarp">
            <ul class="tabs">
              <li
                class="center"
                :class="{ 'tab-active': tabIndex == 0 }"
                @click="setTab(0)"
              >
                本地配件资料
              </li>
              <li
                class="center"
                :class="{ 'tab-active': tabIndex == 1 }"
                @click="setTab(1)"
              >
                云配件资料
              </li>
            </ul>
          </div>
          <div class="tabs-warp" v-if="tabIndex == 0">
            <Table
              border
              highlight-row
              size="small"
              ref="localTable"
              :loading="local.loading"
              :stripe="true"
              :columns="local.columns"
              :data="local.tbdata"
              height="500"
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
              height="500"
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
    <!-- <accessories ref="accessories"></accessories> -->
    <part-info
      ref="partInfo"
      :is-add-part="true"
      :isSellDis="true"
      :showSpe="true"
      @throwData="submitSave"
    ></part-info>
    <Modal
      v-model="typeShow"
      title="修改配件分类"
      width="400">
      <Form
        inline
        ref="formPlan"
        :model="taxTeturns"
        :label-width="100"
        :rules="ruleValidate"
      >
        <div class="clearfix purchase" ref="planForm">
          <FormItem label="分类名称：" prop="typeName">
            <Input class="w200" v-model="taxTeturns.typeName" disabled/>
          </FormItem>
          <FormItem label="上级分类：" prop="superior">
            <Input class="w200" v-model="taxTeturns.superior" disabled/>
          </FormItem>
          <FormItem label="报税编码：" prop="code">
            <Input class="w200" v-model="taxTeturns.code"/>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formPlan')">保存</Button>
        <Button type="primary" @click="typeShow=false">取消</Button>
      </div>
    </Modal>
  </main>
</template>

<script src="./Fittings.ts"></script>

<style lang="less" scoped>
@import url("../../../lease/tenantres/icon");
@import url("./index");
</style>

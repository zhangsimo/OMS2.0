<template>
  <main class="price-manage page">
    <!--上部-->
    <section class="price-main">
      <Split v-model="split" min="400" max="588">
        <div slot="left" class="left">
          <div class="db btn-title">
            <p class="mr10">级别定义:</p>
            <Button class="mr10 w90" @click="add" v-has="'addLeft'">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
            </Button>
            <Button class="mr10 w90" @click="save" v-has="'saveLeft'">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
            <Button class="mr10 w90" :disabled="curronly" @click="remove" v-has="'deleteLeft'">
              <span class="center">
                <Icon custom="iconfont iconlajitongicon icons" />删除
              </span>
            </Button>
            <Button class="mr10 w90" :disabled="priceEnableBool" @click="priceEnableFun">
              <span class="center">{{priceEnable}}</span>
            </Button>
          </div>
          <vxe-table
            border
            resizable
            auto-resize
            stripe
            height="549"
            :loading="level.loading"
            :data="level.tbdata"
            highlight-current-row
            @current-change="selectRow"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            <vxe-table-column type="index" width="80" title="序号"></vxe-table-column>
            <vxe-table-column
              field="name"
              title="级别名称"
              min-width="200"
              :edit-render="{ name: 'input' }"
            >
              <template v-slot:edit="{ row }">
                <Input v-model="row.name" :disabled="row.readonly" />
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div slot="right" class="right">
          <div class="db pl10 tabs-ulwarp">
            <ul class="tabs">
              <li
                v-if="!curronly"
                class="center"
                :class="{ 'tab-active': tabIndex == 0 }"
                @click="setTab(0)"
              >客户信息</li>
              <li class="center" :class="{ 'tab-active': tabIndex == 1 }" @click="setTab(1)">配件价格</li>
            </ul>
          </div>
          <div class="tabs-warp" v-show="tabIndex == 0">
            <div class="btns-warp">
              <!-- <Input
                v-model="customer.pinyin"
                placeholder="请输入拼音"
                style="width: 140px;"
                class="mr10"
              />-->
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
              <Button :disabled="disabled" class="mr10 w90" @click="addCustomer" v-has="'addRight'">
                <span class="center">
                  <Icon type="md-add" />添加客户
                </span>
              </Button>
              <Button
                :disabled="disabled"
                class="mr10 w90"
                @click="removeCustomer"
                v-has="'deleteRight'"
              >
                <span class="center">
                  <Icon custom="iconfont iconlajitongicon icons" />删除客户
                </span>
              </Button>
              <Button
                :disabled="disabled"
                class="mr10 w90"
                @click="saveCustomer"
                v-has="'saveRight'"
              >
                <span class="center">
                  <Icon custom="iconfont iconbaocunicon icons" />保存
                </span>
              </Button>
            </div>
            <vxe-table
              border
              resizable
              auto-resize
              stripe
              sheetName="n1"
              id="n1"
              ref="xTable1"
              height="440"
              :loading="customer.loading"
              :data="customer.tbdata"
              @select-all="selectAllrightcus"
              @select-change="selectRC"
            >
              <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column field="fullName" title="客户全称"></vxe-table-column>
              <vxe-table-column field="shortName" title="客户简称"></vxe-table-column>
              <vxe-table-column field="createUname" title="操作人"></vxe-table-column>
              <vxe-table-column field="createTime" title="操作日期"></vxe-table-column>
            </vxe-table>
          </div>
          <div class="tabs-warp" v-show="tabIndex == 1">
            <div class="btns-warp">
              <!-- <Input
                v-model="part.pinyin"
                placeholder="请输入拼音"
                style="width: 140px;"
                class="mr10"
              />-->
              <Input v-model="part.code" placeholder="请输入编码" style="width: 140px;" class="mr10" />
              <Input
                v-model="part.fullname"
                placeholder="请输入名称"
                style="width: 140px;"
                class="mr10"
              />
              <Button :disabled="disabled" class="mr10 w90" @click="queryPart" type="warning">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="addAccessories">
                <span class="center">
                  <Icon type="md-add" />添加配件
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="importModule">
                <span class="center">
                  <Icon type="md-add" />导入
                </span>
              </Button>
              <Button :disabled="disabled" class="mr10 w90" @click="savePart" v-has="'saveRight3'">
                <span class="center">
                  <Icon custom="iconfont iconbaocunicon icons" />保存
                </span>
              </Button>
            </div>
            <vxe-table
              border
              stripe
              resizable
              auto-resize
              height="440"
              sheetName="n2"
              id="n2"
              :loading="part.loading"
              :data="part.tbdata"
              highlight-current-row
              :edit-config="{ trigger: 'click', mode: 'cell' }"
            >
              <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
              <!-- <vxe-table-column type="checkbox" width="60"></vxe-table-column> -->
              <vxe-table-column field="partCode" title="配件编码"></vxe-table-column>
              <vxe-table-column field="fullName" title="配件全称"></vxe-table-column>
              <vxe-table-column field="costPrice" title="成本单价"></vxe-table-column>
              <vxe-table-column
                field="sellPrice"
                title="销售单价"
                :edit-render="{ name: 'input' }"
                width="160"
              >
                <template v-slot:edit="{ row }">
                  <el-input-number
                    :min="0"
                    :precision="2"
                    v-model="row.sellPrice"
                    :controls="false"
                    size="mini"
                  />
                </template>
              </vxe-table-column>
              <vxe-table-column field="operationName" title="操作人"></vxe-table-column>
              <vxe-table-column field="operationTime" title="操作日期"></vxe-table-column>
            </vxe-table>
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
    <!--      添加配件-->
    <select-part-com ref="selectPartCom" @selectPartName="getPartNameList"></select-part-com>
    <!-- 导入模板弹窗组件-->
    <importXLS :URL="impirtUrl" ref="imp" @getNewList="getNew"></importXLS>
  </main>
</template>

<script src="./index.ts"></script>

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

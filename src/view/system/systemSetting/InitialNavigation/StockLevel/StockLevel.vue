<template>
      <main class="price-manage page">
        <!--上部-->
        <section class="price-main">
          <Split v-model="split">
            <div slot="left" class="left">
              <div class="leftnav">
                <div class="db btn-title">
                  <p class="mr10">备货级别定义:</p>
                  <Button class="mr10 w90" @click="add" v-has="'add'">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
                  </Button>
                  <Button class="mr10 w90" @click="save" v-has="'save'">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
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
                  @on-row-click="selction"
                ></Table>
              </div>
            </div>
            <div slot="right" class="right">
              <div class="tabs-warp">
                <div class="btn-warp p10">
                  <Select v-model="Type" style="width:100px" class="mr10">
                    <Option v-for="item in QueryType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <Input
                    v-model="customer.fullname"
                    placeholder="请输入查询条件"
                    style="width: 140px;"
                    class="mr10"
                  />
                  <Button class="mr10 w90" @click="queryCustomer" type="warning">
                <span class="center">
                  <Icon custom="iconfont iconchaxunicon icons" />查询
                </span>
                  </Button>
                  <Button class="mr10 w90" @click="addCustomer" v-has="'addCustomer'">
                <span class="center">
                  <Icon type="md-add" />添加配件
                </span>
                  </Button>
                  <Button class="mr10 w90" @click="removeCustomer" v-has="'removeCustomer'">
                <span class="center">
                  <Icon custom="iconfont iconlajitongicon icons" />删除配件
                </span>
                  </Button>
                  <!--<Button class="mr10 w90" @click="saveCustomer">-->
                <!--<span class="center">-->
                  <!--<Icon custom="iconfont iconbaocunicon icons" />保存-->
                <!--</span>-->
                  <!--</Button>-->
                </div>
                <Table
                  height="450"
                  border
                  highlight-row
                  size="small"
                  :loading="customer.loading"
                  :stripe="true"
                  :columns="customer.columns"
                  :data="customer.tbdata"
                  @on-selection-change="selection"
                ></Table>
              </div>
              <div class="page-warp">
                <Page
                  class-name="page-con"
                  :current="customer.page.num"
                  :total="customer.page.total"
                  :page-size="customer.page.size"
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
        <select-part-com  :infoData="rowId" ref="MsgThree"></select-part-com>
      </main>
</template>

<script src="./StockLevel.js"></script>

<style lang="less">
  @import url("../../../../lease/tenantres/icon.less");
  @import url("../../../basicData/priceManage/index");
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
<style scoped>
  .btn-warp{
    justify-content: flex-start!important;
    margin: 0!important;
  }
  .leftnav >>> .ivu-table-wrapper{
    overflow: visible;
  }
  .leftnav{
    padding-bottom: 200px;
    height: 600px;
  }
</style>

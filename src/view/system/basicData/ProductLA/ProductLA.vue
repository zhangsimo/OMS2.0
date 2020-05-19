<template>
  <main class="tenant-res page">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>查询项:</span>
            <Select v-model="employeeSelecteOption" style="width:140px">
              <Option
                v-for="(item, index) in employeeOptions"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Input
              v-model="employeeSelectContent"
              placeholder="输入查询条件"
              style="width: 140px;"
              class="mr10"
            />
          </div>
          <div class="db mr10">
            <span>分配状态:</span>
            <Select v-model="DistributionStateSelecteOption" style="width:140px">
              <Option
                v-for="(item, index) in DistributionStateOptions"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>角色:</span>
            <Select v-model="roleSelectOption" style="width:140px">
              <Option
                v-for="(item, index) in roleOptions"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="db">
            <Button class="mr10 w90" type="warning" @click="queryStaff">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
          </div>
          <div class="db">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :action="upurl"
              :format="['xlsx','xls','csv']"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
            >
              <Button class="mr10" v-has="'import'"
              >
                <span class="center"><Icon custom="iconfont icondaoruicon icons" />批量导入产品线分配关系</span>
              </Button>
            </Upload>
          </div>
          <div class="db">
            <Button class="mr10" @click="down" v-has="'down'">
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
            highlight-row
            size="small"
            :loading="employeeLoading"
            :stripe="true"
            :columns="employeeTableHead"
            :data="employeeData"
            height="160"
            @on-current-change="currentRow"
          ></Table>
          <Page
            class-name="page-con"
            :current="employeePage.num"
            :total="employeePage.total"
            :page-size="employeePage.size"
            @on-change="employeeChangePage"
            @on-page-size-change="employeeChangeSize"
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
            <p>待分配列表</p>
            <div class="button-warp">
              <div class="db mr10">
                <span>查询项: </span>
                <Select v-model="waitPartTransListSelecteOption" style="width:120px">
                  <Option
                    v-for="(item, index) in waitPartTransListOptions"
                    :value="item.value"
                    :key="index"
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
                <Button class="mr10 w90" type="warning" @click="queryWaitPart" :disabled="buttonWaitQuery">
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
              @on-selection-change="selectWaitPart"
            ></Table>
            <Page
              size="small"
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
            <Button class="ml10 w90" @click="moveOn" v-has="'shfit-in'">
              <span class="center">
                <Icon custom="iconfont iconziyuan14 icons" />移入
              </span>
            </Button>
            <Button class="ml10 mt30 w90" @click="moveOff" v-has="'shfit-in'">
              <span class="center">
                <Icon custom="iconfont iconfanhuiicon icons" />移出
              </span>
            </Button>
          </div>
          <div class="right dist">
            <p>已分配列表</p>
            <Table
              class="table"
              border
              size="small"
              :loading="distPartLoading"
              :stripe="true"
              :columns="partListTableHead"
              :data="distPartListData"
              height="280"
              @on-selection-change="selectDistPart"
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

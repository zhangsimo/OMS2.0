<template>
  <div class="bigbox">
    <div class="oper-top">
      当前系统：
      <Select v-model='systemScope' style='width: 120px' class="mr20" @on-change="sysTypeChange">
        <Option v-for='item in sysTypeArr' :value="item.scope" :key="item.id">{{item.title}}</Option>
      </Select>
    </div>
    <div class="demo-split">
      <Split v-model="split1">
        <div slot="left" class="demo-split-pane">
          <div class="headerBox">
            <Button class="mr10" @click="openAdd" :disabled="right != 0">
              <span class="center">
                <Icon custom="iconfont iconxinzengicon icons" />新增
              </span>
            </Button>
            <Button type="default" class="mr10 w90" @click="changeStaff" :disabled="right != 0">
              <i class="iconfont mr5 iconbianjixiugaiicon"></i>修改
            </Button>
            <Button type="default" class="mr10 w90" @click="delectStaff" :disabled="right != 0">
              <i class="iconfont mr5 iconlajitongicon"></i>删除
            </Button>
          </div>
          <div class="titleBox">
            <vxe-table
              border
              size="small"
              align="center"
              resizable
              highlight-hover-row
              highlight-current-row
              :data="tableData"
              @current-change="setOneTable"
              height="650px"
            >
              <vxe-table-column title="序号" type="seq" width="50"></vxe-table-column>
              <vxe-table-column field="displayName" title="角色名称"></vxe-table-column>
              <vxe-table-column field="name" title="角色描述"></vxe-table-column>
              <vxe-table-column field="scopeName" title="系统"></vxe-table-column>
            </vxe-table>
            <Page
              :total="page.total"
              :page-size="page.size"
              :current="page.num"
              show-sizer
              show-total
              class-name="page-con"
              size="small"
              :page-size-opts="[20,40,60,80,100]"
              @on-change="selectNum"
              @on-page-size-change="selectPage"
              style="float: right;margin-right: 10px"
            ></Page>
          </div>
          <!--          新增模态框-->
          <Add-rolse ref="add" @getNewList="addList"></Add-rolse>
          <!--          修改模态框-->
          <Change-rolse ref="change" :list="oneStaff"  :role='role' @getNewList="changeList"></Change-rolse>
        </div>
        <div slot="right" class="demo-split-pane-right" style="padding-top: 18px">
          <Tabs type="card" value="name1">
            <TabPane label="功能" name="name1">
              <div class="funct">
                <div class="treeHeader">
                  <Button class="ml10 w90" @click="save">
                    <span class="center">
                      <Icon custom="iconfont iconbaocunicon icons" />保存
                    </span>
                  </Button>
                </div>
                <div style="padding-top: 10px">
                  <Tree
                    style="max-height: 600px;overflow-y: auto"
                    :data="treeList"
                    show-checkbox
                    children-key="childs"
                    ref="resTree"
                    @on-select-change="selectTree"
                    @on-check-change="checkChange"
                  ></Tree>
                </div>
              </div>
            </TabPane>
            <TabPane label="员工" name="name2">
              <div>
                <div class="treeHeader">
<!--                  <Button class="ml10 w90" @click="saveStaff">-->
<!--                    <span class="center">-->
<!--                      <Icon custom="iconfont iconbaocunicon icons" />保存-->
<!--                    </span>-->
<!--                  </Button>-->
<!--                  <div class="fr">-->
                    <span class="mr10">机构名称:</span>
                    <Input
                      class="mr10"
                      v-model="organization"
                      placeholder="请输入机构名称"
                      style="width: 180px"
                    />
                    <span class="mr10">员工姓名:</span>
                    <Input
                      class="mr10"
                      v-model="staffName"
                      placeholder="请输入员工姓名"
                      style="width: 180px"
                    />
                    <Button @click="search" class="mr10" type="warning">
                      <Icon type="ios-search" size="14" />查询
                    </Button>
                </div>
                  <div style="max-height: 600px;height:600px;overflow-y: auto">
                    <vxe-table
                      border
                      align="center"
                      resizable
                      :data="rightTableData"
                    >
                      <vxe-table-column field="loginName" title="登录账号"></vxe-table-column>
                      <vxe-table-column field="userName" title="员工姓名"></vxe-table-column>
                      <vxe-table-column field="shopName" title="所属机构"></vxe-table-column>
<!--                      <vxe-table-column field="role" title="授权">-->
<!--                        <template v-slot="{ row,rowIndex }">-->
<!--                          <Checkbox v-model="row.allocation" :true-value="0" :false-value="1"></Checkbox>-->
<!--                        </template>-->
<!--                      </vxe-table-column>-->
                    </vxe-table>
                  </div>
                    <Page
                      :total="pageRight.total"
                      :page-size="pageRight.size"
                      :current="pageRight.num"
                      show-sizer
                      show-total
                      class-name="page-con"
                      size="small"
                      :page-size-opts="[20,40,60,80,100]"
                      @on-change="selectNumRight"
                      @on-page-size-change="selectPageRight"
                      style="float: right;margin-right: 10px"
                    ></Page>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Split>
    </div>
  </div>
</template>
<script src="./index.ts">
</script>
<style scoped lang="less">
.bigbox {
  height: 100%;
  width: 100%;
  background: #fff;
}
.oper-top {
  line-height: 46px;
}
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane-right {
  padding-left: 10px;
}
.headerBox {
  padding-left: 10px;
  line-height: 50px;
  border-bottom: 1px solid #cccccc;
}
.funct {
  width: 100%;
  height: 650px;
  border-bottom: 1px solid #cccccc;
}
.treeHeader {
  line-height: 50px;
  border-bottom: 1px solid #cccccc;
}
</style>
<style scoped>
.demo-split-pane-right >>> .ivu-tabs-bar {
  margin-bottom: 0px;
}
</style>

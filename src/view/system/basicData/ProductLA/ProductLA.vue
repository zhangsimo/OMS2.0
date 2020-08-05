<template>
  <main class="tenant-res page" style="height: 100%;">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf" style="display: none">
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
            <Button class="mr10" @click="addStaff">
              <Icon type="md-add" />添加员工
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="removeStaff">
              <Icon custom="iconfont iconfanhuiicon icons" />移出员工
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
        <div class="wlf">
          <div class="db">
            <Button class="mr10" @click="addProLine('add')">
              添加产品线
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="addProLine('edit')">
              编辑产品线
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="deleteProLine">
              删除
            </Button>
          </div>
          <div class="db">
            <Button class="mr10" @click="disProLine">
              分配产品线
            </Button>
          </div>
          <!--<div class="db">-->
            <!--<Button class="mr10" @click="addStaff">-->
              <!--调整产品线分配-->
            <!--</Button>-->
          <!--</div>-->
        </div>
      </div>
    </section>
    <section class="con-warp clearfix" style="height:calc(100% - 58px)">
      <div class="qx-l fl w300" style="height: 100%; overflow-y: auto">
        <el-tree
          :data="treeData"
          ref="treeList"
          highlight-current
          default-expand-all
          node-key="id"
          @node-click="handleNodeClick"
          :props="defaultProps">
        </el-tree>
      </div>
      <div class="qx-r" style="height: 100%" ref="tabelWrap">
        <Table border highlight-row @on-current-change="selectTable" :columns="columns1" :max-height="tableHeight" size="small" :data="data1"></Table>
      </div>
    </section>
    <!--上部-->
    <section class="con-warp" style="display: none;">
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
<!--              <div class="db mr10">-->
<!--                <span>查询项: </span>-->
<!--                <Select v-model="waitPartTransListSelecteOption" style="width:120px">-->
<!--                  <Option-->
<!--                    v-for="(item, index) in waitPartTransListOptions"-->
<!--                    :value="item.value"-->
<!--                    :key="index"-->
<!--                  >{{ item.label }}</Option>-->
<!--                </Select>-->
<!--              </div>-->
              <div class="db">
                <Input
                  v-model="waitPartTransListContent"
                  placeholder="请输入配件内码/编码/名称/OE码"
                  style="width: 140px;"
                  class="mr10"
                />
              </div>
              <div class="db">
                <span>品牌：</span>
                <Select placeholder="选择品牌" filterable v-model="waitPartTransListBrand" class="w150 mr10">
                  <Option v-for="(item,index) in partBrandData" :value="item.code" :key="index">{{item.name}}</Option>
                </Select>
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
            <Button class="ml10 w90" @click="moveAllOn" v-has="'shfit-in'">
              <span class="center">
                <Icon custom="iconfont iconziyuan14 icons" />一键移入
              </span>
            </Button>
            <Button class="ml10 w90 mt30" @click="moveOn" v-has="'shfit-in'">
              <span class="center">
                <Icon custom="iconfont iconziyuan14 icons" />移入
              </span>
            </Button>
            <Button class="ml10 mt30 w90" @click="moveOff" v-has="'shfit-in'">
              <span class="center">
                <Icon custom="iconfont iconfanhuiicon icons" />移出
              </span>
            </Button>
            <Button class="ml10 mt30 w90" @click="moveAllOff" v-has="'shfit-in'">
              <span class="center">
                <Icon custom="iconfont iconfanhuiicon icons" />一键移出
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
    <Modal title="添加员工" v-model="staffModalShow" :styles="{ top: '100px', width: '700px' }" @on-cancel="CancelStaffModal">
      <div class="modal-search">
        <p class="search-box">
          <Input placeholder="请输入员工名称" v-model="staffModalSearchInfo.userName"></Input>
        </p>
        <p class="search-box">
          <span class="search-name">角色：</span>
          <Select placeholder="请选择" class="w150 mr10" v-model="staffModalSearchInfo.roleName">
            <Option v-for="(item,index) in roleOptions" :value="item.value" :key="index">{{item.label}}</Option>
          </Select>
        </p>
        <p class="search-box">
          <Button @click="staffModalSearch" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
          <Button class="mr10" type='default' @click="staffModalSelect"><Icon type="md-checkmark" /> 选择</Button>
        </p>
      </div>
      <div class="modal-content">
        <Table border :columns="addStaffColumns" :data="staffModalList" @on-selection-change="staffModalSelectData"></Table>
        <div class="page-container">
          <Page
            size="small"
            class-name="page-con"
            :current="staffModalPage.num"
            :total="staffModalPage.total"
            :page-size="staffModalPage.size"
            @on-change="staffModalPageChange"
            @on-page-size-change="staffModalPageSizeChange"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
      <div slot='footer'>

      </div>
    </Modal>
    <Modal title="提示" v-model="tipShow" :styles="{top:'100px',width:'300px'}" @on-cancel="CancelTipModal" @on-ok="submitTip">
      <div class="tip">
        {{tipWords}}
      </div>
    </Modal>
    <!--添加-编辑产品线-->
    <Modal :title="proLineTitle" v-model="proLineModel" footer-hide>
      <Form ref="proLineForm" :model="proLineForm" :rules="proLineFormValidate" :label-width="100">
        <FormItem label="上级菜单：" prop="parentId">
          <Select @on-change="changeLever" :disabled="proLineTitle=='编辑产品线'" v-model="proLineForm.id" placeholder="上级菜单" class="w300">
            <Option v-for="item in treeDataList" v-show="!item.parentId" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </FormItem>

        <FormItem v-if="proLineSelectData.lever==1" label="品牌名称：" prop="title">
          <Select ref="proLineBrandName" placeholder="选择品牌" label-in-value @on-change="proLineBrandNameChange" filterable v-model="proLineBrandName" class="w300">
            <Option v-for="(item,index) in partBrandData" :disabled="item.isDisable" :value="item.code" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem v-else label="产品线名称：" prop="title">
          <Input v-model="proLineForm.title" placeholder="产品线名称" class="w300"></Input>
        </FormItem>
      </Form>
      <div class="tc pb20 pt10">
        <Button type="primary" class="w80" @click="proLineSubmit('proLineForm')">保 存</Button>
        <Button @click="proLineModel=false" class="w80" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <!--产品线分配-->
    <Modal title="产品线分配" v-model="proLineDis" footer-hide>
      <Form ref="formValidate"  :label-width="100">
        <FormItem label="选择员工：">
          <Select
            ref="StaffName"
            v-model="StaffName"
            placeholder="==请选择=="
            class="w300"
            filterable
            remote
            @on-change="selectStaff"
            :remote-method="getStaffList"
            :loading="loading1">
            <Option v-for="(option, index) in StaffList" :value="option.id" :key="index">{{option.staffName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="负责品牌：">
          <div class="w300" style="height: 200px; overflow-y: auto">
            <el-tree
              :data="treeData"
              default-expand-all
              show-checkbox
              class="w270"
              node-key="id"
              ref="tree"
              :props="defaultProps">
            </el-tree>
          </div>
        </FormItem>
      </Form>
      <div class="tc pb20 pt10">
        <Button type="primary" class="w80" @click="proLineDisSubmit">保 存</Button>
        <Button @click="proLineDis=false" class="w80" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </main>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import url("./index.less");
  .modal-search{
    display: flex;
    margin-bottom: 16px;
    .search-box{
      margin-right: 10px;
      &:first-child{
        width: 250px;
      }
      &:nth-child(2){
        width: 200px;
        display: flex;
        line-height: 30px;
        .search-name{
          width: 50px;
        }
      }
    }
  }
.page-container{
  padding:15px 0;
  text-align: right;
}
  .tip{
    text-align: center;
    padding: 15px 0;
  }
  .qx-l{
    border: 1px solid #ddd;
    margin-left: 20px;
    padding: 10px;
  }
  .qx-r{
    padding-left: 340px;
    margin-right: 20px;
  }
</style>

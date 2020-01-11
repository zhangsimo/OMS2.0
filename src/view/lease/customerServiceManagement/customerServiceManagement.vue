<template>
  <main class="customerSM page">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>姓名:</span>
            <Input v-model="name" placeholder="请输入姓名" style="width: 140px;" class="mr10" />
          </div>
          <div class="db">
            <span>手机号:</span>
            <Input v-model="mobile" placeholder="请输入手机号" style="width: 140px;" class="mr10" />
          </div>
          <div class="db center">
            <Button type="warning" class="w90 mr10" @click="query">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
            </Button>
            <Button class="w90 mr10" @click="add" v-has="'add'">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
            </Button>
            <Button class="w90 mr10" @click="update" v-has="'change'">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
            </Button>
            <Button class="w90 mr10" @click="save" v-has="'save'">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="con-box flex">
      <Split v-model="split">
        <div slot="left" class="l-table">
          <Table
            highlight-row
            @on-current-change="selectedRow"
            size="small"
            :loading="tableL.loading"
            border
            :stripe="true"
            :columns="tableL.thdata"
            :data="tableL.tbdata"
            height="440"
          ></Table>
          <Page
            class-name="page-con"
            :current="pageL.page.num"
            :total="pageL.page.total"
            :page-size="pageL.page.size"
            @on-change="changePageLeft"
            @on-page-size-change="changeSizeLeft"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
        <div slot="right" class="r-table">
          <Table
            highlight-row
            size="small"
            :loading="tableR.loading"
            border
            :stripe="true"
            :columns="tableR.thdata"
            :data="tableR.tbdata"
            height="440"
            @on-select="selectRow"
            @on-select-cancel="cancelSelectRow"
            @on-select-all="seleteAll"
            @on-select-all-cancel="cancelAll"
          ></Table>
          <Page
            class-name="page-con"
            :current="pageR.page.num"
            :total="pageR.page.total"
            :page-size="pageR.page.size"
            @on-change="changePageRight"
            @on-page-size-change="changeSizeRight"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </Split>
    </section>
    <Modal title="客服信息" v-model="modal" width="600px" @on-visible-change="changeVisible">
      <Form :model="modalData" ref="formValidate" :label-width="100" :rules="ruleValidate">
        <Row>
          <Col span="12">
            <FormItem label="姓名:" inline prop="name">
              <Input v-model="modalData.name" placeholder="请输入姓名" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别:" prop="sex">
              <RadioGroup v-model="modalData.sex">
                <Radio :label="0">男</Radio>
                <Radio :label="1">女</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="手机号:" inline prop="mobile">
              <Input v-model="modalData.mobile" placeholder="请输入手机号" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="生日:" inline prop="birthday">
              <DatePicker type="date" placeholder="请选择日期" v-model="modalData.birthday"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="QQ:" inline prop="qq">
              <Input v-model="modalData.qq" placeholder="请输入qq" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="微信号:" inline prop="wechat">
              <Input v-model="modalData.wechat" placeholder="请输入微信号" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="邮箱:" inline>
              <Input v-model="modalData.email" placeholder="请输入邮箱" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="签名:" inline>
              <Input v-model="modalData.signature" placeholder="请输入签名" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="微信二维码:" inline prop="src">
              <Upload
                ref="upload"
                :show-upload-list="false"
                :action="wxImgUrl"
                :format="['jpg','jpeg','png']"
                :headers="headers"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
              >
                <div class="upwarp" style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="md-image" size="24" color="#dfdfdf" v-if="!modalData.src" />
                  <img
                    class="wechatimg"
                    width="56px"
                    height="56px"
                    :src="modalData.src"
                    alt="二维码"
                    v-else
                  />
                </div>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="ok('formValidate')">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
  </main>
</template>

<script src="./customer.js"></script>

<style lang="less" scoped>
@import url("../tenantres/icon");
@import url("./customer");
</style>

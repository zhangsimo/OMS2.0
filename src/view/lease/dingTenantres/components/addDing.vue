<template>
  <Modal v-model="addDingBool" :title="tit" @on-ok="inOk" width="600" height="500" @on-cancel="inCancel">
    <!--   切换栏-->
    <div class="tabList">
      <Form :label-width="80" :model="data" :rules="rules">
        <Tabs type="card">
          <TabPane label="基本信息">
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <Row>
                  <Col span="12">
                    <FormItem label="企业编号" prop="corpId" class="h40">
                      <Input v-model.trim="data.corpId" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="企业名称" prop="corpName" class="h40">
                      <Input v-model.trim="data.corpName" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="租户ID:" prop="tenantId" class="h40">
                      <Input v-model.trim="data.tenantId" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="租户配置字典编码:" prop="dictionariesConfigCode" class="h50">
                      <Select v-model.trim="data.dictionariesConfigCode" class="w180" placeholder="请选择" filterable clearable>
                        <Option v-for="item in dictionariesConfigCodeList" :value="item.itemCode" :key="item.itemCode">
                          {{item.itemName}}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem class="h50" label="日期:" prop="date">
                      <DatePicker
                        v-model.trim="data.date"
                        type="daterange"
                        placeholder="请选择日期"
                        style="width: 180px"
                        clearable
                      ></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="门店ID:" prop="orgid" class="h40">
                      <Select v-model.trim="data.orgid" style="width:180px" class="mr10">
                        <Option
                          v-for="item in storeList"
                          :value="item.id"
                          :key="item.value"
                        >{{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <Checkbox v-model.trim="data.isMultiple" disabled>门店是否单独配置</Checkbox>
                  </Col>
                  <Col span="12">
                    <Checkbox v-model.trim="data.disable">租户配置是否禁用</Checkbox>
                  </Col>
                </Row>
              </div>
            </div>
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <Row>
                  <Col span="24" style="font-weight: 600">内部应用</Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="agentId" prop="agentId" class="h40">
                      <Input v-model.trim="data.agentId" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="app名称" prop="appName" class="h40">
                      <Input v-model.trim="data.appName" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="key:" prop="appKey" class="h40">
                      <Input v-model.trim="data.appKey" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="app秘钥:" prop="appSecret" class="h50">
                      <Input v-model.trim="data.appSecret" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <Row>
                  <Col span="24" style="font-weight: 600">第三方应用</Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="appId" prop="appId" class="h40">
                      <Input v-model.trim="data.appId" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="suiteId" prop="suiteId" class="h40">
                      <Input v-model.trim="data.suiteId" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="suiteKey:" prop="suiteKey" class="h40">
                      <Input v-model.trim="data.suiteKey" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="应用名称:" prop="suiteName" class="h50">
                      <Input v-model.trim="data.suiteName" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="suiteSecret" prop="suiteSecret" class="h50">
                      <Input v-model.trim="data.suiteSecret" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
            <div style="display: flex">
              <div style="flex-flow: row nowrap;width: 100%">
                <Row>
                  <Col span="24" style="font-weight: 600">TOKEN配置</Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="appId" prop="appId2" class="h40">
                      <Input v-model.trim="data.appId2" style="width: 180px"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="应用名称" prop="appName2" class="h40">
                      <Input v-model.trim="data.appName2" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="应用秘钥" prop="appSecret2" class="h50">
                      <Input v-model.trim="data.appSecret2" style="width: 180px"/>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </TabPane>
          <TabPane label="DING信息">
            <div>
              <div class="finance">
                <div class="financePlace">
                  <a class="mr10" @click="addDing">
                    <Icon custom="iconfont iconxinzengicon icons"/>
                    新增
                  </a>
                  <a class="mr10" @click="changeDing">
                    <Icon custom="iconfont iconbianjixiugaiicon icons"/>
                    修改
                  </a>
                </div>
                <div class="financeTab">
                  <vxe-table
                    border
                    auto-resize
                    resizable
                    stripe
                    size="mini"
                    show-overflow="title"
                    :data="dingTalkBpmsConfigs"
                    highlight-hover-row
                    highlight-current-row
                    @current-change="dingSel"
                  >
                    <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
                    <vxe-table-column field="name" title="名称" width="60"></vxe-table-column>
                    <vxe-table-column field="type" title="类型" width="60"></vxe-table-column>
                    <vxe-table-column title="状态" field="disabled">
                      <template v-slot="{row}">
                        <span>{{row.disabled?"启用":"禁用"}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="code" title="code"></vxe-table-column>
                  </vxe-table>
                </div>
              </div>
              <Modal v-model="dingBool" :title="dingTit" width="400">
                <addDingTalk ref="addDingTalk" :data="addDingData"></addDingTalk>
                <div slot="footer">
                  <Button type="primary" @click="addNewDing">保存</Button>
                  <Button type="default" @click="dingBool=false">取消</Button>
                </div>
              </Modal>
            </div>
          </TabPane>
        </Tabs>
      </Form>
    </div>
  </Modal>
</template>
<script>
  import * as api from "_api/reportForm/index.js";
  import addDingTalk from "./addDingTalk";
  import {saveDing,getTypeList} from "_api/lease/tenantres";
  import moment from "moment"
  export default {
    props: ["data","dictionariesConfigCodeList"],
    data() {
      return {
        addDingBool: false,//模态款boolean
        tit: "添加租户配置",
        storeList: [],
        isMulDis:false,
        rules: {
          corpId: [{required: true, message: "企业编号不可为空", trigger: "change"}],
          corpName: [{required: true, message: "企业名称不可为空", trigger: "change"}],
          tenantId: [{required: true, message: "租户ID不可为空", trigger: "change"}],
          dictionariesConfigCode: [{required: true, message: "租户配置字典编码不可为空", trigger: "change"}],
          // date: [{required: true,  message: "日期不可为空", trigger: "change"}],
          // orgid: [{required: true, message: "门店ID不可为空", trigger: "change"}],
          agentId: [{required: true, message: "agentId不可为空", trigger: "change"}],
          appName: [{required: true, message: "app名称不可为空", trigger: "change"}],
          appKey: [{required: true, message: "appKey不可为空", trigger: "change"}],
          appSecret: [{required: true, message: "app不可为空", trigger: "change"}],
          appId: [{required: true, message: "appId不可为空", trigger: "change"}],
          suiteId: [{required: true, message: "suiteId不可为空", trigger: "change"}],
          suiteKey: [{required: true, message: "suiteKey不可为空", trigger: "change"}],
          suiteName: [{required: true, message: "suiteName不可为空", trigger: "change"}],
          suiteSecret: [{required: true, message: "suiteSecret不可为空", trigger: "change"}],
          appId2: [{required: true, message: "appId不可为空", trigger: "change"}],
          appName2: [{required: true, message: "appName不可为空", trigger: "change"}],
          appSecret2: [{required: true, message: "appSecret不可为空", trigger: "change"}],
        },
        addDingData: {
          name: "",
          type: "",
          code: "",
          disabled: true
        },
        accountAddId:0,
        dingTalkBpmsConfigs:[],
        dingBool: false,
        dingTit: "新增"
      }
    },
    watch:{
      data:{
        handler(newValue,oldValue){
          if(newValue.orgid==0){
            newValue.isMultiple=true;
          }else{
            newValue.isMultiple=false;
          }
        },
        deep:true
      },
      dingTalkBpmsConfigs:{
        handler(newValue,oldValue){
          this.$refs.addDingTalk.typeListzanshi.map(el=>{
            newValue.map(el2=>{
              if(el.value==el2.type){
                this.$refs.addDingTalk.typeList.map((el3,idx3)=>{
                  if(el2.type==el3.value){
                    el3.disable=true;
                  }
                })
              }
            })
          })
        },
        deep:true,
        immediate:true
      }
    },
    components: {
      addDingTalk
    },
    async mounted() {
      let resE = await api.getStorelist();
      if (resE.code == 0) {
        let data = resE.data;
        this.storeList = [{id: 0, name: "全部"}]
        Object.keys(data).forEach(key => {
          this.storeList.push({id: key, name: data[key]})
        })
      }
    },
    methods: {
      async inOk() {
        let data={};
        data.effectiveDate=this.data.date[0]?moment(this.data.date[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss"):"";
        data.expirationDate=this.data.date[1]?moment(this.data.date[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"):"";
        data.tenantId=this.data.tenantId;
        data.orgid=this.data.orgid;
        data.isMultiple=this.data.isMultiple
        data.disable=this.data.disable
        data.dictionariesConfigCode=this.data.dictionariesConfigCode;
        data.configContent={};
        data.configContent.corpId=this.data.corpId;
        data.configContent.cropName=this.data.corpName;
        data.configContent.enterpriseInsideConfig={
          agentId:this.data.agentId,
          appName:this.data.appName,
          appKey:this.data.appKey,
          appSecret:this.data.appSecret,
        }
        data.configContent.thirdPartyConfig={
          appId:this.data.appId,
          suiteId:this.data.suiteId,
          suiteName:this.data.suiteName,
          suiteKey:this.data.suiteKey,
          suiteSecret:this.data.suiteSecret,
        }
        data.configContent.tokenConfig={
          appId:this.data.appId2,
          appSecret:this.data.appSecret2,
          appName:this.data.appName2,
        }
        data.configContent.dingTalkBpmsConfigs=this.dingTalkBpmsConfigs;
        let res=await saveDing(data);
        if(res.code===0){
          this.$Message.success("保存成功")
        }else{
          this.$Message.error("保存失败")
        }
      },
      inCancel() {

      },
      dingSel({row}){
        this.addDingData=row;
      },
      async addDing() {
        this.addDingData={
          name: "",
          type: "",
          code: "",
          disabled: true
        }
        this.dingBool = true;
      },
      changeDing() {
        if (Object.keys(this.addDingData).length == 0) {
          this.$Message.error("请先选中需要修改的信息");
          return false;
        }
        this.dingTit = "修改信息";
        this.dingBool = true;
        this.$refs.addDingTalk.data = this.addDingData;
      },
      addNewDing() {
        this.$refs.addDingTalk.handleSubmit(() => {
          if (this.dingTit == "修改信息") {
            let bool = true;
            this.addDingData = this.$refs.addDingTalk.data;
            this.dingTalkBpmsConfigs.map(item => {
              if (item.accountAddId != undefined) {
                if (item.accountAddId == this.addDingData.accountAddId) {
                  let newarr = {};
                  newarr = JSON.parse(JSON.stringify(this.addDingData));
                  item.name = newarr.name;
                  item.type = newarr.type;
                  item.code = newarr.code;
                  item.disabled=newarr.disabled
                }
              } else {
                if (item.id == this.addDingData.id) {
                  let newarr = {};
                  newarr = JSON.parse(JSON.stringify(this.addDingData));
                  item.name = newarr.name;
                  item.type = newarr.type;
                  item.code = newarr.code;
                  item.disabled=newarr.disabled
                }
              }
            });
            this.$Message.success("修改成功");
            this.dingBool = false;
            this.data.dingTalkBpmsConfigs = this.dingTalkBpmsConfigs;
          } else {
            let newarr = {};
            let bool = true;
            this.addDingData = this.$refs.addDingTalk.data;
            newarr = JSON.parse(JSON.stringify(this.addDingData));
            this.dingTalkBpmsConfigs.map(item => {
              if (item.type == this.addDingData.type) {
                bool = false;
              }
            });
            if (bool == true) {
              newarr.accountAddId=this.accountAddId;
              this.dingTalkBpmsConfigs.push(newarr);
              this.data.dingTalkBpmsConfigs = this.dingTalkBpmsConfigs;
              this.dingBool = false;
              this.$Message.success("添加成功");
              this.accountAddId++;
            } else {
              return this.$Message.error("该类型已添加过");
            }
          }
        });
      }
    }
  }
</script>
<style type="text/css" scoped>
  .tabList >>> .ivu-form-item {
    margin-bottom: 10px;
  }
</style>

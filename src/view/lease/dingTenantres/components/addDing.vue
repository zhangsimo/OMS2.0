<template>
  <modal v-model="addDingBool" :title="tit" @on-ok="inOk" @on-cancel="inCancel">
    <!--   切换栏-->
    <div class="tabList">
      <Tabs type="card">
        <TabPane label="基本信息">
          <div style="display: flex">
            <div style="flex-flow: row nowrap;width: 100%">
              <Row>
                <Col span="12">
                  <FormItem label="企业编号" prop="corpId" class="h40">
                    <Input v-model="data.corpId" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="企业名称" prop="corpName" class="h40">
                    <Input v-model="data.corpName" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="tenantId:" prop="tenantId" class="h40">
                    <Input v-model="data.tenantId" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="租户配置字典编码:" prop="dictionariesConfigId" class="h50">
                    <Input v-model="data.dictionariesConfigId" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
          <FormItem class="h50" label="生效日期:" prop="effectiveDate">
            <DatePicker
              v-model="data.effectiveDate"
              type="daterange"
              placeholder="请选择生效日期"
              style="width: 180px"
              clearable
            ></DatePicker>
          </FormItem>
          <FormItem class="h50" label="失效日期:" prop="expirationDate">
            <DatePicker
              v-model="data.expirationDate"
              type="daterange"
              placeholder="请选择失效日期"
              style="width: 180px"
              clearable
            ></DatePicker>
          </FormItem>
          <FormItem label="门店ID:" prop="orgId" class="h40">
            <Select v-model="data.orgid" style="width:180px" class="mr10">
              <Option
                v-for="item in storeList"
                :value="item.id"
                :key="item.value"
              >{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <div style="paddingLeft:100px">
            <Checkbox v-model="data.isMultiple">门店是否单独配置</Checkbox>
          </div>
          <div style="paddingLeft:100px">
            <Checkbox v-model="data.disable">租户配置是否禁用</Checkbox>
          </div>
        </TabPane>
        <TabPane label="除Ding之外信息">
          <div style="display: flex">
            <h5>内部应用</h5>
            <div style="flex-flow: row nowrap;width: 100%">
              <Row>
                <Col span="12">
                  <FormItem label="agentId" prop="agentId" class="h40">
                    <Input v-model="data.agentId" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="app名称" prop="appName" class="h40">
                    <Input v-model="data.appName" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="key:" prop="key" class="h40">
                    <Input v-model="data.appKey" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="app秘钥:" prop="appSecret" class="h50">
                    <Input v-model="data.appSecret" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
          <div style="display: flex">
            <h5>第三方应用</h5>
            <div style="flex-flow: row nowrap;width: 100%">
              <Row>
                <Col span="12">
                  <FormItem label="appId" prop="appId" class="h40">
                    <Input v-model="data.appId" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="suiteId" prop="suiteId" class="h40">
                    <Input v-model="data.suiteId" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="suiteKey:" prop="suiteKey" class="h40">
                    <Input v-model="data.suiteKey" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="应用名称:" prop="suiteName" class="h50">
                    <Input v-model="data.suiteName" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="第三方应用秘钥" prop="suiteSecret" class="h50">
                    <Input v-model="data.suiteSecret" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
          <div style="display: flex">
            <h5>TOKEN配置</h5>
            <div style="flex-flow: row nowrap;width: 100%">
              <Row>
                <Col span="12">
                  <FormItem label="appId" prop="appId" class="h40">
                    <Input v-model="data.appId" style="width: 180px"/>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="应用名称" prop="appName" class="h40">
                    <Input v-model="data.appName" style="width: 180px"/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="应用秘钥" prop="appSecret" class="h50">
                    <Input v-model="data.appSecret" style="width: 180px"/>
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
<!--                <a class="mr10" @click="changeDing">-->
<!--                  <Icon custom="iconfont iconbianjixiugaiicon icons"/>-->
<!--                  修改-->
<!--                </a>-->
              </div>
              <div class="financeTab">
                <vxe-table
                  border
                  auto-resize
                  resizable
                  stripe
                  size="mini"
                  show-overflow="title"
                  :data="data.dingTalkBpmsConfigs"
                  @current-change="dingSel"
                >
                  <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
                  <vxe-table-column field="name" title="名称" width="60"></vxe-table-column>
                  <vxe-table-column field="type" title="类型" width="60"></vxe-table-column>
                  <vxe-table-column field="code" title="code" width="160"></vxe-table-column>
                  <vxe-table-column field="disabled" title="disabled" width="160"></vxe-table-column>
                </vxe-table>
              </div>
            </div>
            <Modal v-model="dingBool" :title="dingTit" width="600">
              <addDingTalk ref="addDingTalk" :data="addDingData"></addDingTalk>
              <div slot="footer">
                <Button type="primary" @click="addNewDing">保存</Button>
                <Button type="default" @click="dingBool=false">取消</Button>
              </div>
            </Modal>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </modal>
</template>
<script>
  import * as api from "_api/reportForm/index.js";
  import addDingTalk from "./addDingTalk";
  export default {
    props:["data"],
    data(){
      return {
        addDingBool:false,//模态款boolean
        tit:"添加租户配置",
        storeList:[],
        addDingData:{
          name:"",
          type:"",
          code:"",
          disabled:true
        },
        dingBool:false,
        dingTit:"新增"
      }
    },
    components:{
      addDingTalk
    },
    async mounted() {
      let resE = await api.getStorelist();
      if (resE.code == 0) {
        let data = resE.data;
        this.storeList=[{id: 0, name: "全部"}]
        Object.keys(data).forEach(key => {
          this.storeList.push({id: key, name: data[key]})
        })
      }
    },
    methods:{
      inOk(){

      },
      inCancel(){

      },
      addDing(){

      },
      addNewDing(){
        let data=this.addDingData;
        this.data.dingTalkBpmsConfigs.push(data);
      }
    }
  }
</script>
<style type="text/css" scoped>
  .tabList >>> .ivu-form-item {
    margin-bottom: 10px;
  }
</style>

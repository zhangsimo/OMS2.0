<template>
  <!--<div>-->
    <!--<section class="oper-box">-->
      <!--<div class="oper-top flex">-->
        <!--<div class="wlf">-->
          <!--<div class="db clearfix">-->
            <!--<div class="pb10">-->
              <!--<span>区域名称：</span>-->
              <!--<Input v-model="areaName" placeholder="输入名称" style="width: 300px"></Input>-->
            <!--</div>-->
            <!--<div class="pb10">-->
              <!--<span>区域简介：</span>-->
              <!--<Input v-model="areaExplain" placeholder="输入简介" style="width: 300px"></Input>-->
            <!--</div>-->
            <!--<div class="pb10">-->
              <!--<span>区域标识：</span>-->
              <!--<Select v-model="cropId" style="width:300px">-->
                <!--<Option v-for="item in cropArr" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
              <!--</Select>-->
            <!--</div>-->
            <!--<div style="padding-left: 64px">-->
              <!--<Button type="warning" @click="saveArea" class="mr20">保存</Button>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</section>-->
  <!--</div>-->
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>区域类型：</span>
            <Select v-model="areaType" class="w120" @on-change="changeAreaType">
              <Option v-for="item in cropArr" :value="item.key" :key="item.key">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </div>
      <div class="oper-bottom flex">
        <Button type="primary" @click="add" class="">新增</Button>
      </div>
    </section>
    <section class="con-box">
      <Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="areaList"></Table>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>
    <Modal v-model="modal" title="新增" width="400">
      <div v-if="areaArrData.length==0">
        <span>区域类型：</span>
        <Select v-model="formValidate.areaType" @on-change="selectAreaType" style="width:200px">
          <Option v-for="item in cropArr" :value="item.key" :key="item.key">{{ item.label }}</Option>
        </Select>
      </div>
      <Form v-else :label-width="100" ref="formArea" :model="formValidate" :rules="ruleValidate">
        <FormItem label="选择区域：" prop="areaName">
          <Select v-model="formValidate.areaName" @on-change="selectArea" style="width:200px">
            <Option v-for="item in areaArrData" :value="item.id" :key="item.id">{{ item.areaName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择门店：" prop="storeName">
          <Select v-model="formValidate.storeName" filterable @on-change="selectStore" style="width:200px">
            <Option v-for="item in storeData" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="分店编号：" prop="branchStoreNo" v-if="storeSelected.length>0">
          <Input v-model="formValidate.branchStoreNo" class="w200"/>
        </FormItem>
        <FormItem label="业态：" prop="typeOfOperation" v-if="storeSelected.length>0">
          <Select v-model="formValidate.typeOfOperation" style="width:200px">
            <Option v-for="item in typeOfOperationArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="店型：" prop="shopType" v-if="storeSelected.length>0">
          <Select v-model="formValidate.shopType" style="width:200px">
            <Option v-for="item in shopTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="店龄：" prop="shopAgeType" v-if="storeSelected.length>0">
          <Select v-model="formValidate.shopAgeType" style="width:200px">
            <Option v-for="item in shopAgeTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='text' @click='modal = false'>取消</Button>
        <Button type='primary' @click='submit("formArea")'>确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {settingArea,getStoreAreaLineList,getStore,storeAreaLine,getAreaList,storeAreaLineDeleted} from "../../../api/system/systemApi";

  export default {
		name: "setArea",
    data(){
		  return {
        modal:false,
        formValidate: {
          areaType:'',
          areaName:'',
          storeName:'',
          branchStoreNo:'',
          typeOfOperation:'',
          shopType:'',
          shopAgeType:''
        },
        ruleValidate: {
          areaName: [
            { required: true,  message: '请选择区域', trigger: 'change'}
          ],
          storeName: [
            { required: true, message: '请选择门店', trigger: 'change'}
          ],
          typeOfOperation: [
            { required: true, type:'number', message: '请选择业态', trigger: 'change'}
          ],
          shopType: [
            { required: true, type:'number', message: '请选择店型', trigger: 'change'}
          ],
          shopAgeType: [
            { required: true, type:'number', message: '请选择店龄', trigger: 'change'}
          ]
        },
        typeOfOperationArr:[
          {
            "label":"直营",
            "value":1
          },
          {
            "label":"参股",
            "value":2
          },
          {
            "label":"加盟",
            "value":3
          },
        ],
        shopTypeArr:[
          {
            "label":"标准店",
            "value":1
          },
          {
            "label":"旗舰店",
            "value":2
          },
          {
            "label":"小型店",
            "value":3
          },
          {
            "label":"社区店",
            "value":4
          },
        ],
        shopAgeTypeArr:[
          {
            "label":"新店",
            "value":1
          },
          {
            "label":"成长店",
            "value":2
          },
          {
            "label":"成熟店",
            "value":3
          },
        ],
        storeSelected:'',
        loading:false,
        areaType:'',
        cropArr:[
          {
            value:0,
            key:"HS",
            label:"华胜"
          },
          {
            value:1,
            key:"JP",
            label:"佳配"
          },
          {
            value:2,
            key:"GP",
            label:"极配"
          }
        ],
        columns:[
          {
            title: '操作',
            align: 'center',
            minWidth: 120,
            key: 'storeShortName',
            render:(h,params) => {
              return h("span",{
                class:'pointer',
                on:{
                  "click":()=>{
                    this.resetBind(params.row.id)
                  }
                }
              },"解绑")
            }
          },
          {
            title: '门店名称',
            align: 'center',
            minWidth: 120,
            key: 'storeShortName'
          },
          {
            title: '门店编号',
            align: 'center',
            minWidth: 120,
            key: 'storeNo'
          },
          {
            title: '门店区域',
            align: 'center',
            minWidth: 120,
            key: 'storeAreaName'
          },
          {
            title: '区域类型',
            align: 'center',
            minWidth: 120,
            key: 'areaName',
            render:(h,params) => {
              let areaType = ""
              if(params.row.cropId){
                areaType = JSON.parse(params.row.cropId).name||""
              }
              return h('span',areaType)
            }
          },
          {
            title: '业态',
            align: 'center',
            minWidth: 120,
            key: 'areaName',
            render:(h,params) => {
              let areaType = ""
              if(params.row.typeOfOperation){
                areaType = JSON.parse(params.row.typeOfOperation).name||""
              }
              return h('span',areaType)
            }
          },
          {
            title: '店型',
            align: 'center',
            minWidth: 120,
            key: 'areaName',
            render:(h,params) => {
              let areaType = ""
              if(params.row.shopType){
                areaType = JSON.parse(params.row.shopType).name||""
              }
              return h('span',areaType)
            }
          },
          {
            title: '店龄类型',
            align: 'center',
            minWidth: 120,
            key: 'areaName',
            render:(h,params) => {
              let areaType = ""
              if(params.row.shopAgeType){
                areaType = JSON.parse(params.row.shopAgeType).name||""
              }
              return h('span',areaType)
            }
          }
        ],
        areaList:[],
        storeData:[],
        areaArrData:[],
        selectedArea:'',
        page: {
          num: 1,
          size: 10,
          total: 0
        },
      }
    },
    mounted(){
      this.getAreaListFun()
    },
    methods:{
		  resetData(){
        this.formValidate = {
          areaType:'',
            areaName:'',
            storeName:'',
            branchStoreNo:'',
            typeOfOperation:'',
            shopType:'',
            shopAgeType:''
        }
      },
      add(){
        this.storeData = []
        this.storeSelected = []
        this.areaArrData = []
        this.resetData()
		    this.modal = true
      },
      getAreaListFun(){
		    let params = {}
        if(this.areaType){
          params.cropId = this.areaType
        }
        params.page = this.page.num - 1
        params.size = this.page.size
        getStoreAreaLineList(params).then(res => {
          if(res.code==0){
            this.areaList = res.data||[]
            this.page.total = res.totalElements
          }
        })
      },
      changeAreaType(v){
		    this.getAreaListFun()
      },
      submit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            let requestObj = this.formValidate
            if(this.storeSelected.length>0){
              //requestObj = {...this.storeSelected[0],...this.formValidate}
              requestObj['storeAreaId']=this.selectedArea.id
              requestObj["storeId"] = this.storeSelected[0].id
              requestObj["storeNo"] = this.storeSelected[0].storeNo
              requestObj["storeShortName"] = this.storeSelected[0].shortName
              requestObj["storeName"] = this.storeSelected[0].name
              requestObj["companyNo"] = this.storeSelected[0].companiesNo
            }
            storeAreaLine(requestObj).then(res => {
              if(res.code==0){
                this.$Message.success("新增成功")
                this.modal = false
                this.getAreaListFun()
              }
            })
          }
        })
      },
      getStoreFun(crop){
        getStore({cropId:crop}).then(res => {
          if(res.code==0){
            this.modal = true
            this.storeData = res.data||[]
          }
        })
      },
      selectStore(v){
        this.storeSelected = this.storeData.filter(item => item.id==v)
      },
      selectAreaType(v){
        getAreaList({cropId:v}).then(res => {
          if(res.code==0){
            this.areaArrData = res.data||[]
          }
        })
      },
      selectArea(v){
        this.storeData = []
        this.storeSelected = []
        this.formValidate.storeName = ""
        let selectedArea = this.areaArrData.filter(item=>item.id==v)
        if(selectedArea.length>0){
          this.selectedArea = selectedArea[0]
          if(this.selectedArea.cropId){
            this.getStoreFun(JSON.parse(this.selectedArea.cropId).value)
          }
        }
      },
      resetBind(id){
        this.$Modal.confirm({
          title: '提示',
          content: '确定解绑吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            storeAreaLineDeleted({id:id}).then(res => {
              if(res.code==0){
                this.$Message.success("解绑成功")
                this.getAreaListFun()
              }
            })
          }
        });
      },
      //分页
      changePage(p) {
        this.page.num = p
        this.getAreaListFun()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getAreaListFun()
      },
    }
	}
</script>

<style scoped>

</style>

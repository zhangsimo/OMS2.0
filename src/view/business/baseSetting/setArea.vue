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
      <!--<Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"-->
            <!--@on-page-size-change="changeSize" show-sizer show-total></Page>-->
    </section>
    <Modal v-model="modal" title="新增" width="400">
      <Form :label-width="100" ref="formArea" :model="formValidate" :rules="ruleValidate">
        <FormItem label="区域名称：" prop="areaName">
          <Input v-model="formValidate.areaName" class="w200"/>
        </FormItem>
        <FormItem label="区域描述：" prop="areaExplain">
          <Input v-model="formValidate.areaExplain" class="w200"/>
        </FormItem>
        <FormItem label="区域类型：" prop="cropId">
          <Select v-model="formValidate.cropId" style="width:200px">
            <Option v-for="item in cropArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
  import {settingArea,getAreaList,storeAreaDeleted} from "../../../api/system/systemApi";

  export default {
		name: "setArea",
    data(){
		  return {
        modal:false,
        formValidate: {
          areaName: '',
          areaExplain: '',
          cropId: ''
        },
        ruleValidate: {
          areaName: [
            { required: true, message: '请输入区域名称', trigger: 'blur' }
          ],
          areaExplain: [
            { required: true, message: '请输入区域描述', trigger: 'blur' }
          ],
          cropId: [
            { required: true, type:'number', message: '请选择区域类型', trigger: 'change'}
          ]
        },
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
            key: 'areaName',
            render:(h,params) => {
              return h('span',{
                class:'pointer',
                on:{
                  "click":()=>{
                    this.deletedArea(params.row.id)
                  }
                }
              },"删除")
            }
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
            title: '区域名称',
            align: 'center',
            minWidth: 120,
            key: 'areaName'
          },
          {
            title: '区域描述',
            align: 'center',
            key: 'areaExplain',
            minWidth: 120
          },
        ],
        areaList:[]
      }
    },
    mounted(){
      this.getAreaListFun()
    },
    methods:{
      add(){
		    this.modal = true
      },
      getAreaListFun(){
		    let params = {}
        if(this.areaType){
          params.cropId = this.areaType
        }
        getAreaList(params).then(res => {
          if(res.code==0){
            this.areaList = res.data||[]
          }
        })
      },
      changeAreaType(v){
		    this.getAreaListFun()
      },
      submit(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            let requestObj = {
              "areaName": this.formValidate.areaName,
              "areaExplain": this.formValidate.areaExplain,
              "cropId":this.formValidate.cropId
            }
            settingArea(requestObj).then(res => {
              if(res.code==0){
                this.$Message.success("新增成功")
                this.modal = false
                this.getAreaListFun()
              }
            })
          }
        })
      },
      deletedArea(id){
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            storeAreaDeleted({id:id}).then(res => {
              if(res.code==0){
                this.$Message.success("删除成功")
                this.getAreaListFun()
              }
            })
          }
        });

      }
    }
	}
</script>

<style scoped>

</style>

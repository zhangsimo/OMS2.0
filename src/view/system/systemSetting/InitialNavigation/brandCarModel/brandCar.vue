<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <Button type="default" @click="search" class="mr10">已启用</Button>
            <Button type="default" @click="search" class="mr10">已禁用</Button>
            <Button type="default" @click="search" class="mr10">全部</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split brand-car-model" ref="paneLeft">
          <Split v-model="split1" min="400" max="500">
            <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
              <div class="car-model-hd">
                <!--<Button type="default" @click="brandBtnClick('add')" class="mr10"><Icon type="md-add" size="14" />新增品牌</Button>-->
                <!--<Button :disabled="carBrandTabelClickData==''" type="default" @click="brandBtnClick('edit')" class="mr10"><i class="iconfont mr5 iconbianjixiugaiicon"></i>修改品牌</Button>-->
                <Button :disabled="carBrandTabelClickData==''" type="default" @click="search" class="mr10"><i class="iconfont mr5 iconjinzhijinyongicon"></i>禁用品牌</Button>
              </div>
              <Table :loading="brandLoading" :height="heightWrap/2"  @on-current-change="carBrandTabelClick" size="small" highlight-row  border :stripe="true" :columns="carBrand" :data="tbdata"></Table>
              <div class="car-system">
                <!--<div class="car-model-hd">-->
                  <!--<Button @click="systemBtnClick('add')" type="default" class="mr10"><Icon type="md-add" size="14" />新增车系</Button>-->
                  <!--<Button :disabled="carSystemTabelClickData==''" type="default" @click="systemBtnClick('edit')" class="mr10"><i class="iconfont mr5 iconbianjixiugaiicon"></i>修改车系</Button>-->
                <!--</div>-->
                <Table :height="heightWrap/2-51"  @on-current-change="carSystemTabelClick" size="small" highlight-row  border :stripe="true" :columns="carSystem" :data="tbdata"></Table>
              </div>
            </div>
            <div slot="right" class="con-split-pane-right pl5">
              <div class="car-model-hd">
                <!--<Button type="default" @click="typeBtnClick('add')" class="mr10"><Icon type="md-add" size="14" />新增车型</Button>-->
                <!--<Button :disabled="carTypeTabelClickData==''" type="default" @click="typeBtnClick('edit')" class="mr10"><i class="iconfont mr5 iconbianjixiugaiicon"></i>修改修改</Button>-->
                <Button :disabled="carTypeTabelClickData==''" type="default" @click="search" class="mr10"><i class="iconfont mr5 iconjinzhijinyongicon"></i>禁用车型</Button>
              </div>
              <Table :loading="carModelLoading" :height="heightWrap-52"  @on-current-change="carTypeTabelClick" size="small" highlight-row  border :stripe="true" :columns="carModel" :data="carModeldata" :span-method="handleSpan"></Table>
            </div>
          </Split>
        </div>
      </div>
    </section>

    <Modal v-model="carBrandObj.carBrandLayer" :title="carBrandObj.carBrandLayerTit" width="400">
      <Form ref="carBrandForm" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <Row>
          <Col span="22">
            <FormItem label="品牌英文名：" prop="enName">
              <Input v-model="formValidate.enName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="品牌中文名：" prop="cnName">
              <Input v-model="formValidate.cnName"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click="submitBtn('carBrandForm')">确定</Button>
        <Button type='default' @click='carBrandObj.carBrandLayer = false'>取消</Button>
      </div>
    </Modal>

    <Modal v-model="carSystemObj.carSystemLayer" :title="carSystemObj.carSystemLayerTit" width="400">
      <Form ref="carSystemForm" :model="systemFormValidate" :rules="systemRuleValidate" :label-width="110">
        <Row>
          <Col span="22">
            <FormItem label="品牌：" prop="brand">
              <Input readonly v-model="systemFormValidate.brand"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="厂商：" prop="firm">
              <Input v-model="systemFormValidate.firm"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="车系名称：" prop="systemName">
              <Input v-model="systemFormValidate.systemName"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click="submitBtn('carSystemForm')">确定</Button>
        <Button type='default' @click='carSystemObj.carSystemLayer = false'>取消</Button>
      </div>
    </Modal>

    <Modal v-model="carTypeObj.carTypeLayer" :title="carTypeObj.carTypeLayerTit" width="400">
      <Form ref="carTypeForm" :model="typeFormValidate" :rules="typeRuleValidate" :label-width="110">
        <Row>
          <Col span="22">
            <FormItem label="品牌：" prop="brand">
              <Input readonly v-model="typeFormValidate.brand"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="厂商：" prop="firm">
              <Input readonly v-model="typeFormValidate.firm"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="车系名称：" prop="systemName">
              <Input readonly v-model="typeFormValidate.systemName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="品牌车型：" prop="typeCar">
              <Input v-model="typeFormValidate.typeCar"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click="submitBtn('carTypeForm')">确定</Button>
        <Button type='default' @click='carTypeObj.carTypeLayer = false'>取消</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  // import {getCompanyList } from '@/api/system/systemSetting/staffManagenebt'
  import '@/view/lease/product/lease.less'
  import './brandCar.less'
  import {mixBrandCar} from "./mixBrandCar";

  export default {
    name: "brandCar",
    mixins:[mixBrandCar],
    data(){
      return {
        split1:0.4,//左右模块分割
        heightWrap:0,//左侧可是区域高度
        brandLoading:false,
        carModelLoading:false,
        //分页对象
        page:{
          size:10,
          num:1,
          total:0
        },
        //车品牌表头
        carBrand:[
          {
            title:'序号',
            type: 'index',
            width: 40,
            align: 'center'
          },
          {
            title: '车辆品牌信息',
            align: 'center',
            children:[
              {
                title: '名称',
                align: 'center',
                key: 'nameCn',
                minWidth: 150
              },
              {
                title: '是否禁用',
                align: 'center',
                key: 'tenantCompanyName',
                minWidth: 60
              },
            ]
          },
        ],
        //车系表头
        carSystem:[
          {
            title:'序号',
            type: 'index',
            width: 40,
            align: 'center'
          },
          {
            title: '车系信息',
            align: 'center',
            children:[
              {
                title: '名称',
                align: 'center',
                key: 'tenantCompanyName',
                minWidth: 150
              },
              {
                title: '是否禁用',
                align: 'center',
                key: 'tenantCompanyName',
                minWidth: 60
              },
            ]
          },
        ],
        //车型品牌表头
        carModel:[
          {
            title:'序号',
            type: 'index',
            width: 40,
            align: 'center'
          },
          {
            title: '车型车系信息',
            align: 'center',
            children:[
              {
                title: '厂商',
                align: 'center',
                key: 'carBrandName',
                minWidth: 80
              },
              {
                title: '车系',
                align: 'center',
                key: 'tenantCompanyName',
                minWidth: 80
              },
              {
                title: '品牌车型',
                align: 'center',
                key: 'carModelName',
                minWidth: 200
              },
              {
                title: '是否禁用',
                align: 'center',
                key: 'tenantCompanyName',
                minWidth: 60
              },
            ]
          },
        ],
      }
    },
    mounted(){
      // this.getlist();
      this.$nextTick(()=>{
      this.heightWrap = this.$refs.paneLeft.offsetHeight
      })
    },
    methods:{

    }
  }
</script>



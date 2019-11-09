<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
    <div class="oper-top flex">
    <div class="wlf">
    <div class="db">
      <span>快速查询：</span>
      <Select v-model="purchaseType" class="w90">
        <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <Input v-model="searchValue" placeholder="输入查询条件" class="w200 mr10"></Input>
    </div>
      <div class="db">
        <span>配件审核状态：</span>
        <Select v-model="approvalType" class="w90 mr10">
          <Option v-for="item in approvalTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
      <div class="db">
        <span>审核日期：</span>
        <DatePicker @on-change="selectDate" type="daterange" placeholder="年/月/日 - 年/月/日" class="w200 mr10"></DatePicker>
        <Button type="warning" @click="search" class="mr10 w90"><Icon type="ios-search" size="14" /> 查询</Button>
        <Button v-if="selectTable.approval==0" type="default" @click="approval" class="mr10 w90"><i class="iconfont mr5 iconshenheicon"></i>配件审核</Button>
      </div>
    </div>
    </div>
    </section>
    <section class="con-box">
      <div class="clearfix">
        <Table :height="heightWrap" @on-current-change="selectTabelData" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      </div>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>

    </section>
    <Modal v-model="proModal" title="配件资料" width="700">
      <div class="pb10 tr">
        <Checkbox v-model="prohibit">是否禁用</Checkbox>
        <Checkbox v-model="forbidsale">是否禁售</Checkbox>
      </div>
      <Tabs type="card" :animated="false">
        <TabPane label="基本信息">
          <Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="110">
            <Row>
              <Col span="11">
                <FormItem label="配件品质：" prop="qualityTypeId">
                  <Select v-model="formValidate.qualityTypeId">
                    <Option v-for="item in brandAll" :value="item.id" :key="item.id" v-if="item.parentId==0">{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="配件品牌：" prop="partBrandId">
                  <Select v-model="formValidate.partBrandId">
                    <Option v-for="item in brandAll" :value="item.id" :key="item.id" v-if="item.parentId!=0">{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="编码：" prop="code">
                  <Input v-model="formValidate.code"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="名称：" prop="name">
                  <Input @on-click="showName" icon="ios-clock-outline" v-model="formValidate.name" ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="单位：" prop="unit">
                  <Select v-model="formValidate.unit">
                    <Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="OE码：" prop="oemCode">
                  <Input v-model="formValidate.oemCode"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="规格：" prop="spec">
                  <Input v-model="formValidate.spec"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="型号：" prop="model">
                  <Input v-model="formValidate.model"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="适用车型：" prop="applyCarbrandId">
                  <Select class="w140 mr5"  v-model="formValidate.applyCarbrandId">
                    <Option v-for="item in carModelAll" :value="item.id" :key="item.id">{{item.carBrandZh}}</Option>
                  </Select>
                  <Input class="w350" v-model="formValidate.explain"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="通用编码：" prop="commonCode">
                  <Input v-model="formValidate.commonCode"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="生产厂家：" prop="produceFactory">
                  <Input v-model="formValidate.produceFactory"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="产地：" prop="origin">
                  <Input v-model="formValidate.origin"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="配件全称：" prop="fullName">
                  <Input v-model="formValidate.fullName"></Input>
                  配件全称 = 名称+规格+车型+品牌
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="自定义分类：" prop="customClassName">
                  <Input @on-click="customModalFun" icon="ios-clock-outline" v-model="formValidate.customClassName"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="备注：" prop="remarks">
                  <Input v-model="formValidate.remarks"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="单位换算：" class="x11">
                  <div class="flex">
                    <div>
                      <div class="unit-item w300" v-for="v in valueVOS">
                        <Select class="w80" v-model="v.unit1">
                          <Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>
                        </Select>
                        <Input class="w80" v-model="v.inputNum"></Input>
                        <Select class="w80" v-model="v.unit2">
                          <Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Button class="ml30" @click="addValueVOS" type="default"><Icon type="md-add" size="14"/> 新增</Button>
                      <Button class="ml10" @click="delValueVOS" type="primary"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>
                    </div>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="包装规格">
          <div class="pb10">
            <Button type="default" @click="addSpec" class="mr10 w90">新增规格</Button>
            <Button @click="delSpec" type="default" class="mr10 w90">删除</Button>
          </div>
          <Table height="300" size="small" :loading="loading" border :stripe="true" :columns="columnsTab" :data="formValidate.specVOList">
            <template slot-scope="{ row, index }" slot="meterCompany">
              <span v-if="index===0">{{formValidate.unit}}</span>
              <Select v-else class="w80" v-model="unit2">
                <Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>
              </Select>
            </template>
          </Table>
        </TabPane>
      </Tabs>
      <div slot='footer'>
        <Button type='primary' @click='submit("proModal")'>确定</Button>
        <Button type='default' @click='proModal = false'>取消</Button>
      </div>
    </Modal>
    <Modal v-model="linkModal" title="配件名称查询" width="1000">
      <div class="partCheck-hd">
        <Input class="w200 mr10" v-model="formValidate.name"></Input>
        <Button class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
        <Button class="mr10" type='default'><Icon type="md-checkmark" /> 选择</Button>
        <Button type='default'><Icon type="md-add" /> 新增配件名称</Button>
      </div>
      <div class="partCheck-main clearfix">
        <div class="partCheck-left fl">
          <div class="partCheck-left-tit">系统分类</div>
          <div class="partCheck-left-tree">
            <Tree :data="treeData" show-checkbox @on-check-change="selectTree"></Tree>
          </div>
        </div>
        <div class="fr partCheck-right">
          <Table :height="heightWrap" @on-current-change="selectTabelData" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columnsPart" :data="tbdata"></Table>
        </div>
      </div>
      <div slot='footer'>
        <Button type='primary' @click='submit("proModal")'>确定</Button>
        <Button type='default' @click='proModal = false'>取消</Button>
      </div>
    </Modal>
    <Modal v-model="customModal" title="自定义分类" width="500">
      <div class="partCheck-hd">
        <Button @click="submitCustom" class="mr10" type='default'><Icon type="md-checkmark" /> 选择</Button>
        <Button @click="customModal=false" type='default'><Icon type="md-close"/> 取消</Button>
      </div>
      <div class="custom-main">
        <div class="custom-item" v-for="v in customAll">
          <p class="custom-type-hd">{{v.dictName}}：</p>
          <div>
            <span
              class="tag-span"
              :class="{'active':customClassName==v1.itemName}"
              @click="handleTag(v1)"
              @on-change="handleTag(v1)"
              v-for="v1 in v.itemVOS">{{v1.itemName}}</span>
          </div>
        </div>
      </div>
      <div slot='footer'>

      </div>
    </Modal>
  </div>
</template>
<script>
  import '../../lease/product/lease.less'
  import './partsLayer.less'
  import {getExamineList,getExamineDetail,getAllBrand,getAllCar,getAllCustom} from '../../../api/system/partsExamine/partsExamineApi'
  import {getDataDictionaryTable} from '../../../api/system/dataDictionary/dataDictionaryApi'
  import {minxParts} from './mixParts'

  export default {
    name: 'mixtureRatio',
    inject:['reload'],
    mixins:[minxParts],
    data() {
      let price = (rule, value, callback) => {
        if (!value&&value!==0) {
          callback(new Error('单次扣减华币不能为空'));
        } else {
          let reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/;

          if(!reg.test(value)){
            callback('请输入正确格式')
          }else{
            callback()
          }
        }
      }
      let price2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('销售价不能为空'));
        } else {
          if(!/[^\d.]/g.test(value)){
            if(/[.]/g.test(value)){
              let reg=/^\d+\.\d{1,2}$/;
              if(!reg.test(value)){
                callback('请输入正确格式')
              }else{
                callback()
              }
            }else{
              callback()
            }
          }else{
            callback('请输入数字格式')
          }
          //
          //
          // if(!reg.test(value)){
          //
          // }else{
          //   callback()
          // }
        }
      }
      return {
        purchaseType:'queryCode',
        purchaseTypeArr:[
          {
            'label':'编码',
            'value':'queryCode'
          },
          {
            'label':'名称',
            'value':'fullName'
          },
          {
            'label':'车型',
            'value':'applyCarModel'
          },
          {
            'label':'拼音',
            'value':'namePy'
          },
        ],
        approvalType:0,
        approvalTypeArr:[
          {
            'label':'已审',
            'value':1
          },
          {
            'label':'待审',
            'value':0
          },
          {
            'label':'未通过',
            'value':2
          },
          {
            'label':'全部',
            'value':9999
          },
        ],
        prohibit:false,
        forbidsale:false,
        linkModal: false,
        proModal:false,
        customModal:false,
        searchValue: '',
        dateTime: '',
        formValidate: {
          qualityTypeId: '',//品质
          partBrandId: '',//品牌
          code: '',//配件编码
          name: '',//配件名称
          unit: '',//配件单位
          oemCode: '1',//oe码
          spec:'',//规格
          model:'',//型号
          applyCarbrandId:'',//适用车型Id
          explain:'',//车型说明
          commonCode:'',//通用编码
          produceFactory:'',//生产厂家
          origin:'',//产地
          fullName:'',//配件全称
          customClassName:'',
          remarks:'',//备注
          specVOList:[],//规格list
          valueVOS:[],//单位换算list
        },
        ruleValidate: {
          qualityTypeName: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          partNameId: [
            { required: true,validator:price2, trigger: 'blur'}
          ],
          isCycle: [
            { required: true, message: '有效期不能为空', trigger: 'blur' }
          ],
          address:[
            { required: true, message: '接口地址不能为空', trigger: 'blur' }
          ],
          coin:[
            { required: true, validator:price, trigger: ['blur','change'] }
          ]
        },
        brandAll:[],//所有品牌，品质
        dictCodeAll:[],//所有单位
        carModelAll:[],//所有车型
        customAll:[],//自定义分类
        customClassName:'',
        valueVOS:[
          {
            'unit1':'',
            'inputNum':'',
            'unit2':''
          },
        ],
        valueVo:{
          'unit1':'',
          'inputNum':'',
          'unit2':''
        },
        treeData: [
          {
            title: '授权管理',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          },
          {
            title: '授权管理',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '序号',
            minWidth: 50,
            type:'index'
          },
          {
            title: '配件信息',
            key: 'venderSkuNo',
            align:'center',
            children:[
              {
                title: '所属体系',
                key: 'venderSkuNo',
                minWidth: 70,
              },
              {
                title: '申请分店',
                key: 'orgname',
                minWidth: 70,
              },
              {
                title: '配件编码',
                key: 'brandCode',
                minWidth: 70,
              },
              {
                title: '配件名称',
                key: 'name',
                minWidth: 70,
              },
              {
                title: '配件品质',
                key: 'qualityTypeName',
                minWidth: 70,
              },
              {
                title: '品牌车型',
                key: 'applyCarModel',
                minWidth: 70,
              },
              {
                title: '配件类别一级',
                key: 'carTypeIdFir',
                minWidth: 70,
              },
              {
                title: '配件类别二级',
                key: 'carTypeIdSen',
                minWidth: 70,
              },
              {
                title: '配件类别三级',
                key: 'carTypeIdThr',
                minWidth: 70,
              },
              {
                title: '单位',
                key: 'unit',
                minWidth: 70,
              },
              {
                title: '规格',
                key: 'spec',
                minWidth: 70,
              },
              {
                title: '审核',
                key: 'approval',
                minWidth: 70,
                render:(h,params) => {
                  let approval = params.row.approval||0
                  let className = ''
                  let apptxt = '待审批'
                  if(approval==1){
                    className = 'blue'
                    apptxt = '审批通过'
                  }else if(approval==2){
                    apptxt = '未通过'
                    className = 'red'
                  }
                  return h('span',{
                    class:className
                  },'●'+apptxt)
                }
              },
            ]
          },
          {
            title: '操作信息',
            key: 'venderSkuNo',
            align:'center',
            children:[
              {
                title: '创建人',
                key: 'createUname',
                minWidth: 70,
              },
              {
                title: '创建日期',
                key: 'createTime',
                minWidth: 70,
              },
              {
                title: '审核人',
                key: 'updateUname',
                minWidth: 70,
              },
              {
                title: '审核日期',
                key: 'approvalTime',
                minWidth: 70,
              },
            ]
          },
        ],
        tbdata: [],//审批数据
        columnsTab: [
          {
            title: '序号',
            minWidth: 50,
            type:'index'
          },
          {
            title: '计量单位',
            key: 'meterCompany',
            slot: 'meterCompany',
            minWidth: 65
          },
          {
            title: '单位数量',
            key: 'companyNum',
            minWidth: 65,
          },
          {
            title: '长',
            key: 'longNum',
            minWidth: 50,
          },
          {
            title: '宽',
            key: 'wide',
            minWidth: 50,
          },
          {
            title: '高',
            key: 'high',
            minWidth: 50,
          },
          {
            title: '体积',
            key: 'volume',
            minWidth: 50,
          },
          {
            title: '重量',
            key: 'weight',
            minWidth: 50,
          },
          {
            title: '容积',
            key: 'volumeRong',
            minWidth: 50,
          },
          {
            title: '设为起订单位',
            key: 'name',
            minWidth: 90,
            render:(h,params) => {
              let com = params.row.isMaxCompany
              return h('Checkbox',{
                props:{
                  value:com===0?false:true
                }
              })
            }
          },
          {
            title: '最小起量单位',
            key: 'name',
            minWidth: 90,
            render:(h,params) => {
              let com = params.row.isMinCompany
              return h('Checkbox',{
                props:{
                  value:com===0?false:true
                }
              })
            }
          },
        ],
        Tabdata: [],//规格数据
        newSpecObj:{
          id:'1'
        },
        selectTable:{},
        heightWrap:0
      }
    },
    mounted() {
      this.initStart()
    },
    methods: {
      initStart() {
        this.getList()
      },
      submit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let objReq = {}
            objReq.name = this.formValidate.name
            objReq.type = this.formValidate.type
            objReq.remark = this.formValidate.remark
            objReq.disable = this.formValidate.disable
            if(objReq.type===0){
              objReq.salesPrice = this.formValidate.salesPrice
              objReq.isCycle = this.formValidate.isCycle
            }else{
              objReq.address = this.formValidate.address
              objReq.coin = this.formValidate.coin
            }
            if(this.formValidate.id){
              objReq.id = this.formValidate.id
            }

            saveProduct(objReq).then(res => {
              if(res.code==0){
                this.proModal = false
                this.$Message.success("添加成功")
                this.getList()
              }
            })
          }
        })
      },
      //初始化
      getList() {
        const params = {}
        let searchValue = this.searchValue.trim()
        if(searchValue){
          params[this.purchaseType]= searchValue
        }
        if (this.dateTime[0]) {
          params.startTime = this.dateTime[0] + " 00:00:00"
          params.endTime = this.dateTime[1] + " 23:59:59"
        }
        if (this.approvalType!=9999) {
          params.approval = this.approvalType
        }

        params.page = this.page.num - 1
        params.size = this.page.size
        this.loading = false
        getExamineList(params).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data.content || []
            this.page.total = res.data.totalElements
          }

        })
      },
      //新增产品
      approval(){
        this.proModal = true
        //获取所有品质
        getAllBrand({}).then(res => {
          if(res.code==0){
            this.brandAll = res.data.content||[]
          }
        })
        //获取配件单位
        getDataDictionaryTable({"dictCode":"UNIT_CODE_001"}).then(res =>{
          if(res.code==0){
            this.dictCodeAll = res.data
          }
        })
        //获取配件单位
        getAllCar({}).then(res =>{
          if(res.code==0){
            this.carModelAll = res.data.content||[]
          }
        })

        getExamineDetail({id:this.selectTable.id}).then(res => {
          if(res.code==0){
            this.formValidate = res.data||[]
          }
        })

      },


      showName(){
        this.linkModal = true
      },
      //分页
      changePage(p) {
        this.page.num = p
        this.getList()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
      //搜索
      selectDate(date) {
        this.dateTime = date
        this.search()
      },
      search() {
        this.page.num = 1
        this.getList()
      },

      //表格单选选中
      selectTabelData(v){
        this.selectTable = v
      },
      //新增单位换算列表
      addValueVOS(){
        let objItem = Object.assign({},this.valueVo)
        this.valueVOS.push(objItem)
      },
      //删除单位换算列表
      delValueVOS(){
        if(this.valueVOS.length>1){
          this.valueVOS.pop()
        }
      },
      //自定义分类
      customModalFun(){
        this.customModal = true
        getAllCustom().then(res => {
          if(res.code==0){
            this.customAll = res.data||[]
          }
        })
      },
      handleTag(v){
        this.customClassName = v.itemName
      },
      //选择自定义分类
      submitCustom(){
        this.customModal = false
       if(this.customClassName) {
         this.formValidate.customClassName = this.customClassName
       }
      },
      //新增规格
      addSpec(){
        let objData = Object.assign({},this.newSpecObj)
        this.formValidate.specVOList.push(objData)
      },
      delSpec(){
        this.formValidate.specVOList.pop()
      }
    },
    computed: {
      placeh() {
        let returnText = ""
        this.searchTypeArr.filter((item) => {
          if (item.value == this.searchType) {
            returnText = "请填写" + item.name
          }
        })
        return returnText
      }
    },
  }
</script>

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
        <Button v-if="selectTable.auditSign==0" type="default" @click="approval" class="mr10 w90"><i class="iconfont mr5 iconshenheicon"></i>配件审核</Button>
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
    <part-info ref="partInfo"></part-info>



    <!--<Modal v-model="addPartModal" title="新增配件名称" width="500">-->
      <!--<Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="110">-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="标准名称：" prop="name">-->
              <!--<Input @on-click="showName" v-model="formValidate.name" ></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="别名：" prop="name">-->
              <!--<Input @on-click="showName" v-model="formValidate.name" ></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="配件一级分类：" prop="name">-->
              <!--<Select v-model="formValidate.unit">-->
                <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="配件二级分类：" prop="name">-->
              <!--<Select v-model="formValidate.unit">-->
                <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="配件三级分类：" prop="name">-->
              <!--<Select v-model="formValidate.unit">-->
                <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="补充说明：" prop="code">-->
              <!--<Input v-model="formValidate.code"></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
      <!--</Form>-->
      <!--<div slot='footer'>-->
        <!--<Button type='primary' @click='submit("addPartModal")'>确定</Button>-->
        <!--<Button type='default' @click='addPartModal = false'>取消</Button>-->
      <!--</div>-->
    <!--</Modal>-->
  </div>
</template>
<script>
  import '../../lease/product/lease.less'
  import './partsLayer.less'
  import {getExamineList,getExamineDetail} from '../../../api/system/partsExamine/partsExamineApi'
  import {minxParts} from './mixParts'
  import SearchPartName from "./component/searchPartName";
  import PartInfo from "./component/partInfo";

  export default {
    name: 'mixtureRatio',
    components: {PartInfo, SearchPartName},
    inject:['reload'],
    mixins:[minxParts],
    data() {
      return {
        //快速查询
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
        //审核状态查询
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

        //新增配件名称层
        addPartModal:false,
        //快速查询输入值
        searchValue: '',
        //审核日期查询
        dateTime: '',

        //单位换算存在的list
        valueVOS:[
          {
            'unit1':'',
            'inputNum':'',
            'unit2':''
          },
        ],
        //单位换算item obj
        valueVo:{
          'unit1':'',
          'inputNum':'',
          'unit2':''
        },
        //分页obj
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        //配件标定审核list表头
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
                key: 'tenantName',
                minWidth: 70,
              },
              {
                title: '申请分店',
                key: 'orgname',
                minWidth: 70,
              },
              {
                title: '配件编码',
                key: 'code',
                minWidth: 70,
              },
              {
                title: '配件名称',
                key: 'name',
                minWidth: 70,
              },
              {
                title: '配件品质',
                key: 'qualityTypeId',
                minWidth: 70,
              },
              {
                title: '品牌车型',
                key: 'carModelName',
                minWidth: 150,
                render:(h,params) => {
                  return h('span',params.row.carBrand+'　'+params.row.carModelName)
                }
              },
              {
                title: '配件类别一级',
                key: 'carTypeF',
                minWidth: 70,
              },
              {
                title: '配件类别二级',
                key: 'carTypeS',
                minWidth: 70,
              },
              {
                title: '配件类别三级',
                key: 'carTypeT',
                minWidth: 70,
              },
              {
                title: '单位',
                key: 'unitId',
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
                  let approval = params.row.auditSign||0
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
                key: 'auditor',
                minWidth: 70,
              },
              {
                title: '审核日期',
                key: 'auditDate',
                minWidth: 70,
              },
            ]
          },
        ],
        tbdata: [],//审批数据

        //配件审核标定点击选中的table数据
        selectTable:{},
        //高度
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
      //初始化
      getList() {
        const params = {}
        //快速查询输入条件
        let searchValue = this.searchValue.trim()
        if(searchValue){
          params[this.purchaseType]= searchValue
        }
        //审核日期
        if (this.dateTime[0]) {
          params.startTime = this.dateTime[0] + " 00:00:00"
          params.endTime = this.dateTime[1] + " 23:59:59"
        }
        //配件审核状态
        if (this.approvalType!=9999) {
          //params.approval = this.approvalType
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
        this.$refs.partInfo.init(this.selectTable.id);

      },

      //配件名称查询层显示
      showName(){
        this.$refs.searchPartName.init();
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
      //选择的时间
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
        console.log(v)
        this.selectTable = v
      },
      //新增单位换算列表
      addValueVOS(){
        let objItem = {...this.valueVo}
        this.valueVOS.push(objItem)
      },
      //删除单位换算列表
      delValueVOS(){
        if(this.valueVOS.length>1){
          this.valueVOS.pop()
        }
      },

      //新增规格
      addSpec(){
        let objData = {...this.newSpecObj}
        this.formValidate.specVOList.push(objData)
        console.log(this.formValidate.specVOList)
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

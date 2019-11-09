<template>
  <div class="content-oper content-oper-flex">
    <!--<section class="oper-box">-->
      <!--<div class="oper-top flex">-->
        <!--<div class="wlf">-->
          <!--<div class="db">-->
            <!--<quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>-->
            <!--<Select v-model="purchaseType" class="w90 mr10">-->
              <!--<Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>-->
            <!--</Select>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button type="default" @click="search" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button class="mr10" @click="addPro"><Icon type="md-add"/> 新增</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button type="default" @click="search" class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button class="mr10" @click="editPro"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button @click="linkProMadel" class="mr10"><Icon type="md-close" size="14" /> 作废</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button @click="linkProMadel" class="mr10"><i class="iconfont mr5 iconfanhuiicon"></i> 反作废</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button @click="linkProMadel" class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>-->
          <!--</div>-->
          <!--<div class="db">-->
            <!--<Button @click="linkProMadel" class="mr10"><i class="iconfont mr5 iconshenheicon"></i> 查看审批</Button>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</section>-->
    <section class="con-box">
      <div class="inner-box">
        <div class="con-split con-mixture-split" ref="paneLeft">
          <Split v-model="split1" min="200" max="500">
            <div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">
              <div class="pane-made-hd">
                配比清单：
                <Button class="mr10" @click="addPro"><Icon type="md-add"/> 新增</Button>
                <Button type="default" @click="search" class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
              </div>
              <Table :height="heightWrap"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="true" :columns="columns" :data="tbdata"></Table>
              <Page simple class-name="fl pt10" size="small" :current="page.num" :total="100" :page-size="page.size" @on-change="changePage"
                    @on-page-size-change="changeSize" show-sizer show-total>
              </Page>
            </div>
            <div slot="right" class="con-split-pane-right pl5">
              <div class="pane-made-hd">
                <Input class="w120 mr10" v-model="value"></Input>
                <Button type="warning" @click="search" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>查询</Button>
                <Button type="default" @click="search" class="mr10"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>
                <Button class="mr10" @click="addPro"><Icon type="md-add"/> 添加物料</Button>
                <Button type="default" @click="search" class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
              </div>
              <div class="clearfix">
                <Table :height="heightWrap" @on-current-change="selectTabelData" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
              </div>
              <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
                    @on-page-size-change="changeSize" show-sizer show-total></Page>
            </div>
          </Split>
        </div>
      </div>

      <!--<Table @on-current-change="selectTabelData" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>-->

    </section>

    <Modal v-model="linkModal" title="产品资源" width="1250">
      <div class="lease-model-body">
        <Split v-model="split1" min="400" max="500">
          <div slot="left" class="lease-model-left">
            <div class="model-left-hd flex">
              <Button @click="search" class="mr10 w90"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
              <Button @click="inHideShow(false)" class="mr10"><i class="iconfont iconkuodaicon"></i></Button>
              <Button @click="inHideShow(true)" class="mr10"><i class="iconfont iconsuoxiaoicon"></i></Button>
              <Input v-model="searchValue" placeholder="请填写产品名称" class="w150 mr10" clearable></Input>
              <Button type="warning" @click="search" class="w90"><i class="iconfont mr5 iconchaxunicon"></i>查询</Button>
            </div>
            <Tree :data="treeData" show-checkbox></Tree>
          </div>
          <div slot="right" class="demo-split-pane">
            <div class="model-left-hd flex">
              <Input v-model="searchValue" class="w150 mr10" clearable></Input>
              <Input v-model="searchValue" placeholder="资源ID" class="w150 mr10" clearable></Input>
              <Button type="default" @click="search" class="mr10 w90"><i class="iconfont mr5 iconshuaxinicon"></i>刷新</Button>
              <Button type="default" @click="search" class="mr10 w90"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>
              <Button type="default" @click="search" class="mr10 w90"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>
              <Button type="default" @click="search" class="w90"><Icon type="md-close" />取消</Button>
            </div>
          </div>
        </Split>
      </div>
      <div slot='footer'>
        <Button type='primary' @click='submit'>确定</Button>
        <Button type='default' @click='linkModal = false'>取消</Button>
      </div>
    </Modal>

    <Modal v-model="proModal" :title="proModalTit" width="600">
      <Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <Row>
          <Col span="11">
            <FormItem label="产品名称" prop="name">
              <Input v-model="formValidate.name"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="产品类型" prop="type">
              <Select v-model="formValidate.type">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.type==1">
          <Col span="22">
            <FormItem label="接口地址" prop="address">
              <Input v-model="formValidate.address"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.type==1">
          <Col span="11">
            <FormItem label="单次扣减华币" prop="coin">
              <Input v-model="formValidate.coin" ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.type!=1">
          <Col span="11">
            <FormItem label="销售价" prop="salesPrice">
              <Input v-model="formValidate.salesPrice"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="有效期(天)" prop="isCycle">
              <Input v-model="formValidate.isCycle"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="产品描述" prop="remark">
              <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="是否禁用" prop="disable">
              <Select v-model="formValidate.disable" placeholder="Select your city">
                <Option value='0'>是</Option>
                <Option value='1'>否</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot='footer'>
        <Button type='primary' @click='submit("proModal")'>确定</Button>
        <Button type='default' @click='proModal = false'>取消</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import '../../../lease/product/lease.less'
  import './mixture.less'
  export default {
    name: 'mixtureRatio',
    inject:['reload'],
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
        purchaseType:0,


        linkModal: false,
        proModal:false,
        proModalTit:'',
        split1:0.2,
        searchValue: '',
        dateTime: '',
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
        formValidate: {
          name: '',
          type: 0,
          salesPrice: '',
          isCycle: '',
          remark: '',
          disable: '1',
          address:'',
          coin:0
        },
        ruleValidate: {
          name: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          salesPrice: [
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
        proType:[],
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
            key:'id'
          },
          {
            title: '状态',
            key: 'venderSkuNo',
            minWidth: 70,
            render:(h,params) => {
              return h('span',{
                class:'table-radio'
              })
            }
          },
          {
            title: '产品名称',
            key: 'name',
            minWidth: 170
          },
          {
            title: '接口地址',
            key: 'address',
            minWidth: 120
          },
          {
            title: '有效期（天）',
            key: 'isCycle',
            minWidth: 140
          },
          {
            title: '销售价',
            key: 'salesPrice',
            minWidth: 120
          },
          {
            title: '是否禁用',
            key: 'disable',
            minWidth: 200
          },
          {
            title: '产品描述',
            key: 'remark',
            minWidth: 100
          },
          {
            title: '创建人',
            align:'center',
            key: 'qualitySourceName',
            minWidth: 170,
            render:(h,params) => {
              return h('span',params.row.qualitySourceName)
            }
          },
          {
            title: '创建时间',
            key: 'categoryName',
            minWidth: 170
          },
          {
            title: '修改人',
            key: 'former',
            minWidth: 170
          },
          {
            title: '修改时间',
            key: 'createTime',
            minWidth: 170
          }
        ],
        tbdata: [],
        selectTable:{},
        heightWrap:0
      }
    },
    mounted() {
      this.initStart()
      this.$nextTick(()=>{
        this.heightWrap = this.$refs.paneLeft.offsetHeight-90
      })
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
          params.name = searchValue
        }
        params.page = this.page.num - 1
        params.size = this.page.size
        this.loading = false
        // getLeaseProlist(params).then(res => {
        //   this.loading = false
        //   if (res.code == 0) {
        //     this.tbdata = res.data || []
        //     this.page.total = res.totalElements
        //   }
        //
        // })
      },
      //新增产品
      addPro(){
        this.proModal = true
        this.proModalTit = '新增产品'
        this.$refs['proModal'].resetFields();
        if(this.formValidate.id){
          delete this.formValidate.id
        }
      },
      //编辑产品
      editPro(){
        this.$refs['proModal'].resetFields();
        if(this.selectTable.id){
          this.proModal = true
          this.proModalTit = '编辑产品'
          this.formValidate.name = this.selectTable.name
          this.formValidate.type = this.selectTable.type
          this.formValidate.salesPrice = this.selectTable.salesPrice
          this.formValidate.isCycle = this.selectTable.isCycle
          this.formValidate.remark = this.selectTable.remark
          this.formValidate.address = this.selectTable.address
          this.formValidate.coin = this.selectTable.coin
          this.formValidate.id = this.selectTable.id
          this.formValidate.disable = this.formValidate.disable.toString()
        }else{
          this.$Message.error("请选择要修改的数据！")
        }
      },
      //相关产品资源
      linkProMadel(){
        if(this.selectTable.id){
          this.linkModal = true
        }else{
          this.$Message.error("请选择要修改的数据！")
        }
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
      //树形展开收缩
      inHideShow(isB){
        this.hideShow(isB,this.treeData)
      },
      hideShow(isB,treeData){
        treeData.map((item)=>{
          item.expand = !isB
          if(item.children&&item.children.length>0){
            this.hideShow(isB,item.children)
          }
        })
      },
      //表格单选选中
      selectTabelData(v){
        this.selectTable = v
      },
      getDataQuick(v){
        console.log(v)
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

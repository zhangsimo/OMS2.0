<template>
  <main class="dia-log">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="title center">
            <Input v-model="code" placeholder="请输入编码" style="width: 140px;" class="mr10" />
            <Input v-model="fullname" placeholder="请输入名称" style="width: 140px;" class="mr10" />
            <Input v-model="carType" placeholder="请输入品牌车型" style="width: 140px;" class="mr10" />
            <Input v-model="pinyin" placeholder="请输入拼音" style="width: 140px;" class="mr10" />
            <Select v-model="selectTypes" style="width:140px">
              <Option
                v-for="item in typesList"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <Button class="ml10 w90" @click="query" type="warning">
            <span class="center">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </span>
          </Button>
        </div>
      </div>
    </section>
    <!--主要-->
    <section class="con-box dia-main">
      <Split v-model="split">
      <div slot="left" class="left pt10 pb10 pl10">
        <Tree :data="treeData" show-checkbox @on-select-change="getTree"></Tree>
      </div>
      <div slot="right" class="right tab-warp">
        <div class="p10">
          <Button class="mr10" @click="Choose">
              <span class="center">
                <Icon custom="iconfont iconxuanzetichengchengyuanicon icons" />选择
              </span>
          </Button>
        </div>
        <Table
          border
          highlight-row
          size="small"
          :loading="loading"
          :stripe="true"
          :columns="columns"
          :data="tbdata"
          @on-current-change="selection"
        ></Table>
        <div class="page-warp">
            <Page
            class-name="page-con"
            :current="page.num"
            :total="page.total"
            :page-size="page.size"
            @on-change="changePage"
            @on-page-size-change="changeSize"
            show-sizer
            show-total
            show-elevator
            ></Page>
        </div>
      </div>
      </Split>
    </section>
  </main>
</template>

<script>
  import {classification,attributeQueryall,partBrandFindall} from '../../api/system/AccessoriesChoose/AccessoriesChoose'
  // 是否是数组
  const isArray = any => any && Array.isArray(any);
  // 树形图渲染
  const getTree = tree => {
    if (isArray(tree) && tree.length > 0) {
      tree.forEach(tel => {
        // tel.expand = false;
        tel.title = tel.name;
        if(tel.disabled) {
          Reflect.deleteProperty(tel, 'disabled');
        }
        getTree(tel.children);
      });
    } else {
      return;
    }
  };
export default {
  name: "dia-log",
  data() {
    return {
      split: .24,
      // 名称
      fullname: "",
      // 编码
      code: "",
      //品牌车型
      carType: '',
      //拼音
      pinyin:'',
      // 电话
      mobile: "",
      // 选中的类型
      selectTypes: "",
      // 选择类型
      typesList: [],
      // 显示禁用
      showDis: false,
      // 省市区
      treeData: [],
      // 加载中
      loading: false,
      // 表头
      columns: [
        {
          title: "基础信息",
          align: "center",
          children: [
            {
              title: "序号",
              align: "center",
              type: "index",
              minWidth: 80
            },
            {
              title: "品质",
              align: "center",
              key: "qualityTypeName",
              minWidth: 120
            },
            {
              title: "品牌",
              align: "center",
              key: "partBrandName",
              minWidth: 120
            },
            {
              title: "编码",
              align: "center",
              key: "code",
              minWidth: 120
            },
            {
              title: "名称",
              align: "center",
              key: "name",
              minWidth: 120
            },
            {
              title: "全称",
              align: "center",
              key: "fullName",
              minWidth: 120
            },
            {
              title: "单位",
              align: "center",
              key: "unit",
              minWidth: 120
            },
            {
              title: "规格",
              align: "center",
              key: "spec",
              minWidth: 120
            },
            {
              title: "品牌车型",
              align: "center",
              key: "applyCarModel",
              minWidth: 120
            },
            {
              title: "一级分类",
              align: "center",
              key: "carTypeIdFir",
              minWidth: 120
            },
            {
              title: "二级分类",
              align: "center",
              key: "carTypeIdSen",
              minWidth: 120
            },
            {
              title: "三级分类",
              align: "center",
              key: "carTypeIdThr",
              minWidth: 120
            },
            {
              title: "生产厂家",
              align: "center",
              key: "origin",
              minWidth: 120
            },
            {
              title: "型号",
              align: "center",
              key: "model",
              minWidth: 120
            },
            {
              title: "配件ID",
              align: "center",
              key: "id",
              minWidth: 120
            }
          ]
        }
      ],
      // 表身
      tbdata: [],
      // tenantres
      // 分页
      page: { num: 1, size: 10, total: 100 },
      //选择的数组
      chooseArr: [],
      //选中的数据
      rowMessage:null,
      //判断是否重复的数组
      norepeatArr:[],
      TreeName: ''
    };
  },
  // 接受父组件的数据
  // props: ['msgArr'],
  computed: {
    newpid() {
      return this.$store.state.user.changeDialog;
    }
  },
  mounted() {
    this.leftgetList()
    this.rightgetList()
    let params = {}
    partBrandFindall(params).then(res => {
        this.typesList = res.data
    })
  },
  methods: {
    //点击树形图的
    getTree(a){
      this.TreeName = a[0].name
      // console.log(this.TreeName)
      this.rightgetList()
    },
    //选中某一行
    selection(row){
      this.rowMessage = row
      // console.log(this.rowMessage)
    },
    // 查询
    query(){
      this.page.num = 1
      this.rightgetList()
    },
    // 选择
    selected() {},
    // 取消
    // cancel() {
    //   this.chooseArr = []
    //   console.log(this.chooseArr)
    // },
    // 翻页
    changePage(p) {
      this.page.num = p;
    },
    // 修改每页显示条数
    changeSize(size) {
      this.page.num = 1;
      this.page.size = size;
    },
    //初始化
    leftgetList(){
      let params = {}
      classification(params).then(res => {
        if(res.code === 0){
          this.treeData = res.data
          getTree(this.treeData);
        }
      })
    },
    rightgetList() {
      let params = {}
      let data = {}
      if (this.code) {
        data.queryCode = this.code
      }
      if (this.fullname){
        data.fullName = this.fullname
      }
      if(this.TreeName){
        data.fullName = this.TreeName
      }
      if (this.carType) {
        data.applyCarModel = this.carType
      }
      if(this.pinyin){
        data.namePy = this.pinyin
      }
      if(this.selectTypes){
        data.partBrandId = this.selectTypes
      }
      params.page = this.page.num - 1
      params.size = this.page.size
      attributeQueryall({params:params,data:data}).then(res => {
        if(res.code === 0){
          this.tbdata = res.data.content || []
          this.page.total = res.data.totalElements
        }
      })
    },
    //选择按钮
    Choose(){
      if(this.rowMessage === null){
        this.$Message.warning('请选择要添加的对象')
      }else{
          let res = this.chooseArr.every(el => el.id !== this.rowMessage.id)
          if(res){
            this.chooseArr.push(this.rowMessage)
            console.log(this.chooseArr)
            this.$emit('getMsg',this.chooseArr)
            this.$emit('getMsgTwo',this.chooseArr)
            // this.chooseArr = []
          }else{
              this.$Message.warning('该对象已加入')
          }
      }
    },
    unique(arr) { // 根据唯一标识orderId来对数组进行过滤
      const res = new Map();  //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.partId) && res.set(arr.partId, 1))
    },
  },
  watch:{
    newpid:{
      handler(v,ov){
        this.rightgetList()
      },
      deep:true
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../view/lease/tenantres/icon");
.dia-log {
  .left {
    border-right: solid 1px #e5e5e5;
  }
  .riget {
    flex: auto;
  }
  .wlf > div {
    padding-top: 0;
  }
  .dia-main {
    height: 440px;
    border: solid 1px #e5e5e5;
    display: flex;
  }

  .dia-main {
    margin-top: 16px;
    .left {
      overflow: auto;
      height: 440px;
    }
    .tab-warp {
      height: 440px;
      overflow-y: auto;
      .page-warp {
          padding: 10px 20px;
          text-align: right;
      }
    }
  }
}
</style>

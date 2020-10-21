<template>
  <section class="oper-box pt10">
    <div class="flex">
      <div class="con-box flex">
        <div class="wlf">
          <div class="db mr10">
            <quick-date ref="quickDate" @quickDate="getDataQuick"></quick-date>
          </div>
          <div class="db mr10">
            <span class="mr10">公司名称：</span>
            <Select
              v-model="search.orgid"
              class="w120"
              :disabled="selectShopList"
              filterable
              clearable
            >
              <Option
                v-for="item in shoppingList"
                :value="item.id"
                :key="item.id"
              >{{ item.shortName }}
              </Option
              >
            </Select>
            <Checkbox class="mr20 ml10" v-model="search.guestPart">
              包含内部客户
            </Checkbox>
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
            <Poptip placement="bottom-start" v-model="moreModel">
              <Button class="mr10" @click="moreOpen">更多查询</Button>
              <div slot="content" class="h300 pr20" style="overflow-y: scroll">
                <div class="data ml10 pl50">
                  <Row class="mb20">
                    <span class="ml5">出库日期: </span>
                    <DatePicker
                      type="daterange"
                      placement="bottom-end"
                      style="width: 300px"
                      class="ml10"
                      v-model="search.enterDate"
                    ></DatePicker>
                  </Row>
                </div>
                <Form :label-width="100" class="ml10 pl25">
                  <FormItem label="客户编码: ">
                    <Input type="text" class="w300 ml5" v-model="search.guestCode"/>
                  </FormItem>
                  <FormItem label="客户名称: ">
                    <Input type="text" class="w300 ml5" v-model="search.guestName"/>
                  </FormItem>
<!--                  <FormItem label="客户分类: ">-->
<!--                    <el-cascader-->
<!--                      ref="casecader"-->
<!--                      size="small"-->
<!--                      :options="treeDiagramList"-->
<!--                      @change="getGYSFLlist"-->
<!--                      :props="{ multiple: true, children: 'children',label:'title',value:'id' }"-->
<!--                      collapse-tags-->
<!--                      clearable></el-cascader>-->
<!--                  </FormItem>-->
                  <FormItem label="配件内码: ">
                    <Input type="text" class="w300 ml5" v-model="search.partId"/>
                  </FormItem>
                  <FormItem label="配件编码: ">
                    <Input type="text" class="w300 ml5" v-model="search.partCode"/>
                  </FormItem>
                  <FormItem label="配件名称: ">
                    <Input type="text" class="w300 ml5" v-model="search.partName"/>
                  </FormItem>
                  <FormItem label="配件一级: ">
                    <Select v-model="search.partTypeF" @on-change="changetype" class="w300 ml5" filterable>
                      <Option
                        v-for="item in typepf"
                        :value="item.typeId"
                        :key="item.typeId"
                      >{{item.name}}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="配件二级: ">
                    <Select v-model="search.partTypeS" @on-change="changetypeS" class="w300 ml5" filterable>
                      <Option
                        v-for="item in typeps"
                        :value="item.typeId"
                        :key="item.typeId"
                      >{{item.name}}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="品牌车型: ">
                    <Select
                      @on-change="getSelectCarBrand"
                      class="w300 ml5"
                      v-model="search.carModelName"
                      filterable
                    >
                      <Option
                        v-for="item in carObj.carBrandData"
                        :value="item.erpCarBrandId"
                        :key="item.erpCarBrandId"
                      >{{item.nameCn}}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="品牌: ">
                    <Select
                      class="w300 ml5"
                      clearable
                      label-in-value
                      filterable
                      remote
                      :remote-method="partBrandRemote"
                      @on-change="select1"
                      v-model="search.partBrand"
                      placeholder="请选择品牌"
                    >
                      <Option
                        v-for="item in bandArr"
                        :value="item.label"
                        :key="item.id"
                      >{{ item.label }}
                      </Option
                      >
                    </Select>
                  </FormItem>
                </Form>
                <Row>
                  <Col span="18">
                    <Row>
                      <Col span="6">
                        <Button class="mr15" type="primary" @click="query">确定</Button>
                      </Col>
                      <Col span="12">
                        <Button @click="cancelContent(0)">取消</Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="6" class="flex" style="flex-direction: row-reverse;">
                    <Button class="mr15" type="primary" @click="cancelContent(1)">清空条件</Button>
                  </Col>
                </Row>
              </div>
            </Poptip>
            <Button @click="exportxls" v-has="'export'">导出</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from "moment";
  import QuickDate from "_c/getDate/dateget2";
  import * as api from "_api/reportForm/index.js";
  import {creat} from "@/view/settlementManagement/components";
  import {getBrandList} from "@/view/reportForm/until.js"
  import {ToDayStr} from "_c/getDate/index_bill.js"
  import {getShop} from "@/api/set/userManagement";
  import { getClientTreeList } from "@/api/system/essentialData/clientManagement";
  import {getCarPartClass} from "_api/parts";
  import {getCarBrandAll} from "_api/system/systemSetting/Initialization";

  export default {
    components: {QuickDate},
    props: {
      type: {
        default: 0,
        type: Number
      }
    },
    data() {
      return {
        stores: [{id: 0, name: "全部"}], // 门店
        quickDates: [], // 快速日期查询
        bandArr: [],//品牌
        typepf: [],//一级分类
        typeps: [],//二级分类
        brandBrandBool: false,//品牌加载
        carObj: {
          carBrandData: []//适用车型
        },
        Subordinate: [
          {
            label: "华胜连锁",
            value: 0
          },
          {
            label: "体系外",
            value: 1
          },
          {
            label: "体系内",
            value: 2
          }
        ],//客户体系
        treeDiagramList: "",//客户分类
        treeDiagramPartList: [],//配件分类
        shoppingList: [{id: "", shortName: "全部", fullName: "全部", name: "全部"}],//门店数组
        search: {
          isPanne: true,
          guestPart: true,//包含内部客户
          showPerson: 1,
          guestCode: "",//客户编码
          guestName: "",//客户名称
          belongSystem: "",//客户体系
          treeDiagramList: [],//客户分类
          partTypeF: "",//配件一级分类
          partTypeS: "",//配件二级分类
          carModelName: "",//品牌车型
          partBrand: "",//配件品牌
          partId: "",//配件内码
          partCode: "",//配件编码
          enterDate: ToDayStr(), // 提交日期
          orgid: "" // 门店
        },
        moreModel:false,//更多查询是否开启
      };
    },
    watch: {
      search: {
        handler: async function (val, oldVal) {

        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      }
    },
    async mounted() {
      let resE = await getShop();
      if (resE.code == 0) {
        this.shoppingList = [...this.shoppingList, ...resE.data];
      }
      var arr = await creat("", this.$store);
      this.search.orgid = arr[1];
      this.query();
      if (this.typepf.length == 0) {
        this.treeInit();
      }
      if(this.treeDiagramList.length==0){
        this.getTreeList()
      }
      if(this.carObj.carBrandData.length<1){
        this.getCarBrand()
      }
    },
    methods: {
      changeShowPerson() {
        this.search.showPerson = this.search.guestPart ? 1 : 0;
      },
      //客户等级
      getTreeList() {
        getClientTreeList().then(res => {
          if (res.code == 0) {
            this.list = res.data;
            let leverOne = [];
            let leverTwo = [];
            leverOne = res.data.filter(item => item.lever == 1);
            leverTwo = res.data.filter(item => item.lever == 2);
            leverOne.map(item => {
              item.children = [];
              item.code = item.id;
            });
            leverOne.map(item => {
              leverTwo.forEach(el => {
                if (item.id == el.parentId) {
                  item.children.push(el);
                }
              });
            });
            this.treeDiagramList = leverOne;
          }
        });
      },
      //客户分类 点击
      getGYSFLlist(v) {
        if (v.length == 0) {
          return this.search.treeDiagramList = []
        }
        this.search.treeDiagramList = v;
      },
      async getPartClassify() {
        let res = await getCarPartClass();
        this.treeDiagramPartList = res;
      },
      //一级分类二级分类接口初始化数据
      async treeInit() {
        let res = await getCarPartClass();
        this.typepf = res;
        if (this.search.partTypeF) {
          this.changetype(this.search.partTypeF);
        }
      },
      changetype(v) {
        let item = this.typepf.filter(el => el.typeId === v);
        if (item.length == 0) {
          return
        }
        // this.search.carTypefName = item[0].title || item[0].name;
        this.typeps = item[0].children
      },
      changetypeS(v) {
        let item = this.typeps.filter(el => el.typeId === v);
        if (item.length == 0) {
          return
        }
        // this.search.carTypesName = item[0].title || item[0].name;
      },
      //获取所有车型品牌
      getCarBrand() {
        let req = {}
        getCarBrandAll(req).then(res => {
          let arrData = res.data || []
          this.carObj.carBrandData = arrData.map(item => {
            let obj = {...item};
            obj.id = item.id
            obj.nameCn = item.nameCn
            return obj
          })
        })
      },
      getSelectCarBrand() {

      },
      select1(option) {
        this.search.partBrand = option.label;
      },
      //品牌模糊搜索
      async partBrandRemote(query) {
        this.brandBrandBool = true
        var queryName = query
        if (query == "") {
          queryName = ""
        } else {
          queryName = query.trim()
        }
        this.bandArr = await getBrandList(queryName)
        this.brandBrandBool = false
      },
      // 快速日期查询
      async getDataQuick(v) {
        this.search.enterDate = v;
        if (this.selectShopList) {
          var arr = await creat("", this.$store);
          this.search.orgid = arr[1];
        }
        this.query()
      },
      // 更多
      moreOpen() {
        this.resetMoreReseach()
      },
      // 查询
      query() {
        this.moreModel=false;
        let data = {};
        for (let key in this.search) {
          if (this.search[key]) {
            if (key == "enterDate") {
              if (this.search["enterDate"][0]) {
                data.enterDateStart =
                  moment(this.search["enterDate"][0]).format("YYYY-MM-DD") +
                  " 00:00:00";
                data.enterDateEnd =
                  moment(this.search["enterDate"][1]).endOf("day").format("YYYY-MM-DD HH:mm:ss");
              }
              this.search.guestPart == true ? this.search.showPerson = 1 : this.search.showPerson = 0
            } else {
              data[key] = this.search[key];
            }
          }
        }
        if (this.quickDates.length >= 2 && this.quickDates[0]) {
          data.enterDateStart = this.quickDates[0];
          data.enterDateEnd = this.quickDates[1];
        }
        this.$emit("search", data);
      },
      //更多查询清空
      async resetMoreReseach() {
        let data= {
          isPanne: true,
          guestPart: this.search.guestPart,//包含内部客户
          showPerson: this.search.showPerson,
          guestCode: "",//客户编码
          guestName: "",//客户名称
          belongSystem: "",//客户体系
          treeDiagramList: [],//客户分类
          partTypeF: "",//配件一级分类
          partTypeS: "",//配件二级分类
          carModelName: "",//品牌车型
          partBrand: "",//配件品牌
          partId: "",//配件内码
          partCode: "",//配件编码
          enterDate: [], // 提交日期
          orgid:this.search.orgid
        }
        this.search=data
      },
      cancelContent(type) {
        if (type == 0) {//更多点击取消 先清空再关闭
          this.resetMoreReseach();
          this.moreModel=false;
        } else if (type == 1) {//更多查询点击清空查询
          this.resetMoreReseach();
        }
      },
      getmoreData(data) {
        if (data != null) {
          this.$emit("search", data);
        }
      },
      exportxls() {
        this.$emit('export')
      }
    }
  };
</script>
<style scoped>
  .main .ivu-layout .con-box {
    border: 0;
    padding-top: 0;
  }

  .wlf > div {
    padding-top: 0;
  }
</style>

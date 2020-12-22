<template>
  <section class="oper-box pt10">
    <div class="flex">
      <div class="con-box flex">
        <Row class="wlf">
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
              >{{ item.shortName }}</Option>
            </Select>
            <Checkbox class="mr20 ml10" v-model="search.guestPart" @on-change="changeShowPerson">
              包含内部供应商
            </Checkbox>
          </div>
          <div class="db">
            <Button type="warning" @click="query" class="mr10">查询</Button>
            <Poptip placement="bottom-start" v-model="moreModel" @on-popper-hide="poperHide">
              <Button class="mr10" @click="moreOpen">更多查询</Button>
              <div slot="content">
                <Form :label-width="80" class="pl5 h270" :label-position="'left'" style="overflow-y: scroll;overflow-x: visible;">
                  <FormItem label="入库日期: " class="h20">
                    <DatePicker
                      type="daterange"
                      placement="bottom-start"
                      class="ml10 w300"
                      v-model="search.enterDate"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="供应商编码: " class="h20">
                    <Input type="text" class="w300 ml10" v-model="search.guestCode"/>
                  </FormItem>
                  <FormItem label="供应商名称: " class="h20">
                    <Input type="text" class="w300 ml10" v-model="search.guestName"/>
                  </FormItem>
                  <FormItem label="供应商体系: " class="h20">
                    <Select v-model="search.belongSystem" transfer class="ml10 mr10 w300">
                      <Option
                        v-for="item in Subordinate"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="供应商分类: " class="h20">
                    <el-cascader
                      ref="casecader"
                      class="ml10 mr10 w300"
                      size="small"
                      transfer
                      :options="supplierTypes"
                      placeholder=""
                      v-model="search.supplierTypes"
                      @change="getGYSFLlist"
                      :props="{ multiple: true, children: 'children',label:'title',value:'id' }"
                      :show-all-levels="true"
                      collapse-tags
                      clearable></el-cascader>
                  </FormItem>
                  <FormItem label="配件内码: " class="h20">
                    <Input type="text" class="w300 ml10" v-model="search.partId"/>
                  </FormItem>
                  <FormItem label="配件编码: " class="h20">
                    <Input type="text" class="w300 ml10" v-model="search.partCode"/>
                  </FormItem>
                  <FormItem label="配件名称: " class="h20">
                    <Input type="text" class="w300 ml10" v-model="search.partName"/>
                  </FormItem>
                  <FormItem label="配件分类" class="h20">
                    <Select
                      v-model="search.typeId"
                      @on-change="changetype"
                      class="ml10 mr10 w300"
                      filterable
                      transfer>
                      <Option
                        v-for="item in typepf"
                        :value="item.typeId"
                        :key="item.typeId"
                      >{{item.name}}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="适用车款: " class="h20">
                    <!--<Select-->
                      <!--@on-change="getSelectCarBrand"-->
                      <!--class="w300 ml10"-->
                      <!--v-model="search.carModelName"-->
                      <!--filterable-->
                    <!--&gt;-->
                      <!--<Option-->
                        <!--v-for="item in carObj.carBrandData"-->
                        <!--:value="item.erpCarBrandId"-->
                        <!--:key="item.erpCarBrandId"-->
                      <!--&gt;{{item.nameCn}}-->
                      <!--</Option>-->
                    <!--</Select>-->
                    <Input type="text" class="w300 ml10" v-model="search.carModelName"/>

                  </FormItem>
                  <FormItem label="品牌: " class="h20 pb30">
                    <Select
                      class="w300 ml10"
                      clearable
                      label-in-value
                      filterable
                      remote
                      transfer
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
                      </Option>
                    </Select>
                  </FormItem>
                </Form>
                <Row style="background-color: #ffffff;" class="pb5 pr30 w400">
                  <Col span="20">
                    <Row>
                      <Col span="7" class="ml5">
                        <Button type="primary" @click="query">确定</Button>
                      </Col>
                      <Col span="6">
                        <Button @click="cancelContent(0)">取消</Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="4" class="flex pl10" style="flex-direction: row-reverse;">
                    <Button type="primary" @click="cancelContent(1)">清空条件</Button>
                  </Col>
                </Row>
              </div>
            </Poptip>
            <Button @click="exportxls" v-has="'export'">导出</Button>
          </div>
        </Row>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from "moment";
  import QuickDate from "_c/getDate/dateget_w";
  import * as api from "_api/reportForm/index.js";
  import {creat} from "@/view/settlementManagement/components";
  import {getBrandList} from "@/view/reportForm/until.js"
  import {ToDayStr} from "_c/getDate/index_bill.js"
  import {getShop} from "@/api/set/userManagement";
  import {getSupplierTreeList} from '@/api/system/essentialData/supplierManagement'
  import {getCarPartClass} from "_api/parts";
  import {getCarBrandAll} from "_api/system/systemSetting/Initialization";
  import {ThisMonthStr} from "_c/getDate/index_bill.js"

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
        v1:ToDayStr(),
        stores: [{id: 0, name: "全部"}], // 门店
        quickDate: [], // 快速日期查询
        bandArr: [],//品牌
        typepf: [],//一级分类
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
        ],//供应商体系
        supplierTypes: [],//供应商分类
        list:[],
        shoppingList: [{id: "", shortName: "全部", fullName: "全部", name: "全部"}],//门店数组
        search: {
          isPanne: true,
          guestPart: true,//包含内部供应商
          showPerson: 1,
          guestCode: "",//供应商编码
          guestName: "",//供应商名称
          belongSystem: "",//供应商体系
          supplierTypes: [],//供应商分类
          typeId: "",//配件分类
          partBrand: "",//配件品牌
          carModelName: "",//品牌车型
          partId: "",//配件内码
          partCode: "",//配件编码
          enterDate: ToDayStr(), // 提交日期
          orgid: "" // 门店
        },
        moreModel: false,//更多查询
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
      if (this.getTreeList.length < 1) {
        this.getTreeList()
      }
      if (this.carObj.carBrandData.length < 1) {
        this.getCarBrand()
      }
      if (this.typepf.length < 1) {
        this.treeInit();
      }
      var arr = await creat("", this.$store);
      this.search.orgid = arr[1];
      // this.query();
    },
    methods: {
      changeShowPerson() {
        this.search.showPerson = this.search.guestPart==true ? 1 : 0;
      },
      //供应商等级
      getTreeList() {
        getSupplierTreeList().then(res => {
          if (res.code == 0) {
            let content = res.data || [];
            this.supplierTypes = this.treeDataFun(content)
          }
        })
      },
      treeDataFun(content) {
        let level1 = content.filter(item => item.lever === 1 );
        return this.treeFilterData(level1, content);
      },
      treeFilterData(treeData, content) {
        // treeData.map(item => {
        //   let arrData = content.filter(item1 => item1.parentId == item.id);
        //   if (arrData.length > 0) {
        //     item.children = this.treeFilterData(arrData, content)
        //   } else {
        //     item.children = null
        //   }
        // })
        return treeData
      },
      //供应商分类 点击
      getGYSFLlist(v) {
        if (v.length == 0) {
          return this.search.supplierTypes = []
        }
        this.search.supplierTypes = v;
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
        this.search.partBrand = option.value;
      },
      //品牌模糊搜索
      async partBrandRemote(query) {
        var queryName = query
        if (query == "") {
          queryName = ""
        } else {
          queryName = query.trim()
        }
        this.bandArr = await getBrandList(queryName)
      },
      //一级分类二级分类接口初始化数据
      async treeInit() {
        let res = await getCarPartClass();
        this.typepf = res;
        // console.log(res,11111)
        if (this.search.typeId) {
          this.changetype(this.search.typeId);
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
      // 快速日期查询
      async getDataQuick(v) {
        this.v1=v
        this.search.enterDate = v;
        var arr = await creat("", this.$store);
        this.search.orgid = arr[1];
        this.query()
      },
      getnew(data){
     let hh=moment(data[1]).format("YYYY-MM-DD")
      let ha=moment(data[0]).format("YYYY-MM-DD")
    
      let d=(new Date(hh).getTime()-new Date(ha).getTime())/(1000*3600*24)
      return d
    },
      // 查询
      query() {  
        let val=this.getnew(this.search.enterDate)
         if(val>31){
           this.search.enterDate=this.v1
            return this.$message({message:'入库日期跨度不可超过一个月',type:'error'})
         }
        this.moreModel = false;
        this.$emit("search", this.search);
      },
      // 更多
      moreOpen() {
        this.resetMoreReseach()
      },
      //更多查询清空
      async resetMoreReseach() {
        let data = {
          isPanne: true,
          guestPart: this.search.guestPart,//包含内部供应商
          showPerson: this.search.showPerson,
          guestCode: "",//供应商编码
          guestName: "",//供应商名称
          belongSystem: "",//供应商体系
          supplierTypes: [],//供应商分类
          typeId: "",//配件分类
          partBrand: "",//配件品牌
          carModelName: "",//品牌车型
          partId: "",//配件内码
          partCode: "",//配件编码
          enterDate: this.search.enterDate, // 提交日期
          orgid: this.search.orgid
        }
        this.search = data;
      },
      cancelContent(type) {
        if (type == 0) {//更多点击取消 先清空再关闭
          this.resetMoreReseach()
          // this.search.enterDate = ThisMonthStr()
          this.moreModel = false;
        } else if (type == 1) {//更多查询点击清空查询
          this.resetMoreReseach();
        }
      },
      poperHide() {
        this.moreModel = false;
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

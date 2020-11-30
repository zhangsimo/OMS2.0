<template>
    <Modal v-model="subjectModelShowassist"  title="选择辅助核算" class="funtPa" width="750" @on-ok="confirmFuzhu" @on-visible-change="showOrhideModel">
      <Form :value="AssistAccounting">
        <Tabs type="card" v-model="currTab">
          <TabPane label="客户" name="client">
            <div>
              <div>
                <Form inline :label-width="50" class="formBox">
                  <FormItem label="客户：">
                    <Input
                      v-model="FullNameOrCode"
                      style="width: 200px"
                      placeholder="客户编码或简称、全称"
                      class="mr10"
                    />
                    <Checkbox v-model="dealings">内部往来</Checkbox>
                    <Button type="warning" class="mr10" @click="searchClient">查询</Button>
                  </FormItem>
                </Form>
              </div>
              <div>
                <vxe-table
                  border
                  resizable
                  :data="AssistTableDataKeHu"
                  size="mini"
                  align="center"
                  :auto-resize="true"
                  @radio-change="radioChangeEventClient"
                  highlight-hover-row
                  highlight-current-row
                  show-overflow
                  height="500"
                >
                  <vxe-table-column type="radio" title="选择"></vxe-table-column>
                  <vxe-table-column field="code" title="客户编码"></vxe-table-column>
                  <vxe-table-column field="shortName" title="客户简称"></vxe-table-column>
                  <vxe-table-column field="fullName" title="客户全称"></vxe-table-column>
                </vxe-table>
              </div>
              <div>
                <Page
                  size="small"
                  :total="client.page.total"
                  :page-size="client.page.size"
                  :current="client.page.num"
                  :page-size-opts="client.page.sizeOpts"
                  show-sizer
                  show-total
                  show-elevator
                  @on-change="selectNumClient"
                  @on-page-size-change="selectPageClient"
                  style="float: right;margin-top: 10px;margin-right: 10px"
                />
              </div>
            </div>
          </TabPane>
          <TabPane label="供应商" name="supplier">
            <div>
              <div>
                <Form inline :label-width="70" class="formBox">
                  <FormItem label="供应商：">
                    <Input
                      v-model="SupperlierNameOrCode"
                      style="width: 200px"
                      placeholder="供应商编码或简称、全称"
                      class="mr10"
                    />
                    <Checkbox v-model="dealings">内部往来</Checkbox>
                    <Button type="warning" class="mr10" @click="searchSupperlier">查询</Button>
                  </FormItem>
                </Form>
              </div>
              <div>
                <vxe-table
                  border
                  resizable
                  :data="AssistTableDataGongYingShang"
                  size="mini"
                  align="center"
                  :auto-resize="true"
                  @radio-change="radioChangeEventSupplier"
                  highlight-hover-row
                  highlight-current-row
                  show-overflow
                  height="500"
                >
                  <vxe-table-column type="radio" title="选择"></vxe-table-column>
                  <vxe-table-column field="code" title="客户编码"></vxe-table-column>
                  <vxe-table-column field="shortName" title="客户简称"></vxe-table-column>
                  <vxe-table-column field="fullName" title="客户全称"></vxe-table-column>
                </vxe-table>
              </div>
              <div>
                <Page
                  size="small"
                  :total="supplier.page.total"
                  :page-size="supplier.page.size"
                  :current="supplier.page.num"
                  :page-size-opts="supplier.page.sizeOpts"
                  show-sizer
                  show-total
                  show-elevator
                  @on-change="selectNumsupplier"
                  @on-page-size-change="selectPagesupplier"
                  style="float: right;margin-top: 10px;margin-right: 10px"
                />
              </div>
            </div>
          </TabPane>
          <TabPane label="部门" name="department">
            <Form :label-width="50" ref="form">
              <FormItem label="部门:" prop="groundIds">
                <Cascader
                  :data="list"
                  v-model="groundIds"
                  placeholder="选择部门"
                  style="width: 250px"
                  @on-change="ListChange"
                ></Cascader>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="个人" name="personage">
            <Form :label-width="50" ref="form" inline>
              <!--              <FormItem label="部门:" prop="groundIds">-->
              <!--                <Cascader :data="list" v-model="groundIds" placeholder="营销中心" style="width: 250px"></Cascader>-->
              <!--              </FormItem>-->
              <FormItem label="姓名:">
                <Input v-model="personageName" placeholder="姓名" clearable style="width: 150px" />
              </FormItem>
              <FormItem>
                <Button type="warning" class="mr10" @click="SearchPersonal">查询</Button>
              </FormItem>
            </Form>
            <div>
              <vxe-table
                border
                resizable
                :data="AssistTableDataGeRen"
                size="mini"
                align="center"
                :auto-resize="true"
                @radio-change="radioChangeEventPersonage"
                highlight-hover-row
                highlight-current-row
                show-overflow
                height="465"
              >
                <vxe-table-column type="radio" title="选择"></vxe-table-column>
                <vxe-table-column field="userName" title="姓名"></vxe-table-column>
                <vxe-table-column field="phone" title="手机号"></vxe-table-column>
                <vxe-table-column field="groupName" title="所属部门"></vxe-table-column>
              </vxe-table>
            </div>
            <div>
              <Page
                size="small"
                :total="personage.page.total"
                :page-size="personage.page.size"
                :current="personage.page.num"
                :page-size-opts="personage.page.sizeOpts"
                show-sizer
                show-total
                show-elevator
                @on-change="selectNumpersonage"
                @on-page-size-change="selectPagepersonage"
                style="float: right;margin-top: 10px;margin-right: 10px"
              />
            </div>
          </TabPane>
          <TabPane label="其他辅助核算" name="Other">
            <div class="Other">
              <div class="OtherLeft">
                <ul>
                  <li
                    v-for="(item,index) in categoryArr"
                    :key="index"
                    style="height: 35px"
                    class="LiClass"
                    @click="LiClick(item,index)"
                    :class="[selectClass !== index ? 'weixuan':'xuan']"
                  >{{ item.dictName }}</li>
                </ul>
              </div>
              <div class="OtherRight">
                <div>
                  <span class="ml20">名称：</span>
                  <Input
                    v-model="accountingName"
                    style="width: 150px"
                    placeholder="核算名称"
                    class="mr10"
                  />
                  <Button type="warning" class="mr10" @click="OtherClick">查询</Button>
                  <Button type="warning" class="mr10" @click="ShowOtherAdd">新增</Button>
                </div>
                <div>
                  <vxe-table
                    border
                    resizable
                    :data="AssistTableDataOther"
                    size="mini"
                    align="center"
                    :auto-resize="true"
                    @radio-change="radioChangeEventOther"
                    highlight-hover-row
                    highlight-current-row
                    show-overflow
                    height="500"
                    style="margin-top: 10px;margin-left: 10px"
                  >
                    <vxe-table-column type="radio" title="选择"></vxe-table-column>
                    <vxe-table-column field="itemCode" title="编码"></vxe-table-column>
                    <vxe-table-column field="itemName" title="核算全称"></vxe-table-column>
                  </vxe-table>
                </div>
                <div v-show="this.dictName == '外部员工'">
                  <Page
                    size="small"
                    :total="outStaff.page.total"
                    :page-size="outStaff.page.size"
                    :current="outStaff.page.num"
                    :page-size-opts="outStaff.page.sizeOpts"
                    show-sizer
                    show-total
                    show-elevator
                    @on-change="selectoutStaffPage"
                    @on-page-size-change="selectoutStaffSize"
                    style="float: right;margin-top: 10px;margin-right: 10px"
                  />
                </div>
                <div>
                  <!--其他辅助核算弹框里新增弹框-->
                  <Modal v-model="OtherModalAdd" title="新增辅助核算名称" width="400">
                    <div>
                      <div style="height: 30px">所属辅助核算：{{ dictName }}</div>
                      <div style="margin: 10px 0">
                        <Form ref="formAdd" :model="formAdd" :rules="ruleformAdd" :label-width="80">
                          <FormItem label="名称：" prop="assistName">
                            <Input
                              v-model="formAdd.assistName"
                              placeholder="请输入名称"
                              style="width: 200px"
                            />
                          </FormItem>
                        </Form>
                      </div>
                    </div>
                    <div slot="footer">
                      <Button type="primary" @click="addAuxiliary" class="mr10">保存</Button>
                      <Button type="default" @click="OtherModalAdd = false">取消</Button>
                    </div>
                  </Modal>
                </div>
                <div>
                  <!--新增/修改外部员工-->
                  <Modal v-model="modalShow" title="新增外部员工" width="460px" :closable="false">
                    <addOutStaff ref="addOutStaff"></addOutStaff>
                    <div slot="footer" style="padding: 10px 0">
                      <Button type="primary" @click="submit">确认</Button>
                      <Button type="default" @click="cancel">退出</Button>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <div class="fund" v-show="Classification">
          <Form
            ref="formDynamic"
            :model="formDynamic"
            :rules="ruleValidateTwo"
            :label-width="80"
            style="width: 300px"
          >
            <FormItem label="款项分类:" prop="fund">
              <Select v-model="formDynamic.fund" placeholder="请选择" @on-change="dynamicChange">
                <Option
                  v-for="item in fundListZanshi"
                  :value="item.itemName"
                  :key="item.id"
                >{{ item.itemName }}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div class="fund" v-show="!Classification">
<!--          <Form :label-width="80" style="width: 300px">-->
<!--            <FormItem label="款项分类:" prop="fund">-->
<!--              <Select v-model="formDynamic.fund" placeholder="请选择">-->
<!--                <Option-->
<!--                  v-for="item in fundListZanshi"-->
<!--                  :value="item.itemName"-->
<!--                  :key="item.id"-->
<!--                >{{ item.itemName }}</Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
<!--          </Form>-->
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmFuzhu" class="mr10">保存</Button>
        <Button type="default" @click="subjectModelShowassist = false">取消</Button>
      </div>
    </Modal>
</template>
<script>
import {
  queryCreditLike,
  getStaffList,
  getDataDictionaryType,
  getcompany,
  kmType,
  saveTreeDetailItem,
} from "@/api/settlementManagement/VoucherInput"
import addOutStaff from "@/view/system/systemSetting/outStaffManagement/components/addOutStaff.vue"
import {addOutStaffeNew/**添加外部员工*/,getOutStaffNew} from "@/api/system/systemSetting/staffManagenebt"
export default {
  name:'voucherInput',
  components: {
    addOutStaff
  },
  props:['oneAccountent'],
  data(){
    return {
      currTab:'client',//当前tab页
      dealings: false, //内部往来勾选
      subjectModelShowassist: false, //辅助核算弹框
      AssistAccounting: "", //辅助核算弹框绑定值
      FullNameOrCode: "", //客户编码或名称、全称
      AssistTableDataKeHu: [], //辅助弹框客户
      client: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      },
      SupperlierNameOrCode: "", //供应商名称、全称
      AssistTableDataGongYingShang: [], //辅助弹框供应商
      auxiliaryTypeCode: "", //辅助弹框选的哪一个
      auxiliaryCode: "", //保存辅助弹框的编码
      supplier: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      },
      list: [], //部门列表
      groundIds: [], //部门
      personageName:"",//个人 查询 input框
      AssistTableDataGeRen: [], //辅助弹框个人
      personage: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      },
      outStaff: {
        page: {
          num: 1,
          size: 10,
          total: 0,
          sizeOpts: [10, 20, 50, 80, 100]
        } //分页
      },
      categoryArr: [], //类别数组
      selectClass: 0,
      accountingName: "", //核算名称
      OtherModalAdd: false, //其他辅助弹框新增弹框状态
      AssistTableDataOther: [], //辅助弹框其他
      dictCode:"CW0011X",
      dictName:"",
      formAdd: {
        assistName: "" //新增辅助核算名称
      },
      Classification: false, //款项分类是否需校验
      formDynamic: {
        fund: "", //款项分类
        code: ""
      },
      ruleValidateTwo: {
        fund: [
          {
            required: true,
            type: "string",
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      //其他辅助弹框表单验证
      ruleformAdd: {
        assistName: [
          {
            required: true,
            type: "string",
            message: "请选择输入名称",
            trigger: "blur"
          }
        ]
      },
      fundList: [], //款项分类数组
      fundListZanshi: [], //款项分类数组
      voucherList:[],//选中内容
      voucherItem:{},
      modalShow: false,
      isOutStaff: false,
    }
  },
  mounted() {
    // this.OtherClickTable();
    // this.fundGetList();
    // this.OtherGetlist(); //其他初始化
    // // this.SelectGetlistJi();
    // // this.businessType();
    // this.ClientgetList(); //客户初始化
    // this.SupperliergetList(); //供应商初始化
    // this.getListCompany(); // 公司
  },
  methods:{

    showOrhideModel(v){
      if(v){
        this.SupperlierNameOrCode = ''
        this.FullNameOrCode = ''
        this.formDynamic.fund = ''
        this.formDynamic.code = ''
        this.dealings = false
        if(this.AssistTableDataOther.length==0){
          this.OtherClickTable();
        }
        if(this.fundListZanshi.length==0){
          this.fundGetList();
        }

        if(this.categoryArr.length==0){
          this.OtherGetlist(); //其他初始化
        }


        // this.SelectGetlistJi();
        // this.businessType();

        this.ClientgetList()
        this.SupperliergetList()

        // if(this.AssistTableDataKeHu.length==0){
        //   this.ClientgetList(); //客户初始化
        // }
        // if(this.AssistTableDataGongYingShang.length==0){
        //   this.SupperliergetList(); //供应商初始化
        // }
        if(this.list.length==0){
          this.getListCompany(); // 公司
        }
      }
    },

    dynamicChange(v){
      this.fundListZanshi.forEach(item => {
        if(item.itemName === v){
          this.formDynamic.code = item.itemCode
        }
      })
    },

    // 计、收、付、转下拉框
    SelectGetlistJi() {
      let params = {};
      params.dictCode = "CW00010";
      kmType(params).then(res => {
        if (res.code === 0) {
          this.formPlan.cityList = res.data;
        }
      });
    },
    //业务类型
    businessType() {
      let params = {};
      params.dictCode = "CW00020";
      kmType(params).then(res => {
        if (res.code === 0) {
          this.formPlan.businessTypes.push(...res.data);
        }
      });
    },
    //辅助核算确定弹框
    confirmFuzhu() {
      if (this.Classification) {
        this.$refs.formDynamic.validate(valid => {
        if (valid) {
            if(!this.AssistAccounting){
              this.$message.error('请选择辅助核算');
              this.subjectModelShowassist = true
            } else {
              this.subjectModelShowassist = false;
              //this.addNewAssistAccounting.paymentTypeCode = this.formDynamic.fund;
              // this.oneAccountent.auxiliaryTypeCode = this.auxiliaryTypeCode; //是什么类型；
              // this.oneAccountent.auxiliaryCode = this.auxiliaryCode; //辅助核算的编码；
              // if (this.oneAccountent.auxiliaryTypeCode == "3") {
              //   this.oneAccountent.auxiliaryCode = this.departmentVal;
              // }
            }
          this.$emit("callBackFun", this.voucherItem,this.isOutStaff);
        } else {
            this.$Message.error("请选择款项分类!");
            this.subjectModelShowassist = true;
        }
        });
    } else {
        this.subjectModelShowassist = false;
        //this.addNewAssistAccounting.paymentTypeCode = this.formDynamic.fund;
        // this.oneAccountent.auxiliaryTypeCode = this.auxiliaryTypeCode; //是什么类型；
        // this.oneAccountent.auxiliaryCode = this.auxiliaryCode; //辅助核算的编码；
        // if (this.oneAccountent.auxiliaryTypeCode == "3") {
        //   this.oneAccountent.auxiliaryCode = this.departmentVal;
        // }
        this.$emit("callBackFun", this.voucherItem,this.isOutStaff);
      }
    },
    //获取公司
    async getListCompany() {
      let data = {};
      data.groupId = this.$store.state.user.userData.tenantGroupId;
      data.shopId = this.$store.state.user.userData.shopId;
      let res = await getcompany(data);
      if (res.code === 0) {
        let list = [];
        res.data.childs.forEach(item => {
          if (item.childs.length > 0) {
            list.push({
              value: item.id,
              label: item.name,
              children: item.childs,
              groupCode: item.groupCode
            });
          } else {
            list.push({
              value: item.id,
              label: item.name,
              children: [],
              groupCode: item.groupCode
            });
          }
        });
        list.forEach(item => {
          if (item.children.length > 0) {
            item.children.map(val => {
              val.value = val.id;
              val.label = val.name;
              if (val.childs.length > 0) {
                val.children = val.childs;
                val.children.map(v => {
                  v.value = v.id;
                  v.label = v.name;
                });
              } else {
                val.children = [];
              }
            });
          }
        });
        this.list = list;
      }
    },
    //客户搜索模糊查询
    searchClient() {
      this.ClientgetList();
    },
    // 客户刷新初始化
    ClientgetList() {
      let params = {};
      if (this.FullNameOrCode) {
          params.searchName = this.FullNameOrCode;
      }
      params.searchType = 0;
      params.page = this.client.page.num - 1;
      params.size = this.client.page.size;
      params.isInterior = this.dealings ? 2 : "";
      queryCreditLike(params).then(res => {
          if (res.code === 0) {
          this.AssistTableDataKeHu = res.data.content;
          this.client.page.total = res.data.totalElements;
          }
      });
    },
    //点击单选框获取辅助核算客户
    radioChangeEventClient({ row }) {
      this.AssistAccounting = row.fullName;
      this.auxiliaryTypeCode = "1";
      this.auxiliaryCode = row.code;
      this.voucherItem = row;
    },
    //客户分页切换页数
    selectNumClient(page) {
      this.client.page.num = page;
      this.ClientgetList();
    },
    //客户切换分页条数
    selectPageClient(size) {
      this.client.page.num = 1;
      this.client.page.size = size;
      this.ClientgetList();
    },
    //供应商刷新初始化
    SupperliergetList() {
      let params = {};
      if (this.SupperlierNameOrCode) {
        params.searchName = this.SupperlierNameOrCode;
      }
      params.searchType = 1;
      params.page = this.supplier.page.num - 1;
      params.size = this.supplier.page.size;
      params.isInterior = this.dealings ? 2 : "";
      queryCreditLike(params).then(res => {
        if (res.code === 0) {
          this.AssistTableDataGongYingShang = res.data.content;
          this.supplier.page.total = res.data.totalElements;
        }
      });
    },
    //供应商搜索模糊查询
    searchSupperlier() {
      this.SupperliergetList();
    },
    //点击单选框获取辅助核算供应商
    radioChangeEventSupplier({ row }) {
      this.AssistAccounting = row.fullName;
      this.auxiliaryTypeCode = "2";
      this.auxiliaryCode = row.code;
      this.voucherItem = row;
      // console.log(row)
    },
    //供应商切换页数
    selectNumsupplier(page) {
      this.supplier.page.num = page;
      this.SupperliergetList();
    },
    //供应商切换分页条数
    selectPagesupplier(size) {
      this.supplier.page.num = 1;
      this.supplier.page.size = size;
      this.SupperliergetList();
    },
    //部门改变
    ListChange(val, selectedData) {
      if (selectedData.length == 1) {
        this.AssistAccounting = selectedData[0].label;
        this.departmentVal = selectedData[0].groupCode;
        this.auxiliaryTypeCode = "3";
      } else {
        this.AssistAccounting = selectedData[selectedData.length - 1].name;
        this.departmentVal = selectedData[selectedData.length - 1].groupCode;
        this.auxiliaryTypeCode = "3";
      }
      this.voucherItem = {
        id: val[0]
      };
    },
    // 辅助弹框个人搜索
    SearchPersonal() {
      let stop = this.$loading();
      let data = {};
      data.size = this.personage.page.size;
      data.page = this.personage.page.num - 1;
      data.userName = "";
      data.phone = "";
      data.office = 0;
      data.shopId = this.$store.state.user.userData.shopId;
      // console.log(this.$store.state.user.userData.shopId);
      // data.groundIds = this.groundIds[this.groundIds.length - 1] || "";
      data.userName=this.personageName==""?"":this.personageName.trim();//个人查询 名字输入框
      getStaffList(data)
        .then(res => {
          stop();
          this.loading = false;
          if (res.code == 0) {
            this.AssistTableDataGeRen = res.data.content;
            this.personage.page.total = res.data.totalElements;
          }
        })
        .catch(err => {
          stop();
        });
    },
    //点击单选框获取辅助核算个人
    radioChangeEventPersonage({ row }) {
      this.AssistAccounting = row.userName;
      this.auxiliaryTypeCode = "4";
      this.auxiliaryCode = row.id;
      this.voucherItem = {};
    },
    //个人分页切换页数
    selectNumpersonage(page) {
      this.personage.page.num = page;
      this.SearchPersonal();
    },
    //个人切换分页条数
    selectPagepersonage(size) {
      this.personage.page.num = 1;
      this.personage.page.size = size;
      this.SearchPersonal();
    },
    //外部员工的分页
    selectoutStaffPage(page) {
      this.outStaff.page.num = page;
      this.getAllStaffList()
    },
    selectoutStaffSize(size) {
      this.outStaff.page.num = 1;
      this.outStaff.page.size = size;
      this.getAllStaffList()
    },
    //其他辅助核算初始化
    OtherGetlist() {
      let params = {};
      getDataDictionaryType(params).then(res => {
        if (res.code === 0) {
          let NewArr = res.data.filter(item => item.dictCode == "CW0011X");
          this.categoryArr = NewArr[0].children;
          this.categoryArr.push({dictName: '外部员工'})
        }
      });
    },
    // 其他辅助核算左侧列表点击事件
    LiClick(item, index) {
      this.accountingName = ''
      this.isOutStaff = false
      this.selectClass = index;
      this.dictName = item.dictName;
      if(this.dictName == "外部员工"){
        this.getAllStaffList()
        return 
      }
      this.dictCode = item.dictCode;
      let params = {};
      params.searchType = 1;
      if (this.accountingName) {
        params.itemName = this.accountingName;
      }
      if (item.dictCode) {
        params.dictCode = item.dictCode;
      }
      kmType(params).then(res => {
        if (res.code === 0) {
          this.AssistTableDataOther = res.data;
        }
      });
    },
    // 查询外部员工
    async getAllStaffList(){
      let params={
        page:this.outStaff.page.num-1,
        size:this.outStaff.page.size,
      }
      let data={}
      // data.orgid=this.$store.state.user.userData.currentShopId;
      data.fullName=this.accountingName?this.accountingName.trim():''
      //参数
      let res=await getOutStaffNew(params,data)
      if(res.code===0){
        this.AssistTableDataOther=res.data.content
        this.AssistTableDataOther.map(v => {
          v.itemCode = v.code
          v.itemName = v.fullName
        })
        this.outStaff.page.total=res.data.totalElements
      }
    },
    //添加外部员工
    submit(){
      this.$refs.addOutStaff.handleSubmit(()=>{
        let data = {}
        data=this.$refs.addOutStaff.data
        data.id=""
        data.isDisabled=1
        this.addOutStaffTrue(data);
        this.modalShow=false;
        this.$refs.addOutStaff.data={};
      })
    },
    //取消
    cancel(){
      this.$refs.addOutStaff.data={}
      this.modalShow=false
    },

    //添加外部员工接口
    async addOutStaffTrue(data){
      let res=await addOutStaffeNew(data)
      if(res.code===0){
        this.$Message.success("新增外部人员成功")
        this.getAllStaffList()
      }
    },
    //其他辅助核算查询
    OtherClick() {
      this.OtherClickTable();
    },
    //其他辅助核算表格初始化
    OtherClickTable() {
      let params = {};
      params.searchType = 1;
      if(this.dictName == '外部员工'){
        this.outStaff.page.num = 1
        this.getAllStaffList()
        return
      }
      if (this.accountingName) {
        params.itemName = this.accountingName;
      }
      if (this.dictCode) {
        params.dictCode = this.dictCode;
      }
      kmType(params).then(res => {
        if (res.code === 0) {
          this.AssistTableDataOther = res.data;
        }
      });
    },
    //其他新增
    ShowOtherAdd() {
      if(this.dictName == '外部员工'){
        this.modalShow = true
      }else{
        this.OtherModalAdd = true;
      }
    },
    //点击单选框获取辅助核算其他
    radioChangeEventOther({ row }) {
      this.AssistAccounting = row.itemName;
      if(this.dictName == '外部员工'){
        this.auxiliaryTypeCode = "CW00118";
        row.auxiliaryTypeCode = "CW00118"
        this.isOutStaff = true;
      }else{
        this.auxiliaryTypeCode = row.dictCode;
      }
      this.auxiliaryCode=row.itemCode;
      this.voucherItem = row;
      console.log(row)
    },
    //新增辅助核算名称保存
    addAuxiliary() {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          let data = {};
          data.itemName = this.formAdd.assistName;
          data.dictCode = this.dictCode;
          data.itemCode = tools.transTimesss(new Date());
          saveTreeDetailItem(data).then(res => {
            if (res.code === 0) {
              this.OtherClickTable();
              this.formAdd.assistName = "";
            } else {
              this.formAdd.assistName = "";
            }
          });
          this.$Message.success("新增成功!");
          this.OtherModalAdd = false;
        } else {
          this.OtherModalAdd = true;
          this.$Message.error("请输入名称!");
        }
      });
    },
    //其他辅助核算款项分类
    fundGetList() {
      let params = {};
      params.dictCode = "CW00131";
      kmType(params).then(res => {
        this.fundList = res.data;
        this.fundListZanshi=this.fundList.filter(vb=>this.oneAccountent[0].mateAccountCoding.indexOf(vb.itemValueOne)!=-1)
        if(this.fundListZanshi.length<1){
          this.Classification=false;
        }
      });
    },
  }
}
</script>
<style lang="less" scoped>
.Other {
  display: flex;
  height: 550px;
}
.OtherLeft {
  width: 103px;
  border-right: 1px solid #dddddd;
}
.OtherLeft > ul > li {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
}
.OtherLeft > ul > li:last-child {
  border-bottom: 1px solid #dddddd;
}
.OtherRight {
  width: 615px;
}
.xuan {
  background: #e8eaec;
  font-size: 15px;
}
.formBox .ivu-form-item {
  margin-bottom: 5px;
  margin-right: 5px;
}
.funtPa{
  position: relative;
}
.fund {
  position: absolute;
  top: 4pc;
  right: 1pc;
  z-index: 9999;
  //1pc=12pt=16px;
}
.LiClass:hover {
  cursor: pointer;
}
.LiClass {
  width: 100px;
}
</style>

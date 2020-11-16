<template>
  <div>
    <!--选择辅助核算-->
    <Modal v-model="subjectModelShowassist" title="选择辅助核算" width="750" @on-ok="confirmFuzhu" @on-visible-change="showOrhideModel">
      <Form :value="AssistAccounting">
        <Tabs type="card">
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
                    ></Input>
                    <Button type="warning" class="mr10" @click="searchClient">查询</Button>
                  </FormItem>
                </Form>
              </div>
              <div>
                <vxe-table
                  border
                  resizable
                  :data="AssistTableDataKeHu"
                  stripe
                  ref="AssistTableDataKeHu"
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
                    ></Input>
                    <Button type="warning" class="mr10" @click="searchSupperlier">查询</Button>
                  </FormItem>
                </Form>
              </div>
              <div>
                <vxe-table
                  border
                  resizable
                  ref="AssistTableDataGongYingShang"
                  :data="AssistTableDataGongYingShang"
                  stripe
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
          <TabPane label="部门" name="department" :disabled="$parent.titleName=='其他收款认领'">
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
                <Input v-model="personageName" placeholder="姓名" clearable class="w200" />
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
                stripe
                ref="AssistTableDataGeRen"
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
                  ></Input>
                  <Button type="warning" class="mr10" @click="OtherClick">查询</Button>
                  <Button type="warning" class="mr10" @click="ShowOtherAdd">新增</Button>
                </div>
                <div>
                  <vxe-table
                    border
                    resizable
                    :data="AssistTableDataOther"
                    ref="AssistTableDataOther"
                    stripe
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
                          ></Input>
                        </FormItem>
                      </Form>
                    </div>
                  </div>
                  <div slot="footer">
                    <Button type="primary" @click="addAuxiliary" class="mr10">确定</Button>
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
          </TabPane>
        </Tabs>
        <div class="fund" v-if="Classification">
          <Form
            ref="formDynamic"
            :model="formDynamic"
            :rules="ruleValidateTwo"
            :label-width="80"
            style="width: 300px"
          >
            <FormItem label="款项分类:" prop="fund">
              <Select v-model="formDynamic.fund" placeholder="请选择">
                <Option
                  v-for="item in fundListZanshi"
                  :value="item.itemName"
                  :key="item.id"
                >{{ item.itemName }}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmFuzhu" class="mr10">保存</Button>
        <Button type="default" @click="subjectModelShowassist = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  queryGuestList,
  queryCreditLike,
  queryAllSupplier,
  getcompany,
  getStaffList,
  getDataDictionaryType,
  kmType,
  saveTreeDetailItem,
  getTableList,
  BigSave,
  putImgUrl,
  getImgUrl,
  downLoding
} from "@/api/settlementManagement/VoucherInput";
import {getOutStaff/**获取全部外部员工*/,addOutStaffe/**添加外部员工*/,changeOutStaffEn/**修改启用禁用*/} from "@/api/system/systemSetting/staffManagenebt"
import addOutStaff from "@/view/system/systemSetting/outStaffManagement/components/addOutStaff.vue"
// import * as tools from "../../utils/tools";
import bus from "../../../bill/Popup/Bus";
export default {
  name: "AssistAccounting",
  props:['oneAccountent'],
  components: {
    addOutStaff
  },
  data() {
    return {
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
      Classification: false, //款项分类是否需校验
      formDynamic: {
        fund: "" //款项分类
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
      fundListZanshi:[],//款项分类数组
      AssistTableDataKeHu: [], //辅助弹框客户
      AssistTableDataGongYingShang: [], //辅助弹框供应商
      AssistTableDataGeRen: [], //辅助弹框个人
      AssistTableDataOther: [], //辅助弹框其他
      list: [], //部门列表
      groundIds: [], //部门
      personageName:"",//个人 查询 input框
      AssistAccounting: "", //辅助核算弹框绑定值
      FullNameOrCode: "", //客户编码或名称、全称
      SupperlierNameOrCode: "", //供应商名称、全称
      client: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      },
      supplier: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      },
      personage: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      },
      Other: {
        page: {
          num: 1,
          size: 100,
          total: 0,
          sizeOpts: [100, 200, 300, 400, 500]
        } //分页
      }, //其他辅助核算分页
      outStaff: {
        page: {
          num: 1,
          size: 10,
          total: 0,
          sizeOpts: [10, 20, 50, 80, 100]
        } //分页
      },
      subjectModelShowassist: false, //先隐藏弹框
      categoryArr: [], //类别数组
      dictCode: "CW00111", //用于保存dictCode
      dictName: "长期股权投资", //用于保存dictName
      accountingName: "", //核算名称
      OtherModalAdd: false, //其他辅助核算新增弹框
      formAdd: {
        assistName: "" //新增辅助核算名称
      },
      auxiliaryTypeCode: "", //辅助弹框选的哪一个
      selectClass: 0 ,//用于判断class
      modalShow: false,
    };
  },
  methods: {
    // 客户刷新初始化
    ClientgetList() {
      let params = {};
      if (this.FullNameOrCode) {
        params.searchName = this.FullNameOrCode;
      }
      params.searchType = 0;
      params.page = this.client.page.num - 1;
      params.size = this.client.page.size;
      queryCreditLike(params).then(res => {
        if (res.code === 0) {
          this.AssistTableDataKeHu = res.data.content;
          this.client.page.total = res.data.totalElements;
        }
      });
    },
    //客户搜索模糊查询
    searchClient() {
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
    //获取公司
    async getListCompany() {
      let data = {};
      data.groupId = this.$store.state.user.userData.tenantGroupId;
      let res = await getcompany(data);
      if (res.code === 0) {
        let list = [];
        res.data.childs.forEach(item => {
          if (item.childs.length > 0) {
            list.push({
              value: item.id,
              label: item.name,
              children: item.childs
            });
          } else {
            list.push({ value: item.id, label: item.name, children: [] });
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
      this.selectClass = index;
      this.dictName = item.dictName;
      this.dictName = item.dictName;
      if(this.dictName == "外部员工"){
        this.getAllStaffList()
        return 
      }
      this.dictCode = item.dictCode;
      let params = {};
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
      data.orgid=this.$store.state.user.userData.shopId;
      data.name=this.accountingName
      //参数
      let res=await getOutStaff(params,data)
      if(res.code===0){
        this.AssistTableDataOther=res.data.content
        this.AssistTableDataOther.map(v => {
          v.itemCode = v.code
          v.itemName = v.name
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
        data.sign=true
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
      let res=await addOutStaffe(data)
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
    //点击单选框获取辅助核算客户
    radioChangeEventClient({ row }) {
      this.AssistAccounting = row;
      this.auxiliaryTypeCode = "1";
      // this.auxiliaryCode = row.code;
    },
    //点击单选框获取辅助核算供应商
    radioChangeEventSupplier({ row }) {
      this.AssistAccounting = row;
      this.auxiliaryTypeCode = "2";
      // this.auxiliaryCode = row.code;
    },
    //点击单选框获取辅助核算个人
    radioChangeEventPersonage({ row }) {
      this.AssistAccounting = row;
      this.auxiliaryTypeCode = "4";
      // this.auxiliaryCode = row.userName;
    },
    //点击单选框获取辅助核算其他
    radioChangeEventOther({ row }) {
      this.AssistAccounting = row;
      if(this.dictName == '外部员工'){
        this.auxiliaryTypeCode = "CW00118";
      }else{
        this.auxiliaryTypeCode = row.dictCode;
      }
      // this.auxiliaryCode = row.itemCode;
      // console.log(row)
    },
    //辅助核算确定弹框
    confirmFuzhu() {
      if (!this.AssistAccounting) {
        this.$message.error("请选择辅助核算");
        this.subjectModelShowassist = true;
      }else if(this.Classification && this.formDynamic.fund==""){
        this.$message.error("款项分类必选")
      } else {
        // console.log(this.AssistAccounting);
        this.$emit("ChildContent", this.AssistAccounting);
        bus.$emit("ChildContent", this.AssistAccounting);
        this.$emit("callBackFun")
        this.subjectModelShowassist = false;
      }
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
    //部门改变
    ListChange(val, selectedData) {
      this.AssistAccounting = {}
      if (selectedData.length == 1) {
        this.AssistAccounting.auxiliaryTypeCode = '3'
        this.AssistAccounting.fullName = selectedData[0].label;
        this.AssistAccounting.code = selectedData[0].value;
        this.auxiliaryTypeCode = "3";
      } else {
        this.AssistAccounting.fullName = selectedData[selectedData.length - 1].name;
        this.AssistAccounting.code = selectedData[selectedData.length - 1].value;
        this.AssistAccounting.auxiliaryTypeCode = '3'
        this.auxiliaryTypeCode = "3";
      }
    },
    //新增辅助核算名称保存
    addAuxiliary() {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          let data = {};
          data.itemName = this.formAdd.assistName;
          data.dictCode = this.dictCode;
          // data.itemCode = tools.transTimess(new Date());
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
        this.fundListZanshi=res.data.filter(vb=>this.oneAccountent[0].mateAccountCoding.indexOf(vb.itemValueOne)!=-1)
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
    showOrhideModel(v){
      if(v){
        this.formDynamic.fund="";
        this.AssistAccounting = "";
        this.$refs.AssistTableDataKeHu.clearRadioRow()
        this.$refs.AssistTableDataGongYingShang.clearRadioRow()
        this.$refs.AssistTableDataGeRen.clearRadioRow()
        this.$refs.AssistTableDataOther.clearRadioRow()
        if(this.list.length==0){
          this.getListCompany();
        }
        if(this.AssistTableDataKeHu.length==0){
          this.ClientgetList();
        }
        if(this.AssistTableDataGongYingShang.length==0){
          this.SupperliergetList();
        }
        if(this.categoryArr.length==0){
          this.OtherGetlist();
        }
        if(this.AssistTableDataOther.length==0){
          this.OtherClickTable();
        }
        if(this.fundListZanshi.length==0){
          this.fundGetList();
        }
      }
    }
  },
  mounted() {
    // this.getListCompany();
    // this.ClientgetList();
    // this.SupperliergetList();
    // this.OtherGetlist();
    // this.OtherClickTable();
  }
};
</script>

<style scoped>
.flex {
  display: flex;
}
.uploadbtn:hover {
  color: #03a9f4;
  border: 1px solid #ddd;
}
.items {
  list-style: none;
}
.items .item {
  display: flex;
  justify-content: space-between;
  height: 20px;
}
.header {
  padding: 5px 0;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px #cccccc solid;
}
.Other {
  display: flex;
  height: 550px;
}
.OtherLeft {
  flex: 1;
  width: 103px;
  border-right: 1px solid gray;
}
.OtherLeft > ul > li {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
}
.OtherLeft > ul > li:last-child {
  border-bottom: 1px solid gray;
}
.OtherRight {
  width: 615px;
  flex: 6;
}
.changeDiv {
  display: inline-block;
  margin-left: 20px;
}
.xuan {
  background: #e8eaec;
  color: gray;
  font-size: 15px;
}
</style>
<style scoped>
.formBox .ivu-form-item {
  margin-bottom: 5px;
  margin-right: 5px;
}
.ModalBox .ivu-form-item {
  margin-bottom: 2px;
}
.bottomZI {
  margin-top: 20px;
  margin-left: 40px;
  font-size: 16px;
  color: red;
}
.fund {
  position: absolute;
  top: 4pc;
  right: 1pc;
  z-index: 9999;
/*1pc=12pt=16px;**/
}
.LiClass {
}
/*.LiClass:first-child{*/
/*background: #f8f8f8;*/
/*border: 1px solid #ddd!important;*/
/*}*/
.LiClass:hover {
  cursor: pointer;
}
</style>

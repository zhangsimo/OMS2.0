<template>
  <div class="staff-box">
    <div class="staff-header">
      <span class="mr5">公司名称:</span>
      <div class="db mr10">
        <Select
          v-model="orgid"
          class="w120"
          placeholder="请选择"
          :disabled="selectShopList"
          filterable
          clearable
        >
          <Option
            v-for="item in stores"
            :value="item.id"
            :key="item.id"
          >{{ item.name }}</Option
          >
        </Select>
      </div>
      <span class="mr5">人员名称:</span>
      <Input type="text" class="staff-name mr10" v-model="staffName" />
      <i-button type="warning" class="staff-btn" @click="inquireStaff">
        <Icon custom="iconfont iconchaxunicon" />查询
      </i-button>
    </div>
    <div class="staff-change">
      <a class="mr10" @click="addStaff" v-has="'addOutStaff'">
        <Icon custom="iconfont iconxinzengicon icons" />新增
      </a>
      <a class="mr10" @click="changStaffList" v-has="'changeOutStaff'">
        <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
      </a>
      <a class="mr10" @click="changeEnable" v-has="'outStaffEnable'">{{enAble}}</a>
    </div>
    <div class="staffList">
      <Table
        class="table-highlight-row"
        :loading="loading"
        size="small"
        highlight-row
        border
        :stripe="true"
        :columns="columns"
        :data="staffList"
        ref="currentRowTable"
        @on-current-change="selection"
      ></Table>
      <Page
        :total="page.total"
        :page-size="page.size"
        :current="page.num"
        show-sizer
        show-total
        class-name="page-con"
        @on-change="selectNum"
        @on-page-size-change="selectPage"
      ></Page>
    </div>
    <!--新增/修改外部员工-->
    <Modal v-model="modalShow" :title="title" width="460px" :closable="false">
      <addOutStaff ref="addOutStaff"></addOutStaff>
      <div slot="footer" style="padding: 10px 0">
        <Button type="primary" @click="submit">确认</Button>
        <Button type="default" @click="cancel">退出</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import {transTime} from "../utils";
  import addOutStaff from "./components/addOutStaff";
  import {getOutStaff/**获取全部外部员工*/,addOutStaffe/**添加外部员工*/,changeOutStaffEn/**修改启用禁用*/} from "@/api/system/systemSetting/staffManagenebt"
  import {getStorelist/**获取机构*/} from "_api/reportForm/index.js";
  import { creat } from "@/view/settlementManagement/components";
  export default {
    name:"outStaffManagement",
    components:{
      addOutStaff
    },
    data(){
      return {
        orgid:"",
        staffList:[],//机构数组
        staffName:"",//外部人员名称
        page:{
          size:10,
          num:1,
          total:0
        },
        enAble:"启用",
        loading:false,
        columns: [
          {
            title: "选择",
            key: "id",
            width: 70,
            align: "center",
            render: (h, params) => {
              return h("span", { class: "table-radio" });
            }
          },
          {
            title: "人员名称",
            align: "center",
            key: "name"
          },
          {
            title: "收款户名",
            align: "center",
            key: "accountName",
            minWidth: 80
          },
          {
            title: "开户银行",
            align: "center",
            key: "accountBank",
            minWidth: 80
          },
          {
            title: "银行卡号",
            align: "center",
            key: "accountNumber"
          },
          {
            title: "公司名称",
            align: "center",
            key: "shorName"
          },
          {
            title: "状态",
            align: "center",
            key: "sign",
            render: (h, params) => {
              let text = params.row.sign == true? "启用" : "禁用";
              return h("span", {}, text);
            }
          },
          {
            title: "建档人",
            align: "center",
            key: "createUname"
          },
          {
            title: "建档日期",
            align: "center",
            key: "createTime"
          }
        ],
        stores:[{id:"",name:"全部"}],
        oneStaffChange:{},
        modalShow:false,
        title:"新增外部人员"
      }
    },
    computed:{
      selectShopList(){
        let canSelect ;
        if(this.$store.state.user.userData.currentCompany!=undefined){
          canSelect = this.$store.state.user.userData.currentCompany.isMaster ? true : false
        }
        return canSelect
      }
    },
    async mounted() {
      let arr = await creat("", this.$store);
      if(arr.length>0){
        this.orgid=arr[1]
      }
      this.getAllStaffList()
      this.getList()
    },
    methods:{
      async getList(){
        let res = await getStorelist();
        if (res.code == 0) {
          let data = res.data;
          Object.keys(data).forEach(key => {
            this.stores.push({ id: key, name: data[key] });
          });
        }
      },
      async getAllStaffList(){
        let params={
          page:this.page.num-1,
          size:this.page.size,
        }
        let data={}
        data.orgid=this.orgid;
        data.name=this.staffName
        //参数
        let res=await getOutStaff(params,data)
        if(res.code===0){
          this.staffList=res.data.content
          this.page.total=res.data.totalElements
        }
      },
      //查询外部员工
      inquireStaff(){
        this.getAllStaffList()
      },
      //添加外部员工接口
      async addOutStaffTrue(data){
        let res=await addOutStaffe(data)
        if(res.code===0){
          this.getAllStaffList()
        }
      },
      //弹出 新增外部员工 弹框
      addStaff(){
        this.title="新增外部人员"
        this.modalShow=true
        this.$refs.addOutStaff.data={}
      },
      //弹出 修改外部员工 弹框
      changStaffList(){
        if(!this.oneStaffChange.id){
          this.$Message.error("至少选中一条记录")
          return
        }else{
          this.title="修改外部人员"
          this.modalShow=true
          this.$refs.addOutStaff.data=this.oneStaffChange
        }
      },
      //修改启用禁用
      async changeEnable(){
        if(!this.oneStaffChange.id){
          this.$Message.error("至少选中一条记录")
          return
        }else{
          let data={}
          data.id=this.oneStaffChange.id
          data.sign=!this.oneStaffChange.sign
          await changeOutStaffEn(data);
          this.getAllStaffList()
        }
      },
      //选一个
      selection(currentRow){
        this.oneStaffChange = currentRow;
        //判断选中项的状态  启用时否则禁用时
        if(currentRow.sign){
          this.enAble="禁用"
        }else{
          this.enAble="启用"
        }
      },
      selectNum(num){
        this.page.num = num;
        this.getAllStaffList();
      },
      selectPage(size){
        this.page.size = size;
        this.getAllStaffList();
      },
      //确认添加、修改
      submit(num){
        this.$refs.addOutStaff.handleSubmit(()=>{
          let data={}
          if(this.title=="新增外部人员"){
            data=this.$refs.addOutStaff.data
            data.id=""
            data.sign=true
            this.$Message.success("新增外部人员成功")
            this.addOutStaffTrue(data);
          }else{
            data=this.$refs.addOutStaff.data
            this.$Message.success("修改外部人员信息成功")
            this.addOutStaffTrue(data);
          }
          this.modalShow=false;
          this.$refs.addOutStaff.data={};
        })
      },
      //取消
      cancel(){
        this.$refs.addOutStaff.data={}
        this.modalShow=false
      }
    }
  }
</script>
<style scoped lang="less">
  .staff-box {
    background: #ffffff;
    .staff-header {
      line-height: 57px;
      border-bottom: 1px solid #eee;
      padding-left: 20px;
      display: flex;
      align-items: center;
    }
    .staff-name {
      height: 30px;
      width: 140px;
    }
    .center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .staff-phone-number {
      height: 30px;
      width: 140px;
    }
    .staff-btn {
      margin-left: 20px;
      cursor: pointer;
    }
    .staff-change {
      padding-left: 20px;
      border-bottom: 1px solid #eee;
      line-height: 57px;
    }
    .staffList {
      padding: 20px;
    }
  }
  .headr-box2 {
    padding-left: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    input {
      height: 25px;
    }
  }
</style>

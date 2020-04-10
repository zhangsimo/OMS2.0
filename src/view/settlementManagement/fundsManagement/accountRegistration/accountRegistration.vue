<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db ml15">
            <span>区域：</span>
            <Select  v-model="model1" filterable class="w150" @on-change = 'changeArea'>
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.companyName }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select  v-model="shopCode" filterable class="w150">
              <Option
                v-for="item in shopList"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>账户：</span>
            <input type="text" class="h30" v-model="accountName">
          </div>
          <div class="db ml15">
            <span>开户行：</span>
            <input type="text" class="h30" v-model="bankName">
          </div>
          <div class="db ml15">
            <span>对应科目：</span>
            <Select  v-model="subjectCode" filterable class="w150">
              <Option
                v-for="item in subJectList"
                :value="item.id"
                :key="item.id"
              >{{ item.titleName }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon mr5"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml5">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="newlyIncreased(1)">
              <span>新 增</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div style="width: 98%;margin: 0 auto">
        <vxe-table
          border
          show-footer
          show-overflow
          highlight-current-row
          highlight-hover-row
          stripe
          ref="xTable"
          align="center"
          height="500"
          @current-change="getOneList"
          size="mini"
          :data="tableData"
        >
          <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="area" title="所属区域" ></vxe-table-column>
          <vxe-table-column field="shopName" title="所属门店" ></vxe-table-column>
          <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
          <vxe-table-column field="accountName" title="账户"></vxe-table-column>
          <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
          <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
          <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
          <vxe-table-column field="shopList" title="连锁待分配款项显示门店"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <template>
                <vxe-button @click="compileEvent(row)">编辑</vxe-button>
                <vxe-button @click="removeEvent(row)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </section>
    <div>
      <!--新增/修改弹框-->
      <information-registration ref="informationShow" :ChangeData="ChangeData"></information-registration>
    </div>
  </div>
</template>

<script>
  import {are , goshop } from '@/api/settlementManagement/fundsManagement/capitalChain'
  import {getTableList}from '@/api/accountant/accountant'
  import informationRegistration from './components/informationRegistration'
  import { findListPageAll , addData , updateData , deleterowData } from '@/api/settlementManagement/fundsManagement/accountRegistration'
  export default {
        name: "accountRegistration",
        components: {
          informationRegistration,
        },
        data(){
          return {
            model1: 0,//区域
            Branchstore: [ {id:0 ,companyName:'全部'}], //区域数组
            shopCode: 0, //门店
            shopList: [ {id:0 , name:'全部'}], //门店数组
            accountName: '', //账户
            bankName: '', //开户行
            subjectCode: 0, //对应科目
            subJectList: [{id:0 ,titleName:'全部'}], //对应科目数组
            tableData: [{accountName: "1123"}], //表格数据
            oneList: [], //当前表格数据
            ChangeData: {}, //给子组件传的当前行的数据
          }
        },
      methods : {
        //获取全部地址
        async getAllAre(){
          let res = await are()
          if (res.code === 0) return this.Branchstore = [...this.Branchstore ,...res.data]
        },

        //获取门店
        async getShop(){
          let data ={}
          data.supplierTypeSecond = this.model1
          this.shopList = [{id:0 , name:'全部'}]
          let res = await goshop(data)
          if (res.code === 0) {
            this.shopList = [...this.shopList , ...res.data]
            this.$nextTick( () => {
              this.shopCode = this.$store.state.user.userData.shopId
            })
            if (this.$store.state.user.userData.shopkeeper != 0){
              // this.getThisArea()//获取当前门店地址
            }
          }
        },

        //获取科目
        async getSubject(){
          let data = {}
          data.parentCode = 101
          let res = await getTableList(data)
          if(res.code === 0) return this.subJectList = [...this.subJectList , ...res.data]
        },

        //切换地址重新调取门店接口
        changeArea(){
          if (this.$store.state.user.userData.shopkeeper == 0) {
            this.shopCode = 0
            this.getShop()
          }
        },
          //查询
        query(){
          this.getList();
        },

        //初始化数据
        getList(){
          let params = {};
          if(this.model1 != 0){
            params.areaId = this.model1;
          }
          if(this.shopCode != 0){
            params.shopId = this.shopCode;
          }
          if(this.accountName){
            params.accountName = this.accountName;
          }
          if(this.bankName){
            params.bankName = this.bankName;
          }
          if(this.subjectCode != 0){
            params.mateAccountCode = this.subjectCode;
          }
          findListPageAll(params).then(res => {
            if(res.code == 0){}
          })
        },

        //新增
        newlyIncreased(){
            this.ChangeData = {
                area: "0",
                shopName: '0',
                mateAccountName: '',
                aaa: '',
            };
            this.$refs.informationShow.information = true;
        },

        //点击获取表格数据
        getOneList(val){
          this.oneList = val.row
        },

        //编辑当前行
        compileEvent(row){
          this.ChangeData = row;
          // console.log(this.ChangeData ,111)
          this.$refs.informationShow.informationSave();
        },

        //删除当前行
        removeEvent(row){},
      },
      mounted(){
        this.getAllAre() //获取区域
        this.getShop()  //获取门店
        this.getSubject()//获取科目
      }
    }
</script>

<style scoped>

</style>

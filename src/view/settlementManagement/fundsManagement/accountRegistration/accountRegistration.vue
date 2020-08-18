<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db ml15">
            <span>区域：</span>
            <Select v-model="model1" filterable class="w150" @on-change="changeArea" :disabled="selectShopList">
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.companyName }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select v-model="shopCode" filterable class="w150" :disabled="selectShopList">
              <Option v-for="item in shopListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>账户：</span>
            <input type="text" class="h30" v-model="accountName" />
          </div>
          <div class="db ml15">
            <span>开户行：</span>
            <input type="text" class="h30" v-model="bankName" />
          </div>
<!--          <div class="db ml15">-->
<!--            <span>对应科目：</span>-->
<!--            <Select v-model="subjectCode" filterable class="w150">-->
<!--              <Option-->
<!--                v-for="item in subJectList"-->
<!--                :value="item.id"-->
<!--                :key="item.id"-->
<!--              >{{ item.titleName }}</Option>-->
<!--            </Select>-->
<!--          </div>-->
          <div class="db ml15">
            <span>对应科目：</span>
            <el-cascader
              ref="casecader"
              size="small"
              :options="options"
              @change="getKemuList"
              :props="{ multiple: true, children: 'children',label:'titleName',value:'id' }"
              collapse-tags
              clearable></el-cascader>
          </div>
          <div class="db ml15">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon mr5"></i>
              <span>查询</span>
            </button>
          </div>
          <div class="db ml5">
            <button
              class="mr10 ivu-btn ivu-btn-default"
              type="button"
              @click="newlyIncreased(1)"
              v-has="'add'"
            >
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
          <vxe-table-column field="area" title="所属区域"></vxe-table-column>
          <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
          <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
          <vxe-table-column field="accountName" title="账户"></vxe-table-column>
          <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
          <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
          <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
          <vxe-table-column field="shopList" title="连锁待分配款项显示门店">
            <template v-slot="{ row }">
              <span v-for="item in row.shopList">{{ item.shopName }};</span>
            </template>
          </vxe-table-column>
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
import {
  are
} from "@/api/settlementManagement/fundsManagement/capitalChain";
import { goshop } from '@/api/settlementManagement/shopList';
import { getTableList } from "@/api/accountant/accountant";
import informationRegistration from "./components/informationRegistration";
import {
  findListPageAll,
  addData,
  updateData,
  deleterowData
} from "@/api/settlementManagement/fundsManagement/accountRegistration";
export default {
  name: "accountRegistration",
  components: {
    informationRegistration
  },
  data() {
    return {
      model1: 0, //区域
      Branchstore: [{ id: 0, companyName: "全部" }], //区域数组
      shopCode: "", //门店1265535798180593664
      shopListArr: [], //门店数组
      accountName: "", //账户
      bankName: "", //开户行
      subjectCode: 0, //对应科目
      subJectList: [{ id: 0, titleName: "全部" }], //对应科目数组
      tableData: [], //表格数据
      oneList: [], //当前表格数据
      ChangeData: {}, //给子组件传的当前行的数据
      mateAccountCode:'',//对应科目
      options:[]
    };
  },
  computed:{
    selectShopList(){
      if(this.$store.state.user.userData.currentCompany!=null){
        return this.$store.state.user.userData.currentCompany.isMaster ? true : false
      }else{
        return true
      }
    }
  },
  methods: {
    //获取全部地址
    async getAllAre() {
      let res = await are();
      if (res.code === 0)
        return (this.Branchstore = [...this.Branchstore, ...res.data]);
    },

    //获取门店
    async getShop() {
      let data = {};
      this.$nextTick(()=>{
        data.supplierTypeSecond = this.shopCode;
      })
      let res = await goshop(data);
      if (res.code === 0) {
        this.shopListArr = [ ...res.data];
        this.shopCode = this.shopListArr[0].id
        this.getList(); //查询
      }
      if(this.Branchstore.length>0){
        this.Branchstore.map(item=>{
          this.shopListArr.map(item2=>{
            if(this.selectShopList){
              if(item.parentId==item2.supplierTypeFirst && item.id==item2.supplierTypeSecond){
                this.model1=item.id
              }
            }else{
              this.model1=0
            }
          })
        })
      }
    },

    //获取科目
    // async getSubject() {
    //   let data = {};
    //   data.parentCode = 101;
    //   let res = await getTableList(data);
    //   if (res.code === 0)
    //     return (this.subJectList = [...this.subJectList, ...res.data]);
    // },
    //获取科目
    async getTreeListFun() {
      let rep2 = await getTableList({parentCode: 101})
      if (rep2.code == 0) {
        let content = rep2.data || [];
        this.options = this.treeDataFun(content)
      }
    },
    treeDataFun(content) {
      let level1 = content.filter(item => item.titleLevel === 1 && (item.titleCode == '1001' || item.titleCode == '1002' || item.titleCode == '1012'));
      return this.treeFilterData(level1, content);
    },
    treeFilterData(treeData, content) {
      treeData.map(item => {
        let arrData = content.filter(item1 => item1.parentCode == item.titleCode);
        if (arrData.length > 0) {
          item.children = this.treeFilterData(arrData, content)
        } else {
          item.children = null
        }
      })
      return treeData
    },
    getKemuList(v) {
      if (v.length == 0) {
        return this.mateAccountCode = ""
      }
      let req = []
      v.map(item => {
        if (item.length > 0) {
          let end = item.slice(-1)
          req.push(end.join(''))
        }
      })
      this.mateAccountCode = req.join(',')
    },
    //切换地址重新调取门店接口
    changeArea() {
      if (this.$store.state.user.userData.shopkeeper == 0) {
        this.shopCode = 0;
        this.getShop();
      }
    },

    //查询
    query() {
      this.getList();
    },

    //初始化数据
    getList() {
      let params = {};
      if (this.model1 != 0) {
        params.areaId = this.model1;
      }
      if (this.shopCode != 0) {
        params.shopNumber = this.shopCode;
      }
      if (this.accountName) {
        params.accountName = this.accountName;
      }
      if (this.bankName) {
        params.bankName = this.bankName;
      }
      if (this.mateAccountCode != 0) {
        params.mateAccountCode = this.mateAccountCode;
      }
      findListPageAll(params).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.content;
          this.tableData.map(item => {
            item.shopList = JSON.parse(item.shopNameList);
          });
        }
      });
    },

    //新增
    newlyIncreased() {
      this.ChangeData = {
        areaId: "0",
        shopNumber: "0",
        mateAccountName: "",
        shopListName: "",
        shopCode: ""
      };
      this.$refs.informationShow.information = true;
      this.$refs.informationShow.$refs.ModelValidate.resetFields();
    },

    //点击获取表格数据
    getOneList(val) {
      this.oneList = val.row;
    },

    //编辑当前行
    compileEvent(row) {
      row.areaId = row.areaId.toString();
      row.shopNumber = row.shopNumber.toString();
      row.shopList = row.shopList.map(item => {
        return item.id;
      });
      if (JSON.parse(row.shopNameList).length > 0) {
        row.shopListName = JSON.parse(row.shopNameList).map(item => {
          return item.shopName;
        });
        row.shopListName = row.shopListName.toString();
      } else {
        row.shopListName = "";
      }
      // this.ChangeData = row;
      this.ChangeData = {
        id: row.id,
        areaId: row.areaId,
        shopNumber: row.shopNumber,
        shopCode: row.shopCode,
        accountName: row.accountName,
        bankName: row.bankName,
        accountCode: row.accountCode,
        mateAccountName: row.mateAccountName,
        shopListName: row.shopListName,
        shopList: row.shopList,
        area: row.area,
        shopName: row.shopName
      };
      this.$refs.informationShow.information = true;
    },

    //删除当前行
    removeEvent(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>是否要删除该条数据？</p>",
        onOk: async () => {
          let params = {};
          params.id = row.id;
          deleterowData(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("删除成功！");
              this.getList();
            }
          });
        },
        onCancel: () => {
          this.$Message.warning("删除取消！");
        }
      });
    }
  },
  mounted() {
    this.getAllAre(); //获取区域
    this.getShop()
    this.getTreeListFun(); //获取科目
  }
};
</script>

<style scoped>
</style>

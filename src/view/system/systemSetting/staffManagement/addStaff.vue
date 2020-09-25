<template>
  <Form
    :label-width="150"
    label-position="left"
    :rules="rules"
    :model="data"
    style="text-align: left"
    ref="form"
  >
<!--    <Tabs type="card">-->
<!--      <TabPane label="基本信息">-->
    <div class="db pl10 tabs-ulwarp">
      <ul class="tabs">
        <li
          class="center"
          :class="{ 'tab-active': tabIndex == 0 }"
          @click="setTab(0)"
        >
          基本信息
        </li>
        <li
          class="center"
          :class="{ 'tab-active': tabIndex == 1 }"
          @click="setTab(1)"
        >
          其他信息
        </li>
      </ul>
    </div>

        <div v-if="tabIndex == 0" class="pt20">
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="姓名：" prop="userName">
              <Input placeholder="请输入姓名" v-model="data.userName" style="width: 150px"></Input>
            </FormItem>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="性别：">
              <Radio-group v-model="data.gender">
                <Radio :label="0">
                  <span>男</span>
                </Radio>
                <Radio :label="1">
                  <span>女</span>
                </Radio>
              </Radio-group>
            </FormItem>
          </div>
        </div>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="手机号码:" prop="phone">
              <Input placeholder="请输入手机号码" v-model="data.phone" style="width: 150px"></Input>
            </FormItem>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="生日：">
              <Date-picker
                :value="data.birthDay"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
                @on-change="changeBirthday"
              ></Date-picker>
            </FormItem>
          </div>
        </div>
        <FormItem label="身份证号码:" prop="cardId">
          <Input placeholder="请输入身份证号码" v-model="data.cardId" style="width: 250px"></Input>
        </FormItem>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="入职公司:" prop="shopNumber">
              <Select v-model="data.shopNumber" style="width:150px">
                <Option v-for="item in gusetList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="入职部门:" prop="groundIds">
              <Cascader
                :data="list"
                v-model="data.groundIds"
                placeholder="选择部门"
                change-on-select
                style="width: 150px"
              ></Cascader>
            </FormItem>
          </div>
        </div>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="系统角色:" style="position: relative">
              <Cascader
                style="width:80%"
                :data="jobList"
                v-model="userRoleId"
                placeholder=""
                @on-change="getJob"
              ></Cascader>
              <div class="jobTags">
              <Tag
                v-for="item in data.userRoles"
                :key="item.id"
                :name="item.id"
                :color=" item.systemType === 0 ? 'error': 'success'"
                closable
                @on-close="handleClose"
              >
                {{ item.displayName}}
              </Tag>
              </div>
            </FormItem>
          </div>
        </div>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="入职时间：" style prop="entryTime">
              <Date-picker
                v-model="data.entryTime"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
              ></Date-picker>
            </FormItem>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="微信/QQ号：">
              <Input placeholder="请输入微信/QQ号码" v-model="data.wechatId" style="width: 150px"></Input>
            </FormItem>
          </div>
        </div>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="紧急联系人：">
              <Input placeholder="请输入紧急联系人名称" v-model="data.emergencyContact" style="width: 150px"></Input>
            </FormItem>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="紧急联系人电话：">
              <Input
                placeholder="请输入紧急联系人电话"
                v-model="data.emergencyContactPhone"
                style="width: 150px"
              ></Input>
            </FormItem>
          </div>
        </div>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="是否低于成本价销售:">
              <Select v-model="data.sureCost" style="width:150px">
                <Option
                  v-for="item in costList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <FormItem label="是否业务人员：">
              <Select v-model="data.business" style="width:150px">
                <Option
                  v-for="item in businessList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </div>
        </div>
        <div style="display: flex">
          <div style="flex-flow: row nowrap;width: 100%">
            <div>
              是否允许查看他人创建的单据：
              <Checkbox v-model="data.single"></Checkbox>
            </div>
          </div>
          <div style="flex-flow: row nowrap;width: 100%">
            <div>
              是否允许提交他人创建的单据：
              <Checkbox v-model="data.singtwo"></Checkbox>
            </div>
          </div>
        </div>
        </div>
        <div v-if="tabIndex == 1" class="pt20">
          <p style="margin-bottom: 10px">财务信息</p>
          <div class="finance">
            <div class="financePlace">
              <a class="mr10" @click="addPlaceFin">
                <Icon custom="iconfont iconxinzengicon icons" />新增
              </a>
              <a class="mr10" @click="changeplageFin">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </a>
              <a class="mr10" @click="changePlaceFin">{{enAble}}</a>
            </div>
            <div class="financeTab">
              <Table
                @on-current-change="selectFin"
                highlight-row
                border
                resizable
                auto-resize
                stripe
                size="small"
                height="200"
                max-height="200"
                ref="finance"
                :columns="columnsFin"
                :data="financeList"
              ></Table>
            </div>
          </div>
          <Modal v-model="bankAccount" :title="bankAccountTit" width="600">
            <staff-account ref="bankAccount"></staff-account>
            <div slot="footer">
              <Button type="primary" @click="addNewClientBank">保存</Button>
              <Button type="default" @click="bankAccount=false">取消</Button>
            </div>
          </Modal>
        </div>
  </Form>
</template>

<script>
import { getcompany ,setPhone } from "@/api/system/systemSetting/staffManagenebt";
import { findGuest } from "@/api/settlementManagement/advanceCollection";
import { findAllJob } from "_api/admin/roleApi.js";
import { goshop } from "@/api/settlementManagement/fundsManagement/capitalChain";
import staffAccount from '@/view/system/systemSetting/staffManagement/components/staffAccount'
export default {
  name: "addStaff",
  props: {
    data: "",
  },
  components:{staffAccount},
  data() {
    //校验手机号
    const validatePhone = (rule, value, callback,source, options,a) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        // let data = {}
        // data.mobile = value
        // setPhone(data).then( res => {
        //   if (res.code != 0){
        //     return callback(new Error("手机号码重复"));
        //   }else {
            callback();
          // }
        // })
      }
    };
    const cardId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("身份证号不能为空"));
      } else if (
        !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
          value
        )
      ) {
        callback(new Error("身份证号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      // tab索引
      tabIndex: 0,
      rules: {
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: "blur" },
          // { required: true, validator: PhoneDouble, trigger: "blur" },
          ],
        cardId: [{ required: true, validator: cardId, trigger: "blur" }],
        groundIds: [
          {
            required: true,
            type: "array",
            message: "请选择部门",
            trigger: "change"
          }
        ],
        userRoleId: [
          {
            required: true,
            type: "string",
            message: "请选择岗位",
            trigger: "change"
          }
        ],
        entryTime: [
          {
            required: true,
            type: "date",
            message: "入职时间不能为空",
            trigger: "change"
          }
        ],
        accountPayee: [
          { required: true, message: "收款户名不能为空", trigger: "blur" }
        ],
        bankNumber: [
          { required: true, message: "银行账号不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        shopNumber: [
          {
            required: true,
            type: "string",
            message: "请选择入职公司",
            trigger: "change"
          }
        ]
      },
      costList: [
        { name: "是", value: 0 },
        { name: "否", value: 1 }
      ],
      businessList: [
        { name: "是", value: 0 },
        { name: "否", value: 1 }
      ],
      jobList: [
        {
          value: 'zhejiang',
          label: '浙江',
          children: [{
            value: 'hangzhou',
            label: '杭州',
            children: [{
              value: 'xihu',
              label: '西湖'
            }]
          }]
        },
        {
          value: 'jiangsu',
          label: '江苏',
          children: [{
            value: 'nanjing',
            label: '南京',
            children: [{
              value: 'zhonghuamen',
              label: '中华门'
            },
              {
                value: 'xuanwuhu',
                label: '玄武湖'
              },

            ]
          }]
        }
      ], //获取当前岗位
      userRoleId:[], //选择获取到的岗位
      business: 0,
      list: [], //公司信息
      gusetList: [], //往来单位信息
      columnsFin: [
        {
          title: "序号",
          align: "center",
          type: "index"
        },
        {
          title: "收款户名",
          align: "center",
          key: "accountName"
        },
        {
          title: "银行卡号",
          align: "center",
          key: "accountBankNo"
        },
        {
          title: "开户银行",
          align: "center",
          key: "accountBank"
        },
        {
          title: "是否是工资卡",
          align: "center",
          render: (h, params) => {
            let text = "";
            if(params.row.wagesSign ==null){
              params.row.wagesSign =false
            }
            params.row.wagesSign == true
              ? (text = "已默认")
              : (text = "设为默认");
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.financeList.map(item => {
                      if (item.id == params.row.id) {
                        item.wagesSign = !item.wagesSign;
                      } else {
                        if (item.wagesSign) {
                          item.wagesSign = false;
                        }
                      }
                    });
                    this.disposeFinData();
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let text = "";
            params.row.accountSign == true ? (text = "启用") : (text = "禁用");
            return h("span", {}, text);
          }
        }
      ],
      selectFinTab:{},
      bankAccount:false,
      bankAccountTit:"新增银行账户",
      enAble:"启用",
      accountAddId:0,
      financeList:[],
      tabList: [] //tag列表数据(所选角色)
    };
  },
  mounted() {
    this.getList();
    this.getfindGuestList();
    this.getLeftList();
  },
  methods: {
    // tab切换
    setTab(index) {
      this.tabIndex = index;
      this.showSearch = this.shopkeeper == 1 || index == 0;
    },

    //获取角色push斤tag清除所获取数据
    getJob(value, selectedData){
      this.userRoleId = []
      let cont = selectedData[selectedData.length -1]
      //判断父级是否是重复如果重复则覆盖原先选择的数据保证当钱系统只有条
       let index
        this.data.userRoles.forEach( (item , i)  => {
        if(item.systemType == cont.systemType){
          index = i
        } })
      if (Number.isFinite(index)){
        this.$set(this.data.userRoles , index , cont )
      }else {
        this.data.userRoles.push(cont)
      }
    },

    //关闭获取到角色tag
    handleClose(event, name){
      const index = this.data.userRoles.indexOf(name);
      this.data.userRoles.splice(index, 1);
    },

    //获取公司
    async getList() {
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
    // 处理财务信息数据
    disposeFinData() {
      let defauDat = [];
      this.financeList.map(item => {
        if (item.wagesSign == true) {
          defauDat.push(item);
        }
      });
      if (defauDat.length != 1) {
        this.financeList.map(item => {
          if (item != defauDat[0]) {
            item.wagesSign = false;
          }
        });
      }
    },
    //获取往来的单位
    async getfindGuestList() {
      let data = {};
      data.supplierTypeSecond = "";
      let res = await goshop(data);
      if (res.code === 0) {
        this.gusetList = res.data || [];
      }
    },
    // 财务信息表格中选中某一行
    selectFin(row) {
      this.selectFinTab = row || {};
      if (row.accountSign == true) {
        this.enAble = "禁用";
      } else {
        this.enAble = "启用";
      }
      this.disposeFinData();
    },
    // 其他信息 财务信息
    addPlaceFin() {
      this.bankAccount = true;
      this.bankAccountTit = "新增银行账户";
      this.$refs.bankAccount.data = {};
      this.$refs.bankAccount.resetFields();
    },
    changeplageFin() {
      if (Object.keys(this.selectFinTab).length == 0) {
        this.$Message.error("请先选中需要修改的信息");
        return false;
      }
      this.bankAccountTit = "修改银行账户信息";
      this.bankAccount = true;
      this.$refs.bankAccount.data = this.selectFinTab;
    },
    // 修改启用禁用
    changePlaceFin() {
      this.financeList.map(item => {
        if(this.selectFinTab.id==undefined){
          if (item.accountAddId == this.selectFinTab.accountAddId) {
            item.accountSign = !item.accountSign;
          } else {
            item.accountSign;
          }
        }else{
          if (item.id == this.selectFinTab.id) {
            item.accountSign = !item.accountSign;
          } else {
            item.accountSign;
          }
        }
      });
    },
    // 财务信息银行卡弹框确定
    addNewClientBank() {
      this.$refs.bankAccount.handleSubmit(() => {
        if (this.bankAccountTit == "修改银行账户信息") {
          // let bool = true;
          this.selectFinTab = this.$refs.bankAccount.data;
          this.financeList.map(item => {
            if (item.accountAddId == this.selectFinTab.accountAddId) {
              let newarr = {};
              newarr = JSON.parse(JSON.stringify(this.selectFinTab));
              item.id = newarr.id;
              item.tenantId = newarr.tenantId;
              item.guestId = newarr.guestId;
              item.accountBank = newarr.accountBank;
              item.accountBankNo = newarr.accountBankNo;
              item.accountName = newarr.accountName;
              item.accountType = newarr.accountType;
              item.wagesSign = newarr.wagesSign;
            }
          });
          // if (bool == true) {
          //   if (item.id == this.selectFinTab.id) {
          //     let newarr = {};
          //     newarr = JSON.parse(JSON.stringify(this.selectFinTab));
          //     item.id = newarr.id;
          //     item.tenantId = newarr.tenantId;
          //     item.guestId = newarr.guestId;
          //     item.accountBank = newarr.accountBank;
          //     item.accountBankNo = newarr.accountBankNo;
          //     item.accountName = newarr.accountName;
          //     item.accountType = newarr.accountType;
          //     item.wagesSign = newarr.wagesSign;
          //   }
            this.disposeFinData();
            this.$Message.success("修改银行卡信息成功");
            this.bankAccount = false;
          // } else {
          //   return this.$Message.error("该银行卡已添加过");
          // }
          this.data.staffAccountVoList = this.financeList;
        } else {

          let newarr = {};
          let bool = true;
          this.selectFinTab = this.$refs.bankAccount.data;
          newarr = JSON.parse(JSON.stringify(this.selectFinTab));
          this.financeList.map(item => {
            if (item.accountBankNo == this.selectFinTab.accountBankNo) {
              bool = false;
            }
          });
          if (bool == true) {
            newarr.wagesSign = newarr.wagesSign || true;
            newarr.accountSign = true;
            newarr.accountAddId=this.accountAddId;
            this.accountAddId++;
            this.financeList.push(newarr);
            this.data.staffAccountVoList = this.financeList;
            this.bankAccount = false;
            this.disposeFinData();
            this.$Message.success("添加银行卡成功");
            // console.log(this.data.staffAccountVoList,this.financeList,"???")
          } else {
            return this.$Message.error("该银行卡已添加过");
          }
        }
      });
    },
    //获取全部角色
    async getLeftList() {
      let res = await findAllJob();
      if (res.code == 0) {
        this.jobList = res.data
        this.changeTreeList(this.jobList)
      }
    },

    //重组角色树形图数据
    changeTreeList(val){
      if (Array.isArray(val) && val.length > 0){
        val.forEach(item => {
          item.value = item.id
          item.label = item.displayName
          item.children = item.roles ? item.roles : ''
          if (item.children) {
            this.changeTreeList(item.children)
          }
        })
      }
    },



    //删除校验
    resetFields() {
      this.$refs.form.resetFields();
    },
    changeEntryTime(data) {
      this.data.entryTime = data;
    },
    handleSubmit(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          callback && callback();
        } else {
          this.$Message.error("信息填写错误");
        }
      });
    },
    changeBirthday(data) {
      this.data.birthDay = data;
    },
    //获取到公司
    selectGroust(value, selectedData) {
      this.data.groundIds = JSON.stringify(value);
    }
  }
};
</script>

<style scoped lang="less">
.addForm {
  margin-top: 15px;
}
.addForm .ivu-form-item {
  margin-bottom: 10px !important;
}
.tabs-ulwarp {
  padding-top: 17px;
  border-bottom: solid 1px #ddd;
}

.tabs {
  list-style: none;
  display: flex;

  li {
    margin: 0;
    margin-right: 4px;
    height: 31px;
    padding: 5px 16px 4px;
    border: 1px solid #ddd;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background: #f8f8f8;
    cursor: pointer;
  }

  li.tab-active {
    height: 32px;
    padding-bottom: 5px;
    background: #fff;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    border-color: #ddd;
    color: #fd5c5c;
  }
}
  .jobTags {
    position: absolute;
    top: -2px;
    left: 5px;
  }

</style>

<template>
  <div>
    <div class="warehouseHeader">
      <span class="mr10">仓位定义:</span>
      <Button class="mr10" @click="openNewWarehouse" v-has="'openNewWarehouse'">
        <span class="center">
          <Icon custom="iconfont iconxinzengicon icons" />新增仓位
        </span>
      </Button>
      <Button class="mr10 w90" @click="save" v-has="'save'">
        <span class="center">
          <Icon custom="iconfont iconbaocunicon icons" />保存
        </span>
      </Button>
      <Button class="mr10" @click="changeType" v-if="oneWarehouse.isDisabled" v-has="'enable'">
        <span class="center">
          <Icon custom="iconfont iconqiyongicon icons" />启用
        </span>
      </Button>
      <Button class="mr15" @click="changeType" v-else v-has="'enable'">
        <span class="center">
          <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
        </span>
      </Button>
    </div>
    <div style="padding: 10px  ; border-bottom: 1px #dcdee2 solid;">
      <vxe-table
        border
        resizable
        keep-source
        align="center"
        size="mini"
        ref="xTable"
        highlight-current-row
        highlight-hover-row
        :edit-rules="validRules"
        :mouse-config="{selected: true}"
        :keyboard-config="{isArrow: true, isDel: true, isTab: true, isEdit: true}"
        @current-change="clOnewList"
        height="330"
        :data="warehouseList"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column type="seq" title="序号"></vxe-table-column>
        <vxe-table-column field="name" title="仓位" :edit-render="{name: 'input'}" :filters="[{ data: '' }]" :filter-method="filterPositionMethod">
          <template v-slot:filter="{ $panel, column }">
            <input type="type" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)">
          </template>
        </vxe-table-column>
        <vxe-table-column field="area" title="区域" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column title="是否禁用">
          <template v-slot="{ row }">{{ row.isDisabled ? '是' : '否' }}</template>
        </vxe-table-column>
        <vxe-table-column field="createUname" title="建档人"></vxe-table-column>
        <vxe-table-column field="createTime" title="建档时间"></vxe-table-column>
        <vxe-table-column field="updateUname" title="修改人"></vxe-table-column>
        <vxe-table-column field="updateTime" title="修改时间"></vxe-table-column>
      </vxe-table>
    </div>
    <div class="warehouseHeader">
      <span class="mr10">员工配置:</span>
      <Button class="mr10 w130" @click="openNewSaffect" v-has="'openNewSaffect'">
        <span class="center">
          <Icon custom="iconfont iconxinzengicon icons" />添加员工
        </span>
      </Button>
      <Button class="mr10 w90" @click="deleSaffectList" v-has="'deleSaffectList'">
        <span class="center">
          <Icon custom="iconfont iconlajitongicon icons" />删除
        </span>
      </Button>
    </div>
    <div style="padding: 10px">
      <Table
        class="table-highlight-row"
        size="small"
        highlight-row
        border
        :stripe="true"
        :columns="columns1"
        :data="saffectList"
        height="330"
        @on-selection-change="deleSaffect"
      ></Table>
    </div>
    <!--      新增模态框-->
    <Modal title="仓位定义" v-model="warehouseIsShow" width="800">
      <AddNewWarehouse :data="newWarehouseOne" :wareHouse="storeId" ref="child"></AddNewWarehouse>
      <div slot="footer">
        <Button type="primary" @click="sureNew">确定</Button>
        <Button type="default" @click="warehouseIsShow=false">取消</Button>
      </div>
    </Modal>

    <!--      员工选择-->
    <Modal title="员工选择" v-model="saffectShow">
      <Table
        class="table-highlight-row"
        :loading="saffectLoading"
        size="small"
        highlight-row
        border
        :stripe="true"
        :columns="columns2"
        :data="allsaffect"
        height="230"
        @on-selection-change="getNewseaffact"
      ></Table>

      <div slot="footer">
        <Button type="primary" @click="sureNewSaffect">确定</Button>
        <Button type="default" @click="saffectShow=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getWarehouseList,
  getAddWarehouse,
  getSaveWarehouse,
  getAdd,
  getStaffList,
  getdeleSaffect,
  getAllseffactList,
  addNewseffact
} from "@/api/system/setWarehouse";
import {showLoading,hideLoading} from "../../../../../utils/loading";
import AddNewWarehouse from "./AddNewWarehouse";
export default {
  name: "WarehouseRight",
  components: {
    AddNewWarehouse
  },
  data() {
    //自定义校验方法
    const validatePass = ({cellValue}) => {
      return  new Promise((resolve, reject) => {
        if (cellValue && (cellValue.length < 1 || cellValue.length > 30)) {
          reject(new Error("长度不能超过30字符"));
        } else {
          resolve();
        }
      })

    };
    return {
      columns1: [
        {
          title: "序号",
          align: "center",
          key: "",
          type: "index"
        },
        {
          type: "selection",
          align: "center",
          width: "50px"
        },
        {
          title: "员工名称",
          align: "center",
          key: "empName"
        },
        {
          title: "建档人",
          align: "center",
          key: "createUname"
        },
        {
          title: "建档时间",
          align: "center",
          key: "createTime"
        }
      ],
      columns2: [
        {
          type: "selection",
          align: "center"
        },
        {
          title: "员工姓名",
          align: "center",
          key: "userName"
        },
        {
          title: "手机号",
          align: "center",
          key: "phone"
        }
      ],
      warehouseIsShow: false,
      saffectLoading: true,
      warehouseList: [],
      page: {
        num: 1,
        size: 9999,
        total: 0
      },
      validRules: {
        name: [{ required: true, message: "不能为空"},{max:30,message:'不能超过30字符'}]
      },
      storeId: "",
      oneWarehouse: "",
      newWarehouseOne: {},
      saffectList: [],
      pitchOnSaffect: [],
      saffectShow: false,
      allsaffect: [],
      Newseaffact: []
    };
  },
  computed: {
    newstoreId() {
      return this.$store.state.user.storeId;
    }
  },
  methods: {
    filterPositionMethod({ option, row }){
      return (row.name||"").indexOf(option.data)>-1
    },
    //获取仓位
    async getAllWarehouseList() {
      let id = this.storeId.id;
      let res = await getWarehouseList(id);
      if (res.code == 0) {
        this.warehouseList = res.data;
      }
    },
    //获取右侧员工
    async getAllSaffect() {
      let data = {};
      data.storeId = this.storeId.id;
      let res = await getStaffList(data);
      if (res.code == 0) {
        this.saffectList = res.data;
      }
    },
    //获取当前点击的信息
    clOnewList(data) {
      this.oneWarehouse = data.row;
    },
    //保存
    async save() {

     let valid = await this.$refs.xTable.validate().catch(errMap => errMap)
        if (!valid) {
          getSaveWarehouse(this.warehouseList).then(res => {
            if (res.code == 0) {
              this.$Message.success(res.message);
            }
            this.getAllWarehouseList();
          });
        } else {
          this.$Message.error("验证不通过");
        }
    },
    //切换状态
    changeType() {
      let id = this.oneWarehouse.id;
      getAddWarehouse({ id: id }).then(res => {
        if (res.code == 0) {
          this.getAllWarehouseList();
        }
      });
    },
    //打开新增
    openNewWarehouse() {
      if (!this.storeId.id) {
        this.$Message.error("请选择仓库");
        return false;
      }
      this.newWarehouseOne = {};
      this.warehouseIsShow = true;
    },
    //确认新增
    sureNew() {
      this.$refs.child.handleSubmit(() => {
        this.newWarehouseOne.storeId = this.storeId.id;
        showLoading()
        getAdd(this.newWarehouseOne).then(res => {
          hideLoading()
          if (res.code == 0) {
            this.warehouseIsShow = false;
            this.getAllWarehouseList();
          }
        }).catch(err=>{
          hideLoading()
        })
      });
    },
    //删除员工
    deleSaffectList() {
      if (this.pitchOnSaffect.length < 1) {
        this.$Message.error("请至少选择一个员工");
        return false;
      } else {
        let list = [];
        this.pitchOnSaffect.forEach(item => {
          list.push(item.id);
        });
        getdeleSaffect(list).then(res => {
          if (res.code == 0) {
            this.getAllSaffect();
          }
        });
      }
    },
    //获取选中的员工
    deleSaffect(selection) {
      this.pitchOnSaffect = selection;
    },
    //打开新员工选择
    openNewSaffect() {
      if (!this.storeId.id) {
        this.$Message.error("请选择仓库");
        return false;
      }
      this.saffectShow = true;
      this.saffectLoading = true;
      let data = {};
      data.size = this.page.size;
      data.page = this.page.num - 1;
      data.office = 0;
      data.userName = "";
      data.phone = "";
      getAllseffactList(data).then(res => {
        if (res.code == 0) {
          this.saffectLoading = false;
          let all = res.data.content;
          this.saffectList.forEach(item => {
            all = all.filter(el => el.id != item.empId);
          });
          this.allsaffect = all;
        }
      });
    },
    //点击获取选择的新员工
    getNewseaffact(selection) {
      this.Newseaffact = selection;
    },
    //确认新员工选择
    sureNewSaffect() {
      if (this.Newseaffact.length > 0) {
        let data = [];
        this.Newseaffact.forEach(item => {
          data.push({
            empId: item.id,
            empName: item.userName,
            storeId: this.storeId.id
          });
        });
        addNewseffact(data).then(res => {
          if (res.code == 0) {
            this.getAllSaffect();
            this.saffectShow = false;
          }
        });
      }
    }
  },
  watch: {
    newstoreId: {
      handler(v, ov) {
        this.storeId = v;
        this.getAllWarehouseList();
        this.getAllSaffect();
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="less">
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.warehouseHeader {
  line-height: 57px;
  padding-left: 16px;
  border-bottom: 1px #dcdee2 solid;
}
.freight {
  border: none;
}
</style>

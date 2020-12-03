<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane" style="overflow-y: auto; height: 100%;">
        <Tree :data="treeList" @on-select-change="clickTree"></Tree>
      </div>
      <div slot="right" class="demo-split-pane" style="overflow-y: auto; height: 100%;">
        <Button @click="add" type="warning" class="mr10 w90">新增科目</Button>
        <vxe-table
          border
          class="mt10"
          resizable
          :data="tableData"
          height="80%"
          stripe
          size="mini"
          align="center"
          :auto-resize="true"
          highlight-hover-row
          highlight-current-row
          show-overflow
        >
          <vxe-table-column type="seq" title="操作">
            <template v-slot="{row}">
              <a @click="addNewChildren(row)" class="mr10">新增子科目</a>
              <a @click="change(row)" class="mr10">修改</a>
              <a @click="deleteOne(row)">删除</a>
            </template>
          </vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
          <vxe-table-column field="titleTypeName" title="科目类别"></vxe-table-column>
          <vxe-table-column title="余额方向">
            <template v-slot="{row}">{{row.balanceDirection == 0 ? '借' : '贷'}}</template>
          </vxe-table-column>
          <vxe-table-column field="auxiliaryAccountingName" title="辅助核算"></vxe-table-column>
          <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          <vxe-table-column title="状态">
            <template v-slot="{ row }">{{ row.status == 1 ? '有效' : '无效' }}</template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </Split>

    <!--新增模态框-->
    <Modal v-model="addNewModal" title="编辑会计科目" width="800">
      <Form :model="formData" :label-width="90" ref="formValidate" :rules="ruleValidate">
        <Row>
          <Col span="12">
            <FormItem label="上级科目：">
              <Input class="w200" v-model="formData.parentCode" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目类别：">
              <Select v-model="formData.titleTypeCode" style="width:200px" disabled>
                <Option
                  v-for="item in subjectList"
                  :value="item.itemCode"
                  :key="item.itemCode"
                >{{ item.itemName }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="科目编码：" prop="titleCode">
              <Input class="w200" v-model="formData.titleCode"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目名称：" prop="titleName">
              <Input class="w200" v-model="formData.titleName"></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="科目全称：">
          <Input style="width: 585px" v-model="formData.fullName"></Input>
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="余额方向：" prop="balanceDirection">
              <RadioGroup v-model="formData.balanceDirection">
                <Radio :label="0">借</Radio>
                <Radio :label="1">贷</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目状态：" prop="status">
              <RadioGroup v-model="formData.status">
                <Radio :label="1">启用</Radio>
                <Radio :label="0">禁用</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="辅助核算：">
              <Select v-model="formData.auxiliaryAccountingCode" style="width:200px">
                <Option
                  v-for="item in assistList"
                  :value="item.itemCode"
                  :key="item.id"
                >{{ item.itemName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关联仓库：">
              <Select v-model="formData.warehouseCode" style="width:200px">
                <Option
                  v-for="item in WareHouseList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="是否必选款项分类:">
          <Checkbox v-model="formData.isAuxiliaryAccounting" :true-value="0" :false-value="1">是</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addSave">保存</Button>
        <Button type="default" @click="addNewModal = false">取消</Button>
      </div>
    </Modal>

    <!--    修改模态框-->
    <Modal v-model="changeModal" title="编辑会计科目" width="800">
      <Form :model="ChangeData" :label-width="90" ref="ModelValidate" :rules="ruleValidate">
        <Row>
          <Col span="12">
            <FormItem label="上级科目：">
              <Input class="w200" v-model="ChangeData.parentCodeTwo" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目类别：">
              <Input class="w200" v-model="ChangeData.titleTypeCode" disabled></Input>
              <!--<Select v-model="ChangeData.titleTypeCode" style="width:200px" disabled>-->
              <!--<Option v-for="item in subjectList" :value="item.itemCode" :key="item.itemCode">{{ item.itemName }}</Option>-->
              <!--</Select>-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="科目编码：" prop="titleCode">
              <Input class="w200" v-model="ChangeData.titleCode"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目名称：" prop="titleName">
              <Input class="w200" v-model="ChangeData.titleName"></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="科目全称：">
          <Input style="width: 585px" v-model="ChangeData.fullName"></Input>
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="余额方向：" prop="balanceDirection">
              <RadioGroup v-model="ChangeData.balanceDirection">
                <Radio :label="0">借</Radio>
                <Radio :label="1">贷</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="科目状态：" prop="status">
              <RadioGroup v-model="ChangeData.status">
                <Radio :label="1">启用</Radio>
                <Radio :label="0">禁用</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="辅助核算：">
              <Select v-model="ChangeData.auxiliaryAccountingCode" style="width:200px">
                <Option
                  v-for="item in assistList"
                  :value="item.itemCode"
                  :key="item.id"
                >{{ item.itemName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关联仓库：">
              <Select v-model="ChangeData.warehouseCode" style="width:200px">
                <Option
                  v-for="item in WareHouseList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="是否必选款项分类:">
          <Checkbox v-model="ChangeData.isAuxiliaryAccounting" :true-value="0" :false-value="1">是</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="changeSave">保存</Button>
        <Button type="default" @click="changeModalFalse">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getTreeList,
  getTableList,
  fzType,
  getSave,
  kmType,
  deletTableList
} from "@/api/accountant/accountant";
import { getWarehouseList } from "_api/salesManagment/sellReturn.js";

export default {
  name: "accounting",
  data() {
    return {
      split1: 0.2,
      treeList: [], //树形图数据
      oneTreeList: {}, //点击获取一级以下树形数据
      tableData: [], //表格数据
      subjectList: [], //科目类别
      addNewModal: false, //新增模块显示
      changeModal: false, //修改增加子项目模态
      formData: {}, //新增数据
      ChangeData: {}, //改变增加子项目数据
      assistList: [{ itemName: "暂无", itemCode: "null" }], // 辅助列表
      WareHouseList: [
        {
          id: "null",
          name: "暂无"
        }
      ], //仓库
      ruleValidate: {
        titleCode: [{ required: true, message: "必填", trigger: "blur" }],
        titleName: [{ required: true, message: "必填", trigger: "blur" }],
        balanceDirection: [
          {
            required: true,
            type: "number",
            message: "请选择",
            trigger: "change"
          }
        ],
        status: [
          {
            required: true,
            type: "number",
            message: "请选择",
            trigger: "change"
          }
        ]
      } //表单校验
    };
  },
  mounted() {
    this.getTreeList();
    this.getAssistList();
    this.getSubjectType();
    this.getWarehouse();
  },
  methods: {
    //获取左侧树形图数据
    async getTreeList() {
      let res = await getTreeList();
      if (res.code === 0) {
        this.treeList = res.data;
        this.changeTree(this.treeList);
        if (JSON.stringify(this.oneTreeList) == "{}") {
          this.$nextTick(() => {
            this.oneTreeList = this.treeList[0];
          });
        }
      }
    },

    //处理树形数据
    changeTree(data) {
      data.map(item => {
        item.title = item.titleCode + "-" + item.titleName;
        // item.expand = true
        if (item.children && item.children.length > 0) {
          this.changeTree(item.children);
        }
      });
    },

    //点击树形数据
    clickTree(data) {
      this.oneTreeList = data[0];
    },

    //获取辅助列表
    async getAssistList() {
      let res = await fzType();
      if (res.code === 0) {
        this.assistList = [...this.assistList, ...res.data];
      }
    },

    //获取科目类别
    async getSubjectType() {
      let res = await kmType();
      if (res.code == 0) {
        this.subjectList = res.data;
      }
    },

    // 获取仓库
    async getWarehouse() {
      let res = await getWarehouseList({
        groupId: this.$store.state.user.userData.groupId,
        shopCode: this.$store.state.user.userData.currentCompany.code
      });
      if (res.code === 0) {
        this.WareHouseList = [...this.WareHouseList, ...res.data];
      }
    },

    //新增
    add() {
      this.addNewModal = true;
      this.formData = {};
      this.$refs.formValidate.resetFields();
      this.formData.parentCode = this.oneTreeList.titleCode;
      // this.formData.titleName = this.oneTreeList.titleName
      this.formData.titleTypeCode = this.oneTreeList.titleTypeCode;
      this.formData.balanceDirection = 0;
      this.formData.status = 1;
      this.formData.auxiliaryAccountingCode = "null";
      this.formData.titleLevel = this.oneTreeList.titleLevel + 1;
    },

    //新增保存
    addSave() {
      this.$refs.formValidate.validate(async valid => {
        if (valid) {
          this.formData.auxiliaryAccountingCode=this.formData.auxiliaryAccountingCode=="null"?"":this.formData.auxiliaryAccountingCode;
          let res = await getSave(this.formData);
          if (res.code == 0) {
            this.getTreeList();
            this.addNewModal = false;
            let arr = await getTreeList();
            if (arr.code === 0) {
              this.treeList = arr.data;
              this.changeTree(this.treeList);
            }
          }
        } else {
        }
      });
    },

    //修改保存
    changeSave() {
      this.$refs.ModelValidate.validate(async valid => {
        if (valid) {
          this.ChangeData.titleTypeCode = this.ChangeData.titleTypeCode.split(
            " - "
          )[0];
          this.ChangeData.auxiliaryAccountingCode=this.ChangeData.auxiliaryAccountingCode=="null"?"":this.ChangeData.auxiliaryAccountingCode;
          let res = await getSave(this.ChangeData);
          if (res.code == 0) {
            let data = {};
            this.changeModal = false
            this.$Message.success('修改成功')
            data.parentCode = this.oneTreeList.titleCode || "";
            let res = await getTableList(data);
            if (res.code === 0) {
              this.tableData = res.data;
              let arr = await getTreeList();
              if (arr.code === 0) {
                this.treeList = arr.data;
                this.changeTree(this.treeList);
              }
            }
            this.changeModal = false;
          }
        } else {
        }
      });
    },

    //新增子节点
    addNewChildren(row) {
      this.changeModal = true;
      this.ChangeData = {};
      this.$refs.ModelValidate.resetFields();
      this.ChangeData.parentCode = row.titleCode;
      this.ChangeData.parentCodeTwo = row.titleCode + " - " + row.titleName;
      this.ChangeData.titleTypeCode =
        row.titleTypeCode + " - " + row.titleTypeName;
      this.ChangeData.titleCode = row.titleCode;
      // this.ChangeData.titleName = row.titleName;
      this.ChangeData.titleTypeName = row.titleTypeName;
      // this.ChangeData.titleTypeCode = row.titleTypeCode
      this.ChangeData.balanceDirection = 0;
      this.ChangeData.status = 1;
      this.ChangeData.parentCode = row.titleCode;
      this.ChangeData.parentNanme = row.fullName;
      this.ChangeData.auxiliaryAccountingCode = "null";
      this.ChangeData.titleLevel = row.titleLevel + 1;
    },

    //修改节点数据
    change(row) {
      console.log(row)
      this.ChangeData = row;
      if (row.titleLevel == 1) {
        this.ChangeData.parentCodeTwo =
          row.parentCode + " - " + row.titleTypeName;
        this.ChangeData.titleTypeCode =
          row.titleTypeCode + " - " + row.titleTypeName;
      } else {
        // let FindArr = this.tableData.filter(
        //   item => item.titleCode == row.parentCode
        // );
        // console.log(FindArr , 99999)
        row.parentTitle = row.parentTitle ? row.parentTitle : ''
        this.ChangeData.parentCodeTwo =
          row.parentCode + " - " + row.parentTitle;
        this.ChangeData.titleTypeCode =
          row.titleTypeCode + " - " + row.titleTypeName;
      }
      // console.log(row)
      this.ChangeData.parentCode = row.parentCode;
      // this.ChangeData.titleTypeCode = this.ChangeData.titleTypeName + this.ChangeData.titleTypeCode;
      this.$refs.ModelValidate.resetFields();
      this.changeModal = true;
    },

    //修改取消
    async changeModalFalse() {
      this.changeModal = false;
      let data = {};
      data.parentCode = this.oneTreeList.titleCode || "";
      let res = await getTableList(data);
      if (res.code === 0) {
        this.tableData = res.data;
        let arr = await getTreeList();
        if (arr.code === 0) {
          this.treeList = arr.data;
          this.changeTree(this.treeList);
        }
      }
    },

    //删除
    deleteOne(row) {
      this.$Modal.confirm({
        title: "警告",
        content: "<p>确认要删除当前信息么?</p>",
        onOk: async () => {
          let data = {};
          data = row;
          let res = await deletTableList(data);
          if (res.code == 0) {
            let data = {};
            data.parentCode = this.oneTreeList.titleCode || "";
            let res = await getTableList(data);
            if (res.code === 0) {
              this.tableData = res.data;
            }
          }
        },
        onCancel: () => {}
      });
    }
  },
  watch: {
    oneTreeList: {
      async handler(newVal, oldVal) {
        let data = {};
        data.parentCode = newVal.titleCode || "";
        let res = await getTableList(data);
        if (res.code === 0) {
          console.log(res.data)
          this.tableData = res.data;
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
  background-color: #fff;
  /*overflow: hidden;*/
}
.demo-split-pane {
  padding: 10px;
}
</style>

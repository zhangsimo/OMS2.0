<template>
  <div>
    <div class="mb20">
      <Button class="mr10" @click="addClientType" v-has="'addStoreClassfy'">
        <span class="center">
          <Icon type="md-add" />添加门店分类
        </span>
      </Button>
      <Button class="mr10" style="border: none" @click="changeClient" v-has="'changeStoreClassfy'">
        <span class="center">
          <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
        </span>
      </Button>
    </div>
    <div>
      <Tree v-if="treeDiagramList" :data="treeDiagramList" @on-select-change="changeOneList"></Tree>
    </div>
    <!--      新增-->
    <Modal v-model="modalShow" title="添加门店分类">
      <Form ref="form" :label-width="100">
        <FormItem label="分类名称：">
          <Input placeholder="请输入分类名称" v-model="addTitle" style="width: 250px" />
        </FormItem>
        <FormItem label="上级名称:">
          <Select v-model="addCode" style="width:250px" class="mr10">
            <Option
              v-for="item in data"
              v-if="item.parentId == 0"
              :value="item.id"
              :key="item.id"
            >{{ item.companyName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirm">确定</Button>
        <Button type="default" @click="modalShow = false">取消</Button>
      </div>
    </Modal>
    <!--      修改-->
    <Modal v-model="changeShow" title="修改门店分类">
      <Form ref="form" :label-width="100">
        <FormItem label="分类名称：">
          <Input placeholder="请输入分类名称" v-model="changeName" style="width: 250px" />
        </FormItem>
        <FormItem label="上级名称:">
          <Select v-model="addCode" style="width:250px" class="mr10" :disabled="changeadd">
            <Option
              v-for="item in data"
              v-if="item.parentId == 0"
              :value="item.id"
              :key="item.id"
            >{{ item.companyName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="change">确定</Button>
        <Button type="default" @click="changeShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { changeTree } from "@/api/system/systemSetting/storeManagement";
export default {
  name: "customerClassification",
  props: {
    data: "",
    treeDiagramList: ""
  },
  data() {
    return {
      data1: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true
            },
            {
              title: "parent 1-2",
              expand: true
            }
          ]
        }
      ],
      rules: {
        addTitle: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      },
      changeadd: true,
      title: "添加客户分类",
      modalShow: false,
      treeList: [],
      list: [],
      newOne: {},
      changeShow: false, //修改模态框
      addTitle: "", //新增名称
      addCode: "", //新增一级id
      changeName: "" //修改名称
    };
  },
  mounted() {},
  methods: {
    resetFields() {
      // this.newOne = {}
      this.$refs.form.resetFields();
    },
    //点击获取当前信息
    changeOneList(data) {
      this.$store.commit("setTreePid", data[0]);
      this.newOne = JSON.parse(JSON.stringify(data[0]));
      if (data[0].parentId == 0) {
        this.addCode = data[0].id;
        this.changeName = data[0].companyName;
      } else {
        this.addCode = data[0].parentId;
        this.changeName = data[0].companyName;
      }
    },
    //新增客户分类
    addClientType() {
      this.title = "添加客户分类";
      this.modalShow = true;
    },
    //确认客户分类
    confirm() {
      if (!this.addTitle.trim()) return this.$Message.error("名称不能为空");
      //成功
      let data = {};
      data.companyName = this.addTitle;
      data.parentId = this.addCode;
      changeTree(data).then(res => {
        if (res.code == 0) {
          this.modalShow = false;
          this.addTitle = "";
          this.addCode = "";
          this.$emit("getNewTree", res);
        }
      });
    },
    //修改客户分类
    changeClient() {
      if (Object.keys(this.newOne).length == 0)
        return this.$Message.error("至少选择一种客户分类");

      this.changeShow = true;
    },
    //     if(Object.keys(this.newOne).length == 0){
    //         this.$Message.error('至少选择一种客户分类');
    //         return false
    //     }
    //     this.title ='修改客户分类'
    //     this.modalShow = true
    //     this.changeadd = true
    //   if (this.newOne.lever == 1){
    //       this.newOne.code = ''
    //   }
    //   if ( this.newOne.lever == 2){
    //         this.newOne.code = this.newOne.pid
    //     }
    // },
    //修改确定
    change() {
      if (!this.changeName.trim()) return this.$Message.error("名称不能为空");
      let data = {};
      data.id = this.newOne.id;
      data.companyName = this.changeName;
      changeTree(data).then(res => {
        if (res.code == 0) {
          this.changeShow = false;
          this.changeName = "";
          this.addCode = "";
          this.newOne = "";
          this.$emit("getNewTree", res);
        }
      });
    }
  },
  watch: {
    modalShow: function(val, old) {
      if (!this.modalShow) {
        this.resetFields();
      }
    }
  }
};
</script>

<style scoped>
</style>

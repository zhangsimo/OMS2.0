<template>
  <Modal title="新增角色" v-model="staffShow" width="500px">
    <div>
      <Form :label-width="80" :model="list" ref="formValidate" :rules="ruleValidate">
        <FormItem label="角色名称:" prop="displayName">
          <Input v-model="list.displayName" placeholder="请输入角色名称" />
        </FormItem>
        <FormItem label="角色标识:">
          <Select v-model="list.roleCode" style="width:200px">
            <Option v-for="item in codeList" :value="item.itemCode" :key="item.id">{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色描述:">
          <Input
            v-model="list.name"
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
            placeholder="角色描述..."
          />
        </FormItem>

      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" @click="suerQuery">保存</Button>
      <Button type="default" @click="staffShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import { addNewStaffe } from "_api/admin/roleApi";
// @ts-ignore
import {getDigitalDictionary} from "@/api/system/essentialData/clientManagement";

@Component
export default class AddRolse extends Vue {
  //当前员工信息
  private list: any = {};
  //唯一标识数组
  private codeList: any =[]
  //判断模态框状态
  private staffShow: boolean = false;


  //获取当前唯一标识数组
  private  getroleList(){
    let data:any = ['ROLE_TYPE']
     getDigitalDictionary(data).then(res =>{
       // @ts-ignore
       if (res.code  == 0 ){
      // @ts-ignore
      this.codeList = res.data['ROLE_TYPE']
    }
     })

  }


  //校验
  private ruleValidate: Object = {
    displayName: [{ required: true, message: "角色名称必填", trigger: "blur" }]
  };
  private systemType: string|number;
  //------------methods----------------
  //打开模态框
  private openModal(systemType) {
    this.systemType = systemType
    this.staffShow = true;
    this.list = {};
    this.handleReset();
    this.getroleList()
  }
  //清除校验
  private handleReset() {
    let form: any = this.$refs.formValidate;
    form.resetFields();
  }
  //确定校验表格
  private suerQuery() {
    let form: any = this.$refs.formValidate;
    form.validate(async valid => {
      if (valid) {
        let data: any = {};
        var arr: any = []
        data = this.list;
        data.systemType = this.systemType;
        data.resIds = [];
        // for(var i = 0 ; i<arr.length; i++) {}
        let res = await addNewStaffe(data);
        if (res.code === 0) {
          this.$message.success("添加成功");
          this.staffShow = false;
          this.$emit("getNewList", res);
        }
      } else {
        this.$Message.error("验证失败");
      }
    });
  }
}
</script>

<style scoped>
</style>

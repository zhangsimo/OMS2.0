<template>
  <Modal title="修改角色" v-model="staffShow" width="500px">
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
        <FormItem label="角色系统:" prop="systemScope">
          <Select v-model="list.systemScope" style="width:200px" disabled>
            <Option v-for="item in sysTypeArr" :value="item.scope" :key="item.id">{{ item.title }}</Option>
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
import { Vue, Component, Prop } from "vue-property-decorator";
// @ts-ignore
import { addNewStaffe } from "_api/admin/roleApi";
// @ts-ignore
import {getDigitalDictionary} from "@/api/system/essentialData/clientManagement";
// @ts-ignore
import { findResScope } from '_api/admin/resourceApi'
@Component
export default class ChangeRolse extends Vue {
  //父组件传过来的值
  @Prop({ type: Object })
  list: Object;
  @Prop({ type: Object })
  role: Object;
  //判断模态框状态
  private staffShow: boolean = false;
  //唯一标识数组
  private codeList: any =[]
  //校验
  private ruleValidate: Object = {
    displayName: [{ required: true, message: "角色名称必填", trigger: "blur" }],
    systemScope:[{required: true, message: "角色系统必填", trigger: "change" ,type:'string'}]
  };

  private sysTypeArr:Array<string>= [] //获取目前所有系统


  private systemType: string|number;
  //-----------------------methods-----------------------------------
  private openModal(systemType) {
    this.systemType = systemType
    this.staffShow = true;
    this.findResScope()
    this.getroleList()
  }

  //获取当前全部系统
  findResScope() {
    findResScope().then(res => {
      this.sysTypeArr = res.data || []
    })
  }


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
        data = this.list;
          // @ts-ignore
        data.resIds = this.role.resIds;
        let res = await addNewStaffe(data);
        if (res.code === 0) {
          // @ts-ignore
          this.$message.success("修改成功");
          data.resIds = data.resourceVOSet
          this.staffShow = false;
          this.$emit("getNewList", res);
        }
      } else {
        // @ts-ignore
        this.$Message.error("验证失败");
      }
    });
  }
}
</script>

<style scoped>
</style>

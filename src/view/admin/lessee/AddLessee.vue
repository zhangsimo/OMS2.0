<template>
  <Modal title="新增租户模板" v-model="staffShow" width="500px">
    <div>
      <Form :label-width="80" :model="list" ref="formValidate" :rules="ruleValidate">
        <FormItem label="模板名称:" prop="twoList">
          <Select v-model="list.oneList" style="width:188px" class="mr10">
            <Option v-for="item in oneList" :value="item.dictCode" :key="item.id">{{ item.dictName }}</Option>
          </Select>
          <Select v-model="list.twoList" style="width:188px" label-in-value @on-change="getLesseeList" clearable >
            <Option v-for="item in twoList" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="模板描述:">
          <Input
            v-model="list.name"
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
            placeholder="模板描述..."
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
import { Vue, Component , Watch  } from "vue-property-decorator";
// @ts-ignore
import { addNewStaffe ,getLesseeOne ,getLesseeTwo} from "_api/admin/lesseeApi";


@Component
export default class AddRolse extends Vue {
  //当前员工信息
  private list: any = {};
  //判断模态框状态
  private staffShow: boolean = false;
  //校验
  private ruleValidate: Object = {
      twoList: [{ required: true, message: "角色名称必填", trigger: "change" }]
  };
  //一级菜单list
  private oneList: any = []
  //二级菜单list
  private twoList:any = []
  //获取到新的值
  private newList:any ={}
  //------------methods----------------
  //打开模态框
  private openModal() {
    this.staffShow = true;
    this.list = {};
    this.getOneList()
    this.handleReset();
  }

  //数据模板一级数
  private async getOneList(){
      let res: any = await getLesseeOne()
      if(res.code == 0){
          this.oneList = res.data
      }
  }
  //清除校验
  private handleReset() {
    let form: any = this.$refs.formValidate;
    form.resetFields();
  }
  //获取二级数据
  private getLesseeList(val){
      this.newList = val
      console.log(val)
  }
  //确定校验表格
  private suerQuery() {
    let form: any = this.$refs.formValidate;
    form.validate(async valid => {
      if (valid) {
        let data: any = {};
        data.name = this.list.name;
        data.moduleId = this.newList.value
        data.displayName = this.newList.label
        let res = await addNewStaffe(data);
        if (res.code === 0) {
            // @ts-ignore
            this.$message.success("添加成功");
          this.staffShow = false;
          this.$emit("getNewList", res);
        }
      } else {
          // @ts-ignore
          this.$Message.error("验证失败");
      }
    });
  }

  //监听一级菜单
  @Watch("list.oneList")
   setOne(newVal , oldVal){
      if (newVal != oldVal && newVal){
          let data:any = {}
          this.list.twoList = ''
          data.dictCode = newVal
          this.$nextTick( async() => {
              let res:any = await getLesseeTwo(data)
              if(res.code == 0){
                  this.twoList = res.data
              }
          })

      }
  }
}
</script>

<style scoped>
</style>

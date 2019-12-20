<template>
  <Modal title="修改角色" v-model="staffShow" width="500px">
    <div>
      <Form :label-width="80" :model="list" ref="formValidate" :rules="ruleValidate">
        <FormItem label="角色名称:" prop="displayName">
          <Input v-model="list.displayName" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色描述:">
          <Input v-model="list.name" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="角色描述..."></Input>
        </FormItem>
      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary' @click="suerQuery">保存</Button>
      <Button type='default' @click="staffShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component,Prop } from "vue-property-decorator";
// @ts-ignore
import { addNewStaffe} from '_api/admin/roleApi'
@Component
export default class ChangeRolse extends Vue{
    //父组件传过来的值
    @Prop({type:Object})
    list:Object
    //判断模态框状态
    private staffShow:boolean =false
   //校验
    private ruleValidate:Object =  {
        displayName: [
            {required: true, message: '角色名称必填', trigger: 'blur'}
        ]
    }

    //-----------------------methods-----------------------------------
    private openModal(){
        this.staffShow = true
        // this.handleReset ()
    }
    //清除校验
    private handleReset () {
        let form:any =this.$refs.formValidate
        form.resetFields()
    }
    //确定校验表格
    private suerQuery () {
        let form:any =this.$refs.formValidate
        form.validate(async (valid) => {
            if (valid) {
                let data:any = {}
                data = this.list
                let res = await addNewStaffe(data)
                if(res.code === 0 ){
                    // @ts-ignore
                    this.$message.success('修改成功')
                    this.staffShow = false
                    this.$emit('getNewList' ,res)
                }
                console.log(res,789)
            } else {
                // @ts-ignore
                this.$Message.error('验证失败');
            }
        })
    }


}

</script>

<style scoped>

</style>

<template>
    <div>
      <div class="mb20">
        <Button class=" mr10" @click="addClientType">
              <span class="center">
                <Icon type="md-add" />添加客户分类
              </span>
        </Button>
        <Button class=" mr10" style="border: none" @click="changeClient">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
        </Button>
      </div>
      <div>
        <Tree v-if="treeDiagramList" :data="treeDiagramList" @on-select-change='changeOneList'></Tree>
      </div>
      <Modal v-model="modalShow" :title="title"  >
        <Form ref="form"  :label-width="100" :rules='rules' :model="newOne" >
          <FormItem label='分类名称：'prop="title"  >
            <Input placeholder='请输入分类名称' v-model='newOne.title' style="width: 250px" ></Input>
          </FormItem>
          <FormItem label='上级名称:' >
            <Select v-model="newOne.code" style="width:250px" class="mr10" :disabled="changeadd">
              <Option v-for="item in data" v-if='item.lever == 1' :value="item.code" :key="item.code">{{ item.title }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot='footer'>
          <Button type='primary' @click="confirm">确定</Button>
          <Button type='default' @click='modalShow = false'>取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import {changeTree} from '@/api/system/systemSetting/storeManagement'
    export default {
        name: "customerClassification",
        props:{
        data:'',
        treeDiagramList:''
        },
        data(){
            return {
                data1: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                            }
                        ]
                    }
                ],
                rules:{
                    title: [
                        {required: true, message: '分类名称不能为空', trigger: 'blur'}
                    ],
                },
                changeadd:true,
                title:'添加客户分类',
                modalShow:false,
                treeList:[],
                list:[],
                newOne:{}
            }
        },
        mounted(){
        },
        methods:{
            resetFields() {
                this.newOne = {}
                this.$refs.form.resetFields()
            },
            //点击获取当前信息
            changeOneList(data){
                    this.$store.commit('setTreePid',data[0])
                this.newOne = JSON.parse(JSON.stringify(data[0]))
            },
            //新增客户分类
            addClientType(){
                this.title = '添加客户分类'
                this.modalShow = true
                this.changeadd = false
                if (Object.keys(this.newOne).length != 0){
                    if (this.newOne.lever == 1){
                        this.newOne.title = ''
                        this.newOne.pid = this.newOne.id
                        this.newOne.id=''
                    }else if ( this.newOne.lever == 2){
                        this.newOne.code = this.newOne.pid
                        this.newOne.id=''
                        this.newOne.title = ''
                    }
                }

            },
            //确认客户分类
            confirm(){
                this.$refs.form.validate(valid => {
                    if (valid) {
                        //成功
                        let data ={}
                        data = this.newOne
                        changeTree(data).then(res => {
                            if (res.code == 0){
                                this.modalShow = false
                                this.$emit('getNewTree' ,res)
                            }
                        })
                    } else {
                        this.$Message.error('信息填写错误');
                    }
                })
            },
            //修改客户分类
            changeClient(){
                if(Object.keys(this.newOne).length == 0){
                    this.$Message.error('至少选择一种客户分类');
                    return false
                }
                this.title ='修改客户分类'
                this.modalShow = true
                this.changeadd = true
              if (this.newOne.lever == 1){
                  this.newOne.code = ''
              }
              if ( this.newOne.lever == 2){
                    this.newOne.code = this.newOne.pid
                }
            },
        },
        watch:{
            modalShow:function (val ,old) {
                if (!this.modalShow){
                    this.resetFields()
                }
            }
        }

    }
</script>

<style scoped>

</style>

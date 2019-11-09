<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <Button class="mr10 w90" @click="newly"><span class="center"><Icon custom="iconfont iconxinzengicon icons" />新增</span></Button>
              <Button class="mr10 w90" @click="amend"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改</span></Button>
              <Button class="mr10 w90" v-if="this.STATE === 1" @click="Start"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用</span></Button>
              <Button class="mr10 w90" v-else-if="this.STATE === 0" @click="forbidden"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用</span></Button>
              <Button class="mr10 w90" v-else><span class="center">未选中</span></Button>
              <Button class="mr10 w90" @click="refresh"><span class="center"><Icon custom="iconfont iconshuaxinicon icons" />刷新</span></Button>
            </div>
            <Modal v-model="classification" title="新增分类" width="500px">
              <div class="audit_nav">
                <div>
                  <label>分类编码：</label><Input v-model="coding" placeholder="请输入分类编码！" style="width: 200px" />
                  <span v-show="code_number" style="margin-left: 70px;margin-top: 5px;color: red;display: block">分类编码不能为空！</span>
                </div>
                <div>
                  <label>分类名称：</label><Input v-model="Name" placeholder="请输入分类名称！" style="width: 200px" />
                  <span v-show="namenull" style="margin-left: 70px;margin-top: 5px;color: red;display: block">分类名称不能为空！</span>
                </div>
                <div>
                  <label>上级分类：</label>
                  <Select v-model="superior" style="width:200px">
                    <Option v-for="item in Class_superior" :value="item.code" :key="item.code">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
              <div class="audit_nav2" slot="footer">
                <Button type="error" @click="Save" class="mr20">保存并新增</Button>
                <Button @click="cancel" class="w90">取消</Button>
              </div>
            </Modal>
            <Modal v-model="classChange" title="修改分类" width="500px">
              <div class="audit_nav">
                <div><label>分类编码：</label><Input v-model="coding1" style="width: 200px" /></div>
                <div>
                  <label>分类名称：</label><Input v-model="Name2" style="width: 200px" />
                </div>
                <div>
                  <label>上级分类：</label>
                  <Select v-model="superior1" style="width:200px">
                    <Option v-for="item in Class_superior" :value="item.code" :key="item.code">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
              <div class="audit_nav2" slot="footer">
                <Button type="error" @click="Save2" class="mr20">保存</Button>
                <Button @click="cancel" class="w90">取消</Button>
              </div>
            </Modal>
          </div>
        </div>
      </section>
      <section class="con-box">
        <demo :Tbdata = 'tbdata' :Loading="loading" @getMsg="getMsg2"></demo>
      </section>
    </div>
</template>

<script>
  import {classification,Select_class,Isdesabled,Add} from '../../../../../api/system/systemSetting/Initialization'
  import demo from './demo'
    export default {
        name: "AccessoriesCategory",
        components:{
            demo,
        },
        data(){
          return {
            loading:true,
            classification: false,
            tbdata:'',
            page: {
              num: 1,
              size: 10,
              total: 0
            },
            // tbdata: [],
            Class_superior: [],
            model1: '',
            namenull:false,
            coding: '',
            Name: '',
            superior: '',
            superior1: '',
            classChange: false,
            code_number: false,
            coding1: '',
            Name2:'',
            rowMessage: [],
            STATE: ''
          }
      },
      methods: {
        // selection(a){
        //   this.rowMessage = a
        //   console.log(this.rowMessage)
        //   // console.log(a)
        //   // console.log(a.isDisabled)
        //   this.STATE = a.isDisabled
        // },
        //新增
        newly(){
          this.classification = true
        },
        // 保存并新增
        Save(){
          if(this.Name === ''){
              this.namenull = true
          }else{
              this.namenull = false
              // this.Name = ''
          }
          if(this.coding === ''){
            this.code_number = true
          }else{
            this.code_number = false
          }
          if(this.Name !== '' && this.coding !== ''){
            let data = {}
            if(this.superior === ''){
              data.parentCode = 0
            }else{
              data.parentCode = this.superior
            }
            data.code = this.coding
            data.name = this.Name
            Add(data).then(res => {
              this.Name = ''
              this.coding = ''
              this.superior = ''
              this.classification = false
              this.getList()
            })
          }

        },
        //取消
        cancel(){
          this.classification = false
        },
        //修改
        amend(){
          if(this.STATE === ""){
            this.$Message.warning('请选择修改对象')
          }else{
            this.classChange = true
            this.coding1 = this.rowMessage.code
            // console.log(this.rowMessage.code)
            // console.log(this.rowMessage)
            this.Name2 = this.rowMessage.name
            // this.superior1 = this.rowMessage.code
          }
        },
        //保存
        Save2(){
          if(this.Name2 !== '' && this.coding1 !== ''){
            let data = {}
            if(this.superior1 === ''){
              data.parentCode = 0
            }else{
              data.parentCode = this.superior1
            }
            data.code = this.coding1
            data.name = this.Name2
            data.id = this.rowMessage.id
            Add(data).then(res => {
              this.superior = ''
              this.classChange = false
              this.getList()
            })
          }
        },
        //取消
        cancel2(){
          this.classChange = false
        },
        //初始化
        getList(){
          let params = {}
          let data = {}
          this.loading = true
          classification({params:params,data:data}).then(res => {
            this.loading = false
            if (res.code === 0) {
              this.tbdata = res.data||[]
            }
          })
        },
        //启用
        Start(){
          let data = {}
          data.id = this.rowMessage.id
          data.isDisabled = 0
          Isdesabled(data).then(res=>{
            this.$Message.warning('启用成功')
            this.getList()
          })
        },
        //禁用
        forbidden(){
          let data = {}
          data.id = this.rowMessage.id
          data.isDisabled = 1
          Isdesabled(data).then(res=>{
            this.$Message.warning('禁用成功')
            this.getList()
          })
        },
        refresh(){
          this.getList()
        },
        //子组件的参数
        getMsg2(a){
          [this.rowMessage, this.STATE ] = a
          console.log(a)
        }
      },
      mounted(){
          this.getList()
      },
      beforeMount() {
          let params = {}
        Select_class(params).then(res => {
          this.Class_superior = res.data
        })
      }
    }
</script>

<style scoped>
@import "index.css";
.virtual-tree-icon {
  visibility: hidden;
  cursor: pointer;
  margin-right: 4px;
}
.virtual-tree-icon.visible {
  visibility: visible;
}
</style>

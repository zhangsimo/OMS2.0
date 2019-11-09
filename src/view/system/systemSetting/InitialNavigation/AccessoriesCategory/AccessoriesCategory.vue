<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <Button class="mr10" @click="newly"><span class="center"><Icon custom="iconfont iconxinzengicon icons" />新增</span></Button>
              <Button class="mr10" @click="amend"><span class="center"><Icon custom="iconfont iconbianjixiugaiicon icons" />修改</span></Button>
              <Button class="mr10"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用</span></Button>
              <Button class="mr10"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用</span></Button>
              <Button class="mr10"><span class="center"><Icon custom="iconfont iconshuaxinicon icons" />刷新</span></Button>
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
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
              </div>
              <div class="audit_nav2" slot="footer">
                <Button type="error" @click="Save" class="mr20">保存</Button>
                <Button @click="cancel" class="w90">取消</Button>
              </div>
            </Modal>
          </div>
        </div>
      </section>
      <section class="con-box">
        <demo :Tbdata = 'tbdata' :Loading="loading"></demo>
      </section>
    </div>
</template>

<script>
  import {classification} from '../../../../../api/system/systemSetting/Initialization'
  import demo from  './demo'
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
            cityList: [
              {
                value: 'New York',
                label: 'New York'
              },
              {
                value: 'London',
                label: 'London'
              },
              {
                value: 'Sydney',
                label: 'Sydney'
              },
              {
                value: 'Ottawa',
                label: 'Ottawa'
              },
              {
                value: 'Paris',
                label: 'Paris'
              },
              {
                value: 'Canberra',
                label: 'Canberra'
              }
            ],
            model1: '',
            namenull:false,
            coding: '',
            Name: '',
            superior: '',
            superior1: '',
            classChange: false,
            code_number: false,
            coding1: '',
            Name2:''
          }
      },
      methods: {
        selection(a){
          console.log(a)
          // this.at_present = a.id
          // // console.log(a.isDisabled)
          // let statusss = JSON.parse(a.status || [])
          // // console.log(statusss.value)
          // this.statuss = statusss.value
          // // console.log(this.statuss)
          // this.zhuanagtai = a.isDisabled
          // console.log(this.zhuanagtai)
          // if (a.isDisabled === 0) {
          //   this.jin = true
          //   this.qi = false
          // }else{
          //   this.jin = false
          //   this.qi = true
          // }
        },
        changePage(p) {
          // console.log(p)
          this.page.num = p
          // this.getList()
        },
        changeSize(size) {
          // console.log(size)
          this.page.num = 1
          this.page.size = size
          // this.getList()
        },
        //新增
        newly(){
          this.classification = true
        },
        // 保存
        Save(){
          if(this.Name === ''){
              this.namenull = true
          }else{
              this.namenull = false
            this.Name = ''
          }
          if(this.coding === ''){
            this.code_number = true
          }else{
            this.code_number = false
            this.coding = ''
          }

        },
        //取消
        cancel(){
          this.classification = false
        },
        //修改
        amend(){
          this.classChange = true
        },
        //初始化
        getList(){
          let params = {}
          let data = {}
          params.page = this.page.num - 1
          params.size = this.page.size
          this.loading = true
          classification({params:params,data:data}).then(res => {
            this.loading = false
            if (res.code === 0) {
              this.page.total = res.data.totalElements
              this.tbdata = res.data||[]
                  console.log(this.tbdata ,1)
            }
          })
        }
      },
      mounted(){
          this.getList()
          setTimeout( () => {
              var Ctor = Vue.extend(this.tableData);
              new Ctor().$mount('#app')

          }, 0)

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

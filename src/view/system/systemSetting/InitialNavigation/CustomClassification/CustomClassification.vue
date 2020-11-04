<template>
    <div>
      <section class="oper-box">
        <el-tabs :tab-position="tabPosition" style="height: 650px">
          <el-tab-pane label="产品线分类">
            <section>
              <div class="oper-top flex">
                <div class="wlf">
                  <div class="db">
                    <Button class="mr10 w90" @click="addProduct" v-has="'addProduct'"><span class="center"><Icon type="md-add" />新增</span></Button>
                    <Button class="mr10 w90" @click="saveProduct" v-has="'saveProduct'"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
                  </div>
                </div>
              </div>
            </section>
            <section class="con-box">
              <Table class="table-highlight-row scroll" size="small" highlight-row :loading="loadingProduct" border :stripe="true" :columns="columnsProduct" :data="tbdataProduct"></Table>
            </section>
          </el-tab-pane>
          <el-tab-pane label="维修性质分类">
            <section>
              <div class="oper-top flex">
                <div class="wlf">
                  <div class="db">
                    <Button class="mr10 w90" @click="addNature" v-has="'addNature'"><span class="center"><Icon type="md-add" />新增</span></Button>
                    <Button class="mr10 w90" @click="saveNature" v-has="'saveNature'"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
                  </div>
                </div>
              </div>
            </section>
            <section class="con-box">
              <Table class="table-highlight-row scroll" size="small" highlight-row :loading="loadingNature" border :stripe="true" :columns="columnsNature" :data="tbdataNature"></Table>
            </section>
          </el-tab-pane>
        </el-tabs>
      </section>
    </div>
</template>

<script>
  import { findByCustomAll,saveCustom } from '../../../../../api/system/systemSetting/Initialization'
  export default {
        name: "CustomClassification",
        data(){
          return {
            tabPosition: 'left',
            //产品
            columnsProduct: [
              {
                title: "序号",
                align: "left",
                type: "index",
                Width: 80,
              },
              {
                title: "产品线分类",
                align: "left",
                Width: 150,
                // render: (h, params) => {
                //   const vm = this;
                //   if (params.row.isEdit) {
                //     return h("input", {
                //       class: "edit",
                //       domProps: {
                //         autofocus: "autofocus",
                //         value: params.row.name
                //       },
                //       on: {
                //         input(event) {
                //           params.row.name = event.target.value;
                //           vm.level.tbdata[params.index] = params.row;
                //           // vm.upOrSaveArr.push()
                //         },
                //         blur() {
                //           params.row.isEdit = false;
                //         }
                //       }
                //     });
                //   } else {
                //     return h(
                //       "div",
                //       {
                //         class: "edit",
                //         on: {
                //           dblclick(event) {
                //             params.row.isEdit = !params.row.isEdit;
                //           }
                //         }
                //       },
                //       params.row.name
                //     );
                //   }
                // },,
                render:(h,params) => {
                  // console.log(params.row.remark)
                  const vm = this
                  return h('Input',{
                    //给div绑定value属性
                    props: {
                      value:params.row.itemName
                    },
                    //给div绑定样式
                    style:{
                      width:'100%'
                    },
                    //给div绑定点击事件　　
                    on: {
                      input(event) {
                        params.row.itemName = event;
                        vm.tbdataProduct[params.index] = params.row;
                        // vm.upOrSaveArr.push()
                      },
                    },
                  })
                },
                minWidth: 200
              },
              {
                title: "状态",
                align: "left",
                // key: "isDisable",
                minWidth: 80,
                render:(h,params) => {
                  let vm = this;
                  return h('Select', {
                      props: {
                        value: params.row.isDisable
                      },
                      style: {
                        width: "100%"
                      },
                      on: {
                        'on-change': (event) => {
                          params.row.isDisable = event;
                          vm.tbdataProduct[params.index] = params.row;
                        }
                      },
                    },
                    [
                      h('Option', {
                        props: {
                          value: 0
                        }
                      }, '启用'),
                      h('Option', {
                        props: {
                          value: 1
                        }
                      }, '禁用')
                    ])
                }
              },
            ],
            tbdataProduct :[],
            loadingProduct: false,
            //性质
            columnsNature: [
              {
                title: "序号",
                align: "left",
                type: "index",
                Width: 150,
              },
              {
                title: "维修性质分类",
                align: "left",
                Width: 150,
                render: (h, params) => {
                  // console.log(params.row.remark)
                  const vm = this
                  return h('Input', {
                    //给div绑定value属性
                    props: {
                      value: params.row.itemName
                    },
                    //给div绑定样式
                    style: {
                      width: '100%'
                    },
                    //给div绑定点击事件　　
                    on: {
                      input(event) {
                        params.row.itemName = event;
                        vm.tbdataNature[params.index] = params.row;
                        // vm.upOrSaveArr.push()
                      },
                    },
                  })
                },
                minWidth: 200
              },
              {
                title: "状态",
                align: "left",
                // key: "isDisable",
                minWidth: 80,
                render:(h,params) => {
                  let vm = this;
                  return h('Select', {
                      props: {
                        value: params.row.isDisable
                      },
                      style: {
                        width: "100%"
                      },
                      on: {
                        'on-change': (event) => {
                          params.row.isDisable = event;
                          vm.tbdataNature[params.index] = params.row;
                        }
                      },
                    },
                    [
                      h('Option', {
                        props: {
                          value: 0
                        }
                      }, '启用'),
                      h('Option', {
                        props: {
                          value: 1
                        }
                      }, '禁用')
                    ])
                }
              },
            ],
            tbdataNature :[],
            loadingNature: false,
          }
        },
      methods:{
        selectionProduct(){},
        //产品线分类新增
        addProduct(){
          this.tbdataProduct.push({ name: " ", oid: Date.now() });
        },
        //产品线分类保存
        async saveProduct(){
          let data = this.tbdataProduct.map(el =>{
            let item = {}
            if(el.id){
              item.id = el.id
            }
            item.itemName = el.itemName;
            item.isDisable = el.isDisable
            item.dictCode = 'CUSTOM_001'
            return item;
          })
          console.log(data)
         let resss =  await saveCustom(data)
          console.log(resss)
          if(resss.code === 0){
            this.$Message.success('保存成功')
            this.getList()
          }else {
            this.getList()
          }
        },
        //维修性质分类新增
        addNature(){
          this.tbdataNature.push({ name: " ", oid: Date.now() });
        },
        //维修性质分类保存
       async saveNature(){
          let data = this.tbdataNature.map(el =>{
            let item = {}
            if(el.id){
              item.id = el.id
            }
            item.itemName = el.itemName;
            item.isDisable = el.isDisable
            item.dictCode = 'CUSTOM_002'
            return item;
          })
          // console.log(data)
        let ress =  await saveCustom(data)
         // console.log(ress)
         if(ress.code === 0){
           this.$Message.success('保存成功')
           this.getList()
         } else {
           this.getList()
         }

        },
        getList(){
          let data = {}
          findByCustomAll(data).then(res => {
            if(res.code === 0){
              this.tbdataProduct = res.data[1].itemVOS
              this.tbdataNature = res.data[0].itemVOS
            }
          })
        }
      },
    mounted(){
      this.getList()
    }
    }
</script>

<style scoped>
.center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.icons {
  padding-right: 5px;
  font-size: 12px!important;
  }
  .scroll{
    height: 580px;
  }
  .scroll >>> .ivu-table{
    overflow-y: auto!important;
  }
</style>

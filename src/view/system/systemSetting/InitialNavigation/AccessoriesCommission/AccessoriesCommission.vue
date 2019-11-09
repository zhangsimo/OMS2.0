<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10">
              <Select v-model="searchType" class="w100">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db mr10">
              <Input v-model="searchNav" placeholder="请输入查询条件" style="width: 120px"></Input>
            </div>
            <div class="db">
              <Button class="mr10 w90" type="warning" @click="Search"><span class="center"><Icon custom="iconfont iconchaxunicon icons" />查询</span></Button>
              <Button class="mr10 w90" @click="Add"><span class="center"><Icon type="md-add"/>添加配件</span></Button>
              <Button class="mr10 w90" @click="Remove"><span class="center"><Icon custom="iconfont iconlajitongicon icons" />删除配件</span></Button>
              <Button class="mr10 w90" @click="Save"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <Table class="table-highlight-row" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata" @on-selection-change="multiple"></Table>
        <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
              @on-page-size-change="changeSize" show-sizer show-total>
        </Page>
      </section>
        <!--配件选择弹框-->
      <Modal v-model="modal" title="配件选择" :footer-hide="true" width="1020">
        <Dia-log @getMsg="getMsg2"></Dia-log>
      </Modal>
    </div>
</template>

<script>
  import {findPageByDynamicQuery,DeleteAccessories,saveOrUpdate} from '../../../../../api/system/systemSetting/Initialization'
  import DiaLog from '../../../../../components/Accessories/dialog';
  // import {arrRemoval} from '../../../../../utils/tools'
    export default {
        name: "AccessoriesCommission",
        components:{
          DiaLog
        },
      data(){
          return {
            List: [
              {
                value: 0,
                name: '编码'
              },
              {
                value: 1,
                name: '名称'
              }],
            searchType: 0,
            searchNav: '',
            getArr:[],//子组件获取的数组
            tbdataArr:[], //合并的数组
            columns: [
              {
                title: '序号',
                align: 'center',
                width: 70,
                type: 'index'
              },
              {
                title: '',
                type:'selection',
                align:'center',
                Width: 70
              },
              {
                title: '配件编码',
                align:'left',
                Width: 200,
                key:'partCode'
              },
              {
                title: '配件名称',
                align:'left',
                key: 'partName',
                minWidth: 120
              },
              {
                title: '销售提成类型',
                align:'left',
                key: '',
                minWidth: 170,
                render:(h,params) => {
                  let vm = this;
                  return h('Select', {
                      props: {
                        value: params.row.type
                      },
                      style: {
                        width: "100%"
                      },
                      on: {
                        'on-change': (event) => {
                          params.row.type = event;
                          vm.tbdata[params.index] = params.row;
                        }
                      },
                    },
                    [
                      h('Option', {
                        props: {
                          value: 1
                        }
                      }, '按销售金额分成'),
                      h('Option', {
                        props: {
                          value: 2
                        }
                      }, '按销售毛利分成')
                    ])
                }
              },
              {
                title: '销售提成比例（%）',
                align:'left',
                key: 'deductRate',
                minWidth: 120,
                // render: (h, params) => {
                //   const vm = this;
                //   if (params.row.isEdit) {
                //     return h("input", {
                //       class: "edit",
                //       domProps: {
                //         autofocus: "autofocus",
                //         value: params.row.deductRate
                //       },
                //       on: {
                //         input(event) {
                //           params.row.deductRate = event.target.value;
                //           vm.tbdata[params.index] = params.row;
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
                //       params.row.deductRate
                //     );
                //   }
                // },
                render:(h,params) => {
                  // console.log(params.row.remark)
                  const vm = this
                  return h('Input',{
                    //给div绑定value属性
                    props: {
                      value:params.row.deductRate
                    },
                    //给div绑定样式
                    style:{
                      width:'100%'
                    },
                    //给div绑定点击事件　　
                    on: {
                      input(event) {
                        params.row.deductRate = event;
                        vm.tbdata[params.index] = params.row;
                      },
                      'on-change': (e) => {
                        if (e.target.value > 100) {
                          this.$Message.warning('请输入0-100数值')
                        }
                      }
                    },
                  })
                }
              },
              {
                title: '备注',
                align:'left',
                key: 'remark',
                minWidth: 120,
                render:(h,params) => {
                  // console.log(params.row.remark)
                  const vm = this
                  return h('Input',{
                    //给div绑定value属性
                    props: {
                      value:params.row.remark
                    },
                    //给div绑定样式
                    style:{
                      width:'100%'
                    },
                    //给div绑定点击事件　　
                    on: {
                      input(event) {
                                  params.row.remark = event;
                                  vm.tbdata[params.index] = params.row;
                                  // vm.upOrSaveArr.push()
                      },
                    },
                  })
                }

              },
              {
                title: '操作人',
                align:'left',
                key: 'createUname',
                minWidth: 120
              },
              {
                title: '操作日期',
                align:'left',
                key: 'createTime',
                minWidth: 120
              }
            ],
            loading:false,
            tbdata: [],
            page: {
              num: 1,
              size: 10,
              total: 0
            },
            modal: false,
            checkboxArr:[]
          }
      },
      methods:{
          //获取数据
        //搜索
        Search(){
          this.page.num = 1
          this.getList()
        },
        //添加
        Add(){
          this.modal = true
        },
        //移除
        Remove(){
          DeleteAccessories(this.checkboxArr).then(res => {
            this.getList()
          })
        },
        //保存
        Save(){
          saveOrUpdate(this.tbdata).then(res => {

          })
        },
        //分页
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
        //初始化
        getList() {
          let params = {}
          let data = {}
          if(this.searchType === 0){
            if(this.searchNav){
              data.partCode = this.searchNav
            }
          }
          if(this.searchType === 1){
            if(this.searchNav){
              data.partName = this.searchNav
            }
          }
          params.page = this.page.num - 1
          params.size = this.page.size
          findPageByDynamicQuery({params:params,data:data}).then(res => {
            // if(res.code === 0){
            //   this.page.total = res.data.totalElements
            //   this.tbdata = res.data.content || []
            // }
            if (res.code === 0) {
              this.page.total = res.data.totalElements
              this.tbdata = res.data.content.map(el => {
                el.oid = el.id;
                el.isEdit = false;
                return el;
              });
              // this.tbdataArr.concat(this.tbdata)
              console.log(this.tbdata)
            }
          })
        },
        //获取子组件数据
        getMsg2(a){
          this.getArr = a
          
          this.tbdata = [...this.tbdata,...this.getArr]
          // let aaa = from(new Set(this.tbdata))
          // console.log(aaa)
        },
        //多选框
        multiple(a){
          console.log(a)
          this.checkboxArr = a
        }
      },
      mounted(){
        this.getList()
      }
    }
</script>

<style scoped>
 @import "../../../../lease/lease/index.css";
</style>
<style scoped>
  .edit {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    outline: none;
    border: 0;
    background-color: transparent;
  }
  .btn-warp{
    justify-content: flex-start!important;
    margin: 0!important;
  }
  .leftnav >>> .ivu-table-wrapper{
    overflow: visible;
  }
  .leftnav{
    padding-bottom: 200px;
  }
</style>

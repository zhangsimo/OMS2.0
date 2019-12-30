<template>
  <div>
    <div class="other-item">
      <a class="mr20" @click="openShow">{{getName || '请选择分店'}}</a>
      <a class="mr20" href="#">客服</a>
      <a class="mr20" @click="toImage">反馈</a>
      <Icon class="mr20" type="md-home" size="16"/>
      <Icon class="mr20" type="md-sync" size="16"/>
      <Icon class="mr20" type="md-close" size="16"/>
    </div>
    <Modal
      v-model="show"
      :footer-hide="true"
      width="800"
      >
      <header style="line-height: 50px">
        <Input v-model="company" class="mr10"  placeholder="请输入店号或公司名称" style="width: 300px" />
        <Button class="mr10" type="warning" @click="query">
          <Icon type="ios-search" size="14" />查询
        </Button>
        <Button class="mr10" type='default' @click="throwData"><Icon type="md-checkmark" /> 选择</Button>
        <Button class="mr10" @click="show = false" type='default' ><Icon type="md-close" /> 取消</Button>
      </header>
      <div>
        <vxe-table
          border
          ref="xTable1"
          height="400"
          :data="tableData"
          highlight-hover-row
          highlight-current-row
          :auto-resize="true"
          align="center"
          @radio-change="selectOne">
          <vxe-table-column type="radio" title="选择" width="50">
          </vxe-table-column>
          <vxe-table-column field="orgid" title="企业号" width="100"></vxe-table-column>
          <vxe-table-column field="tenantCompanyName" title="公司名称"></vxe-table-column>
        </vxe-table>
      </div>
    </Modal>

  </div>
</template>

<script>
    import {getUserAllCompany , setCompany ,changeToken} from '@/api/base/user'
    import {setToken} from '@/libs/util'
    export default {
    name: 'other-item',
      components: {
      },
      data(){
        return {
            show:false, //选择公司
            company:'',//公司
            tableData:[],//公司列表
            companyOneList:'',//点击获取到的公司信息

        }
      },
      computed:{
        getName(){
            return this.$store.state.user.userShopName
        }
      },
      methods: {
          toImage() {
           this.$emit('getImg',{})
          },
          //打开公司选择模态框
          openShow(){
              this.show = true
             console.log(this.$store.state.user)
            this.getList()
          },
          //获取所有公司信息
          async getList(){
              let data ={}
              data.size = 10000
              data.page = 0
              data.id = this.$store.state.user.userData.id
              data.tenantCompanyName = this.company
              let res = await getUserAllCompany(data)
              if(res.code === 0){
                  this.tableData = res.data.content
              }
          },
          //查询
          query(){
              this.getList()
          },
          //点击查询获取当前数据
          selectOne(val){
          this.companyOneList = val.row
          },
          //选择公司
         async throwData(){
          if (!this.companyOneList.id) return this.$message.error('至少选择一条数据')
             let data = {}
                  data.shopId = this.companyOneList.id
                  data.userId = this.$store.state.user.userData.id
             //切换公司跟换token(权限设置)
             let res = await setCompany(data)
                      console.log(res)
                  if(res.code === 0){
                      this.$store.commit('setUserShopName' , res.data.shopName)
                      let data = {}
                      data.tenantId = res.data.tenantId
                      data.shopId = res.data.shopId
                      data.shopkeeper = res.data.shopkeeper
                      localStorage.setItem('oms2-userList' , JSON.stringify(data))
                     res.data.username = this.$store.state.user.userData.username
                    let token = await changeToken( res.data)
                      if(token.code == 0){
                          setToken(token.data.access_token)
                      }
                      console.log(token)
                      this.$nextTick( () => {
                          this.$router.go(0);
                      })
                  }


          }
      }
  }
</script>

<style scoped lang="less">
  .other-item > *{
    color: #333;
    cursor: pointer;
  }
  .image_tofile {
   position: fixed;
    width:90%;
    height: 90%;
    /*top: 10%;*/
    left: 10%;
    background-color: rgba(255,255,255,.1);
  }
</style>

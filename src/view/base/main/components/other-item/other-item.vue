<template>
  <div>
    <div class="other-item">
      <a class="mr20 hoBlue" @click="openFin">极配电商</a>
      <a class="mr20" @click="openShow">{{getName || '请选择分店'}}</a>
      <span class="mr20">{{getPost}}</span>
      <a class="mr20 service" href="#" @click="serviceShow = !serviceShow" v-if="service && shopkeeper == 0">客服
        <div class="title" v-if="serviceShow">
          <div><img src="@/assets/images/home/service.svg" class="mr10"><span>{{serviceList.name}}</span></div>
          <div><img src="@/assets/images/home/serviceTel.svg" class="mr10"><span>{{serviceList.mobile}}</span></div>
          <div><img src="@/assets/images/home/serviceQQ.svg" class="mr10"><span>{{serviceList.qq}}</span></div>
          <div><img src="@/assets/images/home/serviceWX.svg" class="mr10"> <img :src="serviceList.wechatPhoto" alt=""
                                                                                style="width: 80px"></div>
        </div>
      </a>
      <a class="mr20" @click="toImage">反馈</a>
      <Icon class="mr20" type="md-home" size="16" @click="goHome"/>
      <Icon class="mr20" type="md-sync" size="16" @click="go"/>
      <!--      <Icon class="mr20" type="md-close" size="16"/>-->
    </div>
    <Modal
      v-model="show"
      :footer-hide="true"
      width="800"
    >
      <header style="line-height: 50px">
        <Input v-model="company" class="mr10" placeholder="请输入店号或公司名称" style="width: 300px"/>
        <Button class="mr10" type="warning" @click="query">
          <Icon type="ios-search" size="14"/>
          查询
        </Button>
        <Button class="mr10" type='default' @click="throwData">
          <Icon type="md-checkmark"/>
          选择
        </Button>
        <Button class="mr10" @click="show = false" type='default'>
          <Icon type="md-close"/>
          取消
        </Button>
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
          <vxe-table-column field="orgid" title="门店编号" width="150"></vxe-table-column>
          <vxe-table-column field="shortName" title="公司名称"></vxe-table-column>
          <vxe-table-column field="userRoleName" title="角色名称"></vxe-table-column>
        </vxe-table>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {getUserAllCompany, setCompany, changeToken, getService, gParts/**跳转到电商*/} from '@/api/base/user'
  import {setToken} from '@/libs/util'
  import {mapActions} from "vuex";
  import * as env from "../../../../../../config/env.js"

  export default {
    name: 'other-item',
    components: {},
    data() {
      return {
        show: false, //选择公司
        company: '',//公司
        tableData: [],//公司列表
        companyOneList: '',//点击获取到的公司信息
        serviceShow: false,//客服显示
        serviceList: {},//客服信息
        service: false, //客服是否展示
        shopkeeper: 0,//判断是否为租户
      }
    },
    computed: {
      getName() {
        return this.$store.state.user.userData.currentCompany ? this.$store.state.user.userData.currentCompany.shortName ? this.$store.state.user.userData.currentCompany.shortName : '请选择分店' : "请选择分店"
      },
      getPost() {
        let list = this.$store.state.user.userData.currentRoles || []
        let arr = list.filter(item => item.systemType == 0)
        if (arr.length > 0) {
          return arr[0].displayName
        } else {
          return
        }
      }
    },
    mounted() {
      //获取客服信息
      this.getServiceList()
      //获取租户信息
      this.shopkeeper = this.$store.state.user.userData.shopkeeper
    },
    methods: {
      ...mapActions(["handleLogin", "getUserInfo"]),
      toImage() {
        this.$emit('getImg', {})
      },
      //打开公司选择模态框
      openShow() {
        this.show = true
        this.getList()
      },
      //获取所有公司信息
      async getList() {
        let data = {}
        data.size = 10000
        data.page = 0
        data.id = this.$store.state.user.userData.id
        data.tenantCompanyName = this.company
        let res = await getUserAllCompany(data)
        if (res.code === 0) {
          this.tableData = res.data.content
        }
      },
      //查询
      query() {
        this.getList()
      },
      //跳转到级配电商
      async openFin() {
        let account = this.$store.state.user.userData.username
        let envD = "1"
        switch (env.default) {
          case "dev":
            envD = "1";
            break;
          case "test":
            envD = "2";
            break;
          case "audit":
            envD = "3";
            break;
          case "pro":
            envD = "4";
            break;
        }
        await gParts(envD, account)
      },
      //点击查询获取当前数据
      selectOne(val) {
        this.companyOneList = val.row
      },
      //选择公司
      async throwData() {
        if (!this.companyOneList.id) return this.$message.error('至少选择一条数据')
        let data = {}
        data.shopId = this.companyOneList.id
        data.userId = this.$store.state.user.userData.id
        data.shopCode = this.companyOneList.orgid
        //切换公司跟换token(权限设置)
        let res = await setCompany(data)
        if (res.code === 0) {
          // this.$store.commit('setUserShopName' , res.data.shopName)
          let data = {}
          data.tenantId = res.currentCompany ? res.currentCompany.tenantId ? res.currentCompany.tenantId : '' : ''
          data.shopId = res.currentCompany ? res.currentCompany.id ? res.currentCompany.id : '' : ''
          data.shopkeeper = res.data.shopkeeper
          localStorage.setItem('oms2-userList', JSON.stringify(data))
          res.data.username = this.$store.state.user.userData.username
          let token = await changeToken(res.data)
          if (token.code == 0) {
            setToken(token.data.access_token)
            let username = this.$store.state.user.username
            this.getUserInfo(username).then(res => {
              let data = {};
              data.tenantId = res.currentCompany ? res.currentCompany.tenantId ? res.currentCompany.tenantId : '' : ''
              data.shopId = res.currentCompany ? res.currentCompany.id ? res.currentCompany.id : '' : ''
              data.shopkeeper = res.shopkeeper;
              localStorage.setItem("oms2-userList", JSON.stringify(data));
              this.$nextTick(() => {
                this.$router.go(0);
              })

            })

          }
        }


      },
      //去首页
      goHome() {
        this.$router.push({path: '/'})
      },
      //刷新当前页
      go() {
        this.$router.go(0);
      },
      //获取客服信息
      async getServiceList() {
        let res = await getService()
        if (res.code === 0) {
          this.serviceList = res.data
          this.service = true
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .other-item > * {
    color: #333;
    cursor: pointer;
  }

  .image_tofile {
    position: fixed;
    width: 90%;
    height: 90%;
    /*top: 10%;*/
    left: 10%;
    background-color: rgba(255, 255, 255, .1);
  }

  .hoBlue:hover {
    color: #00bdff;
  }

  .service {
    position: relative;

    .title {
      width: 180px;
      padding: 0 0 10px 10px;
      border: 1px solid #999999;
      background-color: #ffffff;
      position: absolute;
      top: 20px;
      left: -70px;

      div {
        span {
          font-size: 18px;
          font-weight: 700;
        }
      }

      img {
        vertical-align: middle;
        width: 20px;
      }
    }
  }
</style>

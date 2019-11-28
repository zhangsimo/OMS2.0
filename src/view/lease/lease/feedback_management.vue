<template>
  <div class="bigbox2">
      <div class="header">
        <Button type="warning" class="mr10" @click="read"><Icon custom="iconfont iconziyuan2 icons"/>标记为已读</Button>
        <Button class="mr10" @click="back"><Icon custom="iconfont iconfanhuiicon icons"/>返回</Button>
      </div>
      <div class="boxnav">
        <div class="navone">
          <div class="navone_one">
            <span>用户信息</span>
          </div>
          <div class="navone_two">
            <div>手机号：{{ Msg.recordMobile }}</div>
            <div>用户名：{{ Msg.createUname }}</div>
            <div>公司：{{ Msg.orgname }}</div>
          </div>
        </div>
        <div class="navone mt30">
          <div class="navone_one">
            <span>问题描述</span>
          </div>
          <div class="navone_two">
            <div>来源：{{ Msg.questionSource }}</div>
            <div>反馈日期：{{ Msg.createTime }}</div>
            <div>功能标题：{{ Msg.funcName}}</div>
          </div>
        </div>
        <div class="navtwo mt30">
          <div class="navone_one">
            <span>反馈图片</span>
          </div>
          <div class="navone_three" @click="SHow">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572496871409&di=751d2e1e8dcdb65b768376837c1d3c81&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D183179797%2C2678753605%26fm%3D214%26gp%3D0.jpg" style="width: 90px;height: 90px" alt="">
          </div>
        </div>
        <div class="navone mt30">
          <div class="navone_one">
            <span>处理情况</span>
          </div>
          <div class="navone_two">
            <div>处理人：{{Msg.settlor}}</div>
            <div>处理日期：{{Msg.settleDate}}</div>
            <div></div>
          </div>
        </div>
        <div class="navone mt30">
          <div class="navone_one">
            <span>回复：</span>
          </div>
          <div class="navone_two">
            <Input v-model="Msg.settleContent" style="width: 970px" />
          </div>
        </div>
      </div>

    <Modal
      v-model="modal10"
      class-name="vertical-center-modal" footer-hide>
      <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572496871409&di=751d2e1e8dcdb65b768376837c1d3c81&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D183179797%2C2678753605%26fm%3D214%26gp%3D0.jpg" style="width:100%;height: 100%" alt="">
    </Modal>
  </div>
</template>

<script>
  import {findItem,ready} from '../../../api/lease/FeedbackManagement'
  export default {
        name: "feedback_management",
      data(){
          return{
              id: this.$route.query.json.id,
              Msg: this.$route.query.json,
            modal10: false
          }
      },
      methods:{
          back(){
            this.$router.push({name: 'FeedbackManagementOne'})
            this.Msg = null
          },
        read(){
            let data = {}
            data.id = this.id
            data.settleContent = this.Msg.settleContent
          ready(data).then(res =>{
            this.$Message.warning('标记已读成功')
          })
        },
        getList(){
            // console.log(this.$route.query.json)
          //   console.log(this.id)
          let data = {}
          data.id = this.id
          findItem(data).then(res => {
          })
        },
        SHow(){
            this.modal10 = true
        }
      },
    mounted(){
          this.getList()
    },
    activated(){
      this.getList()
    },
    beforeCreate(){
      this.Msg = this.$route.query.json
    }
  }
</script>

<style scoped>
  @import "./index.css";
</style>
<style scoped>
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

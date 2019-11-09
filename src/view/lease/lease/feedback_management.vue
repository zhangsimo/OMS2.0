<template>
  <div class="bigbox">
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
            <div>手机号：</div>
            <div>用户名：</div>
            <div>公司：</div>
          </div>
        </div>
        <div class="navone mt30">
          <div class="navone_one">
            <span>问题描述</span>
          </div>
          <div class="navone_two">
            <div>来源：</div>
            <div>反馈日期：</div>
            <div>功能标题：</div>
          </div>
        </div>
        <div class="navtwo mt30">
          <div class="navone_one">
            <span>反馈图片</span>
          </div>
          <div class="navone_three">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1572496871409&di=751d2e1e8dcdb65b768376837c1d3c81&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D183179797%2C2678753605%26fm%3D214%26gp%3D0.jpg" style="width: 90px;height: 90px" alt="">
          </div>
        </div>
        <div class="navone mt30">
          <div class="navone_one">
            <span>处理情况</span>
          </div>
          <div class="navone_two">
            <div>处理人：</div>
            <div>处理日期：</div>
            <div></div>
          </div>
        </div>
        <div class="navone mt30">
          <div class="navone_one">
            <span>回复：</span>
          </div>
          <div class="navone_two">
            <div>好的！我会处理的</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import {findItem,ready} from '../../../api/lease/FeedbackManagement'
  export default {
        name: "feedback_management",
      data(){
          return{
              id: this.$route.query
          }
      },
      methods:{
          back(){
            this.$router.push({name: 'FeedbackManagementOne'})
          },
        read(){
          ready({id:this.id}).then(res =>{
            this.$Message.warning('标记已读成功')
          })
        },
        getList(){
          findItem({id: this.id}).then(res => {
          })
        }
      },
    mounted(){
          this.getList()
    },
    activated(){
      this.getList()
    },
    beforeCreate(){
      this.id = this.$route.query
    }
  }
</script>

<style scoped>
  @import "index.css";
</style>

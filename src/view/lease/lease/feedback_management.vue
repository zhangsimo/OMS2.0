<template>
  <div class="bigbox2">
      <div class="header">
        <Button type="warning" class="mr10" @click="read"><Icon custom="iconfont iconziyuan2 icons"/>标记为已解决</Button>
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
            <div>来源：PC</div>
            <div>反馈日期：{{ Msg.createTime }}</div>
            <div>功能标题：{{ Msg.funcName}}</div>
          </div>
        </div>
        <div class="navtwo mt30">
          <div class="navone_one">
            <span>反馈图片</span>
          </div>
          <div class="navone_three" @click="SHow">
            <img :src='Image' style="width: 180px;height: 90px">
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

        <Modal width="1400px"
               class-name="diff"
               v-model="modal10"
               footer-hide>
          <img :src='Image' style="width:100%;height: 100%" alt="">
        </Modal>


  </div>
</template>

<script>
  import {findItem,ready} from '../../../api/lease/FeedbackManagement'
  import * as api from "_api/lease/customerSM";
  export default {
        name: "feedback_management",
      data(){
          return{
              Msg: {},
              modal10: false,
              Image: '',
              // Image: api.getfile + this.$route.query.json.fileUrl
          }
      },
      methods:{
          back(){
            this.$router.push({name: 'FeedbackManagementOne'})
            this.Msg = null;
            localStorage.removeItem('Datas');
          },
        read(){
            let data = {}
            data.id = this.Msg.id
            data.settleContent = this.Msg.settleContent
          ready(data).then(res =>{
            this.$Message.warning('标记已读成功')
          })
        },
        getList(){
          let data = {}
          data.id = this.Msg.id
          findItem(data).then(res => {
          })
        },
        SHow(){
            this.modal10 = true;
        }
      },
    mounted(){
      let Msg = localStorage.getItem('Datas');
      this.Msg = JSON.parse(Msg);
      if(this.Msg.settleDate){
          let Year=new Date(this.Msg.settleDate).getFullYear();
          let month=new Date(this.Msg.settleDate).getMonth()+1;
          let day=new Date(this.Msg.settleDate).getDate();
          let hour=new Date(this.Msg.settleDate).getHours();
          let Minutes=new Date(this.Msg.settleDate).getMinutes();
          let Seconds=new Date(this.Msg.settleDate).getSeconds();
          month=parseInt(month)<10?'0'+month:month;
          day=parseInt(day)<10?'0'+day:day;
          hour=parseInt(hour)<10?'0'+hour:hour;
          Minutes=parseInt(Minutes)<10?'0'+Minutes:Minutes;
          Seconds=parseInt(Seconds)<10?'0'+Seconds:Seconds;
          this.Msg.settleDate=Year+'-'+month+'-'+day+' '+hour+':'+Minutes+':'+Seconds;
      }
      this.Image = api.getfile + this.Msg.fileUrl || ''
      this.getList()
    },
    activated(){
      this.getList()
    },
    deactivate(){
      localStorage.removeItem('Datas');
    },
    destory(){
      localStorage.removeItem('Datas');
    }
  }
</script>

<style scoped>
  @import "./index.css";
</style>
<style scoped>
</style>

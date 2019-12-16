<template>
  <Modal title="查看审批" v-model="canShow" :styles="{ top: '100px', width: '800px' }">
    <section class="data-container">
      <div class="modal-data">
        <span class="data-name">审批人:</span>
        <div class="data-value flex-center">
          <template v-for="(item,i) in statusData">
            <div class="status-box flex-center">
              <span class="status">{{item.userid}}</span>
              <span class="arrow-box" v-if="i<statusData.length-1"></span>
            </div>
          </template>
        </div>
      </div>
      <div class="modal-data">
        <span class="data-name">审批状态:</span>
        <div class="data-value flex-center">
          <template v-for="(item,i) in statusData">
            <div class="status-box flex-center">
              <span
                class="words"
                :class="{res:item.operationResult=='REFUSE'}"
              >{{item.operationResult|status}}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="modal-data">
        <span class="data-name">审批日期:</span>
        <div class="data-value flex-center">
          <template v-for="(item,i) in statusData">
            <div class="status-box flex-center">
              <span class="date">{{item.date | date}}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="modal-data">
        <span class="data-name">审批意见:</span>
        <div class="data-value flex-center">
          <template v-for="(item,i) in statusData">
            <div class="status-box flex-center">
              <span class="remark">{{item.remark}}</span>
            </div>
          </template>
        </div>
      </div>
    </section>
  </Modal>
</template>

<script>
  import {approvalStatus} from '_api/base/user'
    export default{
        name:'checkApprovalModal',
        props:{
            orderId:{
                type:[Number,String,Object],
                default:''
            },
        },
        data(){
            return {
                statusData:[{name:'提交',status:'已提交'},{name:'产品总监审批',status:'已审批'}],//数据
                canShow:false,//判断弹窗是否显示
            }
        },
        methods:{
            init(){
                this.canShow=true;
                let instanceId=this.orderId.processInstanceId||'';
                approvalStatus({instanceId:instanceId}).then(res=>{
                    if(res.code=='0'){
                        this.statusData=res.data.processInstance.operationRecords;
                    }
                })
            }
        },
        filters:{
            date(value=0){
                let date = new Date(value).toLocaleDateString();
                let time = new Date(value).toLocaleTimeString();
                value = date.split('/').join('-')+' '+time.substr(2);
                return value;
            },
            status(value=''){
                value = value.toLowerCase();
                switch(value){
                    case 'none':
                        value = '已提交';
                        break;
                    case 'agree':
                        value = '已同意';
                        break;
                    case 'refuse':
                        value = '已拒绝';
                        break;
                    case 'redirected':
                        value = '已转交';
                        break;
                }
                return value;
            }
        }
      });
    }
  },
  filters: {
    date(value = 0) {
      let date = new Date(value).toLocaleDateString();
      let time = new Date(value).toLocaleTimeString();
      value = date.split("/").join("-") + " " + time.substr(2);
      return value;
    },
    status(value = "") {
      value = value.toLowerCase();
      switch (value) {
        case "none":
          value = "已提交";
          break;
        case "agree":
          value = "已同意";
          break;
        case "refuse":
          value = "已拒绝";
          break;
        case "redirected":
          value = "已转交";
          break;
      }
      return value;
    }
  }
};
</script>

<style lang="less">
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.data-container {
  padding: 20px 0;
  .modal-data {
    height: 34px;
    margin-bottom: 20px;
    line-height: 34px;
    .data-name {
      width: 70px;
      margin-right: 40px;
      float: left;
    }
    .data-value {
      float: left;
    }
  }
  .status-box {
    .status {
      width: 120px;
      height: 32px;
      border: 1px solid #0099ff;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .words {
      width: 120px;
      color: #00cc66;
      text-align: center;
      margin-left: 70px;
    }
    .date {
      width: 120px;
      text-align: center;
      margin-left: 70px;
      font-size: 12px;
    }
    .remark {
      width: 120px;
      text-align: center;
      margin-left: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }
    &:first-child {
      .words {
        margin-left: 0;
      }
      .date {
        margin-left: 0;
      }
      .remark {
        margin-left: 0;
      }
    }
  }
  .arrow-box {
    width: 60px;
    height: 2px;
    position: relative;
    margin: 0 7px 4px 3px;
    background-color: #0099ff;
    &:after {
      content: "";
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-left: 5px solid #0099ff;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      position: absolute;
      top: -4px;
      right: -10px;
    }
  }
}
.res {
  color: #ff3600 !important;
}
</style>

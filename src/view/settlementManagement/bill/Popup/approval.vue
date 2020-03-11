<template>
  <section class="data-container">
    <div class="modal-data">
      <span class="data-name">{{approvalTit}}:</span>
      <div class="data-value flex-center">
        <template v-for="(item,i) in statusData">
          <div class="status-box flex-center" :key="i">
            <span class="status">{{item.userName}}</span>
            <span class="arrow-box" v-if="i<statusData.length-1"></span>
          </div>
        </template>
      </div>
    </div>
    <div class="modal-data">
      <span class="data-name">审批人:</span>
      <div class="data-value flex-center">
        <template v-for="(item,i) in statusData">
          <div class="status-box flex-center" :key="i">
            <span class="words">{{item.userName}}</span>
          </div>
        </template>
      </div>
    </div>
    <!-- <div class="modal-data">
      <span class="data-name">审批状态:</span>
      <div class="data-value flex-center">
        <template v-for="(item,i) in statusData">
          <div class="status-box flex-center" :key="i">
            <span
              class="words"
              :class="{res:item.operationResult=='REFUSE'}"
            >{{item.operationResult|status}}</span>
          </div>
        </template>
      </div>
    </div>-->
    <div class="modal-data">
      <span class="data-name">审批时间:</span>
      <div class="data-value flex-center">
        <template v-for="(item,i) in statusData">
          <div class="status-box flex-center" :key="i">
            <span class="date">{{item.date | date}}</span>
          </div>
        </template>
      </div>
    </div>
    <!-- <div class="modal-data">
      <span class="data-name">审批意见:</span>
      <div class="data-value flex-center">
        <template v-for="(item,i) in statusData">
          <div class="status-box flex-center" :key="i">
            <span class="remark">{{item.remark}}</span>
          </div>
        </template>
    </div>-->
    <!-- </div> -->
  </section>
</template>
<script>
import bus from "./Bus";
export default {
  props: ["approvalTit"],
  data() {
    return {
      statusData: [
        { name: "提交", status: "已提交" },
        { name: "产品总监审批", status: "已审批" }
      ]
    };
  },
  mounted(){
    bus.$on('approval',val=>{
      console.log(val)
      this.statusData = val
    })
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
<style lang="less" scoped>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.data-container {
  padding: 20px 10px;
  .modal-data {
    height: 34px;
    margin-bottom: 20px;
    line-height: 34px;
    .data-name {
      width: 90px;
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
</style>

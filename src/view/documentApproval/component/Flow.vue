<template>
  <section class="data-container">
    <h5 class="mt20 mb10" style="font-size: 18px">审批信息</h5>
    <div class="box">
    <div class="mb10 pl10" style="background-color:#ccc;line-height: 45px">
      <span class="mr5">审批意见:</span>
      <Input  class="w300 mr10"/>
        <a class="mr10" style="color:#000;"
        ><Icon type="md-checkmark" class="fontType" /> 同意
        </a>
      <a  style="color:#000;">
      <Icon custom="iconfont iconjinzhijinyongicon" style="color: red" />
        不同意
      </a>
    </div>
      <div style="width: 100%;overflow-x: scroll;">

    <div class="modal-data clearfix">
      <div class="data-value flex-center">
        <template v-for="(item,i) in statusData">
          <div class="status-box flex-center" :key="i">
            <span class="status" :class="{changeCOlor: item.color == 12}">{{item.name}}</span>
            <span class="arrow-box" v-if="i<statusData.length-1"></span>
          </div>
        </template>
      </div>
    </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    props: {
      approvalTit:''
    },
    data() {
      return {
        statusData: [
          { name: "提交", status: "已提交" },
          { name: "产品总监审批", status: "已审批" },
          { name: "产品总监审批", status: "已审批" },
          { name: "产品总监审批", status: "已审批" ,color:12},
          { name: "产品总监审批", status: "已审批" },
          { name: "产品总监审批", status: "已审批" },
          { name: "产品总监审批", status: "已审批" },
        ]
      };
    },
    mounted(){
    },
  };
</script>
<style lang="less" scoped>
  .changeCOlor {
    background-color: rgba(0, 153, 255, 1);
  }
  .box {
    border:1px #cccccc solid;
    padding: 10px
  ;
  }
  .fontType {
    font-weight: 700;
    color: green;
    font-size: 20px;
  }
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

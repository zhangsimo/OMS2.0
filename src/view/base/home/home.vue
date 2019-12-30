<template>
  <div>
    <div class="box-left">
      <!--      左侧顶部快速导航-->
      <div class="quick-navigation">
        <div style="display: flex">
          <a class="quick-one quick-all">
            <span>采购计划</span>
          </a>
          <a class="quick-two quick-all">
            <span>采购计划订单</span>
          </a>
          <a class="quick-three quick-all">
            <span>临时采购订单</span>
          </a>
          <a class="quick-four quick-all">
            <span>外采订单</span>
          </a>
        </div>
        <div style="margin: 20px 0px;display: flex">
          <a class="quick-five quick-all">
            <span>销售订单</span>
          </a>
          <a class="quick-six quick-all">
            <span>调拨申请</span>
          </a>
          <a class="quick-seven quick-all">
            <span>应收应付结算</span>
          </a>
          <a class="quick-enigth quick-all">
            <span>库存查询</span>
          </a>
        </div>
      </div>
      <!--      今日数据-->
      <todat-date></todat-date>
      <!--      今日看板-->
      <div style="margin-top: 20px">
        <board></board>
      </div>
    </div>
    <div class="box-right">
      <new-list></new-list>
    </div>
  </div>
</template>

<script>
import * as api from "_api/lease/log";
import todatDate from "./todatDate";
import newList from "./newList";
import board from "./board";

export default {
  name: "home",
  components: {
    "todat-date": todatDate,
    "new-list": newList,
    board: board
  },
  data() {
    return {
    };
  },
  mounted() {
    this.notice();
  },
  methods: {
    async notice() {
      let res = await api.getNotice();
      if (res.code === 0) {
        if (res.data != null) {
          let log = res.data;
          let self = this;
          this.$Notice.open({
            title: log.title,
            duration: 0,
            render: h => {
              return h("div", [
                h("div", {
                  class: 'notice-warp',
                  domProps: {
                    innerHTML: log.content,
                  }
                }),
                h("div", {
                  class: 'btn-warp'
                }, [
                  h("Button", {
                    class: 'notice-button w90',
                    on: {
                      async click() {
                        let res = await api.know();
                        if(res.code === 0) {
                          self.$Notice.destroy();
                        }
                      }
                    }
                  }, '我已知晓')
                ])
              ]);
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.box-left {
  float: left;
  width: calc(~"100% - 420px");
  .quick-navigation {
    overflow: hidden;
  }
  .quick-all {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 110px;
    width: 100%;
    line-height: 110px;
    margin-right: 20px;
    flex-flow: row nowrap;
    span {
      margin-left: 25%;
      font-size: 16px;
      color: #ffffff;
    }
  }
  .quick-one {
    background-image: url("../../../assets/images/home/quick-one.png");
  }
  .quick-two {
    background-image: url("../../../assets/images/home/quick-two.png");
    /*margin: 0 auto;*/
  }
  .quick-three {
    background-image: url("../../../assets/images/home/quick-three.png");
    /*margin: 0 auto;*/
  }
  .quick-four {
    background-image: url("../../../assets/images/home/quick-four.png");
    margin-right: 0;
  }
  .quick-five {
    background-image: url("../../../assets/images/home/quick-five.png");
  }
  .quick-six {
    background-image: url("../../../assets/images/home/quick-six.png");
  }
  .quick-seven {
    background-image: url("../../../assets/images/home/quick-six.png");
  }
  .quick-enigth {
    background-image: url("../../../assets/images/home/quick-enigth.png");
    margin-right: 0;
  }
}
.box-right {
  float: right;
  width: 400px;
  height: 85vh;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(229, 229, 229, 0.8);
  border-radius: 5px;
  padding: 32px 20px;
}
</style>
<style>
.notice-warp {
  height: 100px;
  overflow: auto;
}
.btn-warp {
  margin: 10px auto 0px;
  display: flex;
  justify-content: center;
}
</style>

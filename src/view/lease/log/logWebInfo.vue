<template>
  <main class="log-webinfo page">
    <!--上部-->
    <section class="oper-box">
      <h5>
        <p>{{log.title}}</p>
        <p>更新日期：{{log.publishDate}}</p>
      </h5>
    </section>
    <!--上部-->
    <section class="con-box">
      <div v-html="log.content"></div>
    </section>
  </main>
</template>

<script>
import * as api from "_api/lease/log";
export default {
  name: "logWebInfo",
  data() {
    return {
      log: "",
      id: ""
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getlog();
  },
  methods: {
    async getlog() {
      let params = {
        id: this.id
      };
      let res = await api.getLogbyId(params);
      if (res.code === 0) {
        this.log = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
    h5 {
        padding: 10px 20px;
        p {
            line-height: 20px;
        }
        p:first-child {
            font-size: 16px;
            font-weight: bold;
        }
        p:last-child {
            font-size: 12px;
            color: #999;
        }
    }
</style>
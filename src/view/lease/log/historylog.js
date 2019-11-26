import * as api from "_api/lease/log";

const data = () => {
  return {
    logs: [],
    page: {
        num: 1,
        total: 100,
        size: 10,
    }
  };
};

const mounted = function() {
  this.getlogs();
};

const methods = {
    putlog() {
        this.$router.push({name: 'putlog'});
    },
    goView(id) {
      this.$router.push({name: 'logWebInfo', query: { id }});
    },
    // 获取历史日志
    async getlogs() {
      let params = {
        page: this.page.num - 1,
        size: this.page.size,
      };
      let res = await api.getAllLog(params);
      if(res.code === 0) {
        this.page.total = res.data.totalElements;
        this.logs = res.data.content;
      }
    },
    // 翻页
    changePage(p) {
        this.page.num = p;
        this.getlogs();
    },
    // 修改每页显示条数
    changeSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getlogs();
    },
};

export default {
  name: "historylog",
  data,
  mounted,
  methods
};

import VueUeditorWrap from "vue-ueditor-wrap"; // ES6 Module
import EditorBar from "_c/wangEnduit/Weditor";
import * as api from "_api/lease/log";

const components = {
  VueUeditorWrap,
  EditorBar
};

const data = () => {
  return {
    id: "", // 草稿id
    ueContent: "",
    isClear: false,
    // myConfig: {
    //   // 编辑器不自动被内容撑高
    //   autoHeightEnabled: false,
    //   // 初始容器高度
    //   initialFrameHeight: 420,
    //   // 初始容器宽度
    //   initialFrameWidth: "100%",
    //   // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
    //   serverUrl: api.putImgUrl,
    //   // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
    //   UEDITOR_HOME_URL: "/UEditor/"
    // }
  };
};

const mounted = function() {
  this.getlog();
};

const methods = {
    // 获取草稿
    async getlog() {
      let res = await api.getLog();
      if(res.code === 0 && res.data != null) {
        this.ueContent = res.data.content == null ? '' : res.data.content;
        this.id = res.data.id == null ? '' : res.data.id;
      } 
    },
    // 保存草稿
    async save() {
      let data = {
        content: this.ueContent,
      }
      if(this.id) {
        data.id = this.id;
      }
      let res = await api.sysUpdateLog(data);
      if(res.code === 0) {
        this.id = res.data.id;
        this.$Message.success('保存草稿成功!');
      }
    },
    // 发布
    async add() {
      let data = {
        content: this.ueContent,
      }
      if(this.id) {
        data.id = this.id;
      }
      let res = await api.saveLog(data);
      if(res.code === 0) {
        this.$Message.success('发布日志成功!');
        this.$router.push({name: 'historylog'});
      }
    },
};

export default {
  name: "",
  components,
  data,
  mounted,
  methods
};

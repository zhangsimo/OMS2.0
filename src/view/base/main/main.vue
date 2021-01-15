<template>
  <Layout style="height: 100%" class="main" id="routes">
    <Sider
      hide-trigger
      collapsible
      :width="200"
      :collapsed-width="60"
      v-model="collapsed"
    >
      <side-menu
        :accordion="false"
        :active-name="activeNameFun"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con" v-show="!collapsed">
          OMS管理系统
        </div>
        <div class="logo-con" style="font-size: 18px" v-show="collapsed">
          OMS
        </div>
        <div class="left-search" v-show="!collapsed">
          <!--<span>极配订单管理系统</span>-->
        </div>
      </side-menu>
    </Sider>
    <Layout style="overflow: hidden">
      <Header class="header-con">
        <header-bar
          :collapsed="collapsed"
          @on-coll-change="handleCollapsedChange"
        >
          <user :user-avator="userAvator" :user-data="userData" />
          <!--<span class="fs12">版本号：{{omsVersion}}</span>-->
          <fullscreen v-model="isFullscreen" style="margin-right: 20px;" />
          <other-item @getImg="toImage"></other-item>
          <!--<message_index></message_index>-->
        </header-bar>
      </Header>
      <Content class="ivu-layout-wrap" style="position: relative">
        <Layout>
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <!--<my-bread-crumb></my-bread-crumb>-->
          <Content
            class="content-wrapper"
            style="position: absolute;top: 67px;left: 0;right: 0;bottom: 0;overflow-y: auto"
          >
              <div class="image_tofile" ref="imageTofile">
                  <!-- <keep-alive :include="cacheList">
                    <router-view />
                  </keep-alive> -->
                  <keep-alive>
                    <router-view v-if="$route.meta.keepAlive" :max="10" ref="box"/>
                  </keep-alive>
                  <router-view v-if="!$route.meta.keepAlive" :max="10" />
              </div>
            <!--            反馈模态框-->
            <Modal v-model="screenshot" fullscreen title="反馈意见">
              <div style="display: flex;border-bottom: 1px #cccccc solid">
                <canvas
                  id="radom"
                  :width="canvasWidth"
                  :height="canvasHeight"
                  @mousedown="canvasDown($event)"
                  @mousemove="canvasMove($event)"
                  @mouseup="canvasUp($event)"
                  @mouseleave="canvasLeave($event)"
                  ref="canvas"
                ></canvas>
                <div style=" flex-flow: row nowrap;">
                  <div class="writeIn">
                    <h5 style="margin-bottom: 5px">选择问题</h5>
                    <Row>
                      <Col
                        span="8"
                        v-for="(item, index) in queryList"
                        :key="index"
                        style="text-align: center;margin-bottom: 5px"
                      >
                        <span
                          :class="{ active: spanIndex.indexOf(index) > -1 }"
                          class="center"
                          @click="add(item, index)"
                          >{{ item.name }}</span
                        >
                      </Col>
                    </Row>
                    <Input
                      v-model="value17"
                      maxlength="100"
                      show-word-limit
                      type="textarea"
                      :rows="11"
                      placeholder="请提出宝贵意见..."
                      style="width: 100%"
                    />
                  </div>
                  <div>
                    <Row style="text-align: center">
                      <Col span="8">
                        <Button type="success" @click="drawWithInfo"
                          >标记</Button
                        >
                      </Col>
                      <Col span="8">
                        <ColorPicker v-model="penColor" recommend />
                      </Col>
                      <Col span="8">
                        <Button type="error" @click="clear">清除</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              <div slot="footer">
                <Button type="primary" @click="sureAdd">确定</Button>
                <Button type="default" @click="screenshot = false">取消</Button>
              </div>
            </Modal>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import { mapMutations, mapActions } from "vuex";
import { getNewTagList, getNextName } from "@/libs/util";
import minLogo from "@/assets/images/logo-min.jpg";
import maxLogo from "@/assets/images/logo.png";
import "./main.less";
import Message_index from "./components/message/message";

import CUR_VERSION from "@/config/version";
import OtherItem from "./components/other-item/other-item";
import MyBreadCrumb from "./components/header-bar/mybread-crumb/myBreadCrumb";
import html2canvas from "html2canvas";

import { feedbackRecord, compress,up } from "../../../api/lease/FeedbackManagement";

export default {
  name: "Main",
  components: {
    MyBreadCrumb,
    OtherItem,
    Message_index,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User,
    html2canvas
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      keyWord: "",
      htmlUrl: "",
      omsVersion: CUR_VERSION,
      screenshot: false,
      queryList: [
        { name: "车架号查不到", value: 1 },
        { name: "零件号查不到", value: 2 },
        { name: "缺少车型", value: 3 },
        { name: "数据不全", value: 4 },
        { name: "数据错误", value: 5 },
        { name: "数据不够新", value: 6 },
        { name: "速度慢", value: 7 },
        { name: "没有唯一性", value: 8 },
        { name: "其他", value: 9 }
      ],
      spanIndex: [], //点击意见
      value17: "", //意见内容
      canvasWidth: 0,
      canvasHeight: 0,
      context: {}, // canvas对象
      // 是否处于绘制状态
      canvasMoveUse: false,
      // 绘制矩形和椭圆时用来保存起始点信息

      // 储存坐标信息
      // 背景图片缓存
      info: "", //判定标记
      img: "", //实例化canvas图片
      canvas: "", //实例化canvas
      query: [], //点击的问题
      penColor: "#F30606"
    };
  },
  computed: {
    activeNameFun() {
      const thisName = this.$route.meta.activeName;
      if (thisName) {
        return this.$route.meta.activeName;
      } else {
        return this.$route.name;
      }
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvator() {
      return this.$store.state.user.avatorImgPath;
    },
    userData() {
      return this.$store.state.user.userData;
    },
    cacheList() {
      let arr = this.tagNavList.length
        ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
        : [];
      return arr;
    },
    menuList() {
      return this.$store.getters.menuList;
    },
    local() {
      return this.$store.state.app.local;
    }
  },
  methods: {
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal"]),
    ...mapActions(["handleLogin"]),
    //初始化canvas
    initDraw() {
      // 初始化画布
      this.canvas = document.getElementById("radom");
      this.ctx = this.canvas.getContext("2d");
      // 初始化背景图片
      this.img = new Image();
      this.img.src = this.htmlUrl;
      this.canvasWidth = document.documentElement.clientWidth - 300;
      this.canvasHeight = document.documentElement.clientHeight - 100;
      this.img.onload = () => {
        this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, this.canvasHeight);
      };
    },
    //添加画笔
    drawWithInfo() {
      this.ctx.lineWidth = 1; //设置线的宽度
      this.info = "pen";
    },
    //清除画板
    clear() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.img = new Image();
      this.img.src = this.htmlUrl;
      this.img.onload = () => {
        this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, this.canvasHeight);
      };
    },
    canvasDown(e) {
      this.canvasMoveUse = true;
      const canvasX = e.clientX - e.target.offsetLeft;
      const canvasY =
        e.clientY -
        e.target.offsetTop +
        document.documentElement.scrollTop -
        50;
      this.ctx.strokeStyle = this.penColor;
      this.ctx.beginPath(); // 移动的起点
      this.ctx.moveTo(canvasX, canvasY);
    },
    canvasMove(e) {
      if (this.canvasMoveUse) {
        // 只有允许移动时调用
        if (this.info == "pen") {
          const t = e.target;
          let canvasX;
          let canvasY;
          canvasX = e.clientX - t.offsetLeft;
          canvasY =
            e.clientY - t.offsetTop + document.documentElement.scrollTop - 50;
          this.ctx.lineTo(canvasX, canvasY);
          this.ctx.stroke();
        }
      }
    },
    canvasUp(e) {
      this.canvasMoveUse = false;
    },
    canvasLeave(e) {
      this.canvasMoveUse = false;
    },

    turnToPage(name) {
      // console.log('turToPage',name);
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name: name
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, name) {
      const nextName = getNextName(this.tagNavList, name);
      this.setTagNavList(res);
      if (type === "all") {
        this.turnToPage("home");
      } else if (this.$route.name === name) {
        this.$router.push({ name: nextName.res, query: nextName.query });
      }
    },
    handleClick(item) {
      // this.turnToPage(item.name)
      this.$router.push({
        name: item.name,
        query: item.query
      });
    },
    //点击选中意见
    add(data, idx) {
      let arrIndex = this.spanIndex.indexOf(idx);
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1);
      } else {
        this.spanIndex.push(idx);
      }
      if (this.query.some(item => item.value == data.value)) {
        this.query = this.query.filter(item => item.value != data.value);
      } else {
        this.query.push(data);
      }
    },
    //图片
    toImage() {
      if (this.canvas) {
        this.clear();
        this.info = "";
      }
      this.screenshot = true;
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(this.$refs.imageTofile, {
        backgroundColor: null
      }).then(canvas => {
        let url = canvas.toDataURL("image/png");
        this.htmlUrl = url;
        if (url) {
        }
        this.initDraw();
        // 把生成的base64位图片上传到服务器,生成在线图片地址
        // this.sendUrl();
      });
    },

    //确认添加
    async sureAdd() {
      let image = this.canvas.toDataURL("image/png");
        const blob = this.dataURItoBlob(image)
      let data = {};

        //转换图片文件
      let ress = await up(blob);
      if(ress.data.code === 0) {
        data.fileUrl = ress.data.data.url;
          let type = this.query.map(item => {
              return item.name;
          });
          var type2 = type.join(",");
          data.funcAction = window.location.pathname;
          data.funcName = this.$route.meta.title;
          data.questionContent = this.value17;
          data.questionType = type2;
          feedbackRecord(data).then(res => {
              if (res.code === 0) {
                  this.$Message.warning("反馈成功");
                  this.screenshot = false;
              }
          });
      }else {
          let type = this.query.map(item => {
              return item.name;
          });
          var type2 = type.join(",");
          data.funcAction = window.location.pathname;
          data.funcName = this.$route.meta.title;
          data.questionContent = this.value17;
          data.questionType = type2;
          feedbackRecord(data).then(res => {
              if (res.code === 0) {
                  this.$Message.warning("反馈成功");
                  this.screenshot = false;
              }
          });
      }
    },
      //base64转blob
      dataURItoBlob(dataURI) {
          // convert base64/URLEncoded data component to raw binary data held in a string
          let byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0) {
              byteString = atob(dataURI.split(',')[1]);
          } else byteString = unescape(dataURI.split(',')[1]);
          // separate out the mime component
          const mimeString = dataURI
              .split(',')[0]
              .split(':')[1]
              .split(';')[0];

          // write the bytes of the string to a typed array
          const ia = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ia], { type: mimeString });
      },
  },
  watch: {
    $route(newRoute) {
      this.setBreadCrumb(newRoute.matched);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.addTag(this.$store.state.app.homeRoute);
    this.setBreadCrumb(this.$route.matched);
    //初始化canvas
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
  }
};
</script>
<style scoped lang="less">
.image_tofile {
  height: 100%;
}
.imgBox {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  width: 90%;
  height: 100%;
  padding: 50px;
}
.writeIn {
  margin-bottom: 10px;
  width: 250px;
  height: 300px;
  border: 1px #cccccc solid;
  margin-left: 5px;
  background-color: rgba(216, 216, 216, 0.3);
  font-size: 12px;
  padding: 2px;
  border-radius: 5px;
}
.center {
  display: inline-block;
  border-radius: 3px;
  width: 75px;
  /*border: 1px #333333 solid;*/
  background-color: #fff;
}
.center:hover {
  cursor: pointer;
  background-color: #2399ff;
  color: #ffffff;
}
.active {
  background-color: #2399ff;
  color: #ffffff;
}
.sign {
}
</style>

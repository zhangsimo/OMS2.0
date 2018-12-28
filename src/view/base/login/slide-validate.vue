<template>
  <div class="drag">
    <div class="bg" :style="{width: bg.width + 'px', backgroundColor: bg.backgroundColor, transition: bg.transition}"></div>
    <div class="text" onselectstart="return false;" :style="{color: text.color}">{{text.innerHTML}}</div>
    <div class="btn" :style="{left: btn.left + 'px', color: btn.color, borderColor: btn.borderColor, transition: btn.transition}">
      <Icon v-if="success" type="checkmark-round" size="20"></Icon>
      <Icon v-else type="android-arrow-forward" size="20"></Icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: "slide-validate",
    data() {
      return {
        bg: {
          width: 0,
          backgroundColor: '#75CDF9',
          transition: ''
        },
        btn: {
          left: 0,
          color: '#666',
          borderColor: '#e8e8e8',
          innerHTML: '&gt;&gt;',
          transition: ''
        },
        text: {
          innerHTML: '请拖动滑块完成验证',
          color: "#666"
        },
        success: false//是否通过验证的标志
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        let $ = function (selector) {
            return document.querySelector(selector);
          },
          box = $(".drag"),//容器
          bg = $(".bg"),//背景
          text = $(".text"),//文字
          btn = $(".btn"),//滑块
          distance = box.offsetWidth - btn.offsetWidth;//滑动成功的宽度（距离）

        //二、给滑块注册鼠标按下事件
        btn.onmousedown = (e) => {

          //1.鼠标按下之前必须清除掉后面设置的过渡属性
          this.btn.transition = "";
          this.bg.transition = "";

          //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。

          //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
          e = e || window.event;
          let downX = e.clientX;

          //三、给文档注册鼠标移动事件
          document.onmousemove = (e) => {

            e = e || window.event;
            //1.获取鼠标移动后的水平位置
            let moveX = e.clientX;

            //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
            let offsetX = moveX - downX;

            //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
            if (offsetX > distance) {
              offsetX = distance;//如果滑过了终点，就将它停留在终点位置
            } else if (offsetX < 0) {
              offsetX = 0;//如果滑到了起点的左侧，就将它重置为起点位置
            }

            //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
            this.btn.left = offsetX;
            this.bg.width = offsetX + 5;

            //如果鼠标的水平移动距离 = 滑动成功的宽度
            if (offsetX == distance) {

              //1.设置滑动成功后的样式
              this.text.innerHTML = "验证通过";
              this.text.color = "#fff";

              this.btn.innerHTML = "ok";
              this.btn.color = "green";
              this.btn.borderColor = "lightgreen";

              this.bg.backgroundColor = "lightgreen";

              //2.设置滑动成功后的状态
              this.success = true;
              //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
              btn.onmousedown = null;
              document.onmousemove = null;

              //3.成功解锁后的回调函数
              // setTimeout(function(){
              //   alert('解锁成功！');
              // },100);
            }
          }

          //四、给文档注册鼠标松开事件
          document.onmouseup = (e) => {

            //如果鼠标松开时，滑到了终点，则验证通过
            if (this.success) {
              // alert('解锁成功！');
              return;
            } else {
              //反之，则将滑块复位（设置了1s的属性过渡效果）
              this.btn.transition = "left .5s ease";
              this.bg.transition = "width .5s ease";

              this.btn.left = 0;
              this.bg.width = 0;
            }
            //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
            document.onmousemove = null;
            document.onmouseup = null;
          }


        }
      }
    }
  }
</script>

<style scoped lang="less">
  .drag {
    width: 100%;
    height: 40px;
    position: relative;
    margin: 0 auto;
    border-radius: 4px;
    background-color: #e8e8e8;
  }

  .bg {
    width: 0px;
    top: 0;
    left: 0;
    bottom: 0;
    position: absolute;
    background-color: #75CDF9;
    border-radius: 4px;
  }

  .text {
    position: absolute;
    width: 100%;
    height: 40px;
    line-height: 40px;
    top: 0;
    left: 0;
    text-align: center;
    user-select: none;
    color: #666;
  }

  .btn {
    width: 40px;
    height: 38px;
    line-height: 38px;
    position: absolute;
    /*border: 1px solid #e8e8e8;*/
    top: 1px;
    cursor: move;
    text-align: center;
    background-color: #fff;
    user-select: none;
    border-radius: 4px;
    i {
      vertical-align: middle;
    }
  }
</style>

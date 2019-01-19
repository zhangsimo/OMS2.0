<template>
  <div>
    <section class="con-box" style="position: relative;height: 600px;min-width: 1000px">
      <canvas id="canvas" width="1000" height="500">don't support</canvas>
      <div id="container"></div>
      <Icon class="refresh" type="loop" size="26" @click="refresh"></Icon>
    </section>
  </div>
</template>
<script>

  export default {
    name: 'orderLink',
    data() {
      return {
        nodePointerMap: {},
        elIndex: 0,
        container: null,
        ctx: null
      }
    },
    components: {},
    activated() {
    },
    mounted() {
      this.container = document.querySelector('#container')
      this.ctx = document.querySelector('#canvas').getContext('2d')

      this.ready()
    },
    methods: {
      click(id) {
        alert(id)
      },
      refresh() {
        this.ctx.clearRect(0, 0, 1000, 500)
        this.container.innerHTML = ''
        this.nodePointerMap = {}
        this.elIndex = 0

        let loading = this.$loading('正在刷新...')
        setTimeout(() => {
          loading()
          this.hs()
        }, 1500)
      },
      ready() {
        this.hs()
        // this.mall()
      },
      hs() {

        let hs = this.node(20, 250, '华胜订单:HSOD-2018102565000001')
        let dr = this.node(300, 250, '定向订单:DDOD-2018102565000001')

        let supplier = this.node(580, 120, '直供订单:SPOD-2018102565000001', true, 3)
        let store = this.node(580, 250, '门店订单:DDOD-2018102565000001', true, 10)
        let inquiry = this.node(580, 380, '询价订单:IQOD-2018102565000001', false)
        let quote = this.node(350, 450, '报价回单:IQOD-2018102565000001')

        this.line(hs, dr)
        this.line(dr, supplier)
        this.line(dr, store)
        this.line(dr, inquiry)
        this.line(quote, inquiry)
        this.line(inquiry, store)
      },
      mall() {
        let mall = this.node(20, 250, '电商订单:MLOD-2018102565000001')
        let trnasfer = this.node(300, 250, '电商转单:MTOD-2018102565000001')

        let store = ''//this.node(580, 250, '门店订单:STOD-2018102565000001', true, 2)

        this.line(mall, trnasfer)
        this.line(trnasfer, store)
      },
      node(x, y, text, status, count) {
        this.elIndex++
        let ctx = this.ctx

        let texts = text.split(':')
        let name = texts[0]
        text = texts[1]

        if (count && count > 1) {
          text += '-(' + count + ')'
        }

        let textWidth = ctx.measureText(text).width + 25

        let centerPointer = {
          x: x + textWidth / 2,
          y: y + 15
        }

        let id = 'node-' + this.elIndex
        let span = document.createElement('span')
        span.id = id
        span.innerText = text

        span.className = status == undefined ? 'node' : status ? 'node succ' : 'node fail'

        if (count && count == 10) {
          span.className = 'node warn'
        }

        span.onclick = () => {
          this.click(id)
        }

        span.style.top = y + 'px'
        span.style.left = x + 'px'
        this.container.appendChild(span)

        if (count > 1) {
          let bgSpan = document.createElement('span')
          bgSpan.innerText = text
          bgSpan.className = 'node'
          bgSpan.style.top = (y - 5) + 'px'
          bgSpan.style.left = (x + 5) + 'px'
          bgSpan.style.zIndex = -1
          this.container.appendChild(bgSpan)
        }
        if (count > 2) {
          let bgSpan = document.createElement('span')
          bgSpan.innerText = text
          bgSpan.className = 'node'
          bgSpan.style.top = (y - 10) + 'px'
          bgSpan.style.left = (x + 10) + 'px'
          bgSpan.style.zIndex = -2
          this.container.appendChild(bgSpan)
        }

        let nameSpan = document.createElement('span')
        nameSpan.innerText = name
        nameSpan.className = 'name'
        span.appendChild(nameSpan)

        this.nodePointerMap[id] = centerPointer

        return span
      },
      line(el1, el2) {

        if (!el1 || !el2) {
          return
        }

        let id1 = el1.id
        let id2 = el2.id

        let p1 = this.nodePointerMap[id1]
        let p2 = this.nodePointerMap[id2]

        let ctx = this.ctx
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = '#ccc'
        ctx.stroke()

        let cx = (p1.x + p2.x) / 2
        let cy = (p1.y + p2.y) / 2

        let r = this.getTanDeg((p2.y - p1.y) / (p2.x - p1.x)) + 45

        let bgSpan = document.createElement('span')
        bgSpan.className = 'arrow-p'
        bgSpan.style.top = (cy - 10) + 'px'
        bgSpan.style.left = (cx - 10) + 'px'
        bgSpan.style.zIndex = -2
        bgSpan.style.transform = 'rotate(' + r + 'deg)'
        this.container.appendChild(bgSpan)
      },
      getTanDeg(tan) {
        let result = Math.atan(tan) / (Math.PI / 180);
        result = Math.round(result);
        return result;
      }
    },
    computed: {
    }
  }
</script>
<style lang="less">
  #canvas {
    position: absolute;
    left: 50%;
    right: 0;
    margin-left: -500px;
    z-index: 1;
    /*box-shadow: 2px 2px 5px 1px #aaa;*/
  }

  #container {
    position: absolute;
    left: 50%;
    right: 0;
    width: 1000px;
    height: 500px;
    margin-left: -500px;
    z-index: 2;
    font-family: "Microsoft YaHei";
  }
  .succ, .fail, .warn, .node {
    position: absolute;
    display: inline-block;
    box-shadow: 2px 2px 5px 2px #aaa;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background: #fefefe;
    color: #666;
    font-size: 12px;
    &:hover {
      background: #eeeeee;
      cursor: pointer;
    }
  }
  .node .name {
    position: absolute;
    display: inline-block;
    top: 100%;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 0;
  }
  .node:after {
    position: absolute;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    top: -8px;
    left: -8px;
    font-size: 12px;
    border-radius: 10px;
    color: white;
  }
  .succ:after {
    content: '√';
    background: #4caf50;
  }
  .warn:after {
    content: '！';
    background: #ffa144;
  }
  .fail:after {
    content: '!!';
    background: #d73b2f;
  }

  .arrow-p {
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  .arrow-p:after {
    content: '';
    position: absolute;
    display: inline-block;
    width: 10px;
    height: 10px;
    top: 9.5px;
    left: 0;
    border: 1px solid #aaa;
    border-bottom-width: 0;
    border-left-width: 0;
  }
</style>
<style scoped lang="less">
  .refresh {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #999;
    cursor: pointer;
    &:hover {
      color: #666;
    }
  }
</style>

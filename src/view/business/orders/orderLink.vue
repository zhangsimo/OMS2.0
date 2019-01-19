<template>
  <div>
    <section class="con-box" style="position: relative;height: 600px;min-width: 1000px">
      <canvas id="canvas" width="1000" height="500">don't support</canvas>
      <div id="container"></div>
      <Icon class="refresh" type="loop" size="26" @click="getData"></Icon>
    </section>

    <Modal v-model="showLines" :title="title" width="530" ok-text="关闭" cancel-text="">
      <div v-if="orderNo" class="pb15">
        <span>订单号：</span>
        <Select v-model="orderNo" class="w240" @on-change="orderNoChange">
          <Option v-for="item in orderNoArr" :value="item.value" :key="item.value">{{ item.value }}</Option>
        </Select>
      </div>
      <OrderLine :tbdata="lines"></OrderLine>
    </Modal>

  </div>
</template>
<script>

  import {routekin} from '_api/business/orderApi'
  import OrderLine from './orderLine'

  export default {
    name: 'orderLink',
    components: {OrderLine},
    data() {
      return {
        nodePointerMap: {},
        elIndex: 0,
        container: null,
        ctx: null,
        id: '',
        dataMap: {},
        showLines: false,
        title: '',
        lines: [],
        orderMap: {},
        orderNoArr: [],
        orderNo: ''
      }
    },
    activated() {
      if (this.id && this.id != this.$route.query.id) {
        this.getData()
      }
    },
    mounted() {
      this.container = document.querySelector('#container')
      this.ctx = document.querySelector('#canvas').getContext('2d')

      this.ready()
    },
    methods: {
      orderNoChange() {
        this.lines = this.orderMap[this.orderNo]
      },
      click(id, name) {
        this.orderNoArr = []
        this.orderNo = ''

        let title = ''

        if (name.indexOf('门店') > -1) {

          let storeMap = this.dataMap.storeMap
          for (let key in storeMap) {
            this.orderNoArr.push({value: key})
          }
          this.orderMap = storeMap

          this.orderNo = this.orderNoArr[0].value
          this.orderNoChange()
          title = name

        } else if (name.indexOf('直供') > -1) {
          let supplyMap = this.dataMap.supplyMap
          for (let key in supplyMap) {
            this.orderNoArr.push({value: key})
          }
          this.orderMap = supplyMap

          this.orderNo = this.orderNoArr[0].value
          this.orderNoChange()
          title = name

        } else if (name.indexOf('询价') > -1) {
          let inqueryMap = this.dataMap.inqueryMap
          for (let key in inqueryMap) {
            this.orderNoArr.push({value: key})
          }
          this.orderMap = inqueryMap

          this.orderNo = this.orderNoArr[0].value
          this.orderNoChange()
          title = name

        } else {
          this.lines = this.dataMap[id]
          title = `明细 - （${name}：${id}）`
        }

        this.title = title
        this.showLines = true
      },
      getData() {
        this.id = this.$route.query.id

        this.ctx.clearRect(0, 0, 1000, 500)
        this.container.innerHTML = ''
        this.nodePointerMap = {}
        this.elIndex = 0

        let loading = this.$loading('加载中...')

        routekin({id: this.id}).then(res => {
          loading()
          if (res.code == 0) {
            res = res.data || {}
            this.dataMap = {}
            let direct = res.DIRECT_ORDER || ''
            let supply = res.SUPPLY_ORDER || ''
            let store = res.STORE_ORDER || ''
            let inquery = res.INQUERY_BILL || ''


            let hsOrderNo = '', directOrderNo = '', supplierOrderNo = '', supplierOrderSize = '',
              storeOrderNo = '', storeOrderSize = '', inqueryOrderNo = '', inqueryOrderSize = '', quoteOrderNo = ''

            if (direct) {
              hsOrderNo = direct.originNo || ''
              directOrderNo = [...(direct.orderNo || '')].reverse().join('')
              let orderLines = direct.orderLines || []

              this.dataMap[directOrderNo] = orderLines
              this.dataMap[hsOrderNo] = orderLines
            }

            if (supply && supply.length > 0) {
              let supplyMap = {}
              supplierOrderSize = supply.length
              supply.map(item => {
                let orderNo = [...(item.orderNo || '')].reverse().join('')
                if (!supplierOrderNo) {
                  supplierOrderNo = orderNo
                }
                supplyMap[orderNo] = item.orderLines || []
              })
              this.dataMap.supplyMap = supplyMap
            }

            if (store && store.length > 0) {
              let storeMap = {}
              storeOrderSize = store.length
              store.map(item => {
                let orderNo = [...(item.orderNo || '')].reverse().join('')
                if (!storeOrderNo) {
                  storeOrderNo = orderNo
                }
                storeMap[orderNo] = item.orderLines || []
              })
              this.dataMap.storeMap = storeMap
            }

            if (inquery && inquery.length > 0) {
              let inqueryMap = {}
              inqueryOrderSize = inquery.length
              inquery.map(item => {
                let orderNo = [...(item.orderNo || '')].reverse().join('')
                if (!inqueryOrderNo) {
                  inqueryOrderNo = orderNo
                }
                inqueryMap[orderNo] = item.orderLines || []
              })
              this.dataMap.inqueryMap = inqueryMap
            }


            this.hs(hsOrderNo, directOrderNo, supplierOrderNo, supplierOrderSize, storeOrderNo, storeOrderSize, inqueryOrderNo, inqueryOrderSize, quoteOrderNo)
          }
        }).catch(err => {
          loading()
        })
      },
      ready() {
        this.getData()
        // this.hs()
        // this.mall()
      },
      hs(hsOrderNo, directOrderNo, supplierOrderNo, supplierOrderSize, storeOrderNo, storeOrderSize, inqueryOrderNo, inqueryOrderSize, quoteOrderNo) {

        let hs = this.node(20, 250, '华胜订单:' + hsOrderNo)
        let dr = this.node(300, 250, '定向订单:' + directOrderNo)

        let supplier = this.node(580, 120, '直供订单:' + supplierOrderNo, true, supplierOrderSize)
        let store = this.node(580, 250, '门店订单:' + storeOrderNo, true, storeOrderSize)
        let inquiry = this.node(580, 380, '询价订单:' + inqueryOrderNo, false, inqueryOrderSize)
        let quote = this.node(350, 450, '报价回单:' + quoteOrderNo)

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
        if (!text) {
          return false
        }

        let id = text

        if (count && count > 1) {
          text += '-(' + count + ')'
        }

        let textWidth = ctx.measureText(text).width + 25

        let centerPointer = {
          x: x + textWidth / 2,
          y: y + 15
        }

        let span = document.createElement('span')
        span.id = id
        span.innerText = text

        span.className = status == undefined ? 'node' : status ? 'node succ' : 'node fail'

        if (count && count == 10) {
          span.className = 'node warn'
        }

        span.onclick = () => {
          this.click(id, name)
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

        console.log(this.nodePointerMap)

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

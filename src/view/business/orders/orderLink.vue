<template>
  <div>
    <section class="con-box" style="position: relative;height: 800px;min-width: 1000px">
      <b style="position: absolute;top: 20px;left: 20px">订单链路</b>
      <canvas id="canvas" width="1000" height="700">don't support</canvas>
      <div id="container"></div>
      <Icon class="refresh" type="loop" size="26" @click="getData" title="刷新"></Icon>
      <span v-if="errorTip" class="error-tip">{{errorTip}}</span>
    </section>

    <Modal v-model="showLines" :title="title" width="530" ok-text="关闭" cancel-text="">
      <div v-if="orderNo" class="pb15">
        <span>订单号：</span>
        <Select v-model="orderNo" class="w320" @on-change="orderNoChange">
          <Option v-for="item in orderNoArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
      <OrderLine :tbdata="lines"></OrderLine>
    </Modal>

  </div>
</template>
<script>

  import {directBillRoutekin, transferOrderRoutekin} from '_api/business/orderApi'
  import OrderLine from './orderLine'

  export default {
    name: 'orderLink',
    components: {OrderLine},
    data() {
      return {
        errorTip: '',
        nodePointerMap: {},
        elIndex: 0,
        container: null,
        ctx: null,
        id: '',
        type: '',
        dataMap: {},
        showLines: false,
        title: '',
        lines: [],
        orderMap: {},
        orderNoArr: [],
        orderNo: '',
        inqueryToStore: false
      }
    },
    activated() {
      if (this.id && this.id != this.$route.query.id) {
        this.id = this.$route.query.id
        this.type = this.$route.query.type
        this.getData()
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.type = this.$route.query.type

      this.container = document.querySelector('#container')
      this.ctx = document.querySelector('#canvas').getContext('2d')

      this.getData()
    },
    methods: {
      orderNoChange() {
        let obj = this.orderMap[this.orderNo]
        this.lines = obj.lines
      },
      click(id, name) {
        let nameKey = {
          '门店订单': 'storeMap',
          '直供订单': 'supplyMap',
          '询价订单': 'inqueryMap',
          '报价回单': 'quoteMap'
        }
        this.orderNoArr = []
        this.orderNo = ''

        let title = ''

        nameKey = nameKey[name]
        if (nameKey) {
          let orderLinesMap = this.dataMap[nameKey]
          for (let key in orderLinesMap) {
            let item = orderLinesMap[key]
            let name = `${key} （${item.statusText}）`
            if (item.status != 0) {
              name = `${key} （${item.statusText} - ${item.resultText}）`
            }
            if (!item.statusText) {
              name = key
            }
            this.orderNoArr.push({value: key, name})
          }
          this.orderMap = orderLinesMap

          this.orderNo = this.orderNoArr[0].value
          this.orderNoChange()
          title = name
        } else {
          this.lines = this.dataMap[id]
          title = `（${name}：${id}）`
        }

        this.title = '明细 - ' + title
        this.showLines = true
      },
      getData() {
        this.ctx.clearRect(0, 0, 1000, 500)
        this.container.innerHTML = ''
        this.nodePointerMap = {}
        this.elIndex = 0

        let loading = this.$loading('加载中...')

        let routekin = this.type == 'hs' ? directBillRoutekin : transferOrderRoutekin

        routekin({id: this.id}).then(res => {
          loading()
          this.errorTip = ''
          if (res.code == 0 && res.data) {
            res = res.data || {}
            if (this.type == 'hs') {
              this.parseHs(res)
            } else {
              this.parseMall(res)
            }
          } else {
            this.errorTip = '数据异常'
          }
        }).catch(err => {
          loading()
          this.errorTip = '网络异常'
        })
      },
      parseHs(res) {

        let result = {
          hsOrderNo: '',
          createTime: '',

          directOrderNo: '',
          directRouteResult: '',
          captureTime: '',

          supplierOrderNo: '',
          supplierOrderSize: '',
          supplierPushResult: '',
          supplierOrderPushTime: '',
          supplierOrderResult: '',

          storeOrderNo: '',
          storeOrderSize: '',
          storePushResult: '',
          storeOrderPushTime: '',
          storeOrderResult: '',

          inqueryOrderNo: '',
          inqueryOrderSize: '',
          inqueryPushResult: '',
          inqueryOrderPushTime: '',
          inqueryOrderResult: '',

          quoteOrderNo: '',
          quoteOrderSize: '',
          quotePushResult: '',
          quoteOrderPushTime: '',
          quoteOrderResult: ''
        }

        this.dataMap = {}
        let direct = res.DIRECT_ORDER || ''
        let supply = res.SUPPLY_ORDER || ''
        let store = res.STORE_ORDER || ''
        let inquery = res.INQUERY_BILL || ''
        let quote = res.QUOTE_BILL || ''

        let tmpMap = {supply, store, inquery, quote},
          tmpKeyMap = {
            supply: ['supplierOrderNo', 'supplierOrderSize', 'supplyMap', 'supplierPushResult', 'supplierOrderPushTime', 'supplierOrderResult'],
            store: ['storeOrderNo', 'storeOrderSize', 'storeMap', 'storePushResult', 'storeOrderPushTime', 'storeOrderResult'],
            inquery: ['inqueryOrderNo', 'inqueryOrderSize', 'inqueryMap', 'inqueryPushResult', 'inqueryOrderPushTime', 'inqueryOrderResult'],
            quote: ['quoteOrderNo', 'quoteOrderSize', 'quoteMap', 'quotePushResult', 'quoteOrderPushTime', 'quoteOrderResult']
          }


        if (direct) {
          result.hsOrderNo = direct.originNo || ''
          result.directOrderNo = this.reverse(direct.orderNo)
          result.directRouteResult = direct.routeResult
          result.captureTime = direct.captureTime
          result.createTime = direct.createTime
          let orderLines = direct.orderLines || []

          this.dataMap[result.directOrderNo] = orderLines
          this.dataMap[result.hsOrderNo] = orderLines
        }

        for (let key in tmpMap) {
          let data = tmpMap[key], keys = tmpKeyMap[key]
          if (data && data.length > 0) {
            let map1 = {}, succ = 0, fail = 0, error = 0
            result[keys[1]] = data.length

            data.map(item => {
              let orderNo = this.reverse(item.orderNo)
              if (!result[keys[0]]) {
                result[keys[0]] = orderNo
              }

              if (!result[keys[4]]) {
                result[keys[4]] = item.orderPushTime
              }
              if (keys[4] == 'quoteOrderPushTime') {
                result[keys[4]] = item.createTime
              }

              let orderResult = JSON.parse(item.orderPushResult || '{}')
              if (orderResult.value == 1) {
                succ++
              } else if (orderResult.value == 2) {
                fail++
              } else if (orderResult.value == 3) {
                error++
              }

              let status = JSON.parse(item.orderPushStatus || '{}')
              map1[orderNo] = {lines: item.orderLines || [], status: status.value, statusText: status.name, resultText: orderResult.name}
            })

            result[keys[3]] = '4'

            result[keys[5]] = [succ, fail, error]

            this.dataMap[keys[2]] = map1
          }
        }

        let inqueryMap = this.dataMap.inqueryMap || {}
        let storeMap = this.dataMap.storeMap || {}
        if (inqueryMap && storeMap) {
          let inqueryNos = []
          for (let item in inqueryMap) {
            inqueryNos.push(item)
          }
          for (let item in storeMap) {
            if (inqueryNos.indexOf(storeMap[item].originNo) != -1) {
              this.inqueryToStore = true
              break
            }
          }
        }

        this.hs(result)
      },
      parseMall(res) {
        let result = {
          mallOrderNo: '',
          createTime: '',

          transferOrderNo: '',
          transferRouteResult: '',
          captureTime: '',

          storeOrderNo: '',
          storeOrderSize: '',
          storePushResult: '',
          storeOrderPushTime: '',
          storeOrderResult: '',
        }

        this.dataMap = {}
        let transfer = res.TRANSFER_ORDER || ''
        let store = res.STORE_ORDER || ''

        if (transfer) {
          result.mallOrderNo = transfer.originNo || ''
          result.transferOrderNo = this.reverse(transfer.orderNo)
          result.transferRouteResult = transfer.routeResult
          result.createTime = transfer.createTime
          result.captureTime = transfer.captureTime

          let orderLines = transfer.orderLines || []
          this.dataMap[result.mallOrderNo] = orderLines
          this.dataMap[result.transferOrderNo] = orderLines
        }

        if (store && store.length > 0) {
          let storeMap = {}, succ = 0, fail = 0, error = 0
          result.storeOrderSize = store.length
          store.map(item => {
            let orderNo = this.reverse(item.orderNo)
            if (!result.storeOrderNo) {
              result.storeOrderNo = orderNo
            }


            if (!result.storeOrderPushTime) {
              result.storeOrderPushTime = item.orderPushTime
            }

            let orderResult = JSON.parse(item.orderPushResult || '{}')
            if (orderResult.value == 1) {
              succ++
            } else if (orderResult.value == 2) {
              fail++
            } else if (orderResult.value == 3) {
              error++
            }

            let status = JSON.parse(item.orderPushStatus || '{}')
            storeMap[orderNo] = {lines: item.orderLines || [], status: status.value, statusText: status.name, resultText: orderResult.name}
          })
          result.storePushResult = '4'

          result.storeOrderResult = [succ, fail, error]

          this.dataMap.storeMap = storeMap
        }

        this.mall(result)
      },
      reverse(str) {
        return [...(str || '')].reverse().join('')
      },
      hs(data) {

        let hs = this.node(20, 250, '华胜订单:' + data.hsOrderNo, '{"name": "已接收", "value": 1}', 1, data.createTime)
        let dr = this.node(300, 250, '定向订单:' + data.directOrderNo, data.directRouteResult, 1, data.captureTime)

        let supplier = this.node(580, 100, '直供订单:' + data.supplierOrderNo, data.supplierPushResult, data.supplierOrderSize, data.supplierOrderPushTime, data.supplierOrderResult)
        let store = this.node(580, 250, '门店订单:' + data.storeOrderNo, data.storePushResult, data.storeOrderSize, data.storeOrderPushTime, data.storeOrderResult)
        let inquiry = this.node(580, 400, '询价订单:' + data.inqueryOrderNo, data.inqueryPushResult, data.inqueryOrderSize, data.inqueryOrderPushTime, data.inqueryOrderResult)
        let quote = this.node(300, 400, '报价回单:' + data.quoteOrderNo, '{"name": "报价完成", "value": 1}', data.quoteOrderSize, data.quoteOrderPushTime)

        this.line(hs, dr)
        this.line(dr, supplier)
        this.line(dr, store)
        this.line(dr, inquiry)
        this.line(quote, inquiry)

        if (this.inqueryToStore) {
          this.line(inquiry, store)
        }
      },
      mall(data) {
        let mall = this.node(20, 250, '电商订单:' + data.mallOrderNo, '{"name": "已接收", "value": 1}', 1, data.createTime)
        let trnasfer = this.node(300, 250, '电商转单:' + data.transferOrderNo, data.transferRouteResult, 1, data.captureTime)
        let store = this.node(580, 250, '门店订单:' + data.storeOrderNo, data.storePushResult, data.storeOrderSize, data.storeOrderPushTime, data.storeOrderResult)

        this.line(mall, trnasfer)
        this.line(trnasfer, store)
      },
      node(x, y, text, status, count, time, orderResult) {

        let timeKey = {
          '华胜订单': '下单时间',
          '定向订单': '接收时间',
          '直供订单': '推送时间',
          '门店订单': '推送时间',
          '询价订单': '推送时间',
          '报价回单': '报价时间',
          '电商订单': '下单订单',
          '电商转单': '接收时间'
        }

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

        // let textWidth = ctx.measureText(text).width + 20

        let centerPointer = {
          x: x + 110,
          y: y + 40
        }

        let span = document.createElement('span')
        span.id = id

        let orderPushStatus1 = {'1': 'node succ', '2': 'node warn', '3': 'node fail'}
        let orderRouteStatus = {'0': 'node warn', '1': 'node succ'}

        status = JSON.parse(status || '{}')
        let innerHTML = `<span class="title">${text}</span><br/>${timeKey[name]}：${time || ''}<br/>`
        if (name == '定向订单' || name == '电商转单') {
          span.className = orderRouteStatus[status.value] || 'node'
        } else {
          span.className = orderPushStatus1[status.value] || 'node'
        }

        if (orderResult) {
          let resultCls = ['r-succ', 'r-fail', 'r-error'],
            titles = ['成功', '失败', '错误'],
            tmp = '<span class="result">'
          orderResult.map((item, index) => {
            tmp += `<span class="${resultCls[index]}" title="${titles[index]}">${item}</span>`
          })
          innerHTML += tmp + '</span>'
        } else {
          innerHTML += `（${status.name}）`
        }
        span.innerHTML = innerHTML

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

        // if (orderResult) {
        //   let resultContainer = document.createElement('span')
        //   resultContainer.className = 'result'
        //   span.appendChild(resultContainer)
        //
        //   let resultCls = ['r-succ', 'r-fail', 'r-error']
        //   orderResult.map((item, index) => {
        //     let resultSpan = document.createElement('span')
        //     resultSpan.innerText = item
        //     resultSpan.className = resultCls[index]
        //     resultContainer.appendChild(resultSpan)
        //   })
        // }

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
        bgSpan.style.top = (cy - 8) + 'px'
        bgSpan.style.left = (cx - 8) + 'px'
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
  }

  #container {
    position: absolute;
    left: 50%;
    right: 0;
    width: 1000px;
    height: 700px;
    margin-left: -500px;
    z-index: 2;
    font-family: "Microsoft YaHei";
  }
  .succ, .fail, .warn, .node {
    position: absolute;
    display: inline-block;
    box-shadow: 2px 2px 5px 2px #aaa;
    border-radius: 5px;
    height: 80px;
    width: 215px;
    line-height: 20px;
    padding: 10px 0;
    text-align: center;
    background: #fefefe;
    color: #666;
    font-size: 12px;
    &:hover {
      background: #eeeeee;
      cursor: pointer;
    }
    .title {
      font-weight: bold;
      color: #333333;
    }
  }
  .node .name {
    position: absolute;
    display: inline-block;
    top: -20px;
    left: 50%;
    margin-left: -40px;
    background: #ddd;
    color: #666666;
    padding: 0;
    width: 80px;
    border-radius: 15px 15px 0 0;
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
    right: -8px;
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

  .result {
    display: inline-block;
    color: #fff;
    height: 20px;
    line-height: 20px;
    text-align: center;
    span {
      float: right;
      display: inline-block;
      min-width: 20px;
      padding: 0 5px;
      margin-left: 5px;
      margin-top: 2px;
      border-radius: 15px;
      /*box-shadow: 2px 2px 3px 1px #888;*/
    }
    .r-succ {
      background: #4caf50;
    }
    .r-fail {
      background: #ffa144;
    }
    .r-error {
      background: #d73b2f;
    }
  }

  .arrow-p {
    position: absolute;
    display: inline-block;
    width: 16px;
    height: 16px;
  }
  .arrow-p:after {
    content: '';
    position: absolute;
    display: inline-block;
    width: 8px;
    height: 8px;
    top: 8px;
    left: 0;
    border: 1px #aaa solid;
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
  .error-tip {
    position: absolute;
    display: inline-block;
    top: 100px;
    right: 0;
    left: 0;
    color: #999;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    padding-top: 100px;
  }
</style>

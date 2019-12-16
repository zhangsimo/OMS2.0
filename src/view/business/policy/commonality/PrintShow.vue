<template>
  <Modal
    v-model="printShow"
    width="1300"
    closable
    >
    <div id="printBox" style="height: 600px">
      <div class="titler">
        <Row style="border: 1px #000000 solid">
          <Col span="12" class="pl10">
            <h5 style="font-size: 20px;line-height: 44px;border-right: 1px #000000 solid">{{onelist.orgName}}</h5>
          </Col>
          <Col span="12" class="pl10" >
            <p>销售出库单:</p>
            <p>No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid">
            <p><span>地址:</span><span>{{onelist.orgAddr}}</span></p>
            <p><span>电话:</span><span>{{onelist.orgTel}}</span></p>
          </Col>
          <Col span="12" class="pl10" >
            <p><span>订单日期:</span><span>{{onelist.orderDate}}</span></p>
            <p>
              <span>打印日期:</span>
              <span>{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p><span>客户:</span> <span>{{onelist.guestName}}</span></p>
            <p><span>地址:</span> <span>{{onelist.addr}}</span></p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p><span>联系人:</span> <span>{{onelist.contactor}}</span></p>
            <p><span>票据类型:</span><span>{{onelist.billTypeName}}</span></p>

          </Col>
          <Col span="8" class="pl10">
            <p><span>联系电话:</span><span>{{onelist.contactorTel}}</span></p>
            <p><span>结算方式:</span><span>{{onelist.settleTypeName}}</span></p>
          </Col>
        </Row>
         <Table resizable  size="small" style="margin: 0 auto" width="990"  border :columns="columns2" :data="onelist.details" class="ml10"></Table>
        <Row style="border: 1px #000000 solid">
          <Col class="pl10" span="8" style="border-right: 1px #000000 solid">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col class="pl10" span="8" style="border-right: 1px #000000 solid">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col class="pl10" span="8">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" class="pl10" style="border-right: 1px #000000 solid">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" class="pl10">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none" class="pl10">备  注：<span>{{onelist.remark}}</span></p>
        <p class="pl10">
          兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！
        </p>
      </div>

      <div>
      </div>
    </div>
    <div slot='footer'>
      <Button type="success" @click="print">打印</Button>
      <Button type='default' @click='printShow = false'>取消</Button>
    </div>
  </Modal>
</template>

<script>
    import { getprintList } from '@/api/business/market.js'

    export default {
        name: "PrintShow",
        data(){
            return{
                printShow: false, //模态框隐藏
                columns2: [
                    {
                        title: '序号',
                        type:'index',
                        align: 'center'
                    },
                    {
                        title: '配件编码',
                        key: 'partCode',
                        align: 'center'
                    },
                    {
                        title: '配件名称',
                        key: 'partName',
                        align: 'center'
                    },
                    {
                        title: '品牌',
                        key: 'partBrand',
                        align: 'center'

                    },
                    {
                        title: '规格',
                        key: 'spec',
                        align: 'center'

                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center'

                    },
                    {
                        title: '单价',
                        key: 'orderPrice',
                        align: 'center'

                    },                    {
                        title: '金额',
                        key: 'orderAmt',
                        align: 'center'

                    },
                    {
                        title: '仓库',
                        key: 'storeName',
                        align: 'center'

                    },
                    {
                        title: '仓位',
                        key: 'storeShelf',
                        align: 'center'

                    },

                ],
                onelist:{}, //打印数据
                num: '12323.09',
                num2: 78723
            }
        },
        methods:{
            //打印
            print(){
                    // 1.设置要打印的区域 div的className
                    var newstr = document.getElementById('printBox').innerHTML
                    // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
                    var oldstr = document.body.innerHTML
                    // 3. 复制给body，并执行window.print打印功能
                    document.body.innerHTML = newstr
                    window.print()
                    // 重新加载页面，以刷新数据
                    window.location.reload()
                    document.body.innerHTML = oldstr
            },
          async  openModal(){
                let order = this.$store.state.dataList.oneOrder
                if(order.id){
                    let data ={}
                    data['id'] = order.id
                    let res = await getprintList(data)
                    if(res.code == 0){
                        this.printShow = true
                        this.onelist = res.data
                    }
                    console.log(res,996)
                }else {
                    this.$message.error('至少选择一条信息')
                }
            }
        }
    }
</script>

<style scoped lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
      top: 0;
    }
  }
#printBox {
  width: 1000px;
  margin: 0 auto ;
  overflow: hidden;
  overflow-y: scroll;
  .titler {
  padding-left: 10px;
  }
}
  #printBox::-webkit-scrollbar {display:none}
  #printBox { -ms-overflow-style: none; }
  #printBox::-webkit-scrollbar { width: 0 !important }
  #printBox { overflow: -moz-scrollbars-none; }
</style>

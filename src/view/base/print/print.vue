<template>
  <div id="printBoxBig">
    <div v-if="onelist.name==null" style="font-size:30px;color:#000c17;text-align:center;width:100%;">请稍等一会...</div>
    <div id="printBox">
      <div class="titler" v-if="onelist.name.startsWith('销售订单')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.userCompany}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;padding:0 2px;">
          <Col span="16" style="padding:0 2px">
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.addr}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:</span>
              <span style="font-size: 12px">{{onelist.tel}}</span>
            </p>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">订单日期:</span>
              <span style="font-size: 12px">{{onelist.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">客户:</span>
              <span style="font-size: 12px">{{onelist.guestName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.guestAddr}}</span>
            </p>
          </Col>
          <Col span="4" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.contactor}}</span>
            </p>
            <p>
              <span style="font-size: 12px">票据类型:</span>
              <span style="font-size: 12px">{{onelist.billTypeName}}</span>
            </p>
          </Col>
          <Col span="10" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.contactorTel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <td style="width:60px !important;">{{item.orderPrice}}</td>
            <td style="width:65px !important;">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 10px;">
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" style="padding:2px;">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
        <p style="color:#000;padding:2px;">
          兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('销售退货')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5 style="font-size: 18px;line-height: 44px;">{{onelist.orgName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" style="padding:0 2px">
            <p><span style="font-size: 12px;padding:0 2px">地址:{{onelist.orgAddress}}</span></p>
            <p><span style="font-size: 12px;padding:0 2px">电话:{{onelist.orgTel}}</span></p>
          </Col>
          <Col span="8" style="padding:0 2px">
            <p><span style="font-size: 12px">订单日期:</span><span style="font-size: 12px">{{onelist.orderDate}}</span></p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="border-right: 1px #000000 solid;padding:0 2px">
            <p><span style="font-size: 12px">客户:</span> <span style="font-size: 12px">{{onelist.guestName}}</span></p>
            <p><span style="font-size: 12px">地址:</span> <span style="font-size: 12px">{{onelist.guestAddress}}</span>
            </p>
          </Col>
          <Col span="4" style="border-right: 1px #000000 solid;padding:0 2px">
            <p><span style="font-size: 12px">联系人:</span> <span style="font-size: 12px">{{onelist.guestContactor}}</span>
            </p>
            <p><span style="font-size: 12px">票据类型:</span><span style="font-size: 12px">{{onelist.billTypeName}}</span>
            </p>

          </Col>
          <Col span="10">
            <p><span style="font-size: 12px;padding:0 2px">联系电话:</span><span style="font-size: 12px">{{onelist.guestTel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px;padding:0 2px">结算方式:</span>
                  <span style="font-size: 12px;padding:0 2px">{{onelist.settleTypeName}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px;padding:0 2px">仓库:</span>
                  <span style="font-size: 12px;padding:0 2px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <td style="width:60px !important;">{{parseFloat(item.orderPrice).toFixed(2)}}</td>
            <td style="width:65px !important;">{{parseFloat(item.orderAmt).toFixed(2)}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;;font-size: 10px;">
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" style="padding:2px;">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('采购订单')">
        <Row style="border: 1px #000000 solid;border-bottom: none">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.orgName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 12px">
          <Col span="16">
            <p><span style="padding: 2px;">地址: {{ onelist.orgAddress }}</span></p>
            <p><span style="padding: 2px;">电话: {{ onelist.orgTel }}</span></p>
          </Col>
          <Col span="8">
            <p>
              <span style="padding: 2px;">订单日期:</span><span style="font-size: 12px">{{ onelist.orderDate }}</span>
            </p>
            <p>
              <span style="padding: 2px;">打印日期:</span>
              <span style="padding: 2px;">{{ onelist.printDate }}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="border-right: 1px #000000 solid;font-size: 12px">
            <p>
              <span style="padding: 2px;font-size: 12px">供应商:</span> <span style="font-size: 12px">{{ onelist.guestName }}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px">地址:</span> <span style="font-size: 12px">{{ onelist.guestAddress }}</span>
            </p>
          </Col>
          <Col span="4" style="border-right: 1px #000000 solid">
            <p>
              <span style="padding: 2px;font-size: 12px">联系人:</span> <span style="font-size: 12px">{{ onelist.contactor }}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px">票据类型:</span><span style="font-size: 12px">{{ onelist.billTypeName }}</span>
            </p>
          </Col>
          <Col span="10">
            <p>
              <span style="padding: 2px;font-size: 12px">联系电话:</span><span style="font-size: 12px">{{ onelist.guestTel }}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="padding: 2px;font-size: 12px">结算方式:</span>
                  <span style="padding: 2px;font-size: 12px">{{onelist.settleTypeName}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="padding: 2px;font-size: 12px">仓库:</span>
                  <span style="padding: 2px;font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <td style="width:60px !important;">{{item.orderPrice}}</td>
            <td style="width:65px !important;">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.totalAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.totalAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;font-size: 12px">
            <span>制单人:</span>
            <span>{{ onelist.orderMan }}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;font-size: 12px">
            <span>送货人:</span>
            <span>{{ onelist.deliverer }}</span>
          </Col>
          <Col span="8" style="padding:2px;font-size: 12px">
            <span>收货人:</span>
            <span>{{ onelist.receiver }}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('采购退货')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.orgName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;padding:0 2px;">
          <Col span="16" style="padding:0 2px">
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.orgAddress}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:</span>
              <span style="font-size: 12px">{{onelist.orgTel}}</span>
            </p>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">订单日期:</span>
              <span style="font-size: 12px">{{onelist.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="border-right: 1px #000000 solid;padding:0 2px;">
            <p>
              <span style="font-size: 12px">供应商:</span> <span style="font-size: 12px">{{ onelist.guestName }}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span> <span style="font-size: 12px">{{ onelist.guestAddress }}</span>
            </p>
          </Col>
          <Col span="4" style="border-right: 1px #000000 solid;padding:0 2px;">
            <p>
              <span style="font-size: 12px">联系人:</span> <span style="font-size: 12px">{{ onelist.contactor }}</span>
            </p>
            <p>
              <span style="font-size: 12px">退货原因:</span><span style="font-size: 12px">{{ onelist.rtnReasonName }}</span>
            </p>
          </Col>
          <Col span="10" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">联系电话:</span><span style="font-size: 12px">{{ onelist.guestTel }}</span>
            </p>
            <Row style="padding:0 2px;">
              <Col span="12">
                <p>
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty || item.acceptQty || item.trueQty||item.applyQty}}</td>
            <td style="width:60px !important;">{{item.orderPrice}}</td>
            <td style="width:65px !important;">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.totalAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.totalAmt |priceFilters}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size:12px;">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>制单人:</span>
            <span>{{ onelist.orderMan }}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>送货人:</span>
            <span>{{ onelist.deliverer }}</span>
          </Col>
          <Col span="8" style="padding: 2px;">
            <span>收货人:</span>
            <span>{{ onelist.receiver }}</span>
          </Col>
        </Row>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('预售单')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.userCompany}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" style="padding:2px;">
            <p><span style="font-size: 12px">地址:{{onelist.addr}}</span></p>
            <p><span style="font-size: 12px">电话:{{onelist.tel}}</span></p>
          </Col>
          <Col span="8" style="padding:2px;">
            <p><span style="font-size: 12px">订单日期:</span><span style="font-size: 12px">{{onelist.orderDate}}</span></p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="padding:2px;border-right: 1px #000000 solid">
            <p><span style="font-size: 12px;padding:2px;">客户:</span> <span style="font-size: 12px;padding:2px;">{{onelist.guestName}}</span>
            </p>
            <p><span style="font-size: 12px;padding:2px;">地址:</span> <span style="font-size: 12px;padding:2px;">{{onelist.guestAddr}}</span>
            </p>
          </Col>
          <Col span="4" style="padding:2px;border-right: 1px #000000 solid">
            <p><span style="font-size: 12px;padding:2px;">联系人:</span> <span style="font-size: 12px;padding:2px;">{{onelist.contactor}}</span>
            </p>
            <p><span style="font-size: 12px;padding:2px;">票据类型:</span><span style="font-size: 12px;padding:2px;">{{onelist.billType}}</span>
            </p>

          </Col>
          <Col span="10" style="padding:2px;">
            <p><span style="font-size: 12px;padding:2px;">联系电话:</span><span style="font-size: 12px;padding:2px;">{{onelist.contactorTel}}</span>
            </p>
            <p><span style="font-size: 12px;padding:2px;">结算方式:</span><span style="font-size: 12px;padding:2px;">{{onelist.settleType}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="8" style="border-right: 1px #000000 solid;padding:2px;">
            <p><span style="font-size: 12px">仓库:{{onelist.storeName}}</span></p>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding:2px;">
            <p><span style="font-size: 12px">预计发货日期:{{onelist.planSendDate}}</span></p>
          </Col>
          <Col span="8" style="padding:2px;">
            <p><span style="font-size: 12px">预计到货日期:</span><span>{{onelist.planArriveDate}}</span></p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <td style="width:60px !important;">{{item.orderPrice}}</td>
            <td style="width:65px !important;">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>

        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{parseFloat(onelist.orderAmt).toFixed(2)}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="6" style="padding:2px;border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{onelist.createUname}}</span>
          </Col>
          <Col span="6" style="padding:2px;border-right: 1px #000000 solid">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" style="padding:2px;border-right: 1px #000000 solid">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" style="padding:2px;">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
        <p style="color:#000;padding:2px;">
          兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调拨申请')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.orgName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;padding:0 2px;">
          <Col span="16" style="padding:0 2px">
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.orgAdd}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:</span>
              <span style="font-size: 12px">{{onelist.orgTel}}</span>
            </p>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">订单日期:</span>
              <span style="font-size: 12px">{{onelist.createTime}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="12" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">调出方:</span>
              <span style="font-size: 12px;padding: 2px;">{{ onelist.guestName }}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">地址:</span>
              <span style="font-size: 12px;padding: 2px;">{{ onelist.guestAdd }}</span>
            </p>
          </Col>
          <Col span="7" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">联系人:</span>
              <span style="font-size: 12px;padding: 2px;">{{ onelist.receiver }}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">联系电话:</span>
              <span style="font-size: 12px;padding: 2px;">{{ onelist.guestTel }}</span>
            </p>
          </Col>
          <Col span="5">
            <p>
              <span style="font-size: 12px;padding: 2px;">仓库:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.storeName}}</span>
            </p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.applyQty}}</td>
            <!--            <td style="width:60px !important;">{{parseFloat(item.orderPrice).toFixed(2)}}</td>-->
            <!--            <td style="width:65px !important;">{{parseFloat(item.orderAmt).toFixed(2)}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;">
          <Col span="24" style="padding: 2px;font-size: 12px;">
            <span>总数:</span>
            <span>{{ onelist.totalNum }}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 12px;">
          <Col span="6" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>制单人:</span>
            <span>{{ onelist.orderMan }}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>提交人:</span>
            <span>{{ onelist.commitUname }}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>送货人:</span>
            <span>{{ onelist.deliverer }}</span>
          </Col>
          <Col span="6" style="padding: 2px;">
            <span>收货人:</span>
            <span>{{ onelist.receiver }}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调拨出库')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.applyGuest.shortName||onelist.applyGuest.name}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.apply.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" style="padding: 2px;font-size: 12px;">
            <p>
              <span>地址:{{onelist.applyGuest.addr ||
               ( (onelist.applyGuest.province || "") + (onelist.applyGuest.city || "") +
                (onelist.applyGuest.district || "") + (onelist.applyGuest.streetAddress || ""))
                }}</span>
            </p>
            <p>
              <span>电话:{{onelist.applyGuest.tel||""}}</span>
            </p>
          </Col>
          <Col span="8" style="padding: 2px;font-size: 12px;">
            <p>
              <span style="font-size: 12px">订单日期:</span>
              <span style="font-size: 12px">{{onelist.apply.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="12" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">调入方:</span>
              <span style="font-size: 12px">{{onelist.logisticsRecord!=null?onelist.logisticsRecord.guestName : ""}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.guest.address}}</span>
            </p>
          </Col>
          <Col span="7" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.logisticsRecordVO?onelist.logisticsRecordVO.receiver:onelist.logisticsRecord!=null?onelist.logisticsRecord.receiver:''}}</span>
            </p>
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.logisticsRecordVO?onelist.logisticsRecordVO.receiverMobile:onelist.logisticsRecord!=null?onelist.logisticsRecord.receiverMobile:''}}</span>
            </p>
          </Col>
          <Col span="5">
            <p>
              <span style="font-size: 12px">出库仓库:</span>
              <span style="font-size: 12px">{{onelist.storeVO.name}}</span>
            </p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.acceptQty}}</td>
            <!--            <td style="width:60px !important;">{{parseFloat(item.orderPrice).toFixed(2)}}</td>-->
            <!--            <td style="width:65px !important;">{{parseFloat(item.orderAmt).toFixed(2)}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 12px;padding: 2px;">
          <Col span="24">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 12px;">
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.apply.createUname}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>提交人:</span>
            <span>{{onelist.apply.auditor}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>送货人:</span>
            <span>{{onelist.apply.deliverer}}</span>
          </Col>
          <Col span="6" style="padding:2px;">
            <span>收货人:</span>
            <span>{{onelist.logisticsRecord!=null?onelist.logisticsRecord.receiver:""}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.apply.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调拨入库')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.guestVO.fullName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.enterOrder.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16">
            <p>
              <span
                style="font-size: 12px;padding: 2px;">地址:{{onelist.guestVO.addr || onelist.guestVO.streetAddress}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">电话:{{onelist.guestVO.tel}}</span>
            </p>
          </Col>
          <Col span="8">
            <p>
              <span style="font-size: 12px;padding: 2px;">订单日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.enterOrder.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">打印日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">调出方:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">地址:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.addr || onelist.applyGuest.streetAddress}}</span>
            </p>
          </Col>
          <Col span="4" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">联系人:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.contactor}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">入库仓库:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.store.name}}</span>
            </p>
          </Col>
          <Col span="10">
            <p>
              <span style="font-size: 12px;padding: 2px;">联系电话:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.tel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px;padding: 2px;">备注:</span>
                  <span style="font-size: 12px;padding: 2px;">{{ onelist.remark }}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px;padding: 2px;">出库仓库:</span>
                  <span style="font-size: 12px;padding: 2px;">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.applyQty}}</td>
            <!--            <td style="width:60px !important;">{{item.orderPrice}}</td>-->
            <!--            <td style="width:65px !important;">{{item.orderAmt}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 12px;padding: 2px;">
          <Col span="24">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;color:#000;font-size: 12px;">
          <Col span="8" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.enterOrder.orderMan}}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding:2px;">
            <span>送货人:</span>
            <span>{{onelist.enterOrder.deliverer}}</span>
          </Col>
          <Col span="8" style="padding:2px;">
            <span>收货人:</span>
            <span>{{onelist.guestVO.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.guestVO.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('移仓单')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist['applyGuest'].fullName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist['stockShift'].serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" style="padding: 2px;">
            <p><span style="font-size: 12px">地址:</span> <span style="font-size: 12px">{{onelist['applyGuest'].streetAddress}}</span>
            </p>
            <p><span style="font-size: 12px">电话:</span><span style="font-size: 12px">{{onelist['applyGuest'].contactorTel}}</span>
            </p>
          </Col>
          <Col span="8">
            <p><span style="font-size: 12px;padding: 2px;">订单日期:</span><span style="font-size: 12px;padding: 2px;">{{onelist['stockShift'].createTime}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">打印日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="24" style="border-right: 1px #000000 solid;display:flex;padding: 2px;">
            <p style="width:33%"><span style="font-size: 12px">移出仓库:</span> <span style="font-size: 12px">{{onelist['store'].name}}</span>
            </p>
            <p style="width:33%"><span style="font-size: 12px">移入仓库:</span> <span style="font-size: 12px">{{onelist['receiveStore'].name}}</span>
            </p>
            <p style="width:33%"><span style="font-size: 12px">移仓日期:</span> <span style="font-size: 12px">{{onelist['stockShift'].auditDate}}</span>
            </p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <!--            <td style="width:60px !important;">{{item.orderPrice}}</td>-->
            <!--            <td style="width:65px !important;">{{item.orderAmt}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;padding: 2px;">
          <Col span="24">
            <span style="font-size: 12px">总数:</span>
            <span style="font-size: 12px">{{onelist.orderQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span style="font-size: 12px">制单人:</span>
            <span style="font-size: 12px">{{onelist['stockShift'].orderMan}}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span style="font-size: 12px">提交人:</span>
            <span style="font-size: 12px">{{onelist['stockShift'].createUname}}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span style="font-size: 12px">审核人:</span>
            <span style="font-size: 12px">{{onelist['stockShift'].createUname}}</span>
          </Col>
        </Row>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调入退回申请')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.apply.orgName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.apply.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16">
            <p>
              <span style="font-size: 12px;padding: 2px;">地址:{{onelist.applyGuest.address}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">电话:{{onelist.applyGuest.tel}}</span>
            </p>
          </Col>
          <Col span="8">
            <p>
              <span style="font-size: 12px;padding: 2px;">订单日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.apply.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">打印日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <p>
              <span style="font-size: 12px;padding: 2px;">调出方:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.guest.name}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">地址:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.guest.address || onelist.guest.province+onelist.guest.city+onelist.guest.district+onelist.guest.streetAddress}}</span>
            </p>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">收货单位:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">收货人:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.receiveName}}</span>
            </p>
          </Col>
          <Col span="8">
            <p>
              <span style="font-size: 12px;padding: 2px;">联系电话:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.guest.tel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px;padding: 2px;">出库仓库:</span>
                  <span style="font-size: 12px;padding: 2px;">{{onelist.storeVO.name}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px;padding: 2px;">入库仓库:</span>
                  <span style="font-size: 12px;padding: 2px;">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.acceptQty}}</td>
            <!--            <td style="width:60px !important;">{{item.orderPrice}}</td>-->
            <!--            <td style="width:65px !important;">{{item.orderAmt}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 12px;padding: 2px;">
          <Col span="24">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 12px;">
          <Col span="8" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding:2px;">
            <span>送货人:</span>
            <span></span>
          </Col>
          <Col span="8" style="padding:2px;">
            <span>收货人:</span>
            <span></span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.apply.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('调出退回入库')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.guestVO.fullName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.enterOrder.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16">
            <p>
              <span
                style="font-size: 12px;padding: 2px;">地址:{{onelist.guestVO.addr || onelist.guestVO.streetAddress}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">电话:{{onelist.guestVO.tel}}</span>
            </p>
          </Col>
          <Col span="8">
            <p>
              <span style="font-size: 12px;padding: 2px;">订单日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.enterOrder.orderDate}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">打印日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="8" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">申请方:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">申请单号:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.enterOrder.code}}</span>
            </p>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px;padding: 2px;">入库仓库:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.store.name}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">处理人:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.enterOrder.auditor}}</span>
            </p>
          </Col>
          <Col span="8">
            <p>
              <span style="font-size: 12px;padding: 2px;">入库仓库:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.storeName}}</span>
            </p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.applyQty}}</td>
            <!--            <td style="width:60px !important;">{{item.orderPrice}}</td>-->
            <!--            <td style="width:65px !important;">{{item.orderAmt}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;padding: 2px;font-size: 12px;">
          <Col span="24">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 12px;padding: 2px;">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;">
            <span>送货人:</span>
            <span></span>
          </Col>
          <Col span="8" style="padding: 2px;">
            <span>收货人:</span>
            <span></span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.enterOrder.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="routeN.startsWith('procurementAndStorage')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.orgName || ' '}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;padding:0 2px;">
          <Col span="16" style="padding:0 2px">
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.orgAddr || ' '}}</span>
            </p>
            <p>
              <span style="font-size: 12px">电话:</span>
              <span style="font-size: 12px">{{onelist.orgTel || ' '}}</span>
            </p>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">创建日期:</span>
              <span style="font-size: 12px">{{onelist.createTime || ' '}}</span>
            </p>
            <p>
              <span style="font-size: 12px">打印日期:</span>
              <span style="font-size: 12px">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="10" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">供应商:</span>
              <span style="font-size: 12px">{{onelist.guestName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.streetAddress}}</span>
            </p>
          </Col>
          <Col span="4" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.contactor}}</span>
            </p>
            <p>
              <span style="font-size: 12px">票据类型:</span>
              <span style="font-size: 12px">{{onelist.billTypeName}}</span>
            </p>
          </Col>
          <Col span="10" style="padding:0 2px;">
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.contactorTel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">结算方式:</span>
                  <span style="font-size: 12px">{{onelist.settleTypeName}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.details" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty}}</td>
            <td style="width:60px !important;">{{parseFloat(item.orderPrice).toFixed(2)}}</td>
            <td style="width:65px !important;">{{parseFloat(item.orderAmt).toFixed(2)}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;font-size: 12px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>

          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;font-size: 12px;">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="8" style="padding: 2px;font-size: 12px;">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="onelist.name.startsWith('盘点单')">
        <Row style="border: 1px #000000 solid;color:#000;border-bottom: none;padding: 0px 2px;">
          <Col span="16" style="padding:0 2px;">
            <h5
              style="font-size: 18px;line-height: 44px;"
            >{{onelist.orgName}}</h5>
          </Col>
          <Col span="8" style="padding:0 2px;">
            <p style="font-weight: 600;font-size: 16px">{{onelist.name}}:</p>
            <p style="font-size: 12px">No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16">
            <p><span style="font-size: 12px;padding: 2px;">地址:</span> <span style="font-size: 12px;padding: 2px;">{{onelist.orgAddr}}</span>
            </p>
            <p><span style="font-size: 12px;padding: 2px;">电话:</span><span style="font-size: 12px;padding: 2px;">{{onelist.orgTel}}</span>
            </p>
          </Col>
          <Col span="8">
            <p><span style="font-size: 12px;padding: 2px;">订单日期:</span><span style="font-size: 12px;padding: 2px;">{{onelist.createTime}}</span>
            </p>
            <p>
              <span style="font-size: 12px;padding: 2px;">打印日期:</span>
              <span style="font-size: 12px;padding: 2px;">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;">
          <Col span="16" style="border-right: 1px #000000 solid">
            <p><span style="font-size: 12px;padding: 2px;">盘点仓库:</span> <span style="font-size: 12px;padding: 2px;">{{onelist.storeName}}</span>
            </p>
          </Col>
          <Col span="8" style="border-right: 1px #000000 solid">
            <p><span style="font-size: 12px;padding: 2px;">盘点日期:</span> <span style="font-size: 12px;padding: 2px;">{{onelist.checkDate}}</span>
            </p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <!--            <th style="width:60px !important;">单价</th>-->
            <!--            <th style="width:65px !important;">金额</th>-->
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.trueQty}}</td>
            <!--            <td style="width:60px !important;">{{item.orderPrice}}</td>-->
            <!--            <td style="width:65px !important;">{{item.orderAmt}}</td>-->
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row
          style="border: 1px #000000 solid;border-top:none;border-bottom:none;color:#000;padding: 2px;font-size: 12px;">
          <Col span="24">
            <span>总数:</span>
            <span>{{onelist.orderQty}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;color:#000;">
          <Col span="12" style="border-right: 1px #000000 solid">
            <span style="font-size: 12px;padding: 2px;">制单人:</span>
            <span style="font-size: 12px;padding: 2px;">{{onelist.createUname}}</span>
          </Col>
          <Col span="12" style="border-right: 1px #000000 solid">
            <span style="font-size: 12px;padding: 2px;">盘点人:</span>
            <span style="font-size: 12px;padding: 2px;">{{onelist.orderMan}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>
      <div class="titler" v-if="(onelist.name.startsWith('销售出库') || onelist.name.startsWith('采购入库')) && !routeN.startsWith('procurementAndStorage')">
        <Row style="border: 1px #000000 solid">
          <Col span="24" style="padding: 2px;font-size: 12px;">
            <p>{{onelist.name}}:</p>
            <p>No: {{onelist.serviceId}}</p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="16" style="border-right: 1px #000000 solid;">
            <p>
              <span style="padding: 2px;font-size: 12px;">地址:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.orgAddress || ' '}}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px;">电话:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.orgTel || ' '}}</span>
            </p>
          </Col>
          <Col span="8">
            <p>
              <span style="padding: 2px;font-size: 12px;">创建日期:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.creationDate || ' '}}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px;">打印日期:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.printDate}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="16" style="border-right: 1px #000000 solid">
            <p>
              <span style="padding: 2px;font-size: 12px;">供应商:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.guestName}}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px;">地址:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.guestAddress}}</span>
            </p>
          </Col>
          <Col span="3" style="border-right: 1px #000000 solid">
            <p>
              <span style="padding: 2px;font-size: 12px;">联系人:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.contactPerson}}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px;">票据类型:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.ticketTypeName}}</span>
            </p>
          </Col>
          <Col span="5">
            <p>
              <span style="padding: 2px;font-size: 12px;">联系电话:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.personTel}}</span>
            </p>
            <p>
              <span style="padding: 2px;font-size: 12px;">结算方式:</span>
              <span style="padding: 2px;font-size: 12px;">{{onelist.settlementMethodName}}</span>
            </p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:110px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:90px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;">单价</th>
            <th style="width:65px !important;">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:110px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:90px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModel}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.specification}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unitId}}</td>
            <td style="width:40px !important;">{{item.qty}}</td>
            <td style="width:60px !important;">{{item.price}}</td>
            <td style="width:65px !important;">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>
        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.totalAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.totalNumber}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.totalAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none">
          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;font-size: 12px;">
            <span>制单人:</span>
            <span>{{onelist.createName}}</span>
          </Col>

          <Col span="8" style="border-right: 1px #000000 solid;padding: 2px;font-size: 12px;">
            <span>送货人:</span>
            <span>{{onelist.deliveryMan}}</span>
          </Col>
          <Col span="8" style="padding: 2px;font-size: 12px;">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {getprintList} from "@/api/salesManagment/salesOrder";//销售订单
  import {getPrint} from "_api/salesManagment/sellReturn.js";  //销售退货
  import {print} from "_api/procurement/plan"; //采购订单
  import * as supplierList from '@/api/business/supplierListApi'; //采购退货 print
  import * as prePrint from "_api/salesManagment/presell.js"; //预售单

  import {pointAdd} from "@/api/AlotManagement/transferringOrder"; //调拨申请
  import * as stockRemocal from "@/api/AlotManagement/stockRemoval.js";//调拨出库  getprintList
  import * as putStorage from "@/api/AlotManagement/putStorage.js";//调拨入库 getprintList
  import * as procurementAndStorage from '@/api/business/procurementAndStorage' //采购入库  getPrintShow
  import * as moveStorehouse from '@/api/business/moveStorehouse'//移仓单 getPrint
  import * as twoBackApply from "@/api/AlotManagement/twoBackApply.js";//调入退回申请 getprintList
  import * as smsInventory from '@/api/inventory/salesList' //盘点单  getprintList
  import {Printing} from "@/api/bill/saleOrder"; //应收应付
  import * as tools from "../../../utils/tools";

  export default {
    name: "PrintShow",
    data() {
      return {
        onelist: {}, //打印数据
        num: "12323.09",
        num2: 78723,
        routeN:""
      };
    },
    beforeCreate() {
      this.onelist.name=null;
    },
    mounted() {
      this.openModal(this.$route.query).then(() => {
        this.print()
      })
    },
    methods: {
      //打印
      print() {
        let oldHtml=document.getElementById("printBox").innerHTML
        document.body.style.overflow = 'visible'
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //是否ie
          this.remove_ie_header_and_footer();
        }
        document.body.innerHTML=oldHtml
        window.print();
        window.close();
        this.routeN=""
      },
      //去除页眉页脚
      remove_ie_header_and_footer() {
        var hkey_path;
        hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        try {
          var RegWsh = new ActiveXObject("WScript.Shell");
          RegWsh.RegWrite(hkey_path + "header", "");
          RegWsh.RegWrite(hkey_path + "footer", "");
        } catch (e) {
        }
      },
      async openModal(order) {
        // console.log(order)
        if (order.id) {
          let data = {};
          data.id = order.id;
          var res;
          switch (order.route) {
            case "salesOrder": //销售订单
              res = await getprintList(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
              }
              break;
            case "sellReturn": //销售退货
              res = await getPrint(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
              }
              break;
            case "InterPurchase": //国际采购
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
              }
              break;
            case "TemporaryPurchase": //临时采购
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
              }
              break;
            case "OutsidePurchase": //外采订单
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
              }
              break;
            case "PlannedPurchaseOrder": //计划采购
              res = await print(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                  })
                }
              }
              break;
            case "supplierList": //采购退货
              res = await supplierList.print(data)
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.detailList = this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if (this.onelist.detailList == [] || this.onelist.detailList == undefined) {
                  this.onelist.storeName = ""
                } else {
                  this.onelist.detailList.map((item, index) => {
                    if (index == 0) {
                      this.onelist.storeName = item.storeName
                    }
                    this.onelist.orderQty += item.orderQty
                  })
                }
              }
              break;
            case "presell": //预售单
              res = await prePrint.getPrint(data.id);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""

                this.onelist.detailList = this.onelist.detailVOList
                this.onelist.printDate = tools.transTime(new Date());
              }
              break;
            case "applyFor": //调拨申请
              res = await pointAdd(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.detailVOS
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.acceptQty), 0);
              }
              break;
            case "stockRemoval": //调拨出库
              res = await stockRemocal.getprintList(data)
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.apply.detailVOS
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.acceptQty), 0);
              }
              break;
            case "putStorage": //调拨入库
              res = await putStorage.getprintList(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.enterOrder.voList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
              }
              break;
            case "moveStorehouse": //移仓单
              res = await moveStorehouse.getPrint(data);
              if (res.code === 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist['stockShift'].detailVOList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.orderQty), 0);
              }
              break;
            case "twoBackApply": //调入退回申请
              res = await twoBackApply.getprintList(data)
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.apply.detailVOS
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.acceptQty), 0);
              }
              break;
            case "twoBackInStorage": //调出退回入库
              res = await putStorage.getprintList(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.enterOrder.voList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
              }
              break;
            case "procurementAndStorage"://采购入库
              this.routeN="procurementAndStorage"
              res = await procurementAndStorage.getPrintShow(data);
              if (res.code == 0) {
                this.onelist = res.data || {};
                this.onelist.name = order.name || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.orderQty = this.onelist.details.reduce((total, curr) => total += parseInt(curr.applyQty), 0);
              }
              break;
            case "smsInventory": //盘点单
              res = await smsInventory.getprintList(data);
              if (res.code == 0) {
                let repData = res.data || {}
                this.onelist = repData
                this.onelist.name = order.name || "" || ""
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.detailList = this.onelist.detailVOList
                this.onelist.orderQty = this.onelist.detailList.reduce((total, curr) => total += parseInt(curr.trueQty), 0);
              }
              break;
            case "payMentmanage": //应收应付
              data.orderCode = order.orderCode
              data.orderType = order.orderType
              data.orgId = order.orgId
              data.guestId = order.guestId
              res = await Printing(data);
              if (res.code == 0) {
                this.onelist = res.data;
                res.data.orderDetailList.map((item, index) => {
                  item.num = index + 1;
                });
                this.onelist.name = order.name || ""
                this.onelist.detailList = res.data.orderDetailList
              }
          }
          // this.print()
        } else {
          this.$message.error("至少选择一条信息");
          window.close()
        }
      }
    }
  };
</script>

<style scoped lang="less">
  /*@media print*/
  /*{*/
  /*  #printBox {page-break-after:always !important;}*/
  /*}*/
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }

  #printBox {
    width: 730px;
    margin: 0 auto;
    overflow: hidden;
    overflow-y: scroll;

    .titler {
      width: 100%;
      padding-left: 2px;
    }
  }

  #printBox::-webkit-scrollbar {
    display: none;
  }

  #printBox {
    -ms-overflow-style: none;
  }

  #printBox::-webkit-scrollbar {
    width: 0 !important;
  }

  #printBox {
    overflow: -moz-scrollbars-none;
  }

  #printBox.ivu-modal-wrap.ivu-modal-content.ivu-modal-close {
    display: none !important;
    width: 0 !important;
    z-index: -1 !important;
  }

  //表格样式
  table.gridtable {
    width: 100%;
    font-family: verdana, arial, sans-serif;
    font-size: 10px !important;
    table-layout: fixed; /*列宽由表格宽度和列宽度设定。*/
    color: #000000;
    border-width: 1px;
    border-color: #000000;
    text-align: left;
    border-collapse: collapse;
    /*page-break-before: always;*/
    /*bor*/
  }

  table.gridtable th {
    border-width: 1px;
    padding: 4px 2px;
    border-style: solid;
    border-color: #000000;
    background-color: #dedede;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 4px 2px;
    border-style: solid;
    border-color: #000000;
    background-color: #ffffff;
  }

  table.gridtable tr {
    page-break-inside: avoid;
  }

  table.gridtable tr th {
    font-weight: 400 !important;
  }
</style>

<template>
  <div id="printBoxBig">
    <div id="printBox">
      <div class="titler">
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
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;" v-if="onelist.name=='采购退货单'">
          <Col span="10" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px">供应商:</span> <span style="font-size: 12px">{{ onelist.guestName }}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span> <span style="font-size: 12px">{{ onelist.guestAddress }}</span>
            </p>
          </Col>
          <Col span="4" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px">联系人:</span> <span style="font-size: 12px">{{ onelist.contactor }}</span>
            </p>
            <p>
              <span style="font-size: 12px">退货原因:</span><span style="font-size: 12px">{{ onelist.rtnReasonName }}</span>
            </p>
          </Col>
          <Col span="10" class="pl10">
            <p>
              <span style="font-size: 12px">联系电话:</span><span style="font-size: 12px">{{ onelist.guestTel }}</span>
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
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;" v-if="onelist.name=='调出退回入库'">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>申请方:</span>
              <span>{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span>申请单号:</span>
              <span>{{onelist.enterOrder.code}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span>入库仓库:</span>
              <span>{{onelist.store.name}}</span>
            </p>
            <p>
              <span>处理人:</span>
              <span>{{onelist.enterOrder.auditor}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
            <p>
              <span>入库仓库:</span>
              <span>{{onelist.storeName}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;" v-if="onelist.name=='调入退回申请'">
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px">调出方:</span>
              <span style="font-size: 12px">{{onelist.guest.name}}</span>
            </p>
            <p>
              <span>地址:</span>
              <span style="font-size: 12px">{{onelist.guest.address || onelist.guest.province+onelist.guest.city+onelist.guest.district+onelist.guest.streetAddress}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p>
              <span style="font-size: 12px">收货单位:</span>
              <span style="font-size: 12px">{{onelist.applyGuest.fullName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">收货人:</span>
              <span style="font-size: 12px">{{onelist.applyGuest.receiveName}}</span>
            </p>
          </Col>
          <Col span="8" class="pl10">
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.guest.tel}}</span>
            </p>
            <Row>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">出库仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeVO.name}}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span style="font-size: 12px">入库仓库:</span>
                  <span style="font-size: 12px">{{onelist.storeName}}</span>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;" v-if="kOrG==''">
          <Col span="24" class="pl10" style="border-right: 1px #000000 solid;display:flex;">
            <p style="width:33%"><span style="font-size: 12px">移出仓库:</span> <span style="font-size: 12px">{{onelist['store'].name}}</span></p>
            <p style="width:33%"><span style="font-size: 12px">移入仓库:</span> <span style="font-size: 12px">{{onelist['receiveStore'].name}}</span></p>
            <p style="width:33%"><span style="font-size: 12px">移仓日期:</span> <span style="font-size: 12px">{{onelist['stockShift'].auditDate}}</span></p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;" v-if="onelist.name=='调拨申请'||onelist.name=='调拨出库'">
          <Col span="12" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">{{kOrG}}:</span>
              <span style="font-size: 12px">{{onelist.guestName}}</span>
            </p>
            <p>
              <span style="font-size: 12px">地址:</span>
              <span style="font-size: 12px">{{onelist.guestAddr}}</span>
            </p>
          </Col>
          <Col span="7" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">联系人:</span>
              <span style="font-size: 12px">{{onelist.logisticsRecordVO?onelist.logisticsRecordVO.receiver:onelist.logisticsRecord?onelist.logisticsRecord.receiver:''}}</span>
            </p>
            <p>
              <span style="font-size: 12px">联系电话:</span>
              <span style="font-size: 12px">{{onelist.logisticsRecordVO?onelist.logisticsRecordVO.receiverMobile:onelist.logisticsRecord?onelist.logisticsRecord.receiverMobile:''}}</span>
            </p>
          </Col>
          <Col span="5">
            <p>
              <span style="font-size: 12px">仓库:</span>
              <span style="font-size: 12px">{{onelist.storeName}}</span>
            </p>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;" v-if="kOrG!='' && onelist.name!='调入退回申请' && onelist.name!='调出退回入库' && onelist.name!='采购退货单' && onelist.name!='盘点单'&& onelist.name!='调拨申请'&&onelist.name!='调拨出库'">
          <Col span="10" style="padding:0 2px;border-right: 1px #000000 solid;">
            <p>
              <span style="font-size: 12px">{{kOrG}}:</span>
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
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;"  v-if="onelist.name=='盘点单'">
          <Col span="16" class="pl10" style="border-right: 1px #000000 solid">
            <p><span style="font-size: 12px">盘点仓库:</span> <span style="font-size: 12px">{{onelist.storeName}}</span></p>
          </Col>
          <Col span="8" class="pl10" style="border-right: 1px #000000 solid">
            <p><span style="font-size: 12px">盘点日期:</span> <span style="font-size: 12px">{{onelist.checkDate}}</span></p>
          </Col>
        </Row>
        <table class="gridtable">
          <thead>
          <tr>
            <th style="width:30px !important;">序号</th>
            <th style="width:105px;overflow: hidden;white-space:nowrap;">配件编码</th>
            <th style="width:85px;overflow: hidden;white-space:nowrap;">配件名称</th>
            <th style="width:65px;overflow: hidden;white-space:nowrap;">OEM码</th>
            <th style="width:50px;overflow: hidden;white-space:nowrap;">品牌</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">车型</th>
            <th style="width:40px;overflow: hidden;white-space:nowrap;">规格</th>
            <th style="width:30px;overflow: hidden;white-space:nowrap;">单位</th>
            <th style="width:40px !important;">数量</th>
            <th style="width:60px !important;" v-if="priceShow">单价</th>
            <th style="width:65px !important;" v-if="priceShow">金额</th>
            <th style="width:80px !important;">仓位</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item ,index) in onelist.detailList" :key="index">
            <td style="width:30px !important;">{{index + 1}}</td>
            <td style="width:105px;overflow: hidden;white-space:nowrap;">{{item.partCode}}</td>
            <td style="width:85px;overflow: hidden;white-space:nowrap;">{{item.partName}}</td>
            <td style="width:65px;overflow:hidden;white-space:nowrap;">{{item.oemCode}}</td>
            <td style="width:50px;overflow: hidden;white-space:nowrap;">{{item.partBrand}}</td>
            <td style="width:40px;overflow:hidden;white-space:nowrap;">{{item.carModelName}}</td>
            <td style="width:40px;overflow: hidden;white-space:nowrap;">{{item.spec}}</td>
            <td style="width:30px;overflow: hidden;white-space:nowrap;">{{item.unit}}</td>
            <td style="width:40px !important;">{{item.orderQty || item.acceptQty || item.trueQty||item.applyQty}}</td>
            <td style="width:60px !important;" v-if="priceShow">{{item.orderPrice}}</td>
            <td style="width:65px !important;" v-if="priceShow">{{item.orderAmt}}</td>
            <td style="width:80px !important;">{{item.storeShelf}}</td>
          </tr>
          </tbody>
        </table>

        <Row style="border: 1px #000000 solid;color:#000;font-size: 10px;display: flex;" v-if="onelist.name!='盘点单'">
          <Col style="border-right: 1px #000000 solid;padding:2px;width: 640px">
            <span>合计:</span>
            <span>{{ onelist.orderAmt | toChies}}</span>
          </Col>
          <Col style="border-right: 1px #000000 solid;padding:2px;width:160px">
            <span>总数:</span>
            <span>{{onelist.orderQty||onelist.totalNum}}</span>
          </Col>
          <Col style="padding:2px;width: 200px;">
            <span>合计:</span>
            <span>{{onelist.orderAmt}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;border-top: none;color:#000;font-size: 10px;" v-if="onelist.name!='盘点单'">
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>制单人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;">
            <span>提交人:</span>
            <span>{{onelist.auditor}}</span>
          </Col>
          <Col span="6" style="border-right: 1px #000000 solid;padding:2px;" v-if="kOrG!=''">
            <span>送货人:</span>
            <span>{{onelist.deliverer}}</span>
          </Col>
          <Col span="6" style="padding:2px;" v-if="kOrG!=''">
            <span>收货人:</span>
            <span>{{onelist.receiver}}</span>
          </Col>
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid" v-else>
            <span style="font-size: 12px">审核人:</span>
            <span style="font-size: 12px">{{onelist['stockShift'].createUname}}</span>
          </Col>
        </Row>
        <Row style="border: 1px #000000 solid;color:#000;" v-if="onelist.name=='盘点单'">
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid">
            <span>制单人:</span>
            <span>{{onelist.createUname}}</span>
          </Col>
          <Col span="12" class="pl10" style="border-right: 1px #000000 solid">
            <span>盘点人:</span>
            <span>{{onelist.orderMan}}</span>
          </Col>
        </Row>
        <p style="border: 1px #000000 solid;border-top: none;color:#000;padding:2px;font-size: 14px;font-weight: 600;">
          备 注：
          <span>{{onelist.remark}}</span>
        </p>
        <p style="color:#000;padding:2px;">
          兹收到上列货物完整无缺，所有电器配件货物出门概不退货，灯，胶，玻璃等易碎货品必须当面检验清楚，事后概不负责！此单据一经客户或其代理人签名，将作为客户欠款凭证，特此声明！</p>
      </div>

      <div></div>
    </div>
    <div id="footer" style="display: none">
      <Button type="success" @click="print">打印</Button>
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
  import * as moveStorehouse from '@/api/business/moveStorehouse'//移仓单 getPrint
  import * as twoBackApply from "@/api/AlotManagement/twoBackApply.js";//调入退回申请 getprintList
  import * as smsInventory from '@/api/inventory/salesList' //盘点单  getprintList

  import * as tools from "../../../utils/tools";

  export default {
    name: "PrintShow",
    data() {
      return {
        onelist: {}, //打印数据
        num: "12323.09",
        num2: 78723,
        kOrG:"客户",
      };
    },
    created() {
      this.openModal(this.$route.query)
      // this.onelist=this.$route.query
      // console.log(this.$route.query.id,111111)
    },
    computed:{
      priceShow(){
        if(this.onelist.name.endsWith('订单') || this.onelist.name.endsWith('退货单') || this.onelist.name.endsWith('退货') || this.onelist.name.endsWith('预售单')){
          return true
        }else{
          return false
        }
      }
    },
    updated() {
      this.$nextTick( () => {
        this.print()
      })
    },
    methods: {
      //打印
      print() {
        document.body.style.overflow = 'visible'
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //是否ie
          this.remove_ie_header_and_footer();
        }
        window.print();
        window.close();
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
        console.log(order)
        if (order.id) {
          let data = {};
          data.id = order.id;
          var res;
          switch (order.route) {
            case "salesOrder": //销售订单
              res = await getprintList(data);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
              }
              break;
            case "sellReturn": //销售退货
              res = await getPrint(data.id);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name

                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddress
                this.onelist.tel=this.onelist.orgTel
                this.onelist.guestAddr=this.onelist.guestAddress
                this.onelist.contactor=this.onelist.guestContactor
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.details
              }
              break;
            case "InterPurchase": //国际采购
              res = await print(data.id);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG="供应商"

                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddress
                this.onelist.tel=this.onelist.orgTel
                this.onelist.guestAddr=this.onelist.guestAddress
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if(this.onelist.detailList==[] || this.onelist.detailList==undefined){
                  this.onelist.storeName=""
                }else{
                  this.onelist.detailList.map((item,index)=>{
                    if(index==0){
                      this.onelist.storeName=item.storeName
                    }
                  })
                }
              }
              break;
            case "TemporaryPurchase": //临时采购
              res = await print(data.id);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG="供应商"

                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddress
                this.onelist.tel=this.onelist.orgTel
                this.onelist.guestAddr=this.onelist.guestAddress
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if(this.onelist.detailList==[] || this.onelist.detailList==undefined){
                  this.onelist.storeName=""
                }else{
                  this.onelist.detailList.map((item,index)=>{
                    if(index==0){
                      this.onelist.storeName=item.storeName
                    }
                  })
                }
              }
              break;
            case "OutsidePurchase": //外采订单
              res = await print(data.id);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG="供应商"

                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddress
                this.onelist.tel=this.onelist.orgTel
                this.onelist.guestAddr=this.onelist.guestAddress
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if(this.onelist.detailList==[] || this.onelist.detailList==undefined){
                  this.onelist.storeName=""
                }else{
                  this.onelist.detailList.map((item,index)=>{
                    if(index==0){
                      this.onelist.storeName=item.storeName
                    }
                  })
                }
              }
              break;
            case "PlannedPurchaseOrder": //计划采购
              res = await print(data.id);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG="供应商"

                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddress
                this.onelist.tel=this.onelist.orgTel
                this.onelist.guestAddr=this.onelist.guestAddress
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if(this.onelist.detailList==[] || this.onelist.detailList==undefined){
                  this.onelist.storeName=""
                }else{
                  this.onelist.detailList.map((item,index)=>{
                    if(index==0){
                      this.onelist.storeName=item.storeName
                    }
                  })
                }
              }
              break;
            case "supplierList": //采购退货
              res = await supplierList.print(data)
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG="供应商"

                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddress
                this.onelist.tel=this.onelist.orgTel
                this.onelist.guestAddr=this.onelist.guestAddress
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.details
                this.onelist.printDate = tools.transTime(new Date());
                if(this.onelist.detailList==[] || this.onelist.detailList==undefined){
                  this.onelist.storeName=""
                }else{
                  this.onelist.detailList.map((item,index)=>{
                    if(index==0){
                      this.onelist.storeName=item.storeName
                    }
                  })
                }
              }
              break;
            case "presell": //预售单
              res = await prePrint.getPrint(data.id);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG="客户"

                this.onelist.billTypeName=this.onelist.billType
                this.onelist.detailList=this.onelist.detailVOList
                this.onelist.printDate = tools.transTime(new Date());
              }
              break;
            case "applyFor": //调拨申请
              res = await pointAdd(data);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAdd
                this.onelist.tel=this.onelist.orgTel
                this.onelist.printDate = tools.transTime(new Date());
                this.kOrG="调出方"

                this.onelist.guestAddr=this.onelist.guestAdd
                this.onelist.contactor=this.onelist.receiver
                this.onelist.contactorTel=this.onelist.guestTel
                this.onelist.detailList=this.onelist.detailVOS
              }
              break;
            case "stockRemoval": //调拨出库
              res=await stockRemocal.getprintList(data)
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.onelist.userCompany=this.onelist.applyGuest.shortName|| this.onelist.applyGuest.name
                this.onelist.serviceId=this.onelist.apply.serviceId

                this.onelist.tel=this.onelist.applyGuest.tel

                this.onelist.guestName=this.onelist.logisticsRecord.guestName
                this.onelist.addr=this.onelist.applyGuest.addr ||
                  ( (this.onelist.applyGuest.province || "") + (this.onelist.applyGuest.city || "") +
                    (this.onelist.applyGuest.district || "") + (this.onelist.applyGuest.streetAddress || ""))
                this.onelist.printDate = tools.transTime(new Date());
                this.kOrG="调入方"
                this.onelist.guestAddr=this.onelist.guest.address
                this.onelist.orderDate=this.onelist.apply.orderDate
                this.onelist.contactor=this.onelist.logisticsRecord.contactor
                this.onelist.contactorTel=this.onelist.logisticsRecord.receiverMobile||""
                this.onelist.storeName=this.onelist.storeVO.name
                this.onelist.detailList=this.onelist.apply.detailVOS
                this.onelist.orderMan=this.onelist.apply.orderMan
                this.onelist.auditor=this.onelist.apply.auditor
                this.onelist.deliverer=this.onelist.apply.deliverer
                this.onelist.receiver=this.onelist.logisticsRecord.receiver
                this.onelist.remark=this.onelist.logisticsRecord.remark
              }
              break;
            case "putStorage": //调拨入库
              res = await putStorage.getprintList(data);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.onelist.userCompany=this.onelist.guestVO.fullName
                this.onelist.serviceId=this.onelist.enterOrder.serviceId
                this.onelist.addr=this.onelist.guestVO.addr || this.onelist.guestVO.streetAddress
                this.onelist.tel=this.onelist.guestVO.tel
                this.onelist.printDate = tools.transTime(new Date());
                this.kOrG="调出方"
                this.onelist.storeName=this.onelist.store.name
                this.onelist.guestName=this.onelist.guestVO.shortName
                this.onelist.guestAddr=this.onelist.applyGuest.addr || this.onelist.applyGuest.streetAddress
                this.onelist.orderDate=this.onelist.enterOrder.orderDate
                this.onelist.contactor=this.onelist.applyGuest.contactor
                this.onelist.contactorTel=this.onelist.applyGuest.tel
                this.onelist.detailList=this.onelist.enterOrder.voList

                this.onelist.orderMan=this.onelist.enterOrder.orderMan
                this.onelist.auditor=this.onelist.enterOrder.auditor
                this.onelist.deliverer=this.onelist.enterOrder.deliverer
                this.onelist.receiver=this.onelist.guestVO.receiver
                this.onelist.remark=this.onelist.guestVO.remark
              }
              break;
            case "moveStorehouse": //移仓单
              res=await moveStorehouse.getPrint(data);
              if(res.code===0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.kOrG=""
                this.onelist.userCompany=this.onelist['applyGuest'].fullName
                this.onelist.serviceId=this.onelist['stockShift'].serviceId
                this.onelist.addr=this.onelist['applyGuest'].streetAddress
                this.onelist.tel=this.onelist['applyGuest'].contactorTel
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.orderDate=this.onelist['stockShift'].createTime
                this.onelist.detailList=this.onelist['stockShift'].detailVOList
                this.onelist.orderMan=this.onelist['stockShift'].orderMan;
                this.onelist.auditor=this.onelist['stockShift'].createUname
              }
              break;
            case "twoBackApply": //调入退回申请
              res= await twoBackApply.getprintList(data)
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.onelist.userCompany=this.onelist.apply.orgName
                this.onelist.serviceId=this.onelist.apply.serviceId
                this.onelist.addr=this.onelist.applyGuest.address
                this.onelist.tel=this.onelist.applyGuest.tel
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.orderDate=this.onelist.apply.orderDate
                this.onelist.detailList=this.onelist.apply.detailVOS
              }
              break;
            case "twoBackInStorage": //调拨退回入库
              res = await putStorage.getprintList(data);
              if(res.code==0){
                this.onelist = res.data;
                this.onelist.name = order.name
                this.onelist.userCompany=this.onelist.guestVO.fullName
                this.onelist.serviceId=this.onelist.enterOrder.serviceId
                this.onelist.addr=this.onelist.guestVO.addr || this.onelist.guestVO.streetAddress
                this.onelist.tel=this.onelist.guestVO.tel
                this.onelist.printDate = tools.transTime(new Date());
                this.kOrG="调出方"
                this.onelist.guestAddr=this.onelist.applyGuest.addr || this.onelist.applyGuest.streetAddress
                this.onelist.orderDate=this.onelist.enterOrder.orderDate
                this.onelist.contactor=this.onelist.applyGuest.contactor
                this.onelist.contactorTel=this.onelist.applyGuest.tel
                this.onelist.detailList=this.onelist.enterOrder.voList
              }
              break;
            case "smsInventory": //盘点单
              res = await smsInventory.getprintList(data);
              if(res.code==0){
                let repData = res.data || {}
                this.onelist = repData
                this.onelist.name = order.name
                this.onelist.userCompany=this.onelist.orgName
                this.onelist.addr=this.onelist.orgAddr
                this.onelist.tel=this.onelist.orgTel
                this.onelist.printDate = tools.transTime(new Date());
                this.onelist.orderDate=this.onelist.createTime
                this.onelist.detailList=this.onelist.detailVOList
              }
              break;
          }
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
    width: 700px;
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
    padding:4px 2px;
    border-style: solid;
    border-color: #000000;
    background-color: #dedede;
  }

  table.gridtable td {
    border-width: 1px;
    padding:4px 2px;
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

<template>
  <Modal v-model="getShowMore" title="高级查询" width="600px" @on-ok="moreOk" @on-cancel="moreCancel">
    <Form @keydown.native.enter="moreOk">
    <div class="navbox">
      <Row class="mb15">
        <Col>
          <span class="more-span">创建日期：</span>
          <DatePicker
            v-model="moreData.createTime"
            type="daterange"
            placeholder="请选择创建日期"
            @on-change="establish"
            style="width: 350px"
          ></DatePicker>
        </Col>
      </Row>
      <Row>
        <Col>
          <span class="more-span">提交日期：</span>
          <DatePicker
            v-model="moreData.enterTime"
            type="daterange"
            placeholder="请选择提交日期"
            @on-change="submit"
            style="width: 350px"
          ></DatePicker>
        </Col>
      </Row>
      <row class="mt15">
        <span class="more-span">入库单号：</span>
        <Input placeholder="请输入入库单号" v-model="moreData.serviceId" style="width: 350px" />
      </row>
      <row class="mt15">
        <span class="more-span">关联单号：</span>
        <Input placeholder="请输入关联单号" v-model="moreData.code"  style="width: 350px" />
      </row>
      <row class="mt15">
        <span class="more-span">配件编码：</span>
        <Input v-model="moreData.partCode" placeholder="请输入配件编码" style="width: 350px" />
      </row>
      <row class="mt15">
        <span class="more-span">配件名称：</span>
        <Input v-model="moreData.partName" placeholder="请输入配件名称" style="width: 350px" />
      </row>
      <row class="mt15">
        <span class="more-span">品牌：</span>
        <Select v-model="moreData.partBrand" style="width: 350px" label-in-value filterable>
          <Option v-for="(item, index) in brandLists" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </row>
      <row class="mt15">
        <span class="more-span">来源：</span>
        <Select v-model="moreData.source" style="width: 350px" label-in-value filterable>
          <Option v-for="(item, index) in sourceArr" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </row>
      <row class="mt15">
        <span class="more-span">仓库：</span>
        <Select
          v-model="moreData.storeId"
          style="width:350px"
        >
          <Option
            v-for="item in warehouseList"
            :value="item.id"
            :key="item.id"
          >{{ item.name }}</Option>
        </Select>
      </row>
      <row class="mt15">
        <span class="more-span">提交人：</span>
        <Select v-model="moreData.subMan" class="w350" label-in-value filterable>
          <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
        </Select>
      </row>
      <row class="mt15">
        <span class="more-span">创建人：</span>
        <Select v-model="moreData.createUname" class="w350" label-in-value filterable>
          <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
        </Select>
      </row>
    </div>
    </Form>
  </Modal>
</template>

<script>
import { getLeftList } from "../../../../../api/inventory/salesList";
getParamsBrand
import {getParamsBrand} from "../../../../../api/purchasing/purchasePlan";
import {getSales} from "../../../../../api/salesManagment/salesOrder";
import {getstate} from "../../../../../api/inventory/salesList";
import moment from "moment";
export default {
  name: "More",
  data() {
    return {
      moreData: {
        createTime:'',//创建时间
        enterTime:'',//提交日期
        startTime: "", //创建日期开始
        endTime: "", //创建日期结束
        auditStartTime: "", //提交时间开始
        auditEndTime: "", //提交时间结束
        serviceId: "", //入库单号
        code:"",//关联单号
        partCode: "", //配件编码
        partName: "", //配件名称
        partBrand:"",//配件品牌
        auditor:"",//提交人
        subMan:"",
        createUname:"",//创建人
        storeId:"",
        source:99
      },
      brandLists:[],//品牌
      salesList:[],//提交人

      warehouseList: {},//仓库
      sourceArr:[
        {
          value:0,
          label:"OMS盘点",
        },
        {
          value:1,
          label:"WMS盘点",
        },
        {
          value:3,
          label:"盘盈开单",
        },
        {
          value:99,
          label:"全部",
        }
      ]
    };
  },
  props: {
    getShowMore: Boolean,
    billStatusId: '',
  },
  mounted(){
  },
  methods: {
    getWouse(){
      if(this.warehouseList.length > 0) return;
      getstate()
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            this.warehouseList = res.data;
          }
        })
        .catch(err => {
          this.$Message.info("获取仓库信息失败"); //获取仓库数据
        });
    },
    //提交人
    async getAllSales() {
      if(this.salesList.length > 0) return;
      let res = await getSales();
      if (res.code === 0) {
        this.salesList = res.data.content;
        this.salesList.forEach((item) => {
          item.label = item.userName;
          item.value = item.id;
        });
      }
    },
    //品牌
    async getBrand() {
      if(this.brandLists.length > 0) return;
      let res = await getParamsBrand();
      if (res.code == 0) {
        this.brandLists = res.data;
      }
    },

    //选择创建日期
    establish(date) {
      // console.log(date);
      this.moreData.createTime= date
      this.moreData.startTime = moment(date[0]).format("YYYY-MM-DD HH:mm:ss");
      this.moreData.endTime = date[1]+" 23:59:59";
    },
    //选择提交日期
    submit(date) {
      this.moreData.enterTime = date
      this.moreData.auditStartTime = moment(date[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.moreData.auditEndTime = date[1]+" 23:59:59"
    },
    // getITPWE() {
    //   this.moreData.createTime = moment(this.moreData.createTime).format('YYYY-MM-DD HH:mm:ss')
    //   this.moreData.submit = moment(this.moreData.submit).format('YYYY-MM-DD HH:mm:ss')
    // },
    //更多弹窗-确定
    moreOk() {
      let obj = {
        startTime: this.moreData.startTime,
        endTime: this.moreData.endTime,
        auditStartTime: this.moreData.auditStartTime,
        auditEndTime: this.moreData.auditEndTime,
        serviceId: this.moreData.serviceId,
        code:this.moreData.code,
        partCode: this.moreData.partCode,
        partName: this.moreData.partName,
        partBrand:this.moreData.partBrand,
        auditor:this.moreData.auditor,
        subMan:this.moreData.subMan,
        createUname:this.moreData.createUname,
        storeId:this.moreData.storeId,
        source:this.moreData.source==99?'':this.moreData.source,
        inventoryOrderType:1,
      }
      if (this.billStatusId != '') {
        obj.billStatusId = this.billStatusId
      }
      getLeftList(obj, 0, 20)
        .then(res => {
          if (res.code === 0) {
            //res传出去
            this.$emit("getMoreData", res); //更多查询调拨申请列表传出
            this.$emit("getMoreStatus", false); //弹框false传出
          } else {
            this.$Message.info("更多查询列表错误");
            this.$emit("getMoreStatus", false);
          }
        })
        .catch(err => {
          this.$Message.info("更多查询列表失败");
          this.$emit("getMoreStatus", false);
        });
      // this.reset();
    },
    //更多弹窗-取消
    moreCancel() {
      this.$emit("getMoreStatus", false);
    },
    reset() {
      this.getBrand();
      this.getAllSales();
      this.getWouse();
      // this.moreData = {
      //   createTime:'',//创建时间
      //   enterTime:'',//提交日期
      //   startTime: "", //创建日期开始
      //   endTime: "", //创建日期结束
      //   auditStartTime: "", //提交时间开始
      //   auditEndTime: "", //提交时间结束
      //   serviceId: "", //移库仓号
      //   partCode: "", //配件编码
      //   partName: "", //配件名称
      //   partBrand:"",//配件品牌
      //   auditor:"",//提交人
      //   subMan:"",
      //   createUname:"",//创建人
      //   storeId:"",
      //   source:3
      // };
    }
  }
};
</script>
<style scoped>
.navbox {
  padding: 20px;
}
  .more-span{
    width: 120px;
    display: inline-block;
    text-align: right;
  }
</style>


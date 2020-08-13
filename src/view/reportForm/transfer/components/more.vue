<template>
  <Modal title="更多查询" v-model="serchN" :styles="{ top: '50px', width: '500px' }">
    <div class="data ml30 pl25">
      <Row class="mb30" v-if="type == 1">
        <span>创建日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="createDate"
        ></DatePicker>
      </Row>
      <Row class="mb30">
        <span v-if="type == 1">入库日期:</span>
        <span v-if="type == 2 || type == 3">出库日期:</span>
        <span v-if="type == 4">入库日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="auditDate"
        ></DatePicker>
      </Row>
    </div>
    <Form :label-width="100" class="ml10 pl25">
      <FormItem :label="[1, 3].includes(type) ? '调出方:' : (type == 2 ? '申请方:' : '调入方：')">
        <Select
          class="w300 ml5"
          v-model="guestId"
          filterable clearable
          remote
          label-in-value
          :remote-method="remoteMethod"
          :loading="guseData.loading"
          @on-change="geseChange"
        >
          <Option
            v-for="option in guseData.lists"
            :value="option.id"
            :key="option.id"
          >{{ option.fullName }}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="type != 4" label="申请单号:">
        <Input type="text" class="w300 ml5" v-model="serviceId" />
      </FormItem>
      <FormItem :label="type == 1 ? '受理单号: ' : (type == 2 ? '受理单号:' : (type == 3 ? '调入退出单号:' : '退回申请单号:'))">
        <Input type="text" class="w300 ml5" v-model="code" />
      </FormItem>
      <FormItem v-if="[2, 4].includes(type)" :label="type == 1 ? '调拨出库单号: ' : (type == 2 ? '调拨出库单号:' : (type == 3 ? '采退出库单号:' : '调出退入单号'))">
        <Input type="text" class="w300 ml5" v-model="outCode" />
      </FormItem>
      <FormItem v-if="[1].includes(type)" :label="type == 1 ? '调拨入库单号: ' : (type == 2 ? '采购入库单号:' : (type == 3 ? '采退出库单号:' : '采购计划单号'))">
        <Input type="text" class="w300 ml5" v-model="inCode" />
      </FormItem>
      <FormItem v-if="false" label="直发门店: ">
        <Select v-model="storeId" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item, index) in stores" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="配件编码/名称: ">
        <Input type="text" class="w300 ml5" v-model="partCode" />
      </FormItem>
      <!-- <FormItem label="配件名称: ">
        <Input type="text" class="w300 ml5" v-model="partName" />
      </FormItem> -->
      <FormItem label="品牌: ">
        <Select
          class="w300 ml5"
          multiple
          v-model="partBrandList"
          placeholder="请选择品牌"
          @on-change="select1"
        >
          <Option
            v-for="item in brandLists"
            :value="item.label"
            :key="item.id"
          >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="采购订单类型: " v-if="[5].includes(type)">
        <Select v-model="orderType" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item, index) in orderTypeList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="仓库: ">
        <Select v-model="warehouseId" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item) in warehouse" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="type == 3 ? '出库人: ': (type == 4 ? '入库人:' : (type == 2 ? '出库人:' : '入库人:'))">
        <Select v-model="orderman" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="item in salesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="提交人: " v-if="[5].includes(type)">
        <Select v-model="auditor" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="item in salesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="创建人: " v-if="[5].includes(type)">
        <Select v-model="createUname" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="item in salesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="mr15" type="primary" @click="ok">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import moment from "moment";
// @ts-ignore
import * as tools from "_utils/tools";
import { Vue, Component, Emit, Prop } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";
// @ts-ignore
import { getSales } from "@/api/salesManagment/salesOrder";
// @ts-ignore
import { getParamsBrand } from "_api/purchasing/purchasePlan";
import {getParamsBrandPart} from "@/api/reportForm";
// @ts-ignore
import { getWarehouse } from "_api/reportForm/index.js";
import { creat } from "@/view/settlementManagement/components";
import {v4} from "uuid";
import Cookies from "js-cookie";
import {TOKEN_KEY} from "@/libs/util";
// @ts-ignore
import Api from "_conf/url";

@Component({
  components: {
  }
})
export default class MoreSearch extends Vue {
  @Prop({ default: "" }) private readonly type!: string;

  private serchN: boolean = false;

  private createDate: Array<any> = new Array();
  private auditDate: Array<any> = new Array();
  private serviceId: string = "";
  private partCode: string = "";
  private partBrandList: Array<any> = new Array();
  private auditor: string = "";
  // private partName: string = "";
  private createUname: string = "";
  private guestId: string = "";
  private guestName: string = "";
  private aaaa: string = "";
  // new
  private code: string = "";
  private orderman: string = "";
  private orderType: string = "";
  private warehouseId: string = "";
  private storeId: string = "";
  private outCode: string = "";
  private inCode: string = "";

  private stores: Array<any> = new Array();
  private orderTypeList: Array<any> = new Array();
  private warehouse: Array<any> = new Array();
  private async getWares(orgId) {
    let getitem:any=localStorage.getItem('oms2-userList')
    let res:any = JSON.parse(getitem)

    let tenantId = res.tenantId || 0
    let shopkeeper = res.shopkeeper || 0
    let uuid = v4()
    let params:any={tenantId:tenantId,shopId:orgId,shopkeeper:shopkeeper,uuid:uuid,scope:"oms"}
    await this.ajaxAll.get(`${Api.wmsApi}/comStore/stores/findByShopId`,{
      params:params,
      headers:{
        Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
      }
    }).then((res2:any)=>{
      if(res2.data.code === 0) {
        this.warehouse = res2.data.data;
      }
    })
  }

  private async getStoreId(){
    let arr:any = await creat("", this.$store);
    this.$nextTick(() => {
      this.storeId = arr[1];
    });
  }

  private salesList: Array<any> = new Array();
  private async getAllSales() {
    let res: any = await getSales();
    if (res.code === 0) {
      this.salesList = res.data.content;
      this.salesList.forEach((item: any) => {
        item.label = item.userName;
        item.value = item.id;
      });
    }
  }

  mounted() {
    // alert(this.getBrand)
    // console.log(this.getBrand);
  }
  private reset() {
    this.createDate = new Array();
    this.auditDate = new Array();
    this.serviceId = "";
    this.partCode = "";
    this.partBrandList = new Array();
    this.auditor = "";
    this.guestId = "";
    this.guestName = "";
    this.createUname = "";
    // this.partName = "";
    // new
    this.code = "";
    this.orderman = "";
    this.orderType = "";
    this.warehouseId = "";
    this.storeId = "";
    this.outCode = "";
    this.inCode = "";
  }

  private brandLists: Array<any> = new Array();
  private async getBrand() {
    let res: any = await getParamsBrandPart();
    if (res.code == 0) {
      for (let quality of res.data.content) {
        if (quality.children.length <= 0) {
          break;
        }
        quality.children.forEach(el => {
          el.label = el.name;
          el.value = el.code;
          el.id = el.id;
          this.brandLists.push(el);
        });
      }
    }
  }
  private select1(option:any) {
    if (option.slice(-1)[0] == 1) {
      option = [1];
    } else if (option.includes(1)) {
      option = option.filter(el => el != 1);
    }
    this.partBrandList = option;
  }
  private guseData = {
    loading: false,
    lists: new Array()
  };

  private async remoteMethod(query: string) {
    if (query == "" || query.trim().length <= 0) {
      this.guseData.lists = [];
      return;
    }
    this.guseData.loading = true;
    const res: any = await api.getMoteSupplier(query);
    this.guseData.loading = false;
    if (res.code == 0) {
      this.guseData.lists = res.data;
    }
  }

  private geseChange(val: any) {
    this.guestId = val.value;
    this.guestName = val.label;
  }

  private init() {
    let parent:any=this.$parent
    let search:any=parent.search
    let orgId:any=search.orgid
    this.warehouse=new Array<any>()
    this.reset();
    if (this.salesList.length <= 0) {
      this.getAllSales();
    }
    if (this.brandLists.length <= 0) {
      this.getBrand();
    }
    if(this.warehouse.length <= 0) {
      this.getWares(orgId);
      this.getStoreId()
    }
    this.serchN = true;
  }

  private showModel(name) {
    let ref: any = this.$refs[name];
    ref.init();
  }

  private cancel() {
    this.serchN = false;
  }

  @Emit("getmoreData")
  private ok() {
    let parent:any=this.$parent
    let search:any=parent.search
    let data = {
      orgid:search.orgid,
      ctimeStart: this.createDate[0] ? moment(this.createDate[0]).format("YYYY-MM-DD") + " 00:00:00" : "",
      ctimeEnd: this.createDate[1] ? moment(this.createDate[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
      timeStart: this.auditDate[0] ? moment(this.auditDate[0]).format("YYYY-MM-DD") + " 00:00:00" : "",
      timeEnd: this.auditDate[1] ? moment(this.auditDate[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
      serviceId: this.serviceId,
      partCode: this.partCode.trim(),
      partBrandList: this.partBrandList,
      auditor: this.auditor,
      createUname: this.createUname,
      // partName: this.partName.trim(),
      guestId: this.guestId,
      // new
      code: this.code,
      orderman: this.orderman,
      orderType: this.orderType,
      warehouseId: this.warehouseId,
      storeId: this.storeId,
      outCode: this.outCode,
      inCode: this.inCode,
    };
    // console.log(data)
    let subdata: Map<string, string> = new Map();
    for (let key in data) {
      if (["showSelf"].includes(key)) {
        subdata.set(key, data[key]);
      } else if (typeof(data[key])=="string") {
        if(data[key] && data[key].trim().length > 0){
          subdata.set(key, data[key]);
        }
      }else{
        subdata.set(key, data[key]);
      }
    }
    let obj: any = {};
    if (subdata.size > 0) {
      for (let [k, v] of subdata) {
        obj[k] = v;
      }
    } else {
      obj = null;
    }
    this.cancel();
    return obj;
  }
}
</script>

<template>
  <Modal title="更多查询" v-model="serchN" :styles="{ top: '50px', width: '500px' }">
    <div class="data ml30 pl25">
      <Row class="mb30">
        <span v-if="type == 1">入库日期:</span>
        <span v-if="type == 2">出库日期:</span>
        <DatePicker
          class="ml10"
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="createDate"
        ></DatePicker>
      </Row>
      <Row class="mb30" v-if="[1, 4].includes(type)">
        <span>提交日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="auditDate"
        ></DatePicker>
      </Row>
    </div>
    <Form :label-width="100" class="ml10 pl25">
      <FormItem :label="type == 1 ? '入库单号: ' : (type == 2 ? '出库单号:' : (type == 3 ? '采退出库单号:' : '采购计划单号'))">
        <Input type="text" class="w300 ml5" v-model="serviceId" />
      </FormItem>
      <FormItem v-if="type != 4" :label="type == 1 ? '盘点单号: ' : (type == 2 ? '盘点单号:' : (type == 3 ? '采退订单单号:' : ''))">
        <Input type="text" class="w300 ml5" v-model="code" />
      </FormItem>
      <FormItem label="配件编码/名称: ">
        <Input type="text" class="w300 ml5" v-model="partCode" />
      </FormItem>
      <!-- <FormItem label="配件名称: ">
        <Input type="text" class="w300 ml5" v-model="partName" />
      </FormItem> -->
<!--      <FormItem label="品牌: ">-->
<!--        <Select-->
<!--          class="w300 ml5"-->
<!--          multiple-->
<!--          v-model="partBrandList"-->
<!--          placeholder="请选择品牌"-->
<!--          @on-change="select1"-->
<!--        >-->
<!--          <Option-->
<!--            v-for="item in brandLists"-->
<!--            :value="item.label"-->
<!--            :key="item.id"-->
<!--          >{{ item.label }}</Option-->
<!--          >-->
<!--        </Select>-->
<!--      </FormItem>-->
      <FormItem label="品牌:">
        <Select
          class="w300 ml5"
          clearable
          label-in-value
          filterable
          v-model="partBrand"
          placeholder="请选择品牌"
        >
<!--          remote-->
<!--          :remote-method="partBrandRemote"-->
<!--          :loading="brandBrandBool"-->
<!--          @on-change="select1"-->
          <Option
            v-for="(item,index) in brandLists"
            :value="item.label"
            :key="index"
          >{{ item.label }}
          </Option
          >
        </Select>
      </FormItem>
      <FormItem label="仓库: " v-if="type != 4">
        <Select v-model="warehouseId" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item) in warehouse" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="来源: " v-if="type != 4">
        <Select v-model="warehouseId2" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item, index) in warehouse2" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="type == 1 ? '盘点员:' : '提交人:'">
        <Select v-model="orderman" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="item in salesList" :value="item.label" :key="item.value">{{ item.label }}</Option>
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
import { Vue, Component, Emit, Prop,Watch } from "vue-property-decorator";
// @ts-ignore
import * as api from "_api/procurement/plan";
import { getSales } from "@/api/salesManagment/salesOrder";
// @ts-ignore
import {getBrandList,getWares} from "@/view/reportForm/until";

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
  private partBrand: string = "";
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
  private warehouseId2: string = "";
  private storeFullName: string = "";

  private stores: Array<any> = new Array();
  private orderTypeList: Array<any> = new Array();
  private warehouse: Array<any> = new Array();
  private warehouse2: Array<any> = [
    {value: "0", label: "OMS盘点"},
    {value: "1", label: "WMS盘点"},
  ];
  private async getWares(orgId) {
    this.warehouse=await getWares(orgId)
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
    this.brandLists = new Array();
    this.warehouse = new Array()
    this.serviceId = "";
    this.partCode = "";
    this.partBrand = "";
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
    this.warehouseId2 = "";
    this.storeFullName = "";
  }
  private brandLists: Array<any> = new Array();
  private brandBrandBool:boolean=true;

  private select1(option: any) {
    this.partBrand = option.value;
    // console.log(this.partBrand.length, option.value, 1111)
    // if (option.slice(-1)[0] == 1) {
    //   option = [1];
    // } else if (option.includes(1)) {
    //   option = option.filter(el => el != 1);
    // }
  }

  private async getBrand(data: string) {
    this.brandBrandBool=true
    var queryName:string=data
    if(data==""){
      queryName=""
    }else{
      queryName=data.trim()
    }
    this.brandLists = await getBrandList(queryName)
    this.brandBrandBool=false
  }

  private async partBrandRemote(query: string) {
    this.brandLists = await getBrandList(query)
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
    this.reset();
    if (this.salesList.length <= 0) {
      this.getAllSales();
    }
    this.getBrand("");
    if(this.warehouse.length <= 0) {
      this.getWares(orgId);
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
  @Watch("partBrand")
  async handleWatch(val:any){
    if(val.partBrand==undefined){
      this.brandLists=await getBrandList("")
    }
  }
  @Emit("getmoreData")
  private ok() {
    let parent:any=this.$parent
    let search:any=parent.search
    let data = {
      orgid:search.orgid,
      startTime: this.createDate[0] ? moment(this.createDate[0]).format("YYYY-MM-DD") + " 00:00:00" : "",
      endTime: this.createDate[1] ? moment(this.createDate[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
      atimeStart: this.auditDate[0] ? moment(this.auditDate[0]).format("YYYY-MM-DD") + " 00:00:00" : "",
      atimeEnd: this.auditDate[1] ? moment(this.auditDate[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
      serviceId: this.serviceId,
      partCode: this.partCode.trim(),
      partBrand: this.partBrand,
      auditor: this.auditor,
      createUname: this.createUname,
      // partName: this.partName.trim(),
      guestId: this.guestId,
      // new
      code: this.code,
      orderman: this.orderman,
      orderType: this.orderType,
      warehouseId: this.warehouseId,
      warehouseId2: this.warehouseId2,
      storeFullName: this.storeFullName,
    };
    if(data.endTime) {
      data.endTime = data.endTime.split(" ")[0] + " 23:59:59"
    }
    // console.log(data)
    let subdata: Map<string, string> = new Map();
    for (let key in data) {
      if (["showSelf"].includes(key)) {
        subdata.set(key, data[key]);
      }  else if (typeof(data[key])=="string") {
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

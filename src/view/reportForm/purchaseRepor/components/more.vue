<template>
  <Modal title="更多查询" v-model="serchN" :styles="{ top: '50px', width: '500px' }">
    <div class="data ml30 pl25">
      <Row class="mb30">
        <span v-if="type == 1 || type == 4">创建日期:</span>
        <span v-if="type == 2">入库日期:</span>
        <span v-if="type == 3">出库日期:</span>
        <DatePicker
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
      <FormItem label="供 应 商: ">
        <Select
          class="w300 ml5"
          v-model="guestId"
          filterable
          remote
          label-in-value
          :remote-method="remoteMethod"
          :loading="guseData.loading"
          @on-change="geseChange"
          clearable
        >
          <Option
            v-for="option in guseData.lists"
            :value="option.id"
            :key="option.id"
          >{{ option.fullName }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="type == 1 ? '采购单单号: ' : (type == 2 ? '采购入库单号:' : (type == 3 ? '采退出库单号:' : '采购计划单号'))">
        <Input type="text" class="w300 ml5" v-model="serviceId" />
      </FormItem>
      <FormItem v-if="type != 4 && type != 1" :label="type == 1 ? '往来单号: ' : (type == 2 ? '采购订单单号:' : (type == 3 ? '采退订单单号:' : ''))">
        <Input type="text" class="w300 ml5" v-model="code" />
      </FormItem>
      <FormItem v-if="type == 4" label="直发门店: ">
        <Select v-model="storeId" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item) in stores" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="配件编码/名称: ">
        <Input type="text" class="w300 ml5" v-model="partCode" />
      </FormItem>
      <!-- <FormItem label="配件名称: ">
        <Input type="text" class="w300 ml5" v-model="partName" />
      </FormItem> -->
      <FormItem label="品牌: ">
        <Select v-model="partBrand" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item, index) in brandLists" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="采购订单类型: " v-if="[1].includes(type)">
        <Select v-model="orderType" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item, index) in orderTypeList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="仓库: " v-if="type != 4">
        <Select v-model="warehouseId" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="(item) in warehouse" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="type == 3 ? '退货员: ': (type == 4 ? '计划员' : '采购员: ')">
        <Select v-model="orderman" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="item in salesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="提交人: " v-if="[1, 4].includes(type)">
        <Select v-model="auditor" class="w300 ml5" label-in-value filterable clearable>
          <Option v-for="item in salesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="创建人: " v-if="[1, 4].includes(type)">
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
import { getSales } from "@/api/salesManagment/salesOrder";
// @ts-ignore
import { getParamsBrand } from "_api/purchasing/purchasePlan";
// @ts-ignore
import { getWarehouse, getStorelist } from "_api/reportForm/index.js";

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
  private storeId: string = "";

  private stores: Array<any> = new Array();
  private async getStore() {
    let res: any = await getStorelist();
    if(res.code == 0) {
       let data = res.data;
        Object.keys(data).forEach(key => {
          this.stores.push({value: key, name: data[key]})
        })
    }
  }

  private orderTypeList: Array<any> = [
    {id: "0", name: "所有"},
    {id: "1", name: "采购计划"},
    {id: "2", name: "国际采购"},
    {id: "3", name: "临时采购"},
    {id: "4", name: "门店外采"},
    {id: "5", name: "销售退货"},
  ];
  private warehouse: Array<any> = new Array();
  private async getWares() {
    let res: any = await getWarehouse();
    if(res.code == 0) {
      this.warehouse = res.data;
    }
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
    this.storeId = "";
  }

  private brandLists: Array<any> = new Array();
  private async getBrand() {
    let res: any = await getParamsBrand();
    if (res.code == 0) {
      this.brandLists = res.data;
    }
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
    this.reset();
    if (this.salesList.length <= 0) {
      this.getAllSales();
    }
    if (this.brandLists.length <= 0) {
      this.getBrand();
    }
    if(this.warehouse.length <= 0) {
      this.getWares();
    }
    if(this.stores.length <= 0) {
      this.getStore();
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
    let data = {
      ctimeStart: this.createDate[0] ? moment(this.createDate[0]).format("YYYY-MM-DD") + " 00:00:00" : "",
      ctimeEnd: this.createDate[1] ? moment(this.createDate[1]).format("YYYY-MM-DD") + " 23:59:59" : "",
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
      storeId: this.storeId,
    };
    // console.log(data)

    let subdata: Map<string, string> = new Map();
    for (let key in data) {
      if (["showSelf"].includes(key)) {
        subdata.set(key, data[key]);
      } else if (data[key] && data[key].trim().length > 0) {
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

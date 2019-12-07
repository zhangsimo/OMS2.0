<template>
  <Modal
    title="高级查询"
    v-model="serchN"
    :styles="{ top: '50px', width: '500px' }"
  >
    <div class="data ml30 pl25">
      <Row class="mb30">
        <span>订货日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="orderDate"
        ></DatePicker>
      </Row>
      <Row class="mb30">
        <span>创建日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="createDate"
        ></DatePicker>
      </Row>
      <Row class="mb30">
        <span>提交日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="auditDate"
        ></DatePicker>
      </Row>
    </div>
    <Form :label-width="80" class="ml10 pl25">
      <FormItem label="供 应 商: ">
        <Input type="text" placeholder="前选择供应商" v-model="guestname" class="w300 ml5" @on-focus="showModel('selectSupplier')"/>
      </FormItem>
      <FormItem label="订单单号: ">
        <Input type="text" class="w300 ml5" size="large" v-model="serviceId" />
      </FormItem>
      <FormItem label="配件编码: ">
        <Input type="text" class="w300 ml5" size="large" v-model="partCode" />
      </FormItem>
      <FormItem label="品牌: ">
        <Input type="password" class="w300 ml5" v-model="partBrand" />
      </FormItem>
      <FormItem label="提交人: ">
        <Input type="password" class="w300 ml5" v-model="auditor" />
      </FormItem>
      <FormItem label="创建人: ">
        <Input type="password" class="w300 ml5" v-model="createUname" />
        <Checkbox v-model="showSelf">显示个人单据</Checkbox>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="mr15" type="primary" @click="ok">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
    <!-- 供应商资料 -->
    <select-supplier
      @selectSearchName="selectSupplierName"
      ref="selectSupplier"
      headerTit="供应商资料"
    ></select-supplier>
  </Modal>
</template>

<script lang="ts">
import * as tools from "../../../../utils/tools";
import { Vue, Component, Emit } from "vue-property-decorator";
import SelectSupplier from "./selectSupplier.vue";

@Component({
  components: {
    SelectSupplier
  }
})
export default class MoreSearch extends Vue {
  private serchN: boolean = false;

  private orderDate: Array<any> = new Array();
  private createDate: Array<any> = new Array();
  private auditDate: Array<any> = new Array();
  private serviceId: string = "";
  private partCode: string = "";
  private partBrand: string = "";
  private auditor: string = "";
  private createUname: string = "";
  private guestId:string = "";
  private guestname:string = "";
  private showSelf:boolean = true;

  private reset() {
    this.orderDate = new Array();
    this.createDate = new Array();
    this.auditDate = new Array();
    this.serviceId = "";
    this.partCode = "";
    this.partBrand = "";
    this.auditor = "";
    this.guestId = "";
    this.guestname = "";
    this.createUname = "";
    this.showSelf = true;
  }

  private init() {
    this.reset();
    this.serchN = true;
  }

  // 选择供应商
  private selectSupplierName(row: any) {
    this.guestId = row.id;
    this.guestname = row.fullName;
  }

  private showModel(name) {
    let ref: any = this.$refs[name];
    ref.init();
  }

  private cancel() {
    this.serchN = false;
  }

  @Emit('getmoreData')
  private ok() {
    let data = {
      startTime: tools.transTime(this.createDate[0]),
      endTime: tools.transTime(this.createDate[1]),
      orderStartDate: tools.transTime(this.orderDate[0]),
      orderEndDate: tools.transTime(this.orderDate[1]),
      auditStartDate: tools.transTime(this.auditDate[0]),
      auditEndDate: tools.transTime(this.auditDate[1]),
      serviceId: this.serviceId,
      partCode: this.partCode,
      partBrand: this.partBrand,
      auditor: this.auditor,
      createUname: this.createUname,
      guestId: this.guestId,
      showSelf: this.showSelf,
    };
    let subdata: Map<string, string> = new Map();
    for (let key in data) {
      if(['showSelf'].includes(key)) {
        subdata.set(key, data[key]);
      } else if (data[key] && data[key].trim().length > 0) {
        subdata.set(key, data[key]);
      }
    }
     let obj:any = {};
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

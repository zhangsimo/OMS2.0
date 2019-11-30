<template>
  <Modal
    title="高级查询"
    v-model="serchN"
    :styles="{ top: '50px', width: '500px' }"
  >
    <div class="data ml30 pl25">
      <Row class="mb30">
        <span>创建日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="searchForm.startDate"
        ></DatePicker>
      </Row>
      <Row class="mb30">
        <span>提交日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
          v-model="searchForm.submitDate"
        ></DatePicker>
      </Row>
    </div>
    <Form :label-width="80" class="ml10 pl25">
      <FormItem label="客户: ">
        <Input
          type="text"
          placeholder="请选择客户..."
          class="w300 ml5"
          v-model="searchForm.customerName"
        />
      </FormItem>
      <FormItem label="退货单号: ">
        <Input type="text" class="w300 ml5" size="large" v-model="searchForm.orderId"/>
      </FormItem>
      <FormItem label="配件编码: ">
        <Input type="text" class="w300 ml5" size="large" v-model="searchForm.fittingsCode"/>
      </FormItem>
      <FormItem label="配件名称: ">
        <Input type="text" class="w300 ml5" v-model="searchForm.fittingsName"/>
      </FormItem>
      <FormItem label="退货员: ">
        <Input type="text" class="w300 ml5" v-model="searchForm.returnPerson"/>
      </FormItem>
      <FormItem label="创建人: ">
        <Input type="text" class="w300 ml5" v-model="searchForm.createPerson"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="mr15" type="primary">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class MoreSearch extends Vue {
    private serchN:boolean = false;

    private init() {
        this.serchN = true;
    }
      private cancel() {
        this.serchN = false;
    }

      // 查询表单
  private searchForm = {
    startDate:"", //创建日期
    submitDate:"", //提交日期
    customerName:"",//客户
    orderId:"", //退货单号

    fittingsCode:"", //配件编码
      fittingsName:"", //配件名称
      returnPerson:"",//退货员
      createPerson:""//创建人
  };
}
</script>

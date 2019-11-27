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
        ></DatePicker>
      </Row>
      <Row class="mb30">
        <span>创建日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
        ></DatePicker>
      </Row>
      <Row class="mb30">
        <span>提交日期:</span>
        <DatePicker
          type="daterange"
          placement="bottom-end"
          style="width: 300px"
        ></DatePicker>
      </Row>
    </div>
    <Form :label-width="80" class="ml10 pl25">
      <FormItem label="供 应 商: ">
        <Input
          type="text"
          placeholder="请选择供应商..."
          class="w300 ml5"
        />
      </FormItem>
      <FormItem label="订单单号: ">
        <Input type="text" class="w300 ml5" size="large"/>
      </FormItem>
      <FormItem label="配件编码: ">
        <Input type="text" class="w300 ml5" size="large"/>
      </FormItem>
      <FormItem label="品牌: ">
        <Input type="password" class="w300 ml5"/>
      </FormItem>
      <FormItem label="提交人: ">
        <Input type="password" class="w300 ml5"/>
      </FormItem>
      <FormItem label="创建人: ">
        <Input type="password" class="w300 ml5"/>
        <Radio>显示个人单据</Radio>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="mr15" type="primary">确定</Button>
      <Button>取消</Button>
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
}
</script>

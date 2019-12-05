<template>
    <Modal title="采购金额填写" v-model="sumMod" :styles="{top: '50px', width: '500px'}">
      <Form
        ref="formInline"
        :model="formInline"
        :label-width="100"
        class="ml10 pl25"
      >
        <FormItem prop="user" label="合计采购金额: ">
          <Input type="text" class="w300 ml5" disabled v-model="totalAmt" />
        </FormItem>
        <FormItem label="折扣金额: ">
          <InputNumber :min="0" :max="totalAmt" v-model="formInline.disAmt" :precision="2" placeholder="请输入" class="w300 ml5"/>
        </FormItem>
        <FormItem label="返利金额: ">
          <InputNumber :min="0" :max="totalAmt" v-model="formInline.rebateAmt" :precision="2" placeholder="请输入" class="w300 ml5"/>
        </FormItem>
        <FormItem label="实际应付金额: ">
          <Input class="w300 ml5" disabled v-model="endPrice" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class PurchaseAmount extends Vue {
    @Prop(Number) private readonly totalAmt;

    private sumMod:boolean = false;

    private get endPrice():number {
      return this.totalAmt - this.formInline.disAmt - this.formInline.rebateAmt;
    }

    private formInline = {
        disAmt: 0,
        rebateAmt: 0,
    }

    private reset() {
      this.formInline.disAmt = 0;
      this.formInline.rebateAmt = 0;
    }

    private init() {
        this.reset();
        this.sumMod = true;
    }

    @Emit('amt')
    private save() {
      this.cancel();
      return this.formInline;
    }

    private cancel() {
        this.sumMod = false;
    }
}
</script>

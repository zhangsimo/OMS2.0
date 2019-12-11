<template>
  <Modal
    title="分摊费用填写"
    v-model="sumMod"
    :styles="{ top: '50px', width: '500px' }"
  >
    <Form
      ref="formInline"
      :model="formInline"
      :label-width="100"
      class="ml10 pl25"
    >
      <FormItem label="币种: ">
        <Select v-model="formInline.currency" class="w300">
          <Option
            v-for="item in currencies"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="汇率: ">
        <InputNumber
          :min="0"
          class="w300 ml5"
          v-model="formInline.exchangeRate"
        />
      </FormItem>
      <FormItem label="关税比例: ">
        <InputNumber
          :min="0"
          :max="100"
          v-model="formInline.tariff"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
          placeholder="请输入"
          class="w300 ml5"
        />
      </FormItem>
      <FormItem label="运杂费比例: ">
        <InputNumber
          :min="0"
          :max="100"
          v-model="formInline.transportation"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
          placeholder="请输入"
          class="w300 ml5"
        />
      </FormItem>
      <FormItem label="增值税比例: ">
        <InputNumber
          :min="0"
          :max="100"
          v-model="formInline.valueAddedTax"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
          placeholder="请输入"
          class="w300 ml5"
        />
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
export default class ApportionmentExpenses extends Vue {
  private sumMod: boolean = false;

  // 币种
  @Prop(Array) private readonly currencies;

  private formInline = {
    currency: "", // 币种
    exchangeRate: 0, // 汇率
    tariff: 0, // 关税比例
    transportation: 0, // 运杂费比例
    valueAddedTax: 0 // 增值税比例
  };

  private reset() {
    this.formInline = {
      currency: "", // 币种
      exchangeRate: 0, // 汇率
      tariff: 0, // 关税比例
      transportation: 0, // 运杂费比例
      valueAddedTax: 0 // 增值税比例
    };
  }

  private init() {
    this.reset();
    this.sumMod = true;
  }

  @Emit("feeForm")
  private save() {
    this.cancel();
    return this.formInline;
  }

  private cancel() {
    this.sumMod = false;
  }
}
</script>

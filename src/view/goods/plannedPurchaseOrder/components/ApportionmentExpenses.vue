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
      :rules="ruleValidate"
      class="ml10 pl25"
    >
      <FormItem label="币种: " prop="currency">
        <Select v-model="formInline.currency" class="w300">
          <Option
            v-for="item in currencies"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="汇率: " prop="exchangeRate">
        <el-input-number
          :min="0"
          class="w300 ml5"
          v-model="formInline.exchangeRate"
          :controls="false"
          size="small"
          :precision="2"
        />
      </FormItem>
      <FormItem label="关税比例: " prop="tariffScale">
        <InputNumber
          :min="0"
          :max="100"
          v-model="formInline.tariffScale"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
          placeholder="请输入"
          class="w300 ml5"
          :controls="false"
          size="small"
        />
      </FormItem>
      <FormItem label="运杂费比例: " prop="transportScale">
        <InputNumber
          :min="0"
          :max="100"
          v-model="formInline.transportScale"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
          placeholder="请输入"
          class="w300 ml5"
          :controls="false"
          size="small"
        />
      </FormItem>
      <FormItem label="增值税比例: " prop="vatScale">
        <InputNumber
          :min="0"
          :max="100"
          v-model="formInline.vatScale"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
          placeholder="请输入"
          class="w300 ml5"
          :controls="false"
          size="small"
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

function checkHL(rule, value, callback) {
  if (!value) {
    callback(new Error("汇率不能为空"));
  } else {
    if (value <= 0) {
      callback(new Error("汇率不能小于0"));
    } else {
      callback();
    }
  }
}

function checks(name: string): any {
  return function(rule, value, callback) {
    if (!value) {
      callback(new Error(`${name}不能为空`));
    } else {
      if (value < 0) {
        callback(new Error(`${name}不能小于0`));
      } else {
        callback();
      }
    }
  };
}

@Component
export default class ApportionmentExpenses extends Vue {
  private sumMod: boolean = false;

  // 币种
  @Prop(Array) private readonly currencies;

  private formInline = {
    currency: "", // 币种
    exchangeRate: 0, // 汇率
    tariffScale: 0, // 关税比例
    transportScale: 0, // 运杂费比例
    vatScale: 0 // 增值税比例
  };

  private reset() {
    const ref: any = this.$refs["formInline"];
    ref.resetFields();
    this.formInline = {
      currency: "", // 币种
      exchangeRate: 0, // 汇率
      tariffScale: 0, // 关税比例
      transportScale: 0, // 运杂费比例
      vatScale: 0 // 增值税比例
    };
  }

  private ruleValidate: ruleValidate = {
    currency: [{ required: true, message: "币种不能为空", trigger: "change" }],
    exchangeRate: [{ required: true, validator: checkHL, trigger: "blur" }],
    tariffScale: [
      { required: true, validator: checks("关税比例"), trigger: "blur" }
    ],
    transportScale: [
      { required: true, validator: checks("运杂费比例"), trigger: "blur" }
    ],
    vatScale: [
      { required: true, validator: checks("增值税比例"), trigger: "blur" }
    ]
  };

  private init() {
    this.reset();
    this.sumMod = true;
  }

  @Emit("currencyForm")
  private save() {
    let res: any = null;
    const formInline: any = this.$refs["formInline"];
    formInline.validate((valid: any) => {
      if (valid) {
        res = this.formInline;
      } else {
        this.$Message.error("请添加配件或完善订单信息后再提交!");
      }
    });
    this.cancel();
    return res;
  }

  private cancel() {
    this.sumMod = false;
  }
}
</script>

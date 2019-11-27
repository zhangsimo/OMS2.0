<template>
    <Modal title="采购金额填写" v-model="sumMod" :styles="{top: '50px', width: '500px'}">
      <Form
        ref="formInline"
        :model="formInline"
        :label-width="100"
        class="ml10 pl25"
      >
        <FormItem prop="user" label="合计采购金额: ">
          <Input type="text" class="w300 ml5" disabled />
        </FormItem>
        <FormItem label="折扣金额: ">
          <Input v-model="formInline.pic1" placeholder="请输入" class="w300 ml5"/>
        </FormItem>
        <FormItem label="返利金额: ">
          <Input v-model="formInline.pic2" placeholder="请输入" class="w300 ml5"/>
        </FormItem>
        <FormItem label="实际应付金额: ">
          <Input class="w300 ml5" disabled />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('formInline')">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PurchaseAmount extends Vue {
    private sumMod:boolean = false;

    private formInline = {
        pic1: '',
        pic2: '',
    }

    private init() {
        this.sumMod = true;
    }

    private save(name) {}
    private cancel() {
        this.sumMod = false;
    }
}
</script>

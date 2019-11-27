<template>
  <Modal v-model="showInfo" title="收货信息" width="1000">
    <div class="goodsInfo">
      <div class="header">
        <Form ref="formOne" :model="formInfo" inline>
          <!-- <FormItem>
            <Input type="text" placeholder="客户名称"/>
        </FormItem>-->
          <FormItem>
            <Input type="text" placeholder="收货单位" />
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="收货地址" />
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="收货人" />
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="联系电话" />
          </FormItem>
          <Button type="primary mr15">查询</Button>
          <Button type="primary mr15">保存</Button>
          <Button>取消</Button>
        </Form>
      </div>
      <div class="main">
        <!-- 收货信息 左 -->
        <div class="fl  w300">
          <div class="bgc p5">收货信息</div>
          <vxe-table
            border
            resizable
            size="mini"
            height="400"
            :data="tableData"
            highlight-current-row
            :radio-config="{ labelField: '', trigger: 'row' }"
          >
            <vxe-table-column
              type="index"
              width="60"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column
              type="radio"
              width="60"
              title="选择"
            ></vxe-table-column>
            <vxe-table-column
              field="role"
              title="收货单位"
              width="120"
            ></vxe-table-column>
            <vxe-table-column
              field="sex"
              title="收货地址"
              width="120"
            ></vxe-table-column>
            <vxe-table-column
              field="num6"
              title="收货人"
              width="80"
            ></vxe-table-column>
            <vxe-table-column
              field="num6"
              title="联系电话"
              width="120"
            ></vxe-table-column>
          </vxe-table>
        </div>
        <!-- 收货信息 右 -->
        <div class="bgc p5  mb15">收货信息</div>
        <div class="sForm">
          <Form
            inline
            :show-message="false"
            ref="formTwo"
            :model="formInfo"
            :rules="ruleInfo"
            :label-width="100"
          >
            <FormItem label="收货单位：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="收货地址：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="收货人：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="联系电话：">
              <Input class="w200" />
            </FormItem>
            <!-- 发货信息 右-->
            <div class="bgc p5 mb15 mt15">发货信息</div>
            <FormItem label="配送方式：">
              <Select class="w200">
                <Option value="beijing">New York</Option>
              </Select>
            </FormItem>
            <FormItem label="发货物流：">
              <Select class="w200">
                <Option value="beijing">New York</Option>
              </Select>
            </FormItem>
            <FormItem label="运输费用：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="结算方式：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="发货备注：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="业务单号：">
              <Input class="w200" />
            </FormItem>
            <FormItem label="失联单号：">
              <Input class="w200" />
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class GoodsInfo extends Vue {
    private showInfo:boolean = false;

    private init() {
        this.showInfo = true;
    }
}

</script>

<style lang="less" scoped>
.bgc {
  color: #000;
  background-color: #e8e8e8;
}
</style>

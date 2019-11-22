<template>
  <div class="goodsInfo">
    <!-- <Modal v-model="showInfo" title="收货信息" width="1500" > -->
      <div class="middle">
        <Form ref="formOne" :model="formInfo"  inline>
          <FormItem>
            <Input type="text" placeholder="客户名称"></Input>
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="收货单位"></Input>
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="收货地址"></Input>
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="收货人"></Input>
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="联系电话"></Input>
          </FormItem>
          <Button type="primary mr15">查询</Button>
          <Button type="primary mr15">保存</Button>
          <Button>取消</Button>
        </Form>
      </div>
      <div class="footer">
        <Split v-model="split1" style="height: 700px" min="500" max="850">
          <div slot="left"  >
            <div class="bgc p5">收货信息</div>
            <vxe-table
                border
                resizable
                size="mini"
                height="650"
                :data="tableData"
                highlight-current-row
                :radio-config="{labelField: '', trigger: 'row'}"
                >
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column type="radio" width="60" title="选择">
                </vxe-table-column>
                <vxe-table-column field="name" title="客户" width="100"></vxe-table-column>
                <vxe-table-column field="role" title="收货单位" width="100"></vxe-table-column>
                <vxe-table-column field="sex" title="收货地址" width="100"></vxe-table-column>
                <vxe-table-column field="num6" title="收货人" width="100"></vxe-table-column>
                <vxe-table-column field="num6" title="联系电话" width="100"></vxe-table-column>
              </vxe-table>
          </div>
          <div slot="right" >
            <!-- 收货信息 -->
            <div class="bgc p5 ml5 mb15">收货信息</div>
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
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="收货地址：">
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="收货人：">
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="联系电话：">
                  <Input class="w340"></Input>
                </FormItem>
                <!-- 发货信息 -->
                <div class="bgc ml5 p5 mb15">发货信息</div>
                <FormItem label="配送方式：">
                  <Select class="w340">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
                <FormItem label="发货物流：">
                  <Select class="w340">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
                <FormItem label="运输费用：">
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="结算方式：">
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="发货备注：">
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="业务单号：">
                  <Input class="w340"></Input>
                </FormItem>
                <FormItem label="失联单号：">
                  <Input class="w340"></Input>
                </FormItem>
              </Form>
            </div>
          </div>
        </Split>
      </div>
      <!-- <div slot="footer"></div> -->
    <!-- </Modal> -->
  </div>
</template>

<script>
export default {
  name: "goodsInfo",
  data() {
    return {
      split1: 0.4,
      //对话框 v-modal
      tableData: [
        {name: 'hh', role: 'gg'},
        {name: 'hh', role: 'gg'}
      ]
    };
  },
  components: {},
  activated() {},
  mounted() {

  },
  methods: {

  },
  computed: {}
};
</script>

<style lang='less' scoped>
.bgc {
  color: #000;
  background-color: #e8e8e8;
}
</style>

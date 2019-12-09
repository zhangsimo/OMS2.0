<template>
  <Modal
    v-model="moreQueryShow"
    title="高级查询"
    @on-cancel="cancel"
  >
    <div class="box">
      <Form ref="formInline" :model="data" :label-width="100">
        <FormItem label="创建日期:">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="选择日期" v-model="data.creatDate"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">至:</Col>
            <Col span="11">
              <DatePicker type="date" placeholder="选择日期" v-model="data.creatDate"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="出库日期:">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="选择日期" v-model="data.creatDate"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">至:</Col>
            <Col span="11">
              <DatePicker type="date" placeholder="选择日期" v-model="data.creatDate"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="客户:">
          <Select v-model="data.asd" filterable style="width: 350px" placeholder="请选择客户...">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="销售单号:">
          <Input v-model="data.text" placeholder="请输入单号"
                 style="width: 350px"/>
        </FormItem>
        <FormItem label="配件编码:">
          <Input v-model="data.text" placeholder="请输入编码"
                 style="width: 350px"/>
        </FormItem>
        <FormItem label="配件名称:">
          <Input v-model="data.text" placeholder="请输入配件名称" style="width: 350px"/>
        </FormItem>
        <FormItem label="创建人:">
          <Input v-model="data.text" placeholder="请输入创建人" style="width: 350px"/>
        </FormItem>
      </Form>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default' @click="moreQueryShow=false">取消</Button>
    </div>
  </Modal>
</template>

<script>
    import {getClient} from '@/api/salesManagment/salesOrder'

    export default {
        name: "MoreQuery",
        data() {
            return {
                moreQueryShow: false,//模态框是否展示
                cityList: [],//客户下拉框
            }
        },
        mounted() {
            this.getAllClient()
        },
        methods: { async getAllClient() {
                let res = await getClient()
            },
            openModal() {
                this.moreQueryShow = true
            },
            //取消
            cancel () {
                this.$Message.info('已取消');
            }

        }
    }
</script>

<style scoped>
  .box >>> .ivu-form-item {
    margin-bottom: 8px;
  }
</style>


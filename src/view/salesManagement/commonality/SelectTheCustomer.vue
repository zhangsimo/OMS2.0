<template>
  <Modal v-model="addressShow" title="选择客户"  width="1000" class="modalBox">
    <div>
      <header class="titleHeader">
        <Input v-model="clientName" placeholder="名称" class="mr10" style="width: 150px" />
        <Input v-model="clientCode" placeholder="编码" class="mr10" style="width: 150px" />
        <Input v-model="clientPhone" placeholder="电话" class="mr10" style="width: 150px" />
        <Select v-model="clientType" style="width:150px" placeholder="请选择类型" class="mr10">
          <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="mr5">显示禁用:</span>
        <Checkbox v-model="single" class="mr10"></Checkbox>
        <Button type="warning" class="mr10" ><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
        <Button class="mr10" type='default'><Icon type="md-checkmark" /> 选择</Button>
        <Button class="mr10" type='default'><Icon type="md-close" /> 取消</Button>
      </header>
    </div>
    <div slot='footer'>
      <Button type='primary'>确定</Button>
      <Button type='default'>取消</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "SelectTheCustomer",
        data(){
            return {
                addressShow: true,
                clientName:'' ,//名称
                clientCode:'',//编码
                clientPhone:'',//电话
                clientType:'',//类型
                clientList:[
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                ]
            }
        }
    }
</script>

<style scoped lang="less">
.titleHeader {
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  padding-left: 10px;
}
</style>
<style scoped>
  .modalBox >>> .ivu-modal-body {
    padding: 0px;
  }
</style>

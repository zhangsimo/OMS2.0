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
      <div class="clientBody">
        <div class="demo-split">
          <Split v-model="split1">
            <div slot="left" class="demo-split-pane">
              <div class="tableBox">
              <vxe-table
                border
                resizable
                show-overflow
                highlight-hover-row
                highlight-current-row
                resizable
                style="width: 700px"
                size="mini"
                :loading="Loading"
                align="center"
                :data="tableData"
                height="500"
                >
                <vxe-table-column type="index" title="序号" width="50"></vxe-table-column>
                <vxe-table-column field="name" title="状态" ></vxe-table-column>
                <vxe-table-column field="name" title="客户" ></vxe-table-column>
                <vxe-table-column field="name" title="创建日期" ></vxe-table-column>
                <vxe-table-column field="name" title="销售员" ></vxe-table-column>
                <vxe-table-column field="name" title="销售订单单号" ></vxe-table-column>
                <vxe-table-column field="name" title="打印次数" ></vxe-table-column>
                <vxe-table-column field="name" title="提交人" ></vxe-table-column>
                <vxe-table-column field="name" title="提交日期" ></vxe-table-column>
                <vxe-table-column field="name" title="创建人" ></vxe-table-column>
              </vxe-table>
              </div>
              <Page size="small" :total="page.total" :page-size="page.size" :current="page.num"   :page-size-opts="page.sizeOpts"
                    show-sizer show-total
                    style="float: right;margin-top: 10px"/>
            </div>
            <div slot="right" class="demo-split-pane">
              <div>
                21213123123
              </div>
            </div>
          </Split>
        </div>
      </div>
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
                ],
                split1: 0.3,//分割线
                Loading:true,//加载中
                page:{
                    num:1,
                    total:0,
                    size:50,
                    sizeOpts:[50,60,70,80,90,100]
                },

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
.clientBody{
  height: 600px;
}
.tableBox{
  overflow: hidden;
  overflow-x: scroll;
}
.demo-split{
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane{
  padding-left: 10px;
  padding-top: 10px;


}
</style>
<style scoped>
  .modalBox >>> .ivu-modal-body {
    padding: 0px;
  }
</style>

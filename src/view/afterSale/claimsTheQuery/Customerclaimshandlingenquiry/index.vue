<template>
  <div class="afterSale">
    <div class="top">
      <quick-date
        ref="quickdate"
        class="mr10"
        v-on:quickDate="getvalue"
      ></quick-date>
      <span class="ml5">理赔单位：</span>
      <Input
        v-model.trim="search.guestName"
        placeholder="请输入理赔单位"
        style="width: 200px"
        clearable
      />
      <!-- <i class="iconfont iconcaidan input" @click="Dealings"></i>
      -->
      <span class="ml5">配件编码/名称/内码：</span>
      <Input v-model.trim="search.partCode" style="width: 200px" clearable />
       <span>品牌：</span>
      <Select v-model.trim="search.partBrand" @on-change="select1" class="w90 mr10" clearable
          filterable>
        <Option
          v-for="item in brandArr"
          :value="item.label"
          :key="item.value"
          
          >{{ item.label }}</Option
        >
      </Select>
      <!-- <span>状态：</span>
      <Select v-model="state" @on-change="getDataType1" class="w90 mr10">
        <Option
          v-for="item in stateArr"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select> -->
      <span class="ml5">理赔单号：</span>
      <Input
        v-model.trim="search.serviceId"
        placeholder="请输入理赔单位"
        style="width: 200px"
        clearable
      />
      <Button @click="query">查询</Button>
      <Button v-has="'export'">导出</Button>
     
      <Poptip placement="bottom-start" v-model="moreModel" @on-popper-hide="poperHide">
              <Button class="mr10" @click="moreOpen">更多查询</Button>
              <div slot="content">
                <Form :label-width="80" class="pl5 h270" :label-position="'left'" style="overflow-y: scroll;overflow-x: visible;">
                  <FormItem label="处理日期: " class="h20">
                    <DatePicker
                      type="daterange"
                      placement="bottom-start"
                      class="ml10 w300"
                      v-model.trim="moreSearch.orderDate1"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="处理类型: " class="h20">
                    <Select v-model.trim="moreSearch.handleType" transfer class="ml10 mr10 w300">
                      <Option
                        v-for="item in handleTypeList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="客户类型: " class="h20">
                    <Select v-model.trim="moreSearch.guestType" @on-change="getDataType" transfer class="ml10 mr10 w300">
                      <Option
                        v-for="item in guestTypeList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="处理人: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.orderMan"/>
                  </FormItem>
                  <FormItem label="处理单号: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.serviceId"/>
                  </FormItem>
                  <FormItem label="返回单号: " class="h20">
                    <Input type="text" class="w300 ml10" v-model.trim="moreSearch.returnCode"/>
                  </FormItem>
                </Form>
                <Row style="background-color: #ffffff;" class="pb5 pr30 w400">
                  <Col span="20">
                    <Row>
                      <Col span="7" class="ml5">
                        <Button type="primary" @click="Morequery">确定</Button>
                      </Col>
                      <Col span="6">
                        <Button @click="cancelContent(0)">取消</Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="4" class="flex pl10" style="flex-direction: row-reverse;">
                    <Button type="primary" @click="cancelContent(1)">清空条件</Button>
                  </Col>
                </Row>
              </div>
            </Poptip>
    </div>
    
    <div class="footer">
      <vxe-table
        border
      auto-resize
      resizable
       show-overflow
      :data="claimSupplierData"
      size="mini"
      ref="xTable"
      
      class="mt20"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="shortName" title="分店名称" width="100"></vxe-table-column>
        <vxe-table-column field="serviceId" title="处理单号" width="100">  </vxe-table-column>
      
        <vxe-table-column field="guestName" title="理赔单位" width="100"></vxe-table-column>
        <vxe-table-column field="orderDate" title="处理日期" width="100"></vxe-table-column>
        <vxe-table-column
          field="handleType"
          title="处理类型"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="claimsCode"
          title="理赔单号"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="returnCode"
          title="返回单号"
          width="100"
        ></vxe-table-column> 
        <vxe-table-column field="partInnerId" title="配件内码" width="100"></vxe-table-column>
        <vxe-table-column field="partCode" title="配件编码" width="100"></vxe-table-column>
        <vxe-table-column
          field="partName"
          title="配件名称"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="oemCode"
          title="OE码"
          width="100"
        >
        </vxe-table-column> 
       <vxe-table-column
          field="partBrand"
          title="品牌"
          width="100"
        >
        </vxe-table-column> 
         <vxe-table-column
          field="carModelName"
          title="品牌车型"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="unit"
          title="单位"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="afterSaleQty"
          title="理赔数量"
          width="100"
        ></vxe-table-column>
         <vxe-table-column
          field="processedQty"
          title="处理数量"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="备注"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="orderMan"
          title="处理人"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="spec"
          title="规格"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="carTypef"
          title="配件类别一级"
          width="100"
        ></vxe-table-column>
        <vxe-table-column
          field="carTypes"
          title="配件类别二级"
          width="100"
        ></vxe-table-column>
      </vxe-table>
      <div class="page-warp fw">
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          :page-size-opts="pageOpts"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-sizer
          show-total
          transfer
        ></Page>
      </div>
      <!-- <More
        ref="mores"
        :getShowMore="showMore"
        @getMoreStatus="openMoreflag"
        @getMoreData="openMoreData"
      ></More> -->
    </div>
  </div>
</template>
<script  src="./index.ts"></script>
<style lang="less" scoped>
.afterSale {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 5px 10px;
}
.date {
  width: 150px;
  margin: 0 10px;
}
.input {
  position: relative;
  left: -25px;
  top: 3px;
}
span {
  margin-left: 15px;
}
button {
  margin-left: 10px;
}
.footer{
  margin-top: 5px;
}
</style>


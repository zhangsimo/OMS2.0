 <template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
    <div class="oper-top flex">
    <div class="wlf">
    <div class="db">
      <span>快速查询：</span>
      <Select v-model="purchaseType" class="w90 mr10">
        <Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <Input v-model="searchValue" placeholder="输入查询条件" class="w200 mr10"></Input>
    </div>
      <div class="db">
        <span>配件审核状态：</span>
        <Select v-model="approvalType" class="w90 mr10">
          <Option v-for="item in approvalTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
      <div class="db">
        <span>审核日期：</span>
        <DatePicker @on-change="selectDate" type="daterange" placeholder="年/月/日 - 年/月/日" class="w200 mr10"></DatePicker>
        <Button type="warning" @click="search" class="mr10 w90"><Icon type="ios-search" size="14" /> 查询</Button>
        <Button :loading="approvalLoading" v-if="selectTable.auditSign==0" type="default" @click="approval" class="mr10" v-has="'audit'"><i class="iconfont mr5 iconshenheicon"></i>配件审核</Button>
        <checkbox v-model="showPerson" @on-change="search">显示自己</checkbox>
      </div>
    </div>
    </div>
    </section>
    <section class="con-box">
      <div class="clearfix">
        <Table :height="heightWrap" @on-current-change="selectTabelData" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      </div>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>

    </section>
    <part-info ref="partInfo" @throwData="submitSave"></part-info>


    <!--<Modal v-model="addPartModal" title="新增配件名称" width="500">-->
      <!--<Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="110">-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="标准名称：" prop="name">-->
              <!--<Input @on-click="showName" v-model="formValidate.name" ></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="别名：" prop="name">-->
              <!--<Input @on-click="showName" v-model="formValidate.name" ></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="配件一级分类：" prop="name">-->
              <!--<Select v-model="formValidate.unit">-->
                <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="配件二级分类：" prop="name">-->
              <!--<Select v-model="formValidate.unit">-->
                <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="配件三级分类：" prop="name">-->
              <!--<Select v-model="formValidate.unit">-->
                <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
          <!--<Col span="20">-->
            <!--<FormItem label="补充说明：" prop="code">-->
              <!--<Input v-model="formValidate.code"></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->
      <!--</Form>-->
      <!--<div slot='footer'>-->
        <!--<Button type='primary' @click='submit("addPartModal")'>确定</Button>-->
        <!--<Button type='default' @click='addPartModal = false'>取消</Button>-->
      <!--</div>-->
    <!--</Modal>-->
  </div>
</template>
<script>
  import '../../lease/product/lease.less'
  import './partsLayer.less'
  import {minxParts} from './mixParts'
  import PartInfo from "_c/partInfo/partInfo";

  export default {
    name: 'partsExamine',
    components: {PartInfo},
    inject:['reload'],
    mixins:[minxParts],
  }
</script>

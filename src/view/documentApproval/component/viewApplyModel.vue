<template>
  <Modal
    v-model="model"
    title="客户信用调查"
    width="1200px"
    footer-hide
  >
    <Form :label-width="100" ref="formInline" :model="data" class="list Habox">
      <div class="mb10" style="font-weight: bold">工商注册信息</div>
      <div>
        <label style="margin-right: 180px">
          往来单位名称：
          <span>{{ data.fullName }}</span>
        </label>
        <label>
          往来单位分类：
          <span>{{ data.guestTypeName }}</span>
        </label>
      </div>
      <Row>
        <Col span="8">
          <FormItem label="注册号:" prop="bizLicenseNo">
            <Input readonly v-model="data.bizLicenseNo" style="width: 180px"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="公司性质:" prop="nature">
            <Select readonly style="width:180px" v-model="data.nature">
              <Option
                v-for="item in billTypeArr.CS00117"
                :value="item.id"
                :key="item.id"
              >{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="法定代表人:" prop="legalPerson">
            <Input readonly v-model="data.legalPerson" style="width: 180px"></Input>
          </FormItem>
          <FormItem label="经营期限:" prop="operationStart">
            <Input readonly v-model="data.operationStart" style="width: 180px"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="注册资本(万):" prop="registMoney">
            <Input readonly v-model="data.registMoney" style="width: 180px"></Input>
          </FormItem>
          <FormItem label="至" prop="operationEnd">
            <Input readonly v-model="data.operationEnd" style="width: 180px"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="成立日期:" prop="registerDate">
            <DatePicker
              v-model="data.registerDate"
              type="date"
              format="yyyy-MM-dd"
              style="width: 180px"
              readonly
            ></DatePicker>
          </FormItem>
          <FormItem label="登记状态:" prop="manageStatus">
            <Select readonly v-model="data.manageStatus" style="width:180px">
              <Option
                v-for="item in billTypeArr.CS00118"
                :value="item.id"
                :key="item.id"
              >{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="注册地址:" prop="registAddress">
        <Input readonly v-model="data.registAddress" style="width: 650px"></Input>
      </FormItem>
      <FormItem label="经营地址:" prop="shopAddress">
        <Input readonly v-model="data.shopAddress" style="width: 650px"></Input>
      </FormItem>
      <FormItem label="经营范围:" prop="mainProducts">
        <Input readonly v-model="data.mainProducts" style="width: 650px"></Input>
      </FormItem>
      <Row>
        <Col span="12">
          <FormItem label="经营执照扫描:" prop="businessName">
            <Input readonly v-model="data.businessName" style="width: 150px;float: left" disabled></Input>

            <a
              target="view__blank"
              :href="data.businessName"
              class="download"
              download
              v-if="data.businessName"
            >下载</a>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="购物合同扫描:" prop="purchaseName">
            <Input readonly v-model="data.purchaseName" style="width: 150px;float: left" disabled></Input>
            <a
              target="view__blank"
              :href="data.purchaseName"
              class="download"
              v-if="data.purchaseName"
            >下载</a>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="备注:" prop="remark">
        <Input readonly v-model="data.remark" style="width: 650px"></Input>
      </FormItem>
      <Row>
        <Col span="8">
          <FormItem label="法人电话:" prop="chargeManTel">
            <Input readonly v-model="data.chargeManTel" style="width: 180px"></Input>
          </FormItem>
          <FormItem label="授权采购员:" prop="salesman">
            <Input readonly v-model="data.salesman" style="width: 180px"></Input>
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem label="身份证号码:" prop="identityCard">
            <Input readonly v-model="data.identityCard" style="width: 380px"></Input>
          </FormItem>
          <FormItem label="采购员电话:" prop="salesmanTel">
            <Input readonly v-model="data.salesmanTel" style="width: 180px"></Input>
          </FormItem>
        </Col>
      </Row>
      <div class="mb10 mt20" style="font-weight: bold">结算约定情况</div>
      <Row>
        <Col span="8"></Col>
        <Col span="8">
          <FormItem label="回款方式:" prop="cashMode">
            <Select readonly v-model="data.cashMode" style="width:180px">
              <Option
                v-for="item in billTypeArr.CS00106"
                :value="item.id"
                :key="item.id"
              >{{ item.itemName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="约定对账日期:" prop="accountDate">
            <!--<Input v-model='data.accountDate' style="width: 180px" ></Input>-->
            <Input readonly v-model="data.accountDate" style="width: 180px"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="回款日期:" prop="cashDate">
            <Input readonly v-model="data.cashDate" style="width: 180px"></Input>
            <!--<Input v-model='data.cashDate' style="width: 180px" ></Input>-->
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="滚动借款周期:" prop="rollingDate">
            <!--<Input v-model='data.rollingDate' style="width: 180px" ></Input>-->
            <InputNumber readonly :min="1" v-model="data.rollingDate" style="width: 180px"></InputNumber>
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem class="ivu-form-item-required" v-if="data.isGuestResearch == 0" label="申请授信额度:" prop="applyTrustMoney">
            <Input readonly v-model="data.applyTrustMoney" style="width: 380px"></Input>
          </FormItem>
          <FormItem v-else label="调整原因:" prop="adjustReason">
            <Input readonly v-model="data.adjustReason" style="width: 380px"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
</template>

<script>
	import SurveyList from "../../system/essentialData/customerCredit/SurveyList";
  import {findCreditDetail} from "../../../api/documentApproval/documentApproval/documentApproval";
  export default {
		name: "applyModelView",
    components: {SurveyList},
    props:{
		  billTypeArr: {
		    type:Object,
        default:{}
      }
    },
    data(){
		  return {
        model:false,
        data: "", //父组件中当前行的数据
        dataMsg: "", //父组件中数据字典的数据
        dataJudge: "",
        mainData:{}
      }
    },
    methods:{
		  init(row){
        this.model = true;
        this.getCreditDetail(row)
      },
      async getCreditDetail(row){
        let rep = await findCreditDetail({'code':row.applyNo});
        if(rep.code==0){
          this.data = rep.data||{};
        }
        console.log(this.data)
      },
    }
	}
</script>

<style scoped>
  .download {
    display: inline-block;
    padding: 0 10px;
    line-height: 28px;
    box-sizing: border-box;
    margin-left: 10px;
    border: 1px #ddd solid;
  }
  .uploadbtn:hover {
    color: #03a9f4;
  }
  .list >>> .ivu-form-item {
    margin-bottom: 15px;
  }
  .list >>> label {
    width: 105px !important;
  }
  .list >>> .ivu-form-item-error-tip {
    position: absolute;
    top: 100%;
    left: 5px;
    line-height: 1;
    padding-top: 2px !important;
    color: #ed4014;
  }
</style>

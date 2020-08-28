<template>
  <div class="content-oper content-oper-flex" style="background-color: #fff;">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>快速查询：</span>
            <quickDate class="mr10" ref="quickDate" @quickDate="quickDate"></quickDate>
          </div>
          <div class="db ml15">
            <span>期间：</span>
            <Date-picker :value="value" type="daterange" placeholder="选择日期" class="w200"
                         @on-change="dateChange"></Date-picker>
          </div>
          <div class="db ml15">
            <span>区域：</span>
            <Select v-model="model1" filterable class="w150" :disabled="selectShopList" @on-change='changeArea'>
              <Option
                v-for="item in Branchstore"
                :value="item.id"
                :key="item.id"
              >{{ item.companyName }}
              </Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>门店：</span>
            <Select v-model="shopCode" filterable class="w150" disabled>
<!--              :disabled="selectShopList"-->
              <Option
                v-for="item in shopList"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}
              </Option>
            </Select>
          </div>
          <div class="db ml15">
            <span>账户：</span>
            <input type="text" class="h30" v-model="accountName">
          </div>
          <div class="db ml15 mr10">
            <span>开户行：</span>
            <input type="text" class="h30" v-model="bankName">
          </div>
<!--          <div class="db mr10">-->
<!--            <span>对应科目：</span>-->
<!--            <Select v-model="subjectCode" filterable class="w150">-->
<!--              <Option-->
<!--                v-for="item in subJectList"-->
<!--                :value="item.id"-->
<!--                :key="item.id"-->
<!--              >{{ item.titleName }}-->
<!--              </Option>-->
<!--            </Select>-->
<!--          </div>-->
          <div class="db ml15">
            <span>对应科目：</span>
            <el-cascader
              ref="casecader"
              size="small"
              :options="options"
              @change="getKemuList"
              :props="{ multiple: true, children: 'children',label:'titleName',value:'id' }"
              collapse-tags
              clearable></el-cascader>
          </div>
          <div class="db mr10">
            <span>金额：</span>
            <vxe-input type="float" class="w100 h30" v-model="accountMoney" digits="2"></vxe-input>
          </div>
          <div class="db mr10">
            <span>对方账号：</span>
            <input type="text" class="h30" v-model="accountCode">
          </div>
          <div class="db mr10">
            <span>认领门店：</span>
            <Select v-model="claimShopName" filterable clearable class="w150">
              <Option
                v-for="item in getAccShopList"
                :value="item.shopName"
                :key="item.shopCode"
              >{{ item.shopName }}
              </Option>
            </Select>
          </div>
          <div class="db mr10">
            <span>往来单位：</span>
            <input type="text" class="h30" v-model="suppliers">
            <!--<Select-->
            <!--v-model="guestId"-->
            <!--class="w150"-->
            <!--clearable-->
            <!--filterable-->
            <!--remote-->
            <!--:loading="remoteloading"-->
            <!--:remote-method="getOne"-->
            <!--&gt;-->
            <!--<Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
            <!--</Select>-->
          </div>
          <div class="db ml15">
            <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="query">
              <i class="iconfont iconchaxunicon"></i>
              <span>查询</span>
            </button>
          </div>
        </div>
      </div>
      <div class="oper-top flex">

        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="importXSL" v-has="'import'">
            <span>导入日记账</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="dele" v-has="'delete'">
            <span>删除导入</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="intellect" v-has="'ai'">
            <span>智能匹配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="artificialChange" v-has="'people'">
            <span>人工分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="revocation" v-has="'revoke'"
                  :disabled="oneList.collateState == 1">
            <span>撤销分配</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="goMoney" v-has="'clima'">
            <span>资金认领核销</span>
          </button>
        </div>
        <div class="db ml5">
          <button class="mr10 ivu-btn ivu-btn-default" type="button" @click="openChangeModal" v-has="'change'">
            <span>修改</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 导入模板弹窗组件-->
    <importXLS :URL="impirtUrl" ref="imp" @getNewList="getNew"></importXLS>

    <!--    人工智能分配-->
    <artificial ref="art" :list="oneList" @getNew='getNewList'></artificial>

    <!--    余额展示-->
    <amtData :moneyList='allMoneyList'></amtData>

    <!--    修改-->
    <changeJournal :list='oneList' ref="changeModal" @getNewList="allList"></changeJournal>

    <div class="mt15">
      <Tabs type="card" value="capitalChain5" @on-click="clearSelectTabelList">
        <TabPane label="全部数据" name="capitalChain1">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-hover-row
              stripe
              ref="xTable1"
              align="center"
              max-height="400"
              size="mini"
              style="width: 3000px"
              :data="tableData"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="importTime" title="导入时间"></vxe-table-column>
              <vxe-table-column field="area" title="所属区域"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
              <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
              <vxe-table-column field="accountName" title="账户"></vxe-table-column>
              <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
              <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
              <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
              <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
              <vxe-table-column field="openingBalance" title="期初余额"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="期末余额"></vxe-table-column>
              <vxe-table-column field="reciprocalAccountName" title="对方户名"></vxe-table-column>
              <vxe-table-column field="checkAccount" title="对账账号"></vxe-table-column>
              <vxe-table-column field="reciprocalBankName" title="对方开户行"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="已核销" name="capitalChain2">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-hover-row
              stripe
              ref="xTable2"
              align="center"
              max-height="400"
              size="mini"
              style="width: 3000px"
              :data="tableData1"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="importTime" title="导入时间"></vxe-table-column>
              <vxe-table-column field="area" title="所属区域"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
              <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
              <vxe-table-column field="accountName" title="账户"></vxe-table-column>
              <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
              <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
              <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
              <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
              <vxe-table-column field="openingBalance" title="期初余额"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="期末余额"></vxe-table-column>
              <vxe-table-column field="reciprocalAccountName" title="对方户名"></vxe-table-column>
              <vxe-table-column field="checkAccount" title="对账账号"></vxe-table-column>
              <vxe-table-column field="reciprocalBankName" title="对方开户行"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="未核销" name="capitalChain3">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-hover-row
              stripe
              ref="xTable3"
              align="center"
              max-height="400"
              size="mini"
              style="width: 3000px"
              :data="tableData2"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="importTime" title="导入时间"></vxe-table-column>
              <vxe-table-column field="area" title="所属区域"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
              <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
              <vxe-table-column field="accountName" title="账户"></vxe-table-column>
              <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
              <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
              <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
              <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
              <vxe-table-column field="openingBalance" title="期初余额"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="期末余额"></vxe-table-column>
              <vxe-table-column field="reciprocalAccountName" title="对方户名"></vxe-table-column>
              <vxe-table-column field="checkAccount" title="对账账号"></vxe-table-column>
              <vxe-table-column field="reciprocalBankName" title="对方开户行"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="已认领" name="capitalChain4">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              highlight-hover-row
              stripe
              ref="xTable4"
              align="center"
              max-height="400"
              size="mini"
              style="width: 3000px"
              :data="tableData3"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="importTime" title="导入时间"></vxe-table-column>
              <vxe-table-column field="area" title="所属区域"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
              <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
              <vxe-table-column field="accountName" title="账户"></vxe-table-column>
              <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
              <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
              <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
              <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
              <vxe-table-column field="openingBalance" title="期初余额"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="期末余额"></vxe-table-column>
              <vxe-table-column field="reciprocalAccountName" title="对方户名"></vxe-table-column>
              <vxe-table-column field="checkAccount" title="对账账号"></vxe-table-column>
              <vxe-table-column field="reciprocalBankName" title="对方开户行"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="未认领" name="capitalChain5">
          <div style="overflow: hidden ;overflow-x: scroll">
            <vxe-table
              border
              show-footer
              show-overflow
              stripe
              ref="xTable5"
              align="center"
              max-height="400"
              size="mini"
              style="width: 3000px"
              highlight-hover-row
              :data="tableData4"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="importTime" title="导入时间"></vxe-table-column>
              <vxe-table-column field="area" title="所属区域"></vxe-table-column>
              <vxe-table-column field="shopName" title="所属门店"></vxe-table-column>
              <vxe-table-column field="shopCode" title="所属店号"></vxe-table-column>
              <vxe-table-column field="accountName" title="账户"></vxe-table-column>
              <vxe-table-column field="accountCode" title="账号"></vxe-table-column>
              <vxe-table-column field="bankName" title="开户行"></vxe-table-column>
              <vxe-table-column field="mateAccountName" title="对应科目"></vxe-table-column>
              <vxe-table-column field="createTime" title="发生日期"></vxe-table-column>
              <vxe-table-column field="openingBalance" title="期初余额"></vxe-table-column>
              <vxe-table-column field="incomeMoney" title="收入金额"></vxe-table-column>
              <vxe-table-column field="paidMoney" title="支出金额"></vxe-table-column>
              <vxe-table-column field="balanceMoney" title="期末余额"></vxe-table-column>
              <vxe-table-column field="reciprocalAccountName" title="对方户名"></vxe-table-column>
              <vxe-table-column field="checkAccount" title="对账账号"></vxe-table-column>
              <vxe-table-column field="reciprocalBankName" title="对方开户行"></vxe-table-column>
              <vxe-table-column field="tradingNote" title="交易备注"></vxe-table-column>
              <vxe-table-column field="businessType" title="业务类别"></vxe-table-column>
              <vxe-table-column field="leadHandler" title="导入经办人"></vxe-table-column>
              <vxe-table-column field="claimShopCode" title="认领店号"></vxe-table-column>
              <vxe-table-column field="claimShopName" title="认领门店"></vxe-table-column>
              <vxe-table-column field="certificate" title="凭证摘要"></vxe-table-column>
              <vxe-table-column field="cancelPerson" title="认领核销人"></vxe-table-column>
              <vxe-table-column field="statementNumber" title="核销对账单号"></vxe-table-column>
              <vxe-table-column field="suppliers" title="往来单位"></vxe-table-column>
              <vxe-table-column field="claimNote" title="认领备注"></vxe-table-column>
              <vxe-table-column field="claimType" title="是否认领">
                <template v-slot="{row}">
                  {{row.claimType ? '是':'否'}}
                </template>
              </vxe-table-column>
              <vxe-table-column field="accountingExaminer" title="会计审核人"></vxe-table-column>
              <vxe-table-column field="checkTime" title="审核时间"></vxe-table-column>
              <vxe-table-column field="proofWords" title="凭证字"></vxe-table-column>
              <vxe-table-column field="proofCode" title="凭证号"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
      </Tabs>

    </div>
    <div class="clearfix" style="background-color:#fff;">
      <Page
        class-name="page-con fr pt10 mr20"
        show-total
        show-sizer
        size="small"
        :total='page.total'
        :current="page.num"
        :page-size="page.size"
        :page-size-opts="page.opts"
        @on-page-size-change="changePageSize"
        @on-change="changePageNum"
      />
    </div>
  </div>
</template>

<script>
  import quickDate from "@/components/getDate/dateget_bill.vue";
  import {creat} from '../../components'
  import importXLS from '@/view/settlementManagement/components/importXLS'
  import artificial from '../../components/artificial'
  import {are, impUrl, goList, deleList, revocation, ait} from '@/api/settlementManagement/fundsManagement/capitalChain'
  import {getTableList} from '@/api/accountant/accountant'
  import {goshop, getAccShopList} from "@/api/settlementManagement/shopList";
  import amtData from '../../components/amtData'
  import changeJournal from '../components/changeJournal'
  import {findGuest} from "_api/settlementManagement/advanceCollection.js";


  import moment from 'moment'

  export default {
    name: 'shopJournal',
    components: {
      quickDate,
      importXLS,
      artificial,
      amtData,
      changeJournal
    },
    data() {
      return {
        remoteloading: false,
        company: [], //往来单位下拉框
        accountName: '',//账号
        bankName: '',//开户银行
        value: [],
        Branchstore: [
          {id: 0, companyName: '全部'}
        ],
        model1: 0, //获取到地址id
        shopCode: 0,//获取到门店id
        shopList: [], //门店列表
        subjectCode: 0,//科目id
        subJectList: [
          {id: 0, titleName: '全部'}
        ],//科目列表
        // company: "", //往来单位
        companyId: "", //往来单位id
        formInline: {},//统计数据
        tableData: [],//全部数据
        tableData1: [],//已审核数据
        tableData2: [],//未审核数据
        tableData3: [],//已认领数据
        tableData4: [],//未认领数据
        impirtUrl: {
          downId: '1600000000',
          upUrl: impUrl
        },//下载上传路径
        oneList: {},//点击获取到的信息
        allMoneyList: {},//获取到所有余额信息
        canQuickDateList: false,//判断是否可以查询

        //新增字段
        accountMoney: '',//金额查询参数
        claimShopName: '',//认领门店查询参数
        suppliers: '',//往来单位
        accountCode: '',//账号
        getAccShopList: [
          {shopCode: '-1' ,shopName:'请选择'}
        ],
        selectTableList: [],//勾选的表格数据
        page: {
          opts: [100, 300, 500, 800, 1000],
          num: 1,
          total: 0,
          size: 100
        },
        mateAccountCode:'',//对应科目
        options:[]
      };
    },
    async mounted() {
      let arr = await creat(this.$refs.quickDate.val, this.$store)
      this.value = arr[0]
      this.$nextTick(() => {
        this.shopCode = arr[1]
      })
      this.getAllAre() //获取区域
      this.getThisArea()
      this.getTreeListFun()//获取科目
    },
    computed: {
      selectShopList() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.isMaster ? true : false
        } else {
          return true
        }
      },
      selectShopCode() {
        if (this.$store.state.user.userData.currentCompany != null) {
          return this.$store.state.user.userData.currentCompany.code || ""
        } else {
          return ""
        }
      }
    },
    methods: {

      //分页切换
      changePageNum(p) {
        this.page.num = p;
        this.getList();
      },

      //分页切换条数
      changePageSize(size) {
        this.page.num = 1;
        this.page.size = size;
        this.getList();
      },

      // 往来单位选择
      async getOne(query) {
        this.company = [];
        if (query != "") {
          this.remoteloading = true;
          findGuest({fullName: query, size: 20}).then(res => {
            if (res.code === 0) {
              this.company = [];
              res.data.content.map(item => {
                this.company.push({
                  value: item.id,
                  label: item.fullName
                });
              });
              this.remoteloading = false;
            }
          });
        } else {
          this.company = [];
        }
      },
      //获取全部地址
      async getAllAre() {
        let res = await are()
        if (res.code === 0) {
          this.Branchstore = [...this.Branchstore, ...res.data]
          this.setAreaDef();
          return this.Branchstore;
        }
      },
      //当前非管理员状态情况下获取门店地址
      async getThisArea() {
        // let arr = this.shopList.filter( item=> item.id == this.shopCode)
        // this.model1 = arr[0].supplierTypeSecond
        let data = {}
        data.supplierTypeSecond = this.model1
        this.shopList = [{id: 0, name: '全部'}]
        let rep = await getAccShopList();
        if (rep.code == 0) {
          this.getAccShopList = rep.data
        }
        let res = await goshop(data)
        if (res.code === 0) {
          this.shopList = [...this.shopList, ...res.data]
          this.setAreaDef();
        }
      },

      setAreaDef() {
        if (this.Branchstore.length > 0) {
          this.Branchstore.map(item => {
            this.shopList.map(item2 => {
              if (this.selectShopList) {
                if (item.parentId == item2.supplierTypeFirst && item.id == item2.supplierTypeSecond) {
                  this.model1 = item.id
                }
              } else {
                this.model1 = 0
              }
            })
          })
        }
      },

      // //切换地址重新调取门店接口
      changeArea() {
        if (this.$store.state.user.userData.shopkeeper == 0) {
          this.shopCode = 0
          this.getShop()
        }
      },
      //获取门店
      // async getShop(){
      //   let data ={}
      //   data.supplierTypeSecond = this.model1
      //   this.shopList = [{id:0 , name:'全部'}]
      //   let res = await goshop(data)
      //   if (res.code === 0) {
      //     this.shopList = [...this.shopList , ...res.data]
      //   }
      // },
      // async getShop() {
      //   let data = {};
      //   let res = await goshop(data);
      //   if (res.code === 0)
      //     return (this.shopList = [...this.shopList, ...res.data]);
      // },
      //获取科目
      // async getSubject() {
      //   let data = {}
      //   data.parentCode = 101
      //   let res = await getTableList(data)
      //   if (res.code === 0) return this.subJectList = [...this.subJectList, ...res.data]
      // },
      //获取科目
      async getTreeListFun() {
        let rep2 = await getTableList({parentCode: 101})
        if (rep2.code == 0) {
          let content = rep2.data || [];
          this.options = this.treeDataFun(content)
        }
      },
      treeDataFun(content) {
        let level1 = content.filter(item => item.titleLevel === 1 && (item.titleCode == '1001' || item.titleCode == '1002' || item.titleCode == '1012'));
        return this.treeFilterData(level1, content);
      },
      treeFilterData(treeData, content) {
        treeData.map(item => {
          let arrData = content.filter(item1 => item1.parentCode == item.titleCode);
          if (arrData.length > 0) {
            item.children = this.treeFilterData(arrData, content)
          } else {
            item.children = null
          }
        })
        return treeData
      },
      getKemuList(v) {
        if (v.length == 0) {
          return this.subjectCode = []
        }
        let req = []
        v.map(item => {
          if (item.length > 0) {
            let end = item.slice(-1)
            req.push(end.join(''))
          }
        })
        this.subjectCode = req
      },
      // 日期选择
      dateChange(data) {
        this.value = data
      },
      // 快速查询
      quickDate(data) {
        this.value = data
        if (this.canQuickDateList) {
          this.getList()
        } else {
          this.canQuickDateList = !this.canQuickDateList
        }
      },
      selectAllEvent({selection}) {
        this.selectTableList = selection;
      },

      selectChangeEvent({selection}) {
        this.selectTableList = selection;
      },

      selectChangeTable(v) {
        this.$refs.xTable1.getCheckboxRecords()
      },

      //获取表格信息
      async getList() {
        let data = {}
        data.page = this.page.num - 1
        data.size = this.page.size
        data.startTime = this.value[0] ? moment(this.value[0]).format("YYYY-MM-DD") : ''
        data.endTime = this.value[1] ? moment(this.value[1]).format("YYYY-MM-DD") : ''

        if (this.model1 != 0) {
          data.areaId = this.model1
        }
        if (this.selectShopList) {
          data.shopNumber = this.shopCode
        }

        if (this.selectShopCode) {
          data.claimShopCode = this.selectShopCode
        }

        if (this.subjectCode) {
          data.subjectId = this.subjectCode
        }
        data.accountName = this.accountName
        data.bankName = this.bankName

        data.suppliers = this.suppliers;
        data.claimShopName = this.claimShopName;
        data.accountMoney = this.accountMoney;
        data.accountCode = this.accountCode;
        this.allMoneyList = {}
        let res = await goList(data)
        if (res.code === 0) {
          if (res.data.content.length > 0) {
            this.allMoneyList = res.data.content[0].moneyList
          }
          this.page.total = res.data.totalElements;
          this.tableData = res.data.content
          this.tableData1 = []
          this.tableData2 = []
          this.tableData3 = []
          this.tableData4 = []
          res.data.content.forEach(item => {
            if (item.collateState) {
              this.tableData1.push(item)
            } else {
              this.tableData2.push(item)
            }
            if (item.claimType) {
              this.tableData3.push(item)
            } else {
              this.tableData4.push(item)
            }
          })
        }
      },

      //查询
      query() {
        this.getList()
      },

      //点击获取表格数据
      getOneList(val) {
        this.oneList = val.row
      },


      //修改模态框
      openChangeModal() {
        if (this.selectTableList.length == 0 || this.selectTableList.length > 1) {
          return this.$Message.error('请选择一条数据')
        }
        this.oneList = this.selectTableList[0];
        console.log(this.oneList)
        // if (Object.keys(this.oneList).length < 1 ) return this.$Message.error('请至少选择一条数据')
        if (this.oneList.collateState == 1) return this.$Message.error('只能修改未核销数据')
        // this.$refs.changeModal.formCustom = this.selectTableList[0]
        this.$refs.changeModal.open()
      },

      //修改成功后刷新页面
      allList() {
        this.getList()
      },


      //打开导入模板下载
      importXSL() {
        this.$refs.imp.openModal()
      },

      //导入成功后刷新页
      getNew(data) {
      },

      //人工分配成功后刷新
      getNewList() {
        this.getList()
      },


      //删除导入
      dele() {
        if (this.selectTableList.length == 0) {
          return this.$Message.error('请至少选择一条数据');
        }
        //if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        let filterCollateState = this.selectTableList.filter(item => item.collateState);
        if (filterCollateState.length > 0) return this.$Message.error('已核销数据不能删除');
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否删除该条数据</p>',
          onOk: async () => {
            let data = {}
            data.id = this.selectTableList.map(item => item.id).join(',');
            let res = await deleList(data)
            if (res.code === 0) {
              this.getList()
              this.$Message.success(res.message)
            }
          },
          onCancel: () => {
          }
        });
      },

      //智能匹配
      intellect() {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否执行智能匹配</p>',
          onOk: async () => {
            let res = await ait()
            if (res.code === 0) {
              this.$XModal.alert({
                title: '提示',
                message: res.data,
                status: 'success',
              })
              this.getList()
            }
          },
          onCancel: () => {
          }
        })


      },

      //人工匹配
      artificialChange() {
        if (this.selectTableList.length == 0 || this.selectTableList.length > 1) {
          return this.$Message.error('请选择一条数据')
        }
        this.oneList = this.selectTableList[0];
        //if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        if (this.oneList.allocation) return this.$Message.error('数据已分配')
        this.$refs.art.openModal()
      },

      //撤销分配
      revocation() {
        if (this.selectTableList.length == 0 || this.selectTableList.length > 1) {
          return this.$Message.error('请选择一条数据')
        }
        this.oneList = this.selectTableList[0];
        //if(Object.keys(this.oneList).length == 0) return this.$Message.error('请至少选择一条数据')
        if (!this.oneList.allocation) return this.$Message.error('请选择已分配的数据')
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否撤回分配</p>',
          onOk: async () => {
            let data = {}
            data.id = this.oneList.id
            let res = await revocation([this.oneList.id])
            if (res.code === 0) {
              this.$Message.success('撤销分配成功')
              this.getList()
            }
          }
        })


      },

      //资金认领核销
      goMoney() {
        this.$router.push({name: "claimWrite"})
      },
      clearSelectTabelList() {
        for (let i = 1; i < 6; i++) {
          this.$refs[`xTable${i}`].clearCheckboxRow()
        }
        this.oneList = {};
        this.selectTableList = [];
      }

    }
  };
</script>

<style lang="less" scoped>
  .oper-top input {
    border: 1px solid #dddddd;
    text-indent: 4px;
  }

  .oper-top .input {
    position: relative;
    left: -26px;
    bottom: -5px;
  }

  .pro span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .inner-box {
    overflow-x: scroll;
  }

</style>

<template>
<Modal v-model="credentShow" width="1200" title="修改凭证" @on-visible-change="showOrHide">
  <div class="bigBox">
    <section class="oper-box">
      <div class="oper-top flex mt10">
        <div class="wlf">
          <div class="db">
            <!-- <Button type="warning" class="mr10" @click="Save" v-has="'save'">
              <Icon custom="iconfont icons"/>
              保存
            </Button> -->
            <!-- <Button type="warning" class="mr10" @click="Audit" v-has="'audit'">
              <Icon custom="iconfont icons"/>
              审核
            </Button>
            <Button type="warning" class="mr10" @click="cancellation" v-has="'cancellation'">
              <Icon custom="iconfont icons"/>
              作废
            </Button> -->
            <!--<Button type="warning" class="mr10" @click="template"><Icon custom="iconfont icons"/>保存成模板</Button>-->
          </div>
        </div>
      </div>
      <div class="flex header">
        <Form
          :model="formPlan"
          ref="formPlan"
          :rules="ruleValidate"
          inline
          :label-width="85"
          class="formBox"
        >
          <FormItem label="凭证内码：">
            <Input v-model="formPlan.INS" style="width: 150px" disabled/>
          </FormItem>
          <FormItem label="业务日期：" prop="BusinessDate">
            <DatePicker style="width: 150px" type="datetime" v-model="formPlan.BusinessDate" @on-change="changeBuessinessDate" disabled></DatePicker>
          </FormItem>
          <FormItem label="审核日期：" prop="voucherTime">
            <DatePicker style="width: 150px" type="datetime" @on-change="changevoucherTime" format="yyyy-MM-dd" v-model="formPlan.voucherTime"></DatePicker>
          </FormItem>
          <FormItem label="年月期间：">
            <div class="flex">
              <Input v-model="formPlan.period" style="width: 100px" class="mr5" disabled/>
              <Select v-model="formPlan.ji" style="width:50px" class="mr5">
                <Option
                  v-for="item in formPlan.cityList"
                  :value="item.itemName"
                  :key="item.id"
                >{{ item.itemName }}
                </Option>
              </Select>
              <Input v-model="formPlan.perioda" style="width: 50px" disabled/>
            </div>
          </FormItem>
          <FormItem label="业务单号：">
            <Input v-model="formPlan.businessNumber" style="width: 150px" disabled/>
          </FormItem>
          <FormItem label="结算单号：">
            <Input v-model="formPlan.StatementNumber" style="width: 150px" disabled/>
          </FormItem>
          <FormItem label="业务类型：">
            <Select v-model="formPlan.businessType" style="width:150px" @on-change="BusinessTypeC">
              <Option
                v-for="item in formPlan.businessTypes"
                :value="item.itemName"
                :key="item.id"
              >{{ item.itemName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="备注：">
            <Input v-model="formPlan.remark" style="width: 150px"/>
          </FormItem>
          <FormItem>
            <Button class="w90" @click="OpenFilesModal">上传单据</Button>
            <div class="changeDiv">
              <ul style="display: flex">
                <li
                  v-for="(item,index) in FileListArr"
                  :key="index"
                  style="list-style: none;margin-left: 10px"
                >
                  <a class="download" target="view__blank" :href="item.filePath">{{ item.fileName }}</a>
                </li>
              </ul>
            </div>
          </FormItem>
        </Form>
      </div>
      <Modal
        v-model="uploadFiles"
        title="上传附件"
        width="500px"
        @on-visible-change="visOpen"
        @on-cancel="cancel"
      >
        <Form :label-width="80" class="ModalBox">
          <FormItem label="附件：">
            <Upload
              style="float: left;line-height: 29px;margin-left: 10px"
              ref="upload"
              multiple
              :max-size="3072"
              :action="wxImgUrl"
              :format="['jpg','jpeg','png','xlsx', 'xls']"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-remove="RemoveFile"
              :on-exceeded-size="BigVerify"
            >
              <Button class="uploadbtn mr5">上传</Button>
              <Input v-model="FileName" style="width: 250px"/>
            </Upload>
          </FormItem>
          <div>
            <p class="bottomZI">单个附件大小，不能超过3M</p>
          </div>
        </Form>
      </Modal>
    </section>
    <section class="con-box mt10">
      <Button type="warning" class="w90" @click="insertEventLast()" style="margin-left: 5px">添加行</Button>
      <Button type="warning" class="w90 ml10" @click="Save">保存</Button>
      <div class="mt10">
        <vxe-table
          id="changeV"
          border
          resizable
          ref="xTable"
          show-footer
          :footer-method="addFooter"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          stripe
          size="mini"
          align="center"
          :auto-resize="true"
          highlight-hover-row
          highlight-current-row
          show-overflow
          :edit-rules="validRules"
          @radio-change="selectOne"
        >
          <vxe-table-column title="操作">
            <template v-slot="{ row , rowIndex}">
              <template>
                <vxe-button @click="insertEvent(row,rowIndex)">添加行</vxe-button>
                <vxe-button @click="removeEvent(row)">删除行</vxe-button>
              </template>
            </template>
          </vxe-table-column>
          <vxe-table-column title="分录号" width="60">
            <template v-slot="{rowIndex}">
              <span>{{rowIndex + 1}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="摘要">
            <template v-slot="{row}">
              <Input type="text" v-model="row.summary"/>
            </template>
          </vxe-table-column>
          <vxe-table-column title="会计科目" field="subjectName">
            <template v-slot="{row}">
              <Input type="text" v-model="row.subjectName" @on-focus="open(row)"/>
            </template>
          </vxe-table-column>
          <vxe-table-column title="辅助核算">
            <template v-slot="{row}">
              <Input type="text" v-model="row.auxiliaryName" @on-focus="openassist(row)"/>
            </template>
          </vxe-table-column>
          <vxe-table-column field="paymentTypeCode" title="款项分类">
            <template v-slot="{row}">
              <Input type="text" v-model="row.paymentTypeCode" disabled/>
            </template>
          </vxe-table-column>
          <vxe-table-column field="debitAmount" width="100" title="借方金额" :edit-render="{type: 'default'}">
            <template v-slot:edit="{ row }">
              <InputNumber
                v-model="row.debitAmount"
                :formatter="value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              ></InputNumber>
            </template>
            <template v-slot="{ row }">{{ thousands(row.debitAmount)  }}</template>
          </vxe-table-column>
          <vxe-table-column field="lenderAmount" width="100" title="贷方金额" :edit-render="{type: 'default'}">
            <template v-slot:edit="{row}">
              <InputNumber
                v-model="row.lenderAmount"
                :formatter="value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              ></InputNumber>
              <!--              /\B(?=(\d{3})+(?!\d))/g, ','-->
            </template>
            <template v-slot="{ row }">{{ thousands(row.lenderAmount) }}</template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <!--<Page size="small" :total="page.total" :page-size="page.size" :current="page.num"   :page-size-opts="page.sizeOpts"-->
      <!--show-sizer show-total  show-elevator  @on-change="selectNum" @on-page-size-change="selectPage"-->
      <!--style="float: right;margin-top: 10px;margin-right: 10px"/>-->
    </section>
    <!--选择会计科目-->
    <Modal v-model="subjectModelShow" title="选择会计科目" width="750">
      <Form v-model="accountingSubject">
        <Tabs type="card" :animated="false" @on-click="tabCode" v-model="tabModal">
          <div class="partCheck-hd" style="position: absolute;right:0;top:0;">
            <Input class="w200 mr10" v-model="subjectModel" placeholder="请输入科目"/>
            <Button @click="search" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
          </div>
          <TabPane label="资产"  name="active1">
            <div>
              <vxe-table
                border
                resizable
                :data="subjectTableDataZiChan"
                stripe
                size="mini"
                align="center"
                :auto-resize="true"
                @radio-change="radioChangeEventAsset"
                :radio-config="{checkMethod}"
                highlight-hover-row
                highlight-current-row
                show-overflow
                height="500"
              >
                <vxe-table-column type="radio" title="选择"></vxe-table-column>
                <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
                <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
                <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
              </vxe-table>
            </div>
          </TabPane>
          <TabPane label="负债"  name="active2">
            <vxe-table
              border
              resizable
              :data="subjectTableDataFuZhai"
              stripe
              size="mini"
              align="center"
              :auto-resize="true"
              @radio-change="radioChangeEventLiabilities"
              :radio-config="{checkMethod}"
              highlight-hover-row
              highlight-current-row
              show-overflow
              height="500"
            >
              <vxe-table-column type="radio" title="选择"></vxe-table-column>
              <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
              <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
              <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            </vxe-table>
          </TabPane>
          <TabPane label="共同"  name="active3">
            <vxe-table
              border
              resizable
              :data="subjectTableDataGongTong"
              stripe
              size="mini"
              align="center"
              :auto-resize="true"
              @radio-change="radioChangeEventCommon"
              :radio-config="{checkMethod}"
              highlight-hover-row
              highlight-current-row
              show-overflow
              height="500"
            >
              <vxe-table-column type="radio" title="选择"></vxe-table-column>
              <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
              <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
              <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            </vxe-table>
          </TabPane>
          <TabPane label="权益"  name="active4">
            <vxe-table
              border
              resizable
              :data="subjectTableDataQuanYi"
              stripe
              size="mini"
              align="center"
              :auto-resize="true"
              @radio-change="radioChangeEventEquity"
              :radio-config="{checkMethod}"
              highlight-hover-row
              highlight-current-row
              show-overflow
              height="500"
            >
              <vxe-table-column type="radio" title="选择"></vxe-table-column>
              <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
              <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
              <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            </vxe-table>
          </TabPane>
          <TabPane label="成本"  name="active5">
            <vxe-table
              border
              resizable
              :data="subjectTableDataChengBen"
              stripe
              size="mini"
              align="center"
              :auto-resize="true"
              @radio-change="radioChangeEventCost"
              :radio-config="{checkMethod}"
              highlight-hover-row
              highlight-current-row
              show-overflow
              height="500"
            >
              <vxe-table-column type="radio" title="选择"></vxe-table-column>
              <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
              <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
              <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            </vxe-table>
          </TabPane>
          <TabPane label="损益"  name="active6">
            <vxe-table
              border
              resizable
              :data="subjectTableDataSunYi"
              stripe
              size="mini"
              align="center"
              :auto-resize="true"
              @radio-change="radioChangeEventProfit"
              :radio-config="{checkMethod}"
              highlight-hover-row
              highlight-current-row
              show-overflow
              height="500"
            >
              <vxe-table-column type="radio" title="选择"></vxe-table-column>
              <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
              <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
              <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            </vxe-table>
          </TabPane>
        </Tabs>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="SubjectConfirm" class="mr10">保存</Button>
        <Button type="default" @click="subjectModelShow = false">取消</Button>
      </div>
    </Modal>
    <!--选择辅助核算-->
    <Modal v-model="subjectModelShowassist" title="选择辅助核算" width="750" @on-ok="confirmFuzhu">
      <Form :value="AssistAccounting">
        <Tabs type="card">
          <TabPane label="客户" name="client">
            <div>
              <div>
                <Form inline :label-width="50" class="formBox">
                  <FormItem label="客户：">
                    <Input
                      v-model="FullNameOrCode"
                      style="width: 200px"
                      placeholder="客户编码或简称、全称"
                      class="mr10"
                    />
                    <Checkbox v-model="dealings">内部往来</Checkbox>
                    <Button type="warning" class="mr10" @click="searchClient">查询</Button>
                  </FormItem>
                </Form>
              </div>
              <div>
                <vxe-table
                  border
                  resizable
                  :data="AssistTableDataKeHu"
                  stripe
                  size="mini"
                  align="center"
                  :auto-resize="true"
                  @radio-change="radioChangeEventClient"
                  highlight-hover-row
                  highlight-current-row
                  show-overflow
                  height="500"
                >
                  <vxe-table-column type="radio" title="选择"></vxe-table-column>
                  <vxe-table-column field="code" title="客户编码"></vxe-table-column>
                  <vxe-table-column field="shortName" title="客户简称"></vxe-table-column>
                  <vxe-table-column field="fullName" title="客户全称"></vxe-table-column>
                </vxe-table>
              </div>
              <div>
                <Page
                  size="small"
                  :total="client.page.total"
                  :page-size="client.page.size"
                  :current="client.page.num"
                  :page-size-opts="client.page.sizeOpts"
                  show-sizer
                  show-total
                  show-elevator
                  @on-change="selectNumClient"
                  @on-page-size-change="selectPageClient"
                  style="float: right;margin-top: 10px;margin-right: 10px"
                />
              </div>
            </div>
          </TabPane>
          <TabPane label="供应商" name="supplier">
            <div>
              <div>
                <Form inline :label-width="70" class="formBox">
                  <FormItem label="供应商：">
                    <Input
                      v-model="SupperlierNameOrCode"
                      style="width: 200px"
                      placeholder="供应商编码或简称、全称"
                      class="mr10"
                    />
                    <Checkbox v-model="dealings">内部往来</Checkbox>
                    <Button type="warning" class="mr10" @click="searchSupperlier">查询</Button>
                  </FormItem>
                </Form>
              </div>
              <div>
                <vxe-table
                  border
                  resizable
                  :data="AssistTableDataGongYingShang"
                  stripe
                  size="mini"
                  align="center"
                  :auto-resize="true"
                  @radio-change="radioChangeEventSupplier"
                  highlight-hover-row
                  highlight-current-row
                  show-overflow
                  height="500"
                >
                  <vxe-table-column type="radio" title="选择"></vxe-table-column>
                  <vxe-table-column field="code" title="客户编码"></vxe-table-column>
                  <vxe-table-column field="shortName" title="客户简称"></vxe-table-column>
                  <vxe-table-column field="fullName" title="客户全称"></vxe-table-column>
                </vxe-table>
              </div>
              <div>
                <Page
                  size="small"
                  :total="supplier.page.total"
                  :page-size="supplier.page.size"
                  :current="supplier.page.num"
                  :page-size-opts="supplier.page.sizeOpts"
                  show-sizer
                  show-total
                  show-elevator
                  @on-change="selectNumsupplier"
                  @on-page-size-change="selectPagesupplier"
                  style="float: right;margin-top: 10px;margin-right: 10px"
                />
              </div>
            </div>
          </TabPane>
          <TabPane label="部门" name="department">
            <Form :label-width="50" ref="form">
              <FormItem label="部门:" prop="groundIds">
                <Cascader
                  :data="list"
                  v-model="groundIds"
                  placeholder="选择部门"
                  style="width: 250px"
                  change-on-select
                  :props="{  children: 'childs',label:'name',value:'id' }"
                  @on-change="ListChange"
                ></Cascader>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="个人" name="personage">
            <Form :label-width="50" ref="form" inline>
              <FormItem label="姓名:">
                <!--                <Cascader :data="list" v-model="groundIds" placeholder="营销中心" style="width: 250px"></Cascader>-->
                <Input v-model="personageName" placeholder="姓名" style="width: 150px" />
              </FormItem>
              <FormItem>
                <Button type="warning" class="mr10" @click="SearchPersonal">查询</Button>
              </FormItem>
            </Form>
            <div>
              <vxe-table
                border
                resizable
                :data="AssistTableDataGeRen"
                stripe
                size="mini"
                align="center"
                :auto-resize="true"
                @radio-change="radioChangeEventPersonage"
                highlight-hover-row
                highlight-current-row
                show-overflow
                height="465"
              >
                <vxe-table-column type="radio" title="选择"></vxe-table-column>
                <vxe-table-column field="userName" title="姓名"></vxe-table-column>
                <vxe-table-column field="phone" title="手机号"></vxe-table-column>
                <vxe-table-column field="groupName" title="所属部门"></vxe-table-column>
              </vxe-table>
            </div>
            <div>
              <Page
                size="small"
                :total="personage.page.total"
                :page-size="personage.page.size"
                :current="personage.page.num"
                :page-size-opts="personage.page.sizeOpts"
                show-sizer
                show-total
                show-elevator
                @on-change="selectNumpersonage"
                @on-page-size-change="selectPagepersonage"
                style="float: right;margin-top: 10px;margin-right: 10px"
              />
            </div>
          </TabPane>
          <TabPane label="其他辅助核算" name="Other">
            <div class="Other">
              <div class="OtherLeft">
                <ul>
                  <li
                    v-for="(item,index) in categoryArr"
                    :key="index"
                    style="height: 35px"
                    class="LiClass"
                    @click="LiClick(item,index)"
                    :class="[selectClass !== index ? 'weixuan':'xuan']"
                  >{{ item.dictName }}
                  </li>
                </ul>
              </div>
              <div class="OtherRight">
                <div>
                  <span class="ml20">名称：</span>
                  <Input
                    v-model="accountingName"
                    style="width: 150px"
                    placeholder="核算名称"
                    class="mr10"
                  />
                  <Button type="warning" class="mr10" @click="OtherClick">查询</Button>
                  <Button type="warning" class="mr10" @click="ShowOtherAdd">新增</Button>
                </div>
                <div>
                  <vxe-table
                    border
                    resizable
                    :data="AssistTableDataOther"
                    stripe
                    size="mini"
                    align="center"
                    :auto-resize="true"
                    @radio-change="radioChangeEventOther"
                    highlight-hover-row
                    highlight-current-row
                    show-overflow
                    height="500"
                    style="margin-top: 10px;margin-left: 10px"
                  >
                    <vxe-table-column type="radio" title="选择"></vxe-table-column>
                    <vxe-table-column field="itemCode" title="编码"></vxe-table-column>
                    <vxe-table-column field="itemName" title="核算全称"></vxe-table-column>
                  </vxe-table>
                </div>
                <div v-show="this.dictName == '外部员工'">
                  <Page
                    size="small"
                    :total="outStaff.page.total"
                    :page-size="outStaff.page.size"
                    :current="outStaff.page.num"
                    :page-size-opts="outStaff.page.sizeOpts"
                    show-sizer
                    show-total
                    show-elevator
                    @on-change="selectoutStaffPage"
                    @on-page-size-change="selectoutStaffSize"
                    style="float: right;margin-top: 10px;margin-right: 10px"
                  />
                </div>
                <!--<div>-->
                <!--<Page size="small" :total="Other.page.total" :page-size="Other.page.size" :current="Other.page.num"   :page-size-opts="Other.page.sizeOpts"-->
                <!--show-sizer show-total  show-elevator  @on-change="selectNumOther" @on-page-size-change="selectPageOther"-->
                <!--style="float: right;margin-top: 10px;margin-right: 10px"/>-->
                <!--</div>-->
                <div>
                  <!--其他辅助核算弹框里新增弹框-->
                  <Modal v-model="OtherModalAdd" title="新增辅助核算名称" width="400">
                    <div>
                      <div style="height: 30px">所属辅助核算：{{ dictName }}</div>
                      <div style="margin: 10px 0">
                        <Form ref="formAdd" :model="formAdd" :rules="ruleformAdd" :label-width="80">
                          <FormItem label="名称：" prop="assistName">
                            <Input
                              v-model="formAdd.assistName"
                              placeholder="请输入名称"
                              style="width: 200px"
                            />
                          </FormItem>
                        </Form>
                      </div>
                    </div>
                    <div slot="footer">
                      <Button type="primary" @click="addAuxiliary" class="mr10">保存</Button>
                      <Button type="default" @click="OtherModalAdd = false">取消</Button>
                    </div>
                  </Modal>
                </div>
                <div>
                  <!--新增/修改外部员工-->
                  <Modal v-model="modalShow" title="新增外部员工" width="460px" :closable="false">
                    <addOutStaff ref="addOutStaff"></addOutStaff>
                    <div slot="footer" style="padding: 10px 0">
                      <Button type="primary" @click="submit">确认</Button>
                      <Button type="default" @click="cancel">退出</Button>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <div class="fund" v-show="Classification">
          <Form
            ref="formDynamic"
            :model="formDynamic"
            :rules="ruleValidateTwo"
            :label-width="80"
            style="width: 300px"
          >
            <FormItem label="款项分类:" prop="fund">
              <Select v-model="formDynamic.fund" placeholder="请选择">
                <Option
                  v-for="item in fundListZanshi"
                  :value="item.itemName"
                  :key="item.id"
                >{{ item.itemName }}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <!-- <div class="fund" v-show="!Classification">
          <Form :label-width="80" style="width: 300px">
            <FormItem label="款项分类:" prop="fund">
              <Select v-model="formDynamic.fund" placeholder="请选择">
                <Option
                  v-for="item in fundListZanshi"
                  :value="item.itemName"
                  :key="item.id"
                >{{ item.itemName }}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div> -->
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmFuzhu" class="mr10">保存</Button>
        <Button type="default" @click="subjectModelShowassist = false">取消</Button>
      </div>
    </Modal>
  </div>
  <div slot="footer">

  </div>
</Modal>
</template>

<script>
  import {currency} from "@/utils/currency";
  import * as tools from "@/utils/tools";
  import * as api from "@/api/lease/customerSM";
  import Cookies from "js-cookie";
  import {TOKEN_KEY} from "@/libs/util";
  import addOutStaff from "@/view/system/systemSetting/outStaffManagement/components/addOutStaff.vue"
  import {
    queryGuestList,
    queryCreditLike,
    queryAllSupplier,
    getcompany,
    getStaffList,
    getDataDictionaryType,
    kmType,
    saveTreeDetailItem,
    getTableList,
    findById,
    BigSave,
    processVoucher,
    downLoding,
    putImgUrl,
    getOutStaffNew,
    addOutStaffeNew,
    addOutStaffe
  } from "@/api/voucherInput/voucherInput";
import { hideLoading, showLoading } from '@/utils/loading';

  export default {
    name: "CredentialsModify",
    components: {
      addOutStaff
    },
    props: ['vercherId','resultObj'],
    data() {
      const subjectNameValid = ({row, cellValue}) => {
        return new Promise((resolve, reject) => {
          if (row.summary && !cellValue) {
            reject(new Error("会计科目必填"));
          } else {
            resolve();
          }
        });
      };
      const AmountValid=({row,cellValue})=>{
        return new Promise((resolve, reject) => {
          if (row.lenderAmount && row.debitAmount) {
            reject(new Error("借方金额、贷方金额只能输入其中一项"));
          } else {
            resolve();
          }
        });
      };
      const debitAmountValid = (rule, value, callback, column) => {
        if (value == column.row.lenderAmount) {
          callback();
        } else {
          callback(new Error("借方金额要等于贷方金额"));
        }
      };
      const lenderAmountValid = (rule, value, callback, column) => {
        if (value == column.row.debitAmount) {
          callback();
        } else {
          callback(new Error("借方金额要等于贷方金额"));
        }
      };
      return {
        currentAccounting: {},//当前选中的会计科目
        dealings: false, //内部往来勾选
        //表单验证
        ruleValidate: {
          BusinessDate: [
            {required: true, type: "date", message: "请选择", trigger: "change"}
          ],
          // businessType: [
          //   {
          //     required: false,
          //     type: "string",
          //     message: "请选择",
          //     trigger: "change"
          //   }
          // ]
        },
        ruleValidateTwo: {
          fund: [
            {
              required: true,
              type: "string",
              message: "请选择",
              trigger: "change"
            }
          ]
        },
        //其他辅助弹框表单验证
        ruleformAdd: {
          assistName: [
            {
              required: true,
              type: "string",
              message: "请选择输入名称",
              trigger: "blur"
            }
          ]
        },
        //表格校验
        validRules: {
          subjectName: [{validator: subjectNameValid}],
          debitAmount: [{ validator: AmountValid }],
          lenderAmount: [{ validator: AmountValid }],
        },
        ID: "", //用于保存id
        formPlan: {
          INS: "", //凭证内码
          BusinessDate: tools.transTime(new Date()), //业务期间
          period: tools.transMonth(new Date()), //年月期间
          perioda: "",
          businessNumber: "", //业务单号
          StatementNumber: "", //结算单号
          businessType: "", //业务类型
          remark: "", //备注
          ji: "记", //记
          cityList: [], //计的下拉框
          businessTypes: []
        },
        LiArr: ["a", "b", "c"],
        subjectModel:"",//会计科目 查询
        tabModal:"active1",
        tabTypeCode:"101",//当前tab页code
        subjectModelShow: false, //会计科目弹框
        subjectModelShowassist: false, //辅助核算弹框
        subjectTableDataZiChan: [], //会计弹框资产
        subjectTableDataFuZhai: [], //会计弹框负债
        subjectTableDataGongTong: [], //会计弹框共同
        subjectTableDataQuanYi: [], //会计弹框权益
        subjectTableDataChengBen: [], //会计弹框成本
        subjectTableDataSunYi: [], //会计弹框损益
        subjectTableData: [],
        AssistTableDataKeHu: [], //辅助弹框客户
        AssistTableDataGongYingShang: [], //辅助弹框供应商
        AssistTableDataGeRen: [], //辅助弹框个人
        AssistTableDataOther: [], //辅助弹框其他
        FullNameOrCode: "", //客户编码或名称、全称
        SupperlierNameOrCode: "", //供应商名称、全称
        accountingName: "", //核算名称
        personageName:"",//辅助核算  个人查询框内容
        list: [], //部门列表
        groundIds: [], //部门
        formDynamic: {
          fund: "" //款项分类
        },
        fundList: [], //款项分类数组
        fundListZanshi: [], //款项分类过滤数组
        page: {
          num: 1,
          size: 1000,
          total: 0,
          sizeOpts: [1000, 2000, 3000, 4000, 5000]
        }, //分页
        tableData: [], //表格数据
        client: {
          page: {
            num: 1,
            size: 100,
            total: 0,
            sizeOpts: [100, 200, 300, 400, 500]
          } //分页
        },
        supplier: {
          page: {
            num: 1,
            size: 100,
            total: 0,
            sizeOpts: [100, 200, 300, 400, 500]
          } //分页
        },
        personage: {
          page: {
            num: 1,
            size: 100,
            total: 0,
            sizeOpts: [100, 200, 300, 400, 500]
          } //分页
        },
        Other: {
          page: {
            num: 1,
            size: 1000,
            total: 0,
            sizeOpts: [1000, 2000, 3000, 4000, 5000]
          } //分页
        }, //其他辅助核算分页
        OtherModalAdd: false, //其他辅助弹框新增弹框状态
        formAdd: {
          assistName: "" //新增辅助核算名称
        },
        categoryArr: [], //类别数组
        dictCode: "CW00111", //用于保存dictCode
        dictName: "长期股权投资", //用于保存dictName
        AssistAccounting: "", //辅助核算弹框绑定值
        addNewAssistAccounting: {}, //修改辅助核算input
        accountingSubject: "", //会计科目绑定的值
        oneAccountent: {}, //获取到的会计科目
        uploadFiles: false,
        FileName: "未选择任何文件", //文件名称
        wxImgUrl: api.wxImgUrl, //图片地址
        headers: {
          Authorization: "Bearer " + Cookies.get(TOKEN_KEY)
        }, //获取token
        FileListArr: [], //上传文件列表
        debitAmount: "", //借方合计
        LendersCombined: "", //贷方合计
        subjectName: "", //会计科目名称
        Classification: false, //款项分类是否需要验证
        rootCode: "", //用于保存会计科目的层级
        selectClass: 0,//用于判断class
        modalShow: false,
        outStaff: {
          page: {
            num: 1,
            size: 10,
            total: 0,
            sizeOpts: [10, 20, 50, 80, 100]
          } //分页
        },
        credentShow: false,
      };
    },
    methods: {
      showOrHide(v){
        if(v){
          this.getList(this.resultObj)
        }
      },
      //业务日期改变=》年月改变
      changeBuessinessDate(){
        this.formPlan.period=tools.transMonth(this.formPlan.voucherTime)
      },
      changevoucherTime(){
        this.formPlan.period=tools.transMonth(this.formPlan.voucherTime)
      },
      thousands(num) {
        if(!num && num!=0){
          num = 0
        }
        var str = num.toString();
        var reg = str.indexOf(".") > -1 ? /\B(?=(\d{3})+\.)/g : /\B(?=(\d{3})+$)/g;
        return str.replace(reg, ",");
      },
      //弹框取消的回调
      cancel() {
        this.FileListArr = [];
      },
      //上传弹框是否打开
      visOpen(flag) {
        if (flag) {
          this.FileName = "";
          this.$refs.upload.clearFiles();
        }
      },
      // 上传前
      handleBeforeUpload(file) {
        // this.$refs.upload.clearFiles();
      },
      // 上传成功
      handleSuccess(res, file, fileList) {
        if (res.code == 0) {
          this.FileName = "";
          if (fileList.length > 5) {
            fileList.shift();
            this.FileListArr.push(res.data);
            this.FileListArr.map(item => {
              item.filePath = api.getfile + item.url;
              this.FileName += item.fileName + ",";
            });
          } else {
            this.FileListArr.push(res.data);
            this.FileListArr.map(item => {
              item.filePath = api.getfile + item.url;
              this.FileName += item.fileName + ",";
            });
          }
        }
      },
      //移除时
      RemoveFile(file, fileList) {
        this.FileListArr = fileList;
      },
      //超过3M时提示
      BigVerify() {
        this.$Message.warning("上传的单个文件超过3M！");
      },
      //下载文件
      down(item) {
        downLoding(item.id);
        // location.href =
        //   getImgUrl +
        //   "?id="+item.id +"?access_token="+
        //   Cookies.get(TOKEN_KEY);
      },
      OpenFilesModal() {
        this.uploadFiles = true;
      },

      SaveTwo() {
        let data = {};
        data.id = this.ID;
        data.totalDebitAmount = this.debitAmount;
        data.totalCreditAmount = this.LendersCombined;
        if (this.formPlan.INS) {
          data.voucherCode = this.formPlan.INS;
        }
        if (this.formPlan.BusinessDate) {
          data.businessDate = tools.transTime(this.formPlan.BusinessDate);
        }
        if (this.formPlan.voucherTime) {
          data.voucherTime = tools.transTime(this.formPlan.voucherTime);
        }
        if (this.formPlan.period) {
          data.fiscalDate=tools.transMonth(this.formPlan.voucherTime);
          // data.fiscalDate=this.formPlan.period;
          // data.fiscalYear = this.formPlan.period.split(".")[0];
          // data.fiscalMonth = this.formPlan.period.split(".")[1];
        }
        if (this.formPlan.ji) {
          data.voucherInternalCode = this.formPlan.cityList.filter(
            item => item.itemName == this.formPlan.ji
          )[0].itemCode;
        }
        if (this.formPlan.perioda) {
          data.voucherNo = this.formPlan.perioda;
        }
        if (this.formPlan.businessNumber) {
          data.originNo = this.formPlan.businessNumber;
        }
        if (this.formPlan.StatementNumber) {
          data.settlementNumber = this.formPlan.StatementNumber;
        }
        if (this.formPlan.businessType && this.formPlan.businessTypes) {
          // data.businessTypeNo = this.formPlan.businessType
          let arr=this.formPlan.businessTypes.filter(
            item => item.itemName == this.formPlan.businessType
          )
          data.businessTypeNo = arr.length==1?arr[0].itemCode:"";
        }
        if (this.formPlan.remark) {
          data.remark = this.formPlan.remark;
        }
        if (this.FileListArr !== null) {
          data.fileJson = this.FileListArr.map(item => {
            return {
              id: item.code,
              fileName: item.fileName,
              filePath: item.filePath
            };
          });
        }
        if (this.tableData !== null) {
          this.tableData.map(item => {
            if (item.paymentTypeCode) {
              let same = this.fundList.filter(
                el => el.itemName == item.paymentTypeCode
              );
              item.paymentTypeCode = same[0].itemCode;
            }
          });
          this.tableData.map(item => {
            if (item.debitAmount != 0) {
              item.amountDirection = 1;
            } else if (item.lenderAmount != 0) {
              item.amountDirection = 0;
            } else if (item.debitAmount == 0 && item.lenderAmount == 0) {
              item.amountDirection = 2;
            }
          });
          this.tableData.map(item => {
            if (item.debitAmount) {
              item.originalCurrency = item.debitAmount;
              item.currency = item.debitAmount;
            } else if (item.lenderAmount) {
              item.originalCurrency = item.lenderAmount;
              item.currency = item.lenderAmount;
            }
          });
          data.detailVOS = []
          this.tableData.forEach( (item ,index) => {
            item.serialNumber = index +1
            if(item.subjectName){
              item.subjectName = item.subjectName.split(' - ')[1]
            }
            data.detailVOS.push(item)
          });
        }
        showLoading('.bigBox')
        data.companyCode = this.$store.state.user.userData.currentCompany.code
        BigSave(data).then(res => {
          if (res.code === 0) {
            this.credentShow = false
            this.$parent.query()
            this.$Message.warning("保存成功!");
          } else {
            this.$Message.warning("保存失败！");
          }
          hideLoading()
        }).catch(err => {
          hideLoading()
        });
      },
      //保存按钮
      Save() {
        // this.$refs.formPlan.validate((valid) => {
        //   if (valid) {
        this.$refs.xTable.validate(() => {
          if (this.debitAmount == this.LendersCombined) {
            let saveBool=true;
            for(let i = 0; i < this.tableData.length; i++){
              if(!saveBool){
                return
              }
              if(this.tableData[i].debitAmount && this.tableData[i].lenderAmount){
                saveBool=false;
                return this.$Message.error("借方金额、贷方金额只可输入一项")
              }
              if(this.tableData[i].subjectName && this.tableData[i].subjectName.trim()==""){
                saveBool=false;
                return this.$Message.error("会计科目必选")
              }
              if(this.tableData[i].subjectName.trim()!==""){
                if(!this.tableData[i].summary || this.tableData[i].summary.trim()==""){
                  saveBool=false
                  return this.$Message.error("编辑表格的摘要必填")
                }
              }
              if(this.tableData[i].rootCode === '601'){
                if(this.tableData[i].balanceDirection === 1 && this.tableData[i].debitAmount){
                  saveBool = false
                  return this.$Message.error(`第${i+1}行，只能填写贷方金额！`)
                }
                if(this.tableData[i].balanceDirection === 0 && this.tableData[i].lenderAmount){
                  saveBool = false
                  return this.$Message.error(`第${i+1}行，只能填写借方金额！`)
                }
              }
              if(this.tableData[i].auxiliaryAccountingName && !this.tableData[i].auxiliaryName){
                saveBool = false
                this.$Message.error(`第${i+1}行，辅助核算必填！`)
                return 
              }
            }
            setTimeout(()=>{
              this.tableData = this.tableData.filter(item => item.subjectName)
              saveBool?this.SaveTwo():""
            },0)
          } else {
            this.$Message.error("借方贷方合计必须相等才能保存！");
          }
        });
        // } else {
        //   this.$Message.error('*为必填项!');
        // }
        // })
      },
      //审核按钮
      Audit() {
        this.$Modal.confirm({
          title: "确定审核通过吗",
          onOk: () => {
            let data = {};
            data.id = this.ID;
            data.processType = "1";
            processVoucher(data).then(res => {
              if (res.code === 0) {
                this.$Message.warning("审核通过成功");
                this.$router.push({name: "AuditList"});
              }
            });
          },
          onCancel: () => {
            this.$Message.info("取消审核通过");
          }
        });
      },
      //作废按钮
      cancellation() {
        this.$Modal.confirm({
          title: "确定作废吗",
          onOk: () => {
            let data = {};
            data.id = this.ID;
            data.processType = "2";
            processVoucher(data).then(res => {
              if (res.code === 0) {
                this.$Message.warning("作废成功");
                this.$router.push({name: "AuditList"});
              }
            });
          },
          onCancel: () => {
            this.$Message.info("取消作废");
          }
        });
      },
      //保存成模板
      template() {
      },
      //分页切换页数
      selectNum(page) {
        this.page.num = page;
        // this.getList()
      },
      //切换分页条数
      selectPage(size) {
        this.page.num = 1;
        this.page.size = size;
        // this.getList()
      },
      //客户分页切换页数
      selectNumClient(page) {
        this.client.page.num = page;
        this.ClientgetList();
      },
      //客户切换分页条数
      selectPageClient(size) {
        this.client.page.num = 1;
        this.client.page.size = size;
        this.ClientgetList();
      },
      //供应商切换页数
      selectNumsupplier(page) {
        this.supplier.page.num = page;
        this.SupperliergetList();
      },
      //供应商切换分页条数
      selectPagesupplier(size) {
        this.supplier.page.num = 1;
        this.supplier.page.size = size;
        this.SupperliergetList();
      },
      //个人分页切换页数
      selectNumpersonage(page) {
        this.personage.page.num = page;
        this.SearchPersonal();
      },
      //个人切换分页条数
      selectPagepersonage(size) {
        this.personage.page.num = 1;
        this.personage.page.size = size;
        this.SearchPersonal();
      },
      //其他分页切换页数
      selectNumOther(page) {
        this.Other.page.num = page;
        // this.getList()
      },
      //其他切换分页条数
      selectPageOther(size) {
        this.Other.page.num = 1;
        this.Other.page.size = size;
        // this.getList()
      },
      //单选表格内数据
      selectOne(row) {
      },
      //新增行
      async insertEventLast(row) {
        this.tableData.push({ debitAmount: 0, lenderAmount: 0 ,summary:"",subjectName: "",balanceDirection: 2});
      },
      tabCode(){
        if(this.tabModal=="active1"){
          this.tabTypeCode="101"
        }else if(this.tabModal=="active2"){
          this.tabTypeCode="201"
        }else if(this.tabModal=="active3"){
          this.tabTypeCode="301"
        }else if(this.tabModal=="active4"){
          this.tabTypeCode="401"
        }else if(this.tabModal=="active5"){
          this.tabTypeCode="501"
        }else if(this.tabModal=="active6"){
          this.tabTypeCode="601"
        }
      },
      //科目查询
      search(){
        let data={}
        //this.tabTypeCode
        data.titleTypeCode=this.tabTypeCode
        data.titleCode=this.subjectModel
        api.getSubjectMsg(data).then(res=>{
          if(res.code==0){
            if(data.titleTypeCode=="101"){
              this.subjectTableDataZiChan=res.data
            }else if(data.titleTypeCode=="201"){
              this.subjectTableDataFuZhai=res.data
            }else if(data.titleTypeCode=="301"){
              this.subjectTableDataGongTong=res.data
            }else if(data.titleTypeCode=="401"){
              this.subjectTableDataQuanYi=res.data
            }else if(data.titleTypeCode=="501"){
              this.subjectTableDataChengBen=res.data
            }else if(data.titleTypeCode=="601"){
              this.subjectTableDataSunYi=res.data
            }
          }
        })
      },

      //新增行
      async insertEvent(row,rowIndex) {
        this.tableData.map((item,index)=>{
          if(index==rowIndex){
            this.tableData.splice(index+1,0,{ debitAmount: 0, lenderAmount: 0 ,summary:"",subjectName: "",balanceDirection: 2})
          }
        })
      },

      //删除新增行
      removeEvent(row) {
        // this.tableData.splice(row.$rowIndex , 1)
        this.tableData = this.tableData.filter(item => item._XID !== row._XID);
      },
      //打开选择会计科目
      open(row) {
        this.subjectModelShow = true;
        // this.subjectClassification = 10
        // this.subjectQuery = ''
        // this.getAccountantList() //会计科目
        this.oneAccountent = row;
        this.accountingGetListZiChan();
        this.accountingGetListFuZhai();
        this.accountingGetListGongTong();
        this.accountingGetListQuanYi();
        this.accountingGetListChengBen();
        this.accountingGetListSunYi();
        // this.formDynamic.fund = this.oneAccountent.paymentTypeCode
        document.addEventListener('keydown', this.addKey, false)
      },
      addKey(e){
        e.stopPropagation()
        if(e.keyCode === 13){
          this.SubjectConfirm()
        }
      },
      //打开选择辅助核算
      async openassist(row) {
        this.oneAccountent = row;
        if (this.oneAccountent.subjectCode) {
          if (!this.oneAccountent.auxiliaryName) {        //当前row中的auxiliaryName为空要么是真没有，要么就是录入的时候没有填辅助核算
            let data = {
              titleCode: row.subjectCode,
              titleTypeCode: row.rootCode
            }
            let res = await api.getSubjectMsg(data)           // 查询根据auxiliaryAccountingName来判断是否有辅助核算
            if(!res.data[0].auxiliaryAccountingName){
              this.$Modal.info({title: '所选会计科目没有辅助核算'})
              return this.subjectModelShowassist = false;
            }
          }
          if(this.currentAccounting.titleCode=="1221" || this.currentAccounting.titleCode=="2241" || this.currentAccounting.titleCode=="1532" || this.currentAccounting.titleCode=="1801"){
          this.Classification=true;
          }else{
            this.Classification=false;
          }
          if(this.oneAccountent.subjectCode=="1221" || this.oneAccountent.subjectCode=="2241" || this.oneAccountent.subjectCode=="1532" || this.oneAccountent.subjectCode=="1801"){
            this.Classification=true;
          }else{
            this.Classification=false;
          }
          if(this.currentAccounting.auxiliaryAccountingName){
            if (this.currentAccounting.auxiliaryAccountingName.indexOf('客户') !== -1) {
              this.currTab = 'client'
            } else if (this.currentAccounting.auxiliaryAccountingName.indexOf('供应商') !== -1) {
              this.currTab = 'supplier'
            } else if (this.currentAccounting.auxiliaryAccountingName.indexOf('部门') !== -1) {
              this.currTab = 'department'
            } else if (this.currentAccounting.auxiliaryAccountingName.indexOf('个人') !== -1) {
              this.currTab = 'personage'
            } else {
              this.currTab = 'Other'
            }
          }
          // this.addNewAssistAccounting.auxiliaryName = ''
          this.addNewAssistAccounting = row;
          this.subjectModelShowassist = true;
          if (row.paymentTypeCode) {
            this.formDynamic.fund = row.paymentTypeCode;
          } else {
            this.formDynamic.fund = "";
          }
          this.ClientgetList(); //客户初始化
          this.SupperliergetList(); //供应商初始化
          this.getListCompany(); // 公司
          this.OtherGetlist(); //其他初始化
          this.OtherClickTable(); //其他辅助核算初始化
          this.groundIds = [];
          this.AssistTableDataGeRen = [];
        } else {
          this.$Message.error("请先选择会计科目！");
          this.subjectModelShowassist = false;
        }
        this.fundListZanshi=this.fundList.filter(vb=>vb.itemValueOne==this.oneAccountent.subjectCode)
      },
      //其他新增
      ShowOtherAdd() {
        this.OtherModalAdd = true;
      },
      // 客户刷新初始化
      ClientgetList() {
        let params = {};
        if (this.FullNameOrCode) {
          params.searchName = this.FullNameOrCode;
        }
        params.searchType = 0;
        params.page = this.client.page.num - 1;
        params.size = this.client.page.size;
        params.isInterior = this.dealings ? 1 : "";
        queryCreditLike(params).then(res => {
          if (res.code === 0) {
            this.AssistTableDataKeHu = res.data.content;
            this.client.page.total = res.data.totalElements;
          }
        });
      },
      //客户搜索模糊查询
      searchClient() {
        this.ClientgetList();
      },
      //供应商刷新初始化
      SupperliergetList() {
        let params = {};
        if (this.SupperlierNameOrCode) {
          params.searchName = this.SupperlierNameOrCode;
        }
        params.searchType = 1;
        params.page = this.supplier.page.num - 1;
        params.size = this.supplier.page.size;
        params.isInterior = this.dealings ? 1 : "";
        queryCreditLike(params).then(res => {
          if (res.code === 0) {
            this.AssistTableDataGongYingShang = res.data.content;
            this.supplier.page.total = res.data.totalElements;
          }
        });
      },
      //供应商搜索模糊查询
      searchSupperlier() {
        this.SupperliergetList();
      },
      //获取公司
      async getListCompany() {
        let data = {};
        data.groupId = this.$store.state.user.userData.tenantGroupId;
        let res = await getcompany(data);
        if (res.code === 0) {
          let list = [];
          res.data.childs.forEach(item => {
            if (item.childs.length > 0) {
              list.push({
                value: item.id,
                label: item.name,
                children: item.childs
              });
            } else {
              list.push({value: item.id, label: item.name, children: []});
            }
          });
          list.forEach(item => {
            if (item.children.length > 0) {
              item.children.map(val => {
                val.value = val.id;
                val.label = val.name;
                if (val.childs.length > 0) {
                  val.children = val.childs;
                  val.children.map(v => {
                    v.value = v.id;
                    v.label = v.name;
                  });
                } else {
                  val.children = [];
                }
              });
            }
          });
          this.list = list;
        }
      },
      // 辅助弹框个人搜索
      SearchPersonal() {
        let stop = this.$loading();
        let data = {};
        data.size = this.page.size;
        data.page = this.page.num - 1;
        data.userName=this.personageName==""?"":this.personageName.trim();//个人查询 名字输入框
        data.phone = "";
        data.office = 0;
        data.shopId = this.$store.state.user.userData.shopId;
        data.groundIds = this.groundIds[this.groundIds.length - 1] || "";
        getStaffList(data)
          .then(res => {
            stop();
            this.loading = false;
            if (res.code == 0) {
              this.AssistTableDataGeRen = res.data.content;
              this.personage.page.total = res.data.totalElements;
            }
          })
          .catch(err => {
            stop();
          });
      },
      //其他辅助核算初始化
      OtherGetlist() {
        let params = {};
        getDataDictionaryType(params).then(res => {
          if (res.code === 0) {
            let NewArr = res.data.filter(item => item.dictCode == "CW0011X");
            this.categoryArr = NewArr[0].children;
            this.categoryArr.push({dictName: '外部员工'})
          }
        });
      },
      // 其他辅助核算左侧列表点击事件
      LiClick(item, index) {
        this.selectClass = index;
        this.dictName = item.dictName;
        this.dictName = item.dictName;
        if(this.dictName == "外部员工"){
          this.getAllStaffList()
          return 
        }
        this.dictCode = item.dictCode;
        let params = {};
        if (this.accountingName) {
          params.itemName = this.accountingName;
        }
        if (item.dictCode) {
          params.dictCode = item.dictCode;
        }
        kmType(params).then(res => {
          if (res.code === 0) {
            this.AssistTableDataOther = res.data;
          }
        });
      },
      //其他辅助核算查询
      OtherClick() {
        this.OtherClickTable();
      },
      //其他辅助核算表格初始化
      OtherClickTable() {
        let params = {};
        if(this.dictName == '外部员工'){
          this.outStaff.page.num = 1
          this.getAllStaffList()
          return
        }
        params.searchType = 1;
        if (this.accountingName) {
          params.itemName = this.accountingName;
        }
        if (this.dictCode) {
          params.dictCode = this.dictCode;
        }
        kmType(params).then(res => {
          if (res.code === 0) {
            this.AssistTableDataOther = res.data;
          }
        });
      },
      //外部员工的分页
      selectoutStaffPage(page) {
        this.outStaff.page.num = page;
        this.getAllStaffList()
      },
      selectoutStaffSize(size) {
        this.outStaff.page.num = 1;
        this.outStaff.page.size = size;
        this.getAllStaffList()
      },
      //新增辅助核算名称保存
      addAuxiliary() {
        this.$refs.formAdd.validate(valid => {
          if (valid) {
            let data = {};
            data.itemName = this.formAdd.assistName;
            data.dictCode = this.dictCode;
            data.itemCode = tools.transTimesss(new Date());
            saveTreeDetailItem(data).then(res => {
              if (res.code === 0) {
                this.OtherClickTable();
                this.formAdd.assistName = "";
              } else {
                this.formAdd.assistName = "";
              }
            });
            this.$Message.success("新增成功!");
            this.OtherModalAdd = false;
          } else {
            this.OtherModalAdd = true;
            this.$Message.error("请输入名称!");
          }
        });
      },
      //其他辅助核算款项分类
      fundGetList() {
        let params = {};
        params.dictCode = "CW00131";
        kmType(params).then(res => {
          this.fundList = res.data;
        });
      },
      //vxe表格计算和值
      addFooter({columns, data}) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return "合计 :";
            }
            if (["debitAmount"].includes(column.property)) {
              this.debitAmount = this.$utils.sum(data, column.property);
              return this.thousands(this.$utils.sum(data, column.property));
            }
            if (["lenderAmount"].includes(column.property)) {
              this.LendersCombined = this.$utils.sum(data, column.property);
              return this.thousands(this.$utils.sum(data, column.property));
            }
            return null;
          })
        ];
      },
      //点击单选框获取会计科目资产
      radioChangeEventAsset({row}) {
        this.currentAccounting = row;
        this.accountingSubject = row.titleCode + " - " + row.fullTitle;
        this.balanceDirection = row.balanceDirection;
        this.subjectCode = row.titleCode;
        this.rootCode = row.rootCode;
        this.Classification = row.isAuxiliaryAccounting == 0 ? true : false;
      },
      //点击单选框获取会计科目负债
      radioChangeEventLiabilities({row}) {
        this.currentAccounting = row;
        this.accountingSubject = row.titleCode + " - " + row.fullTitle;
        this.balanceDirection = row.balanceDirection;
        this.subjectCode = row.titleCode;
        this.rootCode = row.rootCode;
        this.Classification = row.isAuxiliaryAccounting == 0 ? true : false;
      },
      //点击单选框获取会计科目共同
      radioChangeEventCommon({row}) {
        this.currentAccounting = row;
        this.accountingSubject = row.titleCode + " - " + row.fullTitle;
        this.balanceDirection = row.balanceDirection;
        this.subjectCode = row.titleCode;
        this.rootCode = row.rootCode;
        this.Classification = row.isAuxiliaryAccounting == 0 ? true : false;
      },
      //点击单选框获取会计科目权益
      radioChangeEventEquity({row}) {
        this.currentAccounting = row;
        this.accountingSubject = row.titleCode + " - " + row.fullTitle;
        this.balanceDirection = row.balanceDirection;
        this.subjectCode = row.titleCode;
        this.rootCode = row.rootCode;
        this.Classification = row.isAuxiliaryAccounting == 0 ? true : false;
      },
      //点击单选框获取会计科目成本
      radioChangeEventCost({row}) {
        this.currentAccounting = row;
        this.accountingSubject = row.titleCode + " - " + row.fullTitle;
        this.balanceDirection = row.balanceDirection;
        this.subjectCode = row.titleCode;
        this.rootCode = row.rootCode;
        this.Classification = row.isAuxiliaryAccounting == 0 ? true : false;
      },
      //点击单选框获取会计科目损益
      radioChangeEventProfit({row}) {
        this.currentAccounting = row;
        this.accountingSubject = row.titleCode + " - " + row.fullTitle;
        this.balanceDirection = row.balanceDirection;
        this.subjectCode = row.titleCode;
        this.rootCode = row.rootCode;
        this.Classification = row.isAuxiliaryAccounting == 0 ? true : false;
      },
      //点击单选框获取辅助核算客户
      radioChangeEventClient({row}) {
        this.AssistAccounting = row.shortName;
        this.auxiliaryTypeCode = "1";
        this.auxiliaryCode = row.code;
      },
      //点击单选框获取辅助核算供应商
      radioChangeEventSupplier({row}) {
        this.AssistAccounting = row.shortName;
        this.auxiliaryTypeCode = "1";
        this.auxiliaryCode = row.code;
      },
      //点击单选框获取辅助核算个人
      radioChangeEventPersonage({row}) {
        this.AssistAccounting = row.userName;
        this.auxiliaryTypeCode = "4";
        this.auxiliaryCode = row.id;
      },
      //点击单选框获取辅助核算其他
      radioChangeEventOther({row}) {
        this.AssistAccounting = row.itemName;
        if(this.dictName === '外部员工'){
          this.auxiliaryTypeCode = "CW00118";
        }else{
          this.auxiliaryTypeCode = row.dictCode;
        }
        this.auxiliaryCode = row.itemCode;
      },
      //辅助核算确定弹框
      confirmFuzhu() {
        if (this.Classification) {
          // this.AssistAccounting = ''
          this.$refs.formDynamic.validate(valid => {
            if (valid) {
              if (!this.AssistAccounting) {
                this.$message.error('请选择辅助核算');
                this.subjectModelShowassist = true
              } else {
                this.subjectModelShowassist = false;
                this.addNewAssistAccounting.auxiliaryName = this.AssistAccounting;
                this.addNewAssistAccounting.paymentTypeCode = this.formDynamic.fund;
                this.oneAccountent.auxiliaryTypeCode = this.auxiliaryTypeCode; //是什么类型；
                this.oneAccountent.auxiliaryCode = this.auxiliaryCode; //辅助核算的编码；
                if (this.oneAccountent.auxiliaryTypeCode == "3") {
                  this.oneAccountent.auxiliaryCode = this.departmentVal;
                }
              }
            } else {
              this.$Message.error("请选择款项分类!");
              this.subjectModelShowassist = true;
            }
          });
        } else {
          // if(!this.AssistAccounting){
          //   this.$message.error('请选择辅助核算');
          //   this.subjectModelShowassist = true
          // } else {
          this.subjectModelShowassist = false;
          this.addNewAssistAccounting.auxiliaryName = this.AssistAccounting;
          this.addNewAssistAccounting.paymentTypeCode = this.formDynamic.fund;
          this.oneAccountent.auxiliaryTypeCode = this.auxiliaryTypeCode; //是什么类型；
          this.oneAccountent.auxiliaryCode = this.auxiliaryCode; //辅助核算的编码；
          if (this.oneAccountent.auxiliaryTypeCode == "3") {
            this.oneAccountent.auxiliaryCode = this.departmentVal;
          }
          // }
        }
      },
      //会计科目确定弹框
      SubjectConfirm() {
        if (!this.accountingSubject) {
          this.$message.error("请选择会计科目");
          this.subjectModelShow = true;
        } else {
          this.oneAccountent.subjectName = this.accountingSubject;
          this.oneAccountent.subjectCode = this.subjectCode;
          this.oneAccountent.rootCode = this.rootCode;

          this.oneAccountent.auxiliaryCode = ''
          this.oneAccountent.auxiliaryName = ''
          delete this.oneAccountent.amountDirection
          // this.oneAccountent.auxiliaryTypeCode = this.currentAccounting.auxiliaryTypeCode
          this.oneAccountent.auxiliaryAccountingName = this.currentAccounting.auxiliaryAccountingName
          this.oneAccountent.auxiliaryAccountingCode = this.currentAccounting.auxiliaryAccountingCode
          this.oneAccountent.isAuxiliaryAccounting = this.currentAccounting.isAuxiliaryAccounting
          this.subjectModelShow = false;
          this.oneAccountent.balanceDirection = this.balanceDirection; //会计科目是借方、还是贷方
        }
      },
      //会计科目弹框资产初始化
      accountingGetListZiChan() {
        let params = {};
        params.parentCode = "101";
        params.status = 1
        getTableList(params).then(res => {
          if (res.code === 0) {
            this.subjectTableDataZiChan = res.data;
          }
        });
      },
      //会计科目弹框负债初始化
      accountingGetListFuZhai() {
        let params = {};
        params.parentCode = "201";
        params.status = 1
        getTableList(params).then(res => {
          if (res.code === 0) {
            this.subjectTableDataFuZhai = res.data;
          }
        });
      },
      //会计科目弹框共同初始化
      accountingGetListGongTong() {
        let params = {};
        params.parentCode = "301";
        params.status = 1
        getTableList(params).then(res => {
          if (res.code === 0) {
            this.subjectTableDataGongTong = res.data;
          }
        });
      },
      //会计科目弹框权益初始化
      accountingGetListQuanYi() {
        let params = {};
        params.parentCode = "401";
        params.status = 1
        getTableList(params).then(res => {
          if (res.code === 0) {
            this.subjectTableDataQuanYi = res.data;
          }
        });
      },
      //会计科目弹框成本初始化
      accountingGetListChengBen() {
        let params = {};
        params.parentCode = "501";
        params.status = 1
        getTableList(params).then(res => {
          if (res.code === 0) {
            this.subjectTableDataChengBen = res.data;
          }
        });
      },
      //会计科目弹框损益初始化
      accountingGetListSunYi() {
        let params = {};
        params.parentCode = "601";
        params.status = 1
        getTableList(params).then(res => {
          if (res.code === 0) {
            this.subjectTableDataSunYi = res.data;
          }
        });
      },
      //计、收、付、转下拉框
      SelectGetlistJi() {
        let params = {};
        params.dictCode = "CW00010";
        kmType(params).then(res => {
          if (res.code === 0) {
            this.formPlan.cityList = res.data;
          }
        });
      },
      //会计科目视是否可以手动选择
      checkMethod({row}) {
        return row.isDetailSubject == 0;
      },
      //业务类型
      businessType() {
        let params = {};
        params.dictCode = "CW00020";
        kmType(params).then(res => {
          if (res.code === 0) {
            this.formPlan.businessTypes.push(...res.data);
          }
        });
      },
      //修改刷新列表
      getList(res) {
        this.ID = res.data.id;
        this.formPlan.INS = res.data.voucherCode;
        this.formPlan.BusinessDate = tools.transTime(res.data.businessDate);
        this.formPlan.voucherTime = tools.transTime(res.data.voucherTime)
        this.formPlan.period =
          res.data.fiscalYear + "-" + res.data.fiscalMonth;
        this.formPlan.ji = res.data.voucherInternalCode;
        this.formPlan.perioda = res.data.voucherNo;
        this.formPlan.businessNumber = res.data.originNo;
        this.formPlan.StatementNumber = res.data.settlementNumber;
        this.formPlan.businessType = res.data.businessTypeNo;
        this.formPlan.remark = res.data.remark;
        this.FileListArr = res.data.fileJson ? res.data.fileJson : []
        res.data.detailVOS.map(item => {
          if (item.paymentTypeCode) {
            let same = this.fundList.filter(
              el => el.itemCode == item.paymentTypeCode
            );
            if(same[0]){
              item.paymentTypeCode = same[0].itemName;
            }
          }
          if(item.subjectName){
            item.subjectName = item.subjectCode + ' - ' + item.subjectName
          }
        });
        this.tableData = res.data.detailVOS;
      },
      //部门改变
      ListChange(val, selectedData) {
        if (selectedData.length == 1) {
          this.AssistAccounting = selectedData[0].label;
          this.departmentVal = selectedData[0].value;
          this.auxiliaryTypeCode = "3";
        } else {
          this.AssistAccounting = selectedData[selectedData.length - 1].name;
          this.departmentVal = selectedData[selectedData.length - 1].value;
          this.auxiliaryTypeCode = "3";
        }
      },
      //改变业务类型
      BusinessTypeC(value) {
      },
      //其他新增
      ShowOtherAdd() {
        if(this.dictName == '外部员工'){
          this.modalShow = true
        }else{
          this.OtherModalAdd = true;
        }
      },
      // 查询外部员工
      async getAllStaffList(){
        let params={
          page:this.outStaff.page.num-1,
          size:this.outStaff.page.size,
        }
        let data={}
        data.orgid=this.$store.state.user.userData.shopId;
        data.fullName=this.accountingName
        //参数
        let res=await getOutStaffNew(params,data)
        if(res.code===0){
          this.AssistTableDataOther=res.data.content
          this.AssistTableDataOther.map(v => {
            v.itemCode = v.code
            v.itemName = v.fullName
          })
          this.outStaff.page.total=res.data.totalElements
        }
      },
      //添加外部员工
      submit(){
        this.$refs.addOutStaff.handleSubmit(()=>{
          let data = {}
          data=this.$refs.addOutStaff.data
          data.id=""
          data.isDisabled=1
          this.addOutStaffTrue(data);
          this.modalShow=false;
          this.$refs.addOutStaff.data={};
        })
      },
      //取消
      cancel(){
        this.$refs.addOutStaff.data={}
        this.modalShow=false
      },
      //添加外部员工接口
      async addOutStaffTrue(data){
        let res=await addOutStaffeNew(data)
        if(res.code===0){
          this.$Message.success("新增外部人员成功")
          this.getAllStaffList()
        }
      },
    },
    mounted() {
      this.OtherClickTable();
      this.fundGetList();
      this.SelectGetlistJi();
      this.businessType();
    },
    //过滤器
    filters: {
      currency: currency
    },
    watch: {
      subjectModelShow(newV){
        if(newV === false){
          document.removeEventListener('keydown', this.addKey)
        }
      }
    }
  };
</script>

<style scoped>
  .flex {
    display: flex;
  }

  .uploadbtn:hover {
    color: #03a9f4;
    border: 1px solid #ddd;
  }

  .items {
    list-style: none;
  }

  .items .item {
    display: flex;
    justify-content: space-between;
    height: 20px;
  }

  .header {
    padding: 5px 0;
    margin-left: 10px;
    margin-right: 10px;
    border: 1px #cccccc solid;
  }

  .Other {
    display: flex;
    height: 550px;
  }

  .OtherLeft {
    width: 100px;
    border-right: 1px solid #dddddd;
  }

  .OtherLeft > ul > li {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
  }

  .OtherLeft > ul > li:last-child {
    border-bottom: 1px solid #dddddd;
  }

  .OtherRight {
    /* flex: 6; */
    width: 100%;
  }

  .changeDiv {
    display: inline-block;
    margin-left: 20px;
  }

  .xuan {
    background: #e8eaec;
    color: #dddddd;
    font-size: 15px;
  }
</style>
<style lang="less" scoped>
  .changeV {
      height: 36px !important;
  }
  /deep/.vxe-table.vxe-editable.size--mini .vxe-body--column{
    height: 36px !important;
  }
  .formBox .ivu-form-item {
    margin-bottom: 5px;
    margin-right: 5px;
  }

  .ModalBox .ivu-form-item {
    margin-bottom: 2px;
  }

  .bottomZI {
    margin-top: 20px;
    margin-left: 40px;
    font-size: 16px;
    color: red;
  }

  .fund {
    position: relative;
    top: -650px;
    left: 400px;
  }

  .LiClass:hover {
    cursor: pointer;
  }
</style>


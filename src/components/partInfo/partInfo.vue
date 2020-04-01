<template>
  <div>
    <Modal v-model="proModal" title="配件资料" width="700" @on-visible-change="visible">
      <div class="pb10 tr" v-if="!isAddPart || isSellDis">
        <Checkbox v-model="prohibit">是否禁用</Checkbox>
        <Checkbox v-model="forbidsale">是否禁售</Checkbox>
      </div>
      <Tabs
        type="card"
        @on-click="changeTab"
        v-model="tabsActive"
        :animated="false"
        name="partInfoTab"
        ref="tabs"
      >
        <TabPane label="基本信息" tab="partInfoTab" name="active1">
          <Form ref="proModalForm" :model="formValidate" :rules="ruleValidate" :label-width="110">
            <Row>
              <Col span="11">
                <FormItem label="配件品质：" prop="qualityTypeId">
                  <Select @on-change="qualityGetBrand" v-model="formValidate.qualityTypeId">
                    <Option
                      v-for="item in qualityArr"
                      :value="item.qualityCode"
                      :key="item.qualityCode"
                    >{{item.quality}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="配件品牌：" prop="partBrandId">
                  <Select @on-change="getFullName" v-model="formValidate.partBrandId">
                    <Option v-for="item in brandArr" :value="item.id" :key="item.code">{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="编码：" prop="code">
                  <Input v-model="formValidate.code"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="名称：" prop="name">
                  <Input
                    @on-click="showName"
                    icon="ios-more"
                    v-model="formValidate.name"
                    readonly="readonly"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="单位：" prop="unitId">
                  <Select v-model="formValidate.unitId" @on-change="changeUnit">
                    <Option
                      v-for="item in dictCodeAll"
                      :value="item.itemName"
                      :key="item.itemName"
                    >{{item.itemName}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="OE码：" prop="oemCode">
                  <Input v-model="formValidate.oemCode"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="规格：" prop="spec">
                  <Input @input="getFullName" v-model="formValidate.spec"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="型号：" prop="model">
                  <Input v-model="formValidate.model"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="适用车型：" prop="applyCarbrandId">
                  <Select
                    @on-change="getCarModelFun"
                    class="w140 mr5"
                    v-model="formValidate.carBrandName"
                  >
                    <Option
                      v-for="item in carObj.carBrandData"
                      :value="item.id"
                      :key="item.id"
                    >{{item.nameCn}}</Option>
                  </Select>
                  <Select class="w350" @on-change="getFullName" v-model="formValidate.carModelName">
                    <Option
                      v-for="item in carObj.carModelData"
                      :value="item.carModelName"
                      :key="item.id"
                    >{{item.carModelName}}</Option>
                  </Select>
                  <!--<Input class="w350" v-model="formValidate.explain"></Input>-->
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="通用编码：" prop="commonId">
                  <Input v-model="formValidate.commonId"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="生产厂家：" prop="manufacture">
                  <Input v-model="formValidate.manufacture"></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="产地：" prop="prdtPlace">
                  <Input v-model="formValidate.prdtPlace"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="配件全称：" prop="fullName">
                  <Input readonly v-model="formValidate.fullName"></Input>
                  <!--配件全称 = 名称+规格+车型+品牌-->
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="自定义分类：" prop="customClassName">
                  <Input
                    @on-click="customModalFun"
                    icon="ios-more"
                    v-model="formValidate.customClassName"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="备注：" prop="direction">
                  <Input v-model="formValidate.direction"></Input>
                </FormItem>
              </Col>
            </Row>
            <!--<Row>-->
            <!--<Col span="22">-->
            <!--<FormItem label="单位换算：" class="x11">-->
            <!--<div class="flex">-->
            <!--<div>-->
            <!--<div class="unit-item w300" v-for="v in valueVOS">-->
            <!--<Select class="w80" v-model="v.unit1">-->
            <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
            <!--</Select>-->
            <!--<Input class="w80" v-model="v.inputNum"></Input>-->
            <!--<Select class="w80" v-model="v.unit2">-->
            <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
            <!--</Select>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div>-->
            <!--<Button class="ml30" @click="addValueVOS" type="default"><Icon type="md-add" size="14"/> 新增</Button>-->
            <!--<Button class="ml10" @click="delValueVOS" type="primary"><i class="iconfont mr5 iconlajitongicon"></i>删除</Button>-->
            <!--</div>-->
            <!--</div>-->
            <!--</FormItem>-->
            <!--</Col>-->
            <!--</Row>-->
          </Form>
          <!--<div class="tc">-->
          <!--<Button class="mr10" type='warning' @click='submit("proModalForm",1)'>审核通过</Button>-->
          <!--<Button class="mr10" type='primary' @click='submit("proModalForm",2)'>审核不通过</Button>-->
          <!--<Button type='default' @click='proModal = false'>取消</Button>-->
          <!--</div>-->
        </TabPane>
        <TabPane label="包装规格" tab="partInfoTab" v-if="showSpe" name="active2">
          <div class="pb10">
            <Button type="default" @click="addSpec" class="mr10 w90">新增规格</Button>
            <Button @click="delSpec" type="default" class="mr10 w90">删除</Button>
          </div>
          <!--<Table height="300" size="small" :loading="loading" border :stripe="true" :columns="columnsTab" :data="formValidate.specVOS">-->
          <!--<template slot-scope="{ row, index }" slot="meterCompany">-->
          <!--<span v-if="index===0">{{formValidate.unitId}}</span>-->
          <!--<Select @on-change="changeSpec(index,row)" v-else class="w80" v-model="row.meterCompany">-->
          <!--<Option v-for="item in dictCodeAll" :value="item.itemName" :key="item.itemName">{{item.itemName}}</Option>-->
          <!--</Select>-->
          <!--</template>-->
          <!--</Table>-->
          <vxe-table
            ref="vxeTable"
            border
            size="mini"
            height="300"
            :data="formValidate.specVOS"
            :edit-rules="validRules"
            :edit-config="{trigger: 'click', mode: 'cell'}"
            @radio-change="selectChange"
          >
            <vxe-table-column type="index" width="50" title="序号"></vxe-table-column>
            <vxe-table-column type="radio" width="60"></vxe-table-column>
            <vxe-table-column field="meterCompany" title="计量单位" width="102">
              <template v-slot="{ row,rowIndex }">
                <span v-if="rowIndex==0">{{row.meterCompany}}</span>
                <Select v-else class="w80" v-model="row.meterCompany">
                  <Option
                    v-for="item in dictCodeAll"
                    :value="item.itemName"
                    :key="item.itemName"
                  >{{item.itemName}}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              :edit-render="{name: 'input'}"
              field="companyNum"
              title="单位数量"
              width="90"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{name: 'input'}"
              field="longNum"
              title="长(cm)"
              width="80"
            ></vxe-table-column>
            <vxe-table-column :edit-render="{name: 'input'}" field="wide" title="宽(cm)" width="80"></vxe-table-column>
            <vxe-table-column :edit-render="{name: 'input'}" field="high" title="高(cm)" width="80"></vxe-table-column>
            <vxe-table-column
              :edit-render="{name: 'input'}"
              field="volume"
              title="体积(cm³)"
              width="95"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{name: 'input'}"
              field="weight"
              title="重量(kg)"
              width="95"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{name: 'input'}"
              field="volumeRong"
              title="容积(ml)"
              width="95"
            ></vxe-table-column>
            <vxe-table-column fixed="right" field="checkboxsing" title="最小计量单位" width="100">
              <template v-slot="{ row,rowIndex }">
                <Checkbox v-model="row.checkboxsing" @on-change="changeCheckbox(rowIndex)"></Checkbox>
              </template>
            </vxe-table-column>
          </vxe-table>
          <!--<div class="tc pt20">-->
          <!--<Button class="mr10" type='primary' @click='submit("proModal")'>保存</Button>-->
          <!--<Button type='default' @click='proModal = false'>取消</Button>-->
          <!--</div>-->
        </TabPane>
      </Tabs>
      <div slot="footer" v-if="isAddPart">
        <Button :loading="this.btnIsLoadding" class="mr10" type="warning" @click="submit('proModalForm',1)">保存</Button>
        <Button type="default" @click="proModal = false">取消</Button>
      </div>
      <div slot="footer" v-else>
        <Button class="mr10" type="warning" @click="submit('proModalForm',1)">审核通过</Button>
        <Button class="mr10" type="primary" @click="submit('proModalForm',2)">审核不通过</Button>
        <Button type="default" @click="proModal = false">取消</Button>
      </div>
    </Modal>
    <search-part-name @selectSearchName="getSearchPartName" ref="searchPartName"></search-part-name>
    <Modal v-model="customModal" title="自定义分类" width="500">
      <div class="partCheck-hd">
        <Button @click="submitCustom" class="mr10" type="default">
          <Icon type="md-checkmark" />选择
        </Button>
        <Button @click="customModal=false" type="default">
          <Icon type="md-close" />取消
        </Button>
      </div>
      <div class="custom-main">
        <div class="custom-item" v-for="v in customAll">
          <p class="custom-type-hd">{{v.dictName}}：</p>
          <div>
            <span
              class="tag-span mr10 mb10"
              :class="{'active':customClassName.id==v1.id}"
              @click="handleTag(v1)"
              @on-change="handleTag(v1)"
              v-for="v1 in v.itemVOS"
            >{{v1.itemName}}</span>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { mixPartInfo } from "./mixPartInfo";
import SearchPartName from "./searchPartName";

export default {
  name: "partInfo",
  props: {
    isAddPart: false,
    isSellDis: false
  },
  components: { SearchPartName },
  mixins: [mixPartInfo]
};
</script>

<style scoped lang="less">
.custom-main {
  border-top: 1px solid #ddd;
  .custom-type-hd {
    padding: 10px 0 6px;
  }
  .tag-span {
    cursor: pointer;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    padding: 4px 10px;
    border-radius: 2px;
    display: inline-block;
    &.active {
      background: #fd5c5c;
      border-color: #fd5c5c;
      color: #fff;
    }
  }
}
</style>

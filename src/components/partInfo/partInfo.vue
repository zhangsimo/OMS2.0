<template>
  <div>
    <Modal v-model="proModal" title="配件资料" width="700" :mask-closable="false" @on-visible-change="visible">
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
                  <Select @on-change="qualityGetBrand" v-model="formValidate.qualityTypeId" filterable>
                    <Option
                      v-for="item in qualityArr"
                      :value="item.qualityCode"
                      :key="item.qualityCode"
                    >{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="配件品牌：" prop="partBrandId">
                  <Select @on-change="getFullName" v-model="formValidate.partBrandId" filterable>
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
                <FormItem label="标准名称：" prop="name">
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
                <FormItem label="一级分类：" prop="partTypeF">
                  <Select v-model="formValidate.partTypeF" @on-change="changetype" filterable>
                    <Option
                      v-for="item in typepf"
                      :value="item.typeId"
                      :key="item.typeId"
                    >{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="二级分类：" prop="partTypeS">
                  <Select v-model="formValidate.partTypeS" @on-change="changetypeS" filterable>
                    <Option
                      v-for="item in typeps"
                      :value="item.typeId"
                      :key="item.typeId"
                    >{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="单位：" prop="unitId">
                  <Select v-model="formValidate.unitId" @on-change="changeUnit" filterable>
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
                <FormItem label="适用车型：" class="car-item-w" :class="{'ivu-form-item-error':isCart}" prop="">
                  <div class="car-con-item" v-for="(v,vi) in carList" :key="vi">
                    <Select
                      @on-change="getSelectCarBrand"
                      class="w140 mr5"
                      v-model="v.carBrand"
                      filterable
                    >
                      <Option
                        v-for="item in carObj.carBrandData"
                        :value="item.erpCarBrandId"
                        :key="item.erpCarBrandId"
                      >{{item.nameCn}}</Option>
                    </Select>
                    <Input class="w260" v-model="v.carName" />
                    <Button type="text" class="car-btn add" @click="addCarItem" v-if="vi==0"><Icon type="md-add" />添加车型</Button>
                    <Button v-if="vi>0" @click="removeCarItem(vi)" type="text" class="car-btn del"><Icon type="md-close" />删除</Button>
                  </div>
                  <div v-show="isCart" class="ivu-form-item-error-tip">最少填入一个适用车型</div>
                  <!--<Select-->
                    <!--@on-change="getCarModelFun"-->
                    <!--class="w140 mr5"-->
                    <!--v-model="formValidate.carBrandName"-->
                  <!--&gt;-->
                    <!--<Option-->
                      <!--v-for="item in carObj.carBrandData"-->
                      <!--:value="item.id"-->
                      <!--:key="item.id"-->
                    <!--&gt;{{item.nameCn}}</Option>-->
                  <!--</Select>-->
                  <!--<Select class="w350" @on-change="getFullName" v-model="formValidate.carModelName">-->
                    <!--<Option-->
                      <!--v-for="item in carObj.carModelData"-->
                      <!--:value="item.carModelName"-->
                      <!--:key="item.id"-->
                    <!--&gt;{{item.carModelName}}</Option>-->
                  <!--</Select>-->
                  <!--<Input class="w350" v-model="formValidate.explain"></Input>-->
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="拼音码:">
                  <Input v-model="spellCode" readonly/>
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
          </Form>
        </TabPane>
        <TabPane label="包装规格" tab="partInfoTab" v-if="showSpe" name="active2">
          <div class="pb10">
            <Button type="default" @click="addSpec" class="mr10 w90">新增规格</Button>
            <Button @click="delSpec" type="default" class="mr10 w90">删除</Button>
          </div>
          <vxe-table
            ref="vxeTable"
            border
            size="mini"
            height="300"
            :data="formValidate.specVOS"
            :edit-rules="validRules"
            :edit-config="{trigger: 'click', mode: 'cell'}"
            @radio-change="selectChange"
            resizable
          >
            <vxe-table-column type="seq" width="50" title="序号"></vxe-table-column>
            <vxe-table-column type="radio" width="60"></vxe-table-column>
            <vxe-table-column field="meterCompany" title="计量单位" width="102">
              <template v-slot="{ row,rowIndex }">
                <span v-if="rowIndex==0">{{row.meterCompany}}</span>
                <Select v-else class="w80" v-model="row.meterCompany" filterable>
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
        </TabPane>
        <TabPane label="关联配件" tab="partInfoTab" name="active3" class="con-warp">
          <div class="partCheck-hd">
            <Input class="w200 mr10" v-model="partName" placeholder="请输入配件内码/编码/名称/OE码" @on-enter="search"></Input>
            <Select placeholder="配件一级分类" filterable v-model="selectLevelFirst" class="w100 mr10">
              <Option v-for="(item,index) in levelType" :value="item.typeId" :key="item.id">{{item.name}}</Option>
            </Select>
            <Select
              placeholder="配件二级分类"
              filterable
              v-model="selectLevelSecond"
              class="w100 mr10"
              v-for="(item,index) in levelType"
              :key="index"
              v-if="selectLevelFirst == item.typeId"
            >
              <Option v-for="(item2,index2) in item.children"  :value="item2.typeId" :key="index2">{{item2.name}}</Option>
            </Select>
            <Button @click="search" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
            <Button type='default'  @click="manyCodeSearch">多编码查询</Button>
          </div>
          <div class="tab-warps trans-list">
            <div class="left target">
              <Table
                class="table"
                border
                highlight-row
                resizable
                auto-resize
                size="small"
                :loading="allPartLoading"
                :stripe="true"
                :columns="allPartColumns"
                :data="allPartList"
                height="280"
                @on-selection-change="selectAllPart"
              ></Table>
              <Page
                size="small"
                class-name="page-con"
                :current="page.num"
                :total="page.total"
                :page-size="page.size"
                @on-change="allPartListChangePage"
                @on-page-size-change="allPartListChangeSize"
                show-sizer
                show-total
                show-elevator
              ></Page>
            </div>
            <div class="trans-btn w110">
              <Button class="ml10 w90" @click="addContact">新建关联</Button>
              <Button class="ml10 w90 mt10" @click="moveContact">取消关联</Button>
            </div>
            <div class="right dist">
              <Table
                class="table"
                border
                highlight-row
                resizable
                auto-resize
                size="small"
                :loading="alreadyPartLoading"
                :stripe="true"
                :columns="allPartColumns"
                :data="alreadyPartList"
                height="300"
                @on-selection-change="selectAlreadyPart"
              ></Table>
            </div>
          </div>
          <Modal v-model="manyCodeModal" title="多编码查询" width="300">
            <Form :rules="rules">
              输入多个配件编码，换行以区分：
              <br/>
              <el-input v-model="manyCodeInput" type="textarea" rows="5" cols="30" prop="manyCode"></el-input>
            </Form>
            <div slot="footer">
              <Button class="mr10" type="warning" @click="manyCodeTrue">查询</Button>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
      <div slot="footer" v-if="isAddPart">
        <Button :loading="btnIsLoadding" class="mr10" type="warning" @click="submit('proModalForm',1)">保存</Button>
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
  .car-btn{
    font-size: 12px;
    color: #40a6ff;
    &.del{
      color: #fd5c5c;
    }
  }
</style>
<style lang="less">
  .car-item-w{
  .ivu-form-item-label:before{
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
  }
  }
  .con-warp {
    padding-bottom: 10px;
    height: auto;
    background-color: #fff;
    .tab-warps {
      padding: 10px;
    }
    .trans-list {
      display: flex;
      justify-content: space-between;
      .trans-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .right, .left {
        &>p{
          background-color: #f8f8f8;
          line-height: 40px;
          height: 40px;
          padding-left: 10px;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0px;
          color: #333333;
          border: 1px solid #e9e9e9;
        }
        .button-warp {
          padding: 10px;
          display: flex;
          border-left: 1px solid #e9e9e9;
          border-right: 1px solid #e9e9e9;
        }
        width: calc((100% - 110px) / 2);
        padding: 10px;
        border: solid 1px #e5e5e5;
      }
    }
  }
</style>

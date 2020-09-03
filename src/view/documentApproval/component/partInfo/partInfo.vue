<template>
  <div>
    <Modal v-model="proModal" title="配件申请审批" width="700" :mask-closable="false" @on-visible-change="visible" footer-hide>
      <div class="pb10 tr" v-if="!isAddPart || isSellDis">
        <Checkbox v-model="prohibit">是否禁用</Checkbox>
        <Checkbox v-model="forbidsale">是否禁售</Checkbox>
      </div>
      <h4 class="pb10">基本信息</h4>
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
            <FormItem label="一级分类：" prop="partTypeF">
              <Select v-model="formValidate.partTypeF" filterable>
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
              <Select v-model="formValidate.partTypeS" filterable>
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
            <FormItem label="适用车型：" class="car-item-w" prop="">
              <div class="car-con-item" v-for="(v,vi) in carList">
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
                <Input class="w260" v-model="v.carName"></Input>
                <!--<Button type="text" class="car-btn add" @click="addCarItem" v-if="vi==0"><Icon type="md-add" />添加车型</Button>-->
                <!--<Button v-if="vi>0" @click="removeCarItem(vi)" type="text" class="car-btn del"><Icon type="md-close" />删除</Button>-->
              </div>
              <div v-show="isCart" class="ivu-form-item-error-tip">最少填入一个适用车型</div>

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
      <div>
        <h4 class="pb10">其他信息</h4>
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
      </div>
    </Modal>

  </div>
</template>

<script>
import { mixPartInfo } from "./mixPartInfo";

export default {
  name: "partInfo",
  data: {
    // 按钮状态
    btnIsLoadding: false,
  },
  props: {
    isAddPart: false,
    isSellDis: false
  },
  components: {  },
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
</style>

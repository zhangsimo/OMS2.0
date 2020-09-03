<template>
  <section class="accessories">
    <Modal
      v-model="proModal"
      title="配件资料"
      width="720"
      @on-visible-change="handleReset('proModalform')"
    >
      <div class="pb10 tr">
        <Checkbox v-model="prohibit">是否禁用</Checkbox>
        <Checkbox v-model="forbidsale">是否禁售</Checkbox>
      </div>
      <Tabs type="card" :animated="true">
        <TabPane label="基本信息">
          <Form
            ref="proModalform"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="110"
          >
            <Row>
              <Col span="11">
                <FormItem label="配件品质：" prop="qualityTypeId">
                  <Select
                    @on-change="seletBandAll"
                    v-model="formValidate.qualityTypeId"
                    filterable
                  >
                    <Option
                      v-for="item in qualitites"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="配件品牌：" prop="partBrandId" filterable>
                  <Select
                    v-if="brandAll.length > 0"
                    @on-change="selectPartBrand"
                    v-model="formValidate.partBrandId">
                    <Option
                      v-for="item in brandAll"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                  <Select v-model="formValidate.partBrandId" v-else>
                    <Option :value="formValidate.partBrandId">{{ formValidate.partBrandName }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="编码：" prop="code">
                  <Input v-model="formValidate.code" />
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="名称：" prop="name">
                  <Input
                    @on-click="showName"
                    icon="ios-clock-outline"
                    v-model="formValidate.name"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="单位：" prop="unitId">
                  <Select
                    v-model="formValidate.unitId"
                    @on-change="changeSelectUnit"
                    filterable
                  >
                    <Option
                      v-for="item in dictCodeAll"
                      :value="item.itemName"
                      :key="item.itemName"
                      :disabled="item.disabled"
                      >{{ item.itemName }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="OE码：">
                  <Input v-model="formValidate.oemCode" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="规格：">
                  <Input v-model="formValidate.spec" />
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="型号：">
                  <Input v-model="formValidate.model" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="适用车型：">
                   <Select
                    class="w140 ml5 mr5"
                    v-model="formValidate.nameEn"
                    @on-change="changcarmodel"
                    filterable
                  >
                    <Option
                      v-for="item in wbBansarr"
                      :value="item.value"
                      :key="item.id"
                      >{{ item.label }}</Option
                    >
                  </Select>
                  <Select
                    class="w140 ml5 mr5"
                    v-loadmore="loadmore"
                    :remote-method="remoteMethod"
                    :loading="remoteloading"
                    remote
                    filterable
                    v-model="formValidate.applyCarbrandId"
                    @on-change="selectCar"
                  >
                    <Option
                      v-for="item in carModelAll"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="通用编码：">
                  <Input v-model="formValidate.commonCode" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="生产厂家：">
                  <Input v-model="formValidate.produceFactory" />
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="产地：">
                  <Input v-model="formValidate.origin" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="22">
                <FormItem label="配件全称：">
                  <Input v-model="fullName" />配件全称 =
                  名称+规格+车型+品牌
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="11">
                <FormItem label="自定义分类：">
                  <Input
                    @on-click="customModalFun"
                    icon="ios-clock-outline"
                    v-model="formValidate.customName"
                  />
                </FormItem>
              </Col>
              <Col span="11">
                <FormItem label="备注：">
                  <Input v-model="formValidate.remarks" />
                </FormItem>
              </Col>
            </Row>
            <Row v-if="yp">
              <Col span="22">
                <FormItem label="单位换算：" class="x11">
                  <div class="flex">
                    <div>
                      <div
                        class="unitId-item w300"
                        v-for="(v, index) in valueVOS"
                        :key="index"
                      >
                        <Select class="w80" v-model="v.keyFir">
                          <Option
                            v-for="item in dictCodeAll"
                            :value="item.itemName"
                            :key="item.itemName"
                            >{{ item.itemName }}</Option
                          >
                        </Select>
                        <Input class="w80" v-model="v.value" />
                        <Select class="w80" v-model="v.keySen">
                          <Option
                            v-for="item in dictCodeAll"
                            :value="item.itemName"
                            :key="item.itemName"
                            >{{ item.itemName }}</Option
                          >
                        </Select>
                      </div>
                    </div>
                    <!-- <div>
                      <Button class="ml30" @click="addValueVOS" type="default">
                        <Icon type="md-add" size="14" />新增
                      </Button>
                      <Button class="ml10" @click="delValueVOS" type="primary">
                        <i class="iconfont mr5 iconlajitongicon"></i>删除
                      </Button>
                    </div> -->
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="包装规格">
          <div class="pb10">
            <Button type="default" @click="addSpec" class="mr10 w90"
              >新增规格</Button
            >
            <Button @click="delSpec" type="default" class="mr10 w90"
              >删除</Button
            >
          </div>
          <vxe-table
            max-height="360"
            ref="xTable"
            border
            stripe
            :edit-rules="validRules"
            :auto-resize="true"
            :data="formValidate.specVOS"
            :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
          >
            <vxe-table-column
              type="seq"
              title="序号"
              width="50"
            ></vxe-table-column>
            <vxe-table-column field="meterCompany" width="100" title="计量单位">
              <template v-slot="{ row, rowIndex }">
                <span v-if="rowIndex === 0">{{ row.meterCompany }}</span>
                <Select
                  v-else
                  @on-change="changeSelect"
                  :transfer="true"
                  class="w80"
                  v-model="row.meterCompany"
                  filterable
                >
                  <!--formValidate.specVOList[index].meterCompany-->
                  <Option
                    v-for="item in dictCodeAll"
                    :value="item.itemName"
                    :key="item.itemName"
                    :disabled="item.disabled"
                    >{{ item.itemName }}</Option
                  >
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="companyNum"
              title="单位数量"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="longNum"
              title="长"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="wide"
              title="宽"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="high"
              title="高"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="volume"
              title="体积"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="weight"
              title="重量"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="volumeRong"
              title="容积"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column title="最小起量单位">
              <template v-slot="{ row }">
                <Checkbox disabled v-model="row.isMinCompany"></Checkbox>
              </template>
            </vxe-table-column>
          </vxe-table>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button type="primary" @click="submit('proModalform')">确定</Button>
        <Button
          type="default"
          @click="
            proModal = false;
            handleReset('proModalform');
          "
          >取消</Button
        >
      </div>
    </Modal>
    <Modal
      v-model="linkModal"
      title="配件名称查询"
      width="1000"
      @on-visible-change="resPart"
    >
      <div class="partCheck-hd">
        <Input class="w200 mr10" v-model="content" />
        <Button class="mr10" type="primary" @click="queryTree">
          <Icon type="ios-search" size="14" />查询
        </Button>
        <Button class="mr10" type="default" @click="selectPartName">
          <Icon type="md-checkmark" />选择
        </Button>
        <!-- <Button type="default" @click="addPartModal = true">
          <Icon type="md-add" />新增配件名称
        </Button> -->
      </div>
      <div class="part-main">
        <div class="part-left">
          <div class="partCheck-left-tit">系统分类</div>
          <div class="partCheck-left-tree">
            <Tree :data="treeData" @on-select-change="selectTree"></Tree>
          </div>
        </div>
        <div class="part-right">
          <Table
            @on-current-change="selectTabelData"
            size="small"
            highlight-row
            :loading="partloading"
            border
            :stripe="true"
            :columns="columnsPart"
            :data="tbdata"
            height="520"
          ></Table>
          <Page
            class-name="page-con"
            :current="part.page.num"
            :total="part.page.total"
            :page-size="part.page.size"
            @on-change="changePartPage"
            @on-page-size-change="changePartSize"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="addPartname">确定</Button>
        <Button type="default" @click="linkModal = false">取消</Button>
      </div>
    </Modal>
    <Modal v-model="customModal" title="自定义分类" width="500">
      <div class="partCheck-hd">
        <Button @click="submitCustom" class="mr10" type="default"
          ><Icon type="md-checkmark" /> 选择</Button
        >
        <Button @click="customModal = false" type="default"
          ><Icon type="md-close" /> 取消</Button
        >
      </div>
      <div class="custom-main">
        <div class="custom-item" v-for="(v, index) in customAll" :key="index">
          <p class="custom-type-hd">{{ v.dictName }}：</p>
          <div>
            <span
              class="tag-span"
              :class="{ active: customClassName == v1.id }"
              @click="handleTag(v1)"
              @on-change="handleTag(v1)"
              v-for="(v1, index) in v.itemVOS"
              :key="index"
              >{{ v1.itemName }}</span
            >
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- <Modal v-model="addPartModal" title="新增配件名称" width="500" @on-visible-change="handleReset('PartForm')">
      <Form ref="PartForm" :model="formPart" :rules="rulePart" :label-width="110">
        <FormItem label="标准名称:" prop="nameStd">
          <Input v-model="formPart.nameStd" />
        </FormItem>
        <FormItem label="别名:" prop="nameCn">
          <Input v-model="formPart.nameCn" />
        </FormItem>
        <FormItem label="配件一级分类:" prop="partTypeF">
          <Select class="w120" @on-change="selectOne" v-model="formPart.partTypeF" :transfer="true">
            <Option
              v-for="item in partTypeFT"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配件二级分类:" prop="partTypeS">
          <Select class="w120" @on-change="selectTwo" v-model="formPart.partTypeS" :transfer="true">
            <Option
              v-for="item in partTypeSD"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配件三级分类:" prop="partTypeT">
          <Select class="w120" @on-change="selectThree" v-model="formPart.partTypeT" :transfer="true">
            <Option
              v-for="item in partTypeTH"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="补充说明:">
          <Input v-model="formPart.mark" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addpartCnname('PartForm')">保存</Button>
        <Button type="default" @click="addPartModal = false; handleReset('PartForm')">取消</Button>
      </div>
    </Modal> -->
  </section>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.part-main {
  margin-top: 10px;
  display: flex;
  .part-left {
    width: 220px;
    .partCheck-left-tree {
      height: 520px;
      overflow-y: auto;
    }
  }
  .part-right {
    width: 780px;
  }
  .page-con {
    margin: 10px;
    text-align: right;
  }
}
.partCheck-hd {
  //border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.custom-main {
  border-top: 1px solid #ddd;
  .custom-type-hd {
    padding: 10px 0 6px;
  }
  .tag-span {
    display: inline-block;
    margin: 5px;
    cursor: pointer;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    padding: 4px 10px;
    border-radius: 2px;
    &.active {
      background: #fd5c5c;
      border-color: #fd5c5c;
      color: #fff;
    }
  }
}
</style>

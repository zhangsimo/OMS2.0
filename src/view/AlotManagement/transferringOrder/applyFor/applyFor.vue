<template>
    <div>
      <!--<div class="content-oper content-oper-flex">-->
        <!--<section class="oper-box">-->
          <!--<div class="oper-top flex">-->
            <!--<div class="wlf">-->
              <!--<div class="db">-->
                <!--<quick-date class="mr10" v-on:quickDate="getDataQuick"></quick-date>-->
                <!--<Select v-model="purchaseType" class="w90 mr10">-->
                  <!--<Option v-for="item in purchaseTypeArr" :value="item.value" :key="item.value">{{item.label}}</Option>-->
                <!--</Select>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button type="default" @click="search" class="mr10"><i class="iconfont mr5 iconchaxunicon"></i>更多</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button class="mr10" @click="addPro"><Icon type="md-add"/> 新增</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button type="default" @click='submit("formPlan")' class="mr10"><i class="iconfont mr5 iconbaocunicon"></i>保存</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button class="mr10" @click="editPro"><i class="iconfont mr5 iconziyuan2"></i>提交</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button @click="linkProMadel" class="mr10"><Icon type="md-close" size="14" /> 作废</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button @click="linkProMadel" class="mr10"><i class="iconfont mr5 iconfanhuiicon"></i> 反作废</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button @click="linkProMadel" class="mr10"><i class="iconfont mr5 icondayinicon"></i> 打印</Button>-->
              <!--</div>-->
              <!--<div class="db">-->
                <!--<Button @click="linkProMadel" class="mr10"><i class="iconfont mr5 iconshenheicon"></i> 查看审批</Button>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</section>-->
        <!--<section class="con-box">-->
          <!--<div class="inner-box">-->
            <!--<div class="con-split" ref="paneLeft">-->
              <!--<Split v-model="split1" min="200" max="500">-->
                <!--<div slot="left" class="con-split-pane-left" style="overflow-y: auto; height: 100%;">-->
                  <!--<div class="pane-made-hd">-->
                    <!--采购计划单列表-->
                  <!--</div>-->
                  <!--<Table :height="leftTableHeight"  @on-current-change="selectTabelData" size="small" highlight-row  border :stripe="true" :columns="columns" :data="tbdata"></Table>-->
                  <!--<Page simple class-name="fl pt10" size="small" :current="page.num" :total="100" :page-size="page.size" @on-change="changePage"-->
                        <!--@on-page-size-change="changeSize" show-sizer show-total>-->
                  <!--</Page>-->
                <!--</div>-->
                <!--<div slot="right" class="con-split-pane-right pl5 goods-list-form">-->
                  <!--<div class="pane-made-hd">-->
                    <!--计划采购信息-->
                  <!--</div>-->
                  <!--<div class="clearfix purchase" ref="planForm">-->
                    <!--<Form inline :show-message="false" ref="formPlan" :model="formPlan" :rules="rulePlan" :label-width="100">-->
                      <!--<FormItem label="供应商：" prop="supplyName">-->
                        <!--<Row class="w160">-->
                          <!--<Col span="19"><Input v-model="formPlan.supplyName" placeholder="请选择供应商"></Input></Col>-->
                          <!--<Col span="5"><Button @click="addSuppler" class="ml5" size="small" type="default"><i class="iconfont iconxuanzetichengchengyuanicon"></i></Button></Col>-->
                        <!--</Row>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="计划采购日期：" prop="planDate">-->
                        <!--<Input class="w160" v-model="formValidate.planDate"></Input>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="计划员：" prop="planner" >-->
                        <!--<Input class="w160" v-model="formPlan.planner"></Input>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="备注：" prop="remark">-->
                        <!--<Input class="w160" v-model="formPlan.remark"></Input>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="票据类型：" prop="billType">-->
                        <!--<Select class="w160" v-model="formPlan.billType">-->
                          <!--<Option value="beijing">New York</Option>-->
                          <!--<Option value="shanghai">London</Option>-->
                          <!--<Option value="shenzhen">Sydney</Option>-->
                        <!--</Select>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="直发门店：" prop="hairShop">-->
                        <!--<Select class="w160" v-model="formPlan.hairShop">-->
                          <!--<Option value="beijing">New York</Option>-->
                          <!--<Option value="shanghai">London</Option>-->
                          <!--<Option value="shenzhen">Sydney</Option>-->
                        <!--</Select>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="计划单号：" prop="planOrderNum">-->
                        <!--<Input class="w160" v-model="formPlan.planOrderNum"></Input>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="其他费用：" prop="otherPrice">-->
                        <!--<Input class="w160" v-model="formPlan.otherPrice"></Input>-->
                      <!--</FormItem>-->
                      <!--<FormItem label="合计总金额：" prop="totalPrice">-->
                        <!--<Input class="w160" v-model="formPlan.totalPrice"></Input>-->
                      <!--</FormItem>-->
                    <!--</Form>-->
                  <!--</div>-->
                  <!--<div class="flex plan-cz-btn" ref="planBtn">-->
                    <!--<div class="clearfix">-->
                      <!--<div class="fl mb5">-->
                        <!--<Button size="small" class="mr10" @click="addPro"><Icon type="md-add"/> 添加配件</Button>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--<Button size="small" class="mr10" @click="addPro">导入</Button>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--<Button size="small" class="mr10" @click="addPro"><i class="iconfont mr5 iconlajitongicon"></i> 删除</Button>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--│-->
                        <!--<span class="ml10">配件品牌：</span>-->
                        <!--<Select size="small" class="w100 mr10" v-model="formPlan.billType">-->
                          <!--<Option value="beijing">New York</Option>-->
                          <!--<Option value="shanghai">London</Option>-->
                          <!--<Option value="shenzhen">Sydney</Option>-->
                        <!--</Select>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--<span>销量排名前：</span>-->
                        <!--<Input size="small" class="w50 mr10" v-model="formPlan.totalPrice"></Input>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--│-->
                        <!--<span class="ml10">备货级别：</span>-->
                        <!--<Select size="small" class="w100 mr10" v-model="formPlan.billType">-->
                          <!--<Option value="beijing">New York</Option>-->
                          <!--<Option value="shanghai">London</Option>-->
                          <!--<Option value="shenzhen">Sydney</Option>-->
                        <!--</Select>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--<Button size="small" class="mr10" @click="addPro"><i class="iconfont mr5 iconxiazaiicon"></i> 获取配件</Button>-->
                      <!--</div>-->
                      <!--<div class="fl mb5">-->
                        <!--<Button size="small" class="mr10" @click="addPro"><i class="iconfont mr5 iconbianjixiugaiicon"></i> 计划调整</Button>-->
                      <!--</div>-->
                    <!--</div>-->

                    <!--<div class="t-price">-->
                      <!--采购计划金额：120000.00-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<vxe-table-->
                    <!--border-->
                    <!--resizable-->
                    <!--show-footer-->
                    <!--@edit-closed="editClosedEvent"-->
                    <!--size="mini"-->
                    <!--:height="rightTableHeight"-->
                    <!--:data="tableData"-->
                    <!--:footer-method="addFooter"-->
                    <!--:edit-config="{trigger: 'dblclick', mode: 'cell'}">-->
                    <!--<vxe-table-column type="index" width="60" title="序号"></vxe-table-column>-->
                    <!--<vxe-table-column type="checkbox" width="60"></vxe-table-column>-->
                    <!--<vxe-table-column field="name" title="配件编码" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="role" title="配件名称" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="sex" title="品牌" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="连锁库存" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="总部库存" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="门店库存" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="采购在途库存" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="滞销库存" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num" title="计划采购数量" :edit-render="{name: 'input'}" width="120">-->
                      <!--<template v-slot:edit="{ row }">-->
                        <!--<InputNumber :max="9999" :min="0" v-model="row.price"></InputNumber>-->
                      <!--</template>-->
                    <!--</vxe-table-column>-->
                    <!--<vxe-table-column field="price" title="计划采购单价" :edit-render="{name: 'input'}" width="120">-->
                      <!--<template v-slot:edit="{ row }">-->
                        <!--<InputNumber :max="9999" :min="0" v-model="row.price"></InputNumber>-->
                      <!--</template>-->
                      <!--<template v-slot="{ row }">-->
                        <!--{{parseFloat(row.price).toFixed(2)}}-->
                      <!--</template>-->
                    <!--</vxe-table-column>-->
                    <!--<vxe-table-column title="计划采购金额" width="120">-->
                      <!--<template v-slot="{ row }">-->
                        <!--{{parseFloat(row.price*row.num).toFixed(2)}}-->
                      <!--</template>-->
                    <!--</vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="备注" :edit-render="{name: 'input'}" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="num6" title="不含税单价" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="不含税金额" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="最近采购单价" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="单价差" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="库存上限" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="库存下限" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="品牌车型" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="单位" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="OE码" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="规格" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="方向" width="100"></vxe-table-column>-->
                    <!--<vxe-table-column field="date12" title="计划取消数量" width="100"></vxe-table-column>-->
                  <!--</vxe-table>-->
                  <!--&lt;!&ndash;<div ref="planPage">&ndash;&gt;-->
                  <!--&lt;!&ndash;<Page size="small" class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"&ndash;&gt;-->
                  <!--&lt;!&ndash;@on-page-size-change="changeSize" show-sizer show-total></Page>&ndash;&gt;-->
                  <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--</div>-->
              <!--</Split>-->
            <!--</div>-->
          <!--</div>-->
        <!--</section>-->
        <!--<search-part-name ref="searchPartName"></search-part-name>-->
        <!--<select-part-com ref="selectPartCom"></select-part-com>-->
        <!--<select-supplier ref="selectSupplier" header-tit="供应商资料"></select-supplier>-->
      <!--</div>-->

    </div>
</template>

<script>
    export default {
        name: "applyFor"
    }
</script>

<style scoped>

</style>

<template>
  <!--选择辅助核算-->
  <Modal v-model="modal" title="选择辅助核算" width="750">
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
                <Button type="warning" class="mr10" @click="searchClient">查询</Button>
              </FormItem>
            </Form>
          </div>
          <div>
            <vxe-table
              border
              stripe
              resizable
              auto-resize
              show-overflow
              align="center"
              max-height="500"
              highlight-current-row
              :data="AssistTableDataKeHu"
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
              :total="Other.total"
              :page-size="Other.size"
              :current="Other.num"
              :page-size-opts="Other.sizeOpts"
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
                <Button type="warning" class="mr10" @click="searchSupperlier">查询</Button>
              </FormItem>
            </Form>
          </div>
          <div>
            <vxe-table
              border
              stripe
              resizable
              auto-resize
              show-overflow
              align="center"
              max-height="500"
              highlight-current-row
              :data="AssistTableDataGongYingShang"
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
              :total="Other.page.total"
              :page-size="Other.page.size"
              :current="Other.page.num"
              :page-size-opts="Other.page.sizeOpts"
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
            ></Cascader>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="个人" name="personage">
        <Form :label-width="50" ref="form" inline>
          <FormItem label="部门:" prop="groundIds">
            <Cascader :data="list" v-model="groundIds" placeholder="营销中心" style="width: 250px"></Cascader>
          </FormItem>
          <FormItem>
            <Button type="warning" class="mr10" @click="SearchPersonal">查询</Button>
          </FormItem>
        </Form>
        <div>
          <vxe-table
            border
            stripe
            resizable
            auto-resize
            show-overflow
            align="center"
            max-height="500"
            highlight-current-row
            :data="AssistTableDataGeRen"
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
            :total="Other.page.total"
            :page-size="Other.page.size"
            :current="Other.page.num"
            :page-size-opts="Other.page.sizeOpts"
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
                @click="LiClick(item)"
              >{{ item.dictName }}</li>
            </ul>
          </div>
          <div class="OtherRight">
            <div>
              <span class="ml20">名称：</span>
              <Input v-model="accountingName" style="width: 150px" placeholder="核算名称" class="mr10" />
              <Button type="warning" class="mr10" @click="OtherClick">查询</Button>
              <Button type="warning" class="mr10" @click="ShowOtherAdd">新增</Button>
            </div>
            <div>
              <vxe-table
                border
                stripe
                resizable
                auto-resize
                show-overflow
                align="center"
                max-height="500"
                highlight-current-row
                :data="AssistTableDataOther"
                style="margin-top: 10px;margin-left: 10px"
              >
                <vxe-table-column type="radio" title="选择"></vxe-table-column>
                <vxe-table-column field="itemCode" title="编码"></vxe-table-column>
                <vxe-table-column field="itemName" title="核算全称"></vxe-table-column>
              </vxe-table>
            </div>
            <div>
              <Page
                size="small"
                :total="Other.page.total"
                :page-size="Other.page.size"
                :current="Other.page.num"
                :page-size-opts="Other.page.sizeOpts"
                show-sizer
                show-total
                show-elevator
                @on-change="selectNumOther"
                @on-page-size-change="selectPageOther"
                style="float: right;margin-top: 10px;margin-right: 10px"
              />
            </div>
            <div>
              <!--其他辅助核算弹框里新增弹框-->
              <!-- <Modal v-model="OtherModalAdd" title="新增辅助核算名称" width="400" @on-ok="addAuxiliary">
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
              </Modal> -->
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
    <!-- <Form
      ref="formDynamic"
      :model="formDynamic"
      :rules="ruleValidateTwo"
      :label-width="80"
      style="width: 300px"
    >
      <FormItem label="款项分类:" prop="fund">
        <Select v-model="formDynamic.fund" placeholder="请选择">
          <Option v-for="item in fundList" :value="item.itemName" :key="item.id">{{ item.itemName }}</Option>
        </Select>
      </FormItem>
    </Form> -->
    <div slot="footer">
      <Button type="primary" @click="determine" class="mr10">确定</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      modal: false, //弹框
      Other: {
        page: 1,
        size: 20,
        num: 1,
        sizeOpts: 1
      },
      FullNameOrCode:'',
      AssistTableDataKeHu:[],
      SupperlierNameOrCode:'',
      AssistTableDataGongYingShang:[],
      groundIds:'',
      AssistTableDataGeRen:[],
      categoryArr:[],
      accountingName:'',
      AssistTableDataOther:[]
    };
  },
  methods: {
    // 确定
    determine() {},
    searchClient(){},
    searchSupperlier(){},
    SearchPersonal(){},
    OtherClick(){},
ShowOtherAdd(){},
  }
};
</script>
<template>
  <main class="tenant-res">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <Button class="mr10 w90" @click="add" v-has="'add'">
              <span class="center">
                <Icon custom="iconfont iconxinzengicon icons" />新增
              </span>
            </Button>
          </div>
          <div class="db">
            <Button class="mr10 w90" :disabled="buttonDisable" @click="update" v-has="'change'">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
            </Button>
          </div>
          <div class="db">
            <Button class="mr10 w90" :disabled="buttonDisable" @click="del" v-has="'delete'">
              <span class="center">
                <Icon custom="iconfont iconlajitongicon icons" />删除
              </span>
            </Button>
          </div>
          <div class="db">
            <Button class="mr10 w90" :disabled="buttonDisable" @click="onOffAccount" v-has="'disabled'">
              <span class="center" v-if="buttonOn">
                <Icon custom="iconfont iconjinzhijinyongicon icons" />禁用
              </span>
              <span class="center" v-else>
                <Icon custom="iconfont iconqiyongicon icons" />启用
              </span>
            </Button>
          </div>
          <div class="db">
            <Button class="mr10 w90" @click="refresh">
              <span class="center">
                <Icon custom="iconfont iconshuaxinicon icons" />刷新
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="con-box">
      <Table
        class="table"
        border
        highlight-row
        size="small"
        :loading="loading"
        :stripe="true"
        :columns="tbhead"
        :data="tbdata"
        @on-current-change="currRow"
      ></Table>
    </section>
    <Modal v-model="modal" :title="title" width="600">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
        <FormItem label="账户名称：" prop="name">
          <Input v-model="formData.name" placeholder="请输入账户名称" />
        </FormItem>
        <FormItem label="账户类型：" prop="type">
          <RadioGroup v-model="formData.type">
            <Radio
              v-for="item in AccountType"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="备　　注：" >
          <Input v-model="formData.mark"/>
        </FormItem>
        <vxe-table border :data="formData.mode">
          <vxe-table-column title=" " min-width="186">
            <template v-slot="{ row, rowIndex}">
              <span class="dot" v-show="rowIndex == 0">*</span>
              <Button type="text" @click="insert">新增</Button>
              <Button type="text" @click="remove(rowIndex)">删除</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column title="结算方式" min-width="380" filed="id">
            <template v-slot="{ row }">
              <select class="vxe-default-select" v-model="row.id">
                <option
                  v-for="item in SettlementMode"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</option>
              </select>
            </template>
          </vxe-table-column>
        </vxe-table>
      </Form>
      <div slot="footer">
        <Button class="mr10 w120" @click="submit('formData', 'add')">
          <span class="center">
            <Icon custom="iconfont iconxinzengicon icons" />保存并新增
          </span>
        </Button>
        <Button type="primary" @click="submit('formData', 'save')">保存</Button>
      </div>
    </Modal>
  </main>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import url("./index.less");
</style>

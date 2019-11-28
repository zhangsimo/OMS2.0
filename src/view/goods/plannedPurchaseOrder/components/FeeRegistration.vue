<template>
  <Modal v-model="isCost" title="费用登记" width="1000">
    <div class="costBox clearfix con-split">
      <div class="fl mr10">
        <div class="leftT mb15">
          <Select size="small" style="width:100px" class="mr15">
            <Option
              v-for="item in cityList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Input
            placeholder="请输入查询内容"
            style="width: 200px"
            size="small"
            class="mr15"
          />
          <Button type="primary" size="small">查询</Button>
        </div>
        <div class="pane-made-hd">往来单位列表</div>
        <div class="w420 h600">
          <vxe-table border resizable height="auto" size="mini" :data="tableData">
            <vxe-table-column
              type="index"
              width="80"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column
              field="name"
              title="操作"
              width="80"
            ></vxe-table-column>
            <vxe-table-column
              field="sex"
              title="往来单位"
              width="130"
            ></vxe-table-column>
            <vxe-table-column
              field="age"
              title="编码"
              width="130"
            ></vxe-table-column>
          </vxe-table>
        </div>
        <Page
          :total="40"
          size="small"
          show-elevator
          show-sizer
          show-total
          simple
        />
      </div>
      <div class="fr h600 right">
        <div class="mb15">
          <Button type="primary" size="small" class="mr10">保存</Button>
          <Button size="small">取消</Button>
        </div>
        <div class="pt30">
          <vxe-table
            border
            resizable
            size="mini"
            :data="tableData"
            height="auto"
            highlight-current-row
            :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
          >
            >
            <vxe-table-column
              type="index"
              width="60"
              title="序号"
            ></vxe-table-column>
            <vxe-table-column width="60" title="操作">
              <template v-slot="{ row }">
                <a href="javascript:;">删除</a>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="name"
              title="往来单位"
              width="120"
            ></vxe-table-column>
            <vxe-table-column
              field="role"
              title="收支项目"
              width="120"
              :edit-render="{ name: 'input' }"
            >
              <template v-slot:edit="{ row }">
                <Select size="small" style="width:100px">
                  <Option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="sex"
              title="应付金额"
              width="100"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="num6"
              title="备注"
              width="120"
              :edit-render="{ name: 'input' }"
            ></vxe-table-column>
            <vxe-table-column
              field="num6"
              title="创建人"
              width="80"
            ></vxe-table-column>
            <vxe-table-column
              field="num6"
              title="创建日期"
              width="100"
            ></vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class FeeRegistration extends Vue {
    private isCost:boolean = false;

    private init() {
        this.isCost = true;
    }
}
</script>

<style lang="less">
    .costBox {
        display: flex;
        justify-content: space-between;
        .pane-made-hd {
            line-height: 20px;
            padding: 5px;
            background-color: #e8e8e8;
        }
        .fr {
            overflow-x: auto;
        }
    }
</style>
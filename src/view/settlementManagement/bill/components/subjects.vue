<template>
  <Modal v-model="modal" title="选择会计科目" width="800" @on-visible-change="hander">
    <Tabs type="card" :animated="false">
      <TabPane label="资产">
        <div>
          <vxe-table
            border
            resizable
            stripe
            align="center"
            auto-resize
            show-overflow
            highlight-current-row
            max-height="500"
            :data="subjectTableDataZiChan"
            @current-change="seleteData"
          >
            <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
            <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
            <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
          </vxe-table>
        </div>
      </TabPane>
      <TabPane label="负债">
        <vxe-table
          border
          resizable
          stripe
          align="center"
          auto-resize
          show-overflow
          highlight-current-row
          max-height="500"
          :data="subjectTableDataFuZhai"
          @current-change="seleteData"
        >
          <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="共同">
        <vxe-table
          border
          resizable
          stripe
          align="center"
          auto-resize
          show-overflow
          highlight-current-row
          max-height="500"
          :data="subjectTableDataGongTong"
          @current-change="seleteData"
        >
          <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="权益">
        <vxe-table
          border
          resizable
          stripe
          align="center"
          auto-resize
          show-overflow
          highlight-current-row
          max-height="500"
          :data="subjectTableDataQuanYi"
          @current-change="seleteData"
        >
          <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="成本">
        <vxe-table
          border
          resizable
          stripe
          align="center"
          auto-resize
          show-overflow
          highlight-current-row
          max-height="500"
          :data="subjectTableDataChengBen"
          @current-change="seleteData"
        >
          <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="损益">
        <vxe-table
          border
          resizable
          stripe
          align="center"
          auto-resize
          show-overflow
          highlight-current-row
          max-height="500"
          :data="subjectTableDataSunYi"
          @current-change="seleteData"
        >
          <vxe-table-column field="titleTypeName" title="科目分类"></vxe-table-column>
          <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
          <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
        </vxe-table>
      </TabPane>
    </Tabs>
    <div slot="footer">
      <Button type="primary" @click="determine">确定</Button>
    </div>
    <auxiliary ref="auxiliary" />
  </Modal>
</template>
<script>
import bus from '../Popup/Bus'
import auxiliary from './auxiliary'
export default {
  components:{
    auxiliary
  },
  data() {
    return {
      modal: false,
      subjectTableDataZiChan: [], //资产
      subjectTableDataFuZhai: [], //负债
      subjectTableDataGongTong: [], //共同
      subjectTableDataQuanYi: [], //权益
      subjectTableDataChengBen: [
        {
          titleTypeName: "12",
          titleCode: "12",
          titleName: "12",
          titleLevel: "12"
        }
      ], //成本
      subjectTableDataSunYi: [
        {
          titleTypeName: "123",
          titleCode: "123",
          titleName: "123",
          titleLevel: "123"
        }
      ], //损益
      subject: {} //选中的数据
    };
  },
  methods: {
    //弹框打开
    hander() {},
    //选择科目
    determine() {
      bus.$emit('sub',this.subject)
    },
    //选中数据
    seleteData({ row }) {
      this.subject = row;
    }
  }
};
</script>
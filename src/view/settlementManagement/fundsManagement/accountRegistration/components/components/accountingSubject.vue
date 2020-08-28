<template>
  <Modal
    v-model="subjectModelShow"
    title="选择会计科目"
    width="750"
    @on-visible-change="showOrhideModel"
  >
    <Form v-model="accountingSubject">
      <Tabs type="card" :animated="false">
        <TabPane label="资产" >
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
              highlight-hover-row
              highlight-current-row
              show-overflow
              height="500"
              ref="one"
            >
              <vxe-table-column type="radio"  title="选择"></vxe-table-column>
              <vxe-table-column field="titleTypeName" title="科目分类" ></vxe-table-column>
              <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
              <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
              <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
            </vxe-table>
          </div>
        </TabPane>
        <TabPane label="负债">
          <vxe-table
            border
            resizable
            :data="subjectTableDataFuZhai"
            stripe
            size="mini"
            align="center"
            :auto-resize="true"
            @radio-change="radioChangeEventLiabilities"
            highlight-hover-row
            highlight-current-row
            show-overflow
            height="500"
            ref="two"
          >
            <vxe-table-column type="radio"  title="选择"></vxe-table-column>
            <vxe-table-column field="titleTypeName" title="科目分类" ></vxe-table-column>
            <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
            <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          </vxe-table>
        </TabPane>
        <TabPane label="共同">
          <vxe-table
            border
            resizable
            :data="subjectTableDataGongTong"
            stripe
            size="mini"
            align="center"
            :auto-resize="true"
            @radio-change="radioChangeEventCommon"
            highlight-hover-row
            highlight-current-row
            show-overflow
            height="500"
            ref="three"

          >
            <vxe-table-column type="radio" title="选择"></vxe-table-column>
            <vxe-table-column field="titleTypeName" title="科目分类" ></vxe-table-column>
            <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
            <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          </vxe-table>
        </TabPane>
        <TabPane label="权益">
          <vxe-table
            border
            resizable
            :data="subjectTableDataQuanYi"
            stripe
            size="mini"
            align="center"
            :auto-resize="true"
            @radio-change="radioChangeEventEquity"
            highlight-hover-row
            highlight-current-row
            show-overflow
            height="500"
            ref="four"

          >
            <vxe-table-column type="radio"  title="选择"></vxe-table-column>
            <vxe-table-column field="titleTypeName" title="科目分类" ></vxe-table-column>
            <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
            <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          </vxe-table>
        </TabPane>
        <TabPane label="成本">
          <vxe-table
            border
            resizable
            :data="subjectTableDataChengBen"
            stripe
            size="mini"
            align="center"
            :auto-resize="true"
            @radio-change="radioChangeEventCost"
            highlight-hover-row
            highlight-current-row
            show-overflow
            height="500"
            ref="five"

          >
            <vxe-table-column type="radio"  title="选择"></vxe-table-column>
            <vxe-table-column field="titleTypeName" title="科目分类" ></vxe-table-column>
            <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
            <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          </vxe-table>
        </TabPane>
        <TabPane label="损益">
          <vxe-table
            border
            resizable
            :data="subjectTableDataSunYi"
            stripe
            size="mini"
            align="center"
            :auto-resize="true"
            @radio-change="radioChangeEventProfit"
            highlight-hover-row
            highlight-current-row
            show-overflow
            height="500"
            ref="six"

          >
            <vxe-table-column type="radio"  title="选择"></vxe-table-column>
            <vxe-table-column field="titleTypeName" title="科目分类" ></vxe-table-column>
            <vxe-table-column field="titleCode" title="科目编码"></vxe-table-column>
            <vxe-table-column field="titleName" title="科目名称"></vxe-table-column>
            <vxe-table-column field="titleLevel" title="层级"></vxe-table-column>
          </vxe-table>
        </TabPane>
      </Tabs>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click="SubjectConfirm" class="mr10">保存</Button>
      <Button type='default' @click="subjectModelShow = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import { getTableList } from '@/api/accountant/accountant';

    export default {
        name: "accountingSubject",
        data(){
          return {
            subjectTableDataZiChan: [], //会计弹框资产
            subjectTableDataFuZhai:[], //会计弹框负债
            subjectTableDataGongTong: [], //会计弹框共同
            subjectTableDataQuanYi: [], //会计弹框权益
            subjectTableDataChengBen: [], //会计弹框成本
            subjectTableDataSunYi: [], //会计弹框损益
            subjectModelShow: false, //model弹框
            accountingSubject: '' ,//定义一个容器装选中的值
            SendData: [], //给父组件发送的值
          }
        },
      methods :{
        //会计科目弹框资产初始化
        accountingGetListZiChan(){
          let params = {};
          params.parentCode = "101"
          getTableList(params).then(res => {
            if(res.code === 0){
              this.subjectTableDataZiChan = res.data;
              this.$emit('FirstDate',this.subjectTableDataZiChan)
            }
          })
        },
        //会计科目弹框负债初始化
        accountingGetListFuZhai(){
          let params = {};
          params.parentCode = "201"
          getTableList(params).then(res => {
            if(res.code === 0){
              this.subjectTableDataFuZhai = res.data
            }
          })
        },
        //会计科目弹框共同初始化
        accountingGetListGongTong(){
          let params = {};
          params.parentCode = "301"
          getTableList(params).then(res => {
            if(res.code === 0){
              this.subjectTableDataGongTong = res.data
            }
          })
        },
        //会计科目弹框权益初始化
        accountingGetListQuanYi(){
          let params = {};
          params.parentCode = "401"
          getTableList(params).then(res => {
            if(res.code === 0){
              this.subjectTableDataQuanYi = res.data
            }
          })
        },
        //会计科目弹框成本初始化
        accountingGetListChengBen(){
          let params = {};
          params.parentCode = "501"
          getTableList(params).then(res => {
            if(res.code === 0){
              this.subjectTableDataChengBen = res.data
            }
          })
        },
        //会计科目弹框损益初始化
        accountingGetListSunYi(){
          let params = {};
          params.parentCode = "601"
          getTableList(params).then(res => {
            if(res.code === 0){
              this.subjectTableDataSunYi = res.data
            }
          })
        },

        //点击单选框获取会计科目资产
        radioChangeEventAsset({row}){
          // console.log(row)
          this.accountingSubject = row
          this.SendData = this.subjectTableDataZiChan
          this.$refs.two.clearRadioRow()
          this.$refs.three.clearRadioRow()
          this.$refs.four.clearRadioRow()
          this.$refs.five.clearRadioRow()
          this.$refs.six.clearRadioRow()
          // this.balanceDirection = row.balanceDirection;
        },
        //点击单选框获取会计科目负债
        radioChangeEventLiabilities({row}){
          this.accountingSubject = row
          this.SendData = this.subjectTableDataFuZhai
          this.$refs.one.clearRadioRow()
          this.$refs.three.clearRadioRow()
          this.$refs.four.clearRadioRow()
          this.$refs.five.clearRadioRow()
          this.$refs.six.clearRadioRow()
          // this.balanceDirection = row.balanceDirection;
        },
        //点击单选框获取会计科目共同
        radioChangeEventCommon({row}){
          this.accountingSubject = row
          this.SendData = this.subjectTableDataGongTong
          this.$refs.one.clearRadioRow()
          this.$refs.two.clearRadioRow()
          this.$refs.four.clearRadioRow()
          this.$refs.five.clearRadioRow()
          this.$refs.six.clearRadioRow()
          // this.balanceDirection = row.balanceDirection;
        },
        //点击单选框获取会计科目权益
        radioChangeEventEquity({row}){
          this.accountingSubject = row
          this.SendData = this.subjectTableDataQuanYi
          this.$refs.one.clearRadioRow()
          this.$refs.two.clearRadioRow()
          this.$refs.three.clearRadioRow()
          this.$refs.five.clearRadioRow()
          this.$refs.six.clearRadioRow()
          // this.balanceDirection = row.balanceDirection;
        },
        //点击单选框获取会计科目成本
        radioChangeEventCost({row}){
          this.accountingSubject = row
          this.SendData = this.subjectTableDataChengBen
          this.$refs.one.clearRadioRow()
          this.$refs.two.clearRadioRow()
          this.$refs.three.clearRadioRow()
          this.$refs.four.clearRadioRow()
          this.$refs.six.clearRadioRow()
          // this.balanceDirection = row.balanceDirection;
        },
        //点击单选框获取会计科目损益
        radioChangeEventProfit({row}){
          this.accountingSubject = row
          this.SendData = this.subjectTableDataSunYi
          this.$refs.one.clearRadioRow()
          this.$refs.two.clearRadioRow()
          this.$refs.three.clearRadioRow()
          this.$refs.four.clearRadioRow()
          this.$refs.five.clearRadioRow()
          // this.balanceDirection = row.balanceDirection;
        },
        //会计科目确定弹框
        SubjectConfirm(){
          if(!this.accountingSubject){
            this.$Message.error('请选择会计科目');
          } else {
            // this.data.subjectCode = this.accountingSubject;
            this.$emit('ChildContent',this.accountingSubject);
            this.$emit('SendArr',this.SendData);
            // console.log(this.accountingSubject)
            this.subjectModelShow = false
          }
        },
        showOrhideModel(v){
          if(v){
            if(this.subjectTableDataZiChan.length==0){
              this.accountingGetListZiChan();
            }
            if(this.subjectTableDataFuZhai.length==0){
              this.accountingGetListFuZhai();
            }
            if(this.subjectTableDataGongTong.length==0){
              this.accountingGetListGongTong();
            }
            if(this.subjectTableDataQuanYi.length==0){
              this.accountingGetListQuanYi();
            }
            if(this.subjectTableDataChengBen.length==0){
              this.accountingGetListChengBen();
            }
            if(this.subjectTableDataSunYi.length==0){
              this.accountingGetListSunYi();
            }
          }
        }
      },
      mounted(){
        //会计科目
        // this.accountingGetListZiChan();
        // this.accountingGetListFuZhai();
        // this.accountingGetListGongTong();
        // this.accountingGetListQuanYi();
        // this.accountingGetListChengBen();
        // this.accountingGetListSunYi();
      }
    }
</script>

<style scoped>

</style>

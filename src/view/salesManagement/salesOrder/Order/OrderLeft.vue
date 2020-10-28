<template>
  <div style="height: 100%">
    <div class="orderList">
      <h5>销售订单列表</h5>
    </div>
    <div class="orderCenter">
      <vxe-table
        class="setPadding"
        ref="currentRowTable"
        border
        align="left"
        size="mini"
        @current-change="clickOnesList"
        highlight-hover-row
        highlight-current-row
        :height="leftTableHeight"
        :data="tableData"
        resizable
      >
        <vxe-table-column type="seq" title="序号" width="40"></vxe-table-column>
        <vxe-table-column field="billStatusId" title="状态" width="50">
          <template v-slot="{ row }">
            <span>{{row.billStatusId?row.billStatusId.name:""}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column :filters="[]" :filter-method="filterOrderNo" field="serviceId" title="订单单号" width="80">
          <template v-slot="{row}">
            <div :title="row.serviceId" class="alignRight">{{row.serviceId}}</div>
          </template>
        </vxe-table-column>
        <vxe-table-column :filters="tableData" :filter-method="filterOrderNo" show-overflow field="guestName"
                          title="客户" min-width="100"></vxe-table-column>
        <vxe-table-column :filters="[]" :filter-method="filterOrderNo" field="printTimes" title="打印次数"
                          min-width="80"></vxe-table-column>
        <vxe-table-column :filters="[]" :filter-method="filterOrderNo" field="remark" title="备注" min-width="120"
                          show-overflow></vxe-table-column>
        <vxe-table-column :filters="[]" :filter-method="filterOrderNo" field="createUname" title="创建人" min-width="80"
                          show-overflow></vxe-table-column>
        <vxe-table-column show-overflow field="createTime" title="创建日期" min-width="120"></vxe-table-column>
        <vxe-table-column :filters="[]" :filter-method="filterOrderNo" field="auditor" title="提交人" min-width="80"
                          show-overflow></vxe-table-column>
        <vxe-table-column show-overflow field="auditDate" title="提交日期" min-width="120"></vxe-table-column>
        <vxe-table-column show-overflow field="orderMan" title="销售员" min-width="70"></vxe-table-column>
      </vxe-table>
    </div>
    <Page
      :total="page.total"
      :page-size="page.size"
      size="small"
      :current="page.num"
      show-sizer
      show-total
      class-name="page-con"
      @on-change="selectNum"
      @on-page-size-change="selectPage"
      :page-size-opts="[50, 100, 200]"
      class="mr10"
    >
    </Page>
  </div>
</template>

<script>
  import * as tools from "_utils/tools";
  import {getLeftList} from "@/api/salesManagment/salesOrder";

  export default {
    name: "OrderLeft",
    props: {
      queryTime: "", //时间查询
      orderType: "", //状态查询
      changeLeftList: "" //改变list
    },
    data() {
      return {
        showPerson: true,
        v: {},
        PtRow: {
          billStatusId: {enum: "", value: "0", name: "草稿"},
          orderMan: this.$store.state.user.userData.staffName,
          orderManId: this.$store.state.user.userData.id,
          new: true,
          detailList: [],
          guestId: '',
          _highlight: true,
        },
        filterGuestNameList: [],//客户
        lastGuestSelectList: [],//上次选中客户
        page: {
          total: 0,
          size: 50,
          num: 1
        },
        tableData: [],
        Flaga: true,
        selectItemId: '',
        leftTableHeight: 0,
      };
    },
    mounted() {
      // this.gitlistValue();
    },
    computed: {
      queryall() {
        return this.$store.state.dataList.orederQueryList;
      },
      getRightType() {
        return this.$store.state.dataList.leftList;
      }
    },
    methods: {

      // 新增展示
      getAdd() {
        if (this.$parent.$parent.isAdd) {
          return this.$Message.error('请先保存数据');
        }
        this.selectItemId = "";
        this.$parent.$parent.selectItemId = this.selectItemId
        for (let b of this.tableData) {
          b._highlight = false
        }
        this.tableData.unshift(this.PtRow);
        this.$refs.currentRowTable.setCurrentRow(this.tableData[0])
        this.$parent.$parent.isAdd = false
        this.$parent.$parent.isNew = false

      },
      change() {
        this.Flaga = false
      },

      showTooltipMethod({type, column, row, items, _columnIndex}) {
        const {property} = column;
        if (property === 'serviceId') {
          return row[property] ? row[property] : ''
        }
        return null
      },

      //获取表格数据
      async gitlistValue() {
        let self = tools.getSession("self");
        let showSelf = true;
        if (Reflect.has(self, "salesOrder")) {
          showSelf = self.salesOrder;
        }
        this.showPerson = showSelf ? 1 : 0;
        let data = {...this.v};
        data.startTime = data.startTime ? data.startTime : this.queryTime[0] || "";
        data.endTime = data.endTime ? data.endTime : this.queryTime[1] || "";
        data.billStatusId = this.orderType;
        data.showPerson = this.showPerson;
        let page = this.page.num - 1;
        let size = this.page.size;
        let res = await getLeftList(page, size, data);
        if (res.code === 0) {
          this.tableData = (res.data.content || []).map(el => {
            this.lastGuestSelectList = Array.from(new Set(this.lastGuestSelectList));
            console.log(el, this.lastGuestSelectList, 111111)
            if (this.lastGuestSelectList.length < 1) {
              this.lastGuestSelectList.map(el2 => {
                console.log(el, 11111)
                if (el.guestId == el2.guestId) {
                  el.checked = true;
                  return el;
                } else {
                  el.checked = false;
                }
              })
            } else {
              console.log(el, 111112)
              return el;
            }
          })
          // this.tableData = res.data.content;
          this.setFilterArr(res.data.content || [])

          this.page.total = res.data.totalElements;
          this.$store.commit("setOneOrder", {});
          //筛选出当前操作的是第几条并选中
          if (this.selectItemId) {
            let num = 0
            this.tableData.forEach((item, index) => {
              if (item.id == this.selectItemId) {
                num = index
              }
            })
            this.$refs.currentRowTable.setCurrentRow(this.tableData[num]);
            this.$emit("getOneOrder", this.tableData[num]);
            this.$store.commit("setOneOrder", this.tableData[num]);
            //     break;
          }

          //如果没有保存过的数据取第一条选中
          if (!this.selectItemId && this.tableData.length > 0) {
            this.$refs.currentRowTable.setCurrentRow(this.tableData[0]);
            this.$emit("getOneOrder", this.tableData[0]);
            this.$store.commit("setOneOrder", this.tableData[0]);
            this.selectItemId = this.tableData[0].id;
            this.$parent.$parent.selectItemId = this.tableData[0].id;
          }
        }
      },

      returnData(rData, cos) {
        let arrData = [];
        let arr = rData.map(el => el[cos]);
        let set = new Set(arr);
        set.forEach(el => {
          arrData.push({label: el, value: el});
        });
        this.$nextTick(() => {
          const xtable = this.$refs.currentRowTable;
          const column = xtable.getColumnByField(cos);
          xtable.setFilter(column, arrData);
          xtable.updateData();
        });
      },

      setFilterArr(rData) {
        this.returnData(rData, 'serviceId');
        this.returnData(rData, 'guestName');
        this.returnData(rData, 'remark');
        this.returnData(rData, 'createUname');
        this.returnData(rData, 'auditor');
        this.returnData(rData, 'printTimes');
      },


      //切换页面
      selectNum(val) {
        this.selectItemId = ''
        this.$parent.$parent.selectItemId = "";
        this.page.num = val;
        this.gitlistValue();
      },
      //切换页数
      selectPage(val) {
        this.selectItemId = ''
        this.$parent.$parent.selectItemId = "";
        this.page.num = 1;
        this.page.size = val;
        this.gitlistValue();
      },
      //点击获取当前信息
      clickOnesList(data) {
        if (data) {
          this.selectItemId = data.row.id;
          this.$parent.$parent.selectItemId = data.row.id
        }
        this.$parent.$parent.ispart = false;
        if (data.row == null) return;
        let currentRowTable = this.$refs["currentRowTable"];
        if (!this.Flaga && this.$parent.$parent.isAdd) {
          this.$Modal.confirm({
            title: '您正在编辑单据，是否需要保存',
            onOk: () => {
              currentRowTable.clearCurrentRow();
              this.$emit('refresh', '你好！');
              this.Flaga = false;
              this.$parent.$parent.isAdd = false
            },
            onCancel: () => {
              this.$parent.$parent.isAdd = false;
              this.$parent.$parent.isNew = true;
              this.tableData.splice(0, 1);
              currentRowTable.clearCurrentRow();
              for (let i in this.tableData) {
                if (this.tableData[i].id == this.selectItemId) {
                  this.$refs.currentRowTable.setCurrentRow(this.tableData[i])
                  this.$emit("getOneOrder", this.tableData[i]);
                  this.$store.commit("setOneOrder", this.tableData[i]);
                  break;
                }
              }
            },
          })
        } else {
          if (data.row.id) {
            this.selectItemId = data.row.id;
            this.$parent.$parent.selectItemId = data.row.id;
          }
          this.$emit("getOneOrder", data.row);
          this.$store.commit("setOneOrder", data.row);
        }
      },
      filterOrderNo({value, row, column}) {
        let {property} = column;
        if (!value) {
          return !row[property]
        }
        if (property == 'guestName' && row[property].indexOf(value) > -1) {
          this.lastGuestSelectList.push(row);
        }
        if (row[property]) {
          return row[property].indexOf(value) > -1;
        } else {
          return false
        }
      },
    },
    watch: {
      //监听时间
      queryTime: function (val, old) {
        this.page.num = 1;
        // this.page.size = 10;
        this.gitlistValue();
      },
      //监听状态
      orderType: function (val, old) {
        this.page.num = 1;
        // this.page.size = 10;
        this.gitlistValue();
      },
      //更多搜索
      // queryall: {
      //   handler(v, ov) {
      //     v.showPerson = v.showPerson ? 1 : 0;
      //     this.page.num = 1;
      //     // this.page.size = 10;
      //     let page = this.page.num - 1;
      //     let size = this.page.size;
      //     getLeftList(page, size, v).then(res => {
      //       if (res.code === 0) {
      //         // res.data.content.map( item => {item.billStatusId = JSON.parse(item.billStatusId)})
      //         this.tableData = res.data.content;
      //         this.page.total = res.data.totalElements;
      //       }
      //     });
      //   },
      //   deep: true
      // },
      //改变左侧list
      changeLeftList: {
        handler(v, ov) {
          this.page.num = 1;
          this.page.size = 10;
          this.gitlistValue();
        },
        deep: true
      },
      //右侧保存 提交
      getRightType: {
        handler(v, ov) {
          if (v.code === 0) {
            this.page.num = 1;
            // this.page.size = 10;
            this.gitlistValue();
          }
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="less">
  .orderList {
    line-height: 30px;
    padding-left: 10px;
    /*border-bottom: 1px solid #dcdee2;*/
    background-color: #f8f8f8;
  }

  .orderCenter {
  }

</style>
<style lang="less">

</style>

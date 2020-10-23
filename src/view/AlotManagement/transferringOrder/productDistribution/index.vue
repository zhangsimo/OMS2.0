<template>
  <div class="content-oper content-oper-flex">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <!--<Input v-model="form.queryCode" placeholder="配件编码" style="width: 160px" class="mr10" />-->
            <Input
              v-model="form.fullName"
              placeholder="配件编码/名称"
              style="width: 160px"
              class="mr10"
            />
            <Select
              v-model="form.partBrandCode"
              class="w200 mr10"
              filterable
              clearable
              placeholder="--品牌--"
            >
              <Option
                v-for="item in quickArray"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Select v-model="form.storeId" class="w150 mr10" clearable>
              <Option
                v-for="item in storeArray"
                :disabled="item.isDisabled"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div class="db mr10">
            <Button type="warning" class="mr20" @click="queryFun()">
              <Icon custom="iconfont iconchaxunicon icons" />查询
            </Button>
          </div>
          <div class="db mr10">
            <Button class="mr20" v-has="'number'" @click="suoding"
              >锁定数量调整</Button
            >
            <Modal v-model="modal1" title="锁定数量调整">
              <i-form
                :model="formItem"
                :label-width="80"
                style="padding: 0 40px"
              >
                <Form-item label="配件编码:">
                  <i-input
                    :value.sync="formItem.partCode"
                    disabled
                    placeholder="请输入"
                  ></i-input>
                </Form-item>
                <Form-item label="配件名称:">
                  <i-input
                    :value.sync="formItem.partName"
                    disabled
                    placeholder="请输入"
                  ></i-input>
                </Form-item>
                <Form-item label="品牌:">
                  <i-input
                    :value.sync="formItem.partBrandName"
                    disabled
                    placeholder="请输入"
                  ></i-input>
                </Form-item>
                <Form-item label="库存数量:">
                  <i-input
                    :value.sync="formItem.stockId"
                    disabled
                    placeholder="请输入"
                  ></i-input>
                </Form-item>
                <Form-item label="可售数量:">
                  <i-input
                    :value.sync="formItem.outableQty"
                    disabled
                    placeholder="请输入"
                  ></i-input>
                </Form-item>
                <Form-item label="锁定数量:">
                  <i-input
                    v-model="formItem.lockQty"
                    placeholder="请输入"
                  ></i-input>
                </Form-item>
              </i-form>
              <div slot="footer">
                <Row>
                  <i-col span="12">
                    <i-button type="primary" @click="update">确认</i-button>
                  </i-col>
                  <i-col span="12">
                    <i-button style="margin-left: 8px" @click="modal1 = false"
                      >取消</i-button
                    >
                  </i-col>
                </Row>
              </div>
            </Modal>
          </div>
          <!-- <div class="db mr10">
            <Button class="mr20" >导出</Button>
          </div>-->
        </div>
      </div>
    </section>

    <section class="con-box">
      <!--         上表格-->
      <div class="topTableDate" style="height:45%">
        <vxe-table
          border
          resizable
          size="mini"
          height="auto"
          ref="topTable"
          highlight-current-row
          highlight-hover-row
          @current-change="currentChangeEvent"
          :data="TopTableData"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-table-column type="seq" title="序号"></vxe-table-column>

          <vxe-table-column
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column
            field="partBrandName"
            title="品牌"
          ></vxe-table-column>

          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="oemCode" title="OE码"></vxe-table-column>
          <vxe-table-column
            field="carBrandModel"
            title="品牌车型"
          ></vxe-table-column>
          <vxe-table-column field="spec" title="规格"></vxe-table-column>
          <vxe-table-column title="方向"></vxe-table-column>
          <vxe-table-column
            field="stockQty"
            title="库存数量"
          ></vxe-table-column>
          <vxe-table-column
            field="outableQty"
            title="可售数量"
          ></vxe-table-column>
          <vxe-table-column field="lockQty" title="锁定数量"></vxe-table-column>
          <vxe-table-column
            field="pchRoadQty"
            title="采购在途数量"
          ></vxe-table-column>
          <vxe-table-column
            field="createTime"
            title="创建日期"
          ></vxe-table-column>
          <vxe-table-column
            field="pastTime"
            title="结束日期"
          ></vxe-table-column>
        </vxe-table>
      </div>

      <!--     分页-->
      <Row class="mt10 mb10">
        <Col span="12">
          <div>
            <Button :loading="oneLoading" :disabled="BottomTableData.length==0" type="warning" class="mr20" @click="oneClickDis">一键分配</Button>
          </div>
        </Col>
        <Col span="12"  style="text-align:right">
          <div>
            <Page
              :current="pageList.page"
              :total="pageList.total"
              :page-size="pageList.size"
              :page-size-opts="pageSizeOpts"
              show-sizer
              @on-change="changePage"
              @on-page-size-change="changeSize"
            />
          </div>
        </Col>
      </Row>
      <!--        下表格-->
      <div class="bottomTableDate" style="height:45%">
        <vxe-table
          ref="hasTable"
          border
          resizable
          :loading="oneLoading"
          size="mini"
          height="auto"
          highlight-current-row
          highlight-hover-row
          :data="BottomTableData"
          keep-source
          :edit-rules="validRules"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          show-footer
          :footer-method="footerMethod"
        >
          <vxe-table-column type="seq" title="序号"></vxe-table-column>

          <vxe-table-column title="操作" width="180">
            <template v-slot="{ row }">
              <Button type="text" @click="sureBaocunsave(row)">保存</Button>
              <Button type="text" @click="sureBaocunfenpei(row)"
                >分配完成</Button
              >
            </template>
          </vxe-table-column>

          <vxe-table-column field="guestName" title="申请方"></vxe-table-column>
          <vxe-table-column
            field="serviceId"
            title="调拨申请单号"
            width="100"
          ></vxe-table-column>
          <vxe-table-column
            field="partCode"
            title="配件编码"
          ></vxe-table-column>
          <vxe-table-column
            field="partName"
            title="配件名称"
          ></vxe-table-column>
          <vxe-table-column
            field="auditDate"
            title="提交日期"
          ></vxe-table-column>
          <vxe-table-column
            field="applyQty"
            title="申请数量"
          ></vxe-table-column>
          <vxe-table-column
            field="hasAcceptQty"
            title="分配数量"
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
          ></vxe-table-column>
          <vxe-table-column
            field="hasCancelQty"
            title="缺货数量"
          ></vxe-table-column>
        </vxe-table>
      </div>
    </section>
  </div>
</template>

<script>
import "../../../lease/product/lease.less";
import "../../../goods/goodsList/goodsList.less";
import { getPartBrand } from "@/api/business/stockSearch";
import {
  getcangku,
  genxin,
  jinqiaopinliebiao,
  baocun,
  shenqingdanliebiao,
  daochu,
  hotProductsSave,
  oneDis
} from "../../../../api/AlotManagement/productDistribution.js";
export default {
  name: "productDistribution",
  data() {
    const hasAcceptQtyValid = ({ cellValue,row }) =>{
      return new Promise((resolve, reject) => {
        if(cellValue==""){
          reject(new Error(`分配数量不能为空`));
        }else if((parseInt(cellValue) > parseInt(row.applyQty))) {
          reject(new Error(`分配数量不能大于申请数量`))
        } else {
          resolve()
        }
      })
    }
    return {
      rowStatus: "",
      idValue: "",
      modal1: false,
      modal2: false,
      storeArray: [],
      //锁定弹窗
      formItem: {
        partCode: "",
        partName: "",
        partBrandName: "",
        stockId: "",
        occupyQty: "",
        lockQty: ""
      },
      //搜索
      form: {
        pageNumber: 0,
        size: 10,
        queryCode: "",
        fullName: "",
        partBrandCode: "",
        storeId: ""
      },
      // 快速查询-品牌
      quickArray: [],

      // 代销售条件查询
      penSalesData: {
        character: "", // 快速查询
        company: "", //公司选择
        customer: "" //客户
      },
      customerListOptions: [], //选择客户下拉列表
      companyListOptions: [], //选择公司下拉列表
      TopTableData: [], //上侧表格list
      BottomTableData: [], //下侧表格list
      // 分页数据
      pageList: {
        page: 1,
        total: 0,
        size: 20,
      },
      pageSizeOpts: [20, 40, 60, 80, 100],
      pageTotal: 10,
      fenpeiCurrent: {},
      validRules: {
        hasAcceptQty: [
          { validator: hasAcceptQtyValid}
        ]
      },
      //一键分配loading
      oneLoading:false
    };
  },
  created() {
    this.searchPartBrand();
    // this.getList();
    setTimeout(() => {
      this.search(this.form);
    }, 1000);
  },
  methods: {
    footerMethod({ columns, data }){
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['applyQty','hasAcceptQty','hasCancelQty'].includes(column.property)) {
            let totals = data.reduce((prev,cur) => {
              if(!isNaN(Number(cur[column.property]))){
                return prev+parseFloat(cur[column.property])
              }else{
                return prev+0
              }
            },0)
            return totals
          }
          return null
        })
      ]
    },

    //获取配件品牌
    searchPartBrand() {
      let data = { pageSize: 10000 };
      getPartBrand(data)
        .then(res => {
          if (res.code == 0) {
            let arr = [];
            let arrData = res.data.content || [];
            arrData.forEach(item => {
              arr.push(...item.children);
            });
            arr.forEach(element => {
              this.quickArray.push({
                value: element.id,
                label: element.name
              });
            });
          }
        })
        .catch(e => {
          this.$Message.info("获取配件品牌失败");
        });
      getcangku()
        .then(res => {
          if (res.code == 0) {
            res.data.forEach(element => {
              this.storeArray.push({
                value: element.id,
                label: element.name,
                isDisabled: element.isDisabled
              });
            });
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].isDefault == true) {
                this.form.storeId = res.data[i].id;
                // this.idValue = res.data[i].id;
              }
            }
          }
        })
        .catch(e => {
          this.$Message.info("获取仓库失败");
        });
    },

    queryFun(){
      this.pageList.page = 1;
      this.search(this.form)
    },


    search(params) {
      let req = {...params, ...this.pageList};
      req.page = req.page-1;
      // params.storeId = this.idValue;
      jinqiaopinliebiao(req)
        .then(res => {
          if (res.code == 0) {
            this.TopTableData = res.data.content || [];
            this.pageList.total = res.data.totalElements;
            if(this.formItem.hasOwnProperty("id")){
              for(let b of this.TopTableData){
                if(b.id == this.formItem.id ){
                  this.$refs.topTable.setCurrentRow(b);
                  this.currentChangeEvent({row:b});
                }
              }
            }else{
              if(this.TopTableData.length==0){
                return
              }
              this.$refs.topTable.setCurrentRow(this.TopTableData[0]);
              this.currentChangeEvent({row:this.TopTableData[0]});
            }
          }
        })
        .catch(e => {
          this.$Message.info("获取列表信息失败失败");
        });
    },
    changePage(p) {
      this.pageList.page = p;
      this.search(this.form);
    },
    changeSize(s) {
      this.pageList.page = 1;
      this.pageList.size = s;
      this.search(this.form);
    },
    // save
    sureBaocunsave(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>是否保存</p>",
        onOk: () => {
          this.baocunsave(row);
        }
      });
    },
    baocunsave(row) {
      if (row.hasAcceptQty === "") {
        this.$Message.info("请输入分配数");
        return;
      }
      if(parseInt(row.hasAcceptQty) > parseInt(row.applyQty)) {
        return this.$Message.info("分配数量不能大于申请数量");
      }
      if(parseInt(row.hasAcceptQty) > parseInt(this.formItem.lockQty)) {
        return this.$Message.info("分配数量不能大于锁定数量");
      }
      hotProductsSave(row)
        .then(res => {
          if (res.code == 0) {
            // this.BottomTableData = res.data || [];
            this.BottomTableData = [];
            // let item = this.$refs.topTable.getCurrentRecord();
            // this.currentChangeEvent({ row: item });
            this.search(this.form)
          }
        })
        .catch(e => {
          this.$Message.info("保存失败");
        });
    },
    //确认分配完成
    sureBaocunfenpei(row) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>是否确定分配完成</p>",
        onOk: () => {
          this.baocunfenpei(row);
        }
        // onCancel: () => {
        //     this.$Message.info('Clicked cancel');
        // }
      });
    },
    baocunfenpei(row) {
      if (row.hasAcceptQty === "") {
        this.$Message.info("请输入分配数");
        return;
      }
      if(parseInt(row.hasAcceptQty) > parseInt(row.applyQty)) {
        return this.$Message.info("分配数量不能大于申请数量");
      }
      if(parseInt(row.hasAcceptQty) > parseInt(this.formItem.lockQty)) {
        return this.$Message.info("分配数量不能大于锁定数量");
      }
      baocun(row)
        .then(res => {
          if (res.code == 0) {
            this.BottomTableData = res.data || [];
            this.BottomTableData = [];
            // let item = this.$refs.topTable.getCurrentRecord();
            // this.currentChangeEvent({ row: item });
            this.search(this.form)
          }
        })
        .catch(e => {
          this.$Message.info("保存失败");
        });
    },
    update() {
      // 更新列表信息
      this.formItem.storeId = this.form.storeId;
      this.formItem.lockQty = (this.formItem.lockQty * 1).toFixed(2);
      genxin(this.formItem)
        .then(res => {
          if (res.code == 0) {
            // 获取列表
            this.formItem = {
              partCode: "",
              partName: "",
              partBrandName: "",
              stockId: "",
              occupyQty: "",
              lockQty: ""
            };
            this.modal1 = false;
            this.search(this.form);
          }
        })
        .catch(e => {
          this.$Message.info("更新锁定数量失败");
        });
    },
    suoding() {
      if (!this.formItem.partCode) {
        this.$Message.info("请先点击列表选择更改项");
        return;
      }
      this.modal1 = true;
    },
    currentChangeEvent({ row }) {
      if (row.partCode) {
        this.formItem = row;
        this.rowStatus = row;
        this.formItem.stockId = row.stockQty;
        this.getList();
      } else {
        this.$Message.info("没有当前行");
      }
    },
    getList() {
      const params = {
        partId: this.rowStatus.partId
      };
      shenqingdanliebiao(params)
        .then(res => {
          if (res.code == 0) {
            this.BottomTableData = res.data || [];
          }
        })
        .catch(e => {
          this.$Message.info("请求紧悄品待分配列表失败");
        });
    },
    async oneClickDis(){
      const errMap = await this.$refs.hasTable.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      let totalHasQty = this.BottomTableData.reduce((total,curr)=>{
        if(!isNaN(Number(curr.hasAcceptQty))){
          return total + Number(curr.hasAcceptQty)
        }
      },0);

      if(totalHasQty>parseInt(this.formItem.lockQty)) {
        return this.$Message.error("分配数量不能大于锁定数量");
      }
      this.oneLoading = true;
      const rep = await oneDis(this.BottomTableData);
      this.oneLoading = false;
      if(rep.code==0){
        this.$Message.success("分配成功");
        this.search(this.form);
      }

    }
  }
};
</script>

<style scoped></style>

<template>
  <div class="content-oper">
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>产品名称：</span>
            <Input v-model="searchValue" placeholder="请填写产品名称" class="w200 mr10" />
            <Button type="warning" @click="search" class="mr10 w90">
              <i class="iconfont mr5 iconchaxunicon"></i>查询
            </Button>
            <Button v-has="'add'" class="mr10 w90" @click="addPro">
              <Icon type="md-add" />新增
            </Button>
            <Button v-has="'change'" class="mr10 w90" @click="editPro">
              <i class="iconfont mr5 iconbianjixiugaiicon"></i>修改
            </Button>
            <Button v-has="'resource'" @click="linkProMadel" class="mr10">
              <i class="iconfont mr5 iconchakanchanpinicon"></i>相关产品资源
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <Table
        class="table-highlight-row"
        @on-current-change="selectTabelData"
        size="small"
        highlight-row
        :loading="loading"
        border
        :stripe="true"
        :columns="columns"
        :data="tbdata"
      ></Table>
      <Page
        class-name="page-con"
        :current="page.num"
        :total="page.total"
        :page-size="page.size"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-sizer
        show-total
      ></Page>
    </section>

    <Modal v-model="linkModal" title="产品资源" width="1250">
      <div class="lease-model-body">
        <Split v-model="split1" min="400" max="500">
          <div slot="left" class="lease-model-left">
            <div class="model-left-hd flex">
              <Button @click="getLeasesaveProductFun" class="mr10 w90">
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
              <Button @click="inHideShow(false)" class="mr10">
                <i class="iconfont iconkuodaicon"></i>
              </Button>
              <Button @click="inHideShow(true)" class="mr10">
                <i class="iconfont iconsuoxiaoicon"></i>
              </Button>
              <Input v-model="searchValue" placeholder="请填写产品名称" class="w150 mr10" clearable />
              <Button type="warning" @click="getLeaseSelect" class="w90">
                <i class="iconfont mr5 iconchaxunicon"></i>查询
              </Button>
            </div>
            <Tree :data="treeData" show-checkbox @on-check-change="selectTree"></Tree>
          </div>
          <div slot="right" class="lease-model-right">
            <div class="model-left-hd flex">
              <Input v-model="selectTable.id" class="w180 mr10" clearable />
              <Input v-model="selectTable.resId" placeholder="资源ID" class="w150 mr10" clearable />
              <Button type="default" @click="getProductDetailFun" class="mr10 w90">
                <i class="iconfont mr5 iconshuaxinicon"></i>刷新
              </Button>
              <Button type="default" @click="addDelList" class="mr10 w90">
                <i class="iconfont mr5 iconlajitongicon"></i>删除
              </Button>
              <Button type="default" @click="saveData" class="mr10 w90">
                <i class="iconfont mr5 iconbaocunicon"></i>保存
              </Button>
              <Button type="default" @click="linkModal = false" class="w90">
                <Icon type="md-close" />取消
              </Button>
            </div>
            <Table
              height="347"
              @on-selection-change="selectDetailFun"
              size="small"
              :loading="linkloading"
              border
              :stripe="true"
              :columns="columns2"
              :data="tbdata2"
            ></Table>
          </div>
        </Split>
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="proModal" :title="proModalTit" width="600">
      <Form ref="proModal" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <Row>
          <Col span="11">
            <FormItem label="产品名称：" prop="name">
              <Input v-model="formValidate.name" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="产品类型：" prop="type">
              <Select v-model="formValidate.type">
                <Option v-for="item in proType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.type==1">
          <Col span="22">
            <FormItem label="接口地址：" prop="address">
              <Input v-model="formValidate.address" />
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.type==1">
          <Col span="11">
            <FormItem label="单次扣减华币：" prop="coin">
              <Input v-model="formValidate.coin" />
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formValidate.type!=1">
          <Col span="11">
            <FormItem label="销售价：" prop="salesPrice">
              <Input v-model="formValidate.salesPrice" />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="有效期(天)：" prop="isCycle">
              <Input v-model="formValidate.isCycle" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="产品描述：" prop="remark">
              <Input
                v-model="formValidate.remark"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="是否禁用：" prop="disable">
              <Select v-model="formValidate.disable" placeholder="Select your city">
                <Option
                  :value="item.value"
                  v-for="(item,index) in disableArr"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('proModal')">确定</Button>
        <Button type="default" @click="proModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import "./lease.less";
import {
  getLeaseProlist,
  saveProduct,
  getProductDetail,
  deleteAndChange,
  getLeasesaveProduct
} from "../../../api/lease/leaseApi";
import { proTypeList } from "./prolist";
import { getOmsAuth } from "../../../api/lease/tenantres";

export default {
  name: "prolist",
  inject: ["reload"],
  data() {
    let price = (rule, value, callback) => {
      if (!value) {
        callback(new Error("单次扣减华币不能为空"));
      } else {
        if (!/[^\d.]/g.test(value)) {
          if (/[.]/g.test(value)) {
            let reg = /^\d+\.\d{1,2}$/;
            if (!reg.test(value)) {
              callback("请输入正确格式");
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback("请输入数字格式");
        }
      }
    };
    let price2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("销售价不能为空"));
      } else {
        if (!/[^\d.]/g.test(value)) {
          if (/[.]/g.test(value)) {
            let reg = /^\d+\.\d{1,2}$/;
            if (!reg.test(value)) {
              callback("请输入正确格式");
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback("请输入数字格式");
        }
      }
    };
    let valDay = (rule, value, callback) => {
      if (!value) {
        callback(new Error("有效期不能为空"));
      } else {
        if (!/[^\d.]/g.test(value)) {
          if (/[.]/g.test(value)) {
            let reg = /^\d+\.\d{1}$/;
            if (!reg.test(value)) {
              callback("请输入正确格式");
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else {
          callback("请输入数字格式");
        }
      }
    };
    return {
      // objData:{},
      reqData: [],
      linkModal: false,
      proModal: false,
      proModalTit: "",
      split1: 0.4,
      searchValue: "",
      dateTime: "",
      treeData: [],
      formValidate: {
        name: "",
        type: 0,
        salesPrice: "",
        isCycle: "",
        remark: "",
        disable: 1,
        address: "",
        coin: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        salesPrice: [{ required: true, validator: price2, trigger: "blur" }],
        remark: [
          { max: 200, message: "产品描述不超过200个字", trigger: "blur" }
        ],
        isCycle: [{ required: true, validator: valDay, trigger: "blur" }],
        address: [
          { required: true, message: "接口地址不能为空", trigger: "blur" }
        ],
        coin: [
          {
            required: true,
            // validator:price,
            message: "只能输入整数",
            pattern: /^[0-9]+$/,
            trigger: "blur"
          }
        ]
      },
      proType: proTypeList() || [],
      disableArr: [
        {
          label: "是",
          value: 0
        },
        {
          label: "否",
          value: 1
        }
      ],
      page: {
        num: 1,
        size: 10,
        total: 0
      },
      loading: false,
      linkloading: false,
      columns: [
        {
          title: "产品ID",
          minWidth: 180,
          key: "id"
        },
        {
          title: "选择",
          key: "venderSkuNo",
          minWidth: 50,
          render: (h, params) => {
            return h("span", {
              class: "table-radio"
            });
          }
        },
        {
          title: "产品名称",
          key: "name",
          minWidth: 170
        },
        {
          title: "产品类型",
          key: "type",
          minWidth: 100,
          render: (h, params) => {
            let objType = params.row.type || 0;
            return h("span", this.proTypeListItem(objType));
          }
        },
        {
          title: "接口地址",
          key: "address",
          minWidth: 200
        },
        {
          title: "有效期（天）",
          key: "isCycle",
          minWidth: 90
        },
        {
          title: "销售价",
          key: "salesPrice",
          minWidth: 70
        },
        {
          title: "是否禁用",
          key: "disable",
          minWidth: 70,
          render: (h, params) => {
            let objType = params.row.isDisabled || 0;
            return h("span", objType == 1 ? "否" : "是");
          }
        },
        {
          title: "产品描述",
          key: "remark",
          minWidth: 200
        },
        {
          title: "创建人",
          align: "center",
          key: "createUname",
          minWidth: 100
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 170
        },
        {
          title: "修改人",
          key: "updateUname",
          minWidth: 100
        },
        {
          title: "修改时间",
          key: "updateTime",
          minWidth: 170
        }
      ],
      tbdata: [],
      columns2: [
        {
          title: "产品ID",
          minWidth: 60,
          key: "id",
          type: "selection"
        },
        {
          title: "内码",
          minWidth: 60,
          key: "productId"
        },
        {
          title: "产品内码",
          minWidth: 60,
          key: "id",
          render: (h, params) => {
            return h("span", this.selectTable.id);
          }
        },
        {
          title: "资源内码",
          minWidth: 60,
          key: "resId"
        },
        {
          title: "资源类型",
          minWidth: 60,
          key: "resType"
        },
        {
          title: "资源名称",
          minWidth: 60,
          key: "resName"
        },
        {
          title: "资源路径",
          minWidth: 60,
          key: "resUrl"
        },
        {
          title: "类型",
          minWidth: 60,
          key: "type",
          render: (h, params) => {
            let type = params.row.type || 0;
            return h("span", type == 1 ? "pc" : "app");
          }
        },
        {
          title: "资源父ID",
          minWidth: 60,
          key: "resParentId"
        },
        {
          title: "启用",
          minWidth: 60,
          key: "id",
          render: (h, params) => {
            let isDisabled = params.row.disable || 0;
            return h("Checkbox", {
              props: { value: isDisabled === 0 ? true : false },
              on: {
                "on-change": value => {
                  if (value) {
                    this.tbdata2[params.index].disable = 0;
                    // console.log(this.tbdata2,'this.tbdata2')
                  } else {
                    this.tbdata2[params.index].disable = 1;
                  }
                }
              }
            });
          }
        },
        {
          title: "范围域",
          minWidth: 60,
          key: "id"
        }
      ],
      tbdata2: [],
      selectTable: {},
      selectDetailArr: [],
      //编辑数据列表
      changeList: [],
      //删除数据列表
      delList: [],
      //选中的树形
      selectTreeData: [],
      orginTree:[]
    };
  },
  mounted() {
    this.initStart();
  },
  methods: {
    initStart() {
      this.getList();
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let objReq = {};
          objReq.name = this.formValidate.name;
          objReq.type = this.formValidate.type;
          objReq.remark = this.formValidate.remark;
          objReq.isDisabled = this.formValidate.disable;
          if (objReq.type === 0) {
            objReq.salesPrice = this.formValidate.salesPrice;
            objReq.isCycle = this.formValidate.isCycle;
          } else {
            objReq.address = this.formValidate.address;
            objReq.coin = this.formValidate.coin;
          }
          if (this.proModalTit == "编辑产品") {
            objReq.id = this.formValidate.id;
          }

          saveProduct(objReq).then(res => {
            if (res.code == 0) {
              this.proModal = false;
              this.$Message.success("添加成功");
              this.getList();
            }
          });
        }
      });
    },
    //初始化
    getList() {
      const params = {};
      let searchValue = this.searchValue.trim();
      if (searchValue) {
        params.name = searchValue;
      }
      // params.page = this.page.num - 1
      // params.size = this.page.size
      let page = this.page.num - 1;
      let size = this.page.size;
      this.loading = true;
      getLeaseProlist(page, size, params).then(res => {
        this.selectTable = {};
        this.loading = false;
        if (res.code == 0) {
          this.tbdata = res.data.content || [];
          this.page.total = res.data.totalElements;
        }
      });
    },
    //新增产品
    addPro() {
      this.proModal = true;
      this.proModalTit = "新增产品";
      this.$refs["proModal"].resetFields();
    },
    //编辑产品
    editPro() {
      this.$refs["proModal"].resetFields();
      if (this.selectTable.id) {
        this.proModal = true;
        this.proModalTit = "编辑产品";
        this.formValidate.name = this.selectTable.name;
        this.formValidate.type = this.selectTable.type;
        this.formValidate.salesPrice = this.selectTable.salesPrice;
        this.formValidate.isCycle = this.selectTable.isCycle;
        this.formValidate.remark = this.selectTable.remark;
        this.formValidate.address = this.selectTable.address;
        this.formValidate.coin = this.selectTable.coin;
        this.formValidate.id = this.selectTable.id;
        this.formValidate.disable = this.selectTable.isDisabled;
        // console.log(this.formValidate.disable)
      } else {
        this.$Message.error("请选择要修改的数据！");
      }
    },
    // 弹框左侧查询
    getLeaseSelect() {
      this.treeData = JSON.parse(JSON.stringify(this.orginTree))
      this.findTree(this.treeData,this.searchValue)
    },
    findTree(tree, content) {
      let reg = new RegExp(content, "gi");
      let remove = [];
      let filter = (tree, index, remove) => {
        if (Array.isArray(tree.children) && tree.children.length > 0) {
          let inarr = [];
          tree.children.forEach((el, i) => {
            filter(el, i, inarr);
          });
          if (!reg.test(tree.title)) {
            for (let j = inarr.length - 1; j >= 0; j--) {
              tree.children.splice(inarr[j], 1);

            }
            if (tree.children.length === 0) {
              remove.push(index);
            }
          }
        } else {
          if (!reg.test(tree.title)) {
            remove.push(index);
          }
        }
      };
      tree.forEach((el, index) => {
        filter(el, index, remove);
      });
      for (let j = remove.length - 1; j >= 0; j--) {
        tree.splice(remove[j], 1);
      }
    },

    //相关产品资源
    linkProMadel() {
      if (this.selectTable.id) {
        this.linkModal = true;
        getOmsAuth().then(res => {
          if (res.code == 0) {
            let arrData = res.data.childs || [];
            this.treeData = this.resetTreeData(arrData);
            this.orginTree = JSON.parse(JSON.stringify(this.treeData));
          }
        });
        this.getProductDetailFun();
      } else {
        this.$Message.error("请选择要关联的数据！");
      }
    },
    getProductDetailFun() {
      getProductDetail({
        id: this.selectTable.id,
        resId: this.selectTable.resId
      }).then(res => {
        if (res.code == 0) {
          this.tbdata2 = res.data || [];
        }
      });
    },
    resetTreeData(treeData) {
      treeData.map(item => {
        item.expand = false;
        item.children = item.childs || [];
        if (item.childs && item.childs.length > 0) {
          this.resetTreeData(item.childs);
        }
      });
      return treeData;
    },

    //分页
    changePage(val) {
      this.page.num = val;
      this.getList();
    },
    changeSize(val) {
      this.page.num = 1;
      this.page.size = val;
      this.getList();
    },
    //搜索
    selectDate(date) {
      this.dateTime = date;
      this.search();
    },
    search() {
      this.page.num = 1;
      this.getList();
    },
    //树形展开收缩
    inHideShow(isB) {
      this.hideShow(isB, this.treeData);
    },
    hideShow(isB, treeData) {
      treeData.map(item => {
        item.expand = !isB;
        if (item.children && item.children.length > 0) {
          this.hideShow(isB, item.children);
        }
      });
    },
    //表格单选选中
    selectTabelData(v) {
      this.selectTable = v;
    },
    selectTree(v) {
      this.selectTreeData = v;
    },
    //表格详情选中
    selectDetailFun(v) {
      this.selectDetailArr = v;
    },
    //删除本地详情
    addDelList() {
      if (this.selectDetailArr.length > 0) {
        this.selectDetailArr.map(item => {
          this.tbdata2.map((v, i) => {
            if (item.id == v.id) {
              this.tbdata2.splice(i, 1);
            }
          });
        });
        this.delList = this.delList.concat(this.selectDetailArr);
        // console.log(this.delList,'this.delList =>596')
      } else {
        this.$Message.error("请选择要删除的数据！");
      }
    },
    //保存详情
    saveData() {
      this.changeList = this.changeList.concat(this.tbdata2);
      // console.log(this.changeList,'this.changeList =>607')
      let request = {
        changeList: this.changeList,
        delList: this.delList
      };
      deleteAndChange(request).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功！");
          this.getProductDetailFun();
        }
      });
    },
    getLeasesaveProductFun() {
      if (this.selectTreeData.length > 0) {
        let arrData = this.selectTreeData.filter(
          item => item.children.length == 0
        );
        if (arrData.length > 0) {
          // let reqData = []
          // arrData.map(item => {
          //   objData.productId = this.selectTable.id;
          //   objData.resId = item.id;
          //   objData.resName = item.title;
          //   objData.resParentId = item.parentId;
          //   objData.resType = item.resType;
          //   objData.resUrl = "";
          //   objData.type = 1;
          //   this.reqData.push(objData)
          // })
          // console.log(arrData,'arrData')
          for (var i = 0; i < arrData.length; i++) {
            var objData = {};
            objData.productId = this.selectTable.id;
            objData.resId = arrData[i].id;
            objData.resName = arrData[i].title;
            objData.resParentId = arrData[i].parentId;
            objData.resType = arrData[i].resType;
            objData.resUrl = arrData[i].urlMatcher;
            objData.type = arrData[i].resType;
            objData.scope = 0;
            this.reqData.push(objData);
          }
          // console.log(this.reqData,'arrData =>629')
          getLeasesaveProduct(this.reqData).then(res => {
            if (res.code == 0) {
              this.$Message.success("添加成功！");
              this.getProductDetailFun();
              this.reqData = [];
            }
          });
        }
      } else {
        this.$Message.error("请选择要关联的资源！");
      }
    },
    proTypeListItem(v) {
      return proTypeList(v);
    }
  },
  computed: {
    placeh() {
      let returnText = "";
      this.searchTypeArr.filter(item => {
        if (item.value == this.searchType) {
          returnText = "请填写" + item.name;
        }
      });
      return returnText;
    }
  }
};
</script>

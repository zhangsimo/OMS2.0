import * as api from "_api/lease/tenantres";

const data = function() {
  return {
    // 分割线
    split: 0.33,
    treecontent: "", // 树形查询条件
    tenantID: "", // 租户ID
    resID: "", // 资源ID
    treeData: [], // 左侧树形菜单
    orginTree: [], // 树形菜单元数据
    selectTrees: [], // 选中的树形数据
    expand: false, // 是否展开树菜单
    loading: false, // 表格加载
    columns: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "序号",
        type: "index",
        minWidth: 80
      },
      {
        title: "资源ID",
        key: "id",
        minWidth: 200,
        render: editRow(this, "tbdata", "id")
      },
      {
        title: "租户ID",
        key: "tenantId",
        minWidth: 120,
        render: editRow(this, "tbdata", "tenantId")
      },
      {
        title: "机构ID",
        key: "orgid",
        minWidth: 120,
        render: editRow(this, "tbdata", "orgid")
      },
      {
        title: "资源字段",
        key: "resId",
        minWidth: 120,
        render: editRow(this, "tbdata", "resId")
      },
      {
        title: "资源类型",
        key: "resType",
        minWidth: 120,
        render: editRow(this, "tbdata", "resType")
      },
      {
        title: "资源名称",
        key: "resName",
        minWidth: 120,
        render: editRow(this, "tbdata", "resName")
      },
      {
        title: "类型",
        key: "type",
        minWidth: 120,
        render: editRow(this, "tbdata", "type")
      },
      {
        title: "资源参数",
        key: "resParentId",
        minWidth: 120,
        render: editRow(this, "tbdata", "resParentId")
      },
      {
        title: "是否可用",
        key: "isDisabled",
        minWidth: 80,
        render: editRow(this, "tbdata", "isDisabled")
      },
      {
        title: "范围域",
        key: "scope",
        minWidth: 120,
        render: editRow(this, "tbdata", "scope")
      }
    ], // 表头
    tbdata: [], // 表身
    selectData: new Set() // 选中的数据
  };
};

// 是否是数组
const isArray = any => any && Array.isArray(any);

// 表格行可编辑
function editRow(self, tbdata, filed, validator) {
  return (h, params) => {
    let tb = "";
    if (tbdata.indexOf(".") !== -1) {
      tb = tbdata.split(".").reduce((prev, next) => prev[next], self["tbdata"]);
    } else {
      tb = self[tbdata];
    }
    return h(
      "p",
      {
        class: "edit",
        props: {
          value: params.row[filed]
        },
        attrs: {
          contenteditable: true
        },
        on: {
          blur: event => {
            params.row[filed] = event.target.innerText;
            tb[params.index] = params.row;
          }
        }
      },
      params.row[filed]
    );
  };
}

// 全部展开收起树形图
const treeExpand = (self, treeData) => {
  isArray(treeData) &&
    treeData.forEach(element => {
      element.expand = self.expand;
      if (isArray(element.children)) {
        treeExpand(self, element.children);
      }
    });
};

// 树形图渲染
const getTree = tree => {
  if (isArray(tree) && tree.length > 0) {
    tree.forEach(tel => {
      tel.expand = false;
      [tel.children, tel.childs] = [tel.childs, []];
      getTree(tel.children);
    });
  } else {
    return;
  }
};

// tree搜索
const findTree = (tree, content) => {
  let reg = new RegExp(content, "gi");
  let remove = [];
  let filter = (tree, index, remove) => {
    if (isArray(tree.children) && tree.children.length > 0) {
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
};

// 树形图模糊搜索
const queryTree = function(self) {
  let val = self.treecontent;
  self.treeData = JSON.parse(JSON.stringify(self.orginTree));
  if (!val) {
    self.expand = false;
    treeExpand(self, self.treeData);
  } else {
    findTree(self.treeData, val);
    self.expand = true;
    treeExpand(self, self.treeData);
  }
};

const methods = {
  async initTree() {
    let res = await api.getOmsAuth();
    if (res.code === 0) {
      let data = res.data.childs;
      getTree(data);
      this.treeData = data;
      this.orginTree = JSON.parse(JSON.stringify(this.treeData));
    }
  },
  async initList() {
    let params = {};
    if (this.tenantID) {
      params.tenantId = this.tenantID;
    }
    if (this.resID) {
      params.menuId = this.resID;
    }
    let res = await api.getAll(params);
    if (res.code === 0) {
      this.tbdata = res.data;
    }
  },
  // 保存
  async save() {
    let data = [];
    this.selectTrees.forEach(el => {
      let o = {
        scope: "PART",
        type: "pc",
        resId: el.id,
        resName: el.title,
        resParentId: el.parentId,
        resType: el.resType
      };
      data.push(o);
    });
    let res = await api.addresource(data);
    if (res.code === 0) {
      this.$Message.success("保存成功");
      this.qureyTable();
    }
  },
  // 展开收起
  treeToggle(bool) {
    this.expand = bool;
    treeExpand(this, this.treeData);
  },
  // 树形查询
  treeQuery() {
    queryTree(this);
  },
  // 选中树形菜单
  selectedTree(tree, data) {
    this.selectTrees = tree;
  },
  /**表格 */
  // 全选
  selectAll(selection) {
    selection.forEach(el => {
      this.selectData.add(el.id);
    });
  },
  // 单选
  selectRow(selection, row) {
    selection.forEach(el => {
      this.selectData.add(el.id);
    });
  },
  // 取消单选
  selectRowCancel(selection, row) {
    this.selectData.delete(row.id);
  },
  // 取消全选
  selectAllcancel() {
    this.selectData = new Set();
  },
  // 查询
  qureyTable() {
    this.initList();
    this.selectData = new Set();
    console.log(this.selectData);
  },
  // 删除
  delTable() {
    this.selectData.forEach(id => {
      this.tbdata.forEach((el, index, arr) => {
        if (el.id === id) {
          arr.splice(index, 1);
        }
      });
    });
  },
  // 保存
  async saveTable() {
    if (this.selectData.size > 0) {
      let ids = Array.from(this.selectData);
      let res1 = await api.deltenant(ids);
    }
    this.tbdata.forEach(el => {
      let isDisabled = isNaN(parseInt(el.isDisabled))
        ? el.isDisabled
        : parseInt(el.isDisabled);
      el.isDisabled = isDisabled;
    });
    let res2 = await api.updatetenant(this.tbdata);
    console.log(res2, "res2 => 303");
    if (res2.code === 0) {
      this.$Message.success("保存成功");
      this.qureyTable();
    }
  }
};

const mounted = function() {
  this.initTree();
  treeExpand(this, this.treeData);
  this.initList();
};

export default {
  name: "tenantRes",
  data,
  mounted,
  methods
};

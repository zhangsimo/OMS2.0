<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane1">
        <SupplierClassification :data="list" :treeDiagramList="treeList" @getNewTree="getNewList"></SupplierClassification>
      </div>
      <div slot="right" class="demo-split-pane">
        <SupplierData :treeDiagramList="list"></SupplierData>
      </div>
    </Split>
  </div>
</template>
<script>
import SupplierClassification from "./SupplierClassification";
import SupplierData from "./SupplierData";
import { getSupplierTreeList } from "@/api/system/systemSetting/storeManagement";
export default {
  name: "storeManagement",
  components: {
    SupplierClassification,
    SupplierData
  },
  data() {
    return {
      split1: 0.2,
      list: [],
      treeList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getSupplierTreeList().then(res => {
        if (res.code == 0) {
          let list = [];
          res.data.forEach(item => {
            item.title = item.companyName;
            item.code = item.id;
            list.push(item);
            if (item.children && item.children.length > 0) {
              item.children.forEach(val => {
                val.title = val.companyName;
                val.code = val.id;
                list.push(val);
              });
            }
          });
          this.list = list;
          let tree = list.filter(item => item.parentId == 0);
          tree.map(item => {
            item.children = [];
            item.code = item.id;
            list.forEach(el => {
              if (item.id == el.parentId) {
                item.children.push(el);
              }
            });
          });
          this.treeList = tree;
        }
      });
    },
    getNewList() {
      this.getList();
    }
  }
};
</script>
<style>
.demo-split {
  height: 100%;
  background-color: #fff;
  border: 1px solid #dcdee2;
}
.demo-split-pane1 {
  padding: 10px;
}
.demo-split-pane {
  height: 100%;
}
</style>

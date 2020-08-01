<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane1">
        <CustomerClassification :data="list" :treeDiagramList="treeList" @getNewTree="getNewList"></CustomerClassification>
      </div>
      <div slot="right" class="demo-split-pane">
        <CustomerData :treeDiagramList="list"></CustomerData>
      </div>
    </Split>
  </div>
</template>
<script>
import CustomerClassification from "./CustomerClassification";
import CustomerData from "./CustomerData";
import { getClientTreeList } from "@/api/system/essentialData/clientManagement";

export default {
  name: "clientManagement",
  components: {
    CustomerClassification,
    CustomerData
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
      getClientTreeList().then(res => {
        if (res.code == 0) {
          this.list = res.data;
          let leverOne = [];
          let leverTwo = [];
          leverOne = res.data.filter(item => item.lever == 1);
          leverTwo = res.data.filter(item => item.lever == 2);
          leverOne.map(item => {
            item.children = [];
            item.code = item.id;
          });
          leverOne.map(item => {
            leverTwo.forEach(el => {
              if (item.id == el.parentId) {
                item.children.push(el);
              }
            });
          });
          this.treeList = leverOne;
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
  height: 100%;
}
.demo-split-pane {
  height: 100%;
}
</style>

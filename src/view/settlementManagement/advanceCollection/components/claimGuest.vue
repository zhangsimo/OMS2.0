<template>
  <Modal v-model="modal" title="预收款认领" width="800">
    <div class="db ml20">
      <span>往来单位：</span>
      <Select v-model="companyId" class="w150" filterable>
        <Option v-for="item in company" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button @click="query" class="ml10">
        <i class="iconfont iconchaxunicon"></i>
        <span>查询</span>
      </Button>
    </div>
    <Table border class="mt10" :columns="columns1" :data="data1"></Table>
  </Modal>
</template>
<script>
import { getbayer } from "@/api/AlotManagement/threeSupplier";
import { getSupplierList } from "_api/purchasing/purchasePlan";
export default {
  data() {
    return {
      modal: true,
      company: [], //往来单位
      companyId: "", //往来单位
      columns1:[
        {
          title:'序号',
          type:'index',
          width:40
        },
        {
          title:'往来单位',
          key:'fullName'
        },
        {
          title:'编号',
          key:'code'
        },
        {
          title:'简称',
          key:'shortName'
        },
      ],
      data1:[]
    };
  },
  mounted() {
    this.getOne();
  },
  methods: {
    // 往来单位选择
    async getOne() {
      const res = await getSupplierList({});
      const res1 = await getbayer({});
      this.company = [];
      let data = [];
      let result = [];
      let obj = {};
      if (res.data.length !== 0 && res1.data.content.length !== 0) {
        data = [...res.data, ...res1.data.content];
      } else if (res.data.length !== 0) {
        data = res.data;
      } else if (res1.data.content.length !== 0) {
        data = res.data.content;
      }
      for (let i in data) {
        if (!obj[data[i].id]) {
          result.push(data[i]);
          obj[data[i].id] = 1;
        }
      }
      data = result;
      data.map(item => {
        this.company.push({
          label: item.fullName,
          value: item.id
        });
      });
      this.data1 = data
    },
    //查询
    query() {}
  }
};
</script>
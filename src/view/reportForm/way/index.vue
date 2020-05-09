<template>
  <div class="content-oper" style="background: #fff">
    <panne @search="search" />
    <tabOne />
  </div>
</template>
<script>
import panne from "./components/panne";
import tabOne from "./components/tabOne";

export default {
  name: "reporIndex",
  components: { panne, tabOne },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    search(data) {},
  }
};
</script>

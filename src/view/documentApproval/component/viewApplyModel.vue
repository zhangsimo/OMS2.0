<template>
  <Modal
    v-model="model"
    title="供应商申请"
    width="1200px"
  >

    <div slot='footer'></div>
  </Modal>
</template>

<script>
	export default {
		name: "applyModelView",
    data(){
		  return {
        model:false
      }
    },
    methods:{
		  init(){
        this.model = true;
      }
    }
	}
</script>

<style scoped>

</style>

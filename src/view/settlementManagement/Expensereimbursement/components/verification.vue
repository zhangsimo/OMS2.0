<template>
  <Modal v-model="verificationModal" title="因公借支核销">
    <div>
      <button>因公借支核销</button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "verification",
        data(){
          return {
            verificationModal: false,
          }
        }
    }
</script>

<style scoped>

</style>

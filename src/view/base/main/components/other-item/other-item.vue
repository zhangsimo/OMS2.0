<template>
  <div>
    <div class="other-item">
      <a class="mr20" href="#">客服</a>
      <a class="mr20" @click="toImage">反馈</a>
      <Icon class="mr20" type="md-home" size="16"/>
      <Icon class="mr20" type="md-sync" size="16"/>
      <Icon class="mr20" type="md-close" size="16"/>
    </div>


  </div>
</template>

<script>
    import html2canvas from 'html2canvas'
  export default {
    name: 'other-item',
      components: {
          html2canvas
      },
      data(){
        return {
            htmlUrl: '',
        }
      },
      methods: {
          toImage() {
           this.$emit('getImg',{})
          },


      }
  }
</script>

<style scoped lang="less">
  .other-item > *{
    color: #333;
    cursor: pointer;
  }
  .image_tofile {
   position: fixed;
    width:90%;
    height: 90%;
    /*top: 10%;*/
    left: 10%;
    background-color: rgba(255,255,255,.1);
  }
</style>

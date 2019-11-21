<template>
  <div>
    <Tabs type="card" :animated="false">
        <TabPane label="基本信息">
          <quickDate></quickDate>
        </TabPane>
        <TabPane label="包装规格">
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
  import quickDate from '../../../components/getDate/dateget'
  export default {
    name: 'brandList',
    components: {quickDate},
    data() {
      return {
      }
    },
    components: {},
    activated() {
    },
    mounted() {
    },
    methods: {
    },
    computed: {
    }
  }
</script>

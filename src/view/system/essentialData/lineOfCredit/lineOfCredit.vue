<template>
    <div style="width: 100%;height: 100%;background-color:#fff;">
      <section class="Creditbox">
            <div class="db mr10">
              <span>快速查询：</span>
              <quickDate class="mr10"></quickDate>
              <span>开始日期：</span>
              <DatePicker  type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
              <Button type="warning" class="mr10 w90"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
        </div>
      </section>
      <div>
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="staffList"></Table>
      </div>
    </div>
</template>

<script>
    import quickDate from '@/components/getDate/dateget'
    export default {
        name: "lineOfCredit",
        components:{
            quickDate
        },
        data(){
            return {
                loading: true,
                columns:[
                    {
                        type: 'index',
                        width: 50,
                        align: 'center',
                        title:'序号'
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'userName'
                    },
                ]
            }
        }
    }
</script>

<style scoped lang="less">
.Creditbox {
  padding-left: 10px;
  line-height: 57px;
  border-bottom: 1px #e0e0e0 solid;
}
</style>

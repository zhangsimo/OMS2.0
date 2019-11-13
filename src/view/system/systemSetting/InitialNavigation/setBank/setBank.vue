<template>
    <div class="bank-box">
      <div class="bank-header">
        <Button class="mr20 w90" @click="validEvent">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
        </Button>
        <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconshenheicon icons" />审核</span></Button>
        <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconshuaxinicon icons" />刷新</span></Button>
      </div>
      <div class="bank-center">
        <div>
        <vxe-table
          border
          ref="xTable"
          resizable
          align="center"
          highlight-current-row
          highlight-hover-row
          :edit-rules="validRules"
          size="mini"
          show-overflow
          :data="tableData"
          :edit-config="{trigger: 'dblclick', mode: 'row'}">
          <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="code" title="账户编码" ></vxe-table-column>
          <vxe-table-column field="name" title="账户名称" ></vxe-table-column>
          <vxe-table-column field="accountTypeId" title="账户类型" >
<!--            <template v-slot="{row}">{{  }}</template>-->
          </vxe-table-column>
          <vxe-table-column field="initBalance" title="初期金额" :edit-render="{name: 'input',class:''}"></vxe-table-column>
          <vxe-table-column field="isInit" title="是否审核" >
            <template v-slot="{ row }">{{ row.isInit ? '是' : '否' }}</template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column field="updateUname" title="最近修改人" ></vxe-table-column>
          <vxe-table-column field="updateTime" title="最近修改日期" ></vxe-table-column>
        </vxe-table>
        </div>
      </div>
    </div>
</template>


<script>
  import {getBankList} from '@/api/system/systemSetting/setBank'
    export default {
        name: "setBank",
        data(){
            let checkPhone = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("请输入大于0的正整数"));
                } else {
                    const reg = /^\+?[1-9]\d*$/;
                    if (!reg.test(value)) {
                        callback(new Error("请输入大于0的正整数"));
                    } else {
                        callback();
                    }
                }
            };

            return {
                tableData:[],
                validRules: {
                    initBalance: [
                        { required: true,validator: checkPhone},
                    ],
                },
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
           async getList(){
               let user = this.$store.state.user.userData
               console.log(user)
                let res = await  getBankList(user.groupId)
               console.log(res)
               if(res.code == 0){
                   let arr = res.data
                   arr.map( item => {
                       switch (item.accountTypeId) {
                           case 0:
                               item.accountTypeId = '现金'
                               break
                           case 1:
                               item.accountTypeId = '银行存款'
                               break
                           case 2:
                               item.accountTypeId = '积分/卡券'
                               break
                       }
                   })

                   this.tableData = res.data
               }
            },
            validEvent () {
                this.$refs.xTable.validate(valid => {
                    if (valid) {
                    } else {
                        this.$message.error('校验不通过')
                    }
                })
            },
            getType({ cellValue }){
               console.log(cellValue)
                // return this.$utils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
            },
        }
    }
</script>

<style scoped lang="less">
  .bank-box {
    width:100%;
    height: 100%;
    background-color: #fff;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bank-header {
    line-height: 57px;
    border-bottom: 1px #e0e0e0 solid;
    padding-left: 10px;
  }
  .bank-center {
    padding: 10px;
    height: 100%;
  }
</style>

<template>
    <Form :model='data' :label-width="100" >
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='客户编码:' >
            <Input v-model='data.code' style="width: 180px" ></Input>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='客户简称:' >
            <Input v-model='data.shortName' style="width: 180px" ></Input>
          </FormItem>
        </div>
      </div>
      <FormItem label='客户全称:' >
        <Input v-model='data.fullName' style="width: 380px" ></Input>
      </FormItem>
      <div style="display: flex">
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='联系人:' >
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='会员等级:' >
            <Input  v-model='data.memLevelId' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='省份:'>
            <Select v-model="data.provinceId" style="width:180px" class="mr10">
              <Option v-for="item in provincearr" v-if="item.parentId==0" :key="item.id" :value="item.id" >{{ item.name}}</Option>
            </Select>
          </FormItem>
        </div>
        <div style="flex-flow: row nowrap;width: 100%" >
          <FormItem label='联系人电话：' >
            <Input v-model='data.contactorTel'  style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='会员卡号：' >
            <Input v-model='data.cardNo'  style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='城市:'>
            <Select v-model="data.cityId" style="width:180px" class="mr10">
              <Option v-for="item in provincearr" v-if="data.provinceId==item.parentId" :key="item.id" :value="item.id" >{{ item.name}}</Option>
            </Select>
          </FormItem>
        </div>
      </div>

    </Form>
</template>

<script>
    export default {
        name: "Query",
        props:{
            data:'',
            provincearr:''
        },
        data(){
            return {
                list:[
                    {
                        label: 123,
                        value:1
                    },
                    {
                        label: 456,
                        value:2
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>

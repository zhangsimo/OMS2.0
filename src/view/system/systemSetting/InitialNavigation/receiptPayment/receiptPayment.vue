<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db">
              <Button class="mr10 w130"><span class="center"><Icon custom="iconfont iconxinzengicon icons" />添加往来单位</span></Button>
              <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconlajitongicon icons" />删除</span></Button>
              <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconbaocunicon icons" />保存</span></Button>
              <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconshenheicon icons" />审核</span></Button>
              <Button class="mr10 w90"><span class="center"><Icon custom="iconfont icondaoruicon icons"></Icon>导入</span></Button>
              <Button class="mr10 w90"><span class="center"><Icon custom="iconfont iconshuaxinicon icons" />刷新</span></Button>
            </div>
            <!--<Modal v-model="classification" title="新增分类" width="500px">-->
              <!--<div class="audit_nav">-->
                <!--<div>-->
                  <!--<label>分类编码：</label><Input v-model="coding" placeholder="请输入分类编码！" style="width: 200px" />-->
                  <!--<span v-show="code_number" style="margin-left: 70px;margin-top: 5px;color: red;display: block">分类编码不能为空！</span>-->
                <!--</div>-->
                <!--<div>-->
                  <!--<label>分类名称：</label><Input v-model="Name" placeholder="请输入分类名称！" style="width: 200px" />-->
                  <!--<span v-show="namenull" style="margin-left: 70px;margin-top: 5px;color: red;display: block">分类名称不能为空！</span>-->
                <!--</div>-->
                <!--<div>-->
                  <!--<label>上级分类：</label>-->
                  <!--<Select v-model="superior" style="width:200px">-->
                    <!--<Option v-for="item in Class_superior" :value="item.code" :key="item.code">{{ item.name }}</Option>-->
                  <!--</Select>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="audit_nav2" slot="footer">-->
                <!--<Button type="error" @click="Save" class="mr20">保存并新增</Button>-->
                <!--<Button @click="cancel" class="w90">取消</Button>-->
              <!--</div>-->
            <!--</Modal>-->
            <!--<Modal v-model="classChange" title="修改分类" width="500px">-->
              <!--<div class="audit_nav">-->
                <!--<div><label>分类编码：</label><Input v-model="coding1" style="width: 200px" /></div>-->
                <!--<div>-->
                  <!--<label>分类名称：</label><Input v-model="Name2" style="width: 200px" />-->
                <!--</div>-->
                <!--<div>-->
                  <!--<label>上级分类：</label>-->
                  <!--<Select v-model="superior1" style="width:200px">-->
                    <!--<Option v-for="item in Class_superior" :value="item.code" :key="item.code">{{ item.name }}</Option>-->
                  <!--</Select>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="audit_nav2" slot="footer">-->
                <!--<Button type="error" @click="Save2" class="mr20">保存</Button>-->
                <!--<Button @click="cancel" class="w90">取消</Button>-->
              <!--</div>-->
            <!--</Modal>-->
          </div>
        </div>
      </section>
      <section class="con-box">
        <Table class="table-highlight-row" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata" @on-row-click="selection"></Table>
      </section>
    </div>
</template>

<script>
    export default {
        name: "receiptPayment",
      data(){
          return {
            loading: false,
            columns: [
              {
                title: '序号',
                align: 'center',
                width: 120,
                type: 'index'
              },
              {
                title: '往来单位全称',
                align:'left',
                minWidth: 150,
                key:''
              },
              {
                title: '往来单位简称',
                align:'left',
                key: '',
                minWidth: 120
              },
              {
                title: '往来单位编码',
                align:'left',
                key: '',
                minWidth: 150
              },
              {
                title: '应收',
                align:'left',
                key: '',
                minWidth: 150
              },
              {
                title: '应付',
                align:'left',
                key: '',
                minWidth: 150
              },
              {
                title: '备注',
                align:'left',
                key: '',
                minWidth: 150,
                // render:(h,params) => {
                //   let stat = JSON.parse(params.row.status||{})
                //   let className = 'red'
                //   if(stat.value===1){
                //     className = 'blue'
                //   }
                //   return h('span',{
                //     class:className
                //   },stat.name?'● '+stat.name:'')
                // }
              }
            ],
            tbdata: [],
          }
      }
    }
</script>

<style scoped>

</style>

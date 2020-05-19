<template>
  <Modal
    v-model="printShow"
    width="1300"
    closable
    >
    <Button type="success" @click="print">打印</Button>
    <div id="printBox" style="height: 600px">
      <div class="titler">
    <p style="padding-left: 30px">Content of dialog</p>
    <p>Content of dialog</p>
    <p>Content of dialog</p>
         <Table resizable  size="small" style="margin: 0 auto" width="900" height="500" border :columns="columns2" :data="data4" class="ml10"></Table>
      </div>
    </div>
    <div slot='footer'>
      <Button type='default' @click='printShow = false'>取消</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "PrintShow",
        data(){
            return{
                printShow: false, //模态框隐藏
                tableData:[
                    {role:12,name:5,role1:8,name1:1},
                    {role:12,name:5,role1:8,name1:1},
                    {role:12,name:5},
                ],
                columns2: [
                    {
                        title: 'Name',
                        key: 'name',

                    },
                    {
                        title: 'Age',
                        key: 'age',

                    },
                    {
                        title: 'Province',
                        key: 'province',

                    },
                    {
                        title: 'City',
                        key: 'city',

                    },
                    {
                        title: 'Address',
                        key: 'address',

                    },
                    {
                        title: 'Postcode',
                        key: 'zip',

                    },
                    {
                        title: 'Action',
                        key: 'action',

                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, 'View'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, 'Edit')
                            ]);
                        }
                    }
                ],
                data4: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        province: 'America',
                        city: 'New York',
                        zip: 100000
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'Washington, D.C. No. 1 Lake Park',
                        province: 'America',
                        city: 'Washington, D.C.',
                        zip: 100000
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        province: 'Australian',
                        city: 'Sydney',
                        zip: 100000
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        province: 'Canada',
                        city: 'Ottawa',
                        zip: 100000
                    },
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        province: 'America',
                        city: 'New York',
                        zip: 100000
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'Washington, D.C. No. 1 Lake Park',
                        province: 'America',
                        city: 'Washington, D.C.',
                        zip: 100000
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        province: 'Australian',
                        city: 'Sydney',
                        zip: 100000
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        province: 'Canada',
                        city: 'Ottawa',
                        zip: 100000
                    }
                ]
            }
        },
        methods:{
            //打印
            print(){
                    // 1.设置要打印的区域 div的className
                    var newstr = document.getElementById('printBox').innerHTML
                    // 2. 还原：将旧的页面储存起来，当打印完成后返给给页面。
                    var oldstr = document.body.innerHTML
                    // 3. 复制给body，并执行window.print打印功能
                    document.body.innerHTML = newstr

                    window.print()
                    // 重新加载页面，以刷新数据
                    window.location.reload()
                    document.body.innerHTML = oldstr
            },
            openModal(){
                this.printShow = true
            }
        }
    }
</script>

<style scoped lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
      top: 0;
    }
  }
#printBox {
  width: 1000px;
  margin: 0 auto ;
  .titler {
    /*padding: 0 20px;*/
    border: 1px #000000 solid;
  }
}
</style>

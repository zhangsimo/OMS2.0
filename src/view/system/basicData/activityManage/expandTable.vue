<template>
    <div class="expand-table">
        <Table highlight-row :data="data1" :columns="columns1" :row-class-name="rowClassName" border>
        </Table>
        <div class="border">合计: <span>{{this.data1.length}}</span> </div>
    </div>
</template>
<script>
    export default {
        props: {
            row: Array
        },
        data () {
            return {
                columns1:[
                    {
                        title: '配件内码',
                        align: 'center',
                        key: 'partInnerId',
                    },
                    {
                        title: '配件编码',
                        align: 'center',
                        key: 'partCode',
                    },
                    {
                        title: '配件名称',
                        align: 'center',
                        key: 'partName',
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'partBrandName',
                    },
                    {
                        title: '是否赠送',
                        align: 'center',
                        key: 'isGift',
                        render: (h, params) => {
                            return h('Checkbox', {
                            props: {
                                value:params.row.isGift == 0 ? false : true,
                                disabled: true
                                }, 
                            on: {
                                'on-change': (e) => {
                                console.log(e)
                                }
                                }
                             });
                        }
                    },
                    {
                        title: '活动数量',
                        align: 'center',
                        key: 'num',
                    },
                    {
                        title: '活动单价',
                        align: 'center',
                        key: 'price',
                    },
                    {
                        title: 'OE码',
                        align: 'center',
                        key: 'oemCode',
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'carModelName',
                    }
                ],
                data1:[]
            }
        },
        mounted(){
            this.data1 = this.row
        }
    };
</script>
<style lang="less">
    @import url("./expandTable.less");
</style>
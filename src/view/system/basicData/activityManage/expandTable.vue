<template>
    <div class="expand-table">
        <Table highlight-row :data="data1" :columns="columns1" :row-class-name="rowClassName" border>
        </Table>
        <div class="border">合计: <span>2</span> </div>
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
                        key: 'name',
                    },
                    {
                        title: '配件编码',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '配件名称',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '是否赠送',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '活动数量',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '活动单价',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: 'OE码',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '品牌车型',
                        align: 'center',
                        key: 'name',
                    }
                ],
                data1: []
            }
        }
    };
</script>
<style lang="less">
    @import url("./expandTable.less");
</style>
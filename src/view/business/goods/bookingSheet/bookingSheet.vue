<template>
        <!-- 头部 -->
    <div class="bookingSheetBox">
        <div class="oper-box bkTop">
            <div class="oper-top flex">
                <div class="wlf">
                    <div class="db mr10">
                        <span>快速查询：</span>
                        <dateget></dateget>
                    </div>
                    <div class="db mr10">
                        <Select class="w100 mr10" v-model="bkStatus" clearable>
                            <Option value="所有" label="所有" v-for="item in bookSheetStatus" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </div>
                    <div class="db">
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                ···更多
                            </span>
                        </Button>
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                <i class="iconfont iconxinzengicon"></i>新增
                            </span>
                        </Button>
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                <i class="iconfont iconbaocunicon"></i>保存
                            </span>
                        </Button>
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                <i class="iconfont iconxuanzetichengchengyuanicon"></i>提交
                            </span>
                        </Button>
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                <i class="iconfont icondayinicon"></i>打印
                            </span>
                        </Button>
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                <i class="iconfont iconzuofeiicon"></i>作废
                            </span>
                        </Button>
                        <Button class="mr10" style="border: none">
                            <span class="center" style="color: #27A2D2">
                                <i class="iconfont icondaochuicon"></i>导出
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 内容 -->
        <div class="conBox">
            <Split v-model="split">
                <div slot="left" class="splitLeft">
                    <h4>预订单列表</h4>
                    <Table :columns="columnsBK" :data="dataBK" border></Table>
                </div>
                <div slot="right">
                    <div class="rightTop">
                        <Form  :model="formItem" :label-width="60">
                            <FormItem>
                                <Row class="mt10">
                                    <Col span="8">
                                        <span style="color: red">业务员：</span>
                                        <Input v-model="formItem.input" style="width: 150px"></Input>                                        
                                    </Col>
                                    <Col span="6" style="text-align: right">
                                        <span>预定单号：</span>
                                        <Input v-model="formItem.number" type="text" :autosize="{minRows: 2,maxRows: 5}" style="width: 100px"></Input>
                                    </Col>
                                    <Col span="8" class="ml10">
                                        <span>期望到货日期：</span>
                                        <DatePicker type="date" style="width: 120px"></DatePicker>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span="24">
                                        <span>备注：</span>
                                        <Input v-model="formItem.text" type="text" style="width: 90%"></Input>                                        
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                        
                    </div>
                    <div class="rightBottom">
                        <div class="rbHeader">
                            <Button class="mr10" style="border: none">
                                <span class="center" style="color: #27A2D2">
                                    <i class="iconfont iconxinzengicon"></i>添加配件
                                </span>
                            </Button>
                            <Button class="mr10" type="default" style="height: 25px">
                                <span class="center">
                                    <i class="iconfont iconxinzengicon"></i>删除配件
                                </span>
                            </Button>
                            <Button class="mr10" type="default" style="height: 25px">
                                <span class="center">
                                    <i class="iconfont iconxinzengicon"></i>导入配件
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Split>
        </div>
    </div>
</template>

<script>
import dateget from '../../../../components/getDate/dateget'
export default {
    name: 'bookingSheet',
    components:{dateget},
    data(){
        return{
            bookSheetStatus: [ //预订单状态
                {
                    value: '所有',
                    label: "所有"
                },
                {
                    value: '草稿',
                    label: "草稿"
                },
                {
                    value: '待受理',
                    label: "待受理"
                },
                {
                    value: '已受理',
                    label: "已受理"
                },
                {
                    value: '部分受理',
                    label: "部分受理"
                },
            ],
            bkStatus:"",
            // 分隔大小
            split:0.3,
            // 左分隔板
            columnsBK: [
                {
                    type: 'index',
                    title: '序号',
                    align: 'center'
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '公司',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '创建日期',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '业务员',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '预定单号',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '打印次数',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '提交人',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '提交日期',
                    key: 'status',
                    align: 'center'
                }
            ],
            dataBK: [],
            // 右分隔板上半部分
            formItem: {
                input: '',
                text: '',
                number:''
            }
        }
    },
    methods:{
    }
}
</script>

<style lang="less">  
    .bookingSheetBox {
        .conBox {
            height: 700px;
            background-color: #fff;
            border: 1px solid #DEEDF7;
            .splitLeft {
                h4 {
                    height: 30px;
                    line-height: 30px;
                    background-color: #DEEDF7;
                    padding-left: 10px;
                }
            }
            .rightTop {
                background-color: #F2F5F7;
                padding: 8px 2px 2px 10px;
                .ivu-form {
                    border: 1px solid #758B9C;
                    .ivu-input {
                        background-color: #F2F5F7;
                        height: 25px;
                        border-radius: 5px
                    }
                }
            }
        }
    }
</style>
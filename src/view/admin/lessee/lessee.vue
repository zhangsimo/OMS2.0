<template>
  <div>
    <section class="oper-box">
      <div class="oper-top">
        <label class="oos-label">查询条件：</label>
        <Input v-model="searchValue" placeholder="请输入租户名称" class="w200"></Input>
        <button type="button" class="ivu-btn ivu-btn-primary ml15" @click="query">查询</button>
      </div>
      <div class="oper-bottom">
        <Button type='primary' @click='addClick'>新增</Button>
        <!--<Button type='primary' class="ml15" @click='confirmDel'>删除</Button>-->
        <!--<button class="ivu-btn fr">导出</button>-->
      </div>
    </section>
    <section class="con-box">
      <Table ref="taskTable" :loading="loading" border stripe :columns="thdata" :data="tbdata"
             @on-selection-change="selectChange"></Table>
      <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
            @on-change="selectNum" @on-page-size-change="selectPage"></Page>
    </section>

    <Modal v-model='modal' :closable="false" :mask-closable="false" :title="title">
      <addUser :data='userinfo' :disabled="editStatus" :groupData="groupData" ref='child'></addUser>
      <div slot='footer'>
        <Button type='text' @click='cancel'>取消</Button>
        <Button type='primary' @click='submit'>确定</Button>
      </div>
    </Modal>


  </div>
</template>
<script>
    import addUser from './addUser.vue'
    import editUserAuth from './editUserAuth.vue'
    import {queryAllRoles} from '_api/admin/roleApi'
    import {
        allStaff,
        delStaffById,
        editUser,
        changeCompany,
        resetPwd,
        changeRoles,
        frozenStaff
    } from '_api/admin/lesseeApi'
    import {transTime} from '../utils'

    export default {
        name: 'staff',
        data() {
            return {
                role: {
                    userId: '',
                    modal: false,
                    checkedIds: [],
                    data: []
                },
                groupData: [],
                title: '新增租户',
                loading: false,
                modal: false,
                editStatus: false,
                searchValue: "",
                selectType: "0", // 查询条件
                page: {
                    size: 10,
                    num: 1,
                    total: 0
                },
                thdata: [
                    {
                        title: "序号",
                        align: "center",
                        // type: "index",
                        key: "index",
                        minWidth: 60,
                        render: (h, params) => {
                            return h('span', params.index + this.basePage)
                        }
                    },
                    // {
                    //   type: "selection",
                    //   align: "center",
                    //   minWidth: 60
                    // },
                    {
                        title: "操作",
                        align: "center",
                        key: "",
                        render: (h, params) => {
                            let opts = [
                                h('Icon', {
                                    props: {size: 16, type: 'edit'},
                                    attrs: {title: '修改'},
                                    class: 'pointer',
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }),
                                h('Icon', {
                                    props: {size: 16, type: 'android-delete'},
                                    attrs: {title: '删除'},
                                    class: 'delete ml15',
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '确定要删除吗？',
                                                onOk: () => {
                                                    this.delStaff({id:params.row.id})
                                                }
                                            })
                                        }
                                    }
                                })
                            ]

                            return h('div', opts)
                        },
                        minWidth: 180
                    },
                    {
                        title: '租户名称',
                        align: 'center',
                        key: 'userName',
                        minWidth: 120
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: '',
                        render: (h, params) => {
                            let text = !params.row.frozen ? '正常' : '已冻结'
                            let clsName = !params.row.frozen ? 'text-state-ok' : 'text-state-warn'
                            return h('span', {class: clsName}, text)
                        },
                        minWidth: 150
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: '',
                        render: (h, params) => {
                            return h('span', {}, transTime(params.row.createTime))
                        },
                        minWidth: 150
                    },
                    {
                        title: '最近修改日期',
                        align: 'center',
                        key: '',
                        render: (h, params) => {
                            return h('span', {}, transTime(params.row.updateTime))
                        },
                        minWidth: 150
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark',
                        // render: (h, params) => {
                        //     return h('span', {}, transTime(params.row.lastLoginTime))
                        // },
                        minWidth: 150
                    }
                ],
                tbdata: [],
                selection: [],
                userinfo: {
                    userName: '',
                    remark: '',
                }
            }
        },
        components: {
            addUser,
            editUserAuth
        },
        activated() {
            this.getUserList()
        },
        mounted() {
            this.getUserList()
        },
        methods: {
            frozenStaff(id, frozen) {
                let stop = this.$loading()
                let data = {
                    id: id,
                    frozen: frozen
                }
                frozenStaff(data).then(res => {
                    stop()
                    if (res.code == 0) {
                        this.$Message.success(res.message)
                        this.getUserList()
                    }
                }).catch(err => {
                    stop()
                })
            },

            changeRolesClick() {
                let stop = this.$loading()
                queryAllRoles().then(res => {
                    stop()
                    if (res.code == 0) {
                        this.role.data = res.data
                        this.role.modal = true
                    }
                }).catch(err => {
                    stop()
                })
            },
            resetPwd(id) {
                let stop = this.$loading()
                resetPwd({id}).then(res => {
                    stop()
                    if (res.code == 0) {
                        this.$Message.success(res.message)
                    }
                }).catch(err => {
                    stop()
                })
            },
            submit() {
                this.$refs.child.handleSubmit(() => {
                    let stop = this.$loading()
                    this.modal = false
                    if(!this.userinfo.id){
                        editUser(this.userinfo).then(res => {
                            stop()
                            this.query()
                        }).catch(err => {
                            stop()
                        })
                    }else {
                        changeCompany(this.userinfo).then( res => {
                            stop()
                            this.query()
                        }).catch(err => {
                            stop()
                        })
                    }

                })
            },
            success(msg) {
                this.$Message.success(msg)
                this.cancel()
                this.query()
            },
            cancel() {
                this.modal = false
                this.editStatus = false
                this.title = '新增租户'
                this.userinfo = {
                    id: '',
                    staffName: '',
                    userName: '',
                    staffEmail: '',
                    groupIds: [],
                    roleIds: []
                }
                this.$refs.child.resetFields()
            },
            addClick() {
                this.modal = true
            },
            edit(res) {
                this.modal = true
                this.title = '修改租户名称'
                this.userinfo.id = res.id
                this.tenantId = res.tenantId
                this.userinfo.userName = res.userName
                this.userinfo.remark = res.remark
            },
            query() {
                this.page.num = 1
                this.getUserList()
            },
            getUserList() {
                this.loading = true
                let data ={}
                let searchValue = this.searchValue.trim()
                if (searchValue) {
                    data.userName = searchValue
                }
                allStaff(this.page.num, this.page.size, data).then(res => {
                    this.loading = false
                    if (res.code == 0) {
                        this.page.total = res.data.totalElements || 0
                        this.tbdata = res.data.content
                    }
                }).catch(err => {
                    this.loading = false
                })
            },
            ch(arr) {
                arr.map(item => {
                    if (this.userinfo.groupIds.indexOf(item.id) != -1) {
                        item.selected = true
                    }
                    if (item.childs.length > 0) {
                        this.ch(item.childs)
                    }
                })
            },
            delStaff(arr) {
                let stop = this.$loading()
                delStaffById(arr).then(res => {
                    stop()
                    if (res.code == 0) {
                        this.$Message.success('删除成功')
                        this.query()
                    }
                }).catch(err => {
                    stop()
                })
            },
            confirmDel() {
                if (this.selection.length) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确定要删除所选租户吗？',
                        onOk: () => {
                            let arr = this.selection.map(item => item.id)
                            this.delStaff(arr)
                        }
                    })
                } else {
                    this.$Message.error('请先选择租户')
                }
            },
            selectPage(size) {
                this.page.size = size;
                this.getUserList();
            },
            selectNum(num) {
                this.page.num = num;
                this.getUserList();
            },
            selectChange(selection) {
                this.selection = selection
            }
        },
        computed: {
            placeh() {
                this.searchValue = ''
                return (
                    "请填写" +
                    this.selectTypeArr.filter(item => item.value === this.selectType)[0]
                        .label
                );
            },
            paramType() {
                return this.selectTypeArr.filter(item => item.value === this.selectType)[0].param
            },
            basePage() {
                return 1 + (this.page.num - 1) * this.page.size
            }
        }
    }
</script>

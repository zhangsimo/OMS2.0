<template>
  <div>
    <section class="oper-box">
      <div class="oper-top">
        <label class="oos-label">查询条件：</label>
        <Select v-model='selectType' style='width: 120px' class="mr10">
          <Option v-for='item in selectTypeArr' :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
        <Input v-model="searchValue" :placeholder="placeh" class="w200 mr10"></Input>
        <Button @click="query" class="mr10" type='primary'><Icon type="ios-search" size="14" /> 查询</Button>
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
      <addUser :data='userinfo' :disabled="editStatus" :groupData="groupData"  :company="companyList"  ref='child'></addUser>
      <div slot='footer'>
        <Button type='text' @click='cancel'>取消</Button>
        <Button type='primary' @click='submit'>确定</Button>
      </div>
    </Modal>

    <Modal v-model='role.modal' title="分配角色">
      <Form :label-width="60">
        <FormItem label='角色:'>
          <Select v-model="role.checkedIds" filterable multiple>
            <Option v-for="item in role.data" :value="item.id" :key="item.displayName">{{ item.displayName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot='footer'>
        <Button type='text' @click='role.modal=false'>取消</Button>
        <Button type='primary' @click='roleSubmit'>确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import addUser from './addUser.vue'
  import editUserAuth from './editUserAuth.vue'
  import {findRootGroup} from '_api/admin/groupApi'
  import {queryAllRoles} from '_api/admin/roleApi'
  import {
    allStaff,
    delStaffById,
    editUser,
    findByUsername,
    resetPwd,
    changeRoles,
    frozenStaff
  } from '_api/admin/userApi'
  import {transTime} from '../utils'
  import {allStaffCompany} from '_api/admin/companyApi'


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
        title: '新增用户',
        loading: false,
        modal: false,
        editStatus: false,
        searchValue: "",
        selectType: "0", // 查询条件
        selectTypeArr: [
          {value: "0", label: "姓名", param: 'staffName'},
          {value: "1", label: "登录名", param: 'username'}
        ],
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
                  class: 'iconfont iconbianjixiugaiicon  icons pointer ml15',
                  on: {
                    click: () => {
                      this.edit(params.row.username)
                    }
                  }
                }),
                h('Icon', {
                  props: {size: 18, type: 'ios-people'},
                  attrs: {title: '分配角色'},
                  class: 'pointer ml15',
                  on: {
                    click: () => {
                      this.role.userId = params.row.id
                      this.role.checkedIds = params.row.roles.map(item => item.id) || []
                      this.changeRolesClick()
                    }
                  }
                }),
                h('Icon', {
                  props: {size: 18, type: 'key'},
                  attrs: {title: '重置密码'},
                  class: 'iconfont iconziyuan1 icons ml15 pointer',
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '确定要重置密码吗？',
                        onOk: () => {
                          this.resetPwd(params.row.id)
                        }
                      })
                    }
                  }
                })
              ]
              if (params.row.frozen) {
                opts = []
              }
              opts.push(
                h('Icon', {
                  props: {size: 20, type: params.row.frozen ? 'ios-sunny' : 'ios-snowy'},
                  attrs: {title: params.row.frozen ? '解冻' : '冻结'},
                  class: 'ivu-icon ivu-icon-ios-medical-outline ml15 pointer ' + (params.row.frozen ? 'text-state-warn' : ''),
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: `确定要${params.row.frozen ? '解冻' : '冻结'}吗？`,
                        onOk: () => {
                          this.frozenStaff(params.row.id, !params.row.frozen)
                        }
                      })
                    }
                  }
                })
              )
              opts.push(
                h('Icon', {
                  props: {size: 16, type: 'android-delete'},
                  attrs: {title: '删除'},
                  class: 'iconfont iconlajitongicon icons pointer ml15',
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '确定要删除吗？',
                        onOk: () => {
                          let arr = [params.row.id]
                          this.delStaff(arr)
                        }
                      })
                    }
                  }
                })
              )
              if (params.row.id == 0) {
                return h('div', '')
              }
              return h('div', opts)
            },
            minWidth: 180
          },
          {
            title: '姓名',
            align: 'center',
            key: 'staffName',
            minWidth: 120
          },
          {
            title: "登录名",
            align: "center",
            key: "username",
            minWidth: 150
          },
          {
            title: "邮箱",
            align: "center",
            key: "staffEmail",
            minWidth: 160
          },
          {
            title: "组织",
            align: "center",
            key: "",
            render: (h, params) => {
              return h('span', {}, params.row.groups.map(item => item.name).join('，'))
            },
            minWidth: 120
          },
          {
            title: "角色",
            align: "center",
            key: "",
            render: (h, params) => {
              return h('span', {}, params.row.roles.map(item => item.displayName).join('，'))
            },
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
            title: 'ID',
            align: 'center',
            key: 'tenantId',
            minWidth: 150
          }
        ],
        tbdata: [],
        selection: [],
        userinfo: {
          id: '',
          staffName: '',
          username: '',
          staffEmail: '',
          groupIds: [],
          roleIds: [],
          tenantId:''
        },
          companyList:[]
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
      this.getCompanyList()
    },
    methods: {
      getCompanyList(data ={}){
          allStaffCompany(this.page.num, 10000, data).then(res => {
              if (res.code == 0) {
                  this.companyList = res.data.content
              }
          })
      },
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
      roleSubmit() {
        let stop = this.$loading()
        let data = {
          id: this.role.userId,
          roleIds: this.role.checkedIds
        }
        changeRoles(data).then(res => {
          stop()
          if (res.code == 0) {
            this.$Message.success('角色分配成功')
            this.role.checkedIds = []
            this.role.data = []
            this.role.modal = false
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
          editUser(this.userinfo).then(res => {
            stop()
            if (res.code == 0) {
              if (this.userinfo.id)
                this.success('修改成功')
              else
                this.success('新增成功')
            }
          }).catch(err => {
            stop()
          })
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
        this.title = '新增用户'
        this.userinfo = {
          id: '',
          staffName: '',
          username: '',
          staffEmail: '',
          groupIds: [],
          roleIds: []
        }
        this.$refs.child.resetFields()
      },
      findRootGroup(callback) {
        findRootGroup().then(res => {
          if (res.code == 0) {
            let tmp = [res.data]
            this.ch(tmp)
            this.groupData = tmp
            callback && callback()
          }
        })
      },
      addClick() {
        this.findRootGroup(() => {
          this.modal = true
        })
      },
      edit(username) {
        let stop = this.$loading()
        findByUsername(username).then(res => {
            stop()
          if (res.code == 0) {
            this.title = '修改用户'
            this.userinfo.id = res.data.id
            this.userinfo.staffName = res.data.staffName
            this.userinfo.username = res.data.username
            this.userinfo.staffEmail = res.data.staffEmail
            this.userinfo.groupIds = res.data.groups.map(item => item.id)
            this.userinfo.roleIds = res.data.roles.map(item => item.id)
            // console.log(this.userinfo)
            this.findRootGroup(() => {
              this.modal = true
              this.editStatus = true
            })
          }
        }).catch(err => {
          stop()
        })
      },
      query() {
        this.page.num = 1
        this.getUserList()
      },
      getUserList(data = {}) {
        this.loading = true
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          data[this.paramType] = searchValue
        }
        allStaff(this.page.num, this.page.size, data).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.page.total = res.data.totalElements
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
            content: '确定要删除所选用户吗？',
            onOk: () => {
              let arr = this.selection.map(item => item.id)
              this.delStaff(arr)
            }
          })
        } else {
          this.$Message.error('请先选择用户')
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

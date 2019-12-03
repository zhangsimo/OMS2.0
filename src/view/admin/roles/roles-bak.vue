<template>
  <div>
    <section class='con-box w200 fl'>
      <!--<span style="font-size: 16px">组织信息</span>-->
      <Tree ref="" :data='groupData' children-key="childs" :render="renderContent"></Tree>
    </section>
    <section class="con-box ml15 fl" style="width: calc(100% - 215px)">
      <Table ref="taskTable" size="small" :loading="loading" border stripe :columns="thdata" :data="tbdata">
        <div slot="header" style="font-size: 16px">
          <span v-if="groupName != null">【{{groupName}}】-角色列表</span>
          <span v-else>选择组织，查看角色</span>

          <Button v-if="groupName != null" type='primary' icon="plus-round" class="fr mt10 mr15" @click='add'>新增角色</Button>
          <Button v-if="groupName != null" icon='refresh' class="fr mt10 mr15" @click='refresh'>刷新</Button>
        </div>
        <div v-if="tbdata.length > 0" slot="footer" style="text-align: right;padding-right: 15px">
          共{{tbdata.length}}条
        </div>
      </Table>
    </section>

    <Modal v-model='modal' :mask-closable="false" :closable="false" :title="title" @on-cancel="modalHide">
      <RoleEdit ref="roleEdit" :data='role' :res="resData" :oDisplayname="oDisplayname" :oname="oname" :groupName="groupName"></RoleEdit>
      <div slot='footer'>
        <Button type='text' @click='modalHide'>取消</Button>
        <Button type='primary' @click='submit'>确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import RoleEdit from './roleEdit.vue'
  import { findRootRes } from '_api/admin/resourceApi'
  import { findRootGroup } from '_api/admin/groupApi'
  import { queryRoles, addOrUpdate, deleteById } from '_api/admin/roleApi'

  export default {
    data () {
      return {
        groupId: null,
        groupData: [],
        groupName: null,
        oname: '',
        oDisplayname: '',
        loading: false,
        title: '新增角色',
        modal: false,
        role: {
          id: null,
          name: null,
          displayName: null,
          resIds: []
        },
        resData: [],
        thdata: [
          {
            title: "序号",
            align: "center",
            type: "index",
            key: "index",
            width: 60
          },
          {
            title: "角色名称",
            align: "center",
            key: "displayName",
            minWidth: 160
          },
          {
            title: '角色标识',
            align: 'center',
            key: 'name',
            minWidth: 160
          },
          {
            title: "资源个数",
            align: "center",
            key: "",
            render: (h, params) => {
              return h('span', {}, params.row.resourceVOSet.length)
            },
            minWidth: 160
          },
          {
            title: "操作",
            align: "center",
            key: "",
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    size: 16,
                    type: 'edit'
                  },
                  attrs: {
                    title: '修改',
                  },
                  class: 'pointer',
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }),
                h('Icon', {
                  props: {
                    size: 16,
                    type: 'android-delete'
                  },
                  attrs: {
                    title: '删除',
                  },
                  class: 'delete ml15',
                  on: {
                    click: () => {
                      this.del(params.row.id)
                    }
                  }
                })
              ])
            },
            width: 100
          }
        ],
        tbdata: []
      }
    },
    components: {
      RoleEdit
    },
    mounted () {
      this.findRootGroup()
    },
    methods: {
      findRootRes(callback) {
        findRootRes().then(res => {
          callback && callback(res)
        })
      },
      findRootGroup() {
        findRootGroup().then(res => {
          if (res.code == 0) {
            res.data.expand = true
            this.groupData =[res.data]
          }
        })
      },
      refresh() {
        this.getRoles()
      },
      getRoles () {
        this.loading = true
        queryRoles([this.groupId]).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data
          }
        }).catch(err => {
          this.loading = false
        })
      },
      del (id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确实要删除吗？',
          onOk: () => {
            deleteById({id}).then(res => {
              if (res.code == 0) {
                this.refresh()
              }
            })
          }
        })
      },
      modalHide() {
        this.modal = false
        this.title = '新增角色'
        this.role.id = null
        this.role.name = null
        this.role.displayName = null
        this.role.resIds = []
        this.oDisplayname = ''
        this.oname = ''
        this.$refs.roleEdit.resetFields()
      },
      submit() {
        this.$refs.roleEdit.handleSubmit(() => {
          addOrUpdate(this.role, this.groupId, this.role.resIds).then(res => {
            if (res.code == 0) {
              this.refresh()
              this.modalHide()
            }
          })
        })
      },
      edit (data) {
        this.findRootRes((res, group) => {
          this.oDisplayname = data.displayName
          this.oname = data.name
          this.title = '修改角色'
          this.role.id = data.id
          this.role.name = data.name
          this.role.displayName = data.displayName
          this.role.resIds = data.resourceVOSet.map(item => item.id)

          let tmp = [res.data]
          this.ch(tmp)
          this.resData = tmp

          this.modal = true
        })
      },
      add() {
        this.findRootRes((res, group) => {
          let tmp = [res.data]
          this.ch(tmp)
          this.resData = tmp

          this.modal = true
        })
      },
      ch(arr) {
        arr.map(item => {
          if (item.resType == 1 || item.childs.length == 0) {
            if (this.role.resIds.indexOf(item.id) != -1) {
              item.checked = true
            }
          }
          if (item.childs.length > 0) {
            this.ch(item.childs)
          }
        })
      },
      renderContent (h, { root, node, data }) {
        let childCount = node.childs.length
        let title = ''
        if (childCount == 0) {
          title = data.name
        } else {
          title = `${data.name} （${childCount}）`
        }
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', {
            style: {
              cursor: 'pointer'
            },
            class: this.groupId == data.id ? 'ivu-tree-title-selected ivu-tree-title' : '',
            on: {
              click: () => {
                this.groupId = data.id
                this.groupName = data.name
                this.getRoles()
              }
            }
          }, title)
        ]);
      }
    },
    computed: {
      basePage () {
        return 1 + (this.page.num -1)* this.page.size
      }
    }
  }
</script>

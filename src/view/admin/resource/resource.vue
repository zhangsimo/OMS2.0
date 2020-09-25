<template>
  <div>
    <section class="oper-box">
      <div class="oper-top">
        当前系统：
        <Select v-model='sysType' style='width: 120px' class="mr20" @on-change="sysTypeChange">
          <Option v-for='item in sysTypeArr' :value="item.scope" :key="item.scope">{{item.title}}</Option>
        </Select>
        <!--<Button type='primary' @click='modal = true'>新增</Button>-->
        <!--<Button icon='refresh' class="ml15" @click='refresh'>刷新</Button>-->
      </div>
    </section>

    <section class="con-box" style="min-width: 900px;height: 650px;overflow: hidden;position: relative">

      <div style="background: #f8f8f9;overflow: hidden;position: absolute;left: 0;top: 0;width: 100%;z-index: 10;border-bottom: 1px solid #eee">
        <div style="width: 750px;float: right;height: 35px;line-height: 38px">
          <b class="w140 fr tc">排序</b>
          <b class="w350 fr tc">链接</b>
          <b class="w120 fr tc">标识</b>
          <b class="w110 fr tc">操作</b>
        </div>
        <div class="tc" style="width: 120px;height: 35px;line-height: 35px">
          <b>名称</b>
        </div>
      </div>

      <div style=";position: absolute;top: 35px;left: 0;right: 0;bottom: 0;overflow-y: scroll;overflow-x: hidden;padding: 0 10px 10px 10px">
        <Tree :data="resource" children-key="childs" :render="renderContent" style="border: 0px solid #eee"></Tree>
      </div>

    </section>

    <Modal v-model='modal' :mask-closable="false" :closable="false" :title="title" @on-cancel="modalHide">
      <resourceEdit ref="child" :data="newRes" :parentName="parentName" :name="resName"></resourceEdit>
      <div slot='footer'>
        <Button type='text' @click='modalHide'>取消</Button>
        <Button type='primary' @click='submit'>确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import resourceEdit from './resourceEdit'
  import { findResScope, findRootResByScope, addOrUpdate, deleteById } from '_api/admin/resourceApi'

  export default {
    name: 'resource',
    data() {
      return {
        sysType: 'wms',
        sysTypeArr: [],
        resName: '',
        title: '新增资源',
        modal: false,
        loading: false,
        resource: [],
        newRes: {
          pId: null,
          id: null,
          name: null,
          displayName: null,
          displayOrder: 0,
          urlMatcher: null,
          resType: '0'
        },
        parentName: ''
      }
    },
    components: {resourceEdit},
    activated() {
      this.refresh()
    },
    mounted() {
      this.findResScope()
    },
    methods: {
      refresh() {
        this.findRootResByScope()
      },
      findResScope() {
        findResScope().then(res => {
          this.sysTypeArr = res.data || []
          let tmp = this.sysTypeArr.filter(item => item.scope == this.sysType)
          if (tmp.length === 0) {
            this.sysType = this.sysTypeArr[0] && this.sysTypeArr[0].scope
          }
          this.findRootResByScope()
        })
      },
      findRootResByScope() {
        let stop = this.$loading()
        findRootResByScope(this.sysType).then(res => {
          stop()
          // res.data.expand = true
          let data = [res.data]
          this.setExpand(data)
          this.resource = data
        }).catch(err => {
          stop()
        })
      },
      setExpand(data) {
        if (!data.length) {
          return
        }
        data.map(item => {
          item.expand = true
          this.setExpand(item.childs || [])
        })
      },
      sysTypeChange() {
        this.findRootResByScope()
      },
      renderContent(h, {root, node, data}) {
        let childCount = node.childs.length
        let opts = [
          h('Icon', {
            props: {
              size: 16,
              type: 'android-add-circle'
            },
            attrs: {
              title: '添加下级资源',
            },
            class: 'ivu-icon ivu-icon-ios-add-circle pointer ml15',
            on: {
              click: () => { this.addClick(data.id, data.displayName) }
            }
          }),
          h('Icon', {
            props: {
              size: 16,
              type: 'edit'
            },
            attrs: {
              title: '修改',
            },
            class: 'iconfont iconbianjixiugaiicon  icons pointer ml15',
            on: {
              click: () => {
                let pnode = root[node.parent].node
                let pname = pnode.displayName
                let pid = pnode.id
                this.editClick(pname, pid, data)
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
            class: 'iconfont iconlajitongicon icons pointer ml15',
            on: {
              click: () => {
                if (childCount > 0) {
                  this.$Message.warning('存在下级资源，不能删除')
                  return
                }
                this.del(data.id)
              }
            }
          }),
          h('input', {//标识
            attrs: {
              readonly: true,
              value: node.nodeKey == 0 ? '' : data.name,
              title: node.nodeKey == 0 ? '' : data.name
            },
            class: 'res-input w140 ml20',
          }),
          h('input', {//链接
            attrs: {
              readonly: true,
              value: data.urlMatcher,
              title: data.urlMatcher,
            },
            class: 'res-input w350 ml15',
          }),
          h('input', {//排序
            attrs: {
              readonly: true,
              value: node.nodeKey == 0 ? '' : data.displayOrder
            },
            class: 'res-input w50 ml15 tc',
            on: {
              click: () => {
              }
            }
          })
        ]

        if (node.nodeKey == 0) {
          opts.splice(1, 2)
        }

        let iconType = 'link'
        if (data.resType == 1) {
          opts.splice(0, 1)
          iconType = 'ios-gear'
        }

        return h('span', {
          class: 'tree-item'
        }, [
          h('span',  [
            h('Icon', {
              props: {
                size: 16,
                type: iconType
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.displayName)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              width: 'calc(100% - 200px)',
              marginRight: '32px',
              textAlign: 'right'
            }
          }, opts)
        ]);
      },
      addClick(pid, pname) {
        this.resName = ''
        this.newRes.pId = pid
        this.parentName = pname
        this.modal = true
      },
      editClick(pname, pid, data) {
        this.resName = data.name
        this.parentName = pname
        this.newRes.pId = pid
        this.newRes.id = data.id
        this.newRes.displayName = data.displayName
        this.newRes.name = data.name
        this.newRes.urlMatcher = data.urlMatcher
        this.newRes.resType = data.resType + ''
        this.newRes.displayOrder = data.displayOrder || 0

        this.title = '修改资源'
        this.modal = true
      },
      modalHide() {
        this.modal = false
        this.title = '新增资源'

        this.newRes.id = null
        this.newRes.pId = null
        this.newRes.displayName = ''
        this.newRes.name = ''
        this.newRes.urlMatcher = ''
        this.newRes.resType = '0'
        this.$refs.child.resetFields()
      },
      submit() {
        this.$refs.child.handleSubmit(() => {
          let stop = this.$loading()
          this.newRes.scope = this.sysType
          this.newRes.systemScope = this.sysType
          addOrUpdate(this.newRes).then(res => {
            stop()
            if (res.code == 0) {
              if (this.newRes.id)
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
        this.refresh()
        this.modalHide()
      },
      del(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定要删除吗？',
          onOk: () => {
            let stop = this.$loading()
            deleteById({id}).then(res => {
              stop()
              if (res.code == 0) {
                this.refresh()
                this.$Message.success(res.message)
              }
            }).catch(err => {
              stop()
            })
          }
        })
      }
    }
  }
</script>
<style>
  .tree-item {
    display: inline-block;
    width: 100%;
    padding: 10px 0 10px 10px;
    border-bottom: 1px solid #eeeeee;
  }
  .tree-item:hover {
    background: #f8f8f9;
  }

  .res-input {
    display: inline-block;
    border-radius: 5px;
    color: #666;
    border: 1px solid #ddd;
  }
</style>

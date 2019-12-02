<template>
  <div>
    <section class="oper-box">
      <div class="oper-top">
        <label class="oos-label">查询条件：</label>
        <Select v-model='selectType' class='w100'>
          <Option v-for='item in selectTypeArr' :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
        <Input v-model="searchValue" :placeholder="placeh" class="w200"></Input>
        <button type="button" class="ivu-btn ivu-btn-primary ml15" @click="query">查询</button>
      </div>
      <div class="oper-bottom">
        <Button type='primary' @click='add'>新增</Button>
      </div>
    </section>

    <section class="con-box">
      <Table :loading="loading" border stripe :columns="thdata" :data="tbdata">
      </Table>
      <Page :total="page.total" :page-size="page.size" :current="page.num" show-sizer show-total class-name="page-con"
            @on-change="selectNum" @on-page-size-change="selectPage"></Page>
    </section>

    <Modal v-model='modal' :mask-closable="false" :closable="false" :title="title" @on-cancel="modalHide">
      <RoleEdit ref="roleEdit" :data='role' :res="resData" :oDisplayname="oDisplayname" :oname="oname" :company="companyList" ></RoleEdit>
      <div slot='footer'>
        <Button type='text' @click='modalHide'>取消</Button>
        <Button type='primary' @click='submit'>确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import RoleEdit from './roleEdit.vue'
  import {findRootRes} from '_api/admin/resourceApi'
  import {queryRolesByPage, addOrUpdate, deleteById} from '_api/admin/roleApi'
  import {allStaffCompany} from '_api/admin/companyApi'

  export default {
    name: 'role',
    data() {
      return {
        oname: '',
        oDisplayname: '',
        loading: false,
        selectType: "0", // 查询条件
        selectTypeArr: [
          {value: "0", label: "角色名称", param: 'displayName'},
          {value: "1", label: "角色标识", param: 'name'}
        ],
        title: '新增角色',
        modal: false,
        role: {
          id: null,
          name: null,
          displayName: null,
          resIds: [],
          tenantId:''
        },
        resData: [],
        page: {
          size: 10,
          num: 1,
          total: 0
        },
        thdata: [
          {
            title: "序号",
            align: "center",
            render: (h, params) => {
              return h('span', params.index + this.basePage)
            },
            width: 60
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
                  class: 'iconfont iconbianjixiugaiicon  icons pointer',
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
                  class: 'iconfont iconlajitongicon icons pointer ml15',
                  on: {
                    click: () => {
                      this.del(params.row.id)
                    }
                  }
                })
              ])
            },
            width: 100
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
              let length = params.row.resourceVOSet.length
              length = length > 0 ? (length - 1) : length
              return h('span', {}, length)
            },
            minWidth: 160
          }
        ],
        tbdata: [],
        companyList:''
      }
    },
    components: {
      RoleEdit
    },
    activated() {
      this.getRoles()
    },
    mounted() {
      this.getRoles()
      this.getCompanyList()
    },
    methods: {
       //获取公司
        getCompanyList(data ={}){
            allStaffCompany(this.page.num, 10000, data).then(res => {
                if (res.code == 0) {
                    this.companyList = res.data.content
                }
            })
        },
      findRootRes(callback) {
        let stop = this.$loading()
        findRootRes().then(res => {
          stop()
          callback && callback(res)
        }).catch(err => {
          stop()
        })
      },
      query() {
        this.page.num = 1
        this.getRoles()
      },
      getRoles() {
        this.loading = true
        let searchValue = this.searchValue.trim(), displayName = '', name = ''
        if (searchValue) {
          if (this.paramType == 'displayName') {
            displayName = searchValue
          } else {
            name = searchValue
          }
        }
        console.log(displayName, name,this.page.size, this.page.num - 1)
        queryRolesByPage(displayName, name, this.page.size, this.page.num - 1).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.page.total = res.data.totalElements
            this.tbdata = res.data.content
          }
        }).catch(err => {
          this.loading = false
        })
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
                this.getRoles()
                this.$Message.success(res.message)
              }
            }).catch(err => {
              stop()
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
          let stop = this.$loading()
          addOrUpdate(this.role, this.role.resIds).then(res => {
            stop()
            if (res.code == 0) {
              if (this.role.id) {
                this.$Message.success('修改成功')
                this.getRoles()
              } else {
                this.$Message.success('新增成功')
                this.query()
              }
              this.modalHide()
            }
          }).catch(err => {
            stop()
          })
        })
      },
      edit(data) {
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
          item.expand = true
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
      selectPage(size) {
        this.page.size = size
        this.getRoles()
      },
      selectNum(num) {
        this.page.num = num
        this.getRoles()
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

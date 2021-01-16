<template>
  <div>
    <!--<section  class="oper-box">-->
    <!--<div class="oper-top">-->
    <!--<Button type='primary' @click=''>新增</Button>-->
    <!--<Button icon="refresh" class="ml15" @click='refresh'>刷新</Button>-->
    <!--</div>-->
    <!--</section>-->
    <div style="min-width: 600px">
      <section
        class="con-box w400 fl mr15"
        style=" overflow-x: hidden;overflow-y: auto;height: 670px"
      >
        <!--<span style="font-size: 16px">组织信息</span>-->
        <Tree
          :data="groups"
          children-key="childs"
          :render="renderContent"
        ></Tree>
      </section>
      <section
        class="con-box fl"
        style="width: calc(100% - 415px);min-width: 400px"
      >
        <Table
          size="small"
          height="650"
          :loading="loading"
          border
          stripe
          :columns="thdata"
          :data="tbdata"
        >
          <div slot="header" style="font-size: 16px">
            <span v-if="curName != null">【{{ curName }}】-人员列表</span>
            <span v-else>点击左侧【查看人员】按钮，查看组织人员</span>

            <!--            <Button v-if="curName != null" type="primary" icon="plus-round" class="mr15 mt10 fr" @click='addStaff'>添加人员</Button>-->
          </div>
          <div slot="footer" style="text-align: right;padding-right: 15px">
            共{{ tbdata.length }}人
          </div>
        </Table>
      </section>
    </div>
    <Modal
      v-model="modal"
      :mask-closable="false"
      :closable="false"
      @on-cancel="modalHide"
      :title="title"
    >
      <groupEdit
        :data="newGroup"
        :parentName="parentName"
        ref="child"
        :parentList="superior"
        :company="companyList"
      ></groupEdit>
      <div slot="footer">
        <Button type="text" @click="modalHide">取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="staff.modal" :title="staff.title">
      <Form :label-width="60">
        <FormItem label="人员:">
          <Select v-model="staff.checkedIds" filterable multiple>
            <Option
              v-for="item in staff.data"
              :value="item.id"
              :key="item.staffName"
            >{{ item.staffName }}
            </Option
            >
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="staff.modal = false">取消</Button>
        <Button type="primary" @click="staffSubmit">确定</Button>
      </div>
    </Modal>


    <!--    //编辑权限模态框-->
    <Modal
      v-model="rightControlShow"
      title="编辑权限"
    >
      <Tree
        style="max-height: 600px;overflow-y: auto"
        :data="treeList"
        show-checkbox
        children-key="childs"
        ref="resTree"
        @on-check-change="checkChange"
      ></Tree>
      <div slot="footer">
        <Button type="primary" @click="submit">保存</Button>
        <Button type="text" @click="rightControlShow = false">取消</Button>
      </div>
    </Modal>

    <Modal v-model="staff.modal" :title="staff.title">
      <Form :label-width="60">
        <FormItem label="人员:">
          <Select v-model="staff.checkedIds" filterable multiple>
            <Option
              v-for="item in staff.data"
              :value="item.id"
              :key="item.staffName"
            >{{ item.staffName }}
            </Option
            >
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="staff.modal = false">取消</Button>
        <Button type="primary" @click="staffSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {isExisted} from "_api/admin/groupApi";
  import groupEdit from "./groupEdit.vue";
  import {
    findRootGroup,
    deleteById,
    addOrUpdate,
    findStaffByGroupId,
    findAllStaff,
    changeStaff,
    removeStaff
  } from "_api/admin/groupApi";
  import {goshop} from '@/api/settlementManagement/shopList'

  export default {
    name: "group",
    components: {
      groupEdit
    },
    data() {
      return {
        issave: true,
        title: "新增组织",
        companyList: "",
        superior: [],
        staff: {
          modal: false,
          title: "",
          checkedIds: [],
          data: []
        },
        groups: [],
        groupsList: [],
        curId: null,
        curName: null,
        parentName: "",
        newGroup: {
          id: null,
          pId: null,
          name: null
        },
        modal: false,
        loading: false,
        page: {
          size: 10,
          num: 1,
          total: 0
        },
        thdata: [
          {
            title: "序号",
            align: "center",
            type: "index",
            width: 60
          },
          {
            title: "姓名",
            align: "center",
            key: "staffName",
            minWidth: 120
          },
          {
            title: "登录名",
            align: "center",
            key: "username",
            minWidth: 160
          },
          // {
          //   title: "操作",
          //   align: "center",
          //   key: "",
          //   render: (h, params) => {
          //     return h( 'div', [
          //       h('a', {
          //         props: {
          //           size: 'small'
          //         },
          //         style: {
          //           marginRight: '5px'
          //         },
          //         on: {
          //           click: () => {
          //             this.openModel(params)
          //           }
          //         }
          //       }, '编辑权限')
          //     ])
          //
          //   },
          //   width: 80
          // }
        ],
        tbdata: [],//右侧人员列表数据
        rightControlShow: false,//编辑权限模态框展示
        treeList: [],//树形图数据展示
      };
    },
    activated() {
      this.findRootGroup();
    },
    mounted() {
      this.findRootGroup();
      this.getCompanyList();
    },
    methods: {
      async getCompanyList() {
        let data = {}
        let res = await goshop(data)
        if (res.code === 0) return this.companyList = [...this.companyList, ...res.data]
      },
      staffSubmit() {
        let stop = this.$loading();
        changeStaff(this.curId, this.staff.checkedIds)
          .then(res => {
            stop();
            if (res.code == 0) {
              this.$Message.success(res.message);
              this.staff.modal = false;
              this.findStaffByGroupId();
            }
          })
          .catch(err => {
            stop();
          });
      },
      findAllStaff() {
        let stop = this.$loading();
        findAllStaff()
          .then(res => {
            stop();
            if (res.code == 0) {
              this.staff.data = res.data;
              this.staff.modal = true;
            }
          })
          .catch(err => {
            stop();
          });
      },
      findStaffByGroupId() {
        this.loading = true;
        findStaffByGroupId(this.curId)
          .then(res => {
            this.loading = false;
            if (res.code == 0) {
              this.tbdata = res.data;
              this.staff.checkedIds = this.tbdata.map(item => item.id);
              this.staff.title = `【${this.curName}】-人员调整`;
            }
          })
          .catch(err => {
            this.loading = false;
          });
      },
      addClick(pid, data) {
        this.$refs.child.resetFields();
        this.newGroup.id = null;
        this.newGroup.pId = data.id;
        this.newGroup.name = null;
        this.title = "新增组织";
        this.superior = this.groupsList
        this.modal = true;
      },
      renderContent(h, {root, node, data}) {
        let childCount = node.childs.length;
        let opts = [
          h("Icon", {
            props: {
              size: 16,
              type: "person",
            },
            style: {
              marginLeft: '10px'
            },
            attrs: {
              title: "查看人员"
            },
            class: "iconfont iconchaxunicon icons pointer",
            on: {
              click: () => {
                this.curId = data.id;
                this.curName = data.name;
                this.findStaffByGroupId();
              }
            }
          }),
          h("Icon", {
            props: {
              size: 16,
              type: "android-add-circle"
            },
            attrs: {
              title: "添加下级组织"
            },
            class: "ivu-icon ivu-icon-ios-add-circle pointer ml15",
            on: {
              click: () => {
                this.addClick(data.id, data);
              }
            }
          }),
          h("Icon", {
            props: {
              size: 16,
              type: "edit"
            },
            attrs: {
              title: "修改"
            },
            class: "iconfont iconbianjixiugaiicon  icons pointer ml15",
            on: {
              click: () => {
                let pnode = root[node.parent].node;
                let pname = pnode.name;
                let pid = pnode.id;
                this.editClick(pname, pid, data);
              }
            }
          }),
          h("Icon", {
            props: {
              size: 16,
              type: "android-delete"
            },
            attrs: {
              title: "删除"
            },
            class: "iconfont iconlajitongicon icons pointer ml15",
            on: {
              click: () => {
                if (childCount > 0) {
                  this.$Message.warning("存在下级组织，不能删除");
                  return;
                }
                this.del(data.id);
              }
            }
          })
        ];
        if (data.id == 0) {
          opts.pop();
          opts.pop();
        }
        let title = "";
        if (childCount == 0) {
          title = `${data.name}`;
        } else {
          title = `${data.name} （${childCount}）`;
        }
        return h(
          "span",
          {
            class: "tree-item"
          },
          [
            h(
              "span",
              {
                style: {
                  cursor: "pointer"
                },
                class:
                  this.curId == data.id
                    ? "ivu-tree-title-selected ivu-tree-title"
                    : "",
                on: {
                  click: () => {
                    this.curId = data.id;
                    this.curName = data.name;
                    this.findStaffByGroupId();
                    return false;
                  }
                }
              },
              title
            ),
            h(
              "span",
              {
                style: {
                  display: "inline-block",
                  float: "right",
                  marginRight: "32px"
                }
              },
              opts
            ),
            h("br"),
            h("span", {
              style: {
                fontSize: "10px",
                marginTop: "10px"
              }
            }, `所属门店:${data.orgName==null?'':data.orgName}`)
          ]
        );
      },
      submit() {
        if (!this.issave) return;
        this.$refs.child.handleSubmit(() => {
          addOrUpdate(this.newGroup)
            .then(res => {
              if (res.code == 0) {
                if (this.newGroup.id) {
                  this.success("修改成功");
                } else {
                  this.success("新增成功");
                }
              }
            })
        });
      },
      success(msg) {
        this.$Message.success(msg);
        this.refresh();
        this.modalHide();
      },
      modalHide() {
        this.modal = false;
        this.newGroup.id = null;
        this.newGroup.pId = null;
        this.newGroup.name = null;
        this.title = "新增组织";
        this.$refs.child.resetFields();
        this.superior = []
      },
      editClick(pname, pid, data) {
        let arr = this.groupsList.filter(el => (el.id != undefined && el.id == pid))
        this.title = "修改组织";
        // this.parentName = pname;
        this.newGroup.pId = pid;
        this.newGroup.id = data.id;
        this.newGroup.name = data.name;
        if (arr.length == 0) {
          this.superior = [this.groupsList[0]]
        } else {
          this.superior = this.groupsList.filter(el => el.pId == arr[0].pId)
        }
        this.modal = true;
      },
      flat(arr) {
        let arrResult = []
        arrResult.push(arr[0])
        arr.map(item => {
          if (item.childs.length > 0) {
            arrResult.push(...this.flat(item.childs))
            arrResult.push(item)
          } else {
            arrResult.push(item)
          }
        })
        return arrResult;
      },
      del(id) {
        this.$Modal.confirm({
          title: "提示",
          content: "确定要删除吗？",
          onOk: () => {
            let stop = this.$loading();
            deleteById({id})
              .then(res => {
                stop();
                if (res.code == 0) {
                  this.$Message.success(res.message);
                  this.refresh();
                } else {
                  this.$Message.error(res.message);
                }
              })
              .catch(err => {
                stop();
              });
          }
        });
      },
      refresh() {
        this.findRootGroup();
      },
      findRootGroup() {
        let stop = this.$loading();
        findRootGroup({groupId: this.$store.state.user.userData.groupId})
          .then(res => {
            stop();
            if (res.code == 0) {
              res.data.expand = true;
              this.groups = [res.data];
              this.groupsList = this.flat(this.groups)
            }
          })
          .catch(err => {
            stop();
          });
      },

      //打开编辑权限模态框
      openModel(params) {
        console.log(params)
        this.rightControlShow = true
      },

      //树形图复选框事件
      checkChange() {
        let tree = this.$refs.resTree,
          nodes = tree.flatState
      }
    }
  };
</script>
<style>
  .tree-item {
    display: inline-block;
    width: 100%;
    padding: 10px 0 10px 10px;
    border-bottom: 1px solid #eeeeee;
  }

  .tree-item:hover {
    /*background: #f8f8f9;*/
  }
</style>

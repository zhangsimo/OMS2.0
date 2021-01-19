import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import { findResScope } from '_api/admin/resourceApi'
// @ts-ignore
import { queryRolesByPage, deleteById, getStaff, saveStaffJurisdiction, saveOrder, findRootRes } from '_api/admin/roleApi.js';
// @ts-ignore
// import {findRootRes} from '_api/admin/resourceApi'
// @ts-ignore
// import {allStaff} from '_api/admin/userApi.js'
import AddRolse from "./AddRolse.vue"
import ChangeRolse from "@/view/admin/roles/ChangeRolse.vue";
// import {v} from "xe-utils/dist/xe-utils";

@Component({
  components: {
    AddRolse,
    ChangeRolse
  }
})

export default class Role extends Vue {

  //中间分割线比例
  private split1: number = 0.4
  //右侧表格数据
  private tableData: SelectTypes[] = []

  //右侧表格数据
  private rightTableData: SelectTypes[] = []
  //左侧分页数据
  private page: any = {
    size: 20,
    num: 1,
    total: 0
  }


  private sysTypeArr:Array<any>= [] //获取目前所有系统


  private systemScope:string = 'oms' //当前系统
  //点击获取的员工
  private oneStaff: any = {}
  //右侧权限树形图
  private treeList: any = []
  //权限变量
  private role: any = {
    id: null,
    name: null,
    displayName: null,
    resIds: [],
    tenantId: ''
  }
  // 右侧分页数据
  private pageRight: any = {
    size: 20,
    num: 1,
    total: 0
  }

  //员工搜索机构
  private organization: string = ''

  private staffName: string = ''

  //按钮权限
  private right: number = 1

  //树形
  // private tree:any = []
  //-------------------mounted-----------------------------------------------

  private mounted() {
    this.findResScope()
    this.getLeftList()
    this.right = this.$store.state.user.userData.shopkeeper
  }
  //-------------------------------methods-----------------------------------------
  //获取当前全部系统
  findResScope() {
    findResScope().then(res => {
      this.sysTypeArr = res.data || []
    })
  }


  //切换当前系统
  sysTypeChange(){
    this.getLeftList()
    this.treeList = []
  }

  //获取左侧全部角色
  private async getLeftList() {
    let data: any = {}
    data.size = this.page.size
    data.page = this.page.num - 1
    data.systemType = 0
    data.systemScope = this.systemScope
    let res: any = await queryRolesByPage(data)
    if (res.code == 0) {
      this.tableData = res.data.content
      this.tableData.map( item=>  {
        switch(item.systemType){
          case 0:
            item.scopeName = '订单管理系统'
            break
          case 1:
            item.scopeName = '仓储管理系统'
            break
          case 2:
            item.scopeName = '税务财务系统'
            break
          case 3:
            item.scopeName = '权限管理系统'
            break
        }
      })
      this.page.total = res.data.totalElements
      this.oneStaff = {}
    }
  }

  //点击左侧表格获取当前数据
  private async setOneTable(val) {
    this.oneStaff = JSON.parse(JSON.stringify(val.row))
    this.role.id = val.row.id
    this.role.name = val.row.name
    this.role.displayName = val.row.displayName
    this.role.resIds = val.row.resourceVOSet.map(item => item.id) /*将左侧员工与右侧权限对应 */
    this.findRootRes()
    this.getAllStaff()
    // console.log(val.row)
  }

  // 获取员工
  private async getAllStaff() {
    let data: any = {}
    data.userName = this.staffName
    data.shopName = this.organization
    /*右侧分页参数 */
    data.page = this.pageRight.num - 1
    data.size = this.pageRight.size
    data.roleId = this.oneStaff.id
    data.systemScope = this.systemScope
    let res = await getStaff(data)
    if (res.code === 0) {
      this.rightTableData = res.data.content
      /* 右侧分页数据*/
      this.pageRight.total = res.data.totalElements
    }
  }
  //方法
  private ch(arr) {
    arr.map(item => {
      item.expand = true
      if (this.right != 0) {
        item.disabled = true
      }
      if (item.resType == 1 || !item.childs) {
        if (this.role.resIds.indexOf(item.id) != -1) {
          item.checked = true
        }
      }
      if (item.childs) {
        this.ch(item.childs)
      }
    })
  }

  //左侧切换当前页
  private selectNum(val) {
    this.page.num = val
    this.getLeftList()
  }
  // 右侧切换当前页
  private selectNumRight(val){
    this.pageRight.num=val
    this.getAllStaff()
  }
  //左侧切换当前条数
  private selectPage(val) {
    this.page.num = 1
    this.page.size = val
    this.getLeftList()
  }
  // 右侧切换当前条数
  private selectPageRight(val){
    this.pageRight.num=1
    this.pageRight.size=val
    this.getAllStaff()
  }
  //新增员工模态框
  private openAdd() {
    let modal: any = this.$refs.add
    modal.openModal(0)
  }
  //确定新增员工
  private addList() {
    this.page.num = 1
    this.getLeftList()
  }
  //修改员工
  private changeStaff() {
    if(this.oneStaff.moduleType==2&&this.oneStaff.moduleId==this.$store.state.user.userData.tenantId){
      return this.$message.error("不可修改")
    }
    if (!this.oneStaff.id) {
      this.$message.error('请先选择需要修改的角色')
      return
    }
    let modal: any = this.$refs.change
    modal.openModal(0)
  }

  //确定修改员工
  private changeList() {
    this.page.num = 1
    this.getLeftList()
  }

  //删除员工
  private delectStaff() {
    if(this.oneStaff.moduleType==2&&this.oneStaff.moduleId==this.$store.state.user.userData.tenantId){
      return this.$message.error("不可删除")
    }
    if (!this.oneStaff.id) {
      this.$message.error('请先选择角色')
      return
    }
    this.$Modal.confirm({
      title: '是否删除',
      content: '<p>是否要删除当前角色</p>',
      onOk: async () => {
        let data: any = {}
        data.id = this.oneStaff.id
        let res = await deleteById(data)
        if (res.code === 0) {
          this.getLeftList()
        }
      },
      onCancel: () => {
      }
    });
  }

  //树形图方法
  private async findRootRes() {
    // @ts-ignore
    let stop: any = this.$loading()
    let data:any ={}
    data.systemScope = this.systemScope
    let res: any = await findRootRes(data)
    if (res.code === 0) {
      stop()
      let tmp = res.data
      this.ch(tmp)
      this.treeList = tmp
    } else { stop() }

  }

  //树形图复选框
  private checkChange() {
    let checkedIds = []
    let tree: any = this.$refs.resTree,
      nodes: any = tree.flatState,
      // @ts-ignore
      arrList: Array = [],
      showArr: any = []
    nodes.map(item => {
      if (item.node.checked || item.node.indeterminate)
        // @ts-ignore
        arrList.push(item.node)
    })
    arrList = arrList.filter(item =>
      item.name.length == 4 //用来判定是否是页面
    )

    arrList.map(item => {
      if (item.childs) {
        showArr.push(item.childs.filter(item => item.displayName == '查看')[0])
      }
    })
    nodes.map(item => {
      if (item.node.checked || item.node.indeterminate)
        // @ts-ignore
        checkedIds.push(item.node.id)
    })

    showArr.forEach(item => {
      if (!item) return
      if (!item.hasOwnProperty('checked') || !item.checked) {
        checkedIds = checkedIds.filter(v => v != item.parentId)
      }
    })

    this.role.resIds = checkedIds

  }

  //保存修改好的数据
  private save() {
    // @ts-ignore
    let stop: any = this.$loading()
    // this.role.id = ''
    let data:any = {}
    data.systemScope = this.systemScope
    saveOrder(this.role, this.role.resIds , data).then(res => {
      if (res.code == 0) {
        this.getLeftList()
        console.log(this.role)
        this.$Message.success('修改成功')
        stop()
      }
    }).catch(err => {
      this.$Message.error('修改失败')
      stop()
    })
    this.checkChange()
  }

  //点击属性数据获取值
  private selectTree(val) {
    // console.log(val ,888)
  }

  //员工点击查询
  private search() {
    if (!this.oneStaff.id) {
      this.$message.error('请先选择角色')
      return
    }
    this.getAllStaff()
  }

  //员工权限保存
  private async saveStaff() {
    let data: any = {}
    let arr : any = []
    let leave: any = []
    this.rightTableData.forEach(item =>
   { if (item.allocation == 0){
     arr.push(item.id)
   }else {
     leave.push(item.id)
   }
   })
    data.userIdsList = arr
    data.userRoleId = this.oneStaff.id
    data.userIds = leave
    let res = await saveStaffJurisdiction(data)
    if (res.code === 0) {
      this.$message.success('保存成功')
      this.getAllStaff()
    }
  }
}


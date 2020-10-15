import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import {queryRolesByPage,deleteWMSChangeUserRoles,deleteById,getStaffWms,saveStaffJurisdictionWms,saveOrder,findRootResWms,getWarehouse,} from '_api/admin/roleApi.js';
// @ts-ignore
// import {findRootRes} from '_api/admin/resourceApi'
// @ts-ignore
// import {allStaff} from '_api/admin/userApi.js'
import AddRolse from "./AddRolse.vue"
import ChangeRolse from "@/view/admin/roles/ChangeRolse.vue";

@Component({
  components: {
    AddRolse,
    ChangeRolse
  }
})

export default class Roleswms extends Vue {

  //中间分割线比例
  private split1: number = 0.3
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
  //员工分页数据
  private pageR: any = {
    size: 20,
    num: 1,
    total: 0
  }
  //点击获取的员工
  private oneStaff: any = {}
  //点击获取的wms员工
  private oneWms: any = null
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

  //员工搜索机构
  private organization: string = ''

  private staffName: string = ''

  //按钮权限
  private right: number = 1

  // 选择的仓库
  private selectHouse: Array<any> = ["0"]
  // 仓库列表
  private wareHouse: Array<any> = new Array()

  //树形
  // private tree:any = []
  //-------------------mounted-----------------------------------------------

  private mounted() {
    this.getLeftList()
    this.getWarehouse()
    this.right = this.$store.state.user.userData.shopkeeper
  }
  //-------------------------------methods-----------------------------------------

  // 获取仓库
  private async getWarehouse() {
    let res = await getWarehouse()
    if (res.code == 0) {
      this.wareHouse = res.data.content;
    }
  }

  //获取左侧全部员工
  private async getLeftList() {
    let data: any = {}
    data.size = this.page.size
    data.page = this.page.num - 1
    data.systemType = 1
    data.systemScope ='wms'
    let res: any = await queryRolesByPage(data)
    if (res.code == 0) {
      this.tableData = res.data.content
      this.page.total = res.data.totalElements
      this.oneStaff = {}
    }
  }

  //点击左侧表格获取当前数据
  private async setOneTable(val) {
    this.oneStaff = JSON.parse(JSON.stringify(val.row))
    // console.log(this.oneStaff , 9999)
    this.role.id = val.row.id
    this.role.name = val.row.name
    this.role.displayName = val.row.displayName
    this.role.resIds = val.row.resourceVOSet.map(item => item.id)
    this.findRootRes()
    // console.log("resIds:", this.role.resIds)
    this.getAllStaff()
    // console.log(val.row)
  }

  // 获取员工
  private async getAllStaff() {
    let data: any = {}
    data.userName = this.staffName
    data.shopName = this.organization
    data.roleId = this.oneStaff.id
    let params: any = {}
    params.size = this.pageR.size
    params.page = this.pageR.num - 1
    let res = await getStaffWms(params, data)
    if (res.code === 0) {
      this.rightTableData = res.data.content
      this.pageR.total = res.data.totalElements
    }
  }
  //方法
  private ch(arr) {
    arr.map(item => {
      item.expand = true
      if (this.right != 0) {
        item.disabled = true
      }
      if (item.resType == 1 || ((Array.isArray(item.childs) && item.childs.length <= 0) || !item.childs)) {
        if (this.role.resIds.indexOf(item.id) != -1) {
          item.checked = true
        }
      }
      if (item.childs) {
        this.ch(item.childs)
      }
    })
  }

  //切换当前页
  private
  selectNum(val) {
    this.page.num = val
    this.getLeftList()
  }
  //切换当前条数
  private selectPage(val) {
    this.page.num = 1
    this.page.size = val
    this.getLeftList()
  }
  private selectNumR(val) {
    this.pageR.num = val
    this.search()
  }
  //切换当前条数
  private selectPageR(val) {
    this.pageR.num = 1
    this.pageR.size = val
    this.search()
  }
  //新增员工模态框
  private openAdd() {
    let modal: any = this.$refs.add
    modal.openModal(1)
  }
  //确定新增员工
  private addList() {
    this.page.num = 1
    this.getLeftList()
  }
  //修改员工
  private changeStaff() {
    if (!this.oneStaff.id) {
      this.$message.error('请先选择需要修改的角色')
      return
    }
    let modal: any = this.$refs.change
    modal.openModal(1)
  }

  //确定修改员工
  private changeList() {
    this.page.num = 1
    this.getLeftList()
  }

  //删除员工
  private delectStaff() {
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
    let res: any = await findRootResWms()
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
      nodes: any = tree.flatState
    nodes.map(item => {
      if (item.node.checked || item.node.indeterminate)
        // @ts-ignore
        checkedIds.push(item.node.id)
    })
    this.role.resIds = checkedIds
  }

  //保存修改好的数据
  private save() {
    // @ts-ignore
    let stop: any = this.$loading()
    // this.role.id = ''
    saveOrder(this.role, this.role.resIds).then(res => {
      if (res.code == 0) {
        this.getLeftList()
        this.$Message.success('修改成功')
        stop()
      }
    }).catch(err => {
      this.$Message.error('修改失败')
      stop()
    })
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
    if (!this.oneWms) {
      return this.$Message.error("请先选择员工")
    }
    if (this.selectHouse.length <= 0) {
      return this.$Message.error("请选择仓库")
    }
    if (this.rightTableData.length <= 0) {
      return this.$message.error('员工数量为0,无法保存')
    }
    let data: Array<any> = new Array()
    // @ts-ignore
    data.id = this.rightTableData[0].id
    // @ts-ignore
    data.roleIds = []
    this.rightTableData.forEach( item => {
      if(item.allocation ==0){
        data.push({id: item.id , roleIds:this.oneStaff.id , allocation:0})
      }else {
        data.push({id: item.id , roleIds:[] , allocation:1})
      }
    })
    data = [{ id: this.oneWms.id, roleIds: this.oneStaff.id, allocation: 0, warehouseType: this.selectHouse }]
    let res = await saveStaffJurisdictionWms(data)
    if (res.code === 0) {
      this.oneWms = null;
      this.$message.success('保存成功')
      this.getAllStaff()
    }
  }

  // 选择员工
  private setRowTable(row) {
    this.oneWms = JSON.parse(JSON.stringify(row.row))
  }

  // 删除wms权限
  private async delwms() {
    if (!this.oneWms) {
      return this.$Message.error("请先选择员工")
    }
    let data: Array<any> = new Array()
    // console.log(this.oneWms, this.oneStaff)
    // if(this.oneWms.allocation ==0){
    //   data = [{id: this.oneWms.id , roleIds:this.oneStaff.id , allocation:0}]
    // }else {
    //   data = [{id: this.oneWms.id , roleIds:[] , allocation:1}]
    // }
    data = [{ id: this.oneWms.id, roleIds: this.oneStaff.id, allocation: 0 }]
    let res = await deleteWMSChangeUserRoles(data)
    if (res.code == 0) {
      this.oneWms = null;
      this.$Message.success("删除wms权限成功")
      this.search()
    }
  }
}

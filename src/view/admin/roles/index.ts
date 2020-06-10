import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import {queryRolesByPage , deleteById , getStaff , saveStaffJurisdiction , saveOrder , findRootRes} from '_api/admin/roleApi.js';
// @ts-ignore
// import {findRootRes} from '_api/admin/resourceApi'
// @ts-ignore
// import {allStaff} from '_api/admin/userApi.js'
import AddRolse from "./AddRolse.vue"
import ChangeRolse from "@/view/admin/roles/ChangeRolse.vue";
// import {v} from "xe-utils/dist/xe-utils";

@Component({
  components:{
    AddRolse,
    ChangeRolse
  }
})

export default class index extends Vue{

  //中间分割线比例
  private split1:number = 0.3
  //右侧表格数据
  private tableData:SelectTypes[] = []

  //右侧表格数据
  private rightTableData:SelectTypes[] = []
  //分页数据
  private page:any = {
        size:20,
        num: 1,
        total:0
      }
//点击获取的员工
   private oneStaff:any = {}
   //右侧权限树形图
  private treeList:any = []
  //权限变量
  private role:any =  {
    id: null,
    name: null,
    displayName: null,
    resIds: [],
    tenantId:''
  }

  //员工搜索机构
  private organization:string = ''

  private  staffName:string = ''

  //按钮权限
  private right:number = 1

  //树形
  // private tree:any = []
  //-------------------mounted-----------------------------------------------

  private mounted() {
    this.getLeftList()
    this.right = this.$store.state.user.userData.shopkeeper
  }
  //-------------------------------methods-----------------------------------------
    //获取左侧全部员工
   private async getLeftList(){
      let data:any ={}
      data.size = this.page.size
      data.page = this.page.num -1
      data.systemType = 0
      let res:any = await queryRolesByPage(data)
      if(res.code == 0){
        this.tableData = res.data.content
        this.page.total = res.data.totalElements
        this.oneStaff = {}
      }
    }

    //点击左侧表格获取当前数据
  private async setOneTable(val){
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
  private async getAllStaff(){
    let data:any = {}
    data.userName = this.staffName
    data.shopName = this.organization
    data.roleId = this.oneStaff.id
    let res = await getStaff(data)
    if(res.code === 0) {
      this.rightTableData = res.data.content
    }
  }
    //方法
  private ch(arr) {
    arr.map(item => {
      item.expand = true
      if(this.right != 0){
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

  private  //切换当前页
    selectNum(val){
      this.page.num = val
      this.getLeftList()
    }
    //切换当前条数
  private selectPage(val){
      this.page.num = 1
      this.page.size = val
      this.getLeftList()
    }
    //新增员工模态框
  private openAdd(){
     let modal:any =  this.$refs.add
         modal.openModal(0)
    }
    //确定新增员工
  private addList(){
      this.page.num = 1
      this.getLeftList()
    }
    //修改员工
  private  changeStaff(){
      if(!this.oneStaff.id){
        this.$message.error('请先选择需要修改的角色')
        return
      }
    let modal:any =  this.$refs.change
    modal.openModal(0)
    }

  //确定修改员工
  private changeList(){
    this.page.num = 1
    this.getLeftList()
  }

  //删除员工
  private delectStaff(){
    if(!this.oneStaff.id){
      this.$message.error('请先选择角色')
      return
    }
      this.$Modal.confirm({
        title: '是否删除',
        content: '<p>是否要删除当前角色</p>',
        onOk: async () => {
          let data:any ={}
              data.id = this.oneStaff.id
          let res = await deleteById(data)
          if(res.code === 0){
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
    let stop:any = this.$loading()
    let res:any = await findRootRes()
       if(res.code === 0){
         stop()
         let tmp = res.data
         this.ch(tmp)
         this.treeList = tmp
       }else{stop()}

  }

  //树形图复选框
  private checkChange(){
    let checkedIds = []
    let tree:any = this.$refs.resTree,
        nodes:any = tree.flatState,
    // @ts-ignore
        arrList:Array = [],
        showArr:any =[]
         nodes.map( item => {
          if (item.node.checked || item.node.indeterminate)
          // @ts-ignore
            arrList.push(item.node)
        })
    arrList = arrList.filter(item =>
       item.name.length == 4 //用来判定是否是页面
    )

    arrList.map( item => {
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
      if ( !item.hasOwnProperty('checked') || !item.checked){
        checkedIds = checkedIds.filter( v => v != item.parentId)
      }
    })

    this.role.resIds = checkedIds

  }

  //保存修改好的数据
  private save(){
    // @ts-ignore
    let stop:any = this.$loading()
    // this.role.id = ''
    saveOrder(this.role, this.role.resIds).then(res => {
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
  private selectTree(val){
    // console.log(val ,888)
  }

  //员工点击查询
 private search() {
   if(!this.oneStaff.id){
     this.$message.error('请先选择角色')
     return
   }
    this.getAllStaff()
 }

 //员工权限保存
  private async saveStaff(){
    let data:any = []
        data.id = this.rightTableData[0].id
        data.roleIds = []
        this.rightTableData.forEach( item => {
          if(item.allocation ==0){
            data.push({id: item.id , roleIds:this.oneStaff.id , allocation:0})
          }else {
            data.push({id: item.id , roleIds:[] , allocation:1})
          }
        })
    let res = await saveStaffJurisdiction(data)
    if(res.code === 0){
      this.$message.success('保存成功')
      this.getAllStaff()
    }
  }
  }


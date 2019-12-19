import { Vue, Component } from "vue-property-decorator";
// @ts-ignore
import {queryRolesByPage , deleteById , addOrUpdate} from '_api/admin/roleApi.js';
// @ts-ignore
import {findRootRes} from '_api/admin/resourceApi'
import AddRolse from "./AddRolse.vue"
import ChangeRolse from "@/view/admin/roles/ChangeRolse.vue";

@Component({
  components:{
    AddRolse,
    ChangeRolse
  }
})

export default class index extends Vue{

  //中间分割线比例
  private split1:number = 0.3
  //右侧分割线比例
  private tableData:SelectTypes[] = []
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
  //不知道的值
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
  //-------------------mounted-----------------------------------------------

  private mounted() {
    this.getLeftList()
  }
  //-------------------------------methods-----------------------------------------
    //获取左侧全部员工
   private async getLeftList(){
      let data:any ={}
      data.size = this.page.size
      data.page = this.page.num -1
      let res:any = await queryRolesByPage(data)
      if(res.code == 0){
        this.tableData = res.data.content
        this.page.total = res.data.totalElements
        this.oneStaff = {}
      }
    }

    //点击左侧表格获取当前数据
  private setOneTable(val){
      this.oneStaff = JSON.parse(JSON.stringify(val.row))
    this.findRootRes((res, group) => {
      this.role.id = val.row.id
      this.role.name = val.row.name
      this.role.displayName = val.row.displayName
      this.role.resIds = val.row.resourceVOSet.map(item => item.id)
      let tmp = [res.data]
      this.ch(tmp)
      this.treeList = tmp
    })
      console.log(val.row)
    }

    //方法
  private ch(arr) {
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
         modal.openModal()
    }
    //确定新增员工
  private addList(){
      this.page.num = 1
      this.getLeftList()
    }
    //修改员工
  private  changeStaff(){
      if(!this.oneStaff.id){
        this.$message.error('请先选择员工')
        return
      }
    let modal:any =  this.$refs.change
    modal.openModal()
    }

  //确定修改员工
  private changeList(){
    this.page.num = 1
    this.getLeftList()
  }

  //删除员工
  private delectStaff(){
    if(!this.oneStaff.id){
      this.$message.error('请先选择员工')
      return
    }
      this.$Modal.confirm({
        title: '是否删除',
        content: '<p>是否要删除当前员工</p>',
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
  private findRootRes(callback) {
    // @ts-ignore
    let stop:any = this.$loading()
    findRootRes().then(res => {
      stop()
      callback && callback(res)
    }).catch(err => {
      stop()
    })
  }

  //树形图复选框
  private checkChange(){
    let checkedIds = []
    let tree:any = this.$refs.resTree,
        nodes:any = tree.flatState
    nodes.map(item => {
      if (item.node.checked || item.node.indeterminate)
      // @ts-ignore
        checkedIds.push(item.node.id)
    })
    this.role.resIds = checkedIds
  }

  //保存修改好的数据
  private save(){
    // @ts-ignore
    let stop:any = this.$loading()
    addOrUpdate(this.role, this.role.resIds).then(res => {
      stop()
      if (res.code == 0) {
          this.getLeftList()
          this.$Message.success('修改成功')
      }
    }).catch(err => {
      this.$Message.success('修改失败')
      stop()
    })
  }

  //点击属性数据获取值
  private selectTree(val){
    // console.log(val ,888)
  }

  //员工点击查询
 private search(){
    let data:any = {}
        data = this.staffName
        data = this.organization
  }
  }


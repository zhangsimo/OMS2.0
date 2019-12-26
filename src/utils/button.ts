import windows from '../main'

export function rightButtonShow() {
  let VOSList :any = windows.globalVue.$store.state.user.userData.resourceVOS,
    VOSID:any = VOSList.filter(item => item.displayName == windows.globalVue.$route.meta.title)
  let buttons:any = VOSList.filter( item => item.parentId == VOSID[0].id)
  let obj :any = {}
      if(buttons.length > 0){
         buttons.forEach( item => {
           obj[item.name.split('_')[1]] = true
         })
      }
  return obj
}

import windows from '../main'

export function rightButtonShow() {
  let VOSList :any = windows.globalVue.$store.state.user.userData.resourceVOS,
    VOSID:any = VOSList.filter(item => item.displayName == windows.globalVue.$route.meta.title)
  let buttons:any =[]
  if(!VOSID) return
  buttons = VOSList.filter( item => item.parentId == VOSID[0].id)
  let arr :any = []
      if(buttons.length > 0){
         buttons.forEach( item => {
           arr.push(item.name.split('_')[1])
         })
      }
      if (arr.length > 0){
        sessionStorage.setItem('btnContext' , JSON.stringify(arr))
      }
  // return arr
}


export function authButton(Vue) {
      Vue.directive('has' ,{
        inserted:function (el , binding) {
          let auth:any = []
        if (sessionStorage.getItem('btnContext') != null){
            auth =  sessionStorage.getItem('btnContext') || []
        }else {
          return
        }
          auth = JSON.parse(auth)
        let show :any = false
            auth.forEach( item => {
            if ( item == binding.value ){
              show = true
            }
          })
          if (!show){
            el.parentNode.removeChild(el)
          }
  }
      })
}

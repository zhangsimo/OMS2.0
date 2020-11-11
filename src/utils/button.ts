import windows from '../main'

export function rightButtonShow() {
  let VOSList: any = windows.globalVue.$store.state.user.userData.resourceVOS,
    VOSID: any = VOSList.filter(item => item.displayName == windows.globalVue.$route.meta.title)
  let buttons: any = []
  if (VOSID.length == 0) {
    sessionStorage.removeItem('btnContext')
    return
  }
  let title=["业务参数","结算账户"]
  if(sessionStorage.getItem("route")=="navigationFater" && !title.includes(windows.globalVue.$route.meta.title)){
    buttons = VOSList.filter(item => item.parentId == VOSID[1].id)
  }else{
    buttons = VOSList.filter(item => item.parentId == VOSID[0].id)
  }
  let arr: any = []
  if (buttons.length > 0) {
    buttons.forEach(item => {
      arr.push(item.name.split('_')[1])
    })
  }

  if (arr.length > 0) {
    sessionStorage.setItem('btnContext', JSON.stringify(arr))
  }
  // return arr
}


export function authButton(Vue) {
  Vue.directive('has', {
    inserted: function (el, binding) {
      let auth: any = []
      if (sessionStorage.getItem('btnContext') != null) {
        auth = sessionStorage.getItem('btnContext') || []
      } else {
        return
      }
      if(JSON.stringify(binding.arg)!=undefined){
        binding.value=binding.arg
      }
      auth = JSON.parse(auth)
      let show: any = false
      auth.forEach(item => {
        if (item == binding.value) {
          show = true
        }
      });
      if (!show) {
        el.parentNode.removeChild(el)
      }
    }
  })
}
export function authButton2(Vue) {
  Vue.directive('hass', {
    inserted: function (el, binding) {
      let auth: any = []
      if (sessionStorage.getItem('btnContext') != null) {
        auth = sessionStorage.getItem('btnContext') || []
      } else {
        return
      }
      if(JSON.stringify(binding.arg)!=undefined){
        binding.value=binding.arg
      }
      auth = JSON.parse(auth)
      let show: any = false
      auth.forEach(item => {
        if (item == binding.value) {
          show = true
        }
      });
      if (!show) {
        el.parentNode.removeChild(el)
      }
    }
  })
}
//防止按钮重复点击1000ms内，也可以自设时间
export function resubmitNotButton(Vue) {
  Vue.directive("noresub", {
    inserted(el, binding) {
      const pointDoms: any = []; // 使用这个指令的所有DOM对象
      pointDoms.push(el); // 存储使用这个指令的DOM
      el.addEventListener('click', () => {
        // 禁用所有使用这个指令的DOM结构点击事件
        pointDoms.forEach(pointItem => {
          pointItem.style.pointerEvents = 'none';
        });
        setTimeout(() => {
          // 启动所有使用这个指令的DOM结构点击事件
          pointDoms.forEach(pointItem => {
            pointItem.style.pointerEvents = 'auto';
          });
        }, binding.value || 1000);
      });
      el.unbindEventListener=()=>{
        el.removeEventListener('click')
        el.clearTimeout(0)
      }
    },
    unbind(el){
      //阻止内存泄漏
      if(el.unbindEventListener){
        el.unbindEventListener()
      }
    }
  })
}

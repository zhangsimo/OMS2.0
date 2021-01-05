import {login, logout, getUserInfo, changePwd} from '@/api/base/user'
import {setToken, getToken, setTagNavListInLocalstorage} from '@/libs/util'

// 首字母大写
function titleCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
let loginIsOpen = false
export default {
  state: {
    username: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    userData: '', //账号信息
    userShopName:'',//分店名称
    treePid:'',
    storeId:'',
    supplierId:'',
    managementId:'',
    changePassword: false,//判断是否需要开启强制修改密码弹窗
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUsername(state, name) {
      state.username = name
    },
    setUserData(state, userData) {
      state.userData = userData
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setTreePid(state, data) {
      state.treePid = data
    },
    setStoreId(state, data) {
      state.storeId = data
    },
    setsupplierId(state ,data) {
      state.supplierId = data
    },
    setManagementId(state , data) {
      state.managementId = data
    },
    setUserShopName(state ,data){
      state.userShopName = data
    },
    setChangePassword(state , data){
      state.changePassword = data
    }

  },
  actions: {
    // 登录
    handleLogin({commit}, {username, password}) {
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          if (res.code == 0) {
            const data = res.data
            // let type = titleCase(data.token_type)
            // commit('setToken', type + " " + data.access_token)
            commit('setToken', data.access_token)
            commit('setUsername', username)
            resolve()
          } else {
            reject(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({state, commit}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          sessionStorage.clear()
          localStorage.clear()
          setTagNavListInLocalstorage([])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({state, commit}) {
      return new Promise((resolve, reject) => {

        let username = localStorage.getItem('username')
        if (!username) {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
          return
        }
        // console.log(loginIsOpen , 788898798)
        // if(loginIsOpen) {
        //   resolve()
        //   return;
        // }

        getUserInfo(username).then(res => {
          const data = res.data
            let access = data.resourceVOS && data.resourceVOS.map(item => item.name)
            commit('setAccess', access)
            commit('setUserId', data.id)
            commit('setUserData', data)
            commit('setUserShopName', data.currentShopName)
          loginIsOpen = true
          // localStorage.tenantId = data.tenantId
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    changePwd({state, commit}, {oldPwd, newPwd}) {
      return new Promise((resolve, reject) => {
        let id = state.userId
        let params = {
          id,
          oldPwd,
          newPwd
        }
        changePwd(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },


}

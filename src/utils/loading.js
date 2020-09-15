import {Loading} from 'element-ui'

let loadingCount = 0
let loading

// 开始loading并且初始化选项
const startLoading = (select,title) => {
  loading = Loading.service({
    lock: true,
    text: title,
    background: 'rgba(255, 255, 255, .7)',
    target: document.querySelector(select)
  })
}

// 关闭loading
const endLoading = () => {
  loading.close()
}

export const showLoading = (select, title="拼命加载中...") => {
  if (loadingCount === 0){
    startLoading(select,title)
  }
  loadingCount += 1
}

export const hideLoading = () => {
  if (loadingCount <= 0){
    return
  }
  loadingCount -= 1
  if (loadingCount === 0){
    endLoading()
  }
}

export default {showLoading, hideLoading}

import store from '@/store/index.js'
import {getSales} from  '_api/salesManagment/salesOrder.js'
import { findGuest } from "_api/settlementManagement/advanceCollection.js";
import {getPayAccount} from "_api/documentApproval/ExpenseReimbursement.js"

//返回当前账号下银行账号名称数组
export async function getPayList() {
      let usedata = store.state.user.userData
      let data = {
        shopNumber: usedata.shopId,
      }
      let res = await getPayAccount(data)
      if (res.code === 0 ){
          res.data.content.map( item => {
            item.value = item.id
            item.label = item.accountName
          })
        return  res.data.content
      }
}

//往来单位
export async function getAllSalesList() {
          let arr = [] //获取收款人列表
         let Salse = await getSales()
            if (Salse.code == 0) {
              Salse.data.content.map(item => {
                item.value = item.id
                item.label = item.userName
                arr.push({
                  value: item.id,
                  label: item.userName,
                  receiver: item.accountPayee || '',
                  receiveBank: item.bankName || '',
                  receiveBankNo: item.bankNumber || ''
                });
              })
            }

        let guset = await findGuest({ size: 2000 })
          if(guset.code == 0) {
            guset.data.content.map(item => {
              arr.push(
                {
                  value: item.id,
                  label: item.fullName,
                  receiver: item.accountReceiveName || '',
                  receiveBank: item.accountBank || '',
                  receiveBankNo: item.accountBankNo || ''
                }
              )
            })
          }
  return arr

}


export async function getComenAndGo() {
        let arr = []
        let res = await findGuest({ size: 2000 })
        if (res.code == 0) {
          res.data.content.map(item => {
            arr.push({
              value: item.id,
              label: item.fullName,
              receiver: item.accountReceiveName || '',
              receiveBank: item.accountBank || '',
              receiveBankNo: item.accountBankNo || ''
            });
      })
    }
     return  arr
}

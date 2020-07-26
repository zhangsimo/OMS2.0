import { getStorelist } from '@/api/bill/saleOrder';
export  async function  creat(dates, store) {
  let value = [];
  let Branchstore = [];
  let model = '';
  value = dates
    let res = await getStorelist({ groupId: store.state.user.userData.groupId });
    if(Object.keys(res.data).length !== 0){
      model = store.state.user.userData.currentCompany ? store.state.user.userData.currentCompany.id ? store.state.user.userData.currentCompany.id : '' : ''
      Object.keys(res.data).forEach(function (key) {
        if(model ===key) name = res.data[key]
        Branchstore.push({
          value: key,
          label: res.data[key]
        })
      });
      return [value, model, Branchstore,name]
  }
}

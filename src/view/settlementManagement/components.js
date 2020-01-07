import { getStorelist } from '@/api/bill/saleOrder';
export function creat(dates, store) {
  let value = [];
  let Branchstore = [];
  let model = '';
  value = dates
  async function get() {
    let res = await getStorelist({ groupId: store.state.user.userData.groupId });
    if(Object.keys(res.data).length !== 0){
      Object.keys(res.data).forEach(function (key) {
        Branchstore.push({
          value: key,
          label: res.data[key]
        })
      });
      
      model = Branchstore[0].value
    }
    return [value, model, Branchstore]
  }
  return get()
}
import { getStorelist } from '@/api/bill/saleOrder';
export function creat(dates, store) {
  let value = [];
  let Branchstore = [];
  let model = '';
  value = dates
  async function get() {
    let res = await getStorelist({ groupId: store.state.user.userData.groupId });
    // console.log(res)
    Object.keys(res.data).forEach(function (key) {
      Branchstore.push({
        value: key,
        label: res.data[key]
      })
    });
    console.log(Branchstore)
    model = Branchstore[0].value
    return [value, model, Branchstore]
  }
  return get()
}
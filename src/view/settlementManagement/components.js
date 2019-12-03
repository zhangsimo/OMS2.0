import { getStorelist } from '@/api/bill/saleOrder';
export function creat(dates,store) {
  let value = [];
  let Branchstore = [];
  let model = '';
  value.push(dates.shift(), dates.pop())
  async function get () {
    let res = await getStorelist({ groupId: store.state.user.userData.groupId });
    // console.log( res.data.childs)
    for (let i of res.data.childs) {
      Branchstore.push({
        value: i.id,
        label: i.name
      })
    }
    model = Branchstore[0].value
    return [value, model, Branchstore]
  }
  return get()
}
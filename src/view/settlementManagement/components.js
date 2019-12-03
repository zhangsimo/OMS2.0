import { getStorelist } from '@/api/bill/saleOrder';
export function creat(dates,store) {
  let value = [];
  let Branchstore = [];
  let model = '';
  // let currentTime = new Date();
  // let currentDate = new Date(currentTime)
  // let timesStamp = currentDate.getTime();
  // let currenDay = currentDate.getDay();
  // let dates = [];
  // for (let i = 0; i < 7; i++) {
  //   dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'));
  // }
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
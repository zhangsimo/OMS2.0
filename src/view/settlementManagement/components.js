import { getStorelist } from '@/api/bill/saleOrder';
export function creat(dates,store) {
  let value = [];
  let Branchstore = [];
  let model = '';
  value=dates
  async function get () {
    let res = await getStorelist({ groupId: store.state.user.userData.groupId });
    // console.log( res.data.childs)
    for (let i of res.data.childs) {
      if(i.name === '测试公司101') {
        if(i.childs.length!==0) {
          for(let j of i.childs) {
            Branchstore.push({
              value: j.id,
              label: j.name
            })
          }
        }
      }
    }
    model = Branchstore[0].value
    return [value, model, Branchstore]
  }
  return get()
}
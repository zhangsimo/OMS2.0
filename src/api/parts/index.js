import axios from "@/libs/api.request";
import api from "_conf/url";

const resetData = treeData => {
  treeData.forEach(item => {
    item.title = item.name;
    item.selected = false;
    item.disabled = false;
    if (item.secendType && item.secendType.length > 0) {
      item.children = resetData(item.secendType);
    }
  });
  return treeData;
}

// 查询客服信息
export async function getCarPartClass() {
    let res = await axios.request({
      url: `http://192.168.30.221:9200/partType/getCarClassifys`,
      method: "post",
    });

    let data =  resetData((res.data || []));

    return data;
}
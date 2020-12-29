import api from '_conf/url'
import axios from '@/libs/api.request'
import { TOKEN_KEY } from "@/libs/util";
import Cookies from "js-cookie";

//下载模板
export function down(id) {
    // let url = `${api.downApi}/file/get?fileId=` + id;
    location.href = `${api.downApi}/file/get?fileId= ${id}&access_token=${Cookies.get(TOKEN_KEY)}`
    // window.open(url, '_blank');
  }
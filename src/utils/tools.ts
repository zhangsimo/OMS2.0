import { Message } from 'view-design'

function lt9(v: number) {
  return v > 9 ? v : "0" + v;
}

/**
 * 时间格式转换 -> 'y-m-d h:m:s'
 * @param long 日期时间字符串
 */
export function transTime(long: any): string {
  if (!long) return "";
  let date = new Date(long);
  let year = date.getFullYear();
  let month = lt9(date.getMonth() + 1);
  let day = lt9(date.getDate());
  let hour = lt9(date.getHours());
  let minutes = lt9(date.getMinutes());
  let second = lt9(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minutes}:${second}`;
}

/**
 * 时间格式转换 -> 'y-m-d h:m:s'
 * @param long 日期时间字符串
 */
export function transDate(long: any): string {
  if (!long) return "";
  let date = new Date(long);
  let year = date.getFullYear();
  let month = lt9(date.getMonth() + 1);
  let day = lt9(date.getDate());
  return `${year}-${month}-${day}`;
}

/**
 * 对象数组去重
 * @param arr 原数组
 * @param key 判断的键默认id
 */
export function arrRemoval(arr: Array<any>, key: string = "id"): Array<any> {
  let obj: Kv = {};
  let resarr: Array<any> = [];
  resarr = arr.reduce((item: Array<any>, next: Kv) => {
    obj[next[key]] ? "" : (obj[next[key]] = true && item.push(next));
    return item;
  }, []);
  return resarr;
}

/**
 *树形图渲染
 * @param {Array<Tree>} tree 树形菜单数据
 * @param {string} name title字段
 * @returns
 */
export function transTree(tree: Array<Tree>, name: string = "name") {
  if (Array.isArray(tree) && tree.length > 0) {
    tree.forEach(tel => {
      tel.title = tel[name];
      if (tel.disabled) {
        Reflect.deleteProperty(tel, 'disabled');
      }
      transTree(tel.children as Array<Tree>, name);
    });
  } else {
    return;
  }
}

/**
 * 展开收缩树形菜单
 * @param {Array<Tree>} treeData 树形菜单数据
 * @param {boolean} expand 是否展开
 */
export function treeExpand(treeData: Array<Tree>, expand: boolean): void {
  Array.isArray(treeData) &&
    treeData.forEach(element => {
      element.expand = expand;
      if (Array.isArray(element.children)) {
        treeExpand(element.children, expand);
      }
    });
}

/**
 * 树形图搜索
 * @param {Array<Tree>} tree - 树形数据
 * @param {string} content - 搜索的字段
 */
export function findTree(tree: Array<Tree>, content: string) {
  let reg = new RegExp(content, "gi");
  let remove: Array<number> = [];
  let filter = (tree: Tree, index: number, remove: Array<number>) => {
    if (Array.isArray(tree.children) && tree.children.length > 0) {
      let inarr: Array<number> = [];
      tree.children.forEach((el, i) => {
        filter(el, i, inarr);
      });
      if (!reg.test(tree.title)) {
        for (let j = inarr.length - 1; j >= 0; j--) {
          tree.children.splice(inarr[j], 1);
        }
        if (tree.children.length === 0) {
          remove.push(index);
        }
      }
    } else {
      if (!reg.test(tree.title)) {
        remove.push(index);
      }
    }
  };
  tree.forEach((el: Tree, index: number) => {
    filter(el, index, remove);
  });
  for (let j = remove.length - 1; j >= 0; j--) {
    tree.splice(remove[j], 1);
  }
}

/**
 * 表格行可编辑
 * @param {*} self this
 * @param {string} tbdata 表数据字段名
 * @param {string} filed 可编辑的字段名
 * @param {Function} validator 验证方法
 * @returns {Function} 回调方法
 */
export function editRow(
  self: Kv,
  tbdata: string,
  filed: string,
  validator: Function
) {
  return (h: any, params: Kv) => {
    let tb: Kv = {};
    if (tbdata.indexOf(".") !== -1) {
      tb = tbdata
        .split(".")
        .reduce((prev: Kv, next: string) => prev[next], self[tbdata]);
    } else {
      tb = self[tbdata];
    }
    return h(
      "p",
      {
        class: "edit",
        props: {
          value: params.row[filed]
        },
        attrs: {
          contenteditable: true
        },
        on: {
          blur: (event: any) => {
            params.row[filed] = event.target.innerText;
            tb[params.index] = params.row;
          }
        }
      },
      params.row[filed]
    );
  };
}

/**
 * 校验手机号
 * @param {any} rule any
 * @param {string} value 手机号
 * @param {Function} callback 回调函数
 */
export function checkPhone(rule: any, value: string, callback: Function) {
  if (!value) {
    callback(new Error("手机号不能为空"));
  } else {
    const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};

// 判断数量和单价是否为空
export function isZero(data: Array<any>, { qty, price }): boolean {
  let message: any = Message;
  let zero1: any, zero2: any;

  if (qty) {
    zero1 = data.find(el => el[qty] === undefined|| el[qty] * 1 <= 0); // || el[qty] * 1 <= 0
  }

  if (price) {
    zero2 = data.find(el => el[price] === undefined);// || el[price] === 0
  }

  if (zero1) {
    message.error("数量不能为空");
    return true;
  }

  if (zero2) {
    message.error("单价不可为空");
    return true;
  }

  return false;

}


// 判断数量和单价是否为空
export function isZero1(data: Array<any>, { qty, price }): boolean {
  let message: any = Message;
  let zero1: any, zero2: any;

  if (qty) {
    zero1 = data.find(el => el[qty] === undefined); // || el[qty] * 1 <= 0
  }

  if (price) {
    zero2 = data.find(el => el[price] === undefined);// || el[price] === 0
  }

  if (zero1) {
    message.error("数量不能为空");
    return true;
  }

  if (zero2) {
    message.error("单价不可为空");
    return true;
  }

  return false;

}


// import * as tools from "_utils/tools";

export function getSession(key: string): object {
  let str: string | null = sessionStorage.getItem(key);
  let obj: object = {};
  if (str !== null) {
    try {
      obj = JSON.parse(str);
    } catch (e) {
      obj = {};
    }
  }
  return obj;
}

export function setSession(key:string, value:object) {
  let str: string | null = sessionStorage.getItem(key);
  let obj: object = {};

  if(str !== null) {
    try {
      obj = JSON.parse(str);
    } catch (e) {
      obj = {};
    }
  }
  obj = {...obj, ...value};
  sessionStorage.setItem(key, JSON.stringify(obj));
}

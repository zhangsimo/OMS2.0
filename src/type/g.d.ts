interface Kv {
    [key: string]: any
}

/**
 * 下拉框
 */
interface SelectTypes {
    value: string,
    label: string,
    [params: string]: any
}

/**
 * 表格头部
 */
interface Tableth {
    title?: string,
    key?: string,
    type?: string,
    minWidth?: string | number,
    width?: string | number,
    align?: string,
    children?: Array<Tableth>,
    render?: Function,
    [params: string]: any,
}

/**
 * 树形结构
 */
interface Tree {
    title: string,
    expand?: boolean,
    children?: Array<Tree>,
    [params: string]: any,
}
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
interface Option {
    value: string|number,
    label: string|number,
    [param:string]:any,
}

/**
 * 表格校验
 */
interface ruleItem {
    required: boolean,
    message: string,
    trigger: string|Array<string>,
    validator?(rule:any, value:any, callback:Function): any
}

interface ruleValidate {
    [prop: string]: Array<ruleItem>
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
 * 分页
 */
interface Page {
    num: number,
    total: number,
    size: number
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
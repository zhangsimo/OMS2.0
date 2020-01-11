class initTable {
  loading: boolean;
  num: number;
  size: number;
  columns: Array<Tableth>;
  currentRow: any;
  init: Function;
  tbdata: any[];
  total: number;
  selectedArr: Set<any>;
  cancelArr: Set<any>;

  constructor() {
    this.loading = false;
    this.num = 1;
    this.size = 10;
    this.total = 0;
    this.columns = [];
    this.tbdata = [];
    this.init = () => {};
    // 选中的行
    this.currentRow = null;
    // 勾选的行
    this.selectedArr = new Set();
    // 取消勾选的行
    this.cancelArr = new Set();
  }

  /**
   * 翻页
   * @param p 页码
   */
  changePage(p:number) {
    this.num = p;
    this.init();
  }

  /**
   * 修改每页显示条数
   * @param size 每页条数
   */
  changeSize(size:number) {
    this.num = 1;
    this.size = size;
    this.init();
  }

  /**
   * 选中行
   * @param currentRow 点击的行
   */
  selectedRow(currentRow:any) {
    this.currentRow = currentRow;
  }

  /**
   * 多选-选择行
   * @param selection 选中的全部数据
   * @param row 当前选中
   */
  selectRow(selection:any[], row: any) {
    if (!row._orginChecked) {
      this.selectedArr.add(row.id);
    }
    this.cancelArr.delete(row.id);
  }

  /**
   * 多选-取消选择行
   * @param selection 选中的全部数据
   * @param row 当前选中
   */
  cancelSelectRow(selection:any[], row:any) {
    if (row._orginChecked) {
      this.selectedArr.delete(row.id);
      if (row._checked) {
        this.cancelArr.add(row.id);
      }
    }
  }

  /**
   * 多选-全选
   * @param selection 选中的全部数据
   */
  seleteAll(selection:any[]) {
    selection.forEach(el => {
      if (!el._checked && !el._orginChecked) {
        this.selectedArr.add(el.id);
      }
      this.cancelArr.delete(el.id);
    });
  }

  /**
   * 多选-取消全选
   * @param selection 选中的全部数据
   */
  cancelAll(selection:any[]) {
    this.tbdata.forEach(el => {
      this.selectedArr.delete(el.id);
      if (el._checked) {
        this.cancelArr.add(el.id);
      }
    });
  }
}

export default initTable;
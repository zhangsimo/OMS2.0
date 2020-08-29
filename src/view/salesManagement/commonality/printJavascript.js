//销售订单打印的 表格头部
export function tableHead(LODOP/**LODOP对象*/,tableHeadArr/** 表格头部数组(width宽度,height高度,name名称) */){
  LODOP.SET_PRINT_STYLE("FontSize",10);
  //(top1,left1,top2,left2,线条类型,线条宽度)
  //top1,left1 确定线的起点  top2,left2 确定线的终点
  LODOP.ADD_PRINT_LINE(88,26,88,708,0,1);//上线
  LODOP.ADD_PRINT_LINE(100,26,100,708,0,1);//下线
  LODOP.ADD_PRINT_LINE(88,26,100,26,0,1);//左线
  LODOP.ADD_PRINT_LINE(88,708,100,708,0,1);//右线

  let startTop=88;
  let startLeft=26;

  tableHeadArr.map((item,index)=>{
    startLeft+=parseInt(item.width)
    if(index!=tableHeadArr.length-1){
      LODOP.ADD_PRINT_HTM(startTop,startLeft-parseInt(item.width),parseInt(item.width),parseInt(item.height),`<div style="padding-left:2px;padding-top:2px;padding-bottom:2px;font-size:10px;">${item.name}</div>`);
      LODOP.ADD_PRINT_LINE(startTop,startLeft,startTop+parseInt(item.height),startLeft,0,1);  //右线
      // LODOP.ADD_PRINT_LINE(startTop+parseInt(item.height),startLeft-parseInt(item.width),startTop+parseInt(item.height),startLeft,0,1); //下线
    }else{
      LODOP.ADD_PRINT_HTM(startTop,startLeft-parseInt(item.width),parseInt(item.width),parseInt(item.height),`<div style="padding-left:2px;padding-top:2px;padding-bottom:2px;font-size:10px;">${item.name}</div>`);
      // LODOP.ADD_PRINT_LINE(startTop,startLeft,startTop+parseInt(item.height),startLeft,0,1);  //右线  最后一项不再需要 右线
      // LODOP.ADD_PRINT_LINE(startTop+parseInt(item.height),startLeft-parseInt(item.width),startTop+parseInt(item.height),startLeft,0,1); //下线
    }
  })
}
//销售订单打印的 表格内容
export function tableContent(LODOP/**LODOP对象*/,i/**表格内容的每一条数据*/,o/**表格内容的每一条数据的下标*/,j,tableHeadArr/** 表格头部数组(width宽度,height高度,name名称) */){
  var h=14;
  var startLeft=26
  LODOP.ADD_PRINT_LINE(100+(o+1)*h,26,100+(o+1)*h,708,0,1);// 每一项的下线
  LODOP.ADD_PRINT_LINE(100+o*h,26,100+(o+1)*h,26,0,1);//每一项的左线
  LODOP.ADD_PRINT_LINE(100+o*h,708,100+(o+1)*h,708,0,1);//每一项的下线右线
  tableHeadArr.map((item,index)=>{
    if(index!=tableHeadArr.length-1 && item.name=="序号"){
      LODOP.ADD_PRINT_HTM(100+o*parseInt(item.height),startLeft,parseInt(item.width),10,`<div style="padding-left:2px;padding-top:2px;padding-bottom:2px;font-size:10px;white-space:nowrap;overflow: hidden;">${j+1}</div>`);  //序号
      LODOP.ADD_PRINT_LINE(100+o*parseInt(item.height),startLeft,100+(o+1)*(parseInt(item.height)),startLeft,0,1); //每一项的右线
    }
    for(let key in i){
      if(index!=tableHeadArr.length && key==item.key){
        LODOP.ADD_PRINT_HTM(100+o*parseInt(item.height),startLeft,parseInt(item.width),10,`<div style="padding-left:2px;padding-top:2px;padding-bottom:2px;font-size:10px;white-space:nowrap;overflow: hidden;">${i[key]}</div>`);
        LODOP.ADD_PRINT_LINE(100+o*parseInt(item.height),startLeft,100+(o+1)*(parseInt(item.height)),startLeft,0,1); //每一项的右线
      }else if(index==tableHeadArr.length && key===item.key){
        LODOP.ADD_PRINT_HTM(100+o*parseInt(item.height),startLeft,parseInt(item.width),10,`<div style="padding-left:2px;padding-top:2px;padding-bottom:2px;font-size:10px;white-space:nowrap;overflow: hidden;">${i[key]}</div>`);
      }
    }
    startLeft+=parseInt(item.width)
  })
}

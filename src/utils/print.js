var CreatedOKLodop7766 = null;

//====判断是否需要安装CLodop云打印服务器:====
export function needCLodop() {
  try {
    var ua = navigator.userAgent;
    if (ua.match(/Windows\sPhone/i) != null) return true;
    if (ua.match(/iPhone|iPod/i) != null) return true;
    if (ua.match(/Android/i) != null) return true;
    if (ua.match(/Edge\D?\d+/i) != null) return true;

    var verTrident = ua.match(/Trident\D?\d+/i);
    var verIE = ua.match(/MSIE\D?\d+/i);
    var verOPR = ua.match(/OPR\D?\d+/i);
    var verFF = ua.match(/Firefox\D?\d+/i);
    var x64 = ua.match(/x64/i);
    if ((verTrident == null) && (verIE == null) && (x64 !== null))
      return true; else if (verFF !== null) {
      verFF = verFF[0].match(/\d+/);
      if ((verFF[0] >= 42) || (x64 !== null)) return true;
    } else if (verOPR !== null) {
      verOPR = verOPR[0].match(/\d+/);
      if (verOPR[0] >= 32) return true;
    } else if ((verTrident == null) && (verIE == null)) {
      var verChrome = ua.match(/Chrome\D?\d+/i);
      if (verChrome !== null) {
        verChrome = verChrome[0].match(/\d+/);
        if (verChrome[0] >= 42) return true;
      }
      ;
    }
    ;
    return false;
  } catch (err) {
    return true;
  }
  ;
};

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
  var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  var oscript = document.createElement("script");
  oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
  head.insertBefore(oscript, head.firstChild);

  //引用双端口(8000和18000）避免其中某个被占用：
  oscript = document.createElement("script");
  oscript.src = "http://localhost:18000/CLodopfuncs.js?priority=0";
  head.insertBefore(oscript, head.firstChild);
}
;

//====获取LODOP对象的主过程：====
export function getLodop(oOBJECT, oEMBED) {
  var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
  var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
  var strCLodopInstall = "<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='http://www.lodop.net/download.html' target=\"_blank\">执行安装</a>,安装后请刷新页面。</font>";
  var strCLodopUpdate = "<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
  http://www.lodop.net/download.html
    var LODOP;
  try {
    var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
    if (needCLodop()) {
      try {
        LODOP = getCLodop();
      } catch (err) {
      }
      ;
      if (!LODOP && document.readyState !== "complete") {
        alert("C-Lodop没准备好，请稍后再试！");
        return;
      }
      ;
      if (!LODOP) {
        // if (isIE) document.write(strCLodopInstall); else
        // document.documentElement.innerHTML=strCLodopInstall+document.documentElement.innerHTML;
        // return;
      } else {

        if (CLODOP.CVERSION < "3.0.0.2") {
          if (isIE) document.write(strCLodopUpdate); else
            document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML;
        }
        ;
        if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
        if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
      }
      ;
    } else {
      var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
      //=====如果页面有Lodop就直接使用，没有则新建:==========
      if (oOBJECT != undefined || oEMBED != undefined) {
        if (isIE) LODOP = oOBJECT; else LODOP = oEMBED;
      } else if (CreatedOKLodop7766 == null) {
        LODOP = document.createElement("object");
        LODOP.setAttribute("width", 0);
        LODOP.setAttribute("height", 0);
        LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
        if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
        else LODOP.setAttribute("type", "application/x-print-lodop");
        document.documentElement.appendChild(LODOP);
        CreatedOKLodop7766 = LODOP;
      } else LODOP = CreatedOKLodop7766;
      //=====Lodop插件未安装时提示下载地址:==========
      if ((LODOP == null) || (typeof (LODOP.VERSION) == "undefined")) {
        if (navigator.userAgent.indexOf('Chrome') >= 0)
          document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
        if (navigator.userAgent.indexOf('Firefox') >= 0)
          document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
        if (is64IE) document.write(strHtm64_Install); else if (isIE) document.write(strHtmInstall); else
          document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
        return LODOP;
      }
      ;
    }
    ;
    if (LODOP.VERSION < "6.0") {
      if (!needCLodop()) {
        if (is64IE) document.write(strHtm64_Update); else if (isIE) document.write(strHtmUpdate); else
          document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
      }
      ;
      return LODOP;
    }
    ;
    //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
    //LODOP.SET_LICENSES("北京XXXXX公司","8xxxxxxxxxxxxx5","","");

    //===========================================================
    return LODOP;
  } catch (err) {
    // if(err=="Cannot read property 'VERSION' of undefined"){
    //=====Lodop插件未安装时提示下载地址:==========
    if ((LODOP == null) || (typeof (LODOP.VERSION) == "undefined")) {
      if (navigator.userAgent.indexOf('Chrome') >= 0) {
        document.documentElement.innerHTML = strCLodopInstall + document.documentElement.innerHTML;
        return LODOP;
      }
      if (navigator.userAgent.indexOf('Firefox') >= 0) {
        document.documentElement.innerHTML = strCLodopInstall + document.documentElement.innerHTML;
        return LODOP;
      }
      if (is64IE) {
        document.write(strHtm64_Install)
        return LODOP;
      } else if (isIE) {
        document.write(strHtmInstall);
        return LODOP;
      } else {
        document.documentElement.innerHTML = strCLodopInstall + document.documentElement.innerHTML;
        return LODOP;
      }
    }
    // }
    // alert("getLodop出错:" + err);
  }
  ;
};
// LODOP.ADD_PRINT_TEXT(0,0,700,"100%",HTML)
// LODOP.ADD_PRINT_HTM(0, 0, 700, "100%", htmPrint);
// LODOP.SET_SHOW_MODE("SETUP_IN_BROWSE", true); //打印维护界面是否内嵌到网页内部。
// LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", true); //打印设计界面是否内嵌到网页内部。
// LODOP.PRINT_DESIGN();//对整页的打印布局和打印风格进行界面设计，它与打印维护的区别是具有打印项增删功能，目标使用者是软件开发者。

//====本项目 封装 print方法: ====
/**
 * 1.获取LODOP对象
 * 2.得到样式
 * 3.初始化LODOP对象
 * 4.双重循环
 * 外层循环打印页数(页头，表头打印)；内层循环表格数据
 * 5.需要手动来个表头和表格内容
 * 6.最后一页加上 页尾内容
 * */
export function print(arguMent) {
  let argument = {
    style: arguMent.style/**样式*/,
    tablePrint: arguMent.tablePrint/**表格打印部分的html内容*/,
    pageHead: arguMent.pageHead/**页头内容*/,
    data: arguMent.data/**表格数据*/,
    tableHeadArr: arguMent.tableHeadArr/**表格头部数组*/,
    pageFooter: arguMent.pageFooter/**打印页面带出页尾*/
  }
  let styPrint = `<style>${arguMent.style}</style>`
  let htmPrint = styPrint + `<body>${arguMent.tablePrint.innerHTML}</body>`
  var LODOP = getLodop();//调用getLodop获取LODOP对象
  LODOP.PRINT_INIT(printBox); //初始化 LODOP对象
  // pageHead?LODOP.ADD_PRINT_HTM(26,"5%","90%","100%",pageHead.innerHTML):"" //LODOP对象 添加打印内容  打印页头
  LODOP.SET_PRINT_STYLE("FontSize", 12);  //字体大小 12px
  LODOP.SET_PRINT_STYLE("Bold", 0);

  LODOP.SET_SHOW_MODE("PREVIEW_IN_BROWSE", true); //打印预览界面是否内嵌到网页内部
  LODOP.SET_SHOW_MODE("FULL_WIDTH_FOR_OVERFLOW", 0); //设置宽度方向上的内容溢出自动缩小
  LODOP.SET_SHOW_MODE("FULL_HEIGHT_FOR_OVERFLOW", 0); //设置高度方向上的内容溢出自动缩小


  // LODOP.ADD_PRINT_HTM(26,"5%","90%","100%", pageHead.innerHTML)
  // LODOP.ADD_PRINT_HTM(26,"5%","90%","100%", htmPrint)

  let tabArguMent = {
    LODOP: LODOP,
    pageHead: pageHead,
    data: argument.data,
    pageH: 290,
    tableHeadArr: arguMent.tableHeadArr,
    pageFooter: arguMent.pageFooter
  }
  tabPageHead(tabArguMent)
  LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);//打印后自动关闭预览窗口
  LODOP.SET_PRINT_STYLEA(0, "Vorient", 0);
  LODOP.ADD_PRINT_TEXT(580, 660, 165, 22, "第#页/共&页");
  LODOP.SET_PRINT_STYLEA(0, "ItemType", 2);
  LODOP.SET_PRINT_STYLEA(0, "Horient", 1);
  LODOP.SET_PRINT_STYLEA(0, "Vorient", 1);
  LODOP.PREVIEW();
  // LODOP.PRINT();
  // 简单的获取打印次数可以用这个方法。
  // LODOP.On_Return=function(TaskID,Value){alert(Value);}
}

//===打印分页带出页头 ===打印最后一页带出页尾
export function tabPageHead(arguMent) {
  let argument = {
    Lodop: arguMent.LODOP,
    pageHead: arguMent.pageHead/**页头*/,
    data: arguMent.data/**表格的数据*/,
    pageH: arguMent.pageH/**打印的纸张高度*/,
    tableHeadArr: arguMent.tableHeadArr/**表格头部数组*/,
    pageFooter: arguMent.pageFooter/**页尾*/
  }
  var totalRows = argument.data.length;//总条数
  var pageHeight = argument.pageH;     //打印的纸张高度
  var hasPreviousPage = false;　//是否有下一页　
  var totalPages = 1;        //总页数
  var pageRecorders = parseInt((pageHeight - 70) / 13);      //每页条数
  if ((totalRows % pageRecorders) == 0) {
    totalPages = parseInt(totalRows / pageRecorders);
  } else {
    totalPages = parseInt(totalRows / pageRecorders) + 1;
  }
  if (totalPages == 1) {
    hasPreviousPage = false;
  } else {
    hasPreviousPage = true;
  }
  for (var i = 0; i < totalPages; i++) {//总页数
    var tvalue = 0;
    //列头--------------------------------------------
    argument.Lodop.ADD_PRINT_HTM(0, 26, "90%", "100%", argument.pageHead.innerHTML)
    tableHead(argument.Lodop, argument.tableHeadArr)
    for (var j = i * pageRecorders; j < (i + 1) * pageRecorders; j++) {
      if (j >= totalRows) {
        argument.Lodop.ADD_PRINT_HTM(100 + tvalue * 14, 26, "90%", "100%", argument.pageFooter.innerHTML)
        break;
      }
      tableContent ? tableContent(argument.Lodop, argument.data[j], tvalue, j, argument.tableHeadArr) : ""
      tvalue++;
    }
    argument.Lodop.NewPage();
  }
}

/** 表格头部 */

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
/**表格内容*/
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




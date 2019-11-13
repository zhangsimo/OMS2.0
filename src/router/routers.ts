import Main from "@/view/base/main";
import parentView from "@/components/parent-view";

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true
    },
    component: () => import("@/view/base/login/login.vue")
  },
  {
    path: "/",
    redirect: "/home",
    component: Main,
    meta: {
      notCache: true,
      title: "首页"
    },
    children: [
      {
        path: "home",
        name: "home",
        meta: {
          notCache: true,
          icon: "md-home",
          title: "首页"
        },
        component: () => import("@/view/base/home/home.vue")
      }
    ]
  },
  {
    path: "",
    name: "goods",
    // mark: '1',
    redirect: "/multilevel/level_2_1",
    meta: {
      icon: "md-cloud-done",
      title: "采购管理"
    },
    component: Main,
    children: [
      {
        path: "/goods/goodsList",
        name: "goodsList",
        // mark: '11',
        meta: {
          icon: "arrow-graph-up-right",
          title: "计划采购"
        },
        component: () => import("@/view/goods/goodsList/goodsList.vue")
      },
      {
        path: "/goods/categoryList",
        name: "categoryList",
        mark: "10",
        meta: {
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "采购订单"
        },
        component: () => import("@/view/business/goods/categoryList.vue")
      },
      {
        path: "/goods/supplierList",
        name: "supplierList",
        mark: "12",
        meta: {
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "采购退货"
        },
        component: () => import("@/view/business/goods/supplierList.vue")
      },
      {
        path: "/goods/supplySkuList",
        name: "supplySkuList",
        mark: "13",
        meta: {
          icon: "arrow-graph-up-right",
          title: "预订单"
        },
        component: () => import("@/view/business/goods/supplierSkuList.vue")
      },
      {
        path: "/goods/brandList",
        name: "brandList",
        mark: "14",
        meta: {
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "预订单受理"
        },
        component: () => import("@/view/business/goods/brandList.vue")
      },
      {
        path: "/goods/barcodeList",
        name: "barcodeList",
        // mark: 'oms_goods_barcode',
        meta: {
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "条码管理"
        },
        component: () => import("@/view/business/goods/barcodeList.vue")
      },
      {
        path: "/goods/specificationsList",
        name: "specificationsList",
        // mark: 'oms_goods_specifications',
        meta: {
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "规格管理"
        },
        component: () => import("@/view/business/goods/specificationsList.vue")
      },
      {
        path: "/goods/priceList",
        name: "priceList",
        // mark: 'oms_goods_price',
        meta: {
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "价格管理"
        },
        component: () => import("@/view/business/goods/priceList.vue")
      },
      {
        path: "/goods/goodsSync",
        name: "goodsSync",
        // mark: 'oms_goods_sync',
        meta: {
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "商品同步"
        },
        component: () => import("@/view/business/goods/goodsSync.vue")
      }
    ]
  },
  {
    path: "",
    name: "orders",
    mark: "2",
    redirect: "/orders/directOrder",
    meta: {
      // hideInMenu: true,
      icon: "ios-paper",
      title: "销售管理"
    },
    component: Main,
    children: [
      {
        path: "/orders/orderApprove",
        name: "orderApprove",
        mark: "15",
        meta: {
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "销售订单"
        },
        component: () => import("@/view/business/orders/orderApprove.vue")
      },
      {
        path: "/orders/orderLink",
        name: "orderLink",
        mark: "16",
        meta: {
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "销售出库"
          // activeName:'directOrder'
        },
        component: () => import("@/view/business/orders/orderLink.vue")
      },
      {
        path: "/orders/directOrder",
        name: "directOrder",
        mark: "17",
        meta: {
          icon: "arrow-graph-up-right",
          title: "销售退货"
        },
        component: () => import("@/view/business/orders/directOrder.vue")
      },
      {
        path: "/orders/mallOrder",
        name: "mallOrder",
        mark: "18",
        meta: {
          icon: "arrow-graph-up-right",
          title: "预售单"
        },
        component: () => import("@/view/business/orders/mallOrder.vue")
      },
      {
        path: "/orders/supplierOrder",
        name: "supplierOrder",
        mark: "19",
        meta: {
          icon: "arrow-graph-up-right",
          title: "预售单受理"
        },
        component: () => import("@/view/business/orders/supplierOrder.vue")
      },
      {
        path: "/orders/storeOrder",
        name: "storeOrder",
        mark: "20",
        meta: {
          icon: "arrow-graph-up-right",
          title: "打包发货"
        },
        component: () => import("@/view/business/orders/storeOrder.vue")
      }
    ]
  },
  {
    path: "",
    name: "allot",
    mark: "3",
    redirect: "/allot/one/apply",
    meta: {
      icon: "ios-paper",
      title: "调拨管理"
    },
    component: Main,
    children: [
      {
        path: "",
        name: "allotOne",
        mark: "21",
        redirect: "/allot/one/apply",
        meta: {
          title: "调拨单"
        },
        component: parentView,
        children: [
          {
            path: "/allot/one/apply",
            name: "oneApply",
            mark: "23",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "调拨申请"
            }
            // component: () => import()
          },
          {
            path: "/allot/one/accept",
            name: "oneAccept",
            mark: "27",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "调拨申请受理"
            }
            // component: () => import()
          },
          {
            path: "/allot/one/delivery",
            name: "oneDelivery",
            mark: "28",
            meta: {
              // hideInMenu: true,
              title: "调拨出库"
            }
            // component: () => import()
          },
          {
            path: "/allot/one/inStorage",
            name: "oneInStorage",
            mark: "29",
            meta: {
              // hideInMenu: true,
              title: "调拨入库"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotTwo",
        mark: "22",
        redirect: "/allot/two/backApply",
        meta: {
          title: "调拨退货"
        },
        component: parentView,
        children: [
          {
            path: "/allot/two/backApply",
            name: "twoBackApply",
            mark: "25",
            meta: {
              // hideInMenu: true,
              title: "调入退回申请"
            }
            // component: () => import()
          },
          {
            path: "/allot/two/backAccept",
            name: "twoBackAccept",
            mark: "30",
            meta: {
              // hideInMenu: true,
              title: "调入退回受理"
            }
            // component: () => import()
          },
          {
            path: "/allot/two/backInStorage",
            name: "twoBackInStorage",
            mark: "31",
            meta: {
              // hideInMenu: true,
              title: "调出退回入库"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        mark: "24",
        meta: {
          title: "直调直发"
        },
        component: parentView,
        children: [
          {
            path: "/allot/three/headquarters",
            name: "threeHeadquarters",
            mark: "26",
            meta: {
              // hideInMenu: true,
              title: "总部直调受理"
            }
            // component: () => import()
          },
          {
            path: "/allot/three/supplier",
            name: "threeSupplier",
            mark: "32",
            meta: {
              // hideInMenu: true,
              title: "供应商直发受理"
            }
            // component: () => import()
          }
        ]
      }
    ]
  },
  {
    path: "",
    name: "stockControl",
    mark: "4",
    meta: {
      icon: "ios-toggle",
      title: "库存管理"
    },
    component: Main,
    children: [
      {
        path: "/policy/approvePolicy",
        name: "approvePolicy",
        mark: "33",
        meta: {
          icon: "arrow-graph-up-right",
          title: "库存查询"
        },
        component: () => import("@/view/business/policy/approvePolicy.vue")
      },
      {
        path: "/policy/purchasePolicy",
        name: "purchasePolicy",
        mark: "34",
        meta: {
          icon: "arrow-graph-up-right",
          title: "进货单"
        },
        component: () => import("@/view/business/policy/purchasePolicy.vue")
      },
      {
        path: "/policy/smsPolicy",
        name: "smsPolicy",
        mark: "35",
        meta: {
          icon: "arrow-graph-up-right",
          title: "销售单"
        },
        component: () => import("@/view/business/policy/smsPolicy.vue")
      },
      {
        path: "/policy/smsPolicy",
        name: "smsPolicy",
        mark: "36",
        meta: {
          icon: "arrow-graph-up-right",
          title: "移仓单"
        }
        // component: () => import('@/view/business/policy/smsPolicy.vue')
      },
      {
        path: "/policy/smsPolicy",
        name: "smsPolicy",
        mark: "37",
        meta: {
          icon: "arrow-graph-up-right",
          title: "盘点单"
        },
        component: () => import("@/view/business/policy/smsPolicy.vue")
      },
      {
        path: "/policy/smsPolicy",
        name: "smsPolicy",
        mark: "38",
        meta: {
          icon: "arrow-graph-up-right",
          title: "加工单"
        }
        // component: () => import('@/view/business/policy/smsPolicy.vue')
      },
      {
        path: "/policy/smsPolicy",
        name: "smsPolicy",
        mark: "39",
        meta: {
          icon: "arrow-graph-up-right",
          title: "安全库存设置"
        }
        // component: () => import('@/view/business/policy/smsPolicy.vue')
      }
    ]
  },
  {
    path: "",
    name: "reportForm",
    mark: "5",
    redirect: "/reportForm",
    meta: {
      icon: "ios-paper",
      title: "报表统计"
    },
    component: Main,
    children: [
      {
        path: "",
        name: "reportFormProcurement ",
        redirect: "",
        meta: {
          title: "采购报表"
        },
        component: parentView,
        children: [
          {
            path: "/reportFormProcurement/order",
            name: "reportFormProcurement-order",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "采购订单明细表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/inStorage",
            name: "reportFormProcurement-inStorage",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "采购入库明细表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/salesReturn ",
            name: "reportFormProcurement-salesReturn",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "采购退货明细表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/ranking ",
            name: "reportFormProcurement-ranking",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "采购排行明细表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/brand ",
            name: "reportFormProcurement-brand",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "品牌采购明细表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/accessories ",
            name: "reportFormProcurement-accessories",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "配件采购明细表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/accessoriesType ",
            name: "reportFormProcurement-accessoriesType",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "配件类型采购分解表"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/supplier ",
            name: "reportFormProcurement-supplier",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "供应商采购分析表"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "marketFrom",
        redirect: "",
        meta: {
          title: "销售报表"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "预售单明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "销售出库明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "销售订单明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "销售订单明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "销售退货明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "销售排行分析表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "品牌销售分析表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "配件销售分析表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "配件类型销售分析表"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        meta: {
          title: "库存报表"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "移仓单明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "盘点单明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "进销存汇总表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "分仓进销存明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "分仓进销存汇总表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "配件组装明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "配件拆分明细表"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        meta: {
          title: "财务报表"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "账户余额汇总表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 账户明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 收款明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "付款明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "总部收款明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "总部付款明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "客户欠款明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "供应商欠款明细表"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        meta: {
          title: "调拨报表"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 调拨申请明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 调拨受理明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 调拨出库明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 调拨入库明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 调入退回明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "调入退货明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "调出退回明细表"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "调出退货明细表"
            }
            // component: () => import()
          }
        ]
      }
    ]
  },
  {
    path: "",
    name: "settlementManagement",
    mark: "6",
    redirect: "/reportForm",
    meta: {
      icon: "ios-paper",
      title: "结算管理"
    },
    component: Main,
    children: [
      {
        path: "",
        name: "reportFormProcurement ",
        redirect: "",
        meta: {
          title: "对账与结账"
        },
        component: parentView,
        children: [
          {
            path: "",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 未对账业务单"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/inStorage",
            name: "reportFormProcurement-inStorage",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "月结对账"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/salesReturn ",
            name: "reportFormProcurement-salesReturn",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "合并对账单"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/ranking ",
            name: "reportFormProcurement-ranking",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 应收应付结算"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/brand ",
            name: "reportFormProcurement-brand",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "总部应收应付结算"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/accessories ",
            name: "reportFormProcurement-accessories",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "其它应收单"
            }
            // component: () => import()
          },
          {
            path: "/reportFormProcurement/accessoriesType ",
            name: "reportFormProcurement-accessoriesType",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "其它应付单"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "marketFrom",
        redirect: "",
        meta: {
          title: "其它收支业务"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "费用支出单"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: " 其它收入单"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "内部转账单"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        meta: {
          title: "设置"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "结算账户"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "收支项目"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "期初现金银行"
            }
            // component: () => import()
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "期初应收应付"
            }
            // component: () => import()
          }
        ]
      }
    ]
  },
  {
    path: "",
    name: "baseSetting",
    mark: "7",
    meta: {
      icon: "md-basket",
      title: "售后管理"
    },
    component: Main,
    children: [
      // {
      //   path: '/baseSetting/jpHsRelationship',
      //   name: 'jpHsRelationship',
      //   // mark: 'oms_policy_approve',
      //   meta: {
      //     icon: 'arrow-graph-up-right',
      //     title: '极配华胜门店关系'
      //   },
      //   component: () => import('@/view/business/baseSetting/storeArea.vue')
      // },
      {
        path: "/baseSetting/storeArea",
        name: "storeArea",
        // mark: 'oms_policy_approve',
        meta: {
          icon: "arrow-graph-up-right",
          title: "采退开单"
        },
        component: () => import("@/view/business/baseSetting/storeArea.vue")
      },
      {
        path: "/baseSetting/shellStoreSupplier",
        name: "shellStoreSupplier",
        meta: {
          icon: "arrow-graph-up-right",
          title: "直发退货"
        },
        component: () =>
          import("@/view/business/baseSetting/shellStoreSupplier.vue")
      },
      {
        path: "/baseSetting/setArea",
        name: "setArea",
        // mark: 'oms_policy_approve',
        meta: {
          icon: "arrow-graph-up-right",
          title: " 销退开单"
        },
        component: () => import("@/view/business/baseSetting/setArea.vue")
      },
      {
        path: "/baseSetting/setAreaStore",
        name: "setAreaStore",
        // mark: 'oms_policy_approve',
        meta: {
          icon: "arrow-graph-up-right",
          title: "客户理赔登记"
        },
        component: () => import("@/view/business/baseSetting/setAreaStore.vue")
      },
      {
        path: "/baseSetting/hsStoreSupplier",
        name: "hsStoreSupplier",
        // mark: 'oms_policy_approve',
        meta: {
          icon: "arrow-graph-up-right",
          title: "客户理赔处理"
        },
        component: () =>
          import("@/view/business/baseSetting/hsStoreSupplier.vue")
      },
      {
        path: "/",
        name: "",
        // mark: 'oms_orders_approve',
        meta: {
          // hideInMenu: true,
          title: "向供应商理赔登记"
        }
        // component: () => import()
      },
      {
        path: "/",
        name: "",
        // mark: 'oms_orders_approve',
        meta: {
          // hideInMenu: true,
          title: "返回单据确认"
        }
        // component: () => import()
      },
      {
        path: "/",
        name: "",
        // mark: 'oms_orders_approve',
        meta: {
          // hideInMenu: true,
          title: "反馈结果登记"
        }
        // component: () => import()
      }
    ]
  },
  {
    path: "/systemSetting",
    name: "systemSetting",
    // mark: '9',
    meta: {
      icon: "md-settings",
      title: "系统设置"
    },
    component: Main,
    children: [
      {
        path: "basicData",
        name: "basicData ",
        redirect: "",
        meta: {
          title: "基础数据"
        },
        component: parentView,
        children: [
          {
            path: "partManage",
            name: "partManage",
            // mark: '48',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 配件管理"
            },
            component: () =>
              import("@/view/system/basicData/Fittings/Fittings.vue")
          },
          {
            path: "",
            name: "",
            mark: "50",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 配件审核与标定"
            }
            // component: () => import()
          },
          {
            path: "ProductLA",
            name: "ProductLA",
            // mark: "49",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 产品线分配"
            },
            component: () => import('@/view/system/basicData/ProductLA/ProductLA.vue')
          },
          {
            path: "/essentialData/commoditiesInShortSupply",
            name: "commoditiesInShortSupply",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 紧俏商品管理"
            },
            component: () => import('@/view/system/essentialData/commoditiesInShortSupply/commoditiesInShortSupply.vue')
          },
          {
            path: "priceManage",
            name: "priceManage",
            // mark: '51',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 价格管理"
            },
            component: () =>
              import("@/view/system/basicData/priceManage/priceManage.vue")
          },
          {
            path: "",
            name: "",
            mark: "52",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 活动管理"
            }
            // component: () => import()
          },
          {
            path: "/essentialData/clientManagement",
            name: "clientManagement",
            // mark: '53',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 客户管理"
            },
            component: () =>
              import(
                "@/view/system/essentialData/clientManagement/clientManagement.vue"
              )
          },
          {
            path: "/essentialData/clientCredit",
            name: "clientCredit",
            // mark: "54",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 客户信用管理"
            },
            component: () => import('@/view/system/essentialData/customerCredit/customerCredit.vue')
          },
          {
            path: "/essentialData/CreditApproval",
            name: "CreditApproval",
            // mark: '55',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 额度审批数据查询"
            },
            component: () =>
              import(
                "@/view/system/essentialData/CreditApproval/CreditApproval.vue"
              )
          },
          {
            path: "/essentialData/supplierManagement/",
            name: "supplierManagement",
            // mark: "56",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 供应商管理"
            },
            component: () => import('@/view/system/essentialData/supplierManagement/supplierManagement.vue')
          },
          {
            path: "/essentialData/logistics",
            name: "essentialDataLogistics",
            // mark: '57',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 物流快递管理"
            },
            component: () =>
              import("@/view/system/essentialData/logistics/logistics.vue")
          },
          {
            path: "FittingReplacement",
            name: "FittingReplacement",
            mark: "58",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 配件替换"
            },
            component: () => import("@/view/system/basicData/FittingReplacement/FittingReplacement.vue")
          },
          {
            path: "/system/basicdata/mixture",
            name: "mixtureRatio",
            // mark: "60",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 配比清单"
            },
            component: () => import("@/view/system/basicData/mixTure/mixtureRatio.vue")
          },
          {
            path: "/essentialData/dictionaries",
            name: "dictionaries",
            // mark: '61',
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: " 数据字典"
            },
            component: () =>
              import(
                "@/view/system/essentialData/dicitonaries/dictionaries.vue"
              )
          }
        ]
      },
      {
        path: "",
        name: "marketFrom",
        redirect: "",
        meta: {
          title: "系统设置"
        },
        component: parentView,
        children: [
          {
            path: "/system/systemSetting/navigationFater/navigationFater",
            name: "navigationFater",
            // mark: '62',
            meta: {
              // hideInMenu: true,
              title: "初始化导航"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/navigationFater/navigationFater.vue"
              )
          },
          {
            path: "/system/systemSetting/navigationFater/sysetmset",
            name: "sysetmset",
            // mark: '62',
            meta: {
              // hideInMenu: true,
              title: "业务参数"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/sysetmset/sysetmset.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/StockLevel/StockLevel",
            name: "StockLevel",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "备货级别设置"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/StockLevel/StockLevel.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/CustomClassification/CustomClassification",
            name: "CustomClassification",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "自定义分类设置"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/CustomClassification/CustomClassification.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/AccessoriesCommission/AccessoriesCommission",
            name: "AccessoriesCommission",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "配件提成"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/AccessoriesCommission/AccessoriesCommission.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/AccessoriesBrand/AccessoriesBrand",
            name: "AccessoriesBrand",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "配件品牌"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/AccessoriesBrand/AccessoriesBrand.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/receiptPayment/receiptPayment",
            name: "receiptPayment",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "期初应收应付"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/receiptPayment/receiptPayment.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/AccessoriesCategory/AccessoriesCategory",
            name: "AccessoriesCategory",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "配件分类"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/AccessoriesCategory/AccessoriesCategory.vue"
              )
          },
          {
            path:
              "/systemSetting/InitialNavigation/storeManagement/storeManagement",
            name: "storeManagement",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "门店设置"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/storeManagement/storeManagement.vue"
                )
          },
          {
            path:
              "/systemSetting/InitialNavigation/setWarehouse/setWarehouse",
            name: "setWarehouse",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "仓库设置"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/setWarehouse/setWarehouse.vue"
                )
          },
          {
            path:
              "/systemSetting/InitialNavigation/setBank",
            name: "setBank",
            // mark: '59',
            meta: {
              hideInMenu: true,
              title: "初期现金银行"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/setBank/setBank.vue"
                )
          },
          {
            path: "/system/staff/management",
            name: "staffManagement",
            // mark: '59',
            meta: {
              // hideInMenu: true,
              title: " 员工管理"
            },
            component: () =>
              import(
                "@/view/system/systemSetting/staffManagement/staffManagement.vue"
              )
          },
          {
            path:"/system/partsExamine",
            name: "partsExamine",
            // mark: '59',
            meta: {
              // hideInMenu: true,
              title: ' 配件审核与标定'
            },
            component: () => import("@/view/system/partsExamine/partsexamine.vue")
          },
          {
            path: "/",
            name: "",
            // mark: 'oms_orders_approve',
            meta: {
              // hideInMenu: true,
              title: "角色权限管理"
            }
            // component: () => import()
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        meta: {
          title: "账号"
        },
        component: parentView,
        children: [
          {
            path: "/",
            name: "",
            mark: "63",
            meta: {
              // hideInMenu: true,
              title: "基本信息"
            }
            // component: () => import()
          }
        ]
      }
    ]
  },
  {
    path: "/lease",
    name: "lease",
    // mark: '8',
    meta: {
      icon: "ios-transgender",
      title: "租赁管理"
    },
    component: Main,
    children: [
      {
        path: "/lease/register",
        name: "register",
        // mark: '40',
        meta: {
          icon: "",
          title: "注册管理"
        },
        component: () => import("@/view/lease/lease/register.vue")
      },
      {
        path: "/lease/lessee",
        name: "lessee",
        // mark: '41',
        meta: {
          icon: "",
          title: "租户管理"
        },
        component: () => import("@/view/lease/lease/lessee.vue")
      },
      // {
      //   path: '/lease/Practice',
      //   name: 'Practice',
      //   // mark: '41',
      //   meta: {
      //     icon: '',
      //     title: '练习'
      //   },
      //   component: () => import('@/view/lease/lease/Practice.vue')
      // },
      {
        path: "/lease/product",
        name: "leaseProduct",
        // mark: '42',
        meta: {
          icon: "gear-b",
          title: "产品管理"
        },
        component: () => import("@/view/lease/product/prolist.vue")
      },
      {
        path: "/lease/order",
        name: "leaseOrder",
        // mark: '43',
        meta: {
          icon: "gear-b",
          title: "订单管理"
        },
        component: () => import("@/view/lease/order/orderlist.vue")
      },
      {
        path: "/lease/tenantres",
        name: "tenantRes",
        // mark: '44',
        meta: {
          icon: "gear-b",
          title: "租户资源"
        },
        component: () => import("@/view/lease/tenantres/tenantres.vue")
      },
      {
        path: "/lease/FeedbackManagementOne",
        name: "FeedbackManagementOne",
        // mark: '45',
        meta: {
          icon: "gear-b",
          title: "反馈管理"
        },
        component: () => import("@/view/lease/lease/FeedbackManagementOne.vue")
      },
      {
        path: "/lease/feedback_management",
        name: "feedback_management",
        // mark: '45',
        meta: {
          hideInMenu: true,
          icon: "gear-b",
          title: "反馈管理详情"
        },
        component: () => import("@/view/lease/lease/feedback_management.vue")
      },

      {
        path: "/lease/putlog",
        name: "putlog",
        // mark: 'gpart_oms_policy',
        meta: {
          icon: "gear-b",
          title: "发布日志"
        },
        component: () => import("@/view/lease/log/Logput.vue")
      },
      {
        path: "/lease/historylog",
        name: "historylog",
        redirect: "historylog",
        // mark: '46',
        meta: {
          icon: "gear-b",
          title: "历史日志"
        },
        component: parentView,
        children: [
          {
            path: "historylog",
            name: "historylog",
            // mark: '46',
            meta: {
              icon: "gear-b",
              title: "历史日志",
              hideInMenu: true
            },
            component: () => import("@/view/lease/log/historyLog.vue")
          },
          {
            path: "logWebInfo",
            name: "logWebInfo",
            // mark: '46',
            meta: {
              icon: "gear-b",
              title: "日志详情",
              hideInMenu: true
            },
            component: () => import("@/view/lease/log/logWebInfo.vue")
          }
        ]
      },
      {
        path: "/lease/customerServiceManagement",
        name: "customerServiceManagement",
        // mark: '47',
        meta: {
          icon: "gear-b",
          title: "客服管理"
        },
        component: () =>
          import(
            "@/view/lease/customerServiceManagement/customerServiceManagement.vue"
          )
      },
      {
        path: "/lease/dataDictionary/",
        name: "dataDictionary",
        // mark: 'gpart_oms_policy',
        meta: {
          icon: "gear-b",
          title: "数字字典"
        },
        component: () => import('@/view/lease/dataDictionary/dataDictionary.vue'),
      }
    ]
  },
  {
    path: "/asddasd",
    name: "leasdasdae",
    // mark: 'gpart_oms_policy',
    meta: {
      icon: "ios-transgender",
      title: "权限管理"
    },
    component: Main,
    children: [
      {
        path: "/lease/123",
        name: "register",
        // mark: 'oms_policy_approve',
        meta: {
          icon: "",
          title: "应用功能管理"
        }
        // component: () => import('@/view/lease/lease/register.vue')
      },
      {
        path: "/lease/ewewe",
        name: "lessee",
        // mark: 'oms_policy_approve',
        meta: {
          icon: "",
          title: " 菜单管理"
        }
        // component: () => import('@/view/lease/lease/lessee.vue')
      }
    ]
  },
  {
    path: "/401",
    name: "error_401",
    component: () => import("@/view/base/error-page/401.vue")
  },
  {
    path: "/500",
    name: "error_500",
    component: () => import("@/view/base/error-page/500.vue")
  },
  {
    path: "*",
    name: "error_404",
    component: () => import("@/view/base/error-page/404.vue")
  }
];

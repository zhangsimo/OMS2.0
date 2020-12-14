import Main from "@/view/base/main";
import parentView from "@/components/parent-view";
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  keepAlive: true,
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  keepAlive: (false) 设为false后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: "/login",
    name: "login",
    meta: {
      keepAlive: false,
      title: "Login - 登录",
      hideInMenu: true
    },
    component: () => import("@/view/base/login/login.vue")
  },
  {
    path: "/print",
    name: "print",
    meta: {
      keepAlive: false,
      title: "Print - 打印",
      hideInMenu: true
    },
    component: () => import("@/components/print/print.vue")
  },
  {
    path: "/register",
    name: "register",
    meta: {
      keepAlive: false,
      title: "register - 注册",
      hideInMenu: true
    },
    component: () => import("@/view/base/register/register.vue")
  },
  {
    path: "/",
    redirect: "/home",
    component: Main,
    meta: {
      keepAlive: false,
      title: "首页"
    },
    children: [
      {
        path: "home",
        name: "home",
        meta: {
          keepAlive: false,
          icon: "md-home",
          title: "首页"
        },
        component: () => import("@/view/base/home/home.vue")
      }
    ]
  },
  {
    path: "/goods",
    name: "goods",
    mark: "1",
    redirect: "/multilevel/level_2_1",
    meta: { keepAlive: true,
      icon: "ios-cart",
      title: "采购管理",

    },
    component: Main,
    children: [
      {
        path: "goodsList",
        name: "goodsList",
        mark: "1000",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "滚动计划单",
          //
        },
        component: () => import("@/view/goods/goodsList/goodsList.vue")
      },
      {
        path: "plannedPurchaseOrder",
        name: "PlannedPurchaseOrder",
        mark: "1001",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "计划采购订单",
          //
        },
        component: () =>
          import("@/view/goods/plannedPurchaseOrder/plannedPurchaseOrder.vue")
      },
      {
        path: "interPurchase",
        name: "InterPurchase",
        mark: "1002",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "国际采购订单",

        },
        component: () => import("@/view/goods/InterPurchase/InterPurchase.vue")
      },
      {
        path: "/goods/temporary-purchase",
        name: "TemporaryPurchase",
        mark: "1003",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "临时采购订单",

        },
        component: () => import("@/view/goods/temporaryPurchase/index.vue")
      },
      {
        path: "/goods/outside-purchase",
        name: "OutsidePurchase",
        mark: "1004",
        meta: { keepAlive: true,
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "外采订单",

        },
        component: () => import("@/view/goods/outsidePurchase/index.vue")
      },
      {
        path: "/goods/supplierList",
        name: "supplierList",
        mark: "1005",
        meta: { keepAlive: true,
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "采购退货",

        },
        component: () =>
          import("@/view/business/goods/supplierList/supplierList.vue")
      },
      {
        path: "/goods/bookingSheet/bookingSheet",
        name: "bookingSheet",
        mark: "1006",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "预订单",

        },
        component: () =>
          import("@/view/business/goods/bookingSheet/bookingSheet.vue")
      },
      {
        path: "/goods/brandList",
        name: "brandList",
        mark: "1007",
        meta: { keepAlive: true,
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "预订单受理",

        },
        component: () => import("@/view/business/goods/brandList.vue")
      },
      {
        path: "/goods/barcodeList",
        name: "barcodeList",
        // mark: 'oms_goods_barcode', 空
        meta: { keepAlive: true,
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "条码管理",

        },
        component: () => import("@/view/business/goods/barcodeList.vue")
      },
      {
        path: "/goods/specificationsList",
        name: "specificationsList",
        // mark: 'oms_goods_specifications', 空
        meta: { keepAlive: true,
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "规格管理",

        },
        component: () => import("@/view/business/goods/specificationsList.vue")
      },
      {
        path: "/goods/priceList",
        name: "priceList",
        // mark: 'oms_goods_price', 空
        meta: { keepAlive: true,
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "价格管理",

        },
        component: () => import("@/view/business/goods/priceList.vue")
      },
      {
        path: "/goods/goodsSync",
        name: "goodsSync",
        // mark: 'oms_goods_sync', 空
        meta: { keepAlive: true,
          hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "商品同步",

        },
        component: () => import("@/view/business/goods/goodsSync.vue")
      }
    ]
  },
  {
    path: "",
    name: "salesManagement",
    mark: "2",
    redirect: "",
    meta: { keepAlive: true,
      // hideInMenu: true,
      icon: "ios-pricetags",
      title: "销售管理",

    },
    component: Main,
    children: [
      {
        path: "/salesManagement/salesOrder",
        name: "salesOrder",
        mark: "2000",
        meta: { keepAlive: true,
          // hideInMenu: true,
          icon: "arrow-graph-up-right",
          title: "销售订单",

        },
        component: () =>
          import("@/view/salesManagement/salesOrder/salesOrder.vue")
      },
      {
        path: "/salesManagement/sellReturn",
        name: "sellReturn",
        mark: "2001",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "销售退货",

        },
        component: () =>
          import("@/view/salesManagement/sellReturn/sellReturn.vue")
      },
      {
        path: "/salesManagement/presell",
        name: "presell",
        mark: "2002",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "预售单",

        },
        component: () => import("@/view/salesManagement/presell/presell.vue")
      },
      {
        path: "/salesManagement/acceptance",
        name: "acceptance",
        mark: "2003",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "预售单受理",

        },
        component: () =>
          import("@/view/salesManagement/acceptance/acceptance.vue")
      },
      {
        path: "/hsOrder/hsIndex",
        name: "hsOrder",
        mark: "2004",
        meta: {
          icon: "arrow-graph-up-right",
          title: "华胜订单处理",
          keepAlive: false,
          // hideInMenu:true
        },
        component: () =>
          import("@/view/salesManagement/hsOrder/hsIndex.vue")
      },
      {
        path: "/hsOrder/hsPayment",
        name: "hsPayment",
        mark: "2004",
        meta: {
          icon: "arrow-graph-up-right",
          title: "华胜代付入库",
          keepAlive: false,
          // hideInMenu:true
        },
        component: () =>
          import("@/view/salesManagement/hsOrder/hsPayment.vue")
      }
    ]
  },
  {
    path: "",
    name: "allot",
    mark: "3",
    redirect: "/allot/one/apply",
    meta: { keepAlive: true,
      icon:"md-git-pull-request",
      // icon: "ios-paper",
      title: "调拨管理",
    },
    component: Main,
    children: [
      {
        path: "",
        name: "allotOne",
        mark: "3100",
        redirect: "/allot/one/apply",
        meta: { keepAlive: true,
          title: "调拨单"
        },
        component: parentView,
        children: [
          {
            path: "/AlotManagement/transferringOrder/applyFor",
            name: "applyFor",
            mark: "3101",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "调拨申请",

            },
            component: () =>
              import(
                "@/view/AlotManagement/transferringOrder/applyFor/applyFor.vue"
              )
          },
          {
            path: "/AlotManagement/transferringOrder/Acceptances",
            name: "Acceptances",
            mark: "3103",
            meta: {
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "调拨申请受理",
              keepAlive: false,
            },
            component: () =>
              import(
                "@/view/AlotManagement/transferringOrder/Acceptances/Acceptances.vue"
              )
          },
          {
            path: "/AlotManagement/transferringOrder/stockRemoval",
            name: "stockRemoval",
            mark: "3102",
            meta: {
              // hideInMenu: true,
              title: "调拨出库",
              keepAlive: false,
            },
            component: () =>
              import(
                "@/view/AlotManagement/transferringOrder/stockRemoval/stockRemoval.vue"
              )
          },
          {
            path: "/AlotManagement/transferringOrder/putStorage",
            name: "putStorage",
            mark: "3104",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "调拨入库",

            },
            component: () =>
              import(
                "@/view/AlotManagement/transferringOrder/putStorage/putStorage.vue"
              )
          },
        ]
      },
      {
        path: "",
        name: "allotTwo",
        mark: "3200",
        redirect: "/allot/two/backApply",
        meta: { keepAlive: true,
          title: "调拨退货"
        },
        component: parentView,
        children: [
          {
            path: "/allot/two/backApply",
            name: "twoBackApply",
            mark: "3201",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "调入退回申请",

            },
            component: () =>
              import(
                "@/view/AlotManagement/transferReback/twoBackApply/index.vue"
              )
          },
          {
            path: "/allot/two/backInStorage",
            name: "twoBackInStorage",
            mark: "3202",
            meta: {
              // hideInMenu: true,
              title: "调出退回入库",
              keepAlive: false,
            },
            component: () =>
              import(
                "@/view/AlotManagement/transferReback/twoBackInStorage/index.vue"
              )
          },
          {
            path: "/allot/two/backAccept",
            name: "twoBackAccept",
            mark: "3203",
            meta: {
              // hideInMenu: true,
              title: "调入退回受理",
              keepAlive: false,
            },
            component: () =>
              import(
                "@/view/AlotManagement/transferReback/twoBackAccept/index.vue"
              )
          }
        ]
      },
      {
        path: "",
        name: "allotThree",
        mark: "3300",
        meta: { keepAlive: true,
          title: "直调直发"
        },
        component: parentView,
        children: [
          {
            path: "/allot/three/headquarters",
            name: "threeHeadquarters",
            mark: "3301",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "总部直调入库",

            },
            component: () =>
              import(
                "@/view/AlotManagement/quickDelivery/threeHeadquarters/index.vue"
              )
          },
          {
            path: "/allot/three/supplier",
            name: "threeSupplier",
            mark: "3302",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "供应商直发入库",

            },
            component: () =>
              import(
                "@/view/AlotManagement/quickDelivery/threeSupplier/index.vue"
              )
          }
        ]
      }
    ]
  },
  {
    path: "/business/policy",
    name: "policy",
    mark: "4",
    meta: { keepAlive: true,
      icon: "ios-cube",
      title: "库存管理",
    },
    component: Main,
    children: [
      {
        path: "/policy/stockSearch",
        name: "stockSearch",
        mark: "4000",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "库存查询",

        },
        component: () =>
          import("@/view/business/policy/stockSearch/stockSearch.vue")
      },
      {
        path: "/business/procurementAndStorage",
        name: "procurementAndStorage",
        mark: "4001",
        meta: {
          icon: "arrow-graph-up-right",
          title: "采购入库",
          keepAlive: false,
        },
        component: () =>
          import(
            "@/view/business/procurementAndStorage/procurementAndStorage.vue"
          )
      },
      // {
      //   path: "/policy/market",
      //   name: "market",
      //   mark: "4002",
      //   meta: { keepAlive: true,
      //     icon: "arrow-graph-up-right",
      //     title: "销售单"
      //   },
      //   component: () => import("@/view/business/policy/market/market.vue")
      // },
      {
        path: "/policy/moveStorehouse",
        name: "moveStorehouse",
        mark: "4003",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "移仓单",

        },
        component: () =>
          import("@/view/business/policy/moveStorehouse/moveStorehouse.vue")
      },
      {
        path: "/policy/smsInventory",
        name: "smsInventory",
        mark: "4004",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "盘点单",

        },
        component: () =>
          import("@/view/business/policy/smsInventory/smsInventory.vue")
      },
      {
        path: "/policy/ventoryProfit",
        name: "ventoryProfit",
        mark: "4006",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "盘盈入库",

        },
        component: () =>
          import("@/view/business/policy/ventoryProfit/ventory.vue")
      },
      {
        path: "/policy/inventoryLosses",
        name: "inventoryLosses",
        mark: "4007",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "盘亏出库",

        },
        component: () =>
          import("@/view/business/policy/inventoryLosses/outStock.vue")
      },
      {
        path: "/policy/process",
        name: "process",
        mark: "4005",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "加工单",

        },
        component: () => import("@/view/business/policy/process/process.vue")
      },
    ]
  },
  {
    path: "/settlementManagement",
    name: "settlementManagement",
    mark: "5",
    redirect: "/reportForm",
    meta: { keepAlive: true,
      icon: "logo-yen",
      // icon: "ios-paper",
      title: "结算管理"
    },
    component: Main,
    children: [
      {
        path: '/documentsToQuery',
        name: 'DocumentsToQuery',
        redirect: "/multilevel/level_2_1",
        mark: '5400',
        meta: { keepAlive: true,
          title: '单据查询'
        },
        component: parentView,
        children: [
          {
            path: 'undoFlowQuery',
            name: 'UndoFlowQuery',
            mark: '5401',
            meta: { keepAlive: true,
              title: '撤销流水帐查询',
            },
            component: () =>
              import("@/view/settlementManagement/documentsToQuery/undoFlowQuery/undoFlowQuery.vue")
          },
          // {
          //   path: 'checkTheOrder',
          //   name: 'checkTheOrder',
          //   mark:'',
          //   meta:{
          //     title:'对账订单',
          //   },
          //   component:() =>
          //     import("@/view/settlementManagement/documentsToQuery/undoFlowQuery/undoFlowQuery.vue")
          // }
        ]
      },
      {
        path: "/settlementManagement/bill",
        name: "settlementManagementBill",
        mark: "5100",
        meta: { keepAlive: true,
          title: "对账与结算"
        },
        component: parentView,
        children: [
          {
            path: "/settlementManagement/bill/AccountStatement",
            name: "accountStatement",
            mark: "5101",
            meta: { keepAlive: true,
              title: "对账单"
            },
            component: () =>
              import("@/view/settlementManagement/bill/AccountStatement.vue")
          },
          {
            path: "/settlementManagement/bill/CollectionPayment",
            name: "billCollectionPayment",
            mark: "5102",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "收付款单查询"
            },
            component: () =>
              import("@/view/settlementManagement/bill/CollectionPayment.vue")
          },
          {
            path:
              "/settlementManagement/settlementManagement/bill/Allocationstock",
            name: "billAllocationstock",
            mark: "5103",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: " 调拨出库明细"
            },
            component: () =>
              import("@/view/settlementManagement/bill/Allocationstock.vue")
          },
          {
            path: "/settlementManagement/bill/Allocationwarehousing",
            name: "billAllocationwarehousing",
            // mark: 'oms_orders_approve',
            mark: "5104",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: " 调拨入库明细"
            },
            component: () =>
              import(
                "@/view/settlementManagement/bill/Allocationwarehousing.vue"
              )
          },
          {
            path: "/settlementManagement/bill/Onway",
            name: "billOnway",
            mark: "5105",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: " 调出在途信息"
            },
            component: () =>
              import("@/view/settlementManagement/bill/Onway.vue")
          },
          {
            path: "/settlementManagement/settlementManagement/bill/External",
            name: "billExternal",
            mark: "5106",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: " 采购入库明细"
            },
            component: () =>
              import("@/view/settlementManagement/bill/External.vue")
          },
          {
            path: "/settlementManagement/bill/Sales",
            name: "billSales",
            // mark: 'oms_orders_approve',
            mark: "5107",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "销售订单明细"
            },
            component: () =>
              import("@/view/settlementManagement/bill/Sales.vue")
          },
          {
            path: "/settlementManagement/settlementManagement/bill/stock",
            name: "billStock",
            // mark: 'oms_orders_approve',
            mark: "5108",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "销售出库明细"
            },
            component: () =>
              import("@/view/settlementManagement/bill/stock.vue")
          }
          // {
          //   path: "/settlementManagement/bill/chainReceivable",
          //   name: "bill-chainReceivable",
          //   // mark: 'oms_orders_approve',
          //   mark: '5109',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     title: "连锁应收应付查询"
          //   },
          //   component: () => import("@/view/settlementManagement/bill/chainReceivable.vue")
          // },
          // {
          //   path: "/settlementManagement/bill/arrearsAnalysis",
          //   name: "bill-arrearsAnalysis",
          //   // mark: 'oms_orders_approve',
          //   mark: '5110',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     title: "欠款分析"
          //   },
          //   component: () => import("@/view/settlementManagement/bill/arrearsAnalysis.vue")
          // },
          // {
          //   path: "/settlementManagement/bill/paymentAnalysis",
          //   name: "bill-paymentAnalysis",
          //   // mark: 'oms_orders_approve',
          //   mark: '5112',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     title: "付款分析"
          //   },
          //   component: () => import("@/view/settlementManagement/bill/paymentAnalysis.vue")
          // }
        ]
      },
      {
        path: "/invoiceAdministration",
        name: "invoiceAdministration",
        mark: "5500",
        // redirect: "/reportForm",
        meta: { keepAlive: true,
          // icon: "ios-paper",
          title: "发票管理"
        },
        component: parentView,
        children: [
          // {
          //   path: "/invoiceAdministration/costOpening",
          //   name: "invoiceAdministration-costOpening",
          //   redirect: "",
          //   mark: "5501",
          //   meta: { keepAlive: true,
          //     title: "费用开票申请"
          //   },
          //   component: () =>
          //     import(
          //       "@/view/settlementManagement/invoiceAdministration/costOpening.vue"
          //     )
          // },
          {
            path: "/invoiceAdministration/invoiceApply",
            name: "invoiceAdministrationInvoiceApply",
            redirect: "",
            mark: "5502",
            meta: { keepAlive: true,
              title: "开票申请查询与核销"
            },
            component: () =>
              import(
                "@/view/settlementManagement/invoiceAdministration/invoiceApply.vue"
              )
          },
          {
            path: "/invoiceAdministration/salesInvoice",
            name: "invoiceAdministrationSalesInvoice",
            redirect: "",
            mark: "5503",
            meta: { keepAlive: true,
              title: "销售发票导入"
            },
            component: () =>
              import(
                "@/view/settlementManagement/invoiceAdministration/salesInvoice.vue"
              )
          },
          {
            path: "/invoiceAdministration/invoiceManagement",
            name: "invoiceAdministrationInvoiceManagement",
            redirect: "",
            // mark: "5200",
            meta: { keepAlive: true,
              title: "进项发票管理"
            },
            component: () =>
              import(
                "@/view/settlementManagement/invoiceAdministration/invoiceManagement.vue"
              )
          }
          // {
          //   path: "",
          //   name: "allotThree",
          //   meta: { keepAlive: true,
          //     title: "设置"
          //   },
          //   component: parentView,
          //   children: [
          //     {
          //       path: "",
          //       name: "",
          //       // mark: 'oms_orders_approve',
          //       meta: { keepAlive: true,
          //         // hideInMenu: true,
          //         title: "结算账户"
          //       },
          //       component: () => import("@/view/system/systemSetting/InitialNavigation/SettlementAccount/SettlementAccount.vue")
          //     },
          //     {
          //       path: "/",
          //       name: "",
          //       // mark: 'oms_orders_approve',
          //       meta: { keepAlive: true,
          //         // hideInMenu: true,
          //         title: "收支项目"
          //       }
          //       // component: () => import()
          //     },
          //     {
          //       path: "/",
          //       name: "",
          //       // mark: 'oms_orders_approve',
          //       meta: { keepAlive: true,
          //         // hideInMenu: true,
          //         title: "期初现金银行"
          //       }
          //       // component: () => import()
          //     },
          //     {
          //       path: "/",
          //       name: "",
          //       // mark: 'oms_orders_approve',
          //       meta: { keepAlive: true,
          //         // hideInMenu: true,
          //         title: "期初应收应付"
          //       }
          //       // component: () => import()
          //     }
          //   ]
          // }
        ]
      },
      {
        path: "/settlementManagement/paymentmanage",
        name: "payMentmanage",
        // mark: 'oms_orders_approve',
        mark: "5200",
        meta: { keepAlive: true,
          // hideInMenu: true,

          title: "应收应付"
        },
        component: () =>
          import("@/view/settlementManagement/paymentmanage/index.vue")
      },
      {
        path: "/settlementManagement/advanceCollection",
        name: "settlementManagementAdvanceCollection",
        // mark: 'oms_orders_approve',
        mark: "5300",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "预收款管理"
        },
        component: () =>
          import("@/view/settlementManagement/advanceCollection/advanceCollection.vue")
      },
      {
        path: "/settlementManagement/advanceCharge",
        name: "settlementManagementAdvanceCharge",
        // mark: 'oms_orders_approve',
        mark: "5600",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "预付款管理"
        },
        component: () =>
          import("@/view/settlementManagement/advanceCharge/advanceCharge.vue")
      },
      {
        path: "/settlementManagement/otherReceivables",
        name: "settlementManagementOtherReceivables",
        // mark: 'oms_orders_approve',
        mark: "5700",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "其他应收款管理"
        },
        component: () =>
          import("@/view/settlementManagement/otherReceivables/otherReceivables.vue")
      },
      {
        path: "/settlementManagement/otherPayable",
        name: "settlementManagementOtherPayable",
        // mark: 'oms_orders_approve',
        mark: "5800",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "其他应付款管理"
        },
        component: () =>
          import("@/view/settlementManagement/otherPayable/otherPayable.vue")
      },
      {
        path: "/settlementManagement/businessBorrowing",
        name: "settlementManagementBusinessBorrowing",
        // mark: 'oms_orders_approve',
        mark: "5900",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "因公借支管理"
        },
        component: () =>
          import("@/view/settlementManagement/businessBorrowing/businessBorrowing.vue")
      },
      {
        path: "/settlementManagement/Dailyfundaudit",
        name: "settlementManagementDailyfundaudit",
        // mark: 'oms_orders_approve',
        mark: "5301",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "每日资金审核",
        },
        component: () =>
          import("@/view/settlementManagement/Dailyfundaudit/index.vue")
      },
      {
        path: "/settlementManagement/Expensereimbursement",
        name: "settlementManagementExpensereimbursement",
        // mark: 'oms_orders_approve',
        mark: "51000",
        meta: { keepAlive: true,
          // hideInMenu: true,
          title: "费用报销管理"
        },
        component: () =>
          import("@/view/settlementManagement/Expensereimbursement/Expensereimbursement.vue")
      },
      {
        path: "/fundsManagement",
        name: "fundsManagement",
        mark: "51100",
        meta: { keepAlive: true,
          title: "资金管理"
        },
        component: parentView,
        children: [
          {
            path: "capitalChain",
            name: "capitalChain",
            mark: "51101",
            meta: { keepAlive: true,
              title: "连锁资金日记账"
            },
            component: () =>
              import("@/view/settlementManagement/fundsManagement/capitalChain/capitalChain.vue")
          },
          {
            path: "shopJournal",
            name: "shopJournal",
            mark: "51102",
            meta: { keepAlive: true,

              title: "门店资金日记账"
            },
            component: () =>
              import("@/view/settlementManagement/fundsManagement/shopJournal/shopJournal.vue")
          },
          {
            path: "accountRegistration",
            name: "accountRegistration",
            mark: "51103",
            meta: { keepAlive: true,
              title: "账户登记表"
            },
            component: () =>
              import("@/view/settlementManagement/fundsManagement/accountRegistration/accountRegistration.vue")
          },
          {
            path: "/fundsManagement/statistical",
            name: "statistical",
            mark: "51104",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "资金统计表"
            },
            component: () =>
              import("@/view/settlementManagement/Statistical/statistical.vue")
          },
          {
            path: "/fundsManagement/cashflow",
            name: "cashflow",
            mark: "51105",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "现金流量表"
            },
            component: () =>
              import("@/view/settlementManagement/Statistical/cashflow.vue")
          },
          {
            path: "/fundsManagement/accountings",
            name: "accountings",
            mark: "51106",
            meta: { keepAlive: true,

              title: "资金日记账审核"
            },
            component: () =>
              import("@/view/settlementManagement/accounting/accounting.vue")
          },
          {
            path: "/fundsManagement/cashJournal",
            name: "cashJournal",
            redirect: "",
            mark: "51107",
            meta: { keepAlive: true,

              title: "现金日记账"
            },
            component: () =>
              import("@/view/settlementManagement/fundsManagement/cashJournal/cashJournal.vue")
          },
          {
            path: "/fundsManagement/claimWrite",
            name: "claimWrite",
            redirect: "",
            mark: "51108",
            meta: {
              keepAlive: true,
              title: "资金认领款核销"
            },
            component: () =>
              import("@/view/settlementManagement/fundsManagement/claimWrite/claimWrite.vue")
          },
        ]
      },
      // {
      //   path: "/settlementManagement/DailyFundReview",
      //   name: "settlementManagement-DailyFundReview",
      //   mark: "5300",
      //   meta: { keepAlive: true,
      //     // hideInMenu: true,
      //     title: "资金审核"
      //   },
      //   component: () =>
      //     import("@/view/settlementManagement/DailyFundReview/index.vue")
      // }
    ]
  },
  // {
  //   path: "/aftersale",
  //   name: "afterSale",
  //   //mark: "12",
  //   meta: { keepAlive: true,
  //     icon: "md-brush",
  //     // icon: "ios-paper",
  //     title: "售后模块"
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: '/claimSheet',
  //       name: 'claimSheet',
  //       //mark: '12001',
  //       meta: { keepAlive: true,
  //         title: '理赔开单',
  //       },
  //       component: parentView,
  //       children: [
  //         // {
  //         //   path: 'afterSale/CustomerClaimsRegistration',
  //         //   name: 'CustomerClaimsRegistration',
  //         //   // redirect: "/multilevel/level_2_1",
  //         //   //mark: '11001',
  //         //   meta: { keepAlive: true,
  //         //     title: '客户理赔登记',
  //         //
  //         //   },
  //         //   component: () =>
  //         //     import("@/view/afterSale/CustomerClaimsRegistration/index.vue")
  //         // },
  //         // {
  //         //   path: 'afterSale/CustomerclaimsHandling',
  //         //   name: 'CustomerclaimsHandling',
  //         //   // redirect: "/multilevel/level_2_1",
  //         //   //mark: '11002',
  //         //   meta: { keepAlive: true,
  //         //     title: '客户理赔处理',
  //         //   },
  //         //   component: () =>
  //         //     import("@/view/afterSale/CustomerclaimsHandling/index.vue")
  //         // },
  //         {
  //           path: 'afterSale/registerClaimSupplier',
  //           name: 'registerClaimSupplier',
  //           //mark: '11002',
  //           meta: {
  //             keepAlive: true,
  //             title: '向供应商理赔登记',
  //           },
  //           component: () =>
  //             import("@/view/afterSale/claimSheet/registerClaimSupplier/index.vue")
  //         },
  //       ]
  //     },
  //     {
  //       path: '',
  //       name: 'claimsTheQuery',
  //       //mark: '12002',
  //       redirect: "/afterSale/claimsTheQuery/Customerclaimsregistrationenquiry",
  //       meta: { keepAlive: true,
  //         title: '理赔查询',
  //       },
  //       component: parentView,
  //       children:[
  //         {
  //           path: '/claimsTheQuery/Customerclaimsregistrationenquiry',
  //           name: 'Customerclaimsregistrationenquiry',
  //           meta: { keepAlive: true,
  //             title: '客户理赔登记查询',
  //           },
  //           // component: () =>
  //           //   import("@/view/afterSale/Customerclaimsregistrationenquiry/index.vue")
  //         },
  //         // {
  //         //   path: 'afterSale/Customerclaimshandlingenquiry',
  //         //   name: 'Customerclaimshandlingenquiry',
  //         //   meta: { keepAlive: true,
  //         //     title: '客户理赔处理查询',
  //         //   },
  //         //   component: () =>
  //         //     import("@/view/afterSale/Customerclaimshandlingenquiry/index.vue")
  //         // },
  //         {
  //           path: '/afterSale/claimsTheQuery/inAndOutQuery',
  //           name: 'inAndOutQuery',
  //           meta: {
  //             keepAlive: true,
  //             title: '出入记录查询',
  //           },
  //           component: () =>
  //             import("@/view/afterSale/claimsTheQuery/inAndOutQuery/index.vue")
  //         },
  //       ]
  //     },
  //   ]
  // },
  {
    path: "/documentApproval",
    name: "documentApproval",
    mark: "11",
    redirect: "/reportForm",
    meta: { keepAlive: true,
      icon: "md-brush",
      // icon: "ios-paper",
      title: "审批管理"
    },
    component: Main,
    children: [
      {
        path: '/documentApproval/draftingOfApplication',
        name: 'documentApprovalDraftingOfApplication',
        // redirect: "/multilevel/level_2_1",
        mark: '11001',
        meta: { keepAlive: true,
          title: '申请流程',

        },
        component: () =>
          import("@/view/documentApproval/draftingOfApplication/draftingOfApplication.vue")
      },
      {
        path: "/documentApproval/myApplication",
        name: "myApplication",
        mark: "11002",
        meta: { keepAlive: true,
          title: "申请单",
          //
        },
        component: () => import("@/view/documentApproval/myApplication/myApplication.vue")
      },
    ]
  },

  {
    path: "",
    name: "reportForm",
    mark: "7",
    // hideInMenu: true,
    redirect: "/reportForm",
    meta: { keepAlive: true,
      icon: "ios-stats",
      /**
       * <Icon type="stats-bars"></Icon>
       * */
      // icon: "ios-paper",
      title: "报表统计"
    },
    component: Main,
    children: [
      {
        path: "/reportForm/dailySalesStatistics/dailySalesStatistics",
        name: "dailySalesStatistics",
        redirect: "",
        mark: "7107",
        meta: { keepAlive: true,
          title: "每日销售统计",
        },
        component: () => import("@/view/reportForm/dailySalesStatistics/index.vue"),
      },
      // {
      //   path: "/reportForm/salesAndInventorylist/salesAndInventorylist",
      //   name: "salesAndInventorylist",
      //   redirect: "",
      //   // mark: "7108",
      //   meta: { keepAlive: true,
      //     title: "进销存排行",
      //   },
      //   component: () => import("@/view/reportForm/salesAndInventorylist/index.vue"),
      // },
      {
        path: "/reportForm/purchaseRepor/reporIndex",
        name: "reportFormProcurement ",
        redirect: "",
        mark: "7100",
        meta: { keepAlive: true,
          title: "采购报表",

        },
        component: () => import("@/view/reportForm/purchaseRepor/index.vue"),
      },
      {
        path: "/reportForm/purchaseRepor/saleOrder",
        name: "procurementSaleOrder",
        redirect: "",
        mark: "7101",
        meta: { keepAlive: true,
          title: "销售报表",

        },
        component: () => import("@/view/reportForm/saleOrder/index.vue"),
      },
      // {
      //   path: "/reportForm/purchaseReporAnalysis",
      //   name: "purchaseReporAnalysis ",
      //   redirect: "",
      //   mark: "7109",
      //   meta: {
      //     keepAlive: true,
      //     title: "采购排行分析",
      //   },
      //   component: () => import("@/view/reportForm/purchaseReporAnalysis/index.vue"),
      // },
      // {
      //   path: "/reportForm/saleOrderAnalysis",
      //   name: "saleOrderAnalysis",
      //   redirect: "",
      //   mark: "7110",
      //   meta: { keepAlive: true,
      //     title: "销售排行分析",
      //   },
      //   component: () => import("@/view/reportForm/saleOrderAnalysis/index.vue"),
      // },
      {
        path: "/reportForm/purchaseRepor/transfer",
        name: "procurementTransfer",
        redirect: "",
        mark: "7102",
        meta: { keepAlive: true,
          title: "调拨报表",

        },
        component: () => import("@/view/reportForm/transfer/index.vue"),
      },
      {
        path: "/reportForm/purchaseRepor/way",
        name: "procurementWay",
        redirect: "",
        mark: "7103",
        meta: { keepAlive: true,
          title: "调出在途信息",

        },
        component: () => import("@/view/reportForm/way/index.vue"),
      },
      {
        path: "/reportForm/purchaseRepor/moveWarehouse",
        name: "procurementMoveWarehouse",
        redirect: "",
        mark: "7104",
        meta: { keepAlive: true,
          title: "移仓报表",

        },
        component: () => import("@/view/reportForm/moveWarehouse/index.vue"),
      },
      {
        path: "/reportForm/purchaseRepor/Stocktaking",
        name: "procurementStocktaking",
        redirect: "",
        mark: "7105",
        meta: { keepAlive: true,
          title: "盘点报表",

        },
        component: () => import("@/view/reportForm/Stocktaking/index.vue"),
      },
      {
        path: "/reportForm/purchaseRepor/Assembly",
        name: "procurementAssembly",
        redirect: "",
        mark: "7106",
        meta: { keepAlive: true,
          title: "加工报表",

        },
        component: () => import("@/view/reportForm/Assembly/index.vue"),
      },
    ]
  },
  {
    path: "/systemSetting",
    name: "systemSetting",
    mark: "9",
    meta: { keepAlive: true,
      icon: "md-settings",
      title: "系统设置",

    },
    component: Main,
    children: [
      {
        path: "basicData",
        name: "1basicData ",
        mark: "9100",
        redirect: "",
        meta: { keepAlive: true,
          title: "基础数据"
        },
        component: parentView,
        children: [
          {
            path: "Fittings",
            name: "Fittings",
            mark: "9101",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "配件管理",

            },
            component: () =>
              import("@/view/system/basicData/Fittings/Fittings.vue")
          },
          {
            path: "/system/partsExamine",
            name: "partsExamine",
            mark: "9102",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "配件审核与标定",

            },
            component: () =>
              import("@/view/system/partsExamine/partsexamine.vue")
          },
          {
            path: "ProductLA",
            name: "ProductLA",
            mark: "9103",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "产品权限管理",

            },
            component: () =>
              import("@/view/system/basicData/ProductLA/ProductLA.vue")
          },
          {
            path: "/essentialData/commoditiesInShortSupply",
            name: "commoditiesInShortSupply",
            mark: "9104",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "紧俏品管理",

            },
            component: () =>
              import(
                "@/view/system/essentialData/commoditiesInShortSupply/commoditiesInShortSupply.vue"
              )
          },
          {
            path: "/AlotManagement/transferringOrder/productDistribution",
            name: "productDistribution",
            mark: "3105",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "紧俏品分配",

            },
            component: () =>
              import(
                "@/view/AlotManagement/transferringOrder/productDistribution/index.vue"
              )
          },
          {
            path: "issuing-office",
            name: "issuingOffice",
            mark: "3105",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "开票单位",

            },
            component: () =>
              import(
                "@/view/system/basicData/issuingOffice/index.vue"
                )
          },
          {
            path: "priceManage",
            name: "priceManage",
            mark: "9105",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "价格管理"
            },
            component: parentView,
            children: [
              {
                path: "priceManage",
                name: "priceManage",
                mark: "9210",
                meta: { keepAlive: true,
                  title: "价格管理",

                },
                component: () =>
                  import("@/view/system/basicData/priceManage/priceManage.vue")
              },
              {
                path: "priceSystemSearch",
                name: "priceSystemSearch",
                mark: "9211",
                meta: { keepAlive: true,
                  title: "价格体系查询",

                },
                component: () =>
                  import("@/view/system/basicData/priceManage/priceSystemSearch/priceSystemSearch.vue")
              }
            ]
          },
          // {
          //   path: "/",
          //   name: "",
          //   // mark: 'oms_orders_approve',
          //   mark: '9107',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     title: "信用额度调查查询"
          //   }
          //   // component: () => import()
          // },
          {
            path: "activityManage",
            name: "activityManage",
            mark: "9111",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "活动管理",

            },
            component: () =>
              import(
                "@/view/system/basicData/activityManage/activityManage.vue"
              )
          },
          {
            path: "/essentialData/clientManagement",
            name: "clientManagement",
            mark: "9112",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "客户管理",

            },
            component: () =>
              import(
                "@/view/system/essentialData/clientManagement/clientManagement.vue"
              )
          },
          {
            path: "/essentialData/clientCredit",
            name: "clientCredit",
            mark: "9113",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "客户信用管理",

            },
            component: () =>
              import(
                "@/view/system/essentialData/customerCredit/customerCredit.vue"
              )
          },
          {
            path: "/essentialData/CreditApproval",
            name: "CreditApproval",
            mark: "9106",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "额度审批数据查询",

            },
            component: () =>
              import(
                "@/view/system/essentialData/CreditApproval/CreditApproval.vue"
              )
          },
          {
            path: "/essentialData/lineOfCredit",
            name: "LineOfCredit",
            // mark: '9114',
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "信用额度调整查询",

            },
            component: () =>
              import(
                "@/view/system/essentialData/lineOfCredit/lineOfCredit.vue"
              )
          },
          {
            path: "/essentialData/supplierManagement/",
            name: "supplierManagement",
            mark: "9108",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "供应商管理",

            },
            component: () =>
              import(
                "@/view/system/essentialData/supplierManagement/supplierManagement.vue"
              )
          },
          {
            path: "/essentialData/logistics",
            name: "essentialDataLogistics",
            mark: "9109",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "物流快递管理",

            },
            component: () =>
              import("@/view/system/essentialData/logistics/logistics.vue")
          },
          // {
          //   path: "/",
          //   name: "",
          //   mark: '9110',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     icon: "arrow-graph-up-right",
          //     title: " 配件替换件"
          //   },
          // component: () =>
          //   import()
          // },
          // {
          //   path: "FittingReplacement",
          //   name: "FittingReplacement",
          //   mark: "58",
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     icon: "arrow-graph-up-right",
          //     title: " 配件替换"
          //   },
          //   component: () => import("@/view/system/basicData/FittingReplacement/FittingReplacement.vue")
          // },
          {
            path: "/system/basicdata/mixture",
            name: "mixtureRatio",
            mark: "9115",
            meta: { keepAlive: true,
              // hideInMenu: true,
              icon: "arrow-graph-up-right",
              title: "配比清单",

            },
            component: () =>
              import("@/view/system/basicData/mixTure/mixtureRatio.vue")
          },
          {
            path: "/lease/dataDictionary/",
            name: "dataDictionary",
            mark: "9116",
            meta: { keepAlive: true,
              icon: "gear-b",
              title: "数据字典",

            },
            component: () =>
              import("@/view/lease/dataDictionary/dataDictionary.vue")
          }
        ]
      },
      {
        path: "",
        name: "marketFrom",
        redirect: "",
        mark: "9200",
        meta: { keepAlive: true,
          title: "系统设置"
        },
        component: parentView,
        children: [
          {
            path: "/system/systemSetting/navigationFater/navigationFater",
            name: "navigationFater",
            mark: "9201",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "初始导航",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/navigationFater/navigationFater.vue"
              )
          },
          {
            path: "/system/systemSetting/navigationFater/sysetmset",
            name: "sysetmset",
            mark: "9204",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "业务参数",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/sysetmset/sysetmset.vue"
              )
          },
          {
            path: "/system/systemSetting/navigationFater/SettlementAccount",
            name: "SettlementAccount",
            mark: "9205",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "结算账户",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/SettlementAccount/SettlementAccount.vue"
              )
          },
          {
            path: "/systemSetting/InitialNavigation/inventory/components",
            name: "inventory",
            mark: '9403',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "期初库存",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/inventory/components/inventory.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/StockLevel/StockLevel",
            name: "StockLevel",
            mark: '9401',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "备货级别设置",

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
            mark: '9209',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "自定义分类设置",

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
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "配件提成",

            }
            // component: () =>
            //   import(
            //     "@/view/system/systemSetting/InitialNavigation/AccessoriesCommission/AccessoriesCommission.vue"
            //   )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/AccessoriesBrand/AccessoriesBrand",
            name: "AccessoriesBrand",
            // mark: '59',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "配件品牌",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/AccessoriesBrand/AccessoriesBrand.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/brandCarModel/brandCar",
            name: "brandCarModel",
            mark: '9208',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "品牌车型",
              activeName: "navigationFater",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/brandCarModel/brandCar.vue"
              )
          },
          {
            path:
              "/system/systemSetting/InitialNavigation/receiptPayment/receiptPayment",
            name: "receiptPayment",
            // mark: '59',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "期初应收应付",

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
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "配件分类",

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
            mark: '9207',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "门店设置",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/storeManagement/storeManagement.vue"
              )
          },
          {
            path: "/systemSetting/InitialNavigation/setWarehouse/setWarehouse",
            name: "setWarehouse",
            mark: '9402',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "仓库设置",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/setWarehouse/setWarehouse.vue"
              )
          },
          {
            path: "/systemSetting/InitialNavigation/setBank",
            name: "setBank",
            mark: '9404',
            meta: { keepAlive: true,
              hideInMenu: true,
              title: "期初现金银行",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/InitialNavigation/setBank/setBank.vue"
              )
          },
          {
            path: "/system/staff/management",
            name: "staffManagement",
            mark: "9202",
            meta: { keepAlive: true,
              // hideInMenu: true,
              title: "员工管理",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/staffManagement/staffManagement.vue"
              )
          },
          {
            path: "/system/outstaff/management",
            name: "outStaffManagement",
            mark: "9206",
            meta: {
              keepAlive: true,
              // hideInMenu: true,
              title: "外部员工管理",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/outStaffManagement/outStaffManagement.vue"
                )
          },
          {
            path: "/accounting",
            name: "accounting",
            // mark: "4002",
            meta: { keepAlive: true,
              icon: "arrow-graph-up-right",
              title: "会计科目管理",

            },
            component: () =>
              import("@/view/financial/accounting/accounting.vue")
          }
          // {
          //   path: "/system/partsExamine",
          //   name: "partsExamine",
          //   // mark: '59',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     title: '配件审核与标定'
          //   },
          //   component: () => import("@/view/system/partsExamine/partsexamine.vue")
          // },
          // {
          //   path: "/",
          //   name: "",
          //   // mark: 'oms_orders_approve',
          //   mark: '9203',
          //   meta: { keepAlive: true,
          //     // hideInMenu: true,
          //     title: "角色权限管理"
          //   }
          //   // component: () => import()
          // }
        ]
      },
      {
        path: "/system/systemSetting/accountInformation/accountInformation",
        name: "allotThree",
        mark: "9301",
        meta: { keepAlive: true,
          //
          title: "基本信息"
        },
        component: parentView,
        children: [
          {
            path: "/system/systemSetting/accountInformation/accountInformation",
            name: "/accountInformation",
            mark: "9301",
            meta: { keepAlive: true,
              //
              title: "基本信息",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/accountInformation/accountInformation.vue"
              )
          },
          {
            path: "/accountInformation/record",
            name: "record",
            // mark: '45',
            meta: { keepAlive: true,
              hideInMenu: true,
              // icon: "gear-b",
              title: "充值消费记录",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/accountInformation/record/record.vue"
              )
          },
          {
            path: "/accountInformation/recharge",
            name: "recharge",
            // mark: '45',
            meta: { keepAlive: true,
              hideInMenu: true,
              icon: "gear-b",
              title: "华币充值",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/accountInformation/recharge/recharge.vue"
              )
          },
          {
            path: "/accountInformation/ProductsBuy",
            name: "ProductsBuy",
            // mark: '45',
            meta: { keepAlive: true,
              hideInMenu: true,
              icon: "gear-b",
              title: "产品购买",

            },
            component: () =>
              import(
                "@/view/system/systemSetting/accountInformation/ProductsBuy/ProductsBuy.vue"
              )
          }
        ]
      },
      {
        path: "/system/systemSetting/template/templateIndex",
        name: "templateIndex",
        mark: "9999",
        meta: { keepAlive: true,
          //
          title: "模板管理",

        },
        component: () =>
          import(
            "@/view/system/systemSetting/template/templateIndex.vue"
          )
      }
    ]
  },
  {
    path: "/lease",
    name: "lease",
    mark: "8",
    meta: { keepAlive: true,
      icon: "ios-transgender",
      title: "租赁管理",

    },
    component: Main,
    children: [
      {
        path: "/lease/register",
        name: "registers",
        mark: "8100",
        meta: { keepAlive: true,
          icon: "",
          title: "注册管理",

        },
        component: () => import("@/view/lease/lease/register.vue")
      },
      {
        path: "/lease/lessee",
        name: "lessee",
        mark: "8101",
        meta: { keepAlive: true,
          icon: "",
          title: "租户管理",

        },
        component: () => import("@/view/lease/lease/lessee.vue")
      },
      // {
      //   path: '/lease/Practice',
      //   name: 'Practice',
      //   // mark: '41',
      //   meta: { keepAlive: true,
      //     icon: '',
      //     title: '练习'
      //   },
      //   component: () => import('@/view/lease/lease/Practice.vue')
      // },
      {
        path: "/lease/product",
        name: "leaseProduct",
        mark: "8102",
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "产品管理",

        },
        component: () => import("@/view/lease/product/prolist.vue")
      },
      {
        path: "/lease/order",
        name: "leaseOrder",
        mark: "8103",
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "订单管理",

        },
        component: () => import("@/view/lease/order/orderlist.vue")
      },
      {
        path: "/lease/tenantres",
        name: "tenantRes",
        mark: "8104",
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "租户资源",

        },
        component: () => import("@/view/lease/tenantres/tenantres.vue")
      },
      // {
      //   path: "/lease/dingTenantres",
      //   name: "dingTenantres",
      //   // mark: "8104",
      //   meta: { keepAlive: true,
      //     icon: "gear-b",
      //     title: "租户配置"
      //   },
      //   component: () => import("@/view/lease/tenantres/tenantres.vue")
      // },
      {
        path: "/lease/FeedbackManagementOne",
        name: "FeedbackManagementOne",
        mark: "8105",
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "反馈管理",

        },
        component: () => import("@/view/lease/lease/FeedbackManagementOne.vue")
      },
      {
        path: "/lease/feedback_management",
        name: "feedback_management",
        // mark: '45',
        meta: { keepAlive: true,
          hideInMenu: true,
          icon: "gear-b",
          title: "反馈管理详情",

        },
        component: () => import("@/view/lease/lease/feedback_management.vue")
      },

      {
        path: "/lease/putlog",
        name: "putlog",
        // mark: 'gpart_oms_policy',
        mark: "8106",
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "发布日志",

        },
        component: () => import("@/view/lease/log/Logput.vue")
      },
      {
        path: "/lease/historylog",
        name: "historylog",
        redirect: "historylog",
        // mark: '8107',
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "历史日志"
        },
        component: parentView,
        children: [
          {
            path: "historylog",
            name: "historylog",
            mark: "8107",
            meta: { keepAlive: true,
              icon: "gear-b",
              title: "历史日志",
              hideInMenu: true,

            },
            component: () => import("@/view/lease/log/historyLog.vue")
          },
          {
            path: "logWebInfo",
            name: "logWebInfo",
            // mark: '46',
            meta: { keepAlive: true,
              icon: "gear-b",
              title: "日志详情",
              hideInMenu: true,

            },
            component: () => import("@/view/lease/log/logWebInfo.vue")
          }
        ]
      },
      {
        path: "/lease/customerServiceManagement",
        name: "customerServiceManagement",
        mark: "8108",
        meta: { keepAlive: true,
          icon: "gear-b",
          title: "客服管理",

        },
        component: () =>
          import(
            "@/view/lease/customerServiceManagement/customerServiceManagement.vue"
          )
      }
    ]
  },
  {
    path: "/gpart_auth_center",
    name: "auth",
    mark: "10",
    redirect: "/multilevel/level_2_1",
    meta: { keepAlive: true,
      icon: "ios-people",
      title: "权限管理"
      // access: []
    },
    component: Main,
    children: [
      {
        path: "/auth/staff",
        name: "staff",
        mark: "10001",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "登录用户",

          // access: ['admin', 'auth_staff']
        },
        component: () => import("@/view/admin/user/user.vue")
      },
      {
        path: "/auth/group",
        name: "group",
        mark: "10002",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "组织管理",

          // access: ['admin', 'auth_staff']
        },
        component: () => import("@/view/admin/group/group.vue")
      },
      {
        path: "/auth/role",
        name: "Role",
        mark: "10003",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "角色管理",

          // access: ['admin', 'auth_staff']
        },
        component: () => import("@/view/admin/roles/roles.vue")
      },
      {
        path: "/auth/roleswms",
        name: "Roleswms",
        mark: "10006",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "wms角色管理",

          // access: ['admin', 'auth_staff']
        },
        component: () => import("@/view/admin/roles/roleswms.vue")
      },
      {
        path: "/auth/lessee",
        name: "AuthLessee",
        mark: "10005",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "租户模板",

        },
        component: () => import("@/view/admin/lessee/lessee.vue")
      },
      {
        path: "/auth/resource",
        name: "resource",
        mark: "10004",
        meta: { keepAlive: true,
          icon: "arrow-graph-up-right",
          title: "资源管理",

        },
        component: () => import("@/view/admin/resource/resource.vue")
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

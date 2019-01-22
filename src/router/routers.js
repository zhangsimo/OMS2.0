import Main from '@/view/base/main'
import parentView from '@/components/parent-view'

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
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/base/login/login.vue')
  },
  {
    path: '/',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true,
      title:'首页'
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          notCache: true,
          icon:'home',
          title:'首页'
        },
        component: () => import('@/view/base/home/home.vue')
      }
    ]
  },
  {
    path: '',
    name: 'goods',
    // mark: 'gpart_oms_goods',
    redirect: '/multilevel/level_2_1',
    meta: {
      icon: 'cube',
      title: '商品管理'
    },
    component: Main,
    children: [
      {
        path: '/goods/goodsList',
        name: 'goodsList',
        // mark: 'oms_goods_info',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '商品信息'
        },
        component: () => import('@/view/business/goods/goodsList.vue')
      },
      {
        path: '/goods/categoryList',
        name: 'categoryList',
        // mark: 'oms_goods_category',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '商品分类'
        },
        component: () => import('@/view/business/goods/categoryList.vue')
      },
      {
        path: '/goods/supplierList',
        name: 'supplierList',
        // mark: 'oms_goods_category',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '供应商信息'
        },
        component: () => import('@/view/business/goods/supplierList.vue')
      },
      {
        path: '/goods/supplySkuList',
        name: 'supplySkuList',
        // mark: 'oms_goods_category',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '直供商品'
        },
        component: () => import('@/view/business/goods/supplierSkuList.vue')
      },
      {
        path: '/goods/brandList',
        name: 'brandList',
        // mark: 'oms_goods_brand',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '品牌信息'
        },
        component: () => import('@/view/business/goods/brandList.vue')
      },
      {
        path: '/goods/barcodeList',
        name: 'barcodeList',
        // mark: 'oms_goods_barcode',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '条码管理'
        },
        component: () => import('@/view/business/goods/barcodeList.vue')
      },
      {
        path: '/goods/specificationsList',
        name: 'specificationsList',
        // mark: 'oms_goods_specifications',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '规格管理'
        },
        component: () => import('@/view/business/goods/specificationsList.vue')
      },
      {
        path: '/goods/priceList',
        name: 'priceList',
        // mark: 'oms_goods_price',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '价格管理'
        },
        component: () => import('@/view/business/goods/priceList.vue')
      },
      {
        path: '/goods/goodsSync',
        name: 'goodsSync',
        // mark: 'oms_goods_sync',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '商品同步'
        },
        component: () => import('@/view/business/goods/goodsSync.vue')
      }
    ]
  },
  {
    path: '',
    name: 'orders',
    // mark: 'gpart_oms_orders',
    redirect: '/multilevel/level_2_1',
    meta: {
      // hideInMenu: true,
      icon: 'ios-paper',
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: '/orders/orderApprove',
        name: 'orderApprove',
        // mark: 'oms_orders_approve',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '订单审核'
        },
        component: () => import('@/view/business/orders/orderApprove.vue')
      },
      {
        path: '/orders/orderLink',
        name: 'orderLink',
        // mark: 'oms_orders_link',
        meta: {
          hideInMenu: true,
          icon: 'arrow-graph-up-right',
          title: '订单链路'
        },
        component: () => import('@/view/business/orders/orderLink.vue')
      },
      {
        path: '/orders/directOrder',
        name: 'directOrder',
        // mark: 'oms_orders_link',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '定向订单'
        },
        component: () => import('@/view/business/orders/directOrder.vue')
      },
      {
        path: '/orders/mallOrder',
        name: 'mallOrder',
        // mark: 'oms_orders_link',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '电商转单'
        },
        component: () => import('@/view/business/orders/mallOrder.vue')
      },
      {
        path: '/orders/supplierOrder',
        name: 'supplierOrder',
        // mark: 'oms_orders_link',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '直供订单'
        },
        component: () => import('@/view/business/orders/supplierOrder.vue')
      },
      {
        path: '/orders/storeOrder',
        name: 'storeOrder',
        // mark: 'oms_orders_link',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '门店订单'
        },
        component: () => import('@/view/business/orders/storeOrder.vue')
      },
      {
        path: '/orders/inquiryOrder',
        name: 'inquiryOrder',
        // mark: 'oms_orders_link',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '询价订单'
        },
        component: () => import('@/view/business/orders/inquiryOrder.vue')
      },
      {
        path: '/orders/inquiryBackOrder',
        name: 'inquiryBackOrder',
        // mark: 'oms_orders_link',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '报价回单'
        },
        component: () => import('@/view/business/orders/inquiryBackOrder.vue')
      }
    ]
  },
  {
    path: '',
    name: 'policy',
    // mark: 'gpart_oms_policy',
    meta: {
      hideInMenu: true,
      icon: 'ios-toggle',
      title: '策略管理'
    },
    component: Main,
    children: [
      {
        path: '/policy/approvePolicy',
        name: 'approvePolicy',
        // mark: 'oms_policy_approve',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '审核策略'
        },
        component: () => import('@/view/business/policy/approvePolicy.vue')
      },
      {
        path: '/policy/purchasePolicy',
        name: 'purchasePolicy',
        // mark: 'oms_policy_purchase',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '采购策略'
        },
        component: () => import('@/view/business/policy/purchasePolicy.vue')
      },
      {
        path: '/policy/smsPolicy',
        name: 'smsPolicy',
        // mark: 'oms_policy_sms',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '短信策略'
        },
        component: () => import('@/view/business/policy/smsPolicy.vue')
      }
    ]
  },
  {
    path: '',
    name: 'baseSetting',
    // mark: 'gpart_oms_policy',
    meta: {
      icon: 'gear-b',
      title: '门店管理'
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
        path: '/baseSetting/storeArea',
        name: 'storeArea',
        // mark: 'oms_policy_approve',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '极配门店管理'
        },
        component: () => import('@/view/business/baseSetting/storeArea.vue')
      },
      {
        path: '/baseSetting/hsStoreSupplier',
        name: 'hsStoreSupplier',
        // mark: 'oms_policy_approve',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '华胜门店管理'
        },
        component: () => import('@/view/business/baseSetting/hsStoreSupplier.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/base/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/base/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/base/error-page/404.vue')
  }
]

// 引入依赖组件
// const CloudPlatformDataStatis = import('@/views/cloudPlatformDataStatis')
const EchartsMap = () => import('@/views/cloudPlatformDataStatis/echartsMap/index') // 平台数据统计可视化 ECharts 显示
const DataStatisticsList = () => import('@/views/cloudPlatformDataStatis/dataStatisticsList/index') // 平台数据统计清单
// const Tarea = () => import('@/views/cloudPlatformDataStatis/dataStatisticsList/area') // 平台数据统计清单
// const Tsales = () => import('@/views/cloudPlatformDataStatis/dataStatisticsList/sales') // 平台数据统计清单
// const Tschool = () => import('@/views/cloudPlatformDataStatis/dataStatisticsList/school') // 平台数据统计清单
// const Twarehouse = () => import('@/views/cloudPlatformDataStatis/dataStatisticsList/warehouse') // 平台数据统计清单
// 云平台数据统计和 数据可视化
const CloudPlatformDataStatisRouterMap = [
  {
    path: 'echartsMap',
    name: 'echartsMap',
    component: EchartsMap,
    meta: { title: '数据统计ES', icon: 'fa fa-gg ' }
  },
  {
    path: 'dataStatisticsList',
    name: 'dataStatisticsList',
    component: DataStatisticsList,
    meta: { title: '数据统计清单', icon: 'fa fa-gg ' }

  }
]
export default CloudPlatformDataStatisRouterMap
/*
children: [
      {
        path: 'area',
        name: 'area',
        component: Tarea,
        hide: true,
        meta: { title: '地区', icon: 'fa fa-gg ' }
      },
      {
        path: 'school',
        name: 'school',
        component: Tschool,
        meta: { title: '学校', icon: 'fa fa-gg ' }
      },
      {
        path: 'sales',
        name: 'sales',
        component: Tsales,
        meta: { title: '销量统计', icon: 'fa fa-gg ' }
      },
      {
        path: 'warehouse',
        name: 'warehouse',
        component: Twarehouse,
        meta: { title: '仓库流量', icon: 'fa fa-gg ' }
      }
    ]

*/

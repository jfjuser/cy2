/*
*@Author: lyf
*@Date: 2018-09-21 09:34:49
 * @Last Modified by: lyf
 * @Last Modified time: 2018-09-21 09:36:05
*/

// --------------- 功能开通 ---------\\
export const FunctionOpenRouterMap = [
  {
    path: 'open',
    name: 'open',
    component: () => import('@/views/functionOpen/open/index'),
    meta: { title: '扩展功能', icon: 'fa fa-suitcase', noCache: true }
  }
]

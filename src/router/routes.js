const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/ItemList.vue') },
      { path: '/star', component: () => import('src/pages/LikeItem.vue') },
      { path: '/todoItems', component: () => import('src/pages/TodoItems.vue') },
      { path: '/help', component: () => import('src/pages/HelpInfo.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

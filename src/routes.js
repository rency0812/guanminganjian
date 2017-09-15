import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
import ForgetView from './components/Forgot.vue'
import ResetView from './components/Reset.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashMainView from './components/views/dash/Main.vue'

import SCReportTableView from './components/views/reports/ReportTable'
import SCReportDeatilView from './components/views/reports/ReportDetail'
import SCReportCategoryView from './components/views/reports/ReportCategory.vue'

import SCUserTableView from './components/views/users/UserTable.vue'
import SCUserAddFormView from './components/views/users/UserAddForm'
import SCUserDetailView from './components/views/users/UserDetails.vue'
import SCUserLabelManage from './components/views/users/UserLabelManage.vue'
import SCUserRoleView from './components/views/users/UserRole.vue'

import SCArticleTableView from './components/views/cms/ArticleTable'
import SCArticleAddFormView from './components/views/cms/ArticleAddForm.vue'
import SCArticleDetailView from './components/views/cms/ArticleDetail.vue'
import SCArticleCategoryManageView from './components/views/cms/ArticleCategoryManage.vue'

import SCNotifyTableView from './components/views/notify/NotifyTable.vue'
import SCNotifyAddFormView from './components/views/notify/NotifyAddForm.vue'
import SCNotifyInfoView from './components/views/notify/NotifyInfo'

import SCFirmTableView from './components/views/firm/FirmTable.vue'
import SCFirmDetailView from './components/views/firm/FirmDetail.vue'

import SCWxUserTableView from './components/views/wxusers/WxUserTable.vue'
import SCWxUserTagAddView from './components/views/wxusers/AddUserTag.vue'
import SCWxUserLinkView from './components/views/wxusers/WxLinkUser.vue'
import SCWxUserTagTableView from './components/views/wxusers/WxTagTable.vue'
import SCWxTagUserListView from './components/views/wxusers/WxTagUserInfo.vue'
import SCWxUserProfileView from './components/views/wxusers/WxUserProfile.vue'

import SCAdvertisementPoints from './components/views/wxadvertisement/advertisementPoints.vue'
import SCAddPoints from './components/views/wxadvertisement/pointsPage/AddPoint.vue'
import SCEditPoints from './components/views/wxadvertisement/pointsPage/EditPoint.vue'
import SCPointDetail from './components/views/wxadvertisement/pointsPage/PointDetail.vue'
import SCAdvertisementContent from './components/views/wxadvertisement/advertisementContent.vue'
import SCAdvertisementDetail from './components/views/wxadvertisement/contentPage/AdvertisementDetail.vue'
import SCAddAdvertisement from './components/views/wxadvertisement/contentPage/AddAdvertisement.vue'
import SCEditAdvertisement from './components/views/wxadvertisement/contentPage/EditAdvertisement.vue'

import SCMenuTree from './components/views/menulist/MenuTree.vue'
import SCMenuLink from './components/views/menulist/MenuJurisdiction.vue'

import SCDictTableView from './components/views/dict/DictTable.vue'
import SCDictElTableView from './components/views/dict/DictElTable.vue'

import SCRoleTableView from './components/views/characters/RoleTable.vue'
import SCRoleUserTableView from './components/views/characters/RoleUserTable.vue'
import SCRoleLinkUserTableView from './components/views/characters/RoleLinkUserTable.vue'
import SCRoleLinkAuthTableView from './components/views/characters/LinkAuth.vue'

import SCOrgaTreeView from './components/views/organization/OrgaTree.vue'
import SCDutyListView from './components/views/organization/DutyList.vue'
import SCDutyUnrelatedView from './components/views/organization/DutyUnrelated.vue'

import SCPersonalTable from './components/views/personal/PersonalTable.vue'
import SCPersonalDetail from './components/views/personal/PersonalDetail.vue'

import SCDutyManageView from './components/views/duty/DutyManage.vue'

import SCAuthTableView from './components/views/auth/AuthTable.vue'
import SCAuthRoleView from './components/views/auth/LinkRole.vue'
import SCAuthMenuView from './components/views/auth/LinkMenu.vue'

const routes = [
  {
    path: '/login',
    component: LoginView
  }, {
    path: '/forgot',
    component: ForgetView
  }, {
    path: '/reset',
    component: ResetView
  }, {
    path: '/',
    component: DashMainView,
    redirect: '/admin/index'
  }, {
    path: '/admin',
    component: DashView,
    redirect: '/admin/index',
    children: [
      {
        path: 'index',
        component: DashMainView,
        name: '光明安监'
      }, {
        // User Module
        path: 'user',
        component: DashMainView,
        redirect: '/admin/user/index',
        name: '用户',
        meta: { description: '后台用户' },
        children: [{
          path: 'index',
          component: SCUserTableView,
          name: '后台用户',
          meta: { description: '后台用户列表' }
        }, {
          path: 'detail',
          component: SCUserDetailView,
          name: '后台用户详情',
          meta: { description: '后台用户详情' }
        }, {
          path: 'role',
          component: SCUserRoleView,
          name: '后台用户角色管理',
          meta: { description: '后台用户角色' }
        }, {
          path: 'add',
          component: SCUserAddFormView,
          name: '添加后台用户',
          meta: { description: '添加后台用户' }
        }]
      }, {
        // Report Module
        path: 'report',
        component: DashMainView,
        redirect: '/admin/report/index',
        name: '安全隐患',
        meta: { description: '安全隐患案件' },
        children: [{
          path: 'index',
          component: SCReportTableView,
          name: '安全隐患管理',
          meta: { description: '安全隐患案件列表' }
        }, {
          path: 'detail',
          component: SCReportDeatilView,
          name: '安全隐患详情',
          meta: { description: '安全隐患案件详情' }
        }, {
          path: 'category',
          component: SCReportCategoryView,
          name: '安全隐患分类管理',
          meta: { description: '安全隐患分类详情' }
        }]
      }, {
        // Article Module
        path: 'article',
        component: DashMainView,
        redirect: '/admin/article/index',
        name: '文章管理',
        meta: { description: '文章管理' },
        children: [{
          path: 'index',
          component: SCArticleTableView,
          name: '文章列表',
          meta: { description: '文章管理列表' }
        }, {
          path: 'add',
          component: SCArticleAddFormView,
          name: '文章添加',
          meta: { description: '添加文章' }
        }, {
          path: 'detail',
          component: SCArticleDetailView,
          name: '文章详情',
          meta: { description: '文章详情' }
        }, {
          path: 'category',
          component: SCArticleCategoryManageView,
          name: '文章板块管理',
          meta: { description: '文章板块管理' }
        }]
      }, {
        // Notify Template Module
        path: 'notify',
        component: DashMainView,
        redirect: '/admin/notify/index',
        name: '消息通知',
        meta: { description: '消息通知' },
        children: [{
          path: 'index',
          component: SCNotifyTableView,
          name: '消息通知管理',
          meta: { description: '消息通知列表' }
        }, {
          path: 'add',
          component: SCNotifyAddFormView,
          name: '消息通知添加',
          meta: { description: '消息通知添加' }
        }, {
          path: 'info',
          component: SCNotifyInfoView,
          name: '消息通知明细',
          meta: { description: '消息通知明细' }
        }]
      }, {
        // Firm Module
        path: 'firm',
        component: DashMainView,
        redirect: '/admin/firm/index',
        name: '企业信息管理',
        meta: { description: '企业信息上报' },
        children: [{
          path: 'index',
          component: SCFirmTableView,
          name: '企业信息列表',
          meta: { description: '企业信息列表' }
        }, {
          path: 'detail',
          component: SCFirmDetailView,
          name: '企业信息详情',
          meta: { description: '企业信息详情' }
        }]
      }, {
        // WxUser Module
        path: 'wxuser',
        component: DashMainView,
        redirect: '/admin/wxuser/index',
        name: '微信用户',
        meta: { description: '微信用户' },
        children: [{
          path: 'index',
          component: SCWxUserTableView,
          name: '微信用户管理',
          meta: { description: '微信用户列表' }
        }, {
          path: 'tag',
          component: SCWxUserTagTableView,
          name: '微信用户标签组管理',
          meta: { description: '微信用户标签组' }
        }, {
          path: 'add',
          component: SCWxUserTagAddView,
          name: '微信用户标签组添加',
          meta: { description: '微信用户标签组添加' }
        }, {
          path: 'link',
          component: SCWxUserLinkView,
          name: '标签组关联微信用户',
          meta: { description: '关联微信用户标签组' }
        }, {
          path: 'user',
          component: SCWxTagUserListView,
          name: '标签微信用户信息管理',
          meta: { description: '微信用户标签组' }
        }, {
          path: 'profile',
          component: SCWxUserProfileView,
          name: '微信用户详情',
          meta: { description: '微信用户详情' }
        }]
      }, {
        // Auth Module
        path: 'auth',
        component: DashMainView,
        redirect: '/admin/auth/index',
        name: '权限管理',
        meta: { description: '权限管理' },
        children: [{
          path: 'index',
          component: SCAuthTableView,
          name: '权限列表',
          meta: { description: '权限列表管理' }
        }, {
          path: 'role',
          component: SCAuthRoleView,
          name: '权限关联角色管理',
          meta: { description: '权限关联角色' }
        }, {
          path: 'menu',
          component: SCAuthMenuView,
          name: '权限关联菜单管理',
          meta: { description: '权限关联菜单' }
        }]
      }, {
        // Role Module
        path: 'role',
        component: DashMainView,
        redirect: '/admin/role/index',
        name: '角色管理',
        meta: { description: '角色管理' },
        children: [{
          path: 'index',
          component: SCRoleTableView,
          name: '角色列表管理',
          meta: { description: '角色管理列表' }
        }, {
          path: 'user',
          component: SCRoleUserTableView,
          name: '角色用户列表管理',
          meta: { description: '角色用户列表详情' }
        }, {
          path: 'link',
          component: SCRoleLinkUserTableView,
          name: '角色关联用户列表',
          meta: { description: '角色关联用户列表详情' }
        }, {
          path: 'auth',
          component: SCRoleLinkAuthTableView,
          name: '角色权限管理',
          meta: { description: '角色关联权限详情' }
        }]
      }, {
        // Dict Module
        path: 'dict',
        component: DashMainView,
        redirect: '/admin/dict/index',
        name: '字典管理',
        meta: { description: '字典管理' },
        children: [{
          path: 'index',
          component: SCDictTableView,
          name: '字典列表管理',
          meta: { description: '字典列表' }
        }, {
          path: 'element',
          component: SCDictElTableView,
          name: '字典元素管理',
          meta: { description: '字典元素列表' }
        }]
      }, {
        // Menu Module
        path: 'menu',
        component: DashMainView,
        redirect: '/admin/menu/index',
        name: '菜单管理',
        meta: {description: '后台菜单'},
        children: [{
          path: 'index',
          component: SCMenuTree,
          name: '后台菜单管理',
          meta: { description: '后台菜单' }
        }, {
          path: 'auth',
          component: SCMenuLink,
          name: '菜单权限管理',
          meta: {description: '菜单关联权限管理'}
        }]
      }, {
        // Organization Module
        path: 'organization',
        component: DashMainView,
        redirect: '/admin/organization/index',
        name: '组织管理',
        meta: {description: '组织管理'},
        children: [{
          path: 'index',
          component: SCOrgaTreeView,
          name: '组织列表管理',
          meta: { description: '组织列表管理' }
        }, {
          path: 'duty',
          component: SCDutyListView,
          name: '组织职位管理',
          meta: { description: '组织职位管理' }
        }, {
          path: 'link',
          component: SCDutyUnrelatedView,
          name: '组织关联职位',
          meta: { description: '组织职位管理' }
        }]
      }, {
        // Duty Module
        path: 'duty',
        component: DashMainView,
        redirect: '/admin/duty/index',
        name: '职位',
        meta: { description: '职位管理' },
        children: [{
          path: 'index',
          component: SCDutyManageView,
          name: '职位管理',
          meta: { description: '职位管理详情' }
        }]
      }, {
        // Personal Module
        path: 'personal',
        component: DashMainView,
        redirect: '/admin/personal/index',
        name: '个人信息上报',
        meta: { description: '职位管理' },
        children: [{
          path: 'index',
          component: SCPersonalTable,
          name: '个人信息管理',
          meta: { description: '个人信息上报管理' }
        }, {
          path: 'detail',
          component: SCPersonalDetail,
          name: '个人信息详情',
          meta: { description: '个人信息上报详情' }
        }]
      }, {
        path: 'userlabelmanage',
        component: SCUserLabelManage,
        name: '用户标签组管理',
        meta: { description: '管理信息' }
      }, {
        path: 'advpoint',
        component: SCAdvertisementPoints,
        name: '广告点位管理',
        meta: {description: '列表'}
      }, {
        path: 'addpoint',
        component: SCAddPoints,
        name: '新增广告点位',
        meta: {description: '新增'}
      }, {
        path: 'editpoint',
        component: SCEditPoints,
        name: '广告点位修改',
        meta: {description: '修改'}
      }, {
        path: 'pointdetail',
        component: SCPointDetail,
        name: '广告点位详情',
        meta: {description: '详情'}
      }, {
        path: 'advertisementcontent',
        component: SCAdvertisementContent,
        name: '广告列表',
        meta: {description: '管理'}
      }, {
        path: 'advertisementdetail',
        component: SCAdvertisementDetail,
        name: '广告列表详情页',
        meta: {description: '详情页'}
      }, {
        path: 'addadvertisement',
        component: SCAddAdvertisement,
        name: '广告列表新增',
        meta: {description: '新增'}
      }, {
        path: 'editadvertisement',
        component: SCEditAdvertisement,
        name: '广告列表修改',
        meta: {description: '修改'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes

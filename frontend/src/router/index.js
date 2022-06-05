import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import FeedPage from '@/components/FeedPage.vue'
import Profile from '@/components/Profile.vue'
import Comments from '@/components/Comments.vue'
import Connections from '@/components/Connections.vue'
import Notifications from '@/components/Notifications.vue'
import Contests from '@/components/Contest.vue'
import ContestPage from '@/components/ContestPage.vue'
import Group from '@/components/Group.vue'
import GroupFeeds from '@/components/GroupFeeds.vue'
import PlayLists from '@/components/PlaylistLists.vue'

import Admin from '@/components/Admin.vue'
import AdminPanel from '@/components/admin/App.vue'
import AdminLogin from '@/components/admin/Login.vue'
import AdminDashboard from '@/components/admin/Dashboard.vue'

/*eslint-disable*/

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Home,
        children: [
           {
                alias: '/profile/:stageName/:userId',
                path: '/Profile',
                name: 'Profile',
                props: true,
                component: Profile,
            }, {
                path: '/home',
                name: 'Feedpage',
                component: FeedPage
            },
            {
                path: '/connections',
                name: 'Connections',
                component: Connections,
                props: true,
                alias: '/connections/connection/:connectionId'
            },
            {
                path: '/notifications',
                name: 'Notifications',
                component: Notifications
            },
            {
                path: '/contests',
                name: 'Contests',
                component: Contests
            },
            {
              path: '/groups',
              name: 'Groups',
              component: Group
            },
            {
              path: '/group-feeds/:groupId',
              name: 'GroupFeeds',
              component: GroupFeeds
            },
            {
              path: '/playlists/:playlistId',
              name: 'PlayLists',
              component: PlayLists
            },
            {
                path: '/contest/page/details/:contestId',
                name: 'ContestPage',
                component: ContestPage
            },
            {
              path: '/comments/:postId',
              name: 'Comments',
              props: true,
              component: Comments
            }
        ]
    },
    {
        path: '/',
        name: 'Login',
        component: Login,
        alias: '/login'
    },
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router

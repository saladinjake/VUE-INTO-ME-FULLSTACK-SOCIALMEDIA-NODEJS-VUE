<template id="">
  <div>
    <!-- Aside Start-->
    <!-- class="left-panel hide-on-med-and-down" -->
    <aside :class="[openSidebar ? 'left-panel' : 'left-panel hide-on-med-and-down' ]" style="z-index: 1111 !important;">
      <!-- brand -->
      <div class="logo">
        <a href="index-2.html" class="logo-expanded">
          <router-link :to="{ name: 'AdminDashboard' }">
            <img style="height:50px" src="../../assets/logo.png" />
          </router-link>
        </a>
      </div>
      <!-- / brand -->
      <!-- Navbar Start -->
      <nav class="navigation">
        <ul class="">
          <li class="dashboard-link has-submenu"><router-link :to="{ name: 'AdminDashboard' }"><i class="ion-home"></i> <span class="nav-label"><i class="fas fa-home"></i> Dashboard</span></router-link>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminUsers', params: { type: 'default' } }"><i class="fas fa-user"></i> Manage Users</router-link>
            <ul role="menu" class="dropdown-menu"></ul>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminPosts' }"><i class="fas fa-blog"></i> Manage Posts</router-link>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminContest' }"><i class="fas fa-blog"></i> Contest & Win</router-link>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminCategory', params: { category: 'forums' } }"><i class="fas fa-list"></i> Manage Category</router-link>
          </li>
          <li class="has-submenu">
            <a data-toggle="dropdown" class="dropdown-toggle" href="#"><i class="fas fa-envelope"></i> Communication <span class="caret"></span></a>
            <ul role="menu" class="dropdown-menu">
              <li><router-link :to="{ name: 'AdminInbox' }">Inbox</router-link></li>
              <li><router-link :to="{ name: 'AdminMessenger', params: { email: 'default' } }">Send Message</router-link></li>
            </ul>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminGroups' }"><i class="fas fa-user"></i> Groups</router-link>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminTransactions' }"><i class="fas fa-wallet"></i> Transactions</router-link>
          </li>
          <li class="has-submenu">
            <a data-toggle="dropdown" class="dropdown-toggle" href="#"><i class="fas fa-tag"></i> Advert <span class="caret"></span></a>
            <ul role="menu" class="dropdown-menu">
              <li><router-link :to="{ name: 'AdminAdvert' }">Manage Advert</router-link></li>
              <li><router-link :to="{ name: 'AdvertSettings' }">Advert Settings</router-link></li>
            </ul>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminContinents' }"><i class="fa fa-map"></i> Location </router-link>
          </li>
          <li class="has-submenu">
            <router-link :to="{ name: 'AdminSettings' }"><i class="fas fa-cog"></i> Settings</router-link>
          </li>
        </ul>
      </nav>
      <!-- Navbar Start -->
    </aside>
    <!-- Aside Ends-->
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import eventBus from '@/mixins/EventsMixins';
  export default {
    data() {
      return {
        openSidebar: false
      }
    },
    mounted() {
      const ___this = this;
      eventBus.$on('openSidebar', function (status) {
        ___this.openSidebar = status;
        console.log(this.openSidebar);
      });
    }
  }
</script>

<style scoped>
  nav {
    background: none !important;
    border-bottom: 1px solid transparent;
    box-shadow: none !important;
  }
  nav ul li {
    vertical-align: middle;
  }
  aside ul li,
  aside ul li a:hover {
    background: none;
  }
  aside ul li {
    margin: -8% 10px;
  }
  .active {
    background: none;
  }
  aside {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .logo img {
    width: 95%;
  }
  .dashboard-link {
    margin-left: -8%;
  }
  .dropdown-menu li {
    margin-top: 2px;
    margin-left: -15%;
    margin-bottom: 2px;
  }
  .dropdown-menu li a {
    color: white;
  }
  aside::-webkit-scrollbar {
    width: 0.5em;
  }

  aside::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px black;
  }
</style>

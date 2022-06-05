<template>
  <div>
    <!-- Header -->
    <header class="top-head container-fluid">
      <button type="button" @click="openMobileNavigation(true)" class="navbar-toggle pull-left hide-on-med-and-up">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>

      <!-- Search -->
      <form role="search" class="navbar-left app-search pull-left hidden-xs">
        <v-text-field
          label="Outlined"
          placeholder="Search"
          type="text"
          single-line
          solo
        ></v-text-field>
      </form>

      <!-- Right navbar -->
      <ul class="list-inline navbar-right mobile-dropdown-menu-admin top-menu top-right-menu">
        <!-- user login dropdown start-->
        <li class="dropdown text-center">
          <a data-toggle="dropdown" class="dropdown-toggle" href="#">
            <span class="username" style="color: white !important; display: inline-flex;">{{ fetchAdminStore.userName }}</span> <span class="caret"></span>
          </a>
          <ul class="dropdown-menu extended pro-menu fadeInUp animated" tabindex="5003" style="overflow: hidden; outline: none;">
            <li><a href="javascript:void(0)"><i class="fa fa-briefcase"></i> My Profile</a></li>
            <li><a href="javascript:void(0)" @click.prevent="logout()"><b style="color: maroon;">Log Out</b></a></li>
          </ul>
        </li>
        <!-- user login dropdown end -->
      </ul>
      <!-- End right navbar -->
      <ul class="mobile-admin-nav-logo">
        <li v-if="!sidebarStatus" class="hide-on-med-and-up">
           <div class="logo">
            <a href="javascript:void(0)" class="logo-expanded">
              <router-link :to="{ name: 'AdminDashboard' }">
                <img style="height:50px" src="../../assets/logo.png" />
              </router-link>
            </a>
          </div>
        </li>
        <li class="close-sidebar-mobile-admin-menu" @click="openMobileNavigation(false)" v-if="sidebarStatus">
          <a href="javascript:void(0)" @click="openMobileNavigation(false)">
            <i class="fas fa-times" style="color: red;"></i>
          </a>
        </li>
      </ul>

    </header>
    <!-- Header Ends -->
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import eventBus from '@/mixins/EventsMixins';

  export default {
    data() {
      return {
        sidebarStatus: false
      }
    },
    created () {
    },
    computed: {
      fetchAdminAuth() {
        return this.$store.getters.fetchAdminAuth;
      },
      fetchAdminStore() {
        return this.$store.getters.fetchAdminStore;
      }
    },
    mounted() {
      this.$store.dispatch('callLocalAdminStore');
    },
    methods: {
      logout() {
        this.$store.dispatch('resetAdminStore');
        setTimeout(() => {
          this.$router.push({
            name: 'AdminLogin'
          });
        });
      },
      openMobileNavigation(status) {
        this.sidebarStatus = status;
        eventBus.$emit('openSidebar', status);
      }
    }
  }
</script>

<style media="screen">
.top-head {
  background: transparent !important;
}
.app-search {
  width: 35%;
  margin-left: 3%;
}
.top-right-menu {
  margin-top: 1%;
}
.top-right-menu span {
  font-weight: bold;
}
.top-right-menu a {
  text-decoration: none !important;
}
a {
  text-decoration: none !important;
}

@media (min-width: 320px) {
  .mobile-admin-nav-logo img{
    margin-top: -23% !important;
    margin-left: 55%;
  }
  .mobile-dropdown-menu-admin .dropdown {
    margin-top: -1%;
  }
  .mobile-dropdown-menu-admin .dropdown  span {
    font-size: 105% !important;
  }
  .mobile-dropdown-menu-admin .dropdown :hover {
    background: transparent !important;
  }
  .top-head {
    background: black;
  }
  .navbar-toggle:hover {
    background: transparent !important;
  }
  .close-sidebar-mobile-admin-menu {
    color: red;
    margin-top: 2px;
    margin-right: 17px;
    float: right;
    font-size: 145%;
  }
}
</style>

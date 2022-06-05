<template>
  <div class="top-body">
    <div class="body">
      <!-- <img @click="home" class="logo" src="../assets/logo.png"/> -->
      <router-link to="/">
        <img class="logo" src="../assets/logo.png" style="width: 95%; height: 95%;" />
      </router-link>
      <input class="input browser-default" @keypress.enter="doSearch()" v-model="query" type="text" placeholder="search" style="font-family:Arial,FontAwesome" />
      <router-link to="/home" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/home-icon.png" />
          </div>Home
        </div>
      </router-link>
      <router-link to="/contests" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/win-icon.png" />
          </div>WiN <small v-if="contestStatus" style="background: red; border-radius: 50px; width: 50px; height: 22px; vertical-align: middle; position: absolute; left: 53%; top: 2%; padding: 3px; color: white;">Ongoing</small>
        </div>
      </router-link>
      <router-link to="/groups" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/create-group-icon.png" />
          </div>
          <div class="create-group-text">Create Group</div>
        </div>
      </router-link>
      <router-link to="/connections" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/make-connections-icon.png" />
          </div>Make Connections <small v-if="navNotifications.connections > 0" style="background: red; border-radius: 50px; width: 22px; height: 22px; vertical-align: middle; position: absolute; left: 67%; top: 2%; padding: 3px; color: white;">{{ navNotifications.connections }}</small>
        </div>
      </router-link>
      <a @click.prevent="openChatBox()" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/messages-icon.png" />
          </div>Messages
        </div>
      </a>
      <router-link to="/notifications" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/notifications-icon.png" />
          </div>Notifications <small v-if="navNotifications.notifications > 0" style="background: red; border-radius: 50px; width: 22px; height: 22px; vertical-align: middle; position: absolute; left: 80%; top: 2%; padding: 3px; color: white;">{{ navNotifications.notifications }}</small>
        </div>
      </router-link>
      <router-link to="/home" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/app-download-icon.png" />
          </div>
          <div class="app-download-text">Apps Download</div>
        </div>
      </router-link>
      <router-link to="/" class="link">
        <div class="home">
          <div class="iconx">
            <img src="../assets/settings-icon.png" />
          </div>Settings
        </div>
      </router-link>
    </div>
  </div>

</template>

<script>
/*eslint-disable*/
  import axios from 'axios'
  import eventBus from '@/mixins/EventsMixins'

  export default {
    props: {
      navNotifications: {
        type: Object,
        required: true
      }
    },
    async mounted() {
      this.$store.dispatch("callLocalStore");

      await this.checkContest();
    },
    computed: {
      fetchAuthState() {
        return this.$store.getters.fetchAuthStore;
      },
      fetchUserState() {
        return this.$store.getters.fetchUserStore;
      }
    },
    methods: {
      logout() {
        console.log('logout')
        this.$router.push({ path: '/' })
      },
      home() {
        this.$router.push({ path: '/home' })
      },
      async checkContest() {
        try {
          let checkContestValue = await axios.get(this.$baseUrl + '/check/contest', {
            headers: {
              Accept: 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (checkContestValue.status == 200) {
            let contestStatus = checkContestValue.data.data[0];
            if (contestStatus.status) {
              this.contestStatus = true;
              return;
            }

            this.contestStatus = false;
            return;
          }
        } catch (e) {
          this.contestStatus = false;
          return;
        }
      },
      openChatBox () {
        eventBus.$emit('open-chat-container', null);
      },
      async doSearch() {
        // Do The Search && Send The Data Property To The Required Handler...
        await axios.get(this.$baseUrl + '/user/search/' + this.query, {
          headers: {
             Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }).then((success) => {
          console.log(success);
        }).catch ((e) => {
          console.log(e);
        })
      }
    },
    data() {
      return {
        contestStatus: false,
        searchType: 'users',
        query: '',
        searchObject: {
          users: [],
          posts: []
        }
      }
    }
  }

</script>

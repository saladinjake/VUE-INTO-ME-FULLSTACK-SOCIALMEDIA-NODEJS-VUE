<template>
  <div>
    <div class="nav-background">
      <nav class="transparent mobile-nav-view z-depth-0 hide-on-large-only">
        <img class="logo paddingo-top-logo" src="../assets/logo.png" />
        <a href="#" data-target="mobile-demo" class="sidenav-trigger">
          <i class="material-icons">menu</i>
        </a>
        <!-- <TopNav class="toppy hide-on-med-and-down"></TopNav> -->
      </nav>
    </div>
    <TopNav class="toppy hide-on-med-and-down" :navNotifications="notifications"></TopNav>
    <ul class="sidenav" id="mobile-demo">
      <div class="side-nav-items">
        <div class="account-info-text">Account Info</div>
        <div class="thin-line-feed"></div>
        <div class="avatar-mobile">
          <img @click="profile()" class="avatar-mob" src="../assets/u1.jpg" />
          <div @click="showModal('new')">
            <i class="fa fa-plus-circle fa-lg" aria-hidden="true"></i>
          </div>
        </div>
        <div class="name-mobile">{{fetchUserState.firstName}} {{fetchUserState.lastName}}</div>
        <div class="profession-mobile">{{fetchUserState.skills || 'No Skills To Show'}}</div>
        <div class="connect-fanbase">
          <div class="connections-mobile">
            <div class="bold-number">{{ new Intl.NumberFormat().format(connectionsTotal) }}</div>connections
          </div>
          <div class="fanbase-mobile">
            <div class="bold-number">{{ new Intl.NumberFormat().format(fetchUserState.fanbase) }}</div>fanbases
          </div>
        </div>
        <li>
          <router-link to="/home">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/home-icon.png" />
              </div>Home
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Contests' }">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/win-icon.png" />
              </div>WiN
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Groups' }">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/create-group-icon.png" />
              </div>
              <div class="create-group-text">Create Group</div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Connections' }">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/make-connections-icon.png" />
              </div>Make Connections
            </div>
          </router-link>
        </li>
        <li>
          <a @click.prevent="openChatBox()" href="#">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/messages-icon.png" />
              </div>Messages
            </div>
          </a>
        </li>
        <li>
          <router-link :to="{ name: 'Notifications' }">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/notifications-icon.png" />
              </div>Notifications
            </div>
          </router-link>
        </li>
        <li>
          <a href="#">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/app-download-icon.png" />
              </div>
              <div class="app-download-text">Apps Download</div>
            </div>
          </a>
        </li>
        <li>
          <a href="#">
            <div class="home-mobile">
              <div class="iconx">
                <img class="mobile-image" src="../assets/settings-icon.png" />
              </div>Settings
            </div>
          </a>
        </li>
        <li>
          <a href="#" class="btn btn-md btn-success">
            Logout
          </a>
        </li>
      </div>
    </ul>
    <!-- <Login></Login> -->
    <div>
      <div class="centralize-page">
        <div v-if="getName ==='Profile'" class="flex-component">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <Profile></Profile>
        </div>
        <div v-else-if="getName === 'Notifications'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <Notifications></Notifications>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'Comments'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <Comments></Comments>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'Connections'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <Connections></Connections>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'Contests'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <Contest></Contest>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'ContestPage'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <ContestPage :AuthState="fetchAuthState" :UserState="fetchUserState"></ContestPage>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'Groups'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <Groups :AuthState="fetchAuthState" :UserState="fetchUserState"></Groups>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'GroupFeeds'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <GroupFeeds :AuthState="fetchAuthState" :UserState="fetchUserState"></GroupFeeds>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'PlayLists'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <PlayLists :AuthState="fetchAuthState" :UserState="fetchUserState"></PlayLists>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
        <div v-else-if="getName === 'Feedpage'" class="flex-component-feed">
          <LeftNav
            class="lefty hide-on-med-and-down"
            :AuthState="fetchAuthState"
            :UserState="fetchUserState"
          ></LeftNav>
          <div class="album-covers hide-on-med-and-down">
            <div class="album-1" v-for="(album, index ) in albums" :key="index">
              <img class="album" src="../assets/u7.jpg" />
              <div class="padding-r"></div>
            </div>
          </div>
          <FeedPage class="feed-page" :AuthState="fetchAuthState" :UserState="fetchUserState"></FeedPage>
          <RightNav class="righty hide-on-med-and-down"></RightNav>
        </div>
      </div>
    </div>

    <Chat class="hide-on-med-and-up"></Chat>
  </div>
</template>
<script>
/*eslint-disable*/
import { SocketConnection } from "@/mixins/GlobalMixins";
import eventBus from '@/mixins/EventsMixins';

import TopNav from "./TopNav";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";
import FeedPage from "./FeedPage";
import Login from "./Login";
import Profile from "./Profile";

import Chat from "./Chat";
import Connections from "./Connections";
import Notifications from "./Notifications";
import Comments from "./Comments";
import Contest from "./Contest";
import ContestPage from "./ContestPage";
import Groups from "./Group";
import GroupFeeds from './GroupFeeds';
import PlayLists from './PlaylistLists';

import toastr from "toastr";

import io from "socket.io-client";
import axios from 'axios';
var socket = io.connect(SocketConnection());

export default {
  async beforeDestroy() {

  },
  async destroyed() {

  },
  async mounted() {
    // Init the localStorage....
    this.getNotifications();
    await this.fetchConnections();

    eventBus.$on('artiste-connection', user => {
        this.connections = this.connections.filter(connection => {
          if (connection.id !== user.id) return true
        })

        setTimeout(async () => {
          await this.fetchConnections()
        }, 3000)
      });
    
    // Listen for socket connections and incoming connection messages...
    socket.on("connectionMessage", data => {
      if (data.stageName === this.fetchUserState.stageName) {
        this.$toast.success(data.message, 'Connection Message', this.notificationSystem.options.success);
        // mutate the localstorage and also the data property..
        this.notifications.connections = parseInt(
          this.notifications.connections
        );
        this.notifications.connections += 1;

        this.notifications.notifications = parseInt(
          this.notifications.notifications
        );
        this.notifications.notifications += 1;

        this.mutateNotification();
      }
    });

    socket.on("connectionApproved", Data => {
      if (Data.receivers.receiverStageName == this.fetchUserState.stageName) {
        this.notifications.notifications = parseInt(
          this.notifications.notifications
        );
        this.notifications.notifications += 1;

        this.$toast.success(
          Data.notification.message,
          'Connection Approved',
          this.notificationSystem.options.success
        );
        this.mutateNotification();
      }
    });

    socket.on('commentRecieved', Data => {
      if (Data.receivers.receiverStageName == this.fetchUserState.stageName) {
        this.notifications.notifications = parseInt(
          this.notifications.notifications
        );
        this.notifications.notifications += 1;

        console.log(Data.notification.message);

        this.$toast.success(
          Data.notification.message,
          'New Comment',
          this.notificationSystem.options.success
        );
        this.mutateNotification();
      }
    });

  },
  methods: {
    async fetchConnections() {
        await axios
          .get(this.$baseUrl + '/connections-list', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          })
          .then(response => {
            if (response.status == 200) {
              this.connectionsTotal = response.data.data.length
              this.connections = response.data.data.slice(0, 5)
            } else {
              this.connectionsTotal = 0
              this.connections = []
            }
          })
          .catch(e => {
            this.connectionsTotal = 0
            this.connections = []
          })
    },
    openChatBox () {
      eventBus.$emit('open-chat-container', null);
    },
    mutateNotification() {
      // Mutate notification win...
      localStorage.setItem("notification_win", this.notifications.win);
      // Mutate notification messages...
      localStorage.setItem(
        "notification_messages",
        this.notifications.messages
      );
      // Mutate connections...
      localStorage.setItem(
        "notification_connections",
        this.notifications.connections
      );
      // Mutate Notifications...
      localStorage.setItem(
        "notification_notifications",
        this.notifications.notifications
      );
    },
    getNotifications() {
      if (localStorage.getItem("notification_win")) {
        this.notifications.win = parseInt(
          localStorage.getItem("notification_win")
        );
      } else {
        this.notifications.win = 0;
        localStorage.setItem("notification_win", 0);
      }

      if (localStorage.getItem("notification_messages")) {
        this.notifications.messages = parseInt(
          localStorage.getItem("notification_messages")
        );
      } else {
        this.notifications.messages = 0;
        localStorage.setItem("notification_messages", 0);
      }

      if (localStorage.getItem("notification_connections")) {
        this.notifications.connections = parseInt(
          localStorage.getItem("notification_connections")
        );
      } else {
        this.notifications.connections = 0;
        localStorage.setItem("notification_connections", 0);
      }

      if (localStorage.getItem("notification_notifications")) {
        this.notifications.notifications = parseInt(
          localStorage.getItem("notification_notifications")
        );
      } else {
        this.notifications.notifications = 0;
        localStorage.setItem("notification_notifications", 0);
      }
    },
    profile() {
      this.$router.push({ path: "/Profile" });
    },
    showModal(content) {
      this.addNote = null;
      this.addForumTitle = null;
      this.addTitle = null;
      this.imageData = null;
      if (content === "video") {
        this.showVideo = true;
        (this.showPicture = false),
          (this.showAudio = false),
          (this.showForum = false),
          (this.showStatus = false);
      } else if (content === "audio") {
        this.showAudio = true;
        (this.showPicture = false),
          (this.showVideo = false),
          (this.showForum = false),
          (this.showStatus = false);
      } else if (content === "camera") {
        this.showPicture = true;
        (this.showVideo = false),
          (this.showAudio = false),
          (this.showForum = false),
          (this.showStatus = false);
      } else if (content === "forum") {
        this.showForum = true;
        this.showPicture = false;
        this.showAudio = false;
        this.showVideo = false;
        this.showStatus = false;
      } else if (content === "status") {
        this.showStatus = true;
        this.showPicture = false;
        this.showAudio = false;
        this.showForum = false;
        this.showVideo = false;
      }
      this.displayed = content;
      this.$modal.show("hello-world");
    },
    hide() {
      this.$modal.hide("hello-world");
    }
  },
  components: {
    Chat,
    TopNav,
    LeftNav,
    RightNav,
    FeedPage,
    Login,
    Profile,
    Connections,
    Notifications,
    Comments,
    Contest,
    ContestPage,
    Groups,
    GroupFeeds,
    PlayLists
  },
  data() {
    return {
      connectionsTotal: '',
      first_name: "Paulin",
      last_name: "Johnchuckwu",
      professions: "Singer and Music Producer",
      notifications: {
        win: 0,
        messages: 0,
        connections: 0,
        notifications: 0
      },
      notificationSystem: {
        options: {
          show: {
            theme: "dark",
            icon: "icon-person",
            position: "topCenter",
            progressBarColor: "rgb(0, 255, 184)",
            buttons: [
              [
                "<button>Ok</button>",
                function(instance, toast) {
                  alert("Hello world!");
                },
                true
              ],
              [
                "<button>Close</button>",
                function(instance, toast) {
                  instance.hide(
                    {
                      transitionOut: "fadeOutUp",
                      onClosing: function(instance, toast, closedBy) {
                        console.info("closedBy: " + closedBy);
                      }
                    },
                    toast,
                    "buttonName"
                  );
                }
              ]
            ],
            onOpening: function(instance, toast) {
              console.info("callback abriu!");
            },
            onClosing: function(instance, toast, closedBy) {
              console.info("closedBy: " + closedBy);
            }
          },
          ballon: {
            balloon: true,
            position: "bottomCenter"
          },
          info: {
            position: "bottomLeft"
          },
          success: {
            position: "bottomRight"
          },
          warning: {
            position: "topLeft"
          },
          error: {
            position: "topRight"
          },
          question: {
            timeout: 20000,
            close: false,
            overlay: true,
            toastOnce: true,
            id: "question",
            zindex: 999,
            position: "center",
            buttons: [
              [
                "<button><b>YES</b></button>",
                function(instance, toast) {
                  instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                },
                true
              ],
              [
                "<button>NO</button>",
                function(instance, toast) {
                  instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                }
              ]
            ],
            onClosing: function(instance, toast, closedBy) {
              console.info("Closing | closedBy: " + closedBy);
            },
            onClosed: function(instance, toast, closedBy) {
              console.info("Closed | closedBy: " + closedBy);
            }
          }
        }
      },
      albums: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p"
      ]
    };
  },
  async created() {
    await this.$store.dispatch("localStorePreCheck");
    if (
      this.fetchAuthState.isLoggedIn === true &&
      this.fetchAuthState.role !== "admin"
    ) {
      // Join The user to the socket room.
      const Payload = {
        socketId: socket.id,
        stageName: this.fetchUserState.stageName,
        socketRoom: "Naijap"
      };
      socket.emit("joinRoom", Payload);
      return;
    } else {
      this.$store.dispatch("resetStoreState");
      this.$toast.error(
        "Sorry, you do not have enough access right to access this page.",
        "Authentication Error",
        this.notificationSystem.options.error
      );
      setTimeout(() => {
        this.$router.push("/");
      }, 2000);
    }
    return;
  },
  computed: {
    fetchAuthState() {
      return this.$store.getters.fetchAuthStore;
    },
    fetchUserState() {
      return this.$store.getters.fetchUserStore;
    },
    getName() {
      if (this.$route.name === "Connections") {
        this.notifications.connections = 0;

        this.mutateNotification();
      }

      if (this.$route.name === "Notifications") {
        this.notifications.notifications = 0;

        this.mutateNotification();
      }
      return this.$route.name;
    }
  }
};
</script>

<style scoped>

@import "../assets/styles/login.css";

.not-sticky {
}
.sticky {
  /* max-height: 150px; */
  /* overflow: auto; */
  position: fixed;
  bottom: 20px;
  overflow: hidden;
}
.feed-page {
  grid-column: 2/3;
  grid-row: 2/3;
  height: auto;
}
.nav-background {
  background: #0c101b;
  /* width: 112%; */
}
.account-info-text {
  padding-bottom: 8px;
  font-weight: bold;
  color: #218c03;
  /* background-color: aqua */
}
.name-mobile {
  display: flex;
  padding-left: 35px;
  font-weight: bold;
  color: #218c03;
}
.avatar-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36px;
  margin-bottom: -30px;
  margin-top: -25px;
}
.profession-mobile {
  display: flex;
  padding-left: 35px;
  /* font-weight: bold; */
  padding-bottom: 10px;
  margin-top: -5px;
  font-size: 12px;
}
.profession-text-mobile {
  font-weight: 600;
  /* margin-right: 5px; */
}
.bold-number {
  font-weight: 600;
  margin-right: 5px;
}
.connect-fanbase {
  display: flex;
  /* padding-left:10px; */
  justify-content: space-evenly;
}
.connections-mobile {
  display: flex;
}
.fanbase-mobile {
  display: flex;
}
.side-nav-items {
  padding-top: 20px;
}
.mobile-image {
  height: 19px;
  width: 25px;
  margin-right: 20px;
}
.padding-top-logo {
  margin-top: 15px;
}
.centralize-page {
  display: flex;
  justify-content: center;
}

.lefty {
  position: sticky;
  top: 60px;
  /* left:-20; */
  position: -webkit-sticky;
  height: 90vh;
  grid-column: 1;
  grid-row: 1/3;
}
@media (max-width: 1500px) {
  .lefty {
    /* position: sticky;
    top: 60px; */
    /* left:-20; */
    position: -webkit-sticky;
    /* height: 90vh; */
    grid-column: 1;
    grid-row: 1/3;
  }
}
.righty {
  /* position: sticky; */
  /* bottom:0; */
  /* max-height: 100vh; */
  grid-column: 3/4;
  grid-row: 2/3;
  width: 300px;
  padding-top: 29px;
}
.toppy {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 999;
}
.padding-r {
  padding-right: 47px;
  /* padding-left: 20px; */
  /* background-color: red; */
}
.album {
  /* background: green; */
  height: 40px;
  width: 40px;
  padding-top: 5px;
  /* padding-right: 10px */
}
.flex-component {
  display: grid;
  /* justify-content: space-between; */
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr;
  padding-left: 40px;
  padding-right: 10px;
  /* position: relative; */
  /* height: 100%; */
  max-width: 1300px;
}
.flex-component-feed {
  display: grid;
  /* justify-content: space-between; */
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: auto auto;
  padding-left: 40px;
  padding-right: 10px;
  max-width: 1300px;
}
@media only screen and (max-width: 992px) {
  .flex-component-feed {
    display: grid;
    /* justify-content: space-between; */
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    padding-left: 40px;
    padding-right: 10px;
    background: #0c101b;
    /* max-width: 1300px; */
  }
  .flex-component {
    display: grid;
    /* justify-content: space-between; */
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    padding-left: 40px;
    padding-right: 10px;
    /* position: relative; */
    /* height: 100%; */
    /* max-width: 1300px; */
  }
}

#app {
  /* font-family: 'Roboto Condensed', sans-serif; */
  font-family: "Source Sans Pro";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background: #121722; */
  /* font-family:'roboto' */
  /* height: 100vh */
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.mobile-nav-view {
  margin-bottom: 10px;
}

.mobile-nav-view img {
  width: 40%;
  margin-top: -4%;
  height: 10vh;
}
</style>

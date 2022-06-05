<template>
  <div class="artistes">
    <div id="overlay-artiste">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-green-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="artiste-grid">
      <template v-if="artistes2.length > 0">
        <div
          class="artiste-list"
          v-for="artiste in artistes2"
          :key="artiste._id"
        >
          <div class="artiste-contents">
            <template v-if="artiste.avatar == ''">
              <img class="artiste-avatar" src="../assets/u2.jpg" />
            </template>
            <template v-else>
              <img class="artiste-avatar" :src="artiste.avatar" />
            </template>
            <div class="artiste-name-feed">{{ artiste.name }}</div>
            <div class="artiste-songs-connect">
              <div class="artiste-songs" v-show="artiste.songs > 0">
                {{ artiste.songs | formatNumber }} songs
              </div>
              <div class="artiste-songs" v-show="artiste.songs < 1">
                {{ artiste.songs }} song
              </div>
              <div class="artiste-connect">
                <button class="button-con" @click="makeConnection(artiste)">
                  Connect
                </button>
              </div>
            </div>
            <div class="artiste-fanbase" v-show="artiste.fanbase > 0">
              {{ artiste.fanbase | formatNumber }} fanbases
            </div>
            <div class="artiste-fanbase" v-show="artiste.fanbase < 1">
              {{ artiste.fanbase }} fanbase
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import axios from "axios";

import { SocketConnection } from "@/mixins/GlobalMixins";
import eventBus from "@/mixins/EventsMixins";

import io from "socket.io-client";
import _ from "lodash";
var socket = io.connect(SocketConnection());

export default {
  async mounted() {
    await this.fetchConnections();
    eventBus.$on("artiste-connection", user => {
      this.artistes2 = this.artistes2.filter(connection => {
        if (connection.id !== user.id) return true;
      });

      setTimeout(async () => {
        await this.fetchConnections();
      }, 3000);
    });
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
    async fetchConnections() {
      await axios
        .get(this.$baseUrl + "/connections-list", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          if (response.status == 200) {
            if (response.data.data.length > 0) {
              this.artistes2 = _.shuffle(response.data.data);
              this.artistes2 = this.artistes2.slice(0, 20);
            } else {
              this.artistes2 = [];
            }
          } else {
            this.artistes2 = [];
          }
        })
        .catch(e => {
          this.artistes2 = [];
        });
    },
    async makeConnection(user) {
      await axios
        .get(this.$baseUrl + "/make-connection/" + user.id, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          const Status = response.status;
          const Data = response.data.data[0];
          if (Status === 200) {
            // remove the user id and flash a notification.
            this.$toast.success(
              "Your request has been sent to " + user.name,
              "Success",
              this.notificationSystem.options.success
            );
            const Payload = {
              connectionId: Data._id,
              following: user.name,
              follower: this.fetchUserState.stageName
            };
            socket.emit("newConnection", Payload);
            this.artistes2 = this.artistes2.filter(connection => {
              if (connection.id != user.id) return true;
            });
            setTimeout(() => {
              this.fetchConnections();
              return true;
            }, 5000);
            eventBus.$emit("artiste-connection", user);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  filters: {
    formatNumber(number) {
      const NumberFormat = new Intl.NumberFormat();
      return NumberFormat.format(number);
    }
  },
  data() {
    return {
      artistes2: [],
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
      }
    };
  }
};
</script>
<style scoped>
#overlay-artiste {
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}
.preloader-wrapper.big {
  width: 20px !important;
  height: 20px !important;
  position: absolute !important;
  /* top: 50% ; */
  left: 54% !important;
  top: 50% !important;
}
.button-con:focus {
  background: transparent !important;
}

</style>

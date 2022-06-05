<template id="">
  <div class="feeds">
    <div class="feed-grid" v-if="connections.length > 0">
      <div class="a-feed" v-for="connection in connections" :key="connection.id">
        <template>
          <div class="feed-body">
            <div class="feed-grid-inner">
              <template v-if="connection.user.avatar == ''">
                <img class="feed-avatar" src="../assets/u7.jpg" />
              </template>
              <template v-else>
                <img class="feed-avatar" :src="connection.user.avatar" />
              </template>
              <div class="feed-name">{{ connection.user.stageName }}</div>
              <div class="feed-time">{{ connection.timestamp | diffForHumans }}</div>
            </div>
            <div class="feed-text">
              {{ connection.user.stageName }} has {{ connection.user.fanbase | formatNumber }}
              <b>Fanbases</b>
            </div>
            <div class="feed-activity">
              <button
                type="button"
                style="padding: 5px; color: green;"
                @click.prevent="approveConnection(connection)"
              >
                <i class="fas fa-check icons" title="Approve Connection"></i> Approve
              </button>
              <div class="padding-act-s"></div>
              <div class="padding-act-s"></div>
              <div class="padding-act-s"></div>
              <button
                type="button"
                style="padding: 5px; color: maroon;"
                @click.prevent="declineConnection(connection)"
              >
                <i class="fas fa-times icons" title="Decline Connection"></i> Decline
              </button>
              <div class="padding-act-s"></div>
            </div>
          </div>
        </template>
        <div class="padding-b"></div>
      </div>
    </div>
    <div class="feed-grid" v-if="connections.length <= 0">
      <div class="a-feed">
        <div class="feed-body">
          <div class="feed-text">
            <p class="no-connections-text" style="text-align: center;">Sorry, There Are No Connections To Show At The Moment.</p>
          </div>
          <div class="feed-text" style="text-align: center;">
            <router-link to="/home" class="btn btn-md btn-success"><i class="fas fa-home"></i> Go Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
/* eslint-disable */
import { SocketConnection } from "@/mixins/GlobalMixins";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import toastr from "toastr";

var socket = io.connect(SocketConnection());

export default {
  data() {
    return {
      connections: [],
      connectionId: {
        status: false,
        id: ""
      },
      connectionsMeta: {},
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
  },
  async mounted() {
    this.$store.dispatch("callLocalStore");
    await this.fetchPendingConnections();
    await this.checkConnection();
  },
  methods: {
    async fetchPendingConnections() {
      await axios
        .get(this.$baseUrl + "/fetch-pending-fanbases", {
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
            this.connections = response.data.data[0];
            this.connectionsMeta = response.data.data[1].meta;
            return;
          }

          this.connections = [];
          this.connectionsMeta = {};
        })
        .catch(e => {
          this.connections = [];
          this.connectionsMeta = {};
        });
    },
    async checkConnection() {
      let routePath = this.$route.path;
      routePath = routePath.split("/");

      if (routePath.length == 4) {
        this.connectionId.status = true;
        this.connectionId.id = routePath[3];

        // check if the id exists in the array, if it does, we make it the first..
        let checkConn = this.connections.filter(el => {
          if (el._id == this.connectionId.id) return true;
        });

        // make the element come first..
        if (checkConn.length > 0) {
          let elem = checkConn[0];
          this.connections = this.connections.filter(el => {
            if (el.id == this.connectionId.id) return false;
          });

          // element has appeared first...
          this.connections.unshift(elem);
          return this.connectionId;
        } else {
          await this.fetchConnection();
          return this.connectionId;
        }
      }
      return this.connectionId;
    },
    async fetchConnection() {
      await axios
        .get(this.$baseUrl + "/find-connection/" + this.connectionId.id, {
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
            this.connections.unshift(response.data.data[0]);
          }
        })
        .catch(e => {
          // Do Nothing.......
        });
    },
    async approveConnection(doc) {
      await axios
        .get(this.$baseUrl + "/approve-connection/" + doc._id, {
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
            // Data Payload.........
            const Payload = {
              type: "approveConnection",
              connId: doc._id,
              initiate: doc.following,
              receiver: doc.follower,
              receiverStageName: doc.user.stageName,
              initiateStageName: this.fetchUserState.stageName
            };
            // Delete the connection.......
            this.connections = this.connections.filter(el => {
              if (el.id == doc._id) return false;
            });
            // Toastr notification.......
            this.$toast.success(
              doc.user.stageName + " has been added to you connections.",
              "Success",
              this.notificationSystem.options.success
            );
            // Emit a socket event......
            socket.emit("approveConnection", Payload);

            setTimeout(() => {
              this.$router.push({
                name: "Connections"
              });
            }, 1000);
          }
        })
        .catch(e => {
          // Do Nothing..........
        });
      await this.deleteNotification({
        type: "new_connection",
        document_id: doc._id
      });
    },
    async declineConnection(doc) {
      await axios
        .delete(this.$baseUrl + "/delete-connection/" + doc._id, {
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
            // Delete the connection.......
            this.connections = this.connections.filter(el => {
              if (el.id == doc._id) return false;
            });
            // Toastr notification.......
            this.$toast.success(
              doc.user.stageName +
                " connection request has been declined Successfully.",
              "Success",
              this.notificationSystem.options.success
            );
          }
        })
        .catch(e => {
          // Do Nothing..........
        });
    },
    async deleteNotification(payload) {
      await axios
        .post(this.$baseUrl + "/delete-notification-query", payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          console.log(payload);
          console.log(response);
          if (response.status == 200) {
            this.$toast.success(
              "Your notifications has been updated Successfully.",
              "Success",
              this.notificationSystem.options.success
            );
          }
        })
        .catch(e => {
          console.log(e);
          // Do Nothing............
        });
    }
  },
  computed: {
    fetchAuthState() {
      return this.$store.getters.fetchAuthStore;
    },
    fetchUserState() {
      return this.$store.getters.fetchUserStore;
    }
  },
  filters: {
    diffForHumans(value) {
      return moment
        .utc(value)
        .local()
        .fromNow();
    },
    formatNumber(number) {
      const NumberFormat = new Intl.NumberFormat();
      return NumberFormat.format(number);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
#overlay-post {
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
  width: 50px !important;
  height: 50px !important;
  position: absolute !important;
  /* top: 50% ; */
  left: 54% !important;
  top: 50% !important;
}
.image-feed {
  min-height: 333px !important;
  max-height: 589px !important;
  width: 95% !important;
}
.no-connections-text {
  font-size: 145%;
}
</style>

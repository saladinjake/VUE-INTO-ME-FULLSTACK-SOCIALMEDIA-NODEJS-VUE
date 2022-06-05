<template id="">
  <div class="feeds">
    <div class="feed-grid" v-if="notifications.length > 0">
      <div class="a-feed" v-for="notification in notifications" :key="notification.id">
        <template v-if="notification.type == 'new_connection'">
          <div
            class="feed-body"
            style="cursor: pointer;"
            @click.prevent="openNotification(notification.type, notification.document_id)"
          >
            <div class="feed-grid-inner">
              <!-- <img class="feed-avatar" src="../assets/u7.jpg" /> -->
              <div class="feed-name">
                Connection Request
                <span
                  style="color: maroon; margin: 2px 10px;"
                  @click="deleteNotification({ document_id: notification.document_id, type: notification.type })"
                  class
                >
                  <i class="fa fa-trash"></i>
                </span>
              </div>
              <div class="feed-time">{{ notification.timestamp | diffForHumans }}</div>
            </div>
            <div class="feed-text">{{ notification.message }}</div>
          </div>
          <div class="padding-b"></div>
        </template>
        <template v-if="notification.type == 'approved_connection'">
          <div
            class="feed-body"
            style="cursor: pointer;"
            @click.prevent="openNotification(notification.type, notification.document_id)"
          >
            <div class="feed-grid-inner">
              <!-- <img class="feed-avatar" src="../assets/u7.jpg" /> -->
              <div class="feed-name">
                New Connection
                <span
                  style="color: maroon; margin: 2px 10px;"
                  @click="deleteNotification({ document_id: notification.document_id, type: notification.type })"
                  class
                >
                  <i class="fa fa-trash"></i>
                </span>
              </div>
              <div class="feed-time">{{ notification.timestamp | diffForHumans }}</div>
            </div>
            <div class="feed-text">{{ notification.message }}</div>
          </div>
          <div class="padding-b"></div>
        </template>
        <template v-if="notification.type == 'comment'">
          <div
            class="feed-body"
            style="cursor: pointer;"
            @click.prevent="openNotification(notification.type, notification.document_id)"
          >
            <div class="feed-grid-inner">
              <!-- <img class="feed-avatar" src="../assets/u7.jpg" /> -->
              <div class="feed-name">
                New Comment
                <span
                  style="color: maroon; margin: 2px 10px;"
                  @click="deleteNotification({ document_id: notification.document_id, type: notification.type })"
                  class
                >
                  <i class="fa fa-trash"></i>
                </span>
              </div>
              <div class="feed-time">{{ notification.timestamp | diffForHumans }}</div>
            </div>
            <div class="feed-text">{{ notification.message }}</div>
          </div>
          <div class="padding-b"></div>
        </template>
      </div>
    </div>
    <div class="feed-grid" v-if="notifications.length <= 0">
      <div class="a-feed">
        <div class="feed-body">
          <div class="feed-text">
            <p class="no-connections-text" style="text-align: center;">Sorry, There Are No Notifications To Show At The Moment</p>
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
      notifications: [],
      notificationsMeta: {},
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
    await this.fetchNotifications();

    socket.on("connectionApproved", Data => {
      if (Data.receivers.receiverStageName == this.fetchUserState.stageName) {
        //Pass in a props to the notification component...
        this.notifications.unshift(Data.notification);
        return;
      }
    });

    socket.on('commentRecieved', Data => {
      if (Data.receivers.receiverStageName == this.fetchUserState.stageName) {
        this.notifications.unshift(Data.notification);
        return;
      }
    })
  },
  methods: {
    async fetchNotifications() {
      await axios
        .get(this.$baseUrl + "/fetch-notifications", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        })
        .then(response => {
          if (response.status !== 200) {
            this.notifications = [];
            return;
          }

          this.notifications = response.data.data[0];
          this.notificationsMeta = response.data.data.meta;
        })
        .catch(e => {
          this.notifications = [];
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
          if (response.status == 200) {
            this.$toast.success(
              "Your notifications has been deleted Successfully.",
              "Success",
              this.notificationSystem.options.success
            );
            this.notifications = this.notifications.filter(el => {
              if (
                el.document_id == payload.document_id &&
                el.type == payload.type
              )
                return false;
            });
          }
        })
        .catch(e => {
          console.log(e);
          // Do Nothing............
        });
    },
    openNotification(type, documentId) {
      switch (type) {
        case "new_connection":
          setTimeout(() => {
            this.$router.push({
              path: `/connections/connection/${documentId}`
            });
          }, 1000);
          break;
        case "comment":
          setTimeout(() => {
            this.$router.push({
              name: 'Comments',
              params: {
                postId: documentId
              }
            });
          }, 1000);
          break;
        default:
          break;
      }
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
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.feed-name, .feed-time {
  margin-left: -12% !important;
}
.feed-time {
  margin-bottom: 10px;
}
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
</style>

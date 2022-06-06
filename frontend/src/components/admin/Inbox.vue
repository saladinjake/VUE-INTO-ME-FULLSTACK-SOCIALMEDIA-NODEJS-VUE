<template>
  <div>
    <SideBar></SideBar>
    <section class="content">
      <AdminHeader></AdminHeader>
      <div class="wraper container-fluid">
        <div class="container-fluid page-current-title">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <div class="page-title">
                <h5 class="title"><b>Inbox</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row forum-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Title</th>
                            <th>Body</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="inbox.length > 0">
                          <tr v-for="(inboxMessage, index) in inbox" :key="inboxMessage._id">
                            <td>
                              {{ index + 1 }}
                            </td>
                            <td>
                              {{ inboxMessage.email }}
                            </td>
                            <td>
                              {{ inboxMessage.messages[inboxMessage.messages.length - 1].title }}
                            </td>
                            <td v-html="inboxMessage.messages[inboxMessage.messages.length - 1].content">
                            </td>
                            <td>
                              {{ inboxMessage.humanTime | diffForHumans }}
                            </td>
                            <td>
                              <div class="btn-group">
                                <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                <ul class="dropdown-menu" role="menu">
                                  <li><router-link :to="{ name: 'AdminMessenger', params: { email: inboxMessage.email } }">Reply</router-link></li>
                                  <li><a data-toggle="modal" href="#readModal" @click.prevent="getMessage(inboxMessage)">Read Message</a></li>
                                  <li><a href="javascript:void(0)" @click.prevent="deleteMessage(inboxMessage.email)">Delete</a></li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Row -->
      </div>
    </section>
    <AdminFooter></AdminFooter>

    <div id="readModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-envelope"></i> <b>{{ this.message.email }}</b> Messages</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12" v-for="(messa, index) in this.message.messages" :key="index">
              <p class="text-success">{{ messa.from }}</p>
              <p class="text-muted" v-html="messa.content"></p>
              <div class="section"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
              <div class="btn-group-sm pull-right">
                <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-danger" data-dismiss="modal">
                  <i class="fas fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div><!-- /.modal -->
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import SideBar from './Aside.vue'
  import AdminHeader from './Header.vue'
  import AdminFooter from './Footer.vue'

  import axios from 'axios'
  import moment from 'moment'

  export default {
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchInbox();
      }
    },
    methods: {
      async deleteMessage(email) {
        try {
          let delMessage = await axios.delete(this.$baseUrl + '/admin/delete/messages/' + email, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (delMessage.status == 200) {
            this.inbox = this.inbox.filter((el) => {
              if (el.email !== email) return true;
            });

            this.$toast.success('The Selected Account Has Been Deleted Successfully.', 'Conversation Deleted', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Conversation Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async getMessage(message) {
        this.message = message;
      },
      async fetchInbox() {
        try {
          let messages = await axios.get(this.$baseUrl + '/admin/fetch/messages', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (messages.status == 200) {
            this.inbox = messages.data.data[0];
            return;
          }

          this.inbox = [];
          return;
        } catch (e) {
          this.inbox = [];
        }
      }
    },
    async created() {
      await this.$store.dispatch("validateAdminToken");
      if (
        this.fetchAdminAuth.isLoggedIn !== true ||
        this.fetchAdminAuth.role != "admin" || this.fetchAdminAuth.token == ''
      ) {
        setTimeout(() => {
          this.$router.push({
            name: 'AdminLogin'
          });
        });
        return;
      }
    },
    computed: {
      fetchAdminAuth() {
        return this.$store.getters.fetchAdminAuth;
      },
      fetchAdminStore() {
        return this.$store.getters.fetchAdminStore;
      }
    },
    filters: {
      diffForHumans(value) {
        return moment
          .utc(value)
          .local()
          .fromNow();
      },
      showLastMessage(list) {
        let lastMessage = list.pop();
        return lastMessage.content;
      }
    },
    data() {
      return {
        inbox: [],
        message: '',
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
      }
    }
  }
</script>

<style media="screen" scoped>
#readModal {
  height: 50vh !important;
  width: 55% !important;
  overflow-x: hidden;
  overflow-y: auto;
}
#readModal h5 {
  text-align: left;
  float: left;
  font-size: 120%;
}
#readModal p {
  text-align: left;
  font-size: 105%;
  text-transform: capitalize;
}
#readModal .text-muted {
  background: grey;
  border: 1px solid grey;
  color: white;
  padding: 5px 5px;
  border-radius: 8px;
  width: 45% !important;
}
#readModal .modal-close {
  color: white !important;
  height: auto !important;
}
#readModal .modal-close:hover {
  color: white !important;
}
.modal-header {
  height: 11vh;
}
@media (min-width: 320px) {
  #readModal {
    width: 95% !important;
  }
  #readModal p {
  text-align: left;
  font-size: 105%;
  text-transform: capitalize;
  }
  #readModal .text-muted {
    background: grey;
    border: 1px solid grey;
    color: white;
    padding: 5px 5px;
    border-radius: 8px;
    width: auto !important;
  }
  .modal-title {
    font-size: 105% !important;
  }
}
</style>

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
                <h5 class="title"><b>User Mangement</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row user-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-xs-12 col-sm-12">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <router-link :to="{ name: 'AdminUsers', params: { type: 'default' } }" aria-expanded="false">
                                <span class="visible-xs">All Users</span>
                                <span class="hidden-xs"><i class="fas fa-user"></i> All Users</span>
                            </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminUsers', params: { type: 'active' } }" aria-expanded="false">
                              <span class="visible-xs">Active Users</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Active Users</span>
                          </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminUsers', params: { type: 'pending' } }" aria-expanded="false">
                              <span class="visible-xs">Pending Users</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Pending Users</span>
                          </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminUsers', params: { type: 'suspended' } }" aria-expanded="false">
                              <span class="visible-xs">Suspended Users</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Suspended Users</span>
                          </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminCreateUser' }" aria-expanded="false">
                              <span class="visible-xs">Create User</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Create Users</span>
                          </router-link>
                        </li>
                    </ul>
                  </div>
                  <div class="col-xs-12 col-sm-12">
                    <h3 class="panel-title left-align pull-left" v-if="type == 'default'">All Users</h3>
                    <h3 class="panel-title left-align pull-left" v-if="type == 'active'">Active Users</h3>
                    <h3 class="panel-title left-align pull-left" v-if="type == 'pending'">Pending Users</h3>
                    <h3 class="panel-title left-align pull-left" v-if="type == 'suspended'">Suspended Users</h3>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Stage Name</th>
                            <th>Email</th>
                            <th>Account Type</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Date Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="accounts.length > 0">
                          <tr v-for="(account, index) in accounts" :key="account._id">
                            <td>
                              {{ index + 1 }}
                            </td>
                            <td>
                              {{ account.lastName }} {{ account.firstName }}
                            </td>
                            <td>
                              {{ account.stageName }}
                            </td>
                            <td>
                              {{ account.email }}
                            </td>
                            <td>
                              {{ account.userType }}
                            </td>
                            <td>
                              {{ account.gender }}
                            </td>
                            <td v-if="account.status == 0">
                              <a class="btn z-depth-0 btn-sm btn-small btn-warning">
                                Pending
                              </a>
                            </td>
                            <td v-else-if="account.status == 1">
                              <a class="btn z-depth-0 btn-sm btn-small btn-success">
                                Approved
                              </a>
                            </td>
                            <td v-else>
                              <a class="btn z-depth-0 btn-sm btn-small btn-danger">
                                Suspended
                              </a>
                            </td>
                            <td>
                              {{ account.timeStamp | diffForHumans }}
                            </td>
                            <td>
                              <div class="btn-group">
                                <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                <ul class="dropdown-menu" role="menu">
                                  <li v-if="account.status == '2' || account.status == '0'"><a href="javascript:void(0)" @click.prevent="updateStatus(account, 1)">Approve</a></li>
                                  <li v-if="account.status == '1'"><a href="javascript:void(0)" @click.prevent="updateStatus(account, 2)">Suspend</a></li>
                                  <li class="divider"></li>
                                  <li><a data-toggle="modal" href="#myUserModal" @click.prevent="fetchUser(account)">Email User</a></li>
                                  <li><router-link :to="{ name: 'AdminUserProfile', params: { email: account.email } }">Edit Profile</router-link></li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <template v-if="users.length > 0">
                      <jw-pagination :items="users" @changePage="onChangePage"></jw-pagination>
                    </template>
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

    <!-- modal Content -->
    <div id="myUserModal" style="background: white !important; display: none;" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title" v-if="user !== ''"><i class="fas fa-envelope"></i> Email <b>{{ user.lastName }} {{ user.firstName }}</b></h5>
              <button type="button" class="close text-danger" style="color: red;" data-dismiss="modal" aria-hidden="true"><i class="fas fa-times"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <form action="">
              <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                <div class="form-group">
                  <v-text-field
                    v-model="emailSubject"
                    label="Outlined"
                    placeholder="Subject"
                    type="text"
                    single-line
                    solo
                  ></v-text-field>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                <div class="form-group">
                  <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                <button type="button" class="btn btn-block btn-md btn-success"><i class="fas fa-paper-plane"></i> Submit</button>
              </div>
            </form>
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
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  export default {
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchUsers();
      }
    },
    watch: {
      async $route(to, from) {
        this.type = to.params.type
        switch (this.type) {
          case 'default':
            this.pageTitle = 'All Users';
            await this.fetchUsers();
            break
          case 'active':
            this.pageTitle = 'Active Users'
            await this.fetchUsers();
            break;
          case 'pending':
            this.pageTitle = 'Pending Users';
            await this.fetchUsers();
          break;
          case 'suspended':
            this.pageTitle = 'Suspended Users';
            await this.fetchUsers();
          break;
          default:
            this.pageTitle = '';
          break;
        }
      }
    },
    methods: {
      onChangePage(pageOfItems) {
        this.accounts = pageOfItems;
      },
      fetchUser(user) {
        this.user = user;
        return;
      },
      async updateStatus(user, status) {
        try {
          let statusUpdate = await axios.get(this.$baseUrl + '/admin/user/update/status/' + status + '/' + user._id, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (statusUpdate.status == 200) {
            this.users = this.users.map((recent) => {
              if (recent._id == user._id) {
                recent.status = status;
              }

              return recent;
            });

            this.accounts = this.accounts.map((recent) => {
              if (recent._id == user._id) {
                recent.status = status;
              }

              return recent;
            })

            this.$toast.success(
              `${user.lastName} ${user.firstName} Account Status Has Been Successfully Updated.`,
              'Account Status Updated',
              this.notificationSystem.options.success
            );
            return;
          }
        } catch (e) {
          this.$toast.error(`Sorry, An Unexpected Error Occurred And ${user.lastName} ${user.firstName} Account Status Could Not Be Updated.`, 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchUsers() {
        try {
          let users = await axios.get(this.$baseUrl + `/admin/users/filter/${this.type}`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (users.status == 200) {
            this.users =  users.data.data[0];
          }

          if (users.status !== 200) {
            this.users = [];
            this.accounts = []
          }
          return;
        } catch (e) {
          this.users = [];
          this.accounts = [];
          return;
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
      }
    },
    data() {
      return {
        user: '',
        type: this.$route.params.type,
        pageTitle: 'All Users',
        users: [],
        accounts: [],
        emailSubject: '',
        editor: ClassicEditor,
        editorData: "<p>Write Something...</p>",
        editorConfig: {

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
        }
      }
    }
  }

</script>

<style scoped>
  .user-tables h3 {
    color: black;
    font-size: 195% !important;
  }
  .panel {
    border-radius: 8px;
  }
  .btn-default {
    background: #1ca8dd !important;
    border: 1px solid #1ca8dd !important;
    color: white !important;
  }
  #myUserModal h5 {
    text-align: left;
    float: left;
  }
  #myUserModal .close {
    color: red !important;
  }
  #myUserModal .close:hover {
    color: red !important;
  }
  @media(min-width: 320px) {
    #myUserModal {
      background: white !important;
      width: 95% !important;
      overflow-x: scroll !important;
    }
    .nav-tabs li {
      margin: 2px 5px;
    }
  }
  @media(min-width: 480px) {
    #myUserModal {
      background: white !important;
      width: 95% !important;
      overflow-x: scroll !important;
    }
  }
  #myUserModal {
    max-height: 80% !important;
    background: white !important;
  }
</style>

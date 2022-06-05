<template id="">
  <div>
    <SideBar></SideBar>
    <!--Main Content Start -->
    <section class="content">
      <AdminHeader></AdminHeader>
      <!-- Page Content Start -->
      <!-- ================== -->
      <div class="wraper container-fluid">
        <div class="container-fluid page-current-title">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <div class="page-title">
                <h5 class="title">Dashboard </h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row user-stats">
          <div class="col-lg-12 col-xl-12 col-sm-12 col-md-12 col-xs-12">
            <div class="row">
              <div class="col-sm-3">
                <div class="panel all-users panel-default">
                  <div class="panel-heading">
                    <h2 class="panel-title"><i class="fas fa-user"></i> All Users</h2>
                  </div>
                  <div class="panel-body">
                    <h3>{{ allUsers }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="panel active-users panel-default">
                  <div class="panel-heading">
                    <h2 class="panel-title"><i class="fas fa-check"></i> Active Users</h2>
                  </div>
                  <div class="panel-body">
                    <h3>{{ activeUsers }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="panel pending-users panel-default">
                  <div class="panel-heading">
                    <h2 class="panel-title"><i class="fas fa-info-circle"></i> Pending Users</h2>
                  </div>
                  <div class="panel-body">
                    <h3>{{ pendingUsers }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="panel suspended-users panel-default">
                  <div class="panel-heading">
                    <h2 class="panel-title"><i class="fas fa-times"></i> Suspended Users</h2>
                  </div>
                  <div class="panel-body">
                    <h3>{{ suspendedUsers }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end row -->
        <div class="row">
          <div class="col-md-12">
            <div class="portlet">
              <!-- /primary heading -->
              <div class="portlet-heading">
                <h2 class="portlet-title text-dark text-uppercase">
                  Last 5 Users
                </h2>
                <div class="clearfix"></div>
              </div>
              <div id="portlet2" class="panel-collapse collapse in">
                <div class="portlet-body">
                  <div class="table-responsive">
                    <table class="table">
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
                      <tbody v-if="recentUsers.length > 0">
                        <tr v-for="(user, index) in recentUsers" :key="user._id">
                          <td>
                            {{ index + 1 }}
                          </td>
                          <td>
                            {{ user.lastName }} {{ user.firstName }}
                          </td>
                          <td>
                            {{ user.stageName }}
                          </td>
                          <td>
                            {{ user.email }}
                          </td>
                          <td>
                            {{ user.userType }}
                          </td>
                          <td>
                            {{ user.gender }}
                          </td>
                          <td v-if="user.status == 0">
                            <a class="btn z-depth-0 btn-sm btn-small btn-warning">
                              Pending
                            </a>
                          </td>
                          <td v-else-if="user.status == 1">
                            <a class="btn z-depth-0 btn-sm sm btn-small btn-success">
                              Approved
                            </a>
                          </td>
                          <td v-else>
                            <a class="btn z-depth-0 btn-sm btn-small btn-danger">
                              Suspended
                            </a>
                          </td>
                          <td>
                            {{ user.humanTimeStamp | diffForHumans }}
                          </td>
                          <td>
                            <div class="btn-group">
                              <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                              <ul class="dropdown-menu" role="menu">
                                <li v-if="user.status == '2' || user.status == '0'"><a href="javascript:void(0)" @click.prevent="updateStatus(user, 1)">Approve</a></li>
                                <li v-if="user.status == '1'"><a href="javascript:void(0)" @click.prevent="updateStatus(user, 2)">Suspend</a></li>
                                <li class="divider"></li>
                                <li><a data-toggle="modal" href="#myModal" @click.prevent="fetchUser(user)">Email User</a></li>
                                <li><router-link :to="{ name: 'AdminUserProfile', params: { email: user.email } }">Edit Profile</router-link></li>
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
            <!-- /Portlet -->
          </div>
        </div>
        <!-- end row -->
      </div>
      <!-- Page Content Ends -->
      <!-- ================== -->
    </section>
    <!-- Main Content Ends -->
    <AdminFooter></AdminFooter>

    <!-- modal Content -->
    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
import SideBar from './Aside.vue';
import AdminHeader from './Header.vue';
import AdminFooter from './Footer.vue';

import axios from 'axios';
import moment from 'moment';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  export default {
    data() {
      return {
        user: '',
        allUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        suspendedUsers: 0,
        recentUsers: [],
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
    },
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchUserStats();
        await this.fetchRecentUsers();
      }
    },
    methods: {
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
          switch (status) {
            case 1:
              this.activeUsers += 1;
              this.suspendedUsers -= 1;
              break;
            case 2:
              this.activeUsers -= 1;
              this.suspendedUsers += 1;
              break;
            default:
              break;
          }

          if (statusUpdate.status == 200) {
            this.recentUsers = this.recentUsers.map((recent) => {
              if (recent._id == user._id) {
                recent.status = status;
              }

              return recent;
            });

            this.$toast.success(`${user.lastName} ${user.firstName} Account Status Has Been Successfully Updated.`, 'Success', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error(`Sorry, An Unexpected Error Occurred And ${user.lastName} ${user.firstName} Account Status Could Not Be Updated.`, 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchUserStats() {
        try {
          let userStats = await axios.get(this.$baseUrl + `/admin/users/stats`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (userStats.status == 200) {
            this.allUsers = userStats.data.data[0].allUsers;
            this.activeUsers = userStats.data.data[0].activeUsers;
            this.pendingUsers = userStats.data.data[0].pendingUsers;
            this.suspendedUsers = userStats.data.data[0].suspendedUsers;

            return;
          }
        } catch (e) {
          this.allUsers = 0;
          this.activeUsers = 0;
          this.pendingUsers = 0;
          this.suspendedUsers = 0;
          return;
        }
      },
      async fetchRecentUsers() {
        try {
          let recentUsersA = await axios.get(this.$baseUrl + `/admin/users/recent-users`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (recentUsersA.status == 200) {

            this.recentUsers = recentUsersA.data.data[0];
            return;
          }
        } catch (e) {
          this.recentUsers = [];
          console.log(e);
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
    }
  }
</script>

<style media="screen">
  .wraper {
    background: #edf0f0 !important;
  }
  .page-title .title {
    float: left;
  }
  .panel {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
  .panel .panel-title {
    float: left;
    font-size: 165% !important;
    color: white;
  }
  .all-users .panel-heading {
    background: #11998e;  /* fallback for old browsers */
    padding-bottom: 45px;
  }
  .active-users .panel-heading {
    background: #2193b0;  /* fallback for old browsers */
    padding-bottom: 45px;
  }
  .pending-users .panel-heading {
    background: #db36a4;  /* fallback for old browsers */
    padding-bottom: 45px;
  }
  .suspended-users .panel-heading {
    background: #f12711;  /* fallback for old browsers */
    padding-bottom: 45px;
  }
  .panel-body {
    padding: 3px 3px;
  }
  .panel-body h3 {
    text-align: left;
    margin-top: 2%;
    padding-left: 10px;
    font-size: 245%;
  }
  .user-stats {
    margin-top: -2%;
  }
  .all-users {
    background: #11998e;  /* fallback for old browsers */
    color: white !important;
  }
  .active-users {
    background: #2193b0;
    color: white;
  }
  .pending-users {
    background: #db36a4;
    color: white;
  }
  .suspended-users {
    background: #f12711;
    color: white;
  }
  .portlet-title {
    color: black;
    font-size: 175% !important;
    text-transform: capitalize;
  }
  .btn {
    text-transform: capitalize !important;
  }
  .btn-warning {
    border-radius: 4px;
    color: #fff;
    background-color: #f0ad4e !important;
    border-color: #eea236 !important;
  }
  .btn-success {
    border-radius: 4px;
    color: #fff;
    background-color: #4cae4c !important;
    border-color: #4cae4c !important;
  }
  .btn-danger {
    border-radius: 4px;
    color: #fff;
    background-color: #d9534f !important;
    border-color: #d9534f !important;
  }
  #myModal {
    max-height: 80% !important;
    width: 55% !important;
  }
  #myModal h5 {
    text-align: left;
    float: left;
  }
  #myModal .close {
    color: red !important;
  }
  #myModal .close:hover {
    color: red !important;
  }
  .btn-sm, .btn-default {
    padding: 5px 10px !important;
    font-size: 12px !important;
    line-height: 1.5 !important;
    border-radius: 3px !important;
    color: white !important;
  }
  .btn-default {
    color: white !important;
  }
  .btn-default:focus {
    color: white;
  }
</style>

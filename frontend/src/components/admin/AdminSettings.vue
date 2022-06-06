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
                <h5 class="title"><b>Admin Management</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row forum-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-xs-12 col-sm-12">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#home" data-toggle="tab" aria-expanded="false">
                                <span class="visible-xs">Admin Management</span>
                                <span class="hidden-xs"><i class="fas fa-user"></i> Admin Management</span>
                            </a>
                        </li>
                        <li>
                            <a href="#payments" data-toggle="tab" aria-expanded="false">
                                <span class="visible-xs">Payment Gateway</span>
                                <span class="hidden-xs"><i class="fas fa-user"></i> Payment Gateway</span>
                            </a>
                        </li>
                    </ul>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="tab-content">
                      <div class="tab-pane active" id="home">
                        <div>
                          <div class="container-fluid">
                            <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                                <a href="#createModal" data-toggle="modal" class="creation btn btn-sm btn-success z-depth-0"><i class="fas fa-plus"></i> Create Admin</a>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="table-responsive">
                                  <table class="table table-striped">
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>User Name</th>
                                        <th>Status</th>
                                        <th>Last Login</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody v-if="admins.length > 0">
                                      <tr v-for="(ad, index) in admins" :key="ad._id">
                                        <td>
                                          {{ index + 1 }}
                                        </td>
                                        <td>
                                          {{ ad.userName }}
                                        </td>
                                        <td v-if="ad.status == 'active'">
                                          <a class="btn z-depth-0 btn-sm btn-success">
                                            Active
                                          </a>
                                        </td>
                                        <td v-if="ad.status == 'pending'">
                                          <a class="btn z-depth-0 btn-sm btn-warning">
                                            Pending
                                          </a>
                                        </td>
                                        <td>
                                          {{ ad.lastSeen | diffForHumans }}
                                        </td>
                                        <td>
                                          {{ ad.humanTime | diffForHumans }}
                                        </td>
                                        <td>
                                          <div class="btn-group">
                                            <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                            <ul class="dropdown-menu" role="menu">
                                              <li><a data-toggle="modal" href="#editModal" @click.prevent="fetchAdmin(ad)">Edit</a></li>
                                              <li v-if="ad.status == 'pending'"><a @click.prevent="updateStatus(ad, 'active')" href="javascript:void(0)">Make Active</a></li>
                                              <li v-if="ad.status == 'active'"><a href="javascript:void(0)" @click.prevent="updateStatus(ad, 'pending')">Make Inactive</a></li>
                                              <li><a href="javascript:void(0)" @click.prevent="deleteAdmin(ad)">Delete Account</a></li>
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
                      <div class="tab-pane" id="payments">
                        <div>
                          <div class="container-fluid">
                            <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <form action="" @submit.prevent="updatePaystackConfig()">
                                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                                    <h6 class="left-align">Update Paystack Configurations</h6>
                                    <hr>
                                  </div>
                                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                                    <div class="form-group">
                                      <v-text-field required label="Paystack Public Key" solo v-model="paystack.publicKey" type="text"></v-text-field>
                                      <span style="float: left !important;" class="text-info"><i class="fa fa-info-circle"></i> Paystack Public Key</span>
                                    </div>
                                  </div>
                                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                                    <div class="form-group">
                                      <v-text-field required v-model="paystack.secretKey" label="Paystack Secret Key" type="text" solo></v-text-field>
                                      <span style="float: left !important;" class="text-info"><i class="fa fa-info-circle"></i> Paystack Secret Key</span>
                                    </div>
                                  </div>
                                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                                    <button type="submit" class="btn btn-md btn-success btn-block">Update Settings</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
    <div id="createModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Create Admin</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" class="admin-form" @submit.prevent="createAdmin()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="UserName" v-model="admin.userName" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                  <v-select :options="[ { status: 'active', title: 'Active' }, { status: 'pending', title: 'Pending' } ]" label="title" v-model="admin.status" solo placeholder="Account Status"></v-select>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-select multiple :options="roles" label="title" v-model="admin.role" solo placeholder="Admin Roles"></v-select>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field type="password" label="Pasword" v-model="admin.password" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block"><i class="fas fa-check"></i> Create Account</button>
                </div>
              </form>
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
    <div id="editModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Update Admin Profile</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" class="admin-form" @submit.prevent="updateAdmin()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="UserName" v-model="admin.userName" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                  <v-select :options="[ { status: 'active', title: 'Active' }, { status: 'pending', title: 'Pending' } ]" label="title" v-model="admin.status" solo placeholder="Account Status"></v-select>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-select multiple :options="roles" label="title" v-model="admin.role" solo placeholder="Admin Roles"></v-select>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field type="password" label="Pasword" v-model="admin.password" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block"><i class="fas fa-check"></i> Update Account</button>
                </div>
              </form>
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
        await this.fetchAdmins();
        await this.fetchPaystackConfig();
      }
    },
    methods: {
      async fetchPaystackConfig() {
        try {
          let Paystack = await axios.get(this.$baseUrl + '/admin/fetch-paystack-config', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (Paystack.status == 200) {
            this.paystack.secretKey = Paystack.data.data[0].paystackSecretKey;
            this.paystack.publicKey = Paystack.data.data[0].paystackPublicKey;

            return;
          }
        } catch (e) {
          this.paystack.secretKey = '';
          this.paystack.publicKey = '';

          return;
        }
      },
      async updatePaystackConfig() {
        try {
          const PayloadOne = {
            key: 'paystack_secret_key',
            value: this.paystack.secretKey,
            status: true,
          }

          const PayloadTwo = {
            key: 'paystack_public_key',
            value: this.paystack.publicKey,
            status: true
          }

          let paystackOne = await axios.post(this.$baseUrl + '/settings', PayloadOne, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          let paystackTwo = await axios.post(this.$baseUrl + '/settings', PayloadTwo, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (paystackOne.status == 201 && paystackTwo.status == 201) {
            await this.fetchPaystackConfig();

            this.$toast.success('Update Successfully', 'The Configurations For The Payment Gateway Has Been Updated Successfully.', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Update Failed', 'The Configurations For The Payment Gateway Could Not Be Updated Successfully.', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Operation Failed', 'The Configurations For The Payment Gateway Could Not Be Updated.', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchAdmins() {
        try {
          let admin = await axios.get(this.$baseUrl + '/admin/fetch/admin', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (admin.status == 200) {
            this.admins = admin.data.data[0];
            return;
          }

          this.admins = [];
          return;
        } catch (e) {
          this.admins = [];
          return;
        }
      },
      async createAdmin() {
        try {
          this.admin.roles = this.admin.role.map((el) => {
            return el.id;
          });
          this.admin.status = this.admin.status.status;
          let newAdmin = await axios.post(this.$baseUrl + '/admin/create', this.admin, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (newAdmin.status == 201) {
            this.admins.push(newAdmin.data.data[0]);
            this.$toast.success('A New Admin Account Has Been Created For The Selected User.', 'Account Created', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Sorry, An Error Occurred While Trying To Create The Admin Account', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Account Could Not Be Created.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateAdmin() {
        try {
          this.admin.roles = this.admin.role.map((el) => {
            return el.id;
          });
          this.admin.status = this.admin.status.status;
          let updatedAdmin = await axios.post(this.$baseUrl + '/admin/update/admin', this.admin, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (updatedAdmin.status == 200) {
            this.admins = this.admins.filter((el) => {
              if (el.id == this.admin.id) {
                el.userName = updatedAdmin.data.data[0].userName;
                el.status = updatedAdmin.data.data[0].status;
                el.roles = updatedAdmin.data.data[0].roles;
              }

              return el;
            });

            this.$toast.success('The Selected Admin Profile Has Been Updated Succesfully.', 'Account Updated', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('An Unexpected Error And The Account Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Account Could Not Be Created.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateStatus(admin, status) {
        try {
          let updatedStatus = await axios.get(this.$baseUrl + '/admin/update/admin/status/' + admin.userName + '/' + status, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (updatedStatus.status == 200) {
            this.admins = this.admins.map((el) => {
              if (el._id == admin._id) {
                el.status = status;
              }

              return el;
            });

            this.$toast.success('The Selected Admin Status Has Been Updated Succesfully.', 'Account Updated', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Sorry, An Unknown Error Occurred And The Selected Admin Status Could Not Be Verified.');
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Account Could Not Be Created.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async deleteAdmin(admin) {
        try {
          let deletedAccount = await axios.delete(this.$baseUrl + '/admin/delete/admin/' + admin.userName, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (deletedAccount.status == 200) {
            this.admins = this.admins.filter((el) => {
              if (el._id != admin._id) return true;
            });

            this.$toast.success('The Selected Admin Account Has Been Deleted Succesfully.', 'Account Deleted', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('An Unexpected Error Occurred And The Selected Admin Account Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('An Unknown Error Occurred And The Selected Admin Account Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      fetchAdmin(admin) {
        this.admin.id = admin._id;
        this.admin.userName = admin.userName;
        this.admin.status = admin.status;
        for (let i = 0; i < admin.roles.length; i++) {
          switch (admin.roles[i]) {
            case 0:
              this.admin.role.push({ title: 'Super Admin', id: 0 });
              break;
            case 1:
              this.admin.role.push({ title: 'User Management', id: 1 });
              break;
            case 2:
              this.admin.role.push({ title: 'Posts Management', id: 2 });
              break;
            case 3:
              this.admin.role.push({ title: 'Category Management', id: 3 });
              break;
            case 4:
              this.admin.role.push({ title: 'Communication Management', id: 4 });
              break;
            case 5:
              this.admin.role.push({ title: 'Advert Management', id: 5 });
              break;
            case 6:
              this.admin.role.push({ title: 'Location Management', id: 6 });
              break;
            case 7:
              this.admin.role.push({ title: 'Application Settings', id: 7 });
              break;
            default:
              this.admin.role = [];
              break;
          }
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
        admins: [],
        paystack: {
          secretKey: '',
          publicKey: '',
        },
        admin: {
          id: '',
          roles: [],
          role: [],
          status: 'active',
          userName: '',
          password: ''
        },
        roles: [
          { title: 'Super Admin', id: 0 },
          { title: 'User Management', id: 1 },
          { title: 'Posts Management', id: 2 },
          { title: 'Category Management', id: 3 },
          { title: 'Communication Management', id: 4 },
          { title: 'Advert Management', id: 5 },
          { title: 'Location Management', id: 6 },
          { title: 'Application Settings', id: 7 },
        ],
        adminModal: {
          userName: '',
          roles: [],
          status: 'active',
          password: '',
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
.creation {
  text-align: left;
  float: left;
}
.panel {
  border-radius: 8px;
}
.btn-default {
  background: #1ca8dd !important;
  border: 1px solid #1ca8dd !important;
  color: white !important;
}
#editModal {
  max-height: 100% !important;
  width: 35% !important;
}
#createModal {
  max-height: 100% !important;
  width: 35% !important;
}
#deleteModal {
  max-height: 40% !important;
  width: 25% !important;
  overflow-x: hidden;
  overflow-y: hidden;
}
#editModal h5,
#createModal h5,
#deleteModal h5 {
  text-align: left;
  float: left;
  font-size: 120%;
}
#editModal .close,
#createModal .close,
#deleteModal .close {
  color: red !important;
}
#editModal .close:hover,
#createModal .close:hover,
#deleteModal .close:hover {
  color: red !important;
}
#deleteModal .btn-group-sm a,
#createModal a,
#editModal a {
  margin: 2px 5px;
  height: auto;
}
.modal-header {
  height: 11vh;
}
@media (min-width: 320px) {
  #readModal, #createModal, #updatedModal, #editModal, #deleteModal {
    width: 95% !important;
  }
}
</style>

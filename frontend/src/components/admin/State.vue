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
                <h5 class="title"><b>State Management</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row forum-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <router-link :to="{ name: 'AdminContinents' }" aria-expanded="false">
                                <span class="visible-xs">Continents</span>
                                <span class="hidden-xs"><i class="fas fa-user"></i> Continents</span>
                            </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminCountry' }" aria-expanded="false">
                              <span class="visible-xs">Country</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Country</span>
                          </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminStates' }" aria-expanded="false">
                              <span class="visible-xs">State</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> State</span>
                          </router-link>
                        </li>
                    </ul>
                  </div>
                  <div class="col-xs-12 col-sm-12">
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" data-toggle="modal" data-target="#createModal"><i class="fas fa-plus"></i> Create State</a>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Country</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-for="(con, index) in states" :key="con._id">
                          <tr>
                            <td>
                              {{ index + 1 }}
                            </td>
                            <td class="continent-title">
                              {{ con.countrySlug | decodeCountry }}
                            </td>
                            <td>
                              {{ con.name }}
                            </td>
                            <td v-if="con.status == false || con.status == 'false'">
                              <a class="btn z-depth-0 btn-sm btn-small btn-warning">
                                Disabled
                              </a>
                            </td>
                            <td v-else-if="con.status == true || con.status == 'true'">
                              <a class="btn z-depth-0 btn-sm sm btn-small btn-success">
                                Active
                              </a>
                            </td>
                            <td>
                              {{ con.humanTime | diffForHumans }}
                            </td>
                            <td>
                              <div class="btn-group">
                                <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                <ul class="dropdown-menu" role="menu">
                                  <li><a data-toggle="modal" href="#updatedModal" @click.prevent="getCountry(con)">Edit</a></li>
                                  <li v-if="con.status == false || con.status == 'false'"><a href="#readModal" data-toggle="modal" @click.prevent="getCountry(con)">Enable</a></li>
                                  <li v-if="con.status == true || con.status == 'true'"><a href="#readModal" data-toggle="modal" @click.prevent="getCountry(con)">Disable</a></li>
                                  <li><a href="#deleteModal" data-toggle="modal" @click.prevent="getCountry(con)">Delete</a></li>
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

    <div id="createModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Create State</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="createState()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Country Name" v-model="state.countrySlug" solo list="continent-create"></v-text-field>
                    <datalist id="continent-create">
                      <option v-for="(country, index) in countries" :key="index" :value="country.slug">
                        {{ country.name }}
                      </option>
                    </datalist>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="State Name" v-model="state.name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Create State</button>
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
    <div id="updatedModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-edit"></i>Edit <b>{{ modalState.name }}</b> State</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="updateState()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field v-model="modalState.countrySlug" label="Country Name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="State Name" v-model="modalState.name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Country Status" v-model="modalState.status" solo list="status"></v-text-field>
                    <datalist id="status">
                      <option value="True" />
                      <option value="False" />
                    </datalist>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Update State</button>
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
    <div id="readModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title" v-if="modalState.status == true || modalState.status == 'true'"><i class="fas fa-edit"></i>Disable <b></b> Country</h5>
              <h5 class="modal-title" v-if="modalState.status == false || modalState.status == 'false'"><i class="fas fa-edit"></i>Enable <b></b> Country</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <p class="text-warning" v-if="modalState.status == false || modalState.status == 'false'">You Are About To Enable A State. Please Note That All <b>Users</b> Under This <b>State</b> Will Be Activated / Enabled As Well. Hence, This Might Cause Some Unexpected Results!.</p>
              <p class="text-warning" v-if="modalState.status == true || modalState.status == 'true'">You Are About To Disable A State. Please Note That All <b>Users</b> Under This <b>State</b> Will Be Disabled / Deactivated As Well. Hence, This Might Cause Some Unexpected Results!.</p>
              <div class="section"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
              <div class="btn-group-sm">
                <a href="javascript:void(0)" v-if="modalState.status == true || modalState.status == 'true'" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="updateStateStatus(false)">
                  <i class="fas fa-check"></i>
                </a>
                <a href="javascript:void(0)" v-if="modalState.status == false || modalState.status == 'false'" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="updateStateStatus(true)">
                  <i class="fas fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-danger" data-dismiss="modal">
                  <i class="fas fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div><!-- /.modal -->
    <div id="deleteModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-edit"></i>Delete <b>{{ modalState.name }}</b> State</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <p class="text-warning">You Are About To Delete A State. Please Note That All <b>Users</b> Under This <b>State</b> Will Be <b>Deactivated</b>. Hence, This Might Cause Some Unexpected Results!.</p>
              <div class="section"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
              <div class="btn-group-sm">
                <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="deleteState()">
                  <i class="fas fa-check"></i>
                </a>
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
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchStates();
        await this.fetchCountry();
      }
    },
    methods: {
      async fetchCountry() {
        try {
          let countries = await axios.get(this.$baseUrl + '/fetch-all-country', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (countries.status == 200) {
            this.countries = countries.data.data;
          }
        } catch (e) {
          this.countries = [];
          return;
        }
      },
      async fetchStates() {
        try {
          let states = await axios.get(this.$baseUrl + '/fetch/states', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (states.status == 200) {
            this.states = states.data.data[0];
            return;
          }
        } catch (e) {
          this.states = [];
          return;
        }
      },
      async createState() {
        try {
          let state = await axios.post(this.$baseUrl + '/admin/create-state', this.state, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (state.status == 201) {
            this.states.push(state.data[0]);
            this.$toast.success('Your State Has Been Created Succesfully.', 'State Created', this.notificationSystem.options.success);

            return;
          }

          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Request Could Not Be Completed.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          console.log(e);
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your State Could Not Be Created.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateState() {
        try {
          this.modalState.id = this.modalState._id;
          let state = await axios.post(this.$baseUrl + '/admin/update/state', this.modalState, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (state.status == 200) {
            this.states = this.states.map((el) => {
              if (el._id == this.modalState._id) {
                el.name = state.data.name
                el.continentSlug = state.data.countrySlug
                el.status = state.data.status
              }

              return el;
            });
            this.$toast.success('Your State Has Been Updated Succesfully.', 'State Updated', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Request Could Not Be Completed.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          console.log(e);
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your State Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateStateStatus(status) {
        try {
          let stateStatus = await axios.get(this.$baseUrl + '/admin/update/status/state/' + this.modalState._id + '/' + status, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (stateStatus.status == 200) {
            this.states = this.states.map((el) => {
              if (el._id == this.modalState._id) {
                el.status = status;
              }

              return el;
            });

            this.$toast.success('The Selected State Has Been Updated Succesfully.', 'State Updated', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected State Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async deleteState() {
        try {
          let state = await axios.delete(this.$baseUrl + '/admin/delete/state/' + this.modalState.slug, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (state.status == 200) {
            this.states = this.states.filter((el) => {
              if (el._id !== this.modalState._id) return true;
            });

            this.$toast.success('The Selected State Has Been Deleted Succesfully.', 'State Deleted', this.notificationSystem.options.error);
            return;
          }

          this.$toast.error('Sorry, An Unknown Error Occurred And The Selected State Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected State Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async getCountry(state) {
        this.modalState._id = state._id;
        this.modalState.name = state.name;

        this.modalState.countrySlug = state.countrySlug;
        this.modalState.status = state.status;
        this.modalState.slug = state.slug;
        return;
      }
    },
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    computed: {
      fetchAdminAuth() {
        return this.$store.getters.fetchAdminAuth
      },
      fetchAdminStore() {
        return this.$store.getters.fetchAdminStore
      }
    },
    filters: {
      diffForHumans(value) {
        return moment
          .utc(value)
          .local()
          .fromNow()
      },
      decodeCountry(value) {
        let country = value;
        if (country.includes('-')) {
          country = country.split('-').join(' ');
          return country;
        }

        return country;
      }
    },
    async created() {
      await this.$store.dispatch('validateAdminToken');
      if (
        this.fetchAdminAuth.isLoggedIn !== true ||
        this.fetchAdminAuth.role != 'admin' ||
        this.fetchAdminAuth.token == ''
      ) {
        setTimeout(() => {
          this.$router.push({
            name: 'AdminLogin'
          })
        }, 1000);
        return
      }
    },
    data() {
      return {
        countries: [],
        states: [],
        state: {
          name: '',
          status: true,
          countrySlug: '',
        },
        modalState: {
          countrySlug: '',
          status: '',
          slug: '',
          name: ''
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
#createModal {
  height: 75vh !important;
  width: 55% !important;
  overflow-x: hidden;
  overflow-y: hidden;
}
#updatedModal {
  height: auto !important;
  width: 55% !important;
  overflow-x: hidden;
  overflow-y: auto;
}
#deleteModal, #readModal {
  height: 45vh !important;
  width: 45% !important;
  overflow-x: hidden;
  overflow-y: hidden;
}
#createModal h5,
#updatedModal h5,
#delete-modal h5,
#readModal h5 {
  text-align: left;
  float: left;
  font-size: 120%;
}
#createModal p,
#updatedModal p {
  text-align: left;
  font-size: 105%;
  text-transform: capitalize;
}
#deleteModal p,
#readModal p {
  text-align: center;
  font-size: 105%;
  text-transform: capitalize;
}
#createModal .text-muted,
#updatedModal .text-muted,
#deleteModal .text-muted,
#readModal .text-muted {
  background: grey;
  border: 1px solid grey;
  color: white;
  padding: 5px 5px;
  border-radius: 8px;
  width: 45% !important;
}
#createModal .modal-close,
#updatedModal .modal-close,
#deleteModal .modal-close,
#readModal .modal-close {
  color: white !important;
  height: auto !important;
}
#readModal .modal-close:hover,
#updatedModal .modal-close:hover,
#deleteModal .modal-close:hover,
#readModal .modal-close:hover {
  color: white !important;
}
#deleteModal a,
#readModal a {
  margin: 1px 5px;
}
#readModal .btn-group-sm a,
#deleteModal .btn-group-sm a {
  margin: 1px 5px;
}
.modal-header {
  height: 11vh;
}
.continent-title {
  text-transform: capitalize;
}
@media (min-width: 320px) {
  #readModal, #createModal, #updatedModal, #deleteModal {
    width: 95% !important;
  }
}
</style>

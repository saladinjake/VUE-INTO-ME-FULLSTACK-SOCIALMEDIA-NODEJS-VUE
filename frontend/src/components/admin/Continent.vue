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
                <h5 class="title"><b>Continents Management</b></h5>
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
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" data-toggle="modal" data-target="#createModal"><i class="fas fa-plus"></i> Create Continent</a>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="continents.length > 0">
                          <tr v-for="(con, index) in continents" :key="index">
                            <td>
                              {{ index + 1 }}
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
                                  <li><a data-toggle="modal" href="#updatedModal" @click.prevent="getContinent(con)">Edit</a></li>
                                  <li v-if="con.status == false || con.status == 'false'"><a @click.prevent="updateContinentStatus(con, true)">Enable</a></li>
                                  <li v-if="con.status == true || con.status == 'true'"><a @click.prevent="updateContinentStatus(con, false)">Disable</a></li>
                                  <li><a href="#deleteModal" data-toggle="modal" @click.prevent="getContinent(con)">Delete</a></li>
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
              <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Create Continent</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="createContinents()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Continent Name" v-model="continent.name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Create Continent</button>
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
              <h5 class="modal-title"><i class="fas fa-edit"></i>Edit <b>{{ modalContinent.name }}</b> Continent</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="updateContinent()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Continent Name" v-model="continent.name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Continent Name" v-model="continent.status" solo list="status"></v-text-field>
                    <datalist id="status">
                      <option value="True"/>
                      <option value="False"/>
                    </datalist>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Create Continent</button>
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
    <div id="deleteModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-edit"></i>Delete <b>{{ modalContinent.name }}</b> Continent</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <p class="text-warning">You Are About To Delete A Continent. Please Note That All Countries And State Under This Continent Will Be Deleted As Well. Hence, This Might Cause Some Unexpected Results!.</p>
              <div class="section"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
              <div class="btn-group-sm">
                <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="deleteContinent()">
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
        await this.fetchContinents();
      }
    },
    methods: {
      async fetchContinents() {
        try {
          let axiosContinents = await axios.get(this.$baseUrl + '/admin/continents', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (axiosContinents.status == 200) {
            this.continents = axiosContinents.data.data;
            return;
          }
        } catch (e) {
          this.continents = [];
        }
      },
      async createContinents() {
        try {
          let createC = await axios.post(this.$baseUrl + '/admin/create-continent', this.continent, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (createC.status == 201) {
            let continentData = createC.data.data[0];
            this.continents.push(continentData);

            this.$toast.success('The Continent ' + this.continent.name + ' has been created Succesfully.', 'Continent Created', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('')
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Continent Could Not Be Created.');
          return;
        }
      },
      async updateContinent() {
        try {
          this.continent.id = this.modalContinent._id;
          let continent = await axios.post(this.$baseUrl + '/admin/update/continent', this.continent, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (continent.status == 200) {
            this.continents = this.continents.map((el) => {
              if (el._id == this.continent.id) {
                el.name = continent.data.data[0].name
                el.slug = continent.data.data[0].slug
                el.status = continent.data.data[0].status
              }

              return el;
            });

            this.$toast.success('The Selected Continent Has Been Updated Succesfully.', 'Continent Updated', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Sorry, An Unknown Error Occurred And The Continent Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected Continent Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateContinentStatus(continent, status) {
        this.modalContinent = continent;
        try {
          let updatedStatus = await axios.get(this.$baseUrl + '/admin/update/status/continent/' + this.modalContinent._id + '/' + status, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          if (updatedStatus.status == 200) {
            this.continents = this.continents.map((el) => {
              if (el._id == this.modalContinent._id) {
                el.status = status;
              }

              return el;
            });

            this.$toast.success('The Status For The Selected Continent Has Been Updated Succesfully.', 'Continent Updated', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selcted Continent Status Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async deleteContinent() {
        try {
          let deleted = await axios.delete(this.$baseUrl + '/admin/delete/continent/' + this.modalContinent.slug, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (deleted.status == 200) {
            this.continents = this.continents.filter((el) => {
              if (el.slug !== this.modalContinent.slug) return true;
            });

            this.$toast.success('The Selected Continent Has Been Deleted Succesfully.', 'Continent Deleted', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Sorry, An Unknown Error Occurred And The Selected Continent Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected Continent Could Not Be Deleted.', 'Failed To Delete', this.notificationSystem.options.error);
          return;
        }
      },
      async getContinent(continent) {
        this.modalContinent = continent;
        this.continent.name = continent.name
        this.continent.status = continent.status
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
        continents: [],
        continent: {
          name: '',
          status: true
        },
        modalContinent: '',
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
  height: 55vh !important;
  width: 55% !important;
  overflow-x: hidden;
  overflow-y: hidden;
}
#updatedModal {
  height: 85vh !important;
  width: 55% !important;
  overflow-x: hidden;
  overflow-y: hidden;
}
#deleteModal {
  height: 45vh !important;
  width: 45% !important;
  overflow-x: hidden;
  overflow-y: hidden;
}
#createModal h5,
#updatedModal h5,
#delete-modal h5 {
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
#deleteModal p {
  text-align: center;
  font-size: 105%;
  text-transform: capitalize;
}
#createModal .text-muted,
#updatedModal .text-muted,
#deleteModal .text-muted {
  background: grey;
  border: 1px solid grey;
  color: white;
  padding: 5px 5px;
  border-radius: 8px;
  width: 45% !important;
}
#createModal .modal-close,
#updatedModal .modal-close,
#deleteModal .modal-close {
  color: white !important;
  height: auto !important;
}
#readModal .modal-close:hover,
#updatedModal .modal-close:hover,
#deleteModal .modal-close:hover {
  color: white !important;
}
#deleteModal a {
  margin: 1px 5px;
}
.modal-header {
  height: 11vh;
}
@media (min-width: 320px) {
  #readModal, #createModal, #updatedModal, #deleteModal {
    width: 95% !important;
  }
}
</style>

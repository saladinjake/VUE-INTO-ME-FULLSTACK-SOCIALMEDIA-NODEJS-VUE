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
                <h5 class="title"><b>Countries Management</b></h5>
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
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" data-toggle="modal" data-target="#createModal"><i class="fas fa-plus"></i> Create Country</a>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Continent</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-for="(con, index) in countries" :key="con._id">
                          <tr>
                            <td>
                              {{ index + 1 }}
                            </td>
                            <td class="continent-title">
                              {{ con.continentSlug | decodeContinent }}
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
              <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Create Country</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="createCountry()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Continent Name" v-model="country.continentSlug" solo list="continent-create"></v-text-field>
                    <datalist id="continent-create">
                      <option v-for="(continent, index) in continents" :key="index" :value="continent.slug">
                        {{ continent.name }}
                      </option>
                    </datalist>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Country Name" v-model="country.name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Create Country</button>
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
              <h5 class="modal-title"><i class="fas fa-edit"></i>Edit <b>{{ modalCountry.name }}</b> Country</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="updateCountry()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field v-model="modalCountry.continentSlug" label="Continent Name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Country Name" v-model="modalCountry.name" solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Country Status" v-model="modalCountry.status" solo list="status"></v-text-field>
                    <datalist id="status">
                      <option value="True" />
                      <option value="False" />
                    </datalist>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Update Country</button>
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
              <h5 class="modal-title" v-if="modalCountry.status == true || modalCountry.status == 'true'"><i class="fas fa-edit"></i>Disable <b></b> Country</h5>
              <h5 class="modal-title" v-if="modalCountry.status == false || modalCountry.status == 'false'"><i class="fas fa-edit"></i>Enable <b></b> Country</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <p class="text-warning" v-if="modalCountry.status == false || modalCountry.status == 'false'">You Are About To Enable A Country. Please Note That All States Under This <b>Country</b> And It's <b>Users</b> Will Be Activated / Enabled As Well. Hence, This Might Cause Some Unexpected Results!.</p>
              <p class="text-warning" v-if="modalCountry.status == true || modalCountry.status == 'true'">You Are About To Disable A Country. Please Note That All States Under This <b>Country</b> And It's <b>Users</b> Will Be Disabled / Deactivated As Well. Hence, This Might Cause Some Unexpected Results!.</p>
              <div class="section"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
              <div class="btn-group-sm">
                <a href="javascript:void(0)" v-if="modalCountry.status == true || modalCountry.status == 'true'" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="updateCountryStatus(false)">
                  <i class="fas fa-check"></i>
                </a>
                <a href="javascript:void(0)" v-if="modalCountry.status == false || modalCountry.status == 'false'" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="updateCountryStatus(true)">
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
              <h5 class="modal-title"><i class="fas fa-edit"></i>Delete <b>{{ modalCountry.name }}</b> Country</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <p class="text-warning">You Are About To Delete A Country. Please Note That All <b>States</b> Under This Country Will Be Deleted And All Users Under This <b>Country</b> Will Be <b>Deactivated</b>. Hence, This Might Cause Some Unexpected Results!.</p>
              <div class="section"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-lg-12 col-xl-12">
              <div class="btn-group-sm">
                <a href="javascript:void(0)" class="modal-close z-depth-0 btn btn-success" data-dismiss="modal" @click.prevent="deleteCountry()">
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
        await this.fetchCountry();
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
      async createCountry() {
        try {
          let country = await axios.post(this.$baseUrl + '/admin/create-country', this.country, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (country.status == 201) {
            this.countries.push(country.data.data[0]);
            this.$toast.success('Your Country Has Been Created Succesfully.', 'Country Created', this.notificationSystem.options.success);

            return;
          }

          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Request Could Not Be Completed.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Country Could Not Be Created.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateCountry() {
        try {
          this.modalCountry.id = this.modalCountry._id;
          let country = await axios.post(this.$baseUrl + '/admin/update/country', this.modalCountry, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (country.status == 200) {
            this.countries = this.countries.map((el) => {
              if (el._id == this.modalCountry._id) {
                el.name = country.data.data[0].name
                el.continentSlug = country.data.data[0].continentSlug
                el.status = country.data.data[0].status
              }

              return el;
            });
            this.$toast.success('Your Country Has Been Updated Succesfully.', 'Country Updated', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Request Could Not Be Completed.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          console.log(e);
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Country Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async updateCountryStatus(status) {
        try {
          let countryStatus = await axios.get(this.$baseUrl + '/admin/update/status/country/' + this.modalCountry._id + '/' + status, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (countryStatus.status == 200) {
            this.countries = this.countries.map((el) => {
              if (el._id == this.modalCountry._id) {
                el.status = status;
              }

              return el;
            });

            this.$toast.success('The Selected Country Has Been Updated Succesfully.', 'Country Updated', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected Country Could Not Be Updated.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async deleteCountry() {
        try {
          let country = await axios.delete(this.$baseUrl + '/admin/delete/country/' + this.modalCountry.slug, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (country.status == 200) {
            this.countries = this.countries.filter((el) => {
              if (el._id !== this.modalCountry._id) return true;
            });

            this.$toast.success('The Selected Country Has Been Deleted Succesfully.', 'Country Deleted', this.notificationSystem.options.error);
            return;
          }

          this.$toast.error('Sorry, An Unknown Error Occurred And The Selected Country Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected Country Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async getCountry(country) {
        this.modalCountry._id = country._id;
        this.modalCountry.name = country.name;

        this.modalCountry.continentSlug = country.continentSlug;
        this.modalCountry.status = country.status;
        this.modalCountry.slug = country.slug;
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
      decodeContinent(value) {
        let continent = value;
        if (continent.includes('-')) {
          continent = continent.split('-').join(' ');
          return continent;
        }

        return continent;
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
        countries: [],
        country: {
          continentSlug: '',
          name: '',
          status: true
        },
        modalCountry: {
          continentSlug: '',
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

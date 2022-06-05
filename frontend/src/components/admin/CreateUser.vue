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
                <h5 class="title">Create Users </h5>
              </div>
            </div>
          </div>
        </div>
        <!-- end row -->
        <div class="row">
          <div class="container-fluid">
            <div class="row">
              <div class="panel col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                <form action="" method="post" @submit.prevent="create()">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                    <h5 style="text-align: left;"><i class="fas fa-user"></i> User Details</h5>
                    <hr>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.firstName" label="First Name" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.lastName" label="Last Name" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.email" type="email" label="Email Address" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.phone" type="phone" label="Phone Number" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.stageName" label="Stage Name" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 admin-form create-user">
                    <v-select :options="['male', 'female']" label="title" v-model="user.gender" solo placeholder="Gender"></v-select>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.birthDay" type="date" label="Birth Day" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.profession" type="text" label="Profession" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <v-text-field v-model="user.website" label="Website" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                    <h5 style="text-align: left;"><i class="fas fa-map"></i> Location</h5>
                    <hr>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 admin-form create-user location-dropdown">
                    <v-select :options="countries" label="name" v-model="user.country" @input="getstate()" solo placeholder="Country"></v-select>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 admin-form create-user location-dropdown">
                    <v-select :options="states" label="name" v-model="user.state" solo placeholder="State"></v-select>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                    <h5 style="text-align: left;"><i class="fas fa-list"></i> Education & Social Status</h5>
                    <hr>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field v-model="user.education" type="text" label="Education" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field v-model="user.skills" label="Skills" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field v-model="user.address" label="Address" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field v-model="user.facebook" label="Facebook" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field v-model="user.twitter" label="Twitter" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field v-model="user.instagram" label="Instagram" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <v-text-field type="password" v-model="user.password" label="Password" solo></v-text-field>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6 button-padding">
                    <button class="btn btn-block btn-md btn-success" type="submit"><i class="fas fa-check"></i> Update Profile</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- end row -->
      </div>
    </section>
    <AdminFooter></AdminFooter>
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
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      await this.fetchCountries();
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
    methods: {
      async create() {
        // do some validation...
        if (this.user.firstName == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "First Name Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.lastName == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Last Name Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.email == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Last Name Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.phone == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Phone Number Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.stageName == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Stage Name Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.gender == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Gender Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.birthDay == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Birth Day Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.profession == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Profession Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.website == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Website Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.country == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Country Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.state == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "State Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.education == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Education Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.skills == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Skills Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.address == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Address Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.facebook == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Facebook Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.twitter == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Twitter Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.user.instagram == '') {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Instagram Error",
            this.notificationSystem.options.error
          );
          return;
        }

        try {
          let newUser = await axios.post(this.$baseUrl + `/admin/create/user`, this.user, {
            Accept: 'application/json',
            'Naijap-X-Token': this.fetchAdminAuth.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          });

          if (newUser.status = 201) {
            this.$toast.success('An Account Has Been Created Succesfully For ' + newUser.lastName + ' ' + newUser.firstName, 'Account Created', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          console.log(e);
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Account Could Not Be Created. Please, Try Again Later.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchCountries() {
        try {
          let countries = await axios.get(this.$baseUrl + '/fetch-approved-countries');

          if (countries.status == 200) {
            this.countries = countries.data.data[0];
            return;
          }

          this.countries = [];
          return;
        } catch (e) {
          this.countries = [];
          return;
        }
      },
      async getstate() {
        try {
          console.log(this.user.country);
          if (this.user.country !== '') {
            let states = await axios.get(this.$baseUrl + "/find-states-by-country/" + this.user.country.slug);
            if (states.status == 200) {
              this.states = states.data.data[0];
              return;
            }

            this.states = [];
            return;
          }
        } catch (e) {
          this.states = [];
          return;
        }
      },
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
        user: {
          firstName: '',
          lastName: '',
          profession: '',
          email: '',
          website: '',
          phone: '',
          stageName: '',
          gender: '',
          birthDay: '',
          country: '',
          state: '',
          education: '',
          skills: '',
          address: '',
          maritalStatus: '',
          password: ''
        },
        countries: [],
        states: [],
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
h5 {
  font-size: 110%;
}
.button-padding {
  margin-top: 2%;
}
</style>

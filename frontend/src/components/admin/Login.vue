<template id="">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
        <div class="admin-login">
          <div class="wrapper-page animated fadeInDown">
              <div class="panel panel-color panel-primary">
                  <div class="panel-heading">
                     <h3 class="text-center m-t-10 image-header">
                       <router-link to="/">
                         <img style="height:50px" src="../../assets/logo.png" />
                       </router-link>
                     </h3>
                  </div>
                  <form class="form-horizontal m-t-40" @submit.prevent="login()">
                    <div class="container-fluid">
                      <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                          <v-text-field
                            v-model="userName"
                            label="Outlined"
                            placeholder="Username"
                            type="text"
                            single-line
                            solo
                          ></v-text-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                          <v-text-field
                            v-model="password"
                            label="Outlined"
                            placeholder="Password"
                            type="password"
                            single-line
                            solo
                          ></v-text-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 cl-md-12 col-xl-12 col-lg-12">
                          <button type="submit" class="btn btn-md btn-block btn-primary">Login</button>
                        </div>
                      </div>
                    </div>
                  </form>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
const axios = require("axios");
  export default {
    data() {
      return {
        userName: '',
        password: '',
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
    methods: {
      async login() {
        if (this.userName.length < 1) {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Username Error",
            this.notificationSystem.options.error
          );
          return;
        }

        if (this.password.length < 1) {
          this.$toast.error(
            "Sorry, This Field Cannot Be Empty.",
            "Password Error",
            this.notificationSystem.options.error
          );
          return;
        }

        try {
          let adminAuth = await axios.post(this.$baseUrl + '/admin/login', {
            userName: this.userName,
            password: this.password
          }, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (adminAuth.status == 200) {
            this.$toast.success(
            'Login Succesfull... Redirecting You, Please Wait.',
            'Success',
            this.notificationSystem.options.success
            );

            let Payload = {
              token: adminAuth.data.data[0].token,
              userName: adminAuth.data.data[0].userName,
              isLoggedIn: true,
              roles: adminAuth.data.data[0].roles
            }

            this.$store.dispatch("synchronizeAdminStore", Payload);
            setTimeout(() => {
              this.$router.push({
                name: 'AdminDashboard'
              });
            }, 1000);
            return;
          }
        } catch (e) {
          if (e.response !== undefined && e.response !== 'undefined') {
            this.$toast.error(
              'Login Error... Please Check The Username And Password And Try Again.',
              'Login Error',
              this.notificationSystem.options.error
            );
          }
        }
      }
    },
    async created() {
      await this.$store.dispatch("validateAdminToken");
      if (
        this.fetchAdminAuth.isLoggedIn === true &&
        this.fetchAdminAuth.role == "admin" && this.fetchAdminAuth.token !== ''
      ) {
        setTimeout(() => {
          this.$router.push({
            name: 'AdminDashboard'
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
  }

</script>

<style scoped>
  .image-header img {
    width: 65%;
  }
</style>

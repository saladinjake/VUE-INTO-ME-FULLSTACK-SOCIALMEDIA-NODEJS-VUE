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
                <h5 class="title"><b>Advert Settings</b></h5>
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
                    <div class="tab-content">
                      <div class="tab-pane active" id="advert-settings">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                          <form action="" @submit.prevent="updateAdvertSettings()">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                              <h6 class="left-align">Update Advert Settings</h6>
                              <hr>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                              <div class="form-group">
                                <v-text-field required label="Advert Clicks" solo v-model="adSettings.click" type="number"></v-text-field>
                                <span style="float: left !important;" class="text-info"><i class="fa fa-info-circle"></i> Advert Clicks</span>
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                              <div class="form-group">
                                <v-text-field required label="Advert Views" type="number" solo v-model="adSettings.views"></v-text-field>
                                <span style="float: left !important;" class="text-info"><i class="fa fa-info-circle"></i> Advert Views</span>
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
        <!-- End Row -->
      </div>
    </section>
    <AdminFooter></AdminFooter>
  </div>
</template>

<script type="text/javascript">
/* eslint-disable */
  import SideBar from './Aside.vue'
  import AdminHeader from './Header.vue'
  import AdminFooter from './Footer.vue'

  import axios from 'axios'
  import moment from 'moment'
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

  export default {
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchPackages();
        await this.fetchPricing();
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
    methods: {
      async fetchPricing() {
        try {
          let adPriceList = await axios.get(this.$baseUrl + '/admin/advert/pricing/model', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (adPriceList.status == 200) {
            this.adSettings.click = adPriceList.data.data[0].clicks;
            this.adSettings.views = adPriceList.data.data[0].views;

            return;
          }
        } catch (e) {
          this.adSettings.click = 0;
          this.adSettings.views = 0;
        }
      },
      async createPackage() {
        try {
          let advertPackage = await axios.post(this.$baseUrl + '/admin/advert/package', this.adPackage, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (advertPackage.status == 200 || advertPackage.status == 201) {
            this.$toast.success('Package Created', 'Your Advert Package Has Been Created Successfully.', this.notificationSystem.options.success);

            window.location.reload();
            this.adPackages.push(advertPackage.data.data[0]);
            return;
          }

          this.$toast.error('Error Iccurred', 'An Unexpected Error Occurred And Your Operation Could Not Be Completed.', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Operation Failed', 'An Unexpected Error Occurred And Your Advert Package Could Not Be Created.', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchPackages() {
        try {
          let packages = await axios.get(this.$baseUrl + '/admin/fetch/packages', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (packages.status == 200) {
            this.adPackages = packages.data.data[0];
            return;
          }

          this.adPackages = [];
          return;
        } catch (e) {
          this.adPackages = [];
          return;
        }
      },
      async deletePackage(id) {
        try {
          let delPackage = await axios.delete(this.$baseUrl + '/admin/delete/' + id, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          if (delPackage.status == 200) {
            this.$toast.success('Success', 'The Selected Package Has Been Deleted Successfully.', this.notificationSystem.options.success);

            this.adPackages = this.adPackages.filter((el) => {
              if (el._id != id) return true;
            });
            return;
          }

          this.$toast.error('Error Occurred', 'An Unknown Error Occurred And The Package Could Not Be Deleted.', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('Operation Failed', 'An Unknown Error Occurred And The Package Could Not Be Deleted.', this.notificationSystem.options.error);
          return;
        }
      },
      async updateAdvertSettings() {
        try {
          let DataOne = {
            key: 'click',
            value: this.adSettings.click,
            status: true,
          }

          let DataTwo = {
            key: 'views',
            value: this.adSettings.views,
            status: true
          }

          let advertClicks = await axios.post('http://127.0.0.1:3000/', DataOne, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web'
            }
          });

          let advertViews = await axios.post('http://127.0.0.1:3000/', DataTwo, {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'App-X-Token': this.fetchAdminAuth.token,
            'App-Client': 'web'
          });

          if (advertClicks.status == 201 && advertViews.status == 201) {
            this.$toast.success('Settings Saved', 'Your Advert Settings Has Been Saved Successfully.', this.notificationSystem.options.success);

            await this.fetchPricing();
            return;
          }

          this.$toast.error('Error Occurred', 'An Unexpected Error Occured And The Operation Could Not Be Completed.');
          return;
        } catch (e) {
          this.$toast.error('Operation Failed', 'An Unknown Error Occurred And The Settings Could Not Be Saved.', this.notificationSystem.options.error);
          return;
        }
      }
    },
    data() {
      return {
        adPackage: {
          name: '',
          amount: {
            from: '',
            to: ''
          },
          description: '',
          duration: ''
        },
        adPackages: [],
        adSettings: {
          click: '',
          views: '',
        },
        editor: ClassicEditor,
        editorConfig: {},
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
#createModal, #editModal {
  height: 120vh !important;
  max-height: 200vh !important;
  width: 55% !important;
  overflow-x: scroll !important;
  overflow-y: scroll !important;
}
#createModal h5,
#editModal h5 {
  text-align: left;
  float: left;
  font-size: 120%;
}
#createModal p,
#editModal p {
  text-align: left;
  font-size: 105%;
  text-transform: capitalize;
}
#createModal p,
#editModal p {
  text-align: center;
  font-size: 105%;
  text-transform: capitalize;
}
#createModal .text-muted,
#editModal .text-muted {
  background: grey;
  border: 1px solid grey;
  color: white;
  padding: 5px 5px;
  border-radius: 8px;
  width: 45% !important;
}
#createModal .modal-close,
#editModal .modal-close {
  color: white !important;
  height: auto !important;
}
#createModal .modal-close:hover,
#editModal .modal-close:hover {
  color: white !important;
}
#createModal a,
#editModal a, {
  margin: 1px 5px;
}
#createModal .btn-group-sm a,
#editModal .btn-group-sm a {
  margin: 1px 5px;
}
.modal-header {
  height: 20vh;
}
.continent-title {
  text-transform: capitalize;
}
.file-field input.file-path {
  width: 100% !important;
  margin-top: 2% !important;
}
.modal-title {
  margin-top: 45px;
}
.advert-image {
  width: 90px;
}
</style>

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
                <h5 class="title"><b>Contest Management</b></h5>
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
                            <a href="#profile" data-toggle="tab" aria-expanded="false">
                                <span class="visible-xs">Create Contest</span>
                                <span class="hidden-xs"><i class="fas fa-blog"></i> Create Contest</span>
                            </a>
                        </li>
                        <li class="">
                            <a href="#messages" data-toggle="tab" aria-expanded="true">
                                <span class="visible-xs">Manage Contest</span>
                                <span class="hidden-xs"><i class="fas fa-blog"></i>Manage Contest</span>
                            </a>
                        </li>
                    </ul>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="tab-content">
                      <div class="tab-pane active" id="profile">
                        <form action="" method="post" @submit.prevent="createContest()">
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label class="first-label" for="">Contest Title</label>
                              <v-text-field required v-model="contest.contestTitle"
                                label="Contest Title"
                                placeholder="Contest Title"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="">Contest Description</label>
                              <v-text-field required v-model="contest.contestDescription"
                                label="Contest Description"
                                placeholder="Contest Description"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="" style="text-align: left;">Contest Start Date</label>
                              <v-text-field required v-model="contest.contestStartDate"
                                label="Contest Start Date"
                                placeholder="Contest Start Date"
                                type="date"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="" style="text-align: left;">Contest End Date</label>
                              <v-text-field required v-model="contest.contestEndDate"
                                label="Contest End Date"
                                placeholder="Contest End Date"
                                type="date"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                            <h4><i class="fas fa-trophy"></i> Contest Prizes</h4>
                            <hr>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="" style="text-align: left;">Contest First Prize</label>
                              <v-text-field required v-model="contest.contestFirstPrize"
                                label="Contest First Prize"
                                placeholder="Contest First Prize"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="" style="text-align: left;">Contest Second Prize</label>
                              <v-text-field required v-model="contest.contestSecondPrize"
                                label="Contest Second Prize"
                                placeholder="Contest Second Prize"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="" style="text-align: left;">Contest Third Prize</label>
                              <v-text-field required v-model="contest.contestThirdPrize"
                                label="Contest Third Prize"
                                placeholder="Contest Third Prize"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                            <div class="form-group">
                              <label for="" style="text-align: left;">Contest Fourth Prize</label>
                              <v-text-field required v-model="contest.contestFourPrize"
                                label="Contest Fourth Prize"
                                placeholder="Contest Fourth Prize"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                            <div class="form-group">
                              <label for="" class="third-prize-label" style="text-align: left;">Contest Fifth Prize</label>
                              <v-text-field required v-model="contest.contestFivePrize"
                                label="Contest Fifth Prize"
                                placeholder="Contest Fifth Prize"
                                type="text"
                                single-line
                                solo
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                            <button type="submit" class="btn btn-block btn-md btn-success">Create Contest</button>
                          </div>
                        </form>
                      </div>
                      <div class="tab-pane" id="messages">
                        <div class="table-responsive">
                          <table class="table table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Contest</th>
                                <th>Posts</th>
                                <td>Status</td>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody v-if="contests.length > 0">
                              <tr v-for="(contestList, index) in contests" :key="contestList._id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ contestList.title }}</td>
                                <td>{{ contestList.posts }}</td>
                                <td v-if="contestList.status">
                                  <a class="btn z-depth-0 btn-sm btn-small btn-warning">
                                    Ongoing
                                  </a>
                                </td>
                                <td v-else-if="!contestList.status">
                                  <a class="btn z-depth-0 btn-sm btn-small btn-success">
                                    Completed
                                  </a>
                                </td>
                                <td><b>{{ contestList.date.startDate | parseDate }}</b></td>
                                <td><b>{{ contestList.date.endDate | parseDate }}</b></td>
                                <td>
                                  <div class="btn-group">
                                    <button type="button" class="btn z-depth-0 btn-small btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                    <ul class="dropdown-menu" role="menu">
                                      <li><router-link :to="{ name: 'AdminPost' }">View Posts</router-link></li>
                                      <!-- <li><a href="">View Participants</a></li> -->
                                      <li><a href="javascript:void(0)" @click.prevent="markAsCompleted(contestList)">Mark As Completed</a></li>
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
          </div>
        </div>
        <!-- End Row -->
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

  export default {
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        this.fetchContests();
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
      parseDate(dateString) {
        let dateFormat = new Date(dateString)
        dateFormat = dateFormat.toString();

        return dateFormat.split(' ').slice(0, 4).join(' ');
      },
      truncate(value) {
        // Make sure an element and number of items to truncate is provided
        if (!value) return;

        // Get the inner content of the element
        var content = value.trim();

        // Convert the content into an array of words
        // Remove any words above the limit
        if (value.length > 5) {
          content = content.split(' ').slice(0, 3);

          // Convert the array of words back into a string
          content = content.join(' ') + '.....';

          return content;
        }

        return value;
      },
    },
    methods: {
      async createContest() {
        try {
          let contest = await axios.post(this.$baseUrl + '/admin/create/contest', this.contest, {
            headers: {
              Accept: 'application/json',
              'Naijap-X-Token': this.fetchAdminAuth.token,
              'Naijap-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (contest.status == 201) {
            this.$toast.success('Contest Created', 'Your Contest Has Been Created Successfully.', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('Operation Failed', 'An Unexpected Error Occurred And Your Contest Could Not Be Created.', this.notificationSystem.options.error);
          return;
        } catch (e) {
          let errorData = e.response.data;
          if (errorData.status == 409 || e.response.status == 409) {
            this.$toast.error('Contest Error', 'Sorry, There Is Already An Ongoing Contest. Please, Complete The Ongoing Contest In Order To Create A New One.', this.notificationSystem.options.error);
            return;
          }

          this.$toast.error('Contest Error', 'An Unknown Error Occurred And Your Contest Could Not Be Created.', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchContests() {
        try {
          let contests = await axios.get(this.$baseUrl + '/admin/fetch/contest', {
            headers:{
              Accept: 'application/json',
              'Naijap-X-Token': this.fetchAdminAuth.token,
              'Naijap-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (contests.status == 200) {
            this.contests = contests.data.data[0];
            return;
          }

          this.contests = [];
          return;
        } catch (e) {
          this.contests = [];
          return;
        }
      },
      async markAsCompleted(contest) {
        try {
          let isCompleted = await axios.get(this.$baseUrl + '/admin/update/contest/' + contest._id, {
            headers: {
              Accept: 'application/json',
              'Naijap-X-Token': this.fetchAdminAuth.token,
              'Naijap-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (isCompleted.status == 200) {
            this.$toast.success('Successfull', 'The Selected Contest Has Been Marked As Completed. The First 3 Winners Has Also Been Notified.', this.notificationSystem.options.success);

            this.contests = this.contests.map((el) => {
              if (el._id == contest._id) {
                el.status = false;
              }

              return el;
            })
            return;
          }

          if (isCompleted.status !== 200) {
            this.$toast.error('Contest Error', 'An Unexpected Error Occurred And Your Action Could Not Be Saved.', this.notificationSystem.options.error);
            return;
          }
        } catch (e) {
          let errorData = e.response.data;
          if (errorData.status == 400 || e.response.status == 400) {
            this.$toast.error('Contest Error', 'Sorry, An Unexpected Error Occurred And This Contest Could Not Be Marked As Completed.', this.notificationSystem.options.error);
            return;
          }

          this.$toast.error('Contest Error', 'An Unknown Error Occurred And Your Action Could Not Be Saved.', this.notificationSystem.options.error);
          return;
        }
      }
    },
    data() {
      return {
        contest: {
          contestTitle: '',
          contestDescription: '',
          contestStartDate: '',
          contestEndDate: '',
          contestFirstPrize: '',
          contestSecondPrize: '',
          contestThirdPrize: '',
          contestFourPrize: '',
          contestFivePrize: '',
        },
        contests: [],
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
  label {
    text-align: left;
    font-size: 113%;
    margin-left: -72%;
  }
  .first-label {
    margin-left: -80% !important;
  }
  h4 {
    text-align: left;
    font-size: 130%;
  }
  .third-prize-label {
    margin-left: -85%;
  }
  button {
    float: left;
    margin-top: -2%;
  }
  @media (min-width: 320px) {
    label {
      margin-left: -40%;
    }
    .first-label {
      margin-left: -63% !important;
    }
    .third-prize-label {
      margin-left: -48%;
    }
  }
</style>

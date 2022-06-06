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
                <h5 class="title"><b>Posts Management</b></h5>
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
                                <span class="visible-xs">Posts Management</span>
                                <span class="hidden-xs"><i class="fas fa-blog"></i> Posts Management</span>
                            </a>
                        </li>
                        <li class="">
                            <a href="#messages" data-toggle="tab" aria-expanded="true">
                                <span class="visible-xs">Contest Posts</span>
                                <span class="hidden-xs"><i class="fas fa-blog"></i> Contest Posts</span>
                            </a>
                        </li>
                    </ul>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="tab-content">
                      <div class="tab-pane active" id="profile">
                        <div class="row m-t-10" v-if="posts.length > 0">
                          <div class="col-sm-4 posts-panel-user" v-for="post in posts" :key="post._id">
                              <div class="panel z-depth-1">
                                  <div class="panel-body p-t-10">
                                      <div class="media-main">
                                          <a class="pull-left" href="javascript:void(0)">
                                            <template v-if="post.banner !== ''">
                                              <img class="thumb-lg img-circle bx-s" :src="post.banner" :alt="post.title">
                                            </template>
                                          </a>
                                          <div class="pull-right btn-group-sm">
                                              <a href="javascript:void(0)" class=" z-depth-0 btn btn-success " data-placement="top">
                                                  <i class="fas fa-edit"></i>
                                              </a>
                                              <a href="javascript:void(0)" class=" z-depth-0 btn btn-danger">
                                                  <i class="fas fa-times"></i>
                                              </a>
                                          </div>
                                          <div class="info">
                                              <h4 v-html="$options.filters.truncate(post.title)"></h4>
                                              <p class="text-muted" v-html="$options.filters.truncate(post.content)"></p>
                                          </div>
                                      </div>
                                      <div class="clearfix"></div>
                                      <hr/>
                                      <ul class="social-links list-inline p-b-10">
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Likes"><i class="fas fa-thumbs-up grey-text"></i>
                                             <span>{{ post.likes }}</span> </a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Views"><i class="fas fa-eye grey-text"></i>  <span>{{ post.views }}</span></a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Comments"><i class="fas grey-text fa-comment-alt"></i> <span>{{ post.comments }}</span></a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Favourites"><i class="fas fa-heart grey-text"></i> <span>{{ post.favourites }}</span></a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Shares"><i class="fas fa-share grey-text"></i>  <span>{{ post.shares }}</span></a>
                                          </li>
                                      </ul>
                                  </div> <!-- panel-body -->
                              </div> <!-- panel -->
                          </div> <!-- end col -->
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12 pagination-section">
                            <hr>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane" id="messages">
                        <div class="row m-t-10" v-if="contests.length > 0">
                          <div class="col-sm-4 posts-panel-user" v-for="contest in contests" :key="contest._id">
                              <div class="panel z-depth-1">
                                  <div class="panel-body p-t-10">
                                      <div class="media-main">
                                          <a class="pull-left" href="javascript:void(0)">
                                            <template v-if="contest.banner !== ''">
                                              <img class="thumb-lg img-circle bx-s" :src="contest.banner" :alt="contest.title">
                                            </template>
                                          </a>
                                          <div class="pull-right btn-group-sm">
                                              <a href="javascript:void(0)" class=" z-depth-0 btn btn-success " data-placement="top">
                                                  <i class="fas fa-edit"></i>
                                              </a>
                                              <a href="javascript:void(0)" class=" z-depth-0 btn btn-danger">
                                                  <i class="fas fa-times"></i>
                                              </a>
                                          </div>
                                          <div class="info">
                                              <h4 v-html="$options.filters.truncate(contest.title)"></h4>
                                              <p class="text-muted" v-html="$options.filters.truncate(contest.content)"></p>
                                          </div>
                                      </div>
                                      <div class="clearfix"></div>
                                      <hr/>
                                      <ul class="social-links list-inline p-b-10">
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Likes"><i class="fas fa-thumbs-up grey-text"></i>
                                             <span>{{ contest.likes }}</span> </a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Views"><i class="fas fa-eye grey-text"></i>  <span>{{ contest.views }}</span></a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Comments"><i class="fas grey-text fa-comment-alt"></i> <span>{{ contest.comments }}</span></a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Favourites"><i class="fas fa-heart grey-text"></i> <span>{{ contest.favourites }}</span></a>
                                          </li>
                                          <li>
                                            <a title="" data-placement="top" data-toggle="tooltip" class="tooltips" href="#" data-original-title="Shares"><i class="fas fa-share grey-text"></i>  <span>{{ contest.shares }}</span></a>
                                          </li>
                                      </ul>
                                  </div> <!-- panel-body -->
                              </div> <!-- panel -->
                          </div> <!-- end col -->
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12 pagination-section">
                            <hr>
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
        await this.fetchAllPosts();
        await this.fetchAllContests();
      }
    },
    methods: {
      async fetchAllPosts() {
        try {
          let posts = await axios.get(this.$baseUrl + '/admin/fetch/posts/0', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'Naijap-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (posts.status == 200) {
            this.posts = posts.data.data[0];
          }

          if (posts.status !== 200) {
            this.posts = [];
          }
        } catch (e) {
          this.posts = [];
        }
      },
      async fetchAllContests() {
        try {
          let contests = await axios.get(this.$baseUrl + '/admin/fetch/contest/posts/0', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
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
      onChangePage(pageOfItems) {
        this.posts = pageOfItems;
      },
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
    data() {
      return {
        posts: [],
        contests: [],
        contestPosts: [],
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
.bg-picture {
  margin-top: 1%;
  width: 97%;
  margin-left: 2%;
  background-position: center !important;
  background-size: cover !important;
}
.img-wrapper img {
  height: auto;
  width: 100px !important;
}
.box-layout h3,
.box-layout h5 {
  color: white !important;
  margin-left: -40%;
}
.box-layout h5 {
  margin-left: -70%;
}
.wrapper {
  background: #edf0f0 !important;
}
.action-button .btn-primary {
  margin-top: 25%;
  background: #1ca8dd !important;
  border: 1px solid #1ca8dd !important;
}
.user-action ul {
  margin: 0 !important;
  padding: 0 !important;
}
.user-action ul li a {
  color: black !important;
}
.profile-tabs {
  justify-content: flex-start;
}
.profile-desk {
  text-align: left;
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
.btn-status {
  margin-top: -5%;
}
.profile-information h3 {
  text-align: left !important;
  margin-left: -1%;
}
a {
  text-decoration: none !important;
}
td a {
  font-size: 99%;
}
label {
  text-align: left;
}
.posts-panel-user h4 {
  font-size: 125%;
  text-align: left !important;
}
.posts-panel-user .text-muted {
  font-size: 105%;
  text-align: left !important;
}
.posts-panel-user .social-links {
  float: left !important;
}
.posts-panel-user .social-links .fas {
  color: grey !important;
}
.posts-panel-user .pull-right a {
  height: auto !important;
  margin: 0 5px;
}
.pagination-section {
  float: left !important;
  justify-content: flex-start;
}
.pagination-section {
  font-size: 95% !important;
}
.text-white {
  color: white !important;
}
.media-body .ellipsis {
  margin-left: -25%;
}
</style>

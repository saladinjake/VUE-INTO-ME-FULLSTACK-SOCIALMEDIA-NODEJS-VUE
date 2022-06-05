<template>
  <div>
    <SideBar></SideBar>
    <section class="content">
      <AdminHeader></AdminHeader>
      <div class="wrapper">
        <div class="row"
             :style="[profile.cover ? { 'background-image': `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), #1e1e1e73), url(${profile.cover})`, 'background-size': 'cover', 'background-position': 'center' } : '' ]">
          <div class="col-sm-12">
            <div class="bg-picture">
              <div class="box-layout meta bottom">
                <div class="col-sm-6 clearfix">
                  <span class="img-wrapper pull-left m-r-15"><img :src="profile.avatar" alt="Avatar Profile Picture" style="width:64px" class="br-radius"></span>
                  <div class="media-body">
                    <h2 class="text-white mb-2 m-t-10 full_name ellipsis">{{ profile.lastName }} {{ profile.firstName }}</h2>
                    <h5 class="text-white stage_name"> {{ profile.stageName }}</h5>
                  </div>
                </div>
                <div class="col-sm-6 action-button">
                  <div class="pull-right">
                    <div class="dropdown">
                      <a data-toggle="dropdown" class="dropdown-toggle z-depth-0 btn btn-primary" href="#"> Action <span class="caret"></span></a>
                      <ul class="dropdown-menu dropdown-menu-right" role="menu">
                        <li v-if="profile.status == '2' || profile.status == '0'"><a href="javascript:void(0)" @click.prevent="updateStatus(1, profile._id)">Approve</a></li>
                        <li v-if="profile.status == '1'"><a href="javascript:void(0)" @click.prevent="updateStatus(2, profile._id)">Suspend</a></li>
                        <li><a data-toggle="modal" href="#sendUserMailModal">Send Message</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <!--/ meta -->
            </div>
          </div>
        </div>

        <div class="container-fluid">
          <div class="row m-t-30 user-action">
            <div class="col-sm-12">
              <div class="panel panel-default p-0">
                <div class="panel-body p-0">
                  <ul class="nav nav-tabs profile-tabs">
                    <li class="active"><a data-toggle="tab" href="#aboutme">Contact</a></li>
                    <li class=""><a data-toggle="tab" href="#edit-profile">Update Profile</a></li>
                    <li class=""><a data-toggle="tab" href="#posts">Posts</a></li>
                    <li class=""><a data-toggle="tab" href="#password">Change Password</a></li>
                  </ul>

                  <div class="tab-content m-0">
                    <div id="aboutme" class="tab-pane active">
                      <div class="profile-desk">
                        <h1>{{ profile.lastName }} {{ profile.firstName }}</h1>
                        <span class="designation">Account Type: {{ profile.userType }}</span>
                        <p>
                          Last Seen: {{ profile.lastSeen | diffForHumans }}
                        </p>
                        <a class="btn-status btn btn-success m-t-20" v-if="profile.status == 1"> <i class="fa fa-circle"></i> Active</a>
                        <a class="btn-status btn btn-warning m-t-20" v-if="profile.status == 0"> <i class="fa fa-circle"></i> Pending</a>
                        <a class="btn-status btn btn-danger m-t-20" v-if="profile.status == 2"> <i class="fa fa-circle"></i> Suspended</a>

                        <table class="table table-condensed profile-information">
                          <thead>
                            <tr>
                              <th colspan="3">
                                <h3>Profile Information </h3>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><b>Last Name</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.lastName }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>First Name</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.firstName }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Phone</b></td>
                              <td class="ng-binding">
                                <a :href="'tel:' + profile.phone">
                                      {{ profile.phone }}
                                    </a>
                              </td>
                            </tr>
                            <tr>
                              <td><b>Email</b></td>
                              <td>
                                <a :href="'mailto:' + profile.email" class="ng-binding">
                                                        {{ profile.email }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Stage Name</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.stageName }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Gender</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.gender }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Birth Day</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.birthDay }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Country</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.country }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>State</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.state }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Skills</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.skills }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Address</b></td>
                              <td>
                                <a href="javascript:void(0)" class="ng-binding">
                                                        {{ profile.address }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Education</b></td>
                              <td>
                                <a href="#" class="ng-binding">
                                                        {{ profile.education }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Facebook</b></td>
                              <td>
                                <a :href="profile.facebook" target="_blank" class="ng-binding">
                                                        {{ profile.facebook }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Twitter</b></td>
                              <td>
                                <a :href="profile.twitter" target="_blank" class="ng-binding">
                                                        {{ profile.twitter }}
                                                    </a></td>
                            </tr>
                            <tr>
                              <td><b>Instagram</b></td>
                              <td>
                                <a :href="profile.instagram" target="_blank" class="ng-binding">
                                                        {{ profile.instagram }}
                                                    </a></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!-- end profile-desk -->
                    </div>
                    <!-- about-me -->

                    <!-- settings -->
                    <div id="edit-profile" class="tab-pane">
                      <div class="container-fluid">
                        <div class="row">
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                            <form action="" method="post" @submit.prevent="updateProfile()">
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
                                <v-select :options="['male', 'female']" :selected="user.gender" label="title" v-model="user.gender" solo placeholder="Gender"></v-select>
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
                                <h5 style="text-align: left;"><i class="fas fa-list"></i> Location.</h5>
                                <hr>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 admin-form create-user location-dropdown">
                                <v-select :options="countries" label="name" :selected="user.country" v-model="user.country" @input="getstate()" solo placeholder="Country"></v-select>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 admin-form create-user location-dropdown">
                                <v-select :options="states" label="name" :selected="user.state" v-model="user.state" solo placeholder="State"></v-select>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                                <h5 style="text-align: left;"><i class="fas fa-list"></i> Location & Socials.</h5>
                                <hr>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                <v-text-field v-model="user.education" type="text" label="Education" solo></v-text-field>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                <v-text-field v-model="user.skills" label="Skills" solo></v-text-field>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                <v-text-field v-model="user.address" label="Address" solo></v-text-field>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                <v-text-field v-model="user.facebook" label="Facebook" solo></v-text-field>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                <v-text-field v-model="user.twitter" label="Twitter" solo></v-text-field>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                <v-text-field v-model="user.instagram" label="Instagram" solo></v-text-field>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-12 col-xl-4 col-lg-4">
                                <button class="btn btn-block btn-md btn-success" type="submit"><i class="fas fa-check"></i> Update Profile</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- profile -->
                    <div id="posts" class="tab-pane">
                      <div class="row m-t-10" v-if="postsPaginate.length > 0">
                        <div class="col-sm-4 posts-panel-user" v-for="post in postsPaginate" :key="post._id">
                          <div class="panel panel-height z-depth-1">
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
                          <jw-pagination :items="posts" @changePage="onChangePage"></jw-pagination>
                        </div>
                      </div>
                    </div>

                    <!-- password -->
                    <div id="password" class="tab-pane">
                      <div class="container-fluid">
                        <div class="row">
                          <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                            <form method="post" @submit.prevent="changePassword()">
                              <div class="container-fluid">
                                <div class="row">
                                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                      <div class="form-group">
                                        <v-text-field type="password" v-model="password" label="Enter Password" solo></v-text-field>
                                      </div>
                                    </div>
                                    <div class="form-group">
                                      <v-text-field type="password" v-model="confirmPassword" label="Confirm Password" solo></v-text-field>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="container-fluid">
                                <div class="row">
                                  <button type="submit" class="btn btn-md btn-success">Change Password</button>
                                </div>
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
    </section>
    <AdminFooter></AdminFooter>

    <!-- modal Content -->
    <div id="sendUserMailModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-envelope"></i> Email <b>{{ user.lastName }} {{ user.firstName }}</b></h5>
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
  import SideBar from './Aside.vue'
  import AdminHeader from './Header.vue'
  import AdminFooter from './Footer.vue'

  import axios from 'axios'
  import moment from 'moment'
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  export default {
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
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');

      if (this.fetchAdminAuth.token !== '') {
        await this.fetchProfile();
        await this.fetchPosts();
      }
    },
    methods: {
      onChangePage(pageOfItems) {
        this.postsPaginate = pageOfItems;
      },
      async updateStatus(status, userId) {
        try {
          let statusUpdate = await axios.get(this.$baseUrl + '/admin/user/update/status/' + status + '/' + userId, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (statusUpdate.status == 200) {
            this.user.status = status;
            this.profile.status = status;

            this.$toast.success(`${this.user.lastName} ${this.user.firstName} Account Status Has Been Successfully Updated.`, 'Success', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error(`Sorry, An Unexpected Error Occurred And ${this.lastName} ${this.firstName} Account Status Could Not Be Updated.`, 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchProfile() {
        try {
          let profile = await axios.get(this.$baseUrl + `/admin/user/profile/${this.email}`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (profile.status == 200) {
            this.profile = profile.data.data[0]
            this.user = this.profile;
          }
        } catch (e) {
          this.profile = ''
          this.user = '';
        }
      },
      async updateProfile() {
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

        let firstNamePayload = { key: 'firstName', value: this.user.firstName };
        let lastNamePayload = { key: 'lastName', value: this.user.lastName };
        let emailPayload = { key: 'email', value: this.user.email };
        let phoneNumberPayload = { key: 'phone', value: this.user.phone };
        let websitePayload = { key: 'website', value: this.user.website };
        let professionPayload = { key: 'profession', value: this.user.profession };
        let skillsPayload = { key: 'skills', value: this.user.skills };
        let countryPayload = { key: 'country', value: this.user.country };
        let statePayload = { key: 'state', value: this.user.state };
        let stageNamePayload = { key: 'stageName', value: this.user.stageName };
        let genderPayload = { key: 'gender', value: this.user.gender };
        let addressPayoad = { key: 'address', value: this.user.address };
        let birthDayPayload = { key: 'birthDay', value: this.user.birthDay };
        let educationPayload = { key: 'education', value: this.user.education };
        let socialPayload = { key: 'social', value: { facebook: this.user.facebook, twitter: this.user.twitter, instagram: this.user.instagram } };

        await axios.all([
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, firstNamePayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, lastNamePayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, emailPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, phoneNumberPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, websitePayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, professionPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, skillsPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, countryPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, statePayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, stageNamePayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, genderPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, addressPayoad, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, birthDayPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, educationPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }),
          axios.post(`${this.$baseUrl}/admin/user/profile/update/${this.user._id}`, socialPayload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          })
        ])
        .then(axios.spread((firstNameData, lastNameData, emailData, phoneNumberData, websiteData, professionData, skillsData, countryData, stateData, stageNameData, genderData, addressData, birthDayData, educationData, socialData) => {
          // Both requests are now complete
          this.$toast.success('The Selected User\'s Profile Has Been Updated Successfully.', 'Profile Updated', this.notificationSystem.options.success);
          return;
        })).catch((e) => {
          this.$toast.warning('An Unexpected Error Occurred While Updating The User\'s Profile.', 'Update Error', this.notificationSystem.options.warning);
          return;
        });
      },
      async fetchPosts() {
        try {
          let posts = await axios.get(this.$baseUrl + `/admin/user/posts/${this.user._id}`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          console.log(posts.data.data);
          if (posts.status == 200) {
            this.posts =  posts.data.data[0];
            this.postsPaginate = posts.data.data[0];
          }

          if (posts.status !== 200) {
            this.posts = [];
            this.postsPaginate = []
          }
          return;
        } catch (e) {
          this.posts = [];
          this.postsPaginate = [];
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
      async changePassword() {
        try {
          if (this.password.length < 1) {
            this.$toast.error('Please, Fill In A Password.', 'Password Cannot Be Empty.', this.notificationSystem.options.error);
            return;
          }

          if (this.confirmPassword.length < 1) {
            this.$toast.error('Confirm Password Cannot Be Empty', 'Please, Confirm The Password In Order To Continue.', this.notificationSystem.options.error);
            return;
          }

          if (this.password !== this.confirmPassword) {
            this.$toast.error('Password Does Not Match.', 'Please, Confirm The Password', this.notificationSystem.options.error);
            return;
          }

          let changedPassword = await axios.post(this.$baseUrl + '/admin/change/password/' + this.user.email, {
            password: this.confirmPassword
          }, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (changedPassword.status == 200) {
            this.$toast.success('The Password Has Been Changed Successfully', 'Password Changed', this.notificationSystem.options.success);
            return;
          }

          this.$toast.error('An Unknown Error Occurred And This User\'s Password Could Not Be Changed.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        } catch (e) {
          this.$toast.error('An Unexpected Error Occurred And Your Password Could Not Be Changed.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      }
    },
    data() {
      return {
        email: this.$route.params.email,
        profile: '',
        password: '',
        confirmPassword: '',
        countries: [],
        states: [],
        posts: [],
        postsPaginate: [],
        emailSubject: '',
        editor: ClassicEditor,
        editorData: "<p>Write Something...</p>",
        editorConfig: {},
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
          maritalStatus: ''
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
  #sendUserMailModal {
    max-height: 80% !important;
  }
  #sendUserMailModal h5 {
    text-align: left;
    float: left;
  }
  #sendUserMailModal .close {
    color: red !important;
  }
  #sendUserMailModal .close:hover {
    color: red !important;
  }
  h5 {
    font-size: 115%;
  }
  .panel-height {
    height: 95%;
  }
  @media(min-width: 320px) {
    #sendUserMailModal {
      background: white !important;
      width: 95% !important;
      overflow-x: scroll !important;
    }
    .full_name {
      margin-left: -40% !important;
      font-size: 200%;
      font-weight: bold;
    }
    .stage_name {
      margin-left: -65% !important;
      font-weight: bold;
    }
    .profile-tabs a {
      font-size: 94% !important;
    }
  }
</style>

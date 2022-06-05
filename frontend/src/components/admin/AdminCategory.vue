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
                <h5 class="title" v-if="type == 'forums'"><b>Forum Categories</b></h5>
                <h5 class="title" v-if="type == 'media'"><b>Media Categories</b></h5>
                <h5 class="title" v-if="type == 'user-types'"><b>User Type Categories</b></h5>
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
                            <router-link :to="{ name: 'AdminCategory', params: { category: 'forums' } }" aria-expanded="false">
                                <span class="visible-xs">Forums Category</span>
                                <span class="hidden-xs"><i class="fas fa-user"></i> Forums Category</span>
                            </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminCategory', params: { category: 'media' } }" aria-expanded="false">
                              <span class="visible-xs">Posts Category</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Posts Category</span>
                          </router-link>
                        </li>
                        <li class="">
                          <router-link :to="{ name: 'AdminCategory', params: { category: 'user-types' } }" aria-expanded="false">
                              <span class="visible-xs">Users Category</span>
                              <span class="hidden-xs"><i class="fas fa-user"></i> Users Category</span>
                          </router-link>
                        </li>
                    </ul>
                  </div>
                  <div class="col-xs-12 col-sm-12">
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" v-if="type == 'forums'" data-toggle="modal" data-target="#createModal"><i class="fas fa-edit"></i> Create Forum</a>
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" v-if="type == 'media'" data-toggle="modal" data-target="#createModal"><i class="fas fa-edit"></i> Create Media</a>
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" v-if="type == 'user-types'" data-toggle="modal" data-target="#createModal"><i class="fas fa-edit"></i> Create User Types</a>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Date Created</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody v-if="categories.length > 0">
                          <tr v-for="(cat, index) in categories"  :key="cat._id">
                            <td>
                              {{ index + 1 }}
                            </td>
                            <td>
                              {{ cat.name }}
                            </td>
                            <td>
                              {{ cat.humanTime | diffForHumans }}
                            </td>
                            <td>
                              <div class="btn-group">
                                <button type="button" class="btn z-depth-0 btn-small btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
                                <ul class="dropdown-menu" role="menu">
                                  <li><a data-toggle="modal" href="#myModal" @click.prevent="fetchCategory(cat)">Edit</a></li>
                                  <li><a data-toggle="modal" href="#deleteModal" @click.prevent="fetchCategory(cat)">Delete</a></li>
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

    <!-- modal Content -->
    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-edit"></i> Update <b>{{ category.name }}</b></h5>
              <button type="button" class="close text-danger" style="color: red;" data-dismiss="modal" aria-hidden="true"><i class="fas fa-times"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="updateCategory()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field v-model="updateTitle"
                      label="Outlined"
                      placeholder="Forum Title"
                      type="text"
                      single-line
                      solo
                    ></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-block btn-md btn-success"><i class="fas fa-paper-plane"></i> Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div><!-- /.modal -->

    <div id="createModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <h5 class="modal-title"><i class="fas fa-edit"></i> Create Category</h5>
              <button type="button" class="close text-danger" style="color: red;" data-dismiss="modal" aria-hidden="true"><i class="fas fa-times"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="createCategory()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field v-model="categoryTitle"
                      label="Outlined"
                      placeholder="Category Title"
                      type="text"
                      single-line
                      solo
                    ></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-block btn-md btn-success"><i class="fas fa-paper-plane"></i> Create Category</button>
                </div>
              </form>
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
              <h5 class="modal-title"><i class="fas fa-edit"></i> Delete <b>{{ category.name }} Category</b></h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <p class="text-warning">Are You Sure You Want To Delete This Category? Once Done, This Cannot Be Reversed.</p>
              <div class="section"></div>
              <div class="btn-group-sm">
                <a href="javascript:void(0)" class=" z-depth-0 btn btn-success " @click.prevent="deleteCategory()">
                    <i class="fas fa-check"></i>
                </a>
                <a href="javascript:void(0)" class=" z-depth-0 btn btn-danger" data-dismiss="modal">
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
        await this.fetchCategories();
      }
    },
    watch: {
      async $route(to, from) {
        this.type = to.params.category
        switch (this.type) {
          case 'user-types':
            this.pageTitle = 'User Categories';
            await this.fetchCategories();
            break
          case 'forums':
            this.pageTitle = 'Forum Categories'
            await this.fetchCategories();
            break;
          case 'media':
            this.pageTitle = 'Posts Categories';
            await this.fetchCategories();
          break;
          default:
            this.pageTitle = '';
          break;
        }
      }
    },
    methods: {
      onChangePage(pageOfItems) {
        this.accounts = pageOfItems;
      },
      fetchCategory(category) {
        this.category = category;
      },
      async deleteCategory() {
        try {
          let deleteCategory = await axios.delete(this.$baseUrl + '/admin/delete/category/' + this.type + '/' + this.category._id, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (deleteCategory.status == 200) {
            this.categories = this.categories.filter((el) => {
              if (el._id != this.category._id) return true;
            });

            this.$toast.success('The Selected Category Has Been Deleted Succesfully.', 'Succesfully Deleted', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And The Selected Category Could Not Be Deleted.', 'Operation Failed', this.notificationSystem.options.error);
          return;
        }
      },
      async createCategory() {
        if (this.categoryTitle.trim() == '') {
          this.$toast.error('Sorry, This Field Cannot Be Empty.', 'Category Error', this.notificationSystem.options.error);
          return;
        }
        try {
          let Payload = {
            name: this.categoryTitle
          }
          let category = await axios.post(this.$baseUrl + '/admin/create/categories/' + this.type, Payload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (category.status == 201) {
            this.categories.unshift(category.data.data[0]);

            this.$toast.success('Your Category Has Been Created Successfully.', 'Category Created.', this.notificationSystem.options.success);

            this.categoryTitle = '';
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Category Could Not Be Created.', 'Operation Failed.', this.notificationSystem.options.error);
          return;
        }
      },
      async updateCategory() {
        if (this.updateTitle.trim() == '') {
          this.$toast.error('Sorry, This Field Cannot Be Empty.', 'Category Error', this.notificationSystem.options.error);
          return;
        }
        try {
          let Payload = {
            _id: this.category._id,
            name: this.updateTitle
          }
          let cat = await axios.post(this.$baseUrl + '/admin/update/categories/' + this.type, Payload, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (cat.status == 200) {

            this.categories = this.categories.map((el) => {
              console.log(el, this.category);
              if (el._id == this.category._id) {
                el.name = this.updateTitle;
              }

              return el;
            });

            this.$toast.success('Your Category Has Been Updated Successfully.', 'Category Updated.', this.notificationSystem.options.success);

            this.updateTitle = '';
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occurred And Your Category Could Not Be Updated.', 'Operation Failed.', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchCategories() {
        try {
          let categories = await axios.get(this.$baseUrl + `/admin/fetch/categories/${this.type}`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (categories.status == 200) {
            this.categories = categories.data.data[0];
          }
        } catch (e) {
          this.categories = [];
          return;
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
        type: this.$route.params.category,
        category: '',
        pageTitle: '',
        categoryTitle: '',
        updateTitle: '',
        categories: [],
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
  .forum-tables h3 {
    color: black;
    font-size: 195% !important;
  }
  .panel {
    border-radius: 8px;
  }
  .btn-default {
    background: #1ca8dd !important;
    border: 1px solid #1ca8dd !important;
    color: white !important;
  }
  #myModal {
    max-height: 50% !important;
    width: 35% !important;
  }
  #createModal {
    max-height: 50% !important;
    width: 35% !important;
  }
  #deleteModal {
    max-height: 40% !important;
    width: 25% !important;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  #myModal h5,
  #createModal h5,
  #deleteModal h5 {
    text-align: left;
    float: left;
    font-size: 120%;
  }
  #myModal .close,
  #createModal .close,
  #deleteModal .close {
    color: red !important;
  }
  #myModal .close:hover,
  #createModal .close:hover,
  #deleteModal .close:hover {
    color: red !important;
  }
  #deleteModal .btn-group-sm a {
    margin: 2px 5px;
    height: auto;
  }
  .modal-header {
    height: 11vh;
  }
  @media(min-width: 320px) {
    .nav-tabs li {
      margin: 2px 4px !important;
    }
    #myModal, #createModal, #deleteModal {
      max-height: 50% !important;
      width: 75% !important;
    }
  }
</style>

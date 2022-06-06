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
                <h5 class="title"><b>Manage Groups</b></h5>
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
                    <a class="btn btn-sm btn-success z-depth-0 left-align pull-left" data-toggle="modal" data-target="#createModal"><i class="fas fa-plus"></i> Create Group</a>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Admin</th>
                            <th>Posts Count</th>
                            <th>Users Count</th>
                            <th>Date Created</th>
                          </tr>
                        </thead>
                        <tbody v-if="groups.length > 0">
                          <tr v-for="(groupList, index) in groups" :key="groupList._id">
                            <td>
                              <b>{{ index + 1 }}</b>
                            </td>
                            <td><b>{{ groupList.groupName }}</b></td>
                            <td v-if="groupList.admin !== ''"><b>{{ groupList.admin }}</b></td>
                            <td v-else><b>Naijap</b></td>
                            <td><b>{{ groupList.posts }}</b></td>
                            <td><b>{{ groupList.users }}</b></td>
                            <td><b>{{ groupList.humanTimestamp | diffForHumans }}</b></td>
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
              <h5 class="modal-title"><i class="fas fa-plus text-success"></i> Create Group</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <form action="" @submit.prevent="createGroup()">
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <v-text-field label="Group Name" v-model="group.groupName" required solo></v-text-field>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <div class="file-field input-field">
                      <div class="btn">
                        <span>Upload Banner</span>
                        <input type="file" @change="pickFile()" required id="banner-creation" ref="fileInput">
                      </div>
                      <div class="file-path-wrapper">
                        <input class="file-path validate" type="text">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <div class="form-group">
                    <ckeditor :editor="editor" required v-model="group.groupDescription" :config="editorConfig"></ckeditor>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                  <button type="submit" class="btn btn-md btn-success btn-block">Create Group</button>
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
    data () {
      return {
        group: {
          groupName: '',
          groupDescription: ''
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
        },
        editor: ClassicEditor,
        editorConfig: {},
        groups: []
      }
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        await this.fetchAllGroups();
      }
    },
    methods: {
      pickFile() {
        if (
          this.$refs.fileInput.files[0].type !== "image/jpeg" &&
          this.$refs.fileInput.files[0].type !== "image/png" &&
          this.$refs.fileInput.files[0].type !== "image/jpg"
        ) {
          this.$toast.error(
            "Picture Format",
            "Sorry, Only Jpeg, Jpg, and Png Images are allowed. Please Upload Another File!",
            this.notificationSystem.options.error
          );
          return false;
        }

        this.$toast.success('File Uploaded', 'Your File Has Been Selected Successfully', this.notificationSystem.options.success);
        return;
      },
      async createGroup() {
        let bannerInterval = '';
        try {
          // Upload the group banner image...
          if (
            this.$refs.fileInput.files[0].type !== "image/jpeg" &&
            this.$refs.fileInput.files[0].type !== "image/png" &&
            this.$refs.fileInput.files[0].type !== "image/jpg"
          ) {
            this.$toast.error(
              "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
              "Picture Format",
              this.notificationSystem.options.error
            );
            return false;
          }

          // Form Data...
          const Data = new FormData();
          Data.append('image', this.$refs.fileInput.files[0]);

          // Init the group payload....
          let groupId = await axios.get(this.$baseUrl + '/initialize/group-admin', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

           bannerInterval = setInterval(() => {
            this.$toast.info('Uploading Banner', 'Your Banner Is Being Uploaded. Please Wait.', this.notificationSystem.options.success);
            return;
          }, 3000);

          // make an http request to save the banner and create the group...
          let groupBanner = await axios.post(this.$baseUrl + '/image-upload-admin-group/group/' + groupId.data.data[0]._id, Data, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          // upload the group content...
          let groupContent = await axios.post(this.$baseUrl + '/update-group-admin/' + groupId.data.data[0]._id, this.group, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (groupContent.status == 201) {
            this.$toast.success('Group Created', 'Your Group Has Been Created Successfully. Reloading Please Wait!', this.notificationSystem.options.success);
            clearInterval(bannerInterval);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            return;
          }

          this.$toast.error('Error Occurred', 'An Unknown Error Occurred And The Group Could Not Be Created.', this.notificationSystem.options.error);
          return;
        } catch (e) {
          console.log(e);
          this.$toast.error('Operation Failed', 'Sorry, An Error Occurred And Your Group Could Not Be Created.', this.notificationSystem.options.error);
          clearInterval(bannerInterval);
          return;
        }
      },
      async fetchAllGroups() {
        try {
          let groups = await axios.get(this.$baseUrl + '/fetch-all-groups-admin', {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (groups.status == 200) {
            this.groups = groups.data.data[0];
            return;
          }
        } catch (e) {
          this.groups = [];
          return;
        }
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
          .fromNow();
      },
    }
  }
</script>

<style scoped>
#createModal {
  height: 95vh !important;
  width: 55% !important;
  overflow-x: hidden;
  overflow-y: auto;
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
@media(min-width: 320px) {
  #createModal, #updatedModal, #deleteModal, #readModal {
    width: 95% !important;
  }
}
</style>

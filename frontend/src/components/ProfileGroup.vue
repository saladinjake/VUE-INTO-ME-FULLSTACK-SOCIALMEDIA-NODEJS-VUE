<template>
  <div>
    <template v-if="userGroups.length > 0">
      <div class="feed-body group-list-order" v-for="ugroup in userGroups" :key="ugroup._id" style="margin: 5px 5px; cursor: default !important;">
        <div class="feed-grid-inner">
          <img class="feed-avatar" :src="ugroup.banner" />
          <div class="feed-name">
            {{ ugroup.groupName}}
          </div>
        </div>
        <h5 class="feed-text feed-text-header" style="position: relative; left: 10.4%; margin-top: -5%;">Group Description</h5>
        <br>
        <div class="feed-text" style="margin-top: -5%;" v-html="ugroup.groupDescription"></div>
        <div class="feed-text" style="margin-top: -3%;">
          <ul>
            <li><b>Total Users: {{ ugroup.users }}</b></li>
            <li><b>Total Posts: {{ ugroup.posts }}</b></li>
          </ul>
        </div>
        <div class="feed-text">
          <ul class="btn-mobile-group show-on-small">
            <li @click.prevent="openCreateModal(ugroup)"><div class="left-btn mobile-group-btn">Update Group</div></li>
            <li @click.prevent="deleteGroup(ugroup._id)"> <div class="left-btn mobile-group-btn">Delete Group</div></li>
          </ul>
        </div>
        <div class="padding-b"></div>
      </div>
      <div class="padding-b"></div>
    </template>
    <template v-else>
      <div class="feed-body" style="margin: 5px 5px;">
        <div class="feed-grid-inner">
          <div class="feed-name" style="text-align: center !important;">
            <br>
            <p class="group-feed-error">Oops! Sorry, There Are No Groups To Show At This Time. <br> Please, Create A Group To Continue.</p>
          </div>
        </div>
      </div>
    </template>

      <!-- Update Group Modal... -->
     <modal name="update-group" class="mobile-group-modal" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Create Group</h5>
      <hr>
      <form action="" @submit.prevent="createGroup()">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <v-text-field label="Group Name" v-model="group.groupName" required solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
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
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
          <img :src="group.groupBanner" :alt="group.groupBanner" style="width: 150px; height: 150px;">
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <ckeditor :editor="editor" required v-model="group.groupDescription" :config="editorConfig"></ckeditor>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Update Group</button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
const axios = require("axios");
import eventBus from "@/mixins/EventsMixins";
import Multiselect from "vue-multiselect";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  props: {
    AuthState: {
      type: Object,
      required: true
    },
    UserState: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {},
      userGroups: [],
      nonGroups: [],
      group: {
        groupId: '',
        groupName: '',
        groupBanner: '',
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
    }
  },
  computed: {
    fetchAuthState() {
      return this.$store.getters.fetchAuthStore;
    },
    fetchUserState() {
      return this.$store.getters.fetchUserStore;
    }
  },
  async mounted() {
    this.$store.dispatch("callLocalStore");

    // await this.fetchAllGroups();data-toggle="modal" data-toggle="modal" data-target="#updateGroupModal"data-target="#updateGroupModal"
    await this.fetchUserCreatedGroups();
  },
  methods: {
    openCreateModal(ugroup) {
      // Set Data Properties...
      this.group.groupId = ugroup._id;
      this.group.groupName = ugroup.groupName;
      this.group.groupBanner = ugroup.banner;
      this.group.groupDescription = ugroup.groupDescription;

      // Show The Modal...
      this.$modal.show('update-group');
    },
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
    async fetchAllGroups() {
      try {
        let groups = await axios.get(this.$baseUrl + '/fetch-all-groups-user', {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (groups.status == 200) {
          this.nonGroups = groups.data.data[0];
          return;
        }
      } catch (e) {
        this.nonGroups = [];
        return;
      }
    },
    async joinGroup(Payload) {
      try {
        let jGroup = await axios.get(this.$baseUrl + '/join-group/' + Payload._id, {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (jGroup.status == 201) {
          this.$toast.success('Successfull', 'You have been added to the group Successfully.', this.notificationSystem.options.success);
          this.nonGroups = this.nonGroups.map((el) => {
            if (el._id == Payload._id) {
              el.member = true;
            }

            return el;
          });

          // Open The Group....
          setTimeout(() => {
            this.$router.push({
              name: 'GroupFeeds',
              params: {
                groupId: Payload._id
              }
            });
          }, 3000);
          return;
        }
      } catch (e) {
        console.log(e);
        this.$toast.error('Error Occurred', 'An Unknown Error Occurred And Your Request Could Not Be Completed.', this.notificationSystem.options.error);
        return;
      }
    },
    async leaveGroup(Payload) {
      try {
        let exit = await axios.get(this.$baseUrl + '/leave-group/' + Payload._id, {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (exit.status == 200) {
          this.$toast.success('Successfull', 'You Have Been Removed From The Group Successfully.', this.notificationSystem.options.success);
          this.nonGroups = this.nonGroups.map((el) => {
            if (el._id == Payload._id ) {
              el.member = false;
            }

            return el;
          });
          return;
        }
      } catch (e) {
        this.$toast.error('Error Occurred', 'An Unknown Error Occurred And Your Request Could Not Be Completed.', this.notificationSystem.options.error);
        return;
      }
    },
    async fetchUserCreatedGroups() {
      try {
        let createdGroups = await axios.get(this.$baseUrl + '/fetch-created-user-group', {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        console.log(createdGroups, 'Fetching Created Groups.');
        if (createdGroups.status == 200) {
            this.userGroups = createdGroups.data.data[0];
            return;
        }
      } catch (e) {
        this.userGroups = [];
        return;
      }
    },
    async belongsToGroup() {
      try {
        let belongsToGroup = await axios.get(this.$baseUrl + '/fetch-belongs-to-group', {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        console.log(belongsToGroup);

        if (belongsToGroup.status == 200) {
          this.userGroups.push(belongsToGroup.data.data[0]);
          return;
        }
      } catch (e) {/* Fail Silently... */}
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

        let groupBanner = '';

        if (this.$refs.fileInput.files[0]) {
          // Form Data...
          const Data = new FormData();
          Data.append('image', this.$refs.fileInput.files[0]);

          // Set A Banner Interval...
          bannerInterval = setInterval(() => {
            this.$toast.info('Uploading Banner', 'Your Banner Is Being Uploaded. Please Wait.', this.notificationSystem.options.success);
            return;
          }, 3000);

          // make an http request to save the banner and create the group...
          groupBanner = await axios.post(this.$baseUrl + '/image-upload/group/' + this.group.groupId, Data, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
        }

        // upload the group content...
        let groupContent = await axios.post(this.$baseUrl + '/update-group-client/' + this.group.groupId, this.group, {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (groupContent.status == 200) {
          this.$toast.success('Group Updated', 'Your Group Has Been Updated Successfully. Reloading Please Wait!', this.notificationSystem.options.success);
          clearInterval(bannerInterval);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return;
        }

        this.$toast.error('Error Occurred', 'An Unknown Error Occurred And The Group Could Not Be Updated.', this.notificationSystem.options.error);
        return;
      } catch (e) {
        console.log(e);
        this.$toast.error('Operation Failed', 'Sorry, An Error Occurred And Your Group Could Not Be Updated.', this.notificationSystem.options.error);
        clearInterval(bannerInterval);
        return;
      }
    },
    async deleteGroup(groupId) {
      try {
        let exit = await axios.delete(this.$baseUrl + '/delete-group/' + groupId, {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (exit.status == 200) {
          this.$toast.success('Successfull', 'You Have Sucessfully Deleted The Group.', this.notificationSystem.options.success);
          this.userGroups = this.userGroups.filter((el) => {
            if (el._id !== groupId) return true;
          });
          
          return;
        }
      } catch (e) {
        console.log(e);
        this.$toast.error('Error Occurred', 'An Unknown Error Occurred And Your Request Could Not Be Completed.', this.notificationSystem.options.error);
        return;
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
#overlay-post {
 position: fixed;
 display: none;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, 0.5);
 z-index: 2;
}

.avatarModal {
 z-index: 10000 !important;
}

.avatarModal .button-groups ul {
 list-style: none;
 display: flex;
 padding-left: 5px !important;
 padding-right: 5px !important;
 padding-top: 30px !important;
}

.avatarModal .file-block {
 margin-left: 3%;
 margin-top: 10%;
 margin-bottom: 5%;
 z-index: 10000 !important;
}

.preloader-wrapper.big {
 width: 50px !important;
 height: 50px !important;
 position: absolute !important;
 /* top: 50% ; */
 left: 54% !important;
 top: 50% !important;
}
.image-feed {
 min-height: 333px !important;
 max-height: 589px !important;
 width: 95% !important;
}
.textfield-container,
.modal-contents,
.item-text {
 background: white !important;
}
.feed-text-header {
 font-size: 125% !important;
 font-weight: bold;
}
.news-modal {
 margin-top: -8% !important;
}
.news-modal .news-feed {
 background: white;
}
.v--modal-box {
 width: 63% !important;
 height: auto !important;
 overflow-y: scroll !important;
}
.feed-list-modal {
 margin-left: -23%;
 margin-right: auto;
 width: 100%;
}
.feed-listing {
 width: 137%;
}
.related-news {
 margin-right: -16%;
 width: 100%;
 text-align: justify;
}
.related-news h4 {
 font-size: 200%;
 color: green !important;
 text-decoration: underline;
}
.related-news .relations ul li {
 margin: 10px 0px;
}
.related-news .relations ul li img {
 border-radius: 4px;
 vertical-align: middle;
}
.related-news .relations ul li span {
 width: 100%;
}
.related-news .relations ul li small ul {
 display: flex;
}
.related-news .relations ul li small ul li {
 margin-left: 0px;
 margin-right: 10px;
}
.padding-b {
  padding-bottom: 1px;
}
.group-feed-error {
  text-align: center;
  width: 100%;
  margin-left: 42%;
  cursor: default;
}
#updateGroupModal {
  height: auto !important;
  background: none !important;
}
@media (min-width:320px) {
  .mobile-group-btn {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 20px;
  }
  .btn-mobile-group {
    display: flex;
    margin-left: 0% !important;
  }
  .group-top-action {
    height: 15vh !important;
  }
  .group-top-action .feed-name {
    margin-left: -30% !important;
  }
  .group-list-order .feed-text-header {
    margin-top: 2px !important;
    margin-left: -9%;
  }
  .mobile-group-modal .v--modal-box {
    width: 50% !important;
  }
}
</style>

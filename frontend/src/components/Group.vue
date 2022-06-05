<template>
  <div>
    <div class="a-feed" style="margin-top: 2%;">
      <div class="feed-body group-top-action">
        <div class="feed-grid-inner" style="margin-bottom: -142px;">
          <div class="feed-name" style="margin-left: -20%;">
            <img src="../assets/create-group-icon.png" /> Your Naijap Groups
            <div class="left-btn hide-on-med hide-on-med-and-down" @click="fetchAllGroups()" style="position: relative; left: 118%; top: -28.7%;">Refresh Groups</div>
            <div class="left-btn hide-on-med hide-on-med-and-down" @click="openCreateModal()" style="position: relative; left: 198%; top: -64.7%;">Create Group</div>
            <ul class="btn-mobile-group show-on-small">
              <li> <div class="left-btn mobile-group-btn" @click="fetchAllGroups()">Refresh Group</div></li>
              <li><div class="left-btn mobile-group-btn" @click="openCreateModal()">Create Group</div></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="padding-b"></div>
    </div>
    <template v-if="nonGroups.length > 0">
      <div class="feed-body group-list-order" v-for="ngroup in nonGroups" :key="ngroup._id" style="margin: 5px 5px;">
        <router-link :to="{ name: 'GroupFeeds', params: { groupId: ngroup._id } }">
          <div class="feed-grid-inner">
            <img class="feed-avatar" :src="ngroup.banner" />
            <div class="feed-name">
              {{ ngroup.groupName}}
            </div>
          </div>
        </router-link>
        <router-link :to="{ name: 'GroupFeeds', params: { groupId: ngroup._id } }">
          <h5 class="feed-text feed-text-header" style="position: relative; left: 10.4%; margin-top: -5%;">Group Description</h5>
          <br>
          <div class="feed-text" style="margin-top: -5%;" v-html="ngroup.groupDescription"></div>
        </router-link>
        <div class="feed-text" style="margin-top: -3%;">
          <ul>
            <li><b>Total Users: {{ ngroup.users }}</b></li>
            <li><b>Total Posts: {{ ngroup.posts }}</b></li>
          </ul>
          <div v-if="ngroup.member" class="left-btn" @click="leaveGroup(ngroup)">Leave Group</div>
          <div v-if="!ngroup.member" class="left-btn" @click="joinGroup(ngroup)">Join Group</div>
        </div>
        <div class="padding-b"></div>
      </div>
      <div class="padding-b"></div>
    </template>
    <modal name="create-group" class="mobile-group-modal" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Create Group</h5>
      <hr>
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
    </modal>
  </div>
</template>

<script type="text/javascript">
/* eslint-disable */

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

    await this.fetchAllGroups();
  },
  methods: {
    openCreateModal() {
      this.$modal.show('create-group');
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

        console.log(createdGroups);
        if (createdGroups.status == 200) {
            this.userGroups.push(createdGroups.data.data[0]);
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

        // Form Data...
        const Data = new FormData();
        Data.append('image', this.$refs.fileInput.files[0]);

        // Init the group payload....
        let groupId = await axios.get(this.$baseUrl + '/initialize/group', {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
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
        let groupBanner = await axios.post(this.$baseUrl + '/image-upload/group/' + groupId.data.data[0]._id, Data, {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        // upload the group content...
        let groupContent = await axios.post(this.$baseUrl + '/update-group/' + groupId.data.data[0]._id, this.group, {
          headers: {
            Accept: 'application/json',
            'App-X-Token': this.fetchAuthState.token,
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
        this.$toast.error('Operation Failed', 'Sorry, An Error Occurred And Your Group Could Not Be Created.', this.notificationSystem.options.error);
        clearInterval(bannerInterval);
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
 cursor: pointer;
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
@media (min-width: 320px) {
  .mobile-group-btn {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 20px;
  }
  .btn-mobile-group {
    display: flex;
    margin-left: 17%;
  }
  .group-top-action {
    height: 22vh !important;
  }
  .group-top-action .feed-name {
    margin-left: -30%;
    padding-left: 10px;
  }
  .group-list-order .feed-text-header {
    margin-top: 2px !important;
    margin-left: -9%;
  }
  .mobile-group-modal .v--modal-box {
    width: 50% !important;
  }
}

@media (min-width: 480px) {
  .hide-on-med {
    display: none !important;
  }
}

@media (min-width: 768px) {
  .hide-on-med {
    display: none !important;
  }
}

.group-top-action .feed-name {
  margin-left: -20%;
}
</style>

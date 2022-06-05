<template>
  <div class="profile-page">
    <div>
      <template v-if="this.fetchUserState.cover == ''">
        <img class="cover-photo" src="../assets/b6.jpg" />
      </template>
      <template v-else>
        <img class="cover-photo" :src="this.fetchUserState.cover" />
      </template>
    </div>
    <div class="spacing"></div>
    <div class="mid-nav-container">
      <div class="mid-nav hide-on-med-and-down">
        Newest Fans
        <template v-if="newFanbases.length > 0">
            <div class="album-1" v-for="(fan, index) in newFanbases" :key="index">
              <img @click="showUserProfile(fan)" class="fan-image" v-if="fan.avatar" :src="fan.avatar" />
              <img @click="showUserProfile(fan)" class="fan-image" v-else src="../assets/u5.jpg" />
              <div class="padding-right-fan"></div>
            </div>
          </template>
        <template v-else>
          <router-link :to="{ name: 'Connections' }" class="connection-btn">
            Make Connection
          </router-link>
        </template>
      </div>
    </div>
    <div class="spacing"></div>
    <div class="mid-nav-container">
      <div class="huge-profile-tab">
        <div class="profile-tabs hide-on-med-and-down">
          <div class="tabs-cover">
            <div @click="profileTabClicked('contributions')" class="profile-tab">
              Contributions
              <div :class="lineContributionsObject"></div>
            </div>
          </div>
          <div class="tabs-cover">
            <div @click="profileTabClicked('connection')" class="profile-tab">
              Connections
              <div :class="lineConnectionObject"></div>
            </div>
          </div>
          <div class="tabs-cover">
            <div @click="profileTabClicked('fanbase')" class="profile-tab">
              Fanbase
              <div :class="lineFanbaseObject"></div>
            </div>
          </div>
          <div class="tabs-cover">
            <div class="profile-tab" @click="profileTabClicked('group')">
              Groups
              <div :class="lineGroupObject"></div>
            </div>
          </div>
          <div class="tabs-cover">
            <div @click="profileTabClicked('photos')" class="profile-tab">
              Photos
              <div :class="linePhotosObject"></div>
            </div>
          </div>
          <div class="tabs-cover">
            <div @click="profileTabClicked('advert')" class="profile-tab">
              Advert
              <div :class="lineAdvertObject"></div>
            </div>
          </div>
          <div class="tabs-cover">
            <div @click="profileTabClicked('fav')" class="profile-tab">
              Favourites
              <div :class="lineFavObject"></div>
            </div>
          </div>
          <div @click="profileTabClicked('playlist')" class="tabs-cover">
            <div class="profile-tab">
              Playlist
              <div :class="linePlaylistObject"></div>
            </div>
          </div>
          <div @click="profileTabClicked('profile')" class="tabs-cover">
            <div class="profile-tab">
              Profile-Page
              <div :class="lineProfileObject"></div>
            </div>
          </div>
        </div>
        <div class="element-center">
          <div class="thin-line-profile" text-wrap></div>
        </div>
        <Contributions v-if="clicked_tab_computed === 'contributions'" :contributions="contributions"></Contributions>
        <Connection v-else-if="clicked_tab_computed === 'connection'" :connections="connections"></Connection>
        <ProfileDetail v-else-if="clicked_tab_computed === 'profile'" :user="profilePageData" :auth="fetchAuthState"></ProfileDetail>
        <Fanbase v-else-if="clicked_tab_computed === 'fanbase'" :fanBases="fanbases"></Fanbase>
        <Playlist v-else-if="clicked_tab_computed === 'playlist'"></Playlist>
        <Photos v-else-if="clicked_tab_computed === 'photos'" :photos="photos"></Photos>
        <UpdateAdvert v-else-if="clicked_tab_computed === 'advert'"></UpdateAdvert>
        <ProfileGroup v-else-if="clicked_tab_computed === 'group'" :UserState="fetchUserState" :AuthState="fetchAuthState"></ProfileGroup>
        <Favourite v-else-if="clicked_tab_computed === 'fav'" :UserState="fetchUserState" :AuthState="fetchAuthState"></Favourite>
      </div>
    </div>
    <modal name="avatar-banner-modal" class="avatarModal">
      <div class="button-groups">
        <ul>
          <li>
            <a href="" @click.prevent="changeMedia('avatar')"><i class="fas fa-camera"></i> Change Avatar</a>
          </li>
          <li>
            <a href="" @click.prevent="changeMedia('banner')"><i class="fas fa-camera"></i> Change Banner</a>
          </li>
        </ul>
      </div>
      <hr>
      <div class="upload-preview-grid">
        <div class="container">
          <div class="col-upload">
            <div class="form-group file-block">
              <h5 v-show="mediaType === 'avatar'">Change Avatar</h5>
              <h5 v-show="mediaType === 'banner'">Change Banner</h5>
              <label class="file">
                  <template v-if="mediaType === 'avatar'">
                    <input type="file" @change="fileChange" ref="fileInput" id="file" aria-label="Change Avatar" />
                  </template>
                  <template v-if="mediaType === 'banner'">
                    <input type="file" @change="fileChange" ref="bannerInput" id="banner" aria-label="Change Banner" />
                  </template>
                  <span class="file-custom"></span>
                </label>
            </div>
          </div>
          <div class="col-preview">
            <img v-if="previewUrl != ''" :src="previewUrl" alt="Image Preview" style="height: 45vh;">
          </div>
        </div>
      </div>
      <div class="action-btn">
        <button type="button" style="margin-left: 4%; margin-bottom: 10px; padding: 5px; background: green; color: white; border: 1px solid green; border-radius: 4px;" @click="uploadBanner()">Upload</button>
      </div>
    </modal>
    <div @click="showModal()" @mousemove="showModal()" @mouseenter="showModal()" class="banner-icon">
      <i class="fas fa-camera"></i>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
  import axios from 'axios'

  import Contributions from './Contributions'
  import ProfileDetail from './ProfileDetail'
  import UpdateAdvert from './UpdateAdvert'
  import ProfileGroup from './ProfileGroup'
  import Connection from './Connection'
  import Favourite from './Favourite'
  import Playlist from './Playlist'
  import Fanbase from './Fanbase'
  import Photos from './Photos'

  export default {
    async mounted() {
      this.$store.dispatch('callLocalStore')
      this.getStageNameAndId()
      // #! Fetch Http Resources.....
      await this.fetchFanbase()
      await this.fetchContributions()
      await this.fetchConnections()
      await this.fetchPhotos()
      await this.fetchUserDetails()
    },
    computed: {
      clicked_tab_computed() {
        return this.tab
      },
      lineProfileObject() {
        return {
          linebeneathprofile: this.clickedProfile,
          linebeneathprofilenc: !this.clickedProfile
        }
      },
      lineContributionsObject() {
        return {
          linebeneathprofile: this.clickedContributions,
          linebeneathprofilenc: !this.clickedContributions
        }
      },
      lineConnectionObject() {
        return {
          linebeneathprofile: this.clickedConnection,
          linebeneathprofilenc: !this.clickedConnection
        }
      },
      lineFanbaseObject() {
        return {
          linebeneathprofile: this.clickedFanbase,
          linebeneathprofilenc: !this.clickedFanbase
        }
      },
      linePlaylistObject() {
        return {
          linebeneathprofile: this.clickedPlaylist,
          linebeneathprofilenc: !this.clickedPlaylist
        }
      },
      linePhotosObject() {
        return {
          linebeneathprofile: this.clickedPhotos,
          linebeneathprofilenc: !this.clickedPhotos
        }
      },
      lineAdvertObject() {
        return {
          linebeneathprofile: this.clickedAdvert,
          linebeneathprofilenc: !this.clickedAdvert
        }
      },
      lineGroupObject() {
        return {
          linebeneathprofile: this.clickedGroup,
          linebeneathprofilenc: !this.clickedGroup
        }
      },
      lineFavObject() {
        return {
          linebeneathprofile: this.clickedFav,
          linebeneathprofilenc: !this.clickedFav
        }
      },
      fetchAuthState() {
        this.auth = this.$store.getters.fetchAuthStore
        return this.$store.getters.fetchAuthStore
      },
      fetchUserState() {
        this.user = this.$store.getters.fetchUserStore
        return this.$store.getters.fetchUserStore
      },
      profilePageData() {
        if (this.userId == 0) {
          return this.fetchUserState
        }

        return this.userDetails;
      }
    },
    methods: {
      imageValidator() {
        try {
          if (this.mediaType == 'avatar') {
            if (
              !this.$refs.fileInput.files
            ) {
              this.$toast.error(
                "Please, select a picture in order to continue.",
                "Select Picture",
                this.notificationSystem.options.error
              );
              return false;
            }

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
          }

          if (this.mediaType == 'banner') {
            if (
              !this.$refs.bannerInput.files
            ) {
              this.$toast.error(
                "Please, select a picture in order to continue.",
                "Select Picture",
                this.notificationSystem.options.error
              );
              return false;
            }

            if (
              this.$refs.bannerInput.files[0].type !== "image/jpeg" &&
              this.$refs.bannerInput.files[0].type !== "image/png" &&
              this.$refs.bannerInput.files[0].type !== "image/jpg"
            ) {
              this.$toast.error(
                "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
                "Picture Format",
                this.notificationSystem.options.error
              );
              return false;
            }
          }

          return true;
        } catch (e) {
          console.log(e);
          this.$toast.error(
            "Please, select a picture in order to continue.",
            "Select Picture",
            this.notificationSystem.options.error
          );
          return;
        }

      },
      async uploadBanner() {
        let validator = this.imageValidator();

        if (validator) {
          if (this.mediaType == 'avatar') {
            const Data = new FormData();
            Data.append('image', this.$refs.fileInput.files[0]);

            this.$toast.info('Uploading Your Picture, Please wait.', 'Uploading Avatar', this.notificationSystem.options.info);
            let notifInterval = null;
            try {
              notifInterval = setInterval(() => {
                this.$toast.info('Uploading Your Picture, Please wait.', 'Uploading Avatar', this.notificationSystem.options.info);
              }, 5000);
            } catch (e) { clearInterval(notifInterval) }

            await axios.post(this.$baseUrl + '/avatar-upload', Data, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web'
              }
            }).then(async (response) => {
              if (response.status == 200) {
                let payload = { key: 'avatar', value: response.data.data[0].user.avatar }
                this.$store.dispatch('updateUserStore', payload);
                clearInterval(notifInterval)
              } else {
                this.$toast.error('Sorry, An unexpected error occurred and your avatar could not be uploaded.', 'Avatar Error', this.notificationSystem.error);
                clearInterval(notifInterval)
              }
            }).catch((e) => {
              this.$toast.error(e.message, e.name, this.notificationSystem.error);
              clearInterval(notifInterval)
            });

            this.$modal.hide('avatar-banner-modal');
            this.previewUrl = '';
            this.$refs.fileInput = '';
            this.$refs.fileInput = [];
            this.$refs.bannerInput = '';
            this.$refs.bannerInput = [];
            document.getElementById('file').value = '';
            document.getElementById('baner').value = '';
          }

          if (this.mediaType == 'banner') {
            const Data = new FormData();
            Data.append('image', this.$refs.bannerInput.files[0]);

            this.$toast.info('Uploading Your Picture, Please wait.', 'Uploading Banner', this.notificationSystem.options.info);
            let notifInterval = null;
            try {
                notifInterval = setInterval(() => {
                this.$toast.info('Uploading Your Picture, Please wait.', 'Uploading Banner', this.notificationSystem.options.info);
              }, 5000);
            } catch (e) { clearInterval(notifInterval) }
            await axios.post(this.$baseUrl + '/banner-upload', Data, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web'
              }
            }).then(async (response) => {
              if (response.status == 200) {
                let payload = { key: 'cover', value: response.data.data[0].user.cover }
                this.$store.dispatch('updateUserStore', payload);
                clearInterval(notifInterval)
              } else {
                this.$toast.error('Sorry, An unexpected error occurred and your cover photo could not be uploaded.', 'Cover Photo Error', this.notificationSystem.error);
                clearInterval(notifInterval)
              }
            }).catch((e) => {
              this.$toast.error(e.message, e.name, this.notificationSystem.error);
              clearInterval(notifInterval)
            });

            this.$modal.hide('avatar-banner-modal');
            this.previewUrl = '';
            this.$refs.fileInput = '';
            this.$refs.fileInput = [];
            this.$refs.bannerInput = '';
            this.$refs.bannerInput = [];
            document.getElementById('file').value = '';
            document.getElementById('baner').value = '';
          }
        }
      },
      async fetchFanbase() {
        if (this.userId) {
          await axios
            .get(this.$baseUrl + `/fetch-approved-connections/${this.userId}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web'
              }
            })
            .then(response => {
              if (response.status != 200) {
                this.newFanbases = []
                this.fanbases = []
              } else {
                this.newFanbases = response.data.data[0].slice(0, 15)
                this.fanbases = response.data.data[0]
              }
            })
            .catch(() => {})
        }

        await axios
          .get(this.$baseUrl + `/fetch-approved-connections/0`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          })
          .then(response => {
            if (response.status != 200) {
              this.newFanbases = []
              this.fanbases = []
            } else {
              this.newFanbases = response.data.data[0].slice(0, 15)
              this.fanbases = response.data.data[0]
            }
          })
          .catch(() => {})
      },
      async fetchContributions() {
        if (this.userId) {
          await axios
            .get(this.$baseUrl + `/fetch-profile/posts/${this.userId}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web'
              }
            })
            .then(response => {
              console.log(response.data);
              if (response.status !== 200) {
                this.contributions = []
              } else {
                this.contributions = response.data.data.slice(0, 16)
              }
            })
            .catch(() => {})
        }

        await axios
          .get(this.$baseUrl + `/fetch-profile/posts/0`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          })
          .then(response => {
            if (response.status !== 200) {
              this.contributions = []
            } else {
              this.contributions = response.data.data.slice(0, 16)
            }
          })
          .catch(() => {})
      },
      async fetchConnections() {
        !this.userId ? (this.userId = 0) : this.userId
        await axios
          .get(this.$baseUrl + `/fetch-approved-connection-request/${this.userId}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          })
          .then(response => {
            if (response.status == 200) {
              this.connections = response.data.data[0].slice(0, 16)
            } else {
              this.connections = []
            }
          })
          .catch(() => {
            this.connections = []
          })
      },
      async fetchPhotos() {
        !this.userId ? (this.userId = 0) : this.userId
        await axios.get(this.$baseUrl + `/fetch-galleries/${this.userId}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'App-X-Token': this.fetchAuthState.token,
            'App-Client': 'web'
          }
        }).then((response) => {
          if (response.status == 200) {
            this.photos = response.data.data.splice(0, 16);
          } else {
            this.photos = [];
          }
        }).catch(() => { this.photos = []; });
      },
      async fetchUserDetails() {
        !this.userId ? (this.userId = 0) : this.userId
        if (this.userId != 0) {
          await axios.get(this.$baseUrl + `/get-user-details/${this.userId}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          }).then((response) => {
            if (response.status !== 200) {
              this.$toast.error(
                "An unexpected error occurred and the profile page details couldn't be fetched. Please,try again later.",
                "error",
                this.notificationSystem.options.error
              );
            }

            if (response.status == 200) {
              this.userDetails = response.data.data[0];
              this.userDetails.previewType = 'import'
            }
          });

          return;
        }

        this.user.previewType = 'default';
      },
      showUserProfile(fan) {
        setTimeout(() => {

          this.$router.push({
            path: `/profile/${fan.stageName}/${fan.userId}`,
            params: {
              stageName: fan.stageName,
              userId: fan.userId
            }
          })
        }, 1000)
      },
      profileTabClicked(tab) {
        this.tab = tab
        if (tab === 'contributions') {
          (this.clickedContributions = true),
          (this.clickedProfile = false),
          (this.clickedConnection = false),
          (this.clickedPhotos = false),
          (this.clickedAdvert = false),
          (this.clickedPlaylist = false),
          (this.clickedGroup = false),
          (this.clickedFanbase = false),
          (this.clickedFav = false);
        } else if (tab === 'profile') {
          this.clickedPhotos = false;
          this.clickedProfile = true
          this.clickedPlaylist = false
          this.clickedFanbase = false
          this.clickedConnection = false
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = false;
        } else if (tab == 'connection') {
          this.clickedPhotos = false;
          this.clickedProfile = false
          this.clickedFanbase = false
          this.clickedPlaylist = false
          this.clickedConnection = true
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = false;
        } else if (tab == 'fanbase') {
          this.clickedPhotos = false;
          this.clickedProfile = false
          this.clickedFanbase = true
          this.clickedConnection = false
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = false;
        } else if (tab == 'playlist') {
          this.clickedPhotos = false;
          this.clickedProfile = false
          this.clickedFanbase = false
          this.clickedConnection = false
          this.clickedPlaylist = true
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = false;
        } else if (tab == 'advert') {
          this.clickedPhotos = false;
          this.clickedProfile = false
          this.clickedFanbase = false
          this.clickedConnection = false
          this.clickedPlaylist = false
          this.clickedAdvert = true
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = false;
        } else if (tab == 'photos') {
          this.clickedPhotos = true;
          this.clickedProfile = false
          this.clickedFanbase = false;
          this.clickedConnection = false
          this.clickedPlaylist = false
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = false;
        } else if (tab == 'group') {
          this.clickedPhotos = false;
          this.clickedProfile = false
          this.clickedFanbase = false;
          this.clickedConnection = false
          this.clickedPlaylist = false
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = true;
          this.clickedFav = false;
        } else if (tab == 'fav') {
          this.clickedPhotos = false;
          this.clickedProfile = false
          this.clickedFanbase = false;
          this.clickedConnection = false
          this.clickedPlaylist = false
          this.clickedAdvert = false
          this.clickedContributions = false
          this.clickedGroup = false;
          this.clickedFav = true;
        }
      },
      getStageNameAndId() {
        let path = window.location.pathname
        path = path.split('/')

        if (path.length == 4) {
          path.splice(0, 2)
          this.stageName = path[0]
          this.userId = path[1]

          return
        }

        this.stageName = this.fetchUserState.stageName
        this.userId = null
        return
      },
      showModal() {
        this.$modal.show('avatar-banner-modal')
      },
      changeMedia(media) {
        if (media == 'banner') {
          this.mediaType = media
          this.previewUrl = '';
          this.$refs.fileInput = '';
          this.$refs.fileInput = [];
          document.getElementById('file').value = '';
        }

        if (media == 'avatar') {
          this.mediaType = media
          this.previewUrl = '';
          this.$refs.bannerInput = '';
          this.$refs.bannerInput = [];
          document.getElementById('banner').value = '';
        }
      },
      fileChange() {
        if (this.mediaType == 'avatar') {
          const input = this.$refs.fileInput
          const files = input.files
          if (files && files[0]) {
            const reader = new FileReader()
            reader.onload = e => {
              this.previewUrl = e.target.result
            }
            reader.readAsDataURL(files[0])
          }
        }

        if (this.mediaType == 'banner') {
          const input = this.$refs.bannerInput
          const files = input.files
          if (files && files[0]) {
            const reader = new FileReader()
            reader.onload = e => {
              this.previewUrl = e.target.result
            }
            reader.readAsDataURL(files[0])
          }
        }
      }
    },
    data() {
      return {
        clickedContributions: true,
        clickedProfile: false,
        clickedAdvert: false,
        clickedConnection: false,
        clickedPlaylist: false,
        clickedFav: false,
        clickedFanbase: false,
        clickedPhotos: false,
        clickedGroup: false,
        mediaType: 'avatar',
        previewUrl: '',
        stageName: '',
        userId: '',
        newFanbases: [],
        fanbases: [],
        contributions: [],
        connections: [],
        photos: [],
        userDetails: {},
        tab: 'contributions',
        path: this.$route.path,
        fans: ['a', 'b', 'c', 'e', 'f', 'd', 'g', 'h', 'i', 'j', 'k', 'l', 'l', 'k', 'i'],
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
    updated() {
      // this.getStageNameAndId();
      console.log(this.stageName);
    },
    components: {
      Contributions,
      ProfileDetail,
      ProfileGroup,
      UpdateAdvert,
      Connection,
      Favourite,
      Playlist,
      Fanbase,
      Photos
    }
  }

</script>

<style scoped>

  .banner-icon {
    color: white;
    position: absolute;
    top: 12%;
    right: 6%;
  }

  .banner-icon .fas {
    font-size: 75%;
  }

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .avatarModal .button-groups ul {
    list-style: none;
    display: flex;
    padding-left: 5px !important;
    padding-right: 5px !important;
    padding-top: 30px !important;
  }

  .avatarModal hr:after,
  .avatarModal hr:before,
  .avatarModal hr {
    border-color: green;
  }

  .avatarModal .upload-preview-grid {
    margin-left: -17%;
  }

  .avatarModal .container {
    justify-content: flex-start;
    display: grid;
    grid-template-columns: 15rem 15rem;
    grid-template-rows: 3.5rem 3.5rem;
  }

  .avatarModal .file-block {
    margin-left: 3%;
    margin-top: 10%;
    margin-bottom: 5%;
  }

  .avatarModal .file-block .form-group h5 {
    color: black;
  }

  .avatarModal .file-block .form-group label {
    border: 2px solid transparent;
    border-radius: 200px;
    background: hsla(152, 80%, 50%, 0.986);
    color: white;
    padding: 8px;
  }

  .avatarModal .button-groups ul li {
    margin: auto 10px;
  }

  .avatarModal .button-groups {
    margin-bottom: 35px;
  }

  .avatarModal .button-groups ul li a {
    color: white;
    background: hsla(152, 80%, 50%, 0.986);
    border: 2px solid transparent;
    padding: 10px;
    border-radius: 2px;
    transition: all 0.7s ease-in-out;
  }

  .avatarModal .button-groups ul li a:hover {
    color: hsla(152, 80%, 50%, 0.986);
    border: 1px solid hsla(152, 80%, 50%, 0.986);
    background: white;
    border-radius: 8px;
  }

  .connection-btn {
    height: 35px;
    padding: 10px 10px;
    background-color: #326e2b;
    color: white;
    border-radius: 7px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-weight: 700;
    cursor: pointer;
  }
  .profile-tabs {
    background: #141621;
  }
  .tabs-cover {
    margin-left: -1%;
  }
</style>

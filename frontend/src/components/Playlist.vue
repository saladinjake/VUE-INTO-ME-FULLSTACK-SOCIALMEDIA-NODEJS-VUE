<template>
  <div>
    <div class="a-feed" style="margin-top: 2%;">
      <div class="feed-body">
        <div class="feed-grid-inner" style="margin-bottom: -142px;">
          <div class="feed-name" style="margin-left: -10%;">
            <img src="../assets/create-group-icon.png" /> Your Playlists
            <div class="left-btn" style="position: relative; left: 118%; top: -28.7%;">Refresh Playlist</div>
            <div class="left-btn" @click.prevent="openCreateModal()" style="position: relative; left: 224%; top: -64.7%;">Create Playlists</div>
          </div>
        </div>
      </div>
      <div class="padding-b"></div>
    </div>
    <div class="a-feed">
      <ul v-if="playlists.length > 0">
        <li class="playlist-order" v-for="(play, index) in playlists" :key="play._id">
          <div class="feed-body">
            <div class="feed-grid-inner" style="margin-bottom: -142px;">
              <div @click.prevent="openPlayList(play)" class="feed-name" style="margin-left: -10%;">
                {{ index + 1 }}. {{ play.name }} <span style="color: white;">({{ play.media.length }} Entries)</span>
                <div class="left-btn" @click.prevent="updatePlaylist(play)" style="position: relative; width: 69px; left: 118%; top: -28.7%;">Update</div>
                <div class="left-btn" @click.prevent="deletePlaylist(play._id)" style="position: relative; width: 69px; left: 174%; top: -64.7%; background: red;">Delete</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <modal name="create-playlist" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">New Playlist</h5>
      <hr>
      <form action="" method="post" @submit.prevent="createPlaylist()">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <v-text-field v-model="playlist.playlistName" label="Playlist Name" required solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Create Playlist</button>
        </div>
      </form>
    </modal>

    <modal name="update-playlist" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Update Playlist</h5>
      <hr>
      <form action="" method="post" @submit.prevent="saveUpdated()">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <v-text-field v-model="playlist.playlistName" label="Playlist Name" required solo></v-text-field>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Update Playlist</button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import axios from 'axios';
  export default {
    data() {
      return {
        playlist: {
          playlistName: '',
          playlistId: null
        },
        playlists: [],
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
    async mounted() {
      this.$store.dispatch("callLocalStore");
      await this.fetchPlaylists();
    },
    methods: {
      openPlayList(play) {
        this.$router.push({
          name: 'PlayLists',
          params: {
            playlistId: play._id
          }
        });
      },
      openCreateModal() {
        this.$modal.show('create-playlist');
      },
      updatePlaylist(play) {
        this.$modal.show('update-playlist');

        this.playlist.playlistId = play._id;
        this.playlist.playlistName = play.name;
      },
      async fetchPlaylists() {
        await axios.get(this.$baseUrl + '/fetch/playlist', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((docs) => {
          if (docs.status == 200) {
            this.playlists = docs.data.data[0];
            return;
          }
        }).catch((e) => {
          this.playlists = [];
        });
      },
      async deletePlaylist(id) {
        await axios.delete(this.$baseUrl+ '/delete/playlist/' + id, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((doc) => {
          if (doc.status == 200) {
            this.$toast.success('Playlist Deleted', 'Your Playlist Has Been Deleted Successfully.', this.notificationSystem.options.success);
            this.playlist.playlistName = '';

            this.playlists = this.playlists.filter((el) => {
              if (el._id != id) return true;
            });
          }
        }).catch((e) => {
          this.$toast.error('Error Occurred', 'Failed To Delete Playlist. Try Again Later.', this.notificationSystem.options.error);
        });
      },
      async createPlaylist() {
        await axios.post(this.$baseUrl + '/create/playlist', this.playlist, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((doc) => {
          if (doc.status == 201) {
            this.$toast.success('Playlist Created', 'Your Playlist Has Been Created Successfully.', this.notificationSystem.options.success);
            this.playlist.playlistName = '';
            this.$modal.hide('create-playlist');

            this.playlists.unshift(doc.data.data[0]);
          }
        }).catch((e) => {
          this.$toast.error('Error Occurred', 'Failed To Create Playlist. Ensure The Name Does Not Exist.', this.notificationSystem.options.error);
        });
      },
      async saveUpdated() {
        await axios.get(this.$baseUrl + '/update/playlist/' + this.playlist.playlistName + '/' + this.playlist.playlistId, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((doc) => {
          if (doc.status == 200) {
            this.$toast.success('Playlist Updated', 'Your Playlist Has Been Updated Successfully.', this.notificationSystem.options.success);
            this.$modal.hide('update-playlist');

            let __this = this;
            this.playlists = this.playlists.map((el) => {
              if (el._id == __this.playlist.playlistId) {
                el.name = __this.playlist.playlistName;
              }

              return el;
            });

            // Clear The Fields...
            this.playlist.playlistId = null;
            this.playlist.playlistName = '';
          }
        }).catch((e) => {
          this.$toast.error('Error Occurred', 'Failed To Update Playlist. Ensure The Name Does Not Exist.', this.notificationSystem.options.error);
        });
      }
    },
    computed: {
      fetchAuthState() {
        return this.$store.getters.fetchAuthStore;
      },
      fetchUserState() {
        return this.$store.getters.fetchUserStore;
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
 z-depth: 10000 !important;
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
 z-depth: 10000 !important;
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
ul {
  list-style: circle;
}
.playlist-order {
  margin-top: 1%;
}
</style>

<template>
  <div style="margin-top: 2%; margin-left: 3%;">
    <template v-if="feeds.length > 0">
      <div class="a-feed" v-for="(feed) in feeds" :key="feed._id">
        <template v-if="typeof feed.amount == 'undefined'">
          <div class="feed-body">
            <div class="feed-grid-inner">
              <template v-if="feed.user.avatar == ''">
                <img class="feed-avatar" src="../assets/u7.jpg" />
              </template>
              <template v-else>
                <img class="feed-avatar" :src="feed.user.avatar" />
              </template>
              <div class="feed-name">
                {{feed.user.firstName}} {{feed.user.lastName}}
                <template
                  v-if="feed.user.stageName == UserState.stageName"
                >
                  <span style="color: maroon; margin: 2px 10px;" @click="deletePost(feed._id)" class>
                    <i class="fa fa-trash"></i>
                  </span>
                </template>
                <span title="Delete From Playlist" class="playlist-option" style="color: red;" @click="deleteMedia(feed._id)">
                  <i class="fa fa-times fa-1x"></i>
                </span>
              </div>
              <div class="feed-time">{{feed.timestamp | diffForHumans}}</div>
            </div>
            <h5 class="feed-text feed-text-header">{{ feed.title }}</h5>
            <div class="feed-text">{{feed.content | truncate}}</div>
            <div class="feed-image" v-if="feed.postType == 'video'">
              <video preload="none" class="image-feed" v-bind:poster="feed.banner" width="3000" height="240" controls>
                <source v-bind:src="feed.video" />
              </video>
            </div>
            <div class="feed-image" v-if="feed.postType == 'audio'">
              <img
                :src="feed.banner"
                :alt="feed.title"
                style="max-height: auto !important; width: 100%;"
              />
              <audio :src="feed.audio" preload="none" height="240" controls :poster="feed.banner"></audio>
            </div>
            <div class="feed-image" v-if="feed.postType == 'picture'">
              <img
                :src="feed.banner"
                :alt="feed.title"
                style="max-height: auto !important; width: 100%;"
              />
            </div>
            <div class="feed-activity">
              <template v-if="feed.postType == 'video'">
                <i @click="home()" class="fas play-icon fa-eye icons"></i>
                <div class="padding-act-s"></div>
                {{feed.views}}
                <div class="padding-act"></div>
              </template>
              <div @click.prevent="likePost(feed, feed.liked)">
                <i @click.prevent="likePost(feed, feed.liked)" class="fas like-icon fa-thumbs-up icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.likes}}
              <div class="padding-act"></div>
              <div @click="redirectToCommentPage(feed._id)">
                <i @click="redirectToCommentPage(feed._id)" class="fas comment-icon fa-comment-alt icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.comments}}
              <div class="padding-act"></div>
              <div @click="markAsFavourite(feed, feed.favourite)">
                <i @click="markAsFavourite(feed, feed.favourite)" class="fas favourite-icon fa-heart icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.favourites}}
              <div class="padding-act-s"></div>
              <div class="padding-act-s"></div>
              <div @click="showSocialsModal()">
                <i @click="showSocialsModal()" class="fas share-icon fa-share-alt icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.shares}}
            </div>
          </div>
          <div class="padding-b"></div>
        </template>
      </div>

      <!-- SHARES MODAL -->
      <modal name="shares-modal" class="shares-modal">
        <div class="">
          <h3>Share With Friends!</h3>
          <ul class="socials-list">
            <vue-goodshare></vue-goodshare>
          </ul>
        </div>
      </modal>
      <!-- SHARES MODAL -->
    </template>
  </div>
</template>

<script>
/*eslint-disable*/
  import axios from 'axios';
  import moment from 'moment';
  export default {
    data() {
      return {
        feeds: [],
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
    computed: {
      fetchAuthState() {
        return this.$store.getters.fetchAuthStore;
      },
      fetchUserState() {
        return this.$store.getters.fetchUserStore;
      }
    },
    methods: {
      async fetchRecords() {
        try {
          let records = await axios.get(this.$baseUrl + '/fetch/playlist/media/' + this.$route.params.playlistId, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (records.status == 200) {
            this.feeds = records.data.data[0];
            return;
          }

          this.$toast.info('No Records Found', 'Sorry, But There Are No Records Found In This Playlist', this.notificationSystem.options.info);
          setTimeout(() => {
            this.router.push({
              name: 'Home'
            });
          }, 3000);
        } catch (e) {
          this.$toast.error('Unknown Error', 'Oops. Sorry. An Unknown Error Occurred.', this.notificationSystem.options.error);
          setTimeout(() => {
            this.router.push({
              name: 'Home'
            });
          }, 3000);
        }
      },
      async deletePost(postId, postType = 'audioVideoPictures') {
        await axios
          .delete(this.$baseUrl + "/delete-post/" + postId, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          })
          .then(response => {
            if (response.status == 200) {
              if (postType == 'audioVideoPictures') {
                this.feeds = this.feeds.filter(el => {
                  if (el._id == postId) return false;
                });

                eventBus.$emit("post-action", { type: "decrement" });
                this.$toast.info('The selected post has been deleted permanently.', 'Post Deleted', this.notificationSystem.info);
              }
            }
          })
          .catch(e => {
            this.$toast.error('An unexpected error occured  while trying to delete the selected post.', 'Error', this.notificationSystem.error);
            console.log(e);
          });
      },
      async likePost(post, status) {
        let payload = {};
        if (status) {
          payload = {
            type: 'unlike',
            postId: post._id,
            comment: null
          }
        }

        if (!status) {
          payload = {
            type: 'like',
            postId: post._id,
            comment: null
          }
        }

        await axios.post(this.$baseUrl + '/interact-with-post', payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.AuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          // look for the post and increment the like counter...
          if (response.status !== 400 && response.status !== 500) {

            if (payload.type == 'like' && response.data.data[0].type.likes) {
              if (post.postType == 'audio' || post.postType == 'video' || post.postType == 'picture') {
                this.feeds = this.feeds.map((el) => {
                  if (el._id == post._id) {
                    el.liked = true;
                    el.likes = parseInt(el.likes) + 1;
                  }
                  return el;
                });
              }

            }

            if (payload.type == 'unlike' && response.data.data[0].type.unlike) {
              if (post.postType == 'audio' || post.postType == 'video' || post.postType == 'picture') {
                this.feeds = this.feeds.map((el) => {
                  if (el._id == post._id) {
                    el.liked = false;
                    el.likes = parseInt(el.likes) - 1;
                  }
                  return el;
                });
              }

            }
          }
        }).catch((e) => {
          console.log(e);
          this.toast.info('An unexpected error occurred and your request could not be completed. Please, try again later.', 'Like Error', this.notificationSystem.options.info);
        });
      },
      redirectToCommentPage(postId) {
        setTimeout(() => {
          this.$router.push({
            name: 'Comments',
            params: { postId }
          });
        }, 2000);
        return;
      },
      async markAsFavourite(post, status) {
        let payload = {};
        if (!status) {
          payload = {
            type: 'favourite',
            postId: post._id,
            comment: null
          }
        }

        if (status) {
          payload = {
            type: 'unfavourite',
            postId: post._id,
            comment: null
          }
        }

        await axios.post(this.$baseUrl + '/interact-with-post', payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.AuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          // look for the post and increment the like counter...
          if (response.status !== 400 && response.status !== 500) {

            if (payload.type == 'favourite' && response.data.data[0].type.favourites) {
              if (post.postType == 'video' || post.postType == 'audio' || post.postType == 'picture') {
                this.feeds = this.feeds.map((el) => {
                  if (el._id == post._id) {
                    el.favourite = true;
                    el.favourites = parseInt(el.favourites) + 1;
                  }
                  return el;
                });
              }

            }

            if (payload.type == 'unfavourite' && response.data.data[0].type.unfavourites) {
              if (post.postType == 'video' || post.postType == 'audio' || post.postType == 'picture') {
                this.feeds = this.feeds.map((el) => {
                  if (el._id == post._id) {
                    el.favourite = false;
                    el.favourites -= 1;
                  }
                  return el;
                });
              }
            }
          }
        }).catch((e) => {
          console.log(e);
          this.toast.info('An unexpected error occurred and your request could not be completed. Please, try again later.', 'Favourite Error', this.notificationSystem.options.error);
        });
      },
      showSocialsModal() {
        this.$modal.show("shares-modal");
      },
      async deleteMedia(id) {
        try {
          let media = await axios.delete(this.$baseUrl + `/delete/media/playlist/${id}/${this.$route.params.playlistId}`, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (media.status == 200) {
            this.$toast.success('The Selcted Record Has Been Deleted Successfully.', 'Record Deleted', this.notificationSystem.options.success);
            this.feeds = this.feeds.filter((el) => {
              if (el._id != id) return true;
            });
            return;
          }
        } catch (e) {
          this.$toast.error('Operation Failed', 'Sorry, The Selectd File Could Not Be Deleted.', this.notificationSystem.options.error);
          return;
        }
      }
    },
    async mounted() {
      this.$store.dispatch("callLocalStore");
      await this.fetchRecords();
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
        if (content.split(' ').length > 50) {
          content = content.split(' ').slice(0, 50);

          // Convert the array of words back into a string
          content = content.join(' ') + '.....';

          return content;
        }

        return value;
      },
      truncatePopularNews(value) {
        // Make sure an element and number of items to truncate is provided
        if (!value) return;

        // Get the inner content of the element
        var content = value.trim();

        // Convert the content into an array of words
        // Remove any words above the limit
        if (content.split(' ').length > 15) {
          content = content.split(' ').slice(0, 15);

          // Convert the array of words back into a string
          content = content.join(' ') + '.....';

          return content;
        }

        return value;
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
.playlist-option {
  position: absolute;
  left: 73%
}
</style>

<template id="">
  <div>
    <div class="feed-grid" v-if="post != null && post !== 'null'">
      <div class="a-feed">
        <div class="feed-body">
          <div class="feed-grid-inner">
            <img class="feed-avatar" src="../assets/u7.jpg" />
            <div class="feed-name">
              {{post.user.firstName}} {{post.user.lastName}}
              <template
                v-if="post.user.stageName == fetchUserState.stageName"
              >
              </template>
            </div>
            <div class="feed-time">{{post.timestamp | diffForHumans}}</div>
          </div>
          <h5 class="feed-text feed-text-header">{{ post.title }}</h5>
          <div class="feed-text" v-html="post.content"></div>
          <div class="feed-image" v-if="post.postType == 'video'">
            <!--  -->
            <video preload="none" v-bind:poster="post.banner" class="image-feed" width="3000" height="240" controls>
              <source v-bind:src="post.video" />
            </video>
          </div>
          <div class="feed-image" v-if="post.postType == 'audio'">
            <img
              :src="post.banner"
              :alt="post.title"
              style="max-height: 55vh !important; width: 100%;"
            />
            <audio :src="post.audio" preload="none" height="240" controls :poster="post.banner"></audio>
          </div>
          <div class="feed-image" v-if="post.postType == 'picture'">
            <img
              :src="post.banner"
              :alt="post.title"
              style="max-height: 55vh !important; width: 100%;"
            />
          </div>
          <div class="feed-image" v-if="post.postType == 'news'">
            <img
              :src="post.banner"
              :alt="post.title"
              style="max-height: 55vh !important; width: 100%;"
            />
          </div>
          <div class="feed-activity">
            <template v-if="post.postType == 'video'">
              <i @click="home()" class="fas play-icon fa-eye icons"></i>
              <div class="padding-act-s"></div>
              {{post.views}}
              <div class="padding-act"></div>
            </template>
            <div @click.prevent="likePost(post, post.liked)">
              <i @click.prevent="likePost(post, post.liked)" class="fas like-icon fa-thumbs-up icons"></i>
            </div>
            <div class="padding-act-s"></div>
            {{post.likes}}
            <div class="padding-act"></div>
            <div @click="redirectToCommentPage(post._id)">
              <i @click="redirectToCommentPage(post._id)" class="fas comment-icon fa-comment-alt icons"></i>
            </div>
            <div class="padding-act-s"></div>
            {{post.comments}}
            <div class="padding-act"></div>
            <div @click="markAsFavourite(post, post.favourite)">
              <i @click="markAsFavourite(post, post.favourite)" class="fas favourite-icon fa-heart icons"></i>
            </div>
            <div class="padding-act-s"></div>
            {{post.favourites}}
            <div class="padding-act"></div>
            <i @click="home()" class="fas share-icon fa-share-alt icons"></i>
            <div class="padding-act-s"></div>
            {{post.shares}}
          </div>
          <div class="comments">
            <v-container class="grey lighten-5" style="margin-left: 0%; width: 100%;">
              <v-row no-gutters>
                <h6 class="black-text lighten-2;" style="margin-left: 0%; margin-bottom: 20px;"><i class="fas fa-comment-alt"></i> Comments</h6>
                <template v-if="comments.length > 0">
                  <v-col
                    v-for="(comment, index) in comments"
                    :key="index"
                    cols="12"
                    sm="12"
                    md="12"
                    xl="12"
                    lg="12"
                    class="pa-2"
                    style="margin-bottom: 20px;"
                  >
                  <ul>
                    <li class="avatar-name-block">
                      <template v-if="comment.user.avatar !== ''">
                        <img class="feed-avatar" :src="comment.user.avatar" /> <span>{{ comment.user.lastName }} {{ comment.user.firstName }}</span>
                      </template>
                      <template v-else>
                        <img class="feed-avatar" src="../assets/u7.jpg" /> <span>{{ comment.user.lastName }} {{ comment.user.firstName }}</span>
                      </template>
                    </li>
                    <li class="comment">{{ comment.comment }}</li>
                  </ul>
                  </v-col>
                </template>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12" >
                  <v-text-field
                    placeholder="Enter your comment"
                    v-model="comment"
                    v-on:keyup.enter="makeComment()"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <div class="padding-b"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
/*eslint-disable*/
import io from "socket.io-client";
import axios from 'axios';
import moment from 'moment';
import { SocketConnection } from "@/mixins/GlobalMixins";

var socket = io.connect(SocketConnection());

  export default {
    async mounted() {
      this.$store.dispatch("callLocalStore");

      if (!this.$route.params.postId) {
        setTimeout(() => {
          this.$router.push({
            name: 'Feedpage'
          });
        }, 1500);
        return;
      }

      await this.fetchPost();
      return;
    },
    data() {
      return {
        post: null,
        comment: '',
        comments: [],
        commentsMeta: {},
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
    methods: {
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
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          // look for the post and increment the like counter...
          if (response.status !== 400 && response.status !== 500) {

            if (payload.type == 'like' && response.data.data[0].type.likes) {
              this.post.liked = true;
              this.post.likes = parseInt(this.post.likes) + 1;
            }

            if (payload.type == 'unlike' && response.data.data[0].type.unlike) {
              this.post.liked = false;
              this.post.likes = parseInt(this.post.likes) - 1;
            }
          }
        }).catch((e) => {
          console.log(e);
          this.toast.info('An unexpected error occurred and your request could not be completed. Please, try again later.', 'Like Error', this.notificationSystem.options.info);
        });
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
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          // look for the post and increment the like counter...
          if (response.status !== 400 && response.status !== 500) {

            if (payload.type == 'favourite' && response.data.data[0].type.favourites) {
              this.post.favourite = true;
              this.post.favourites = parseInt(this.post.favourites) + 1;
            }

            if (payload.type == 'unfavourite' && response.data.data[0].type.unfavourites) {
              this.post.favourite = false;
              this.post.favourites -= 1;
            }
          }
        }).catch((e) => {
          console.log(e);
          this.toast.info('An unexpected error occurred and your request could not be completed. Please, try again later.', 'Favourite Error', this.notificationSystem.options.error);
        });
      },
      async makeComment() {
        if (!this.comment) {
          this.$toast.info('Please, write something to comment. Empty comments are not allowed.', 'Info', this.notificationSystem.options.info);
          return;
        }

        if (this.comment.trim() == '') {
            this.$toast.info('Please, write something to comment. Empty comments are not allowed.', 'Info', this.notificationSystem.options.info);
            return;
        }

        let payload = {
          postId: this.post._id,
          type: 'comment',
          comment: this.comment
        }

        await axios.post(this.$baseUrl + '/interact-with-post', payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.post.comments += 1;
            this.post.comment = true;

            this.comment = '';
            this.comments.push(response.data.data[0].activity);

            if (this.fetchUserState.stageName == this.post.user.stageName) return false;

            // emit to the socket....
            let socketPayload = {
              docId: this.post._id,
              userId: this.post.userId,
              message: `${this.fetchUserState.stageName} just made a comment on your post ${this.post.title || ''}`,
              postOwnerStageName: this.post.user.stageName,
              postInitiateStageName: this.fetchUserState.stageName
            };

            socket.emit('newComment', socketPayload);
          }

        }).catch((e) => {
          console.log(e);
          this.$toast.error('Sorry, An unknown exception occurred and your request could not be completed. Please, try again later.', 'Error', this.notificationSystem.options.error);
        })
      },
      async fetchPost() {
        let postId = this.$route.params.postId;
        await axios.get(this.$baseUrl + '/fetch-post/' + postId, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.fetchAuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          if (response.status == 200) {
            let post = response.data.data[0];
            let comments = response.data.data[0].commentsList;
            let commentsMeta = [];

            this.post = post;
            if (comments.length > 0) {
              this.comments = comments //Add some pagination tricks later
              this.commentsMeta = commentsMeta;
            } else {
              this.comments = [];
              this.commentsMeta = {};
            }
          } else {
            this.post = null;
          }
        }).catch((e) => {
          this.$toast.error('Sorry, An exception occurred and the post you are looking for could not be fetched. Please, try again later.');
          return;
        });
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
      	if (content.split(' ').length > 50) {
          content = content.split(' ').slice(0, 50);

        	// Convert the array of words back into a string
        	content = content.join(' ') + '.....';

          return content;
        }

        return value;
      }
    }
  }
</script>
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
.comments h6 {
  color: white;
  margin-left: -10%;
  margin-bottom: 16px;
}

.comments ul .avatar-name-block {
  margin-left: -80%;
}

.comments ul .avatar-name-block img {
  border-radius: 50px;
  width: 30px;
  height: 30px;
  vertical-align: middle;
}

.comments ul li span {
  font-size: 95%;
}

.comments ul .comment {
  text-align: justify;
  font-size: 85%;
  width: 100%;
  vertical-align: middle;
  margin-left: 10px;
}

.feed-text-header {
  font-size: 125% !important;
  font-weight: bold;
}
</style>

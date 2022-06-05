<template>
  <div class="feeds">
    <div class="feed-grid">
      <div class="a-feed">
        <div class="feed-body">
          <div class="feed-grid-inner" style="margin-left: -11%;">
            <div class="feed-name"><i class="fas fa-trophy"></i> {{ currentContest.title }}</div>
            <div class="feed-time"><b>{{ currentContest.startDate | parseDate }} - {{ currentContest.endDate | parseDate }}</b></div>
          </div>
          <div class="feed-text">
            <b class="contest-description">{{ currentContest.description }}</b>
            <br>
            <div class="contest-details">
              <ul>
                <hr>
                <li>Total Posts: <b>{{ currentContest.posts.length }}</b></li>
                <li>Total Users: <b>{{ currentContest.users.slice(0, 10).length || 0 }}</b></li>
                <li>My Position: <b>{{ contestPosition }}</b></li>
                <br>
                <li class="list-header"><i class="fas fa-trophy"></i> Prizes</li>
                <hr>
                <li v-if="currentContest.prizes.firstPrize !== ''">1st Prize: <b>{{ currentContest.prizes.firstPrize }}</b><li>
                <li v-if="currentContest.prizes.secondPrize !== ''">2nd Prize: <b>{{ currentContest.prizes.secondPrize }}</b></li>
                <li v-if="currentContest.prizes.thirdPrize !== ''">3rd Prize: <b>{{ currentContest.prizes.thirdPrize }}</b></li>
                <li v-if="currentContest.prizes.fourthPrize !== ''">4th Prize: <b>{{ currentContest.prizes.fourthPrize }}</b></li>
                <li v-if="currentContest.prizes.fifthPrize !== ''">5th Prize: <b>{{ currentContest.prizes.fifthPrize }}</b></li>
                <br>
                <li class="list-header"><i class="fa fa-trophy"></i> Top Contestants</li>
                <hr>
                <template v-if="currentContest.users.length > 0">
                  <li v-for="(user, index) in currentContest.users" :key="index" style="margin-bottom: 10px; cursor: pointer;">
                    <img v-if="user.avatar !== ''" :src="user.avatar" style="border-radius: 50px; width: 50px; height: 50px;" alt='User Avatar' />
                    <b> {{ user.lastName }} {{ user.firstName }}</b>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
        <div class="padding-b"></div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
        <h5 class="left-align white-text"><i class="fas fa-trophy"></i>Contest Posts</h5>
        <hr>
      </div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <template v-if="currentContest.posts.length > 0">
        <div class="a-feed" v-for="feed in currentContest.posts" :key="feed._id">
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
        </div>
      </template>
    </div>
  </div>
</template>

<script type="text/javascript">
/* eslint-disable */
import axios from "axios";
import moment from "moment";
import eventBus from "@/mixins/EventsMixins";

  export default {
    data() {
      return {
        posts: [],
        contestPosition: 0,
        contestId: this.$route.params.contestId,
        currentContest: {
          id: '',
          title: '',
          posts: '',
          users: '',
          description: '',
          prizes: '',
          startDate: '',
          endDate: ''
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
      };
    },
    props: {
      AuthState: {
        type: Object,
        required: true
      },
      UserState: {
        type: Object,
        required: true
      }
    },
    async mounted() {
      this.$store.dispatch("callLocalStore");
      await this.fetchCurrentContest();
    },
    methods: {
      checkMyPosition() {
        try {
          let positions = [];
          for (let i = 0; i < this.currentContest.users.length; i++) {
            if (this.currentContest.users[i].stageName == this.UserState.stageName) {
              positions.push(i + 1);
            }
          }

          console.log(positions);

          // Take the maximum position...
          if (positions.length > 0) {
            positions = positions.sort((afterItem, beforeItem) => {
              if (parseInt(afterItem.totalInteractions) < parseInt(beforeItem.totalInteractions)) {
                return 1;
              }

              if (parseInt(afterItem.totalInteractions) > parseInt(beforeItem.totalInteractions)) {
                return -1;
              }

              return 0;
            });

            this.contestPosition = parseInt(positions[0]);
          }
        } catch (e) {

        }
      },
      async fetchCurrentContest() {
        try {
          let currentContest = await axios.get(this.$baseUrl + '/get/contest/details/' + this.contestId, {
            headers: {
              Accept: 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (currentContest.status == 200) {
            this.currentContest.id = currentContest.data.data[0].contest._id;
            this.currentContest.title = currentContest.data.data[0].contest.title;
            this.currentContest.posts = currentContest.data.data[0].posts;
            this.currentContest.users = currentContest.data.data[0].topUsers;
            this.currentContest.description = currentContest.data.data[0].contest.description;
            this.currentContest.prizes = currentContest.data.data[0].contest.prizes;
            this.currentContest.startDate = currentContest.data.data[0].contest.date.startDate;
            this.currentContest.endDate = currentContest.data.data[0].contest.date.endDate;

            this.checkMyPosition();
            return;
          }

        } catch (e) {
          this.currentContest.id = '';
          this.currentContest.title = '';
          this.currentContest.posts = '';
          this.currentContest.users = '';
          this.currentContest.description = '';
          this.currentContest.prizes = '';
          this.currentContest.startDate = '';
          this.currentContest.endDate = '';

          return;
        }
      },
      showSocialsModal() {
        this.$modal.show("shares-modal");
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
              if (post.postType == 'audio' || post.postType == 'video') {
                this.currentContest.posts = this.currentContest.posts.map((el) => {
                  if (el._id == post._id) {
                    el.liked = true;
                    el.likes = parseInt(el.likes) + 1;
                  }
                  return el;
                });
              }
            }

            if (payload.type == 'unlike' && response.data.data[0].type.unlike) {
              if (post.postType == 'audio' || post.postType == 'video') {
                this.currentContest.posts = this.currentContest.posts.map((el) => {
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
              if (post.postType == 'video' || post.postType == 'audio') {
                this.currentContest.posts = this.currentContest.posts.map((el) => {
                  if (el._id == post._id) {
                    el.favourite = true;
                    el.favourites = parseInt(el.favourites) + 1;
                  }
                  return el;
                });
              }
            }

            if (payload.type == 'unfavourite' && response.data.data[0].type.unfavourites) {
              if (post.postType == 'video' || post.postType == 'audio') {
                this.currentContest.posts = this.currentContest.posts.map((el) => {
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
                this.currentContest.posts = this.currentContest.posts.filter(el => {
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
    },
    computed: {
      fetchAuthState() {
        return this.$store.getters.fetchAuthStore;
      },
      fetchUserState() {
        return this.$store.getters.fetchUserStore;
      }
    },
    filters: {
      diffForHumans(value) {
        return moment
          .utc(value)
          .local()
          .fromNow();
      },
      parseDate(dateString) {
        let dateFormat = new Date(dateString)
        dateFormat = dateFormat.toString();

        return dateFormat.split(' ').slice(0, 4).join(' ');
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
.contest-details ul li {
  font-size: 110%;
}
.contest-description {
  font-size: 115%;
}
</style>

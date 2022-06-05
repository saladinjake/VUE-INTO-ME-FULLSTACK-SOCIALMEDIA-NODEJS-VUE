<template>
  <div>
    <div class="a-feed" v-for="(feed) in favourites" :key="feed._id">
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
                <template v-if="feed.postType == 'video' || feed.postType == 'audio'">
                  <span class="playlist-option" @click="openCreateModal(feed)">
                    <i class="fa fa-bookmark"></i>
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
            <div class="feed-image" v-if="feed.postType == 'picture'">
              <img
                :src="feed.banner"
                :alt="feed.title"
                style="max-height: auto !important; width: 100%;"
              />
            </div>
            <div class="feed-activity">
              <template v-if="feed.postType == 'video'">
                <i class="fas play-icon fa-eye icons"></i>
                <div class="padding-act-s"></div>
                {{feed.views}}
                <div class="padding-act"></div>
              </template>
              <div>
                <i class="fas like-icon fa-thumbs-up icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.likes}}
              <div class="padding-act"></div>
              <div>
                <i class="fas comment-icon fa-comment-alt icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.comments}}
              <div class="padding-act"></div>
              <div>
                <i class="fas favourite-icon fa-heart icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.favourites}}
              <div class="padding-act-s"></div>
              <div class="padding-act-s"></div>
              <div>
                <i class="fas share-icon fa-share-alt icons"></i>
              </div>
              <div class="padding-act-s"></div>
              {{feed.shares}}
            </div>
          </div>
          <div class="padding-b"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
import axios from 'axios';

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
  data () {
    return {
      favourites: []
    }
  },
  methods: {
    async fetchFavPosts() {
      await axios.get(this.$baseUrl + '/fetch-fav-posts', {
        headers: {
          Accept: 'application/json',
          'App-X-Token': this.fetchAuthState.token,
          'App-Client': 'web',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }).then((success) => {
        console.log(success);
        if (success.status == 200) {
          this.favourites = success.data.data[0];
          return;
        }
      }).catch((e) => {
        console.log(e);
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
  },
  async mounted() {
    this.$store.dispatch("callLocalStore");

    await this.fetchFavPosts();
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
  
</style>
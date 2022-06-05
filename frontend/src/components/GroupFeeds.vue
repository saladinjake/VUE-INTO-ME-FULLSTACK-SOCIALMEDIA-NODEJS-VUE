<template>
  <div>
    <template v-if="groupDetails !== ''">
      <div class="feed-body group-feeds-top">
        <div class="feed-grid-inner">
          <img class="feed-avatar" :src="groupDetails.banner" />
          <div class="feed-name">
            {{ groupDetails.groupName }}
          </div>
        </div>
        <h5 class="feed-text feed-text-header" style="position: relative; left: 10.4%; margin-top: -5%;">Group Description</h5>
        <br>
        <div class="feed-text" style="margin-top: -5%;" v-html="groupDetails.groupDescription"></div>
        <div class="feed-text" style="margin-top: -3%;">
          <ul>
            <li><b>Total Users: {{ groupDetails.users }}</b></li>
            <li><b>Total Posts: {{ groupDetails.posts }}</b></li>
          </ul>
          <!-- <div class="left-btn">Leave Group</div> -->
          <ul style="list-style: none; display: flex;">
            <li v-if="groupDetails.member" @click="leaveGroup(groupDetails)" style="margin-right: 10px;"><div class="left-btn">Leave Group</div></li>
            <li v-if="!groupDetails.member" @click="joinGroup(groupDetails)" style="margin-right: 10px;"><div class="left-btn">Join Group</div></li>
            <li v-if="groupDetails.member" style="margin-left: 10px;" @click="openModal()"><div class="left-btn">Make A Post</div></li>
          </ul>
        </div>
      </div>
      <div class="padding-b"></div>
    </template>
    <div class="a-feed" v-for="(feed) in feeds[0]" :key="feed._id">
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
      <template v-if="typeof feed.amount != 'undefined'">
        <div class="feed-body">
          <div class="feed-grid-inner">
            <div class="feed-name">
              Sponsored Advert <b>{{ feed.businessName }}</b>
            </div>
          </div>
          <h5 class="feed-text feed-text-header">{{ feed.title }}</h5>
          <div class="feed-text" v-html="feed.description"></div>
          <div class="feed-image">
            <img
              :src="feed.banner"
              :alt="feed.title"
              style="max-height: auto !important; width: 100%;"
            />
          </div>
        </div>
        <div class="padding-b"></div>
      </template>
    </div>
    <modal class="modal-g hide-on-med-and-down" name="hello-world">
      <div id="overlay-post">
        <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div>
            <div class="gap-patch">
              <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>

      <form action id="post_form" @submit.prevent="createPost()" enctype="multipart/form-data">
        <div class="modal-cover">
          <div class="make-post-and-item">
            <div class="make-post">Make a Post</div>
            <div v-show="showVideo" class="item-text">Video</div>
            <div v-show="showPicture" class="item-text">Photo</div>
            <div v-show="showAudio" class="item-text">Audio</div>
          </div>
          <div class="modal-contents">
            <div v-show="showPicture" class="textfield-container">
              <v-text-field v-model="addTitle"
              class="textfield browser-default"
              placeholder="Add title or question (Required)"></v-text-field>
            </div>
            <div v-show="!showPicture" class="textfield-container">
              <v-text-field
                v-show="!showForum && !showStatus && !showNews"
                v-model="addTitle"
                class="textfield browser-default"
                placeholder="Add title or question (Required)"
              ></v-text-field>
              <v-text-field
                v-show="showForum"
                v-model="addForumTitle"
                class="textfield browser-default"
                placeholder="Add Forum Title/Question"
              ></v-text-field>
              <v-text-field
                v-show="showNews"
                v-model="addForumTitle"
                class="textfield browser-default"
                placeholder="Add News Title(Required)"
              ></v-text-field>
              <v-text-field
                v-show="showStatus"
                v-model="addForumTitle"
                class="textfield browser-default"
                placeholder="Add Status Title(Required)"
              ></v-text-field>
            </div>
            <div v-show="!showForum && !showStatus && !showNews" class="textfield-container">
              <v-textarea v-model="addNote" placeholder="Add note to your post(optional)" counter></v-textarea>
            </div>
            <div v-show="showStatus" class="textfield-container">
              <v-textarea
                v-model="addNote"
                placeholder="Add description to your Status post"
                counter
              ></v-textarea>
            </div>
            <div class="rich-text-container">
              <div v-show="showForum || showNews" class="rich-text-editor">
                <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
              </div>
            </div>
            <div v-show="!showForum && !showStatus && !showNews" class="cover-image-container">
              <div :style="[ currentModal == 'video' ? { 'margin-left': '-41%' } : { 'margin-left': '12%' } ]">
                <input
                  v-show="showVideo || showAudio"
                  :ref="fileName"
                  type="file"
                  @change="onFileSelected"
                />
              </div>
              <template id v-if="currentModal !== 'video'">
                <div v-if="!imageData" class="cover-photo-1" style="width: 38%;" @click="chooseImage">
                  <span>Upload cover photo</span>
                  <input
                    class="file-input"
                    ref="fileInput"
                    type="file"
                    name="image"
                    @input="onSelectFile"
                    @change="onSelectedCover"
                  />
                </div>
              </template>
              <template id v-if="currentModal !== 'video'">
                <div
                  v-if="imageData"
                  class="cover-photo-2"
                  :style="{ 'background-image': `url(${imageData})` }"
                  @click="chooseImage"
                >
                  <div
                    @click="cancel_image()"
                    style="left: 95%;
                    position: absolute;
                    top: 247px;"
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i>
                  </div>
                </div>
              </template>
            </div>
            <div class="thin-line-modal" text-wrap></div>
            <div class="bottom-modal">
              <div class="start-icons">
                <div @click="showModal('video')">
                  <img class="fast" src="../assets/music-video-icon.png" alt />
                </div>
                <div @click="showModal('audio')">
                  <img class="fast" src="../assets/music-audio-icon.png" alt />
                </div>
                <div @click="showModal('camera')">
                  <img class="fast" src="../assets/camera-icon.png" />
                </div>
              </div>
              <div v-show="showAudio || showVideo" class="genre-dropdown">
                <div class="cl">
                  <v-select
                    class="v-select browser-default"
                    v-model="selected_genre"
                    placeholder="genre"
                    :options="genres"
                  ></v-select>
                </div>
              </div>
              <div v-show="showForum" class="forum-category">
                <select class="select-category browser-default" v-model="selected_forum_category">
                  <option disabled value>Category</option>
                  <template v-if="forumCategories.length > 0">
                    <option v-for="(forumC, index) in forumCategories" :key="index" :value="forumC">forumC</option>
                  </template>
                  <template v-else>
                    <option>Collaboration</option>
                    <option>Music Tours</option>
                    <option>R and B specials</option>
                    <option>Classic meetups</option>
                    <option>Highlife talks</option>
                    <option>Gospel</option>
                  </template>
                </select>
              </div>
              <div v-show="showAudio || showVideo" class="originality">
                Original?
                <toggle-button
                  :value="toggle"
                  id="originality"
                  :labels="{checked: 'yes', unchecked: 'no'}"
                />
              </div>
              <div id="publish_button">
                <!-- <div>Publish</div> -->
                <button type="submit" :disabled="isActive" :class="activeButton">Publish</button>
              </div>
            </div>
          </div>
          <div class="container-right">
            <div class="terms-and-conditions">Terms & Conditions Apply</div>
          </div>
        </div>
      </form>
    </modal>

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
  </div>
</template>

<script type="text/javascript">
/* eslint-disable */

const axios = require("axios");
import eventBus from "@/mixins/EventsMixins";
import "vue-select/dist/vue-select.css";
import Artistes from "./Artistes";
import Multiselect from "vue-multiselect";
import moment from "moment";
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
        activeAds: [],
        feedOverlay: true,
        groupDetails: "",
        genres: [],
        forumCategories: [],
        postId: "",
        imageUrl: "",
        videoUrl: "",
        audioUrl: "",
        localStoredFeeds: '',
        currentModal: "video",
        nextPage: 0,
        nextNews: 0,
        nextForum: 0,
        nextStatus: 0,
        allForums: [],
        forumsMeta: {},
        allStatus: [],
        statusMeta: {},
        singleNews: null,
        isActive: false,
        buttonActive: true,
        toggle: null,
        selectedCover: null,
        selectedFile: null,
        addNote: null,
        addForumTitle: null,
        addTitle: null,
        fileName: null,
        editor: ClassicEditor,
        editorData: "<p>Content of the News/Forum.</p>",
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
        editorConfig: {
          // The configuration of the editor.
        },
        menu: [
          {
            header: true,
            title: "Main Navigation",
            hiddenOnCollapse: true
          },
          {
            href: "/",
            title: "Dashboard",
            icon: "fa fa-user"
          },
          {
            href: "/charts",
            title: "Charts",
            icon: "fa fa-chart-area",
            child: [
              {
                href: "/charts/sublink",
                title: "Sub Link"
              }
            ]
          }
        ],
        imageData: null,
        selected_filter: null,
        clickedLatest: true,
        clickedArtiste: false,
        clickedForum: false,
        clickedNews: false,
        clickedStatus: false,
        showVideo: false,
        showPicture: false,
        showAudio: false,
        showForum: false,
        showStatus: false,
        showNews: true,
        switch1: true,
        selected_forum_category: "",
        selected_genre: "Genre",
        displayed: "",
        clickedropdown: false,
        dropdown_genre: [
          "Pop",
          "Reggae",
          "R and B ",
          "Highlife",
          "Classic",
          "Hip-Hop"
        ],
        rules: [v => v.length <= 5 || "Max 25 characters"],
        option: "latest",
        feeds: [],
        news: [],
        modalNews: [], // unlimited... auto scroll
        popularNews: [], //limit of 5...
        newsMeta: {},
        feeds1: [
          {
            name: "Paulin Epekson",
            date: "January 05, 2020",
            time_stamp: "2 mins",
            views: 12346097,
            likes: 786908,
            chats: 907,
            favorites: 32,
            share: 411,
            text:
              "Derozan shot 17-of-38 from ce floor and also collected eight assists. Cory Joseph had 19 points for the raptors, and serge ibaka scored 16 before he was ejected for his role in a memorable fight with..."
          },
          {
            name: "2 baba Idibia",
            date: "January 05, 2020",
            time_stamp: "34 hrs",
            views: 12346097,
            likes: 786908,
            chats: 907,
            favorites: 32,
            share: 411,
            text:
              "Derozan shot 17-of-38 from the floor and also collected eight assists. Cory Joseph had 19 points for the raptors, and serge ibaka scored 16 before he was ejected for his role in a memorable fight with..."
          },
          {
            name: "Marlian",
            date: "January 02, 2020",
            time_stamp: "62 hours",
            views: 12346097,
            likes: 786908,
            chats: 907,
            favorites: 32,
            share: 411,
            text:
              "Derozan shot 17-of-38 from the floor and also collected eight assists. Cory Joseph had 19 points for the raptors, and serge ibaka scored 16 before he was ejected for his role in a memorable fight with..."
          },
          {
            name: "Marlian",
            date: "January 05, 2020",
            time_stamp: "2 mins",
            views: 12346097,
            likes: 786908,
            chats: 907,
            favorites: 32,
            share: 411,
            text:
              "Derozan shot 17-of-38 from the floor and also collected eight assists. Cory Joseph had 19 points for the raptors, and serge ibaka scored 16 before he was ejected for his role in a memorable fight with..."
          }
        ]
      };
    },
    computed: {
      fetchAuthState() {
        return this.$store.getters.fetchAuthStore;
      },
      fetchUserState() {
        return this.$store.getters.fetchUserStore;
      },
      activeButton() {
        if (
          this.selected_genre === "Genre" ||
          this.selected_genre === null ||
          this.addNote === null ||
          this.addTitle === null ||
          this.selectedCover === null ||
          this.selectedFile === null
        ) {
          this.buttonActive = false;
        } else {
          this.buttonActive = true;
        }
        return {
          publishbuttonactive: this.buttonActive,
          publishbutton: !this.buttonActive
        };

        return publish_button_status;
      },
      clicked_option_computed() {
        return this.option;
      },
      lineLatestObject() {
        return {
          linebeneath: this.clickedLatest,
          linebeneathnc: !this.clickedLatest
        };
      },
      lineArtisteObject() {
        return {
          linebeneath: this.clickedArtiste,
          linebeneathnc: !this.clickedArtiste
        };
      },
      lineForumObject() {
        return {
          linebeneath: this.clickedForum,
          linebeneathnc: !this.clickedForum
        };
      },
      lineStatusObject() {
        return {
          linebeneath: this.clickedStatus,
          linebeneathnc: !this.clickedStatus
        };
      },
      lineNewsObject() {
        return {
          linebeneath: this.clickedNews,
          linebeneathnc: !this.clickedNews
        };
      }
    },
    async mounted() {
      this.$store.dispatch("callLocalStore");

      this.AuthState = this.fetchAuthState;
      this.UserState = this.fetchUserState;

      await this.fetchCategories();
      await this.fetchGroupDetails();
      await this.fetchGroupPosts();

      eventBus.$on('open-advert-modal', () => {
        this.feedOverlay = false;

        console.log('Opening Advert Modal');
      });

      eventBus.$on('close-advert-modal', () => {
        this.feedOverlay = true;

        console.log('closing Advert Form');
      });
    },
    methods: {
      openModal() {
        this.$modal.show('hello-world');
        this.showModal('video');
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
            this.groupDetails.users += 1;
            this.groupDetails.member = true;

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
            this.groupDetails.users -= 1;
            this.groupDetails.member = false;
            return;
          }
        } catch (e) {
          this.$toast.error('Error Occurred', 'An Unknown Error Occurred And Your Request Could Not Be Completed.', this.notificationSystem.options.error);
          return;
        }
      },
      async fetchGroupPosts() {
        try {
          let allPosts = await axios.get(this.$baseUrl + '/fetch-all-group-posts/' + this.nextPage + '/' + this.$route.params.groupId, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.fetchAuthState.token,
              "App-Client": "web"
            }
          });

          if (allPosts.status == 200) {
            this.feeds = allPosts.data.data;

            try {
              let activeAds = await axios.get(this.$baseUrl + '/advert/user/fetch', {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Cache-Control": "no-cache",
                  "App-X-Token": this.fetchAuthState.token,
                  "App-Client": "web"
                }
              });

              this.activeAds = activeAds.data.data[0].sort( () => Math.random() - 0.5);
              // Shuffle the ads and show the first one in the array...

              // charge the first advert...
              if (this.feeds[0].length > 0) {
                if (this.activeAds.length >= 5) {
                  this.feeds[0].push(this.activeAds[0]);
                  this.feeds[0].push(this.activeAds[1]);
                  this.feeds[0].push(this.activeAds[2]);
                  this.feeds[0].push(this.activeAds[3]);
                  this.feeds[0].push(this.activeAds[4]);

                  await this.chargeAdvert('view', this.activeAds[0]._id);
                  await this.chargeAdvert('view', this.activeAds[1]._id);
                  await this.chargeAdvert('view', this.activeAds[2]._id);
                  await this.chargeAdvert('view', this.activeAds[3]._id);
                  await this.chargeAdvert('view', this.activeAds[4]._id);
                } else if (this.activeAds.length >= 4) {
                  this.feeds[0].push(this.activeAds[0]);
                  this.feeds[0].push(this.activeAds[1]);
                  this.feeds[0].push(this.activeAds[2]);
                  this.feeds[0].push(this.activeAds[3]);

                  await this.chargeAdvert('view', this.activeAds[0]._id);
                  await this.chargeAdvert('view', this.activeAds[1]._id);
                  await this.chargeAdvert('view', this.activeAds[2]._id);
                  await this.chargeAdvert('view', this.activeAds[3]._id);
                } else if (this.activeAds.length >= 3) {
                  this.feeds[0].push(this.activeAds[0]);
                  this.feeds[0].push(this.activeAds[1]);
                  this.feeds[0].push(this.activeAds[2]);

                  await this.chargeAdvert('view', this.activeAds[0]._id);
                  await this.chargeAdvert('view', this.activeAds[1]._id);
                  await this.chargeAdvert('view', this.activeAds[2]._id);
                } else if (this.activeAds.length >= 2) {
                  this.feeds[0].push(this.activeAds[0]);
                  this.feeds[0].push(this.activeAds[1]);

                  await this.chargeAdvert('view', this.activeAds[0]._id);
                  await this.chargeAdvert('view', this.activeAds[1]._id);
                } else if (this.activeAds.length >= 1) {
                  this.feeds[0].push(this.activeAds[0]);
                  await this.chargeAdvert('view', this.activeAds[0]._id);
                }
              }

              this.feeds[0] = this.feeds[0].sort( () => Math.random() - 0.5);
              return;
            } catch (e) {
              this.activeAds = [];
              return;
            }
            return;
          }
        } catch (e) {
          this.feeds = [];
        }
      },
      async fetchGroupDetails() {
        try {
          let groupDetails = await axios.get(this.$baseUrl + '/fetch-group-details/' + this.$route.params.groupId, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.fetchAuthState.token,
              "App-Client": "web"
            }
          });

          if (groupDetails.status == 200) {
            this.groupDetails = groupDetails.data.data[0];
            return;
          }
        } catch (e) {
          this.groupDetails = "";
          return;
        }
      },
      async chargeAdvert(type, id) {
        try {
          let charge = await axios.get(this.$baseUrl + '/charge/advert/' + type + '/' + id, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.fetchAuthState.token,
              "App-Client": "web"
            }
          });
          console.log(charge);
        } catch (e) { /** Fail silently */  }
      },
      async fetchCategories() {
        try {
          let genres = await axios.get(this.$baseUrl + '/fetch/categories/media');
          let forumCategories = await axios.get(this.$baseUrl + '/fetch/categories/forums');

          if (genres.status == 200) {
            this.genres = genres.data.data[0];

            this.genres = this.genres.map((el) => {
              return el.name;
            });
          }

          if (forumCategories.status == 200) {
            this.forumCategories = forumCategories.data.data[0];

            console.log(forumCategories.data.data[0]);
            this.forumCategories = this.forumCategories.map((el) => {
              return el.name;
            });
          }
        } catch (e) {
          this.genres = [];
          this.forumCategories = [];
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
              if (post.postType == 'audio' || post.postType == 'video' || post.postType == 'picture') {
                this.feeds[0] = this.feeds[0].map((el) => {
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
                this.feeds[0] = this.feeds[0].map((el) => {
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
              if (post.postType == 'video' || post.postType == 'audio' || post.postType == 'picture') {
                this.feeds[0] = this.feeds[0].map((el) => {
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
                this.feeds[0] = this.feeds[0].map((el) => {
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
                this.feeds[0] = this.feeds[0].filter(el => {
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
      async fetchForums() {
        await axios
          .get(this.$baseUrl + `/fetch-forums/` + this.nextForum, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          }).then(async (response) => {
            if (response.status == 200) {
              this.allForums = response.data.data[0];
              this.forumsMeta = response.data.data[1];

              try {
                let activeAds = await axios.get(this.$baseUrl + '/advert/user/fetch', {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.fetchAuthState.token,
                    "App-Client": "web"
                  }
                });

                this.activeAds = activeAds.data.data[0].sort( () => Math.random() - 0.5);
                // Shuffle the ads and show the first one in the array...

                // charge the first advert...
                if (this.allForums.length > 0) {
                  if (this.activeAds.length >= 5) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);
                    this.allForums.push(this.activeAds[2]);
                    this.allForums.push(this.activeAds[3]);
                    this.allForums.push(this.activeAds[4]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                    await this.chargeAdvert('view', this.activeAds[3]._id);
                    await this.chargeAdvert('view', this.activeAds[4]._id);
                  } else if (this.activeAds.length >= 4) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);
                    this.allForums.push(this.activeAds[2]);
                    this.allForums.push(this.activeAds[3]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                    await this.chargeAdvert('view', this.activeAds[3]._id);
                  } else if (this.activeAds.length >= 3) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);
                    this.allForums.push(this.activeAds[2]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                  } else if (this.activeAds.length >= 2) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                  } else if (this.activeAds.length >= 1) {
                    this.allForums.push(this.activeAds[0]);
                    await this.chargeAdvert('view', this.activeAds[0]._id);
                  }
                }

                this.allForums = this.allForums.sort( () => Math.random() - 0.5);
                return;
              } catch (e) {
                this.activeAds = [];
                return;
              }

              this.option = 'forum';
              return;
            } else {
              this.allForums = [];
              this.forumsMeta = {};

              this.option = 'forum';
              return;
            }
          }).then((e) => {});
      },
      async fetchForumsViaCategory(category) {
        await axios
          .get(this.$baseUrl + `/fetch-forums-via-category/` + this.nextForum + `/${category}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          }).then(async (response) => {
            if (response.status == 200) {
              this.allForums = response.data.data[0];
              this.forumsMeta = response.data.data[1];

              try {
                let activeAds = await axios.get(this.$baseUrl + '/advert/user/fetch', {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.fetchAuthState.token,
                    "App-Client": "web"
                  }
                });

                this.activeAds = activeAds.data.data[0].sort( () => Math.random() - 0.5);
                // Shuffle the ads and show the first one in the array...

                // charge the first advert...
                if (this.allForums.length > 0) {
                  if (this.activeAds.length >= 5) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);
                    this.allForums.push(this.activeAds[2]);
                    this.allForums.push(this.activeAds[3]);
                    this.allForums.push(this.activeAds[4]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                    await this.chargeAdvert('view', this.activeAds[3]._id);
                    await this.chargeAdvert('view', this.activeAds[4]._id);
                  } else if (this.activeAds.length >= 4) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);
                    this.allForums.push(this.activeAds[2]);
                    this.allForums.push(this.activeAds[3]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                    await this.chargeAdvert('view', this.activeAds[3]._id);
                  } else if (this.activeAds.length >= 3) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);
                    this.allForums.push(this.activeAds[2]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                  } else if (this.activeAds.length >= 2) {
                    this.allForums.push(this.activeAds[0]);
                    this.allForums.push(this.activeAds[1]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                  } else if (this.activeAds.length >= 1) {
                    this.allForums.push(this.activeAds[0]);
                    await this.chargeAdvert('view', this.activeAds[0]._id);
                  }
                }

                this.allForums = this.allForums.sort( () => Math.random() - 0.5);
                return;
              } catch (e) {
                this.activeAds = [];
                return;
              }

              this.option = 'forum';
              return;
            } else {
              this.allForums = [];
              this.forumsMeta = {};

              this.option = 'forum';
            }
          }).then((e) => {});
      },
      async fetchStatus() {
        await axios
          .get(this.$baseUrl + `/fetch-status/` + this.nextStatus, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          }).then((response) => {
            if (response.status == 200) {
              this.allStatus = response.data.data[0]
              this.statusMeta = response.data.data[1];
              this.option = 'status';
              return;
            } else {
              this.allStatus = []
              this.statusMeta = {};
              this.option = 'status';
              return;
            }
          }).then((e) => {});
      },
      async fetchNews() {
        await axios.get(this.$baseUrl + '/fetch-news/' + this.nextNews, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.AuthState.token,
            "App-Client": "web"
          }
        }).then(async (response) => {
          if (response.status == 200) {
            this.news = response.data.data[0];
            this.modalNews = response.data.data[0];

            this.newsMeta = { };
          } else {
            this.news = [];
            this.modalNews = [];
            this.newsMeta = {};
          }

        }).catch((e) => {
          try {
            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          } catch (err) {
            this.$modal.hide('hello-world');
            this.$toast.error('An unexpected error occurred and your Post could not be created. Please, try again later.', 'Post Error', this.notificationSystem.options.error);
          }
        });
      },
      async fetchPosts() {
        await axios
          .get(this.$baseUrl + `/fetch-posts/${this.nextPage}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          })
          .then(async (docs) => {
            if (docs.status === 200) {
              this.feeds = docs.data.data;

              try {
                let activeAds = await axios.get(this.$baseUrl + '/advert/user/fetch', {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "App-X-Token": this.fetchAuthState.token,
                    "App-Client": "web"
                  }
                });

                this.activeAds = activeAds.data.data[0].sort( () => Math.random() - 0.5);
                // Shuffle the ads and show the first one in the array...

                // charge the first advert...
                if (this.feeds[0].length > 0) {
                  if (this.activeAds.length >= 5) {
                    this.feeds[0].push(this.activeAds[0]);
                    this.feeds[0].push(this.activeAds[1]);
                    this.feeds[0].push(this.activeAds[2]);
                    this.feeds[0].push(this.activeAds[3]);
                    this.feeds[0].push(this.activeAds[4]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                    await this.chargeAdvert('view', this.activeAds[3]._id);
                    await this.chargeAdvert('view', this.activeAds[4]._id);
                  } else if (this.activeAds.length >= 4) {
                    this.feeds[0].push(this.activeAds[0]);
                    this.feeds[0].push(this.activeAds[1]);
                    this.feeds[0].push(this.activeAds[2]);
                    this.feeds[0].push(this.activeAds[3]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                    await this.chargeAdvert('view', this.activeAds[3]._id);
                  } else if (this.activeAds.length >= 3) {
                    this.feeds[0].push(this.activeAds[0]);
                    this.feeds[0].push(this.activeAds[1]);
                    this.feeds[0].push(this.activeAds[2]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                    await this.chargeAdvert('view', this.activeAds[2]._id);
                  } else if (this.activeAds.length >= 2) {
                    this.feeds[0].push(this.activeAds[0]);
                    this.feeds[0].push(this.activeAds[1]);

                    await this.chargeAdvert('view', this.activeAds[0]._id);
                    await this.chargeAdvert('view', this.activeAds[1]._id);
                  } else if (this.activeAds.length >= 1) {
                    this.feeds[0].push(this.activeAds[0]);
                    await this.chargeAdvert('view', this.activeAds[0]._id);
                  }
                }

                this.feeds[0] = this.feeds[0].sort( () => Math.random() - 0.5);
                return;
              } catch (e) {
                this.activeAds = [];
                return;
              }

              this.option = 'latest';
              return;
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
      async createPost() {
        if (this.showVideo) {
          const Validation = this.postValidator("video");

          if (Validation) {
            this.isActive = true;
            await this.initPost();
            const vm = this;
            // Handle Media Upload.....
            let PostInterval = setInterval(() => {
              vm.$toast.info(
                "Uploading Your Media Files",
                "Uploading Files",
                vm.notificationSystem.options.info
              );
            }, 5000);
            // await this.uploadImage('post');
            await this.uploadVideo("post");
            // Create The Post Content......
            await this.audioVideoCameraUpload();
            this.isActive = false;
            clearInterval(PostInterval);
          }

          if (!Validation) {
            this.isActive = false;
          }
        }

        if (this.showAudio) {
          const Validation = this.postValidator("audio");
          if (Validation) {
            this.isActive = true;
            await this.initPost();
            // Handle Media Uploads.......
            let vm = this;
            let PostInterval = setInterval(() => {
              vm.$toast.info(
                "Uploading Your Media Files",
                "Uploading Files",
                vm.notificationSystem.options.info
              );
            }, 5000);
            await this.uploadImage("post");
            await this.uploadAudio("post");
            await this.audioVideoCameraUpload("audio");
            // Create The Post Content.......
            this.isActive = false;
            clearInterval(PostInterval);
          }

          if (!Validation) {
            this.isActive = false;
          }
        }

        if (this.displayed === "news") {
          const Validation = this.postValidator("news");
          if (!Validation) {
            this.isActive = false;
          }

          if (Validation) {
            this.isActive = true;

            await this.initPost();
            let vm = this;
            let PostInterval = setInterval(() => {
              vm.$toast.info(
                "Creating Your Post... Please wait.",
                "Creating Content",
                vm.notificationSystem.options.info
              );
            }, 5000);
            // Create The Post Content.......
            await this.uploadImage('post');
            await this.createNewsForum();
            clearInterval(PostInterval);
            this.isActive = false;
          }
        }

        if (this.displayed == "forum") {
          const Validation = this.postValidator("forum");
          if (!Validation) {
            this.isActive = false;
          }

          if (Validation) {
            this.isActive = true;

            await this.initPost();
            let vm = this;
            let PostInterval = setInterval(() => {
              vm.$toast.info(
                "Creating Your Thread... Please wait.",
                "Creating Content",
                vm.notificationSystem.options.info
              );
            }, 5000);
            // Create The Post Content.......
            await this.uploadImage('post');
            await this.createForumPost();
            clearInterval(PostInterval);
            this.isActive = false;
          }
        }

        if (this.displayed == 'camera') {
          const Validation = this.postValidator("camera");
          if (!Validation) {
            this.isActive = false;
          }

          if (Validation) {
            this.isActive = true;

            await this.initPost();
            let vm = this;
            let PostInterval = setInterval(() => {
              vm.$toast.info(
                "Creating Your Thread... Please wait.",
                "Creating Content",
                vm.notificationSystem.options.info
              );
            }, 5000);
            // Create The Post Content.......
            await this.uploadImage('post');
            await this.createCameraPost();
            clearInterval(PostInterval);
            this.isActive = false;
          }
        }

        if (this.displayed == "status") {
          const Validation = this.postValidator("status");
          console.log(Validation);
          if (!Validation) {
            this.isActive = false;
          }

          if (Validation) {
            this.isActive = true;

            await this.initPost();
            let vm = this;
            let PostInterval = setInterval(() => {
              vm.$toast.info(
                "Creating Your Status... Please wait.",
                "Creating Content",
                vm.notificationSystem.options.info
              );
            }, 5000);
            try {
              // Create The Post Content.......
              if (
                this.selectedCover != undefined &&
                this.selectedCover != null &&
                this.selectedCover != ""
              ) {
                if (
                  this.selectedCover.type == "image/jpeg" ||
                  this.selectedCover.type == "image/png" ||
                  this.selectedCover.type == "image/jpg"
                ) {
                  await this.uploadImage('post');
                }

                if (
                  this.selectedCover.type != "image/jpeg" &&
                  this.selectedCover.type != "image/png" &&
                  this.selectedCover.type != "image/jpg"
                ) {
                  await this.uploadVideo('post', true);
                  console.log('sent....')
                }
              }

              await this.createStatus();
              clearInterval(PostInterval);
              this.isActive = false;
            } catch (e) {console.log(e)}
          }
        }
      },
      async createCameraPost() {
        let Payload = {
          title: this.addTitle,
          content: this.addNote,
          postType: 'picture',
          groupId: this.$route.params.groupId
        }

        try {
          let cameraPost = await axios.post(this.$baseUrl + '/create-basic-post/' + this.postId, Payload, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          });

          if (cameraPost.status == 201) {

            await this.fetchGroupDetails();
            await this.fetchGroupPosts();

            this.$modal.hide("hello-world");
            eventBus.$emit("post-action", { type: "increment" });

            this.$toast.success('Post Created.', 'Your Post Has Been Created Successfully.', this.notificationSystem.options.success);
            return;
          }
        } catch (e) {
          this.$toast.error('Operation Failed', 'Sorry, An Unknown Error Occurred And Your Post Could Not Be Created.', this.notificationSystem.options.error);
          return;
        }
      },
      async createNewsForum() {
        let payload = {
          title: this.addForumTitle,
          content: this.editorData,
          postType: "news"
        }
        await axios.post(this.$baseUrl + '/create-news-forum-post/' + this.postId, payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.AuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          if (response.status == 201) {
            let Data = response.data.data[0];
            Data.user = this.UserState;

            this.news.unshift(Data);

            this.$modal.hide("hello-world");
            eventBus.$emit("post-action", { type: "increment" });

            this.$toast.success("Your news has been created Successfully.", "Success", this.notificationSystem.options.success);
          }
        }).catch((e) => {
          try {
            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          } catch (err) {
            this.$modal.hide('hello-world');
            this.$toast.error('An unexpected error occurred and your Post could not be created. Please, try again later.', 'Post Error', this.notificationSystem.options.error);
          }
        });
      },
      async createForumPost() {
        let payload = {
          title: this.addForumTitle,
          content: this.editorData,
          category: this.selected_forum_category,
          postType: "forum"
        }
        await axios.post(this.$baseUrl + '/create-forum/' + this.postId, payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.AuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          if (response.status == 201) {
            let Data = response.data.data[0];
            Data.user = this.UserState;
            this.allForums.unshift(Data);

            this.$modal.hide("hello-world");
            eventBus.$emit("post-action", { type: "increment" });

            this.$toast.success("Your Post has been created Successfully to the forum.", "Success", this.notificationSystem.options.success);
          }
        }).catch((e) => {
          try {
            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          } catch (err) {
            this.$modal.hide('hello-world');
            this.$toast.error('An unexpected error occurred and your Post could not be created. Please, try again later.', 'Post Error', this.notificationSystem.options.error);
          }
        });
      },
      async createStatus() {
        let payload = {
          title: this.addForumTitle,
          content: this.addNote,
          postType: "status"
        }
        await axios.post(this.$baseUrl + '/create-status/' + this.postId, payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "App-X-Token": this.AuthState.token,
            "App-Client": "web"
          }
        }).then((response) => {
          if (response.status == 201) {
            let Data = response.data.data[0];
            Data.user = this.UserState;

            this.allStatus.unshift(Data);

            this.$modal.hide("hello-world");
            // eventBus.$emit("post-action", { type: "increment" });

            this.$toast.success("Your Status has been created Successfully to the forum.", "Success", this.notificationSystem.options.success);
          }
        }).catch((e) => { });
      },
      postValidator(postType = "video") {
        if (postType === "video") {
          if (
            this.addTitle == "" ||
            this.addTitle == null ||
            this.addTitle == undefined
          ) {
            this.$toast.error(
              "Sorry, the Post Title Field is Required.",
              "Post Title",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.addNote == "" ||
            this.addNote == null ||
            this.addNote == undefined
          ) {
            this.$toast.error(
              "Sorry, The Post Content Field is Required.",
              "Post Content",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selected_genre.length < 1 ||
            this.selected_genre == undefined ||
            this.selected_genre == null ||
            this.selected_genre == ""
          ) {
            this.$toast.error(
              "Sorry, The Video Genre Option is Required",
              "Video Genre",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.$refs.video == undefined ||
            typeof this.$refs.video == null ||
            this.$refs.video == ""
          ) {
            this.$toast.error(
              "Sorry, A Video File is Required in order to post",
              "Video Error",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.$refs.video.files[0].type !== "video/3gpp" &&
            this.$refs.video.files[0].type !== "video/mp4" &&
            this.$refs.video.files[0].type !== "video/x-ms-wmv" &&
            this.$refs.video.files[0].type !== "application/x-mpegURL" &&
            this.$refs.video.files[0].type !== "video/MP2T"
          ) {
            this.$toast.error(
              "Sorry, Only 3gpp, mp4, x-ms-wmv and x-mpegURL Videos are allowed.",
              "Video Error",
              this.notificationSystem.options.error
            );

            return false;
          }

          return true;
        }

        if (postType == "audio") {
          if (
            this.addTitle == "" ||
            this.addTitle == null ||
            this.addTitle == undefined
          ) {
            this.$toast.error(
              "Sorry, the Post Title Field is Required.",
              "Post Title",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.addNote == "" ||
            this.addNote == null ||
            this.addNote == undefined
          ) {
            this.$toast.error(
              "Sorry, The Post Content Field is Required.",
              "Post Content",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selected_genre.length < 1 ||
            this.selected_genre == undefined ||
            this.selected_genre == null ||
            this.selected_genre == ""
          ) {
            this.$toast.error(
              "Sorry, The Video Genre Option is Required",
              "Video Genre",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selectedCover == undefined ||
            this.selectedCover == null ||
            this.selectedCover == ""
          ) {
            this.$toast.error(
              "Sorry, The Cover Picture is Required.",
              "Cover Picture",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selectedCover.type !== "image/jpeg" &&
            this.selectedCover.type !== "image/png" &&
            this.selectedCover.type !== "image/jpg"
          ) {
            this.$toast.error(
              "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
              "Picture Format",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.$refs.audio == undefined ||
            typeof this.$refs.audio == null ||
            this.$refs.audio == ""
          ) {
            this.$toast.error(
              "Sorry, An Audio File is Required in order to post",
              "Audio File",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.$refs.audio.files[0].type == "audio/mp4" &&
            this.$refs.audio.files[0].type == "audio/mp3" &&
            this.$refs.audio.files[0].type == "audio/basic" &&
            this.$refs.audio.files[0].type == "audio/mpeg" &&
            this.$refs.audio.files[0].type == "audio/mpeg4-generic" &&
            this.$refs.audio.files[0].type == "audio/opus" &&
            this.$refs.audio.files[0].type == "audio/ogg"
          ) {
            this.$toast.error(
              "Sorry, Only, Mp4, Mp3, Basic, Mpeg, Mpeg4-generic, Opus, and Ogg file are allowed.",
              "Audio Format",
              this.notificationSystem.options.success
            );

            return false;
          }

          return true;
        }

        if (postType == 'news' || postType == 'forum') {
          if (this.addForumTitle == undefined || this.addForumTitle == null || this.addForumTitle == '') {
            this.$toast.error('Sorry, the title field cannot be empty.', `${postType} Title`, this.notificationSystem.options.error);
            return false;
          }

          if (this.editorData == undefined || this.editorData == null || this.editorData == '') {
            this.$toast.error('Sorry, the content field cannot be empty.', `${postType} Content`, this.notificationSystem.options.error);
            return false;
          }

          if (postType == "forum") {
            if (this.selected_forum_category.trim() == "" || this.selected_forum_category == null) {
              this.$toast.error('Sorry, Please pick a category to continue.', 'Forum Category', this.notificationSystem.options.error);
              return false;
            }
          }

          if (
            this.selectedCover == undefined ||
            this.selectedCover == null ||
            this.selectedCover == ""
          ) {
            this.$toast.error(
              "Sorry, The Cover Picture is Required.",
              "Cover Picture",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selectedCover.type !== "image/jpeg" &&
            this.selectedCover.type !== "image/png" &&
            this.selectedCover.type !== "image/jpg"
          ) {
            this.$toast.error(
              "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
              "Picture Format",
              this.notificationSystem.options.error
            );
            return false;
          }

          return true;
        }

        if (postType == 'camera') {
          if (
            this.addTitle == "" ||
            this.addTitle == null ||
            this.addTitle == undefined
          ) {
            this.$toast.error(
              "Sorry, the Post Title Field is Required.",
              "Post Title",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.addNote == "" ||
            this.addNote == null ||
            this.addNote == undefined
          ) {
            this.$toast.error(
              "Sorry, The Post Content Field is Required.",
              "Post Content",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selectedCover == undefined ||
            this.selectedCover == null ||
            this.selectedCover == ""
          ) {
            this.$toast.error(
              "Sorry, The Cover Picture is Required.",
              "Cover Picture",
              this.notificationSystem.options.error
            );
            return false;
          }

          if (
            this.selectedCover.type !== "image/jpeg" &&
            this.selectedCover.type !== "image/png" &&
            this.selectedCover.type !== "image/jpg"
          ) {
            this.$toast.error(
              "Sorry, Only Jpeg, Jpg, and Png Images are allowed.",
              "Picture Format",
              this.notificationSystem.options.error
            );
            return false;
          }

          return true;
        }

        if (postType == 'status') {
          if (this.addForumTitle == undefined || this.addForumTitle == null || this.addForumTitle == '') {
            this.$toast.error('Sorry, the title field cannot be empty.', `${postType} Title`, this.notificationSystem.options.error);
            return false;
          }

          if (this.addNote == undefined || this.addNote == null || this.addNote == '') {
            this.$toast.error('Sorry, the Note field cannot be empty.', `${postType} Content`, this.notificationSystem.options.error);
            return false;
          }

          return true;
        }
      },
      async initPost() {
        await axios
          .get(this.$baseUrl + "/init-post", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          })
          .then(response => {
            const Status = response.data.status;
            const PostId = response.data.data[0].postId;
            if (Status === 200) {
              this.postId = PostId;
            }
          })
          .catch(e => {
            console.log(e);
            return;

            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          });
      },
      async uploadImage(postType) {
        const Data = new FormData();
        Data.append("image", this.selectedCover);
        await axios
          .post(
            this.$baseUrl + `/image-upload/${postType}/${this.postId}`,
            Data,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "App-X-Token": this.AuthState.token,
                "App-Client": "web"
              }
            }
          )
          .then(response => {
            const Status = response.data.status;
            const ImageUrl = response.data.imageUrl;
            if (Status === 200) {
              this.imageUrl = ImageUrl;
            }
          })
          .catch(e => {
            console.log(e);
            return;

            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          });
      },
      async uploadVideo(postType, status = false) {
        const Data = new FormData();
        if (!status) {
          Data.append("video", this.$refs.video.files[0]);
        }

        if (status) {
          Data.append("video", this.selectedCover);
        }
        await axios
          .post(
            this.$baseUrl + `/video-upload/${postType}/${this.postId}`,
            Data,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "App-X-Token": this.AuthState.token,
                "App-Client": "web"
              }
            }
          )
          .then(response => {
            const Status = response.data.status;
            const VideoUrl = response.data.videoUrl;

            if (Status === 200) {
              this.videoUrl = VideoUrl;
            }
          })
          .catch(e => {
            console.log(e);
            return;

            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          });
      },
      async uploadAudio(postType) {
        const Data = new FormData();
        Data.append("audio", this.$refs.audio.files[0]);
        await axios
          .post(this.$baseUrl + `/audio-upload/post/${this.postId}`, Data, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          })
          .then(response => {
            if (this.response.status == 200) {
              this.audioUrl = response.data.audioUrl;
            }
          })
          .catch(e => {
            console.log(e);
            return;

            if (
              typeof e.response.status !== undefined &&
              typeof e.response.status !== "" &&
              typeof e.response.status !== null &&
              typeof e.response.status !== "null"
            ) {
              const status = e.response.status;
              if (status === 400) {
                const Data = e.response.data.message;
                Data.forEach(err => {
                  for (const key in err) {
                    this.$toast.error(
                      err[key],
                      `${key} Error`,
                      this.notificationSystem.options.error
                    );
                  }
                });
                return;
              } else if (status === 500) {
                const Data = e.response.data.message[0].server;
                this.$toast.error(
                  Data.errorMessage,
                  "Server Error",
                  this.notificationSystem.options.error
                );
                return;
              } else {
                this.$toast.error(
                  e.message,
                  "Technical Error",
                  this.notificationSystem.options.error
                );
              }
            }
          });
      },
      async audioVideoCameraUpload(postType = "video") {
        let originality = document
          .getElementById("originality")
          .textContent.trim();
        if (originality == "yes") {
          originality = true;
        } else {
          originality = false;
        }

        const Payload = {
          title: this.addTitle,
          content: this.addNote,
          genre: this.selected_genre,
          original: originality,
          postType: postType,
          forumCategory: "",
          groupId: this.$route.params.groupId
        };

        await axios
          .post(this.$baseUrl + `/create-post/${this.postId}`, Payload, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "App-X-Token": this.AuthState.token,
              "App-Client": "web"
            }
          })
          .then(async response => {
            const Status = response.status;
            const Data = response.data.data[0];
            if (Status === 201) {
              // Push The Data to the top of the array list.......
              this.$toast.success(
                "Your Post Has Been Created Successfully",
                "Success",
                this.notificationSystem.options.success
              );

              this.addTitle = "";
              this.addNote = "";
              this.selected_genre = "";

              document.getElementById("originality").textContent = "";
              this.$refs.audio = "";
              this.$refs.video = "";

              await this.fetchGroupDetails();
              await this.fetchGroupPosts();

              this.$modal.hide("hello-world");
              eventBus.$emit("post-action", { type: "increment" });
            }
          })
          .catch(e => {
            try {
              if (
                typeof e.response.status !== undefined &&
                typeof e.response.status !== "" &&
                typeof e.response.status !== null &&
                typeof e.response.status !== "null"
              ) {
                const status = e.response.status;
                if (status === 400) {
                  const Data = e.response.data.message;
                  Data.forEach(err => {
                    for (const key in err) {
                      this.$toast.error(
                        err[key],
                        `${key} Error`,
                        this.notificationSystem.options.error
                      );
                    }
                  });
                  return;
                } else if (status === 500) {
                  const Data = e.response.data.message[0].server;
                  this.$toast.error(
                    Data.errorMessage,
                    "Server Error",
                    this.notificationSystem.options.error
                  );
                  return;
                } else {
                  this.$toast.error(
                    e.message,
                    "Technical Error",
                    this.notificationSystem.options.error
                  );
                }
              }
            } catch (err) {
              this.$modal.hide('hello-world');
              this.$toast.error('An unexpected error occurred and your post could not be created. Please, try again later.', 'Post Error', this.notificationSystem.options.error);
            }
          });
      },
      showNewsModal(data) {
        this.singleNews = data; //take this data and push it to the top of the array...
        this.modalNews = this.modalNews.filter((el) => {
          if (el._id != data._id) return true;
        });
        // push the data on to the top of the array...
        this.modalNews.unshift(data);
        // call a method to fetch the posts with the most comment.
        this.fetchNewsWithTheMostComment();
        this.$modal.show("news-modal", {
          resizable: true,
          height: 'auto'
        });
      },
      fetchNewsWithTheMostComment() {
        let maxComments = [];
        for (let i = 0; i < this.modalNews.length; i++) {
          maxComments.push(parseInt(this.modalNews[i].comments));
        }
        //get rid of the zeros....
        maxComments = maxComments.filter((el) => {
          if (el > 0) return true;
        });
        maxComments = maxComments.slice(0, 5);
        // get the highest comments...
        maxComments = maxComments.sort(function (a,b) {
          return a-b;
        });

        if (maxComments.length > 0) {
          // lets load up some trends.....
          for (let i = 0; i < maxComments.length; i++) {
            this.popularNews = this.modalNews.filter((el) => {
              if (maxComments[i] == el.comments) return true;
            });
          }
          return true;
        }

        this.popularNews = [];
      },
      onSelectedCover() {
        this.selectedCover = event.target.files[0];
        console.log(this.selectedCover);
      },
      onFileSelected(event) {
        if (this.showVideo) {
          this.fileName = "video";
        }

        if (this.showAudio) {
          this.fileName = "audio";
        }

        this.selectedFile = event.target.files[0];
      },
      onUpload() {},
      profile() {
        this.$router.push({ path: "/Profile" });
      },
      home() {
        this.$router.push({ path: "/home" });
      },
      chooseImage() {
        this.$refs.fileInput.click();
      },
      onSelectFile() {
        const input = this.$refs.fileInput;
        const files = input.files;
        if (files && files[0]) {
          const reader = new FileReader();
          reader.onload = e => {
            this.imageData = e.target.result;
          };
          reader.readAsDataURL(files[0]);
          this.$emit("input", files[0]);
        }
      },
      dropdown() {
        this.clickedropdown = true;
      },
      showModal(content) {
        console.log(content);
        this.currentModal = content;
        this.addNote = null;
        this.addForumTitle = null;
        this.addTitle = null;
        this.imageData = null;
        if (content === "video") {
          this.showVideo = true;
          (this.showPicture = false),
            (this.showAudio = false),
            (this.showForum = false),
            (this.showStatus = false);
          this.showNews = false;
        } else if (content === "audio") {
          this.showAudio = true;
          (this.showPicture = false),
            (this.showVideo = false),
            (this.showForum = false),
            (this.showStatus = false);
          this.showNews = false;
        } else if (content === "camera") {
          this.showPicture = true;
          (this.showVideo = false),
            (this.showAudio = false),
            (this.showForum = false),
            (this.showStatus = false);
          this.showNews = false;
        } else if (content === "forum") {
          this.showForum = true;
          this.showPicture = false;
          this.showAudio = false;
          this.showVideo = false;
          this.showStatus = false;
          this.showNews = false;
        } else if (content === "status") {
          this.showStatus = true;
          this.showPicture = false;
          this.showAudio = false;
          this.showForum = false;
          this.showVideo = false;
          this.showNews = false;
        } else if (content === "news") {
          this.showNews = true;
          this.showStatus = false;
          this.showPicture = false;
          this.showAudio = false;
          this.showForum = false;
          this.showVideo = false;
        }

        this.displayed = content;
        this.$modal.show("hello-world");
      },
      hide: async function() {},
      cancel_image() {
        this.imageData = false;
      },
      clicked_option(option) {
        this.option = option;
        this.imageData = null;
        if (option === "latest") {
          console.log("wetinhappen");
          this.clickedLatest = true;
          this.clickedArtiste = false;
          this.clickedForum = false;
          this.clickedNews = false;
          this.clickedStatus = false;
        } else if (option === "artiste") {
          this.clickedLatest = false;
          this.clickedArtiste = true;
          this.clickedForum = false;
          this.clickedNews = false;
          this.clickedStatus = false;
        } else if (option === "forum") {
          this.clickedLatest = false;
          this.clickedArtiste = false;
          this.clickedForum = true;
          this.clickedNews = false;
          this.clickedStatus = false;
        } else if (option === "news") {
          this.clickedLatest = false;
          this.clickedArtiste = false;
          this.clickedForum = false;
          this.clickedNews = true;
          this.clickedStatus = false;
        } else if (option === "status") {
          this.clickedLatest = false;
          this.clickedArtiste = false;
          this.clickedForum = false;
          this.clickedStatus = true;
          this.clickedNews = false;
        }
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
@media (min-width: 320px) {
  .group-feeds-top .feed-text-header {
    margin-top: 2px !important;
    margin-left: -9%;
  }
}
</style>

<template>
  <div>
    <div id="righty" class="right-nav">
      <div class="popular-container">
        <div class="popular-container-1">
          <div class="popular-heading">Most Popular This Week</div>
          <div class="thin-line-pop" text-wrap></div>
          <div class="song-list"
               v-for="(popular, index) in populars"
               :key="index">
            <div class="popular-grid">
              <img @click="profile()" class="avatar" src="../assets/u4.jpg" />
              <div @click="profile()" class="artiste-name">
                {{ popular.artiste }}
              </div>
              <div class="song-title">{{ popular.title }}</div>
              <div class="views-and-genre">
                <i class="fas fa-eye icon-pop"></i> {{ popular.views }} - {{ popular.genre }}
              </div>
            </div>
          </div>
          <div class="thin-line-pop" text-wrap></div>
          <div class="view-all">View all</div>
        </div>
      </div>
      <div class="spacing"></div>
      <div class="advertising-right">
        <div class="advert-text-right">Advertising</div>
        <img class="ad-right" v-if="activeAds.length > 0 && activeAds[1]" :src="activeAds[1].banner" alt />
      </div>
      <div class="popular-container">
        <div class="popular-container-1">
          <div class="popular-heading">
            Make Connections
            <div class="number">{{ connectionsTotal }}+</div>
          </div>
          <div class="thin-line-pop" text-wrap></div>
          <div class="song-list"
               v-for="connection in connections"
               :key="connection.id">
            <div class="pop-container">
              <div class="popular-grid">
                <template v-if="connection.avatar == ''">
                    <img
                      @click="profile()"
                      class="avatar-connections avatar"
                      src="../assets/u4.jpg"
                    />
                  </template>
                <template v-else>
                    <img
                      @click="profile()"
                      class="avatar-connections avatar"
                      :src="connection.avatar"
                    />
                  </template>
                <div @click="profile()" class="artiste-name">
                  {{ connection.name }}
                </div>
                <div class="song-title">
                  {{ connection.fanbase | formatNumber }} fanbases
                </div>
              </div>
              <button class="button-cont"
                      @click="makeNewConnection(connection)">
                  Connect
                </button>
            </div>
          </div>
          <div class="thin-line-pop" text-wrap></div>
          <div class="view-all">View all recommendations</div>
        </div>
      </div>
      <div class="spacing"></div>
      <div class="spacing"></div>
      <div class="advertising-right">
        <div class="advert-text-right">Advertising</div>
        <img class="ad-right" v-if="activeAds.length > 0 && activeAds[2]" :src="activeAds[2].banner" alt />
      </div>
      <div class="chat-panel">
        <span class="chat-bubble" @mouseenter="openChat()">
            <i style="color: white;" class="fas fa-comment-alt"></i>
          </span>
        <!-- <span class="chat-notifications">20+</span> -->
      </div>
      <modal name="chat-modal" class="chatModal">
        <div class="chat-box">
          <div class="chat-box-settings">
            <ul>
              <li v-if="fetchUserState.state.avatar == ''">
                <img src="../assets/right-ad-sample-2.jpg" :title="fetchUserState.state.stageName" class="user-profile-pic" :alt="fetchUserState.state.stageName">
              </li>
              <li v-if="fetchUserState.state.avatar != ''">
                <img :src="fetchUserState.avatar" :title="fetchUserState.state.stageName" class="user-profile-pic" :alt="fetchUserState.state.stageName">
              </li>
              <li>
                <v-text-field placeholder="Search for a chat..." outlined
                              style="margin: 28px;"></v-text-field>
              </li>
              <li style="margin-top: 13px; cursor: pointer; margin-left: -10%;" @click="showFriends()">
                <i class="fas fa-edit" title="Find Friends"></i>
              </li>
              <li @click="closeChat()" style="margin-left: -4%; font-size: 124%; margin-top: 19px; cursor: pointer;">
                <i class="fas fa-times" title="close tray"></i>
              </li>
            </ul>
          </div>
          <div id="" v-if="recentChat.length > 0 && chatMode == false">
            <div class="chat-heading">
              <h4><i class="fas fa-comment-alt" style="color: blue;"></i> Recent Chats</h4>
              <hr>
            </div>
            <div class="recent-chats" v-if="recentChat.length > 0">
              <ul v-for="recent in recentChat" :key="recent._id" @click="startChat(recent)">
                <li class="chat-line">
                  <ul>
                    <li class="friends-image">
                      <img class="ad-right" v-if="recent.receiverProfile.avatar == ''" src="../assets/right-ad-sample-2.jpg" alt />
                      <img class="ad-right" v-if="recent.receiverProfile.avatar != ''" :src="recent.receiverProfile.avatar" :alt="recent.receiverProfile.stageName" />
                    </li>
                    <li class="name-and-message">
                      <div class="friends-name">{{ recent.receiverProfile.stageName }}</div>
                      <template id="" v-if="recent.messageId">
                        <div class="last-msg unread" v-if="recent.status == 'unread'">
                          {{ recent.chat | truncate }}
                        </div>
                        <div class="last-msg" v-else>
                          {{ recent.chat | truncate }}
                        </div>
                      </template>
                    </li>
                    <li v-if="recent.receiverProfile.presence == 'online'" class="online-status"></li>
                    <li v-if="recent.receiverProfile.presence == 'offline'" class="offline-status"><small>{{ recent.receiverProfile.lastSeen }}</small></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <template id="" v-if="chatList.length > 0 && chatMode == false">
            <div class="chat-heading">
              <h4><i class="fas fa-comment-alt" style="color: blue;"></i> Message Your Friends.</h4>
              <hr>
            </div>
            <div class="recent-chats">
              <ul v-for="chat in chatList[0]" :key="chat._id" style="cursor: pointer;" @click="startChat(chat)">
                <li class="chat-line">
                  <ul v-if="fetchUserState.stageName == chat.receiverProfile.stageName">
                    <li class="friends-image" v-if="chat.senderProfile.avatar == ''">
                      <img class="ad-right" src="../assets/right-ad-sample-2.jpg" alt='Receiver Avatar' />
                    </li>
                    <li class="friends-image" v-if="chat.senderProfile.avatar != ''">
                      <img class="ad-right" :src="chat.senderProfile.avatar" alt='Receiver Avatar' />
                    </li>
                    <li class="name-and-message">
                      <div class="friends-name">{{ chat.senderProfile.stageName }}</div>
                      <template id="" v-if="chat.chat.messageId">
                        <div class="last-msg unread" v-if="chat.chat.status == 'unread'">
                          {{ chat.chat.chat | truncate }}
                        </div>
                        <div class="last-msg" v-else>
                          {{ chat.chat.chat | truncate }}
                        </div>
                      </template>
                      <div class="last-msg" v-else>
                        {{ 'Say hi!' }}
                      </div>
                    </li>
                    <li v-if="chat.senderProfile.presence == 'online'" class="online-status"></li>
                    <li v-if="chat.senderProfile.presence == 'offline'" class="offline-status"><small>{{ chat.receiverProfile.lastSeen }}</small></li>
                  </ul>
                  <ul v-if="fetchUserState.stageName == chat.senderProfile.stageName">
                    <li class="friends-image" v-if="chat.receiverProfile.avatar == ''">
                      <img class="ad-right" src="../assets/right-ad-sample-2.jpg" alt='Receiver Avatar' />
                    </li>
                    <li class="friends-image" v-if="chat.receiverProfile.avatar != ''">
                      <img class="ad-right" :src="chat.receiverProfile.avatar" alt='Receiver Avatar' />
                    </li>
                    <li class="name-and-message">
                      <div class="friends-name">{{ chat.receiverProfile.stageName }}</div>
                      <template id="" v-if="chat.chat.messageId">
                        <div class="last-msg unread" v-if="chat.chat.status == 'unread'">
                          {{ chat.chat.chat | truncate }}
                        </div>
                        <div class="last-msg" v-else>
                          {{ chat.chat.chat | truncate }}
                        </div>
                      </template>
                      <div class="last-msg" v-else>
                        {{ 'Say hi!' }}
                      </div>
                    </li>
                    <li v-if="chat.receiverProfile.presence == 'online'" class="online-status"></li>
                    <li v-if="chat.receiverProfile.presence == 'offline'" class="offline-status"><small>{{ chat.receiverProfile.lastSeen }}</small></li>
                  </ul>
                </li>
              </ul>
            </div>
          </template>
          <div class="current-chat">
            <template v-if="chatMode" id="">
              <div class="" v-if="chatHistory.length > 0">
                <div v-for="chatH in chatHistory" :key="chatH._id">
                  <div class="sender" v-if="chatH.senderProfile.stageName != fetchUserState.stageName">
                    <div class="friends-chat-image" v-if="chatH.senderProfile.avatar == ''">
                      <img src="../assets/right-ad-sample-2.jpg" :title="chatH.senderProfile.stageName" class="user-profile-pic" :alt="chatH.senderProfile.stageName">
                    </div>
                    <div class="friends-chat-image" v-else>
                      <img :src="chatH.senderProfile.avatar" :title="chatH.senderProfile.stageName" class="user-profile-pic" :alt="chatH.senderProfile.stageName">
                    </div>
                    <div class=" talk-bubble tri-right left-top">
                      <div class="talktext">
                        <p>{{ chatH.chat }}</p>
                        <template v-if="chatH.media.picture !== '' && chatH.media.picture !== null">
                          <img :src="chatH.media.picture" alt="Picture" style="width: 76px;"> <br>
                        </template>
                        <template v-if="chatH.media.audio !== '' && chatH.media.audio !== null">
                          <audio :src="chatH.media.audio" preload="none" style="width: -webkit-fill-available;" controls></audio> <br>
                        </template>
                        <template v-if="chatH.media.video !== '' && chatH.media.video !== null">
                          <video preload="none" class="image-feed" width="3000" height="240" controls>
                            <source v-bind:src="chatH.media.video" />
                          </video>
                        </template>
                      </div>
                      <small style="padding-left: 15px;"><i class="fas fa-clock"></i> {{ chatH.timestamp | diffForHumans }} </small>
                    </div>
                  </div>

                  <div class="messenger" v-if="chatH.senderProfile.stageName == fetchUserState.stageName">
                    <div class="talk-bubble tri-right btm-right">
                      <div class="talktext">
                        <p>{{ chatH.chat }}</p>
                        <template v-if="chatH.media.picture !== '' && chatH.media.picture !== null">
                          <img :src="chatH.media.picture" alt="Picture" style="width: 76px;"><br>
                        </template>
                        <template v-if="chatH.media.audio !== '' && chatH.media.audio !== null">
                          <audio :src="chatH.media.audio" preload="none" style="width: -webkit-fill-available;" controls></audio> <br>
                        </template>
                        <template v-if="chatH.media.video !== '' && chatH.media.video !== null">
                          <video preload="none" class="image-feed" width="3000" height="240" controls>
                            <source v-bind:src="chatH.media.video" />
                          </video>
                        </template>
                        <small style="padding-left: 2px;"><b><i class="fas fa-clock"></i> {{ chatH.timestamp | diffForHumans }} </b></small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="sender" v-show="typing">
                <div class="friends-chat-image" v-if="typingAvatar == ''">
                  <img src="../assets/right-ad-sample-2.jpg" title="chattingWith" class="user-profile-pic" :alt="chattingWith">
                </div>
                <div class="friends-chat-image" v-if="typingAvatar != ''">
                  <img :src="typingAvatar" title="chattingWith" class="user-profile-pic" :alt="chattingWith">
                </div>
                <div class=" talk-bubble tri-right left-top">
                  <div class="talktext">
                    <p>Typing...</p>
                  </div>
                  <small style="padding-left: 15px;"><i class="fas fa-clock"></i> Now</small>
                </div>
              </div>
            </template>

            <div v-if="chatMode" class="chat-action">
              <ul>
                <li class="emoji-picker" v-if="!isMedia">
                  <twemoji-picker
                    :emojiData="emojiDataAll"
                    :emojiGroups="emojiGroups"
                    :skinsSelection="true"
                    :searchEmojisFeat="true"
                    searchEmojiPlaceholder="Search here."
                    searchEmojiNotFound="Emojis not found."
                    isLoadingLabel="Loading..."
                    @emojiUnicodeAdded="catchEmojiImage"
                  ></twemoji-picker>
                </li>
                <li class="text-input">
                  <v-col cols="12" sm="12" md="12" lg="12" xl="12" v-if="!isMedia">
                    <v-text-field
                      v-model="chatMessage"
                      placeholder="Enter a message" @keypress="isTyping()"
                      v-on:keyup.enter="sendMessage()"
                      v-on:keyup.delete="deleteEmoji()"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <ul class="media-icons" v-if="isMedia">
                    <li @click="openCameraModal()" data-toggle="tooltip" data-placement="top" title="Send Pictures" style="cursor: pointer;"><i class="fas fa-camera"></i></li>
                    <li @click="openVideoModal()" data-toggle="tooltip" data-placement="top" title="Send Pictures" style="cursor: pointer;"><i class="fas fa-video"></i></li>
                    <li @click="openAudioModal()" data-toggle="tooltip" data-placement="top" title="Send Audio Files" style="cursor: pointer;"><i class="fas fa-play-circle"></i></li>
                  </ul>
                </li>
                <li class="additional-features" @click="openMedia()" style="color: black !important; cursor: pointer;">
                  <i class="fas fa-paperclip"></i>
                </li>
                <!-- <li class="send-message" @click="sendMessage()">
                  <i class="fas fa-paper-plane"></i>
                </li> -->
              </ul>
            </div>
          </div>
        </div>
      </modal>
    </div>

    <!-- Chat Media Modal -->
    <modal name="camera-modal" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Share Photo</h5>
      <hr>
      <form action="" method="post" @submit.prevent="uploadMediaContent('picture')">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <input type="file" @change="uploadBanner" ref="fileInput" id="camera-file" class="form-control">
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Upload</button>
        </div>
      </form>
    </modal>
    <modal name="audio-modal" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Share Audio</h5>
      <hr>
      <form action="" method="post" @submit.prevent="uploadMediaContent('audio')">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <input type="file" @change="uploadAudio" ref="fileInputTwo" id="audio-file" class="form-control">
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Upload</button>
        </div>
      </form>
    </modal>
    <modal name="video-modal" style="margin-top: -5%;">
      <h5 class="black-text" style="padding-left: 10px;">Share Video</h5>
      <hr>
      <form action="" method="post" @submit.prevent="uploadMediaContent('video')">
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <div class="form-group">
            <input type="file" @change="uploadVideo" ref="fileInputThree" id="video-file" class="form-control">
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
          <button type="submit" class="btn btn-md btn-success btn-block">Upload</button>
        </div>
      </form>
    </modal>
    <!-- Chat Media Modal -->
  </div>
</template>
<script>

/*eslint-disable*/
  import { SocketConnection } from '@/mixins/GlobalMixins'
  import eventBus from '@/mixins/EventsMixins'

  import axios from 'axios'
  import moment from 'moment'
  import io from 'socket.io-client'

  import {
    TwemojiPicker
  } from '@kevinfaguiar/vue-twemoji-picker';
  import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json';
  import EmojiDataAnimalsNature from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-group-animals-nature.json';
  import EmojiDataFoodDrink from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-group-food-drink.json';
  import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';

  var socket = io.connect(SocketConnection())
  export default {
    async mounted() {
      await this.fetchConnections()
      await this.loadRecentChats();
      await this.loadChatList();

      await this.fetchActiveAdverts('first');

      eventBus.$on('artiste-connection', user => {
        this.connections = this.connections.filter(connection => {
          if (connection.id !== user.id) return true
        })

        setTimeout(async () => {
          await this.fetchConnections()
        }, 3000)
      });

      // const ___this = this;
      eventBus.$on('open-chat-container', () => {
        this.$modal.show('chat-modal');
      });

      socket.on('incomingChat', (data) => {
        if (this.chatMode) {
          if (data.sender == this.chattingWith) {
            this.typing = true;
            this.typingAvatar = data.senderAvatar;

            setInterval(() => {
              this.typing = false;
              this.typingAvatar = '';
            }, 5000);
          }
        }
      });

      socket.on('messageReceived', (data) => {
        if (this.chatMode) {
          if (this.chattingWith == data.senderProfile.stageName) {
            // push the message to the top...
            this.chatHistory.push(data);

            setTimeout(() => {
              var elem = document.querySelector('.chatModal .v--modal-box');
              if (elem) {
                elem.scrollTop = elem.scrollHeight;
              }
            }, 3000);
          }
        }

        if (!this.chatMode) {
          if (data.senderProfile.stageName != data.messageOwner && data.senderProfile.stageName !== this.fetchUserState.stageName) {
            this.toast.info(data.senderProfile.stageName + ' just sent you a message!', 'New Message', this.notificationSystem.options.info);
          }     
        }
      });

      socket.on('newLoginEntry', dataName => {
        if (this.chatList[0].length > 0) {
          for (let i = 0; i < this.chatList[0].length; i++) {
            if (this.chatList[0][i].senderProfile.stageName == dataName) {
              this.chatList[0][i].senderProfile.presence = 'online';
            }

            if (this.chatList[0][i].receiverProfile.stageName == dataName) {
              this.chatList[0][i].senderProfile.presence = 'online';
            }
          }
        }
      });

      // A New Advert Will Be Displayed Every 5 Minutes..
      setInterval(async () => {
        await this.fetchActiveAdverts('second');
      }, 300000);
    },
    computed: {
      fetchAuthState() {
        return this.$store.getters.fetchAuthStore
      },
      fetchUserState() {
        return this.$store.getters.fetchUserStore
      },
      emojiDataAll() {
          return EmojiAllData;
      },
      emojiGroups() {
          return EmojiGroups;
      }
    },
    created() {
      window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    components: {
      'twemoji-picker': TwemojiPicker
    },
    methods: {
      openCameraModal() {
        this.$modal.show('camera-modal');
      },
      openAudioModal() {
        this.$modal.show('audio-modal');
      },
      openVideoModal() {
        this.$modal.show('video-modal');
      },
      async uploadBanner(e) {
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

          document.getElementById('camera-file').value = '';
          return;
        }

        this.$toast.success('Valid Image File Detected.', 'Success', this.notificationSystem.options.success);
        return;
      },
      async uploadAudio(e) {
        if (
          this.$refs.fileInputTwo.files[0].type !== "audio/mp4" &&
          this.$refs.fileInputTwo.files[0].type !== "audio/mp3" &&
          this.$refs.fileInputTwo.files[0].type !== "audio/basic" &&
          this.$refs.fileInputTwo.files[0].type !== "audio/mpeg" &&
          this.$refs.fileInputTwo.files[0].type !== "audio/mpeg4-generic" &&
          this.$refs.fileInputTwo.files[0].type !== "audio/opus" &&
          this.$refs.fileInputTwo.files[0].type !== "audio/ogg"
        ) {
          this.$toast.error(
            "Sorry, Only Mp4, Mp3, Basic, Mpge, Mpeg4-generic, Opus, and Ogg Audio Format are allowed.",
            "Audio Format",
            this.notificationSystem.options.error
          );

          document.getElementById('audio-file').value = '';
          return;
        }

        this.$toast.success('Valid Audio File Detected.', 'Success', this.notificationSystem.options.success);
        return;
      },
      async uploadVideo(e) {
        if (
          this.$refs.fileInputThree.files[0].type !== "video/3gpp" &&
          this.$refs.fileInputThree.files[0].type !== "video/mp4" &&
          this.$refs.fileInputThree.files[0].type !== "video/x-ms-wmv" &&
          this.$refs.fileInputThree.files[0].type !== "application/x-mpegURL" &&
          this.$refs.fileInputThree.files[0].type !== "video/MP2T"
        ) {
          this.$toast.error(
            "Sorry, Only Mp4, 3gpp, X-ms-wmv, X-mpegURL, and MP2T Video Format are allowed.",
            "Video Format",
            this.notificationSystem.options.error
          );

          document.getElementById('video-file').value = '';
          return;
        }

        this.$toast.success('Valid Video File Detected.', 'Success', this.notificationSystem.options.success);
        return;
      },
      async uploadMediaContent(mediaType) {
        let bannerInterval = '';
        let videoInterval = '';
        let audioInterval = '';
        try {
          if (mediaType == 'picture') {
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
            this.mediaType = 'picture';
            Data.append('image', this.$refs.fileInput.files[0]);

            bannerInterval = setInterval(() => {
              this.$toast.info('Uploading Banner', 'Your Banner Is Being Uploaded. Please Wait.', this.notificationSystem.options.success);
              return;
            }, 3000);

            // make an http request to save the banner and create the group...
            let chatBanner = await axios.post(this.$baseUrl + '/image-upload/chat/chat-photo', Data, {
              headers: {
                Accept: 'application/json',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });

            if (chatBanner.status == 200) {
              this.chatMessage = 'picture';
              this.resourceUrl = chatBanner.data.imageUrl;
              this.mediaType = 'picture';

              this.$modal.hide('camera-modal');
              this.isMedia = false;

              await this.sendMessage();

              this.$toast.success('Image Sent', 'Image Sent Successfully.', this.notificationSystem.options.success);

              clearInterval(bannerInterval);
              return;
            }
          }
          if (mediaType == 'audio') {
            // Upload the group banner image...
            if (
              this.$refs.fileInputTwo.files[0].type !== "audio/mp4" &&
              this.$refs.fileInputTwo.files[0].type !== "audio/mp3" &&
              this.$refs.fileInputTwo.files[0].type !== "audio/basic" &&
              this.$refs.fileInputTwo.files[0].type !== "audio/mpeg" &&
              this.$refs.fileInputTwo.files[0].type !== "audio/mpeg4-generic" &&
              this.$refs.fileInputTwo.files[0].type !== "audio/opus" &&
              this.$refs.fileInputTwo.files[0].type !== "audio/ogg"
            ) {
              this.$toast.error(
                "Sorry, Only Mp4, Mp3, Basic, Mpge, Mpeg4-generic, Opus, and Ogg Audio Format are allowed.",
                "Picture Format",
                this.notificationSystem.options.error
              );
              return false;
            }

            // Form Data...
            const Data = new FormData();
            this.mediaType = 'audio';
            Data.append('audio', this.$refs.fileInputTwo.files[0]);

            audioInterval = setInterval(() => {
              this.$toast.info('Uploading Audio', 'Your Audio File Is Being Uploaded. Please Wait.', this.notificationSystem.options.success);
              return;
            }, 3000);

            // make an http request to save the banner and create the group...
            let audioPost = await axios.post(this.$baseUrl + '/audio-upload/chat/chat-photo', Data, {
              headers: {
                Accept: 'application/json',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });

            if (audioPost.status == 200) {
              this.chatMessage = 'audio';
              this.resourceUrl = audioPost.data.audioUrl;
              this.mediaType = 'audio';

              this.$modal.hide('audio-modal');
              this.isMedia = false;

              await this.sendMessage();

              this.$toast.success('Audio File Sent', 'Audio File Sent Successfully.', this.notificationSystem.options.success);

              clearInterval(audioInterval);
              return;
            }
          }
          if (mediaType == 'video') {
            // Upload the group banner image...
            if (
              this.$refs.fileInputThree.files[0].type !== "video/3gpp" &&
              this.$refs.fileInputThree.files[0].type !== "video/mp4" &&
              this.$refs.fileInputThree.files[0].type !== "video/x-ms-wmv" &&
              this.$refs.fileInputThree.files[0].type !== "application/x-mpegURL" &&
              this.$refs.fileInputThree.files[0].type !== "video/MP2T"
            ) {
              this.$toast.error(
                "Sorry, Only Mp4, 3gpp, X-ms-wmv, X-mpegURL, and MP2T Video Format are allowed.",
                "Video Format",
                this.notificationSystem.options.error
              );
              return false;
            }

            // Form Data...
            const Data = new FormData();
            this.mediaType = 'video';
            Data.append('video', this.$refs.fileInputThree.files[0]);

            videoInterval = setInterval(() => {
              this.$toast.info('Uploading Video', 'Your Video File Is Being Uploaded. Please Wait.', this.notificationSystem.options.success);
              return;
            }, 3000);

            // make an http request to save the banner and create the group...
            let videoPost = await axios.post(this.$baseUrl + '/video-upload/chat/chat-video', Data, {
              headers: {
                Accept: 'application/json',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });

            if (videoPost.status == 200) {
              this.chatMessage = 'Video';
              this.resourceUrl = videoPost.data.videoUrl;
              this.mediaType = 'video';

              this.$modal.hide('video-modal');
              this.isMedia = false;

              await this.sendMessage();

              this.$toast.success('Video File Sent', 'Video File Sent Successfully.', this.notificationSystem.options.success);

              clearInterval(videoBanner);
              return;
            }
          }
        } catch (e) {
          console.log(e);
          if (mediaType == 'picture') {
            clearInterval(bannerInterval);
            this.$toast.error('Picture Failed To Send', 'Operation Failed', this.notificationSystem.options.error);

            this.$modal.hide('camera-modal');
            this.isMedia = false;

            return;
          }
          if (mediaType == 'audio') {
            clearInterval(bannerInterval);
            this.$toast.error('Audio Failed To Send', 'Operation Failed', this.notificationSystem.options.error);

            this.$modal.hide('audio-modal');
            this.isMedia = false;

            return;
          }

          if (mediaType == 'video') {
            clearInterval(videoInterval);
            this.$toast.error('Video Failed To Send', 'Operation Failed', this.notificationSystem.options.error);

            this.$modal.hide('video-modal');
            this.isMedia = false;

            return;
          }
        }
      },
      catchEmojiImage(emojiData) {
        this.selectedEmojis.push(emojiData);
        this.chatMessage = this.selectedEmojis.join('');
      },
      deleteEmoji() {
        if (this.selectedEmojis.length > 0) {
          this.selectedEmojis.pop();
        }
      },
      openMedia() {
        this.isMedia = !this.isMedia;
      },
      async fetchActiveAdverts(type = 'first') {
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

          if (activeAds.status == 200) {
            if (type !== 'first') {
              this.activeAds = activeAds.data.data[0].sort( () => Math.random() - 0.5) ;
              // Shuffle the ads and show the first one in the array...

              // charge the first advert...
              if (this.activeAds.length == 3) {
                await this.chargeAdvert('view', this.activeAds[1]._id);
                await this.chargeAdvert('view', this.activeAds[2]._id);
                return;
              } else if (this.activeAds.length == 2) {
                await this.chargeAdvert('view', this.activeAds[1]._id);
                return;
              }
            }

            this.activeAds = activeAds.data.data[0];
            // charge the first advert...
            if (this.activeAds.length == 3) {
              await this.chargeAdvert('view', this.activeAds[1]._id);
              await this.chargeAdvert('view', this.activeAds[2]._id);
              return;
            } else if (this.activeAds.length == 2) {
              await this.chargeAdvert('view', this.activeAds[1]._id);
              return;
            }
            return;
          }

          this.activeAds = [];
          return;
        } catch (e) {
          this.activeAds = [];
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
      openChat() {
        this.$modal.show('chat-modal');
      },
      async startChat(chat) {
        // Scroll To The Bottom...
        setTimeout(() => {
          var elem = document.querySelector('.chatModal .v--modal-box');
          if (elem) {
            elem.scrollTop = elem.scrollHeight;
          }
        }, 3000);

        if (chat.chat.chatId || chat.chatId) {
          let cId = chat.chat.chatId || chat.chatId;
          await axios
            .get(this.$baseUrl + '/chat-history/' + cId, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'App-X-Token': this.fetchAuthState.token,
                'App-Client': 'web'
              }
            })
            .then((response) => {
              if (response.status == 200) {
                console.log(response);
                this.chatHistory = response.data.data[0];
              }
            })
            .catch((e) => {
              this.chatHistory = [];
            });

            this.chatMode = true;
            if (chat.receiverProfile.stageName == this.fetchUserState.stageName) {
              console.log(chat.receiverProfile.stageName, this.fetchUserState.stageName, 'Block One');
              this.chattingWith = chat.senderProfile.stageName;
            } else {
              console.log(chat.receiverProfile.stageName, chat.senderProfile.stageName, 'Block Two');
              this.chattingWith = chat.receiverProfile.stageName;
            }

            await axios
              .get(this.$baseUrl + '/update-chat/' + this.fetchUserState.stageName + '/' + cId, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache',
                  'App-X-Token': this.fetchAuthState.token,
                  'App-Client': 'web'
                }
              }).then((response) => {
                // match all of teh chats as read depending on the status...
                console.log(response);
              }).catch((e) => {
                console.log(e);
              });
              return;
        }

        this.chatHistory = [];
        this.chatMode = true;
        if (chat.receiverProfile.stageName == this.fetchUserState.stageName) {
          console.log(chat.receiverProfile.stageName, this.fetchUserState.stageName, 'Block One');
          this.chattingWith = chat.senderProfile.stageName;
        } else {
          console.log(chat.receiverProfile.stageName, chat.senderProfile.stageName, 'Block Two');
          this.chattingWith = chat.receiverProfile.stageName;
        }
      },
      closeChat() {
        this.$modal.hide('chat-modal');
        this.chatMode = false;
      },
      async showFriends() {
        this.chatMode = false;
        await this.loadRecentChats();
        await this.loadChatList();
      },
      async isTyping() {
        const Payload = {
          receiver: this.chattingWith,
          sender: this.fetchUserState.stageName,
          senderAvatar: this.fetchUserState.avatar
        }

        socket.emit('chatPress', Payload);
      },
      async sendMessage() {
        let payload = {};
        if (this.chatMessage.trim() == '') {
          return false;
        }

        if (this.resourceUrl == '') {
          payload = {
            messageId: Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10),
            receiverId: this.chattingWith,
            chat: this.chatMessage,
            type: 'default',
            picture: '',
            audio: '',
            video: '',
            recording: ''
          }
        }

        if (this.mediaType == 'picture') {
          payload = {
            messageId: Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10),
            receiverId: this.chattingWith,
            chat: this.chatMessage,
            type: 'media',
            picture: this.resourceUrl,
            audio: '',
            video: '',
            recording: ''
          }
        }

        if (this.mediaType == 'audio') {
          payload = {
            messageId: Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10),
            receiverId: this.chattingWith,
            chat: this.chatMessage,
            type: 'media',
            picture: '',
            audio: this.resourceUrl,
            video: '',
            recording: ''
          }
        }

        if (this.mediaType == 'video') {
          payload = {
            messageId: Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10) + Math.random().toString().substr(2, 10),
            receiverId: this.chattingWith,
            chat: this.chatMessage,
            type: 'media',
            picture: '',
            audio: '',
            video: this.resourceUrl,
            recording: ''
          }
        }

        console.log(payload);

        await axios
          .post(this.$baseUrl + '/chat', payload, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          }).then((response) => {
            console.log(response.data.data[0]);
            if (response.status == 201) {
              let Payload = {
                senderProfile: {
                  stageName: this.fetchUserState.stageName,
                  avatar: this.fetchUserState.avatar
                },
                chat: this.chatMessage,
                messageOwner: this.chattingWith,
                media: response.data.data[0].media,
                _id: Math.random().toString().substr(2, 10),
                timestamp: new Date()
              }

              this.chatHistory.push(Payload);
              socket.emit('chatMessages', Payload);

              // Scroll To The Bottom...
              setTimeout(() => {
                var elem = document.querySelector('.chatModal .v--modal-box');
                if (elem) {
                  elem.scrollTop = elem.scrollHeight;
                }
              }, 3000);
            }
          }).catch(e => {
            console.log(e);
          });

          this.selectedEmojis = [];
          this.chatMessage = '';
      },
      async loadRecentChats() {
        await axios
          .get(this.$baseUrl + '/recent-chats', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          })
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data);
              this.recentChat = response.data.data[0];

              if (this.recentChat.length > 0) {
                this.recentChat = this.recentChat.filter((chat) => {
                  if (chat.receiverProfile.stageName == this.fetchUserState.stageName) {
                    return false;
                  }
                });
              }
            } else {
              this.recentChat = [];
            }
          })
          .catch(e => {
            this.recentChat = [];
          });
      },
      async loadChatList() {
        await axios
          .get(this.$baseUrl + '/chat-list', {
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
              this.chatList = response.data.data;
            } else {
              this.chatList = [];
            }
          })
          .catch(e => {
            this.chatList = [];
          });
      },
      async fetchConnections() {
        await axios
          .get(this.$baseUrl + '/connections-list', {
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
              this.connectionsTotal = response.data.data.length
              this.connections = response.data.data.slice(0, 5)
            } else {
              this.connectionsTotal = 0
              this.connections = []
            }
          })
          .catch(e => {
            this.connectionsTotal = 0
            this.connections = []
          })
      },
      async makeNewConnection(user) {
        await axios
          .get(this.$baseUrl + '/make-connection/' + user.id, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'App-X-Token': this.fetchAuthState.token,
              'App-Client': 'web'
            }
          })
          .then(response => {
            const Status = response.status
            const Data = response.data.data[0]

            if (Status === 200) {
              // remove the user id and flash a notification.
              this.$toast.success(
                'Your request has been sent to ' + user.name,
                'Success',
                this.notificationSystem.options.success
              )
              const Payload = {
                connectionId: Data._id,
                following: user.name,
                follower: this.fetchUserState.stageName
              }

              socket.emit('newConnection', Payload)
              this.connections = this.connections.filter(connection => {
                if (connection.id != user.id) return true
              })

              this.connectionsTotal += -1
              setTimeout(() => {
                this.fetchConnections()
                return true
              }, 5000)

              eventBus.$emit('artiste-connection', user)
            }
          })
          .catch(e => {
            console.log(e)
          })
      },
      handleScroll(event) {
        var right_nav = document.getElementById('righty')
        if (window.scrollY > 766) {
          right_nav.classList.add('sticky')
        } else {
          right_nav.classList.remove('sticky')
        }
      },
      profile() {
        this.$router.push({ path: '/Profile' })
      },
      home() {
        this.$router.push({ path: '/home' })
      }
    },
    data() {
      return {
        isMedia: false,
        mediaType: '',
        resourceUrl: '',
        activeAds: [],
        selectedEmojis: [],
        populars: [
          {
            artiste: 'Davido',
            title: 'Dance with me tonight',
            views: 121005,
            genre: 'Jazz'
          },
          {
            artiste: 'Wizkid',
            title: 'Omo Ope',
            views: 12102,
            genre: 'Reggae'
          },
          {
            artiste: 'Raji Victor',
            title: 'Tesumole',
            views: 12105,
            genre: 'Rythm and Blues'
          },
          {
            artiste: 'Naira Marley',
            title: 'mafo',
            views: 55,
            genre: 'marlian'
          }
        ],
        connections: [],
        connectionsTotal: 0,
        socketMessage: '',
        recentChat: [],
        chatList: [],
        chatHistory: [],
        chatType: 'default', //chat, media...
        chatMode: false,
        chattingWith: '',
        chatMessage: '',
        typing: false,
        typingAvatar: '',
        notificationSystem: {
          options: {
            show: {
              theme: 'dark',
              icon: 'icon-person',
              position: 'topCenter',
              progressBarColor: 'rgb(0, 255, 184)',
              buttons: [
                [
                  '<button>Ok</button>',
                  function(instance, toast) {
                    alert('Hello world!')
                  },
                  true
                ],
                [
                  '<button>Close</button>',
                  function(instance, toast) {
                    instance.hide(
                      {
                        transitionOut: 'fadeOutUp',
                        onClosing: function(instance, toast, closedBy) {
                          console.info('closedBy: ' + closedBy)
                        }
                      },
                      toast,
                      'buttonName'
                    )
                  }
                ]
              ],
              onOpening: function(instance, toast) {
                console.info('callback abriu!')
              },
              onClosing: function(instance, toast, closedBy) {
                console.info('closedBy: ' + closedBy)
              }
            },
            ballon: {
              balloon: true,
              position: 'bottomCenter'
            },
            info: {
              position: 'bottomLeft'
            },
            success: {
              position: 'bottomRight'
            },
            warning: {
              position: 'topLeft'
            },
            error: {
              position: 'topRight'
            },
            question: {
              timeout: 20000,
              close: false,
              overlay: true,
              toastOnce: true,
              id: 'question',
              zindex: 999,
              position: 'center',
              buttons: [
                [
                  '<button><b>YES</b></button>',
                  function(instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
                  },
                  true
                ],
                [
                  '<button>NO</button>',
                  function(instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button')
                  }
                ]
              ],
              onClosing: function(instance, toast, closedBy) {
                console.info('Closing | closedBy: ' + closedBy)
              },
              onClosed: function(instance, toast, closedBy) {
                console.info('Closed | closedBy: ' + closedBy)
              }
            }
          }
        }
      }
    },
    filters: {
      formatNumber(number) {
        const NumberFormat = new Intl.NumberFormat()
        return NumberFormat.format(number)
      },
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
        if (content.split(' ').length > 10) {
          content = content.split(' ').slice(0, 10);

          // Convert the array of words back into a string
          content = content.join(' ') + '....';

          return content;
        }

        return value;
      }
    }
  }

</script>
<style scoped>
  .chat-panel {
    position: fixed;
    top: 93%;
    left: 93%;
  }
  .chat-bubble {
    color: white;
    background: blue;
    border: 1px solid blue;
    padding: 20px;
    border-radius: 50px;
    width: 50px;
    height: 50px;
  }
  .chat-bubble i {
    font-size: 245% !important;
  }

  .chat-notifications {
    color: white;
    background: red;
    border: red;
    font-size: 75%;
    font-weight: 700;
    padding: 5px 5px;
    border-radius: 50px;
    position: absolute;
    left: 60%;
    bottom: 45%;
  }
  .chatModal ul:nth-of-type(1) {
    padding: 5px 5px;
    display: flex;
  }

  .chatModal ul li {
    margin: 0 1px;
  }

  .chatModal .chat-box-settings {
    background: blue;
    padding-top: 5px;
    height: 78px !important;
    position: fixed;
    top: 120px;
    width: 25.0%;
    border-bottom-right-radius: 8px;
    z-index: 999;
  }

  .chatModal ul:nth-of-type(1) li:nth-of-type(3) {
    margin-left: -4%;
    margin-right: 26px;
    color: #89e4dc;
    font-size: 189% !important;
    margin-top: 7%;
  }

  .chatModal ul:nth-of-type(1) li:nth-of-type(4) {
    color: pink;
    margin-top: 5%;
  }

  .chatModal .user-profile-pic {
    border-radius: 50px;
    width: 30px;
    height: 30px;
    margin-top: 25%;
  }
  .chatModal .chat-heading {
    margin-top: 10%;
    padding-left: 20px;
  }
  .chatModal .chat-heading h4 {
    color: grey;
    font-size: 135%;
  }
  .chatModal .recent-chats {
    margin-top: 4%;
  }
  .chatModal .recent-chats ul li ul {
    width: 100%;
  }
  .chatModal .recent-chats ul li ul .friends-image img {
    border-radius: 50px;
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
  .chatModal .recent-chats ul li ul .name-and-message {
    margin-top: 10px;
  }
  .chatModal .recent-chats ul li ul .name-and-message .friends-name {
    font-weight: bold;
    cursor: pointer;
  }
  .chatModal .recent-chats ul li ul .name-and-message .last-msg {
    cursor: pointer;
  }
  .chatModal .recent-chats ul li ul .online-status:nth-of-type(1) {
    display: none;
  }
  .chatModal .recent-chats ul li ul .online-status {
    background: green;
    border-radius: 50px;
    width: 10px;
    height: 10px;
    margin-top: 12px;
    position: absolute;
    left: 89%;
  }
  .chatModal .recent-chats ul li ul .offline-status {
    color: grey;
    font-weight: bolder;
    margin-top: 10px;
    position: absolute;
    width: 100%;
    left: 80%;
  }
  .unread {
    font-weight: bold;
    /* font-style: oblique; */
  }
  body {
    overflow: auto !important;
  }
  .talk-bubble {
  	margin: 40px;
    z-index: 100;
    display: inline-block;
    position: relative;
  	width: 200px;
    left: 20px;
    color: white;
    bottom: 46px;
  	height: auto;
    border-radius: 8px;
  	background-color: #0e98c5;
  }
  .round{
    border-radius: 30px;
  	-webkit-border-radius: 30px;
  	-moz-border-radius: 30px;
  }
  /* Right triangle placed top left flush. */
.tri-right.border.left-top:before {
	content: ' ';
	position: absolute;
	width: 0;
	height: 0;
  left: -40px;
	right: auto;
  top: -8px;
	bottom: auto;
	border: 32px solid;
	border-color: #666 transparent transparent transparent;
}
.tri-right.left-top:after{
	content: ' ';
	position: absolute;
	width: 0;
	height: 0;
  left: -20px;
	right: auto;
  top: 0px;
	bottom: auto;
	border: 22px solid;
	border-color: #0e98c5 transparent transparent transparent;
}
.talktext {
  padding: 4px 15px;
}

.current-chat {
  margin-top: 52%;
}

.current-chat .friends-chat-image {
  border-radius: 50px;
  width: 30px;
  padding-left: 5px;
  height: 25px;
  margin-top: 25%;
}

.sender {
  margin-top: -48%;
  margin-bottom: 22%;
}

.tri-right.border.btm-right:before {
	content: ' ';
	position: absolute;
	width: 0;
	height: 0;
  left: auto;
	right: -8px;
	bottom: -40px;
	border: 20px solid;
	border-color: #0e98c5 #0e98c5 transparent transparent;
}
.tri-right.btm-right:after{
	content: ' ';
	position: absolute;
	width: 0;
	height: 0;
  left: auto;
	right: 0px;
	bottom: -20px;
	border: 12px solid;
	border-color: #0e98c5 #0e98c5 transparent transparent;
}

.messenger {
  margin-top: -41%;
  margin-left: 16%;
  margin-bottom: 28%;
}

.chat-action {
  z-index: 999;
  position: fixed;
  top: 76%;
}

.chat-action .media-icons {
  margin-top: 25%;
  margin-left: 8%;
}

.chat-action .media-icons li {
  margin-left: 0% !important;
  margin-right: 26px;
  color: #89e4dc;
  font-size: 189% !important;
  margin-top: 0% !important;
}

.chat-action ul {
  margin-top: 10%;
  margin-left: -5%;
  width: 94%;
}

.chat-action ul li {
  padding: 0 5px;
}

.chat-action ul .emoji-picker {
  margin-top: 2%;
  margin-right: -2%;
  font-size: 208%;
}

.chat-action ul .additional-features {
  margin-top: 27%;
  color: white !important;
  font-size: 148% !important;
}

.chat-action ul .send-message {
  margin-top: 9% !important;
  margin-left: -5% !important;
  color: #0e98c5 !important;
  font-size: 120% !important;
}

/* .messenger .messenger-photo img {
  border-radius: 50px;
  width: 35px;
  padding-left: 5px;
  height: 30px;
}

.messenger-photo {
  position: absolute;
  top: 55%;
  left: 85%;
} */
/* https://codepen.io/Founts/pen/gmhcl */
</style>

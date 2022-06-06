<template>
  <div>
    <SideBar></SideBar>
    <section class="content">
      <AdminHeader></AdminHeader>
      <div class="wraper container-fluid">
        <div class="container-fluid page-current-title">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
              <div class="page-title">
                <h5 class="title"><b>Send Message</b></h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row forum-tables">
          <div class="col-md-12 col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <form action="" @submit.prevent="sendMessage()">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-xl-6 col-lg-6">
                        <div class="form-group">
                          <v-text-field type="email" v-model="message.email" label="Email" solo></v-text-field>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-xl-6 col-lg-6 col-md-12">
                        <div class="form-group">
                          <v-text-field type="text" v-model="message.title" label="Title" solo></v-text-field>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-xl-12 col-lg-12 col-md-12">
                        <div class="form-group">
                          <v-text-field type="text" v-model="message.type" label="Type" solo list="type"></v-text-field>
                        </div>
                        <datalist id="type">
                          <option value="Subscriber" />
                          <option value="Non-subscriber" />
                        </datalist>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                        <div class="form-group">
                          <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-12 col-xl-12 col-lg-12">
                        <button type="submit" class="btn btn-block btn-md btn-success"><i class="fas fa-paper-plane"></i> Send Email</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Row -->
      </div>
    </section>
    <AdminFooter></AdminFooter>
  </div>
</template>

<script type="text/javascript">
/*eslint-disable*/
  import SideBar from './Aside.vue'
  import AdminHeader from './Header.vue'
  import AdminFooter from './Footer.vue'

  import axios from 'axios'
  import moment from 'moment'
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

  export default {
    components: {
      SideBar,
      AdminHeader,
      AdminFooter
    },
    async mounted() {
      this.$store.dispatch('callLocalAdminStore');
      if (this.fetchAdminAuth.token !== '') {
        if (this.email !== 'default') {
          this.message.email = this.email;
        }
      }
    },
    async created() {
      await this.$store.dispatch("validateAdminToken");
      if (
        this.fetchAdminAuth.isLoggedIn !== true ||
        this.fetchAdminAuth.role != "admin" || this.fetchAdminAuth.token == ''
      ) {
        setTimeout(() => {
          this.$router.push({
            name: 'AdminLogin'
          });
        });
        return;
      }
    },
    methods: {
      async sendMessage() {
        if (this.message.email.trim() == '') {
          this.$toast.error('Sorry, The Email Address Field Is Required.', 'Email Address', this.notificationSystem.options.error);
          return;
        }

        if (this.message.title.trim() == '') {
          this.$toast.error('Sorry, The Message Subject Is Required.', 'Message Subject', this.notificationSystem.options.error);
          return;
        }

        if (this.message.type.trim() == '') {
          this.message.type = 'non-subscriber';
        }

        if (this.editorData.trim() == '') {
          this.$toast.error('Sorry, This Field Cannot Be Empty.', 'Message Content', this.notificationSystem.options.error);
          return;
        }

        this.message.message = this.editorData;
        try {
          let sentMessage = await axios.post(this.$baseUrl  + '/admin/reply/messages', this.message, {
            headers: {
              Accept: 'application/json',
              'App-X-Token': this.fetchAdminAuth.token,
              'App-Client': 'web',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          });

          if (sentMessage.status == 200) {
            this.$toast.success('Your Email Has Been Sent Successfully to ' + this.message.email + '.', 'Message Sent', this.notificationSystem.options.success);
            return;
          }

          if (sentMessage.status !== 200) {
            this.$toast.error('Sorry, An Unexpected Error Occurred And Your Message Could Not Be Sent.', 'Operation Failed', this.notificationSystem.options.error);
            return;
          }
        } catch (e) {
          this.$toast.error('Sorry, An Unexpected Error Occured And Your Request Could Not Be Completed.', 'Operation Failed', this.notificationSystem.options.error);
          console.log(e);
          return;
        }
      }
    },
    computed: {
      fetchAdminAuth() {
        return this.$store.getters.fetchAdminAuth;
      },
      fetchAdminStore() {
        return this.$store.getters.fetchAdminStore;
      }
    },
    filters: {
      diffForHumans(value) {
        return moment
          .utc(value)
          .local()
          .fromNow();
      }
    },
    data() {
      return {
        email: this.$route.params.email,
        message: {
          type: '',
          email: '',
          title: '',
          message: ''
        },
        editor: ClassicEditor,
        editorData: "<p>Write Something...</p>",
        editorConfig: {

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
      }
    }
  }
</script>

<style scoped>

</style>

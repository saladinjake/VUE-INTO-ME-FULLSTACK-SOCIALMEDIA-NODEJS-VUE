import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
/*eslint-disable*/

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Auth: {
            isLoggedIn: false,
            token: '',
            role: ''
        },
        User: {
            firstName: "",
            lastName: "",
            avatar: "",
            cover: "",
            email: "",
            phone: "",
            stageName: "",
            gender: "",
            birthDay: "",
            state: "",
            country: "",
            professions: "",
            skills: "",
            address: "",
            website: "",
            maritalStatus: "",
            education: "",
            contributions: 0,
            connections: 0,
            fanbase: 0,
            groups: 0,
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: '',
        },
        Admin: {
          userName:'',
          roles: []
        },
        AdminAuth: {
          isLoggedIn: false,
          token: '',
          role: 'admin'
        }
    },
    getters: {
        fetchAuthStore(state) {
            return state.Auth;
        },
        fetchUserStore(state) {
            return state.User;
        },
        fetchAdminStore(state) {
          return state.Admin;
        },
        fetchAdminAuth(state) {
          return state.AdminAuth;
        }
    },
    mutations: {
        setAuthState(state, payload) {
            state.Auth.isLoggedIn = payload.isLoggedIn;
            state.Auth.token = payload.token;
            state.Auth.role = payload.role;
        },
        setUserState(state, payload) {
            state.User.firstName = payload.firstName;
            state.User.lastName = payload.lastName;
            state.User.email = payload.email;
            state.User.phone = payload.phone;
            state.User.avatar = payload.avatar || '';
            state.User.cover = payload.cover || '';
            state.User.stageName = payload.stageName;
            state.User.gender = payload.gender;
            state.User.birthDay = payload.birthDay;
            state.User.state = payload.state;
            state.User.country = payload.country;
            state.User.professions = payload.userType || payload.professions;
            state.User.skills = payload.skills;
            state.User.address = payload.address;
            state.User.website = payload.website;
            state.User.maritalStatus = payload.maritalStatus;
            state.User.education = payload.education;
            state.User.contributions = payload.contributions;
            state.User.fanbase = payload.fanbase;
            state.User.groups = payload.groups;
            state.User.facebook = payload.facebook;
            state.User.twitter = payload.twitter;
            state.User.instagram = payload.instagram;
            state.User.youtube = payload.youtube;
        },
        setAdminState(state, payload) {
          state.Admin.userName = payload.userName,
          state.Admin.roles = payload.roles
        },
        setAdminAuthState(state, payload) {
          state.AdminAuth.isLoggedIn = payload.isLoggedIn,
          state.AdminAuth.token = payload.token
        },
        patchUserState(state, payload) {
          state.User[payload.key] = payload.value;
        }
    },
    actions: {
        async localStorePreCheck(context) {
            const LocalAuthStore = localStorage.getItem('xshdyueuiruffhjfhjr');
            const LocalUserStore = localStorage.getItem('cjkfeiufreifriue7u');

            if (LocalAuthStore !== null && LocalAuthStore !== undefined && LocalAuthStore !== '') {
                // Check if the token is still valid...
                let DecodedAuthStore = atob(LocalAuthStore);
                DecodedAuthStore = JSON.parse(DecodedAuthStore);

                let DecodedUserStore = atob(LocalUserStore);
                DecodedUserStore = JSON.parse(DecodedUserStore);
                //http://127.0.0.1:3000/api/check-token-value
                //http://18.221.248.4:3000/api/check-token-value
                await axios.get(`http://127.0.0.1:3000/api/check-token-value`, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'App-X-token': DecodedAuthStore.token,
                        'App-Client': 'web'
                    }
                }).then((response) => {
                    if (response.status !== 200) {
                        context.commit('setAuthState', {
                            isLoggedIn: false,
                            token: '',
                            role: ''
                        });
                        context.commit('setUserState', {
                            firstName: '',
                            lastName: '',
                            avatar: "",
                            cover: "",
                            email: '',
                            phone: "",
                            stageName: '',
                            gender: '',
                            birthDay: '',
                            state: '',
                            country: '',
                            professions: '',
                            skills: '',
                            address: '',
                            website: '',
                            maritalStatus: '',
                            education: '',
                            contributions: '',
                            fanbase: '',
                            groups: '',
                            facebook: '',
                            twitter: '',
                            instagram: '',
                            youtube: ''
                        });
                        return;
                    }

                    context.commit('setAuthState', DecodedAuthStore);
                    context.commit('setUserState', DecodedUserStore);
                    return;
                }).catch((e) => {
                    context.commit('setAuthState', {
                        isLoggedIn: false,
                        token: '',
                        role: ''
                    });
                    context.commit('setUserState', {
                        firstName: '',
                        lastName: '',
                        avatar: "",
                        cover: "",
                        email: '',
                        phone: "",
                        stageName: '',
                        gender: '',
                        birthDay: '',
                        state: '',
                        country: '',
                        professions: '',
                        skills: '',
                        address: '',
                        website: '',
                        maritalStatus: '',
                        education: '',
                        contributions: '',
                        fanbase: '',
                        groups: '',
                        facebook: '',
                        twitter: '',
                        instagram: '',
                        youtube: ''
                    });

                    localStorage.removeItem('cjkfeiufreifriue7u');
                    localStorage.removeItem('xshdyueuiruffhjfhjr');

                });
            }
        },
        synchronizeLocalStore(context, payload) {
            let { auth, user } = payload;
            context.commit('setAuthState', auth);
            context.commit('setUserState', user);

            auth = JSON.stringify(auth);
            user = JSON.stringify(user);

            auth = btoa(auth);
            user = btoa(user);

            localStorage.setItem('cjkfeiufreifriue7u', user);
            localStorage.setItem('xshdyueuiruffhjfhjr', auth);
        },
        updateUserStore(context, payload) {
          context.commit('patchUserState', payload);
          let user = JSON.stringify(this.getters.fetchUserStore);

          user = btoa(user);
          localStorage.setItem('cjkfeiufreifriue7u', user);
        },
        callLocalStore(context) {
          let auth = atob(localStorage.getItem('xshdyueuiruffhjfhjr'));
          let user = atob(localStorage.getItem('cjkfeiufreifriue7u'));

          auth = JSON.parse(auth);
          user = JSON.parse(user);

          context.commit('setAuthState', auth);
          context.commit('setUserState', user);
        },
        resetStoreState(context) {
            context.commit('setAuthState', {
                isLoggedIn: false,
                token: '',
                role: ''
            });
            context.commit('setUserState', {
                firstName: '',
                lastName: '',
                email: '',
                phone: "",
                avatar: '',
                cover: '',
                stageName: '',
                gender: '',
                birthDay: '',
                state: '',
                country: '',
                professions: '',
                skills: '',
                address: '',
                website: '',
                maritalStatus: '',
                education: '',
                contributions: '',
                fanbase: '',
                groups: '',
                facebook: '',
                twitter: '',
                instagram: '',
                youtube: ''
            });

            localStorage.removeItem('cjkfeiufreifriue7u');
            localStorage.removeItem('xshdyueuiruffhjfhjr');
        },
        async synchronizeAdminStore(context, payload) {
          context.commit('setAdminState', {
            userName: payload.userName,
            roles: payload.roles
          });

          // commit to the admin auth store...
          context.commit('setAdminAuthState', {
            isLoggedIn: payload.isLoggedIn,
            token: payload.token
          });

          let adminData = JSON.stringify({
            userName: payload.userName,
            roles: payload.roles
          });
          adminData = btoa(adminData);

          let adminAuth = JSON.stringify({
            isLoggedIn: payload.isLoggedIn,
            token: payload.token
          });
          adminAuth = btoa(adminAuth);

          localStorage.setItem('amhzZGZzZGdqZGZoZy0zNDNpdWhzamZnc2Qtc3JoZmdzZGhqZ2g', adminData);
          localStorage.setItem('c2Fkc2hrZHl3ZS0zMjcyODMyOC1ha2xmc2Rq', adminAuth);
          return;
        },
        resetAdminStore(context) {
          context.commit('setAdminState', {
            userName: '',
            roles: []
          });

          // commit to the admin auth store...
          context.commit('setAdminAuthState', {
            isLoggedIn: false,
            token: ''
          });

          // clear the localstorage...
          localStorage.removeItem('amhzZGZzZGdqZGZoZy0zNDNpdWhzamZnc2Qtc3JoZmdzZGhqZ2g');
          localStorage.removeItem('c2Fkc2hrZHl3ZS0zMjcyODMyOC1ha2xmc2Rq');
          return;
        },
        async validateAdminToken(context) {
          const AuthStore = localStorage.getItem('c2Fkc2hrZHl3ZS0zMjcyODMyOC1ha2xmc2Rq');
          const AdminStore = localStorage.getItem('amhzZGZzZGdqZGZoZy0zNDNpdWhzamZnc2Qtc3JoZmdzZGhqZ2g');

          if (AuthStore !== null && AuthStore !== undefined && AuthStore !== '') {
            // Decode the tokens...........
            let DecodedAuthStore = atob(AuthStore);
            DecodedAuthStore = JSON.parse(DecodedAuthStore);
            // http://18.221.248.4:3000/api/check-token-value
            await axios.get(`http://127.0.0.1:3000/api/validate-admin-value`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'app-x-token': DecodedAuthStore.token,
                'Naijap-Client': 'web'
              }
            }).then((response) => {
              console.log(response);
                if (response.status !== 200) {
                    context.commit('setAdminAuthState', {
                      isLoggedIn: false,
                      token: '',
                    });
                    context.commit('setAdminState', {
                      userName: '',
                      roles: []
                    });
                    return;
                }

                let DecodedAdminStore = atob(AdminStore);
                DecodedAdminStore = JSON.parse(DecodedAdminStore);

                context.commit('setAdminAuthState', DecodedAuthStore);
                context.commit('setAdminState', DecodedAdminStore);
                return;
            }).catch((e) => {
                console.log(e);
                context.commit('setAdminAuthState', {
                  isLoggedIn: false,
                  token: '',
                });
                context.commit('setAdminState', {
                  userName: '',
                  roles: []
                });

                localStorage.removeItem('cjkfeiufreifriue7u');
                localStorage.removeItem('xshdyueuiruffhjfhjr');
                return;
            });
          }
        },
        callLocalAdminStore(context) {
          let auth = atob(localStorage.getItem('c2Fkc2hrZHl3ZS0zMjcyODMyOC1ha2xmc2Rq'));
          let admin = atob(localStorage.getItem('amhzZGZzZGdqZGZoZy0zNDNpdWhzamZnc2Qtc3JoZmdzZGhqZ2g'));

          auth = JSON.parse(auth);
          admin = JSON.parse(admin);

          context.commit('setAdminAuthState', auth);
          context.commit('setAdminState', admin);
        }
    },
    modules: {}
})

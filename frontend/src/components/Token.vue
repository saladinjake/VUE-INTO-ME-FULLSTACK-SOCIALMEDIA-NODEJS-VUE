<template id="">
  <div class=""></div>
</template>

<script type="text/javascript">
import swal from 'sweetalert'

/*eslint-disable*/
  export default {
    props: {
      token: {
        type: String,
        required: false,
        default: 'default'
      }
    },
    async mounted() {
      if (this.token !== '' && this.token !== 'default' && this.token !== 'token') {
        const Token = atob(this.token);
        const Data = JSON.parse(Token);

        const Auth = {
          isLoggedIn: true,
          token: Data.token.web.token.pop().jwt,
          role: Data.userType
        };

        const User = {
          firstName: Data.firstName,
          lastName: Data.lastName,
          email: Data.email,
          state: Data.state,
          country: Data.country,
          professions: Data.userType,
          contributions: 0,
          connections: 0,
          fanbase: 0,
          groups: 0
        };

        this.$store.dispatch('synchronizeLocalStore', { auth: Auth, user: User });
        swal('Success', 'Your Account has been activated successfully.', 'success');
        setTimeout(() => {
          window.location.href = this.$clientUrl;
        }, 3000);
      }
    }
  }
</script>

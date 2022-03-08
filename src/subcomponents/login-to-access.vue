<i18n>
{
  "en": {
     "login_to_access": "Login to access this page!"
  },
  "fr": {
     "login_to_access": "Connectez-vous pour accéder à cette page!"
  }
}
</i18n>
<template>
  <div class="full-error"  >
      <div class="error" v-html="displayedMessage" ></div>
  </div>
</template>
<script>
export default {
  name: 'LoginToAccess',
  props: {
    message: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      displayedMessage: null
    }
  },
  created () {
    if (!this.message) {
      this.displayedMessage = this.$i18n.t('login_to_access')
    } else {
      this.displayedMessage = this.message
    }
  }
}
</script>
<style scoped>
.full-error {
   background: url('./../assets/images/connect-you-background.png') no-repeat center center fixed;
   width:100%;
   min-height:500px;
   height:100vh;
   padding: 30px;
   -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  text-align: center;
}
.error {
  background: rgba(255,255,255,0.8);
  padding: 50px;
  max-width:450px;
  border-radius: 10px;
  margin: 10% auto;
  color:darkred;
  border:none;

}
</style>

<template>
    <v-form ref="form">
        <v-text-field
            v-model="pseudo"
            label="Pseudo">
        </v-text-field>
        <v-btn @click="onFormValidated">Play</v-btn>
    </v-form>
</template>

<script lang="ts">
import io from 'socket.io-client'

export default {
  created () {
    this.socket.on('playerLogged', msg => {
      localStorage.setItem('uid', msg.userId)
      window.location.replace('/play')
    })
    this.socket.on('errorChan', err => {
      console.log(err.errorMsg)
    })
  },
  data () {
    return {
      socket: io(`${import.meta.env.VITE_SOCKET_HOST || window.location.hostname}:${import.meta.env.VITE_SOCKET_PORT || window.location.port}`),
      pseudo: null
    }
  },
  methods: {
    onFormValidated () {
      if (this.$refs.form.validate()) {
        this.socket.emit('connecting', { pseudo: this.pseudo, userId: localStorage.getItem('uid') })
      }
    }

  }
}
</script>

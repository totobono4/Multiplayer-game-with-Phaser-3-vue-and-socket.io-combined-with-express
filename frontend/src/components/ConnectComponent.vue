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
    this.socket.on('playerLogged', function (msg) {
      localStorage.setItem('uid', msg.userId)
      localStorage.setItem('roomId', msg.roomId)
      window.location.replace('/play')
    })
  },
  data () {
    return {
      socket: io(`${import.meta.env.VITE_SOCKET_HOST || window.location.hostname}:${import.meta.env.VITE_SOCKET_PORT}`),
      pseudo: null
    }
  },
  methods: {
    onFormValidated () {
      if (this.$refs.form.validate()) {
        this.socket.emit('connecting', { pseudo: this.pseudo })
      }
    }

  }
}
</script>

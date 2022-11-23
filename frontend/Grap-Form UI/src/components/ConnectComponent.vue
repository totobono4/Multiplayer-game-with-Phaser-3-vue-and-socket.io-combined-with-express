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
    this.socket.on('uid', function (msg) {
      localStorage.setItem('uid', msg)
      window.location.replace('/play')
    })
  },
  data () {
    return {
      socket: io('10.3.2.10:3000'),
      pseudo: null
    }
  },
  methods: {
    onFormValidated () {
      if (this.$refs.form.validate()) {
        this.socket.emit('pseudo', this.pseudo)
      }
    }

  }
}
</script>

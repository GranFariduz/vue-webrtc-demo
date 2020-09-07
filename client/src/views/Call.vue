<template>
  <div class="call">
    <video
      ref="localVideoStream"
      id="localvideo"
      width="480"
      height="320"
      autoplay
    ></video>
    <video
      ref="remoteVideoStream"
      id="remotevideo"
      width="480"
      height="320"
      autoplay
    ></video>
    <button @click="endCall">END CALL</button>
  </div>
</template>

<script>
export default {
  props: ['socketID', 'users'],
  data() {
    return {
      localStream: null,
      remoteStream: null,
      pc: null,
      calleeID: '',
      callerID: ''
    }
  },
  async mounted() {
    this.calleeID = this.$route.query.callee
    this.callerID = this.$route.query.caller

    await this.getUserMedia()
    this.createPeerConnection()
    this.addLocalStream()
    this.onAddStream()

    // when calling
    if (this.calleeID) {
      this.onIceCandidates()

      this.createOffer()
      this.$socket.on('answer', (answer) => {
        this.setRemoteDesc(answer)
      })
    }

    // when receiving
    if (this.callerID) {
      this.$socket.on('offer', (offer) => {
        this.createAnswer(offer)
      })

      this.$socket.on('candidate', (candidate) => {
        this.addIceCandidate(candidate)
      })
    }
  },
  computed: {
    config() {
      return {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      }
    },
    constraints() {
      return {
        audio: true,
        video: { width: 480, height: 320 }
      }
    }
  },
  methods: {
    endCall() {
      this.pc.close()
      this.$router.replace({ name: 'Home' })
    },
    async getUserMedia() {
      if ('mediaDevices' in navigator) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(this.constraints)

          this.$refs.localVideoStream.srcObject = stream
          this.localStream = stream
        } catch (error) {
          console.log(error)
        }
      }
    },
    createPeerConnection() {
      this.pc = new RTCPeerConnection(this.config)
    },
    addLocalStream() {
      this.pc.addStream(this.localStream)
    },
    onIceCandidates() {
      this.pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.$socket.emit('candidate', {
            callee: this.calleeID,
            candidate: event.candidate
          })
        }
      }
    },
    addIceCandidate(candidate) {
      this.pc.addIceCandidate(candidate)
    },
    async createOffer() {
      try {
        const offer = await this.pc.createOffer()
        await this.pc.setLocalDescription(offer)

        this.$socket.emit('offer', {
          callee: this.calleeID,
          offer
        })
      } catch (error) {
        console.log(error)
      }
    },
    async createAnswer(offer) {
      await this.pc.setRemoteDescription(offer)

      const answer = await this.pc.createAnswer(offer)
      await this.pc.setLocalDescription(answer)

      this.$socket.emit('answer', {
        caller: this.callerID,
        answer
      })
    },
    async setRemoteDesc(answer) {
      await this.pc.setRemoteDescription(answer)
    },
    onAddStream() {
      this.pc.onaddstream = (event) => {
        if (event.stream) {
          this.remoteStream = event.stream
          this.$refs.remoteVideoStream.srcObject = this.remoteStream
        }
      }
    }
  }
}
</script>

const onblurMixin = {
  methods: {
    onblurForWX () {
      setTimeout(function () {
        // window.scrollTo(0, 0)
        document.body.scrollTop = 0
      }, 100)
    }
  }
}

export default onblurMixin

App({
  onLaunch() {

  },

  wxp(api, params = {}) {
    return new Promise((resolve, reject) => {
      wx[api]({
        ...params,
        success: resolve,
        fail: reject
      })
    })
  }
})

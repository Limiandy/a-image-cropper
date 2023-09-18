const { wxp } = getApp()

Page({
  data: {
    show: true,
    src: 'https://picsum.photos/id/236/1920/1080'
  },
  onLoad() {},

  async chooseMedia() {
    try {
      const { tempFiles } = await wxp('chooseMedia', {
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      })
      this.setData({ src: tempFiles[0].tempFilePath, show: true })
    } catch (e) {
      console.log(e)
    }
  },
  oncancel() {
    console.log('cancel')
    this.setData({ show: false })
  },

  onsubmit({ detail }) {
    const { url } = detail
    wx.previewImage({
      urls: [url]
    })
  }
})

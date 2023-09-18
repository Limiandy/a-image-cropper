Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    show: {
      type: Boolean,
      value: false
    },

    // 原图 url
    src: {
      type: String,
      value: ''
    }
  },

  methods: {
    _onsubmit(payload) {
      this._draw(payload)
    },

    _draw(payload) {
      const { imageRect, cutterRect } = payload

      this.createSelectorQuery()
        .select('#a-image-cropper__canvas')
        .node(({ node: canvas }) => {
          const dWidth = 750
          const dHeight = 750
          canvas.width = dWidth
          canvas.height = dHeight
          const ctx = canvas.getContext('2d')

          const image = canvas.createImage()
          image.src = this.data.src
          const fs = wx.getFileSystemManager()

          image.onload = () => {
            const rotate = imageRect.rotate === 360 ? 0 : imageRect.rotate

            const coe =
              rotate % 180 === 0 ?
                image.width / imageRect.width :
                image.width / imageRect.height

            let sx = 0
            let sy = 0

            switch (rotate) {
              case 0:
                sx = cutterRect.left - imageRect.left
                sy = cutterRect.top - imageRect.top
                break;
              case 90:
                sx = cutterRect.top - imageRect.top
                sy = imageRect.right - cutterRect.right
                break;
              case 180:
                sx = imageRect.right - cutterRect.right
                sy = imageRect.bottom - cutterRect.bottom
                break;
              case 270:
                sx = imageRect.bottom - cutterRect.bottom
                sy = cutterRect.left - imageRect.left
                break;
            }

            sx *= coe
            sy *= coe
            const sWidth = cutterRect.width * coe
            const sHeight = cutterRect.height * coe
            const rx = dWidth / 2
            const ry = dHeight / 2
            const dx = 0 - rx
            const dy = 0 - ry
            ctx.translate(rx, ry)
            ctx.rotate((Math.PI / 180) * rotate)

            ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

            ctx.setTransform(1, 0, 0, 1, 0, 0); // 恢复坐标原点
            const baseData = canvas.toDataURL('image/png')

            const fileName = 'temp_image_' + Date.now() + '.png'
            const filePath = `${ wx.env.USER_DATA_PATH }/${ fileName }`
            const data = baseData.replace('data:image/png;base64,', '')

            fs.writeFile({
              filePath,
              data,
              encoding: 'base64',
              success: () => {
                this.triggerEvent('onsubmit', { url: filePath })
              },
              fail(res) {
                console.log('error: ', res)
              }
            })
          }
        })
        .exec()
    }
  }
});

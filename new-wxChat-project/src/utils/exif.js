import EXIF from 'exif-js'
const _rotateImg = (imgFile) => {
  return new Promise((resolve, reject) => {
    // console.log(imgFile)
    EXIF.getData(imgFile, function () {
      let exifTags = EXIF.getAllTags(this)
      console.log(exifTags)
      // console.log(exifTags)
      // exifTags.Orientation = 6
      let reader = new FileReader()
      reader.readAsDataURL(imgFile)
      reader.onload = e => {
        let imgData = e.target.result
        // 8 表示 顺时针转了90
        // 3 表示 转了 180
        // 6 表示 逆时针转了90
        if (
          exifTags.Orientation === 8 ||
          exifTags.Orientation === 3 ||
          exifTags.Orientation === 6
        ) {
          // 翻转
          // 获取原始图片大小
          const img = new Image()
          img.src = imgData
          img.onload = function () {
            let cvs = document.createElement('canvas')
            let ctx = cvs.getContext('2d')
            // 如果旋转90
            if (
              exifTags.Orientation === 8 ||
              exifTags.Orientation === 6
            ) {
              cvs.width = img.height
              cvs.height = img.width
            } else {
              cvs.width = img.width
              cvs.height = img.height
            }
            if (exifTags.Orientation === 6) {
              // 原图逆时针转了90, 所以要顺时针旋转90
              ctx.rotate(Math.PI / 180 * 90)
              ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                0,
                -img.height,
                img.width,
                img.height
              )
            }
            if (exifTags.Orientation === 3) {
              // 原图逆时针转了180, 所以顺时针旋转180
              ctx.rotate(Math.PI / 180 * 180)
              ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                -img.width,
                -img.height,
                img.width,
                img.height
              )
            }
            if (exifTags.Orientation === 8) {
              // 原图顺时针旋转了90, 所以要你时针旋转90
              ctx.rotate(Math.PI / 180 * -90)
              ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                -img.width,
                0,
                img.width,
                img.height
              )
            }
            resolve(cvs.toDataURL('image/jpeg'))
          }
        } else {
          resolve(imgData)
        }
      }
    })
  })
}
export default _rotateImg

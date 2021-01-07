// 全局对象，不同function使用传递数据
const imgFile = {}

export function handleInputChange (event) {
  // 获取当前选中的文件
  const file = event.target.files[0]
  const imgMasSize = 1024 * 1024 * 10 // 10MB
  // 检查文件类型
  if (['jpeg', 'jpg'].indexOf(file.type.split("/")[1]) < 0) {
    // 自定义报错方式
    Toast('文件类型仅支持 jpeg/jpg!')
    return
  }
  // 文件大小限制
  if (file.size > imgMasSize) {
    // 文件大小自定义限制
     Toast('文件大小不能超过10MB')
    return
  }
  // 判断是否是ios
  if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    // iOS
    transformFileToFormData(file)
    return
  }
  // 图片压缩之旅
  transformFileToDataUrl(file)
}
// 将File append进 FormData
function transformFileToFormData(file) {
  const formData = new FormData()
  // 自定义formData中的内容
  // type
  formData.append('type', file.type)
  // size
  formData.append('size', file.size || "image/jpeg")
  // name
  formData.append('name', file.name)
  // lastModifiedDate
  formData.append('lastModifiedDate', file.lastModifiedDate)
  // append 文件
  formData.append('file', file)
  // 上传图片
  uploadImg(formData)
}
// 将file转成dataUrl
function transformFileToDataUrl(file) {
  const imgCompassMaxSize = 200 * 1024 // 超过 200k 就压缩
  // 存储文件相关信息
  imgFile.type = file.type || 'image/jpeg' || 'image/jpg' // 部分安卓出现获取不到type的情况
  imgFile.size = file.size
  imgFile.name = file.name
  imgFile.lastModifiedDate = file.lastModifiedDate
  // 封装好的函数
  const reader = new FileReader()
  // file转dataUrl是个异步函数，要将代码写在回调里
  reader.onload = function (e) {
    const result = e.target.result
    if (result.length < imgCompassMaxSize) {
      compress(result, processData, false) // 图片不压缩
    } else {
      compress(result, processData) // 图片压缩
    }
  }
  reader.readAsDataURL(file)
}
// 使用canvas绘制图片并压缩
function compress(dataURL, callback, shouldCompress = true) {
  const img = new window.Image()
  img.src = dataURL
  img.onload = function () {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    let compressedDataUrl
    if (shouldCompress) {
      compressedDataUrl = canvas.toDataURL(imgFile.type, 0.2)
    } else {
      compressedDataUrl = canvas.toDataURL(imgFile.type, 1)
    }
    callback(compressedDataUrl)
  }
}
function processData (dataURL) {
  // 这里使用二进制方式处理dataUrl
  const binaryString = window.atob(dataUrl.split(',')[1])
  const arrayBuffer = new ArrayBuffer(binaryString.length)
  const intArray = new Uint8Array(arrayBuffer)
  const imgFile = this.imgFile

  for (let i = 0, j = binaryString.length; i < j; i++) {
    intArray[i] = binaryString.charCodeAt(i)
  }
  const data = [intArray]
  let blob
  try {
    blob = new Blob(data, {
      type: imgFile.type
    });
  } catch (error) {
    window.BlobBuilder = window.BlobBuilder ||
      window.WebKitBlobBuilder ||
      window.MozBlobBuilder ||
      window.MSBlobBuilder;
    if (error.name === 'TypeError' && window.BlobBuilder) {
      const builder = new BlobBuilder();
      builder.append(arrayBuffer);
      blob = builder.getBlob(imgFile.type);
    } else {
      Toast("版本过低，不支持上传图片")
      throw new Error('版本过低，不支持上传图片')
    }
  }
  // blob 转file
  const fileOfBlob = new File([blob], imgFile.name)
  const formData = new FormData()
  // type
  formData.append('type', imgFile.type)
  // size
  formData.append('size', fileOfBlob.size)
  // name
  formData.append('name', imgFile.name)
  // lastModifiedDate
  formData.append('lastModifiedDate', imgFile.lastModifiedDate)
  // append 文件
  formData.append('file', fileOfBlob)
  uploadImg(formData)
}
// 上传图片
uploadImg (formData) {
   httpPost(checkAIMemberPhoto, formData).then(res => {
     console.log(res)
  // this.form.photo = res.data
  // self.imageUrl = URL.createObjectURL(file)
  // self.$refs.uploadPhoto.clearFiles()
  // self.$emit('photoNumber', res.data)
    Toast.success('图片校验成功')
}

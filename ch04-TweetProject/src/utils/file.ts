import fs from 'fs' //thư viện giúp handle các đường dẫn
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
export const initFolder = () => {
  //nếu không có đường dẫn 'TwitterProject/uploads' thì tạo ra
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      }) //mkdirSync: giúp tạo thư mục
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4, //tăng lên
    keepExtensions: true,
    maxFileSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 4, //tổng dung lượng của tất cả các file
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  //chỉnh lại return của Promise từ File thành File[]
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!files.image) {
        return reject(new Error('Image is empty'))
      }
      resolve(files.image as File[]) //return về mảng các file luôn
    })
  })
}

//làm lấy đuôi mở rộng của file
export const getExtension = (filename: string) => {
  const nameArr = filename.split('.')
  return nameArr[nameArr.length - 1]
}

export const getNameFromFullname = (filename: string) => {
  const nameArr = filename.split('.')
  nameArr.pop() //xóa phần tử cuối cùng, tức là xóa đuôi .png
  return nameArr.join('') //nối lại thành chuỗi
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, //tối đa bao nhiêu byte, 50MB

    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/'))
      //nếu sai valid thì dùng form.emit để gữi lỗi
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
        //as any vì bug này formidable chưa fix, khi nào hết thì bỏ as any
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      //files.video k phải image nha
      if (!files.video) {
        return reject(new Error('video is empty'))
      }

      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)

        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

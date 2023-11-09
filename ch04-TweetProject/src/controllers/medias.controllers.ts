import fs from 'fs'
import mime from 'mime'
import path from 'path'
import HTTP_STATUS from '~/constants/httpStatus'
import mediasService from '~/services/media.services'
import { USERS_MESSAGES } from '~/constants/messages'
import { Request, Response, NextFunction } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESSFULLY,
    result: url
  })
}

export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params
  const range = req.headers.range
  console.log(range)

  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, namefile)
  if (!range) {
    return res.status(400).send('Requires Range header')
  }
  const videoSize = fs.statSync(videoPath).size
  const CHUNK_SIZE = 10 ** 6 //10^6 = 1MB
  const start = Number(range.replace(/\D/g, ''))
  console.log('start: ', start)
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESSFULLY,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params //lấy namefile từ param string
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (error) => {
    console.log(error) //xem lỗi trong như nào, nếu ta bỏ sai tên file / xem xong nhớ cmt lại cho đở rối terminal
    if (error) {
      return res.status((error as any).status).send('File not found')
    }
  }) //trả về file
}

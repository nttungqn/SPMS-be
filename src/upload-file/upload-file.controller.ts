import { UploadFile } from './dto/uploadFile.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { PATH_STORE_IMAGE } from 'config/config';
import { ViewFileDto } from './dto/viewFile.dto';
import { getMimetype } from 'utils/utils';
import { firebaseConfig } from 'constant/constant';

import firebase from 'firebase/app';
import 'xhr2';
import 'firebase/storage';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { UploadFileService } from './upload-file.service';

@ApiTags('upload-file')
@Controller('upload-file')
export class UploadFileController {
  constructor(private uploadFileService: UploadFileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10485760 }
    })
  )
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập Nhật avatar' })
  @ApiOkResponse({ description: 'OK' })
  async uploadFile(
    @UploadedFile() image,
    @Req() req,
    @Res() res,
    @Body() body: UploadFile,
    @GetUser() user: UsersEntity
  ) {
    global.XMLHttpRequest = require('xhr2');
    try {
      if (req?.fileValidationError) {
        return res.status(HttpStatus.PAYLOAD_TOO_LARGE).send({ error: 'ERROR_FILE_TOO_LARGE' });
      }
      let buf = null;
      if (!Buffer.isBuffer(image?.buffer)) {
        buf = Buffer.from(image?.buffer);
      } else {
        buf = image?.buffer;
      }
      const imageTypeBinary = buf.toString('hex', 0, 4);
      //* Check type images upload
      const mimeType = getMimetype(imageTypeBinary);
      if (!mimeType?.match(/\/(jpg|jpeg|png)$/i)) {
        return res.status(HttpStatus.BAD_REQUEST).send({ error: 'Only image files are allowed!' });
      }
      const type = image.mimetype.replace('image/', '');

      const metadata = {
        contentType: 'image/jpeg'
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      const storage = firebase.storage();
      const storageRef = storage.ref();
      await storageRef
        .child(`avatar_${user.id}.${type}`)
        .put(buf, metadata)
        .then(async (snap) => {
          const url = await snap.ref.getDownloadURL();
          await this.uploadFileService.updateAvatarUrl(url, user.id);
          return res.json({ url: `${url}` });
        });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'UPLOAD_FILE_FAILED' });
    }
  }
  @Get('/:fileName')
  async viewFile(@Param() param: ViewFileDto, @Res() res) {
    if (!param?.fileName) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'FILE_NAME_MUST_HAVE_VALUE' });
    }
    return res.sendFile(param?.fileName, { root: `${PATH_STORE_IMAGE}` });
  }
  @Get('/download/:fileName')
  async downloadFile(@Param() param: ViewFileDto, @Res() res) {
    if (!param?.fileName) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'FILE_NAME_MUST_HAVE_VALUE' });
    }
    res.setHeader('Content-disposition', 'attachment; filename=' + param?.fileName);
    res.setHeader('Content-type', 'image/png');
    const fileStream = fs.createReadStream(`${PATH_STORE_IMAGE}/${param?.fileName}`);
    fileStream.on('error', function () {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'ERROR_DOWNLOAD_FILE' });
    });
    fileStream.pipe(res);
  }
}

import { IdExportDto } from './dto/Id.dto';
import { postDataDto } from './dto/postCreatePdf';
import { ExportsDto } from './dto/exports.dto';
import { Controller, Get, Query, Req, UseGuards, HttpStatus, Res, Post, Body, Param } from '@nestjs/common';
import { ExportsService } from './exports.service';
import htmlTemlpate from 'utils/templateCTDT/template';
import htmlTemlpateV2 from 'utils/templateCTDT/templateV2';
import htmlTemlpatePreviewV2 from 'utils/templateCTDT/templatePreview-v2';
import * as pdf from 'html-pdf';
const options = {
  format: 'A4',
  type: 'pdf',
  width: '8.5in',
  height: '11in',
  border: {
    top: '5mm', // default is 0, units: mm, cm, in, px
    right: '5mm',
    bottom: '10mm',
    left: '5mm'
  }
};

@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Get()
  async findAll(@Req() req, @Query() filter: ExportsDto, @Res() res): Promise<any> {
    try {
      const { data, fileName = 'export.pdf' } = await this.exportsService.exportsFilePdfV3(filter);
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      await pdf.create(await htmlTemlpateV2(data), options).toStream(function (err, stream) {
        if (err) return console.log(err);
        stream.pipe(res);
        stream.on('end', () => res.end());
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
  @Get('/data')
  async findAllReturnString(@Req() req, @Query() filter: ExportsDto, @Res() res): Promise<any> {
    try {
      const { data } = await this.exportsService.exportsFilePdfV3(filter);
      const result = await htmlTemlpateV2(data);
      return res.json({ data: result?.replace(/\n/g, '')?.replace(/\"/g, '"') });
    } catch (error) {
      console.log(`error`, error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
  @Post('/data')
  async receiveDataExportPdf(@Req() req, @Body() body: postDataDto, @Res() res): Promise<any> {
    try {
      res.setHeader('Content-disposition', `attachment; filename=${body.fileName || 'noname'}.pdf`);
      await pdf.create(await htmlTemlpateV2(body.data), options).toStream(function (err, stream) {
        if (err) return console.log(err);
        stream.pipe(res);
        stream.on('end', () => res.end());
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
  @Get('json')
  async findAllReturnJson(@Req() req, @Query() filter: ExportsDto, @Res() res): Promise<any> {
    try {
      const { data } = await this.exportsService.exportsFilePdfV3(filter);
      return res.json({ data });
    } catch (error) {
      console.log(`error`, error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Post('json/pdf')
  async receiveJsonExportPdf(@Req() req, @Body() body: postDataDto, @Res() res): Promise<any> {
    try {
      res.setHeader('Content-disposition', `attachment; filename=${body.fileName || 'noname'}.pdf`);
      await pdf.create(await htmlTemlpateV2(JSON.parse(body.data)), options).toStream(function (err, stream) {
        if (err) return console.log(err);
        stream.pipe(res);
        stream.on('end', () => res.end());
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
  @Get('v2')
  async findAllV2(@Req() req, @Query() filter: ExportsDto, @Res() res): Promise<any> {
    try {
      const { data, fileName = 'export.pdf' } = await this.exportsService.exportsFilePdf(filter);
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      await pdf.create(await htmlTemlpate(data), options).toStream(function (err, stream) {
        if (err) return console.log(err);
        stream.pipe(res);
        stream.on('end', () => res.end());
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  @Post('preview/pdf/:id')
  async PreviewPDFV2(@Req() req, @Param() params: IdExportDto, @Body() body: postDataDto, @Res() res): Promise<any> {
    try {
      const data = await this.exportsService.getInfoCTNDT(params.id);
      const extractBody = typeof body.data === 'string' ? JSON.parse(body.data) : body.data;
      const sumTongTinChi =
        extractBody?.cauTrucChuongTrinh?.reduce((total, cur) => {
          return (total = total + Number(cur?.tongTinChi || 0));
        }, 0) || 0;
      res.setHeader('Content-disposition', 'attachment; filename=preview.pdf');
      await pdf
        .create(await htmlTemlpatePreviewV2({ ...data, ...extractBody, tongTinChi: sumTongTinChi }), options)
        .toStream(function (err, stream) {
          if (err) return console.log(err);
          stream.pipe(res);
          stream.on('end', () => res.end());
        });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
}

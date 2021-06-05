import { postDataDto } from './dto/postCreatePdf';
import { ExportsDto } from './dto/exports.dto';
import { Controller, Get, Query, Req, UseGuards, HttpStatus, Res, Post, Body, Param } from '@nestjs/common';
import { ExportSyllabusService } from './export-syllabus.service';
import htmlTemlpate from 'utils/template-syllabus/template-syllabus';
import * as pdf from 'html-pdf';
const options = { format: 'A4', type: 'pdf', border: { top: '0.5in', bottom: '0.5in' } };
const fs = require('fs');
@Controller('export-syllabus')
export class ExportSyllabusController {
  constructor(private readonly exportsService: ExportSyllabusService) {}

  @Get()
  async findAll(@Req() req, @Query() filter: ExportsDto, @Res() res): Promise<any> {
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
  @Get('/data')
  async findAllReturnString(@Req() req, @Query() filter: ExportsDto, @Res() res): Promise<any> {
    try {
      const { data } = await this.exportsService.exportsFilePdf(filter);
      const result = await htmlTemlpate(data);
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
      await pdf.create(await htmlTemlpate(body.data), options).toStream(function (err, stream) {
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
      const { data } = await this.exportsService.exportsFilePdf(filter);
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
      await pdf.create(await htmlTemlpate(JSON.parse(body.data)), options).toStream(function (err, stream) {
        if (err) return console.log(err);
        stream.pipe(res);
        stream.on('end', () => res.end());
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
}

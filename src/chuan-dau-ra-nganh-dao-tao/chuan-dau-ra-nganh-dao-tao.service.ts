import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUANDAURA_NGANHDAOTAO_MESSAGE, LIMIT } from 'constant/constant';
import { Repository } from 'typeorm/repository/Repository';
import { CreateChuanDauRaNganhDaoTaoDto } from './dto/createChuanDauRaNDT.dto';
import { ChuanDauRaNganhDaoTaoEntity } from './entity/chuanDauRaNganhDaoTao.entity';
const LTT = require('list-to-tree');

@Injectable()
export class ChuanDauRaNganhDaoTaoService {
  @InjectRepository(ChuanDauRaNganhDaoTaoEntity)
  private readonly chuanDauRaNDTRepository: Repository<ChuanDauRaNganhDaoTaoEntity>;

  async findAll(filter: any): Promise<any> {
    const { limit = LIMIT, page = 0, ...rest } = filter;
    const skip = Number(page) * Number(limit);
    const query = {
      isDeleted: false,
      ...rest
    };
    const results = await this.chuanDauRaNDTRepository.find({
      relations: ['nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      where: query
    });
    if (!results.length) {
      throw new HttpException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
    }
    const total = await this.chuanDauRaNDTRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findById(id: number): Promise<any> {
    const result = await this.chuanDauRaNDTRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy']
    });
    if (!result) {
      throw new HttpException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async create(newData: CreateChuanDauRaNganhDaoTaoDto): Promise<any> {
    const checkExistData = await this.chuanDauRaNDTRepository.findOne({
      ma: newData?.ma,
      nganhDaoTao: newData?.nganhDaoTao,
      chuanDauRa: newData?.chuanDauRa,
      isDeleted: false
    });
    if (checkExistData) {
      throw new HttpException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_IS_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newChuanDauRaNDT = await this.chuanDauRaNDTRepository.create(newData);
      const saved = await this.chuanDauRaNDTRepository.save(newChuanDauRaNDT);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: CreateChuanDauRaNganhDaoTaoDto): Promise<any> {
    const chuanDauRaNDT = await this.chuanDauRaNDTRepository.findOne({ id, isDeleted: false });
    if (!chuanDauRaNDT) {
      throw new HttpException(
        CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND,
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const updated = await this.chuanDauRaNDTRepository.save({
        ...chuanDauRaNDT,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const chuanDauRaNDT = await this.chuanDauRaNDTRepository.findOne({ id, isDeleted: false });
    if (!chuanDauRaNDT) {
      throw new HttpException(
        CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND,
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const deleted = await this.chuanDauRaNDTRepository.save({
        ...chuanDauRaNDT,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllList(id: number): Promise<any> {
    try {
      const results = await this.chuanDauRaNDTRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.chuanDauRa', 'chuanDauRa')
        .where(`c.nganhDaoTao = ${id}`)
        .getMany();
      const ltt = new LTT(results, {
        key_id: 'id',
        key_parent: 'parent'
      });
      const tree = ltt.GetTree();
      return tree;
    } catch (error) {
      throw new InternalServerErrorException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_EMPTY);
    }
  }
}

// function groupBy(arr, fields) {
//   let field = fields[0]               // one field at a time
//   if (!field) return arr
//   let retArr = Object.values(
//      arr.reduce((obj, current) => {
//         if (!obj[current[field]]) obj[current[field]] = {field: field, value: current[field],rows: []}
//         obj[current[field]].rows.push(current)
//         return obj
//      }, {}))

//   // recurse for each child's rows if there are remaining fields
//   if (fields.length){
//       retArr.forEach(obj => {
//         obj.count = obj.rows.length
//         obj.rows = groupBy(obj.rows, fields.slice(1))
//       })
//   }
//   return retArr
// }

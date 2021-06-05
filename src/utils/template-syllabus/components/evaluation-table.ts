import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { HoatDongDanhGiaEntity } from 'hoat-dong-danh-gia/entity/hoat-dong-danh-gia.entity';
import { LoaiDanhGiaEntity } from 'loai-danh-gia/entity/loai-danh-gia.entity';

const renderRowData = (data: LoaiDanhGiaEntity[]) => {
  const rows = data.map((e) => {
    const hoatDongDanhGia: HoatDongDanhGiaEntity[] = e.hoatDongDanhGia;
    const childRow = hoatDongDanhGia
      .map((child) => {
        const chuanDauRaMonHoc = child.chuanDauRaMonHoc
          .map((cdr: ChuanDauRaMonHocEntity) => {
            return cdr.ma;
          })
          .join(', ');
        return `
            <tr class="c9">
                <td class="c11" colspan="1" rowspan="1">
                    <p class="c18">
                        <span class="c0">${child.ma}</span>
                    </p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c18">
                        <span class="c0">${child.ten}</span>
                    </p>
                </td>
                <td class="c31" colspan="1" rowspan="1">
                    <p class="c10">
                        <span class="c0">
                            ${child.moTa}
                        </span>
                    </p>
                </td>
                <td class="c47" colspan="1" rowspan="1">
                    <p class="c10">
                        <span class="c0">${chuanDauRaMonHoc}</span>
                    </p>
                </td>
                <td class="c16" colspan="1" rowspan="1">
                    <p class="c18">
                        <span class="c0">${child.tyLe * 100}%</span>
                    </p>
                </td>
            </tr>
        `;
      })
      .join('\n');
    return `
        <tr class="c9">
            <td class="c11" colspan="1" rowspan="1">
                <p class="c24">
                    <span class="c4">${e.ma}</span>
                </p>
            </td>
            <td class="c2" colspan="1" rowspan="1">
                <p class="c10">
                    <span class="c4">${e.ten}</span>
                </p>
            </td>
            <td class="c31" colspan="1" rowspan="1">
                <p class="c10 c12">
                    <span class="c0"></span>
                </p>
            </td>
            <td class="c47" colspan="1" rowspan="1">
                <p class="c10 c12">
                    <span class="c0"></span>
                </p>
            </td>
            <td class="c16" colspan="1" rowspan="1">
                <p class="c10">
                    <span class="c4">${e.tyLe * 100}%</span>
                </p>
            </td>
        </tr>
        ${childRow}
    `;
  });
  return rows.join('\n');
};

export default (data) => `
<table class="c20">
    <tbody>
        <tr class="c9">
            <td class="c51" colspan="1" rowspan="1">
                <p class="c23">
                    <span class="c4 c5">Mã</span>
                </p>
            </td>
            <td class="c61" colspan="1" rowspan="1">
                <p class="c23">
                    <span class="c4 c5">Tên</span>
                </p>
            </td>
            <td class="c72" colspan="1" rowspan="1">
                <p class="c23">
                    <span class="c4 c5">Mô tả (gợi ý)</span>
                </p>
            </td>
            <td class="c43" colspan="1" rowspan="1">
                <p class="c23">
                    <span class="c4 c5">Các chuẩn đầu ra được đánh giá</span>
                </p>
            </td>
            <td class="c66" colspan="1" rowspan="1">
                <p class="c23">
                    <span class="c4 c5">Tỉ lệ (%)</span>
                </p>
            </td>
        </tr>
        ${renderRowData(data)}
    </tbody>
</table>
`;

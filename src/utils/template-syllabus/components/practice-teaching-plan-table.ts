import { ChuDeEntity } from 'chu-de/entity/chu-de.entity';
import { HoatDongDanhGiaEntity } from 'hoat-dong-danh-gia/entity/hoat-dong-danh-gia.entity';
import { HoatDongDayHocEntity } from 'hoat-dong-day-hoc/entity/hoat-dong-day-hoc.entity';

const renderRowData = (data: ChuDeEntity[]) => {
  const rows = data.map((e, index) => {
    const chuanDauRaMonHoc = e?.chuanDauRaMonHoc
      .map((child) => {
        return child.ma;
      })
      .join(', ');
    const hoatDongDayHoc = e.hoatDongDayHoc
      .map((child: HoatDongDayHocEntity) => {
        return child.ten;
      })
      .join('</br>');
    const hoatDongDanhGia = e.hoatDongDanhGia
      .map((child: HoatDongDanhGiaEntity) => {
        return child.ma;
      })
      .join('</br>');
    return `
        <tr class="c9">
            <td class="c37" colspan="1" rowspan="1">
                <p class="c23"><span class="c0">${e.tuan}</span></p>
            </td>
            <td class="c52" colspan="1" rowspan="1">
                <p class="c10"><span class="c0">${e.ten}</span></p>
            </td>
            <td class="c45" colspan="1" rowspan="1">
                <p class="c10 c12"><span class="c0">${chuanDauRaMonHoc}</span></p>
            </td>
            <td class="c36" colspan="1" rowspan="1">
                <p class="c10"><span class="c0">${hoatDongDayHoc}</span></p>
            </td>
            <td class="c33" colspan="1" rowspan="1">
                <p class="c10 c12"><span class="c0">${hoatDongDanhGia}</span></p>
            </td>
        </tr>
    `;
  });
  return rows.join('\n');
};

export default (data) => `
<table class="c20">
    <tbody>
        <tr class="c68">
            <td class="c37 c29" colspan="1" rowspan="1">
                <p class="c10"><span class="c4 c5">Tuần</span></p>
            </td>
            <td class="c52 c29" colspan="1" rowspan="1">
                <p class="c23"><span class="c4 c5">Chủ đề</span></p>
            </td>
            <td class="c45 c29" colspan="1" rowspan="1">
                <p class="c23"><span class="c4 c5">Chuẩn đầu ra</span></p>
            </td>
            <td class="c36 c29" colspan="1" rowspan="1">
                <p class="c23"><span class="c4 c5">Hoạt động dạy/</span></p>
                <p class="c23"><span class="c4 c5">Hoạt động học (gợi ý)</span>
                </p>
            </td>
            <td class="c33 c29" colspan="1" rowspan="1">
                <p class="c23"><span class="c4 c5">Hoạt động<br>đánh giá</span>
                </p>
            </td>
        </tr>
        ${renderRowData(data)}
    </tbody>
</table>
`;

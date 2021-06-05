import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';

const renderRowData = (data: MucTieuMonHocEntity[]) => {
  const rows = data.map((e) => {
    const chuanDauRaCDIO = e?.chuanDauRaCDIO
      .map((child) => {
        return child.ma;
      })
      .join(', ');
    return `
        <tr class="c9">
                <td class="c54" colspan="1" rowspan="1">
                    <p class="c23"><span class="c0">${e?.ma}</span></p>
                </td>
                <td class="c19" colspan="1" rowspan="1">
                    <p class="c35"><span class="c0">${e?.moTa}</span>
                    </p>
                </td>
                <td class="c13" colspan="1" rowspan="1">
                    <p class="c10"><span class="c0">${chuanDauRaCDIO}</span></p>
                </td>
            </tr>
        `;
  });
  return rows.join('\n');
};

export default (data) => `
<table class="c20">
        <tbody>
            <tr class="c9">
                <td class="c29 c70" colspan="1" rowspan="1">
                    <p class="c23"><span class="c4 c5">Mục tiêu</span></p>
                </td>
                <td class="c29 c46" colspan="1" rowspan="1">
                    <p class="c23"><span class="c4 c5">Mô tả (mức tổng quát)</span></p>
                </td>
                <td class="c29 c53" colspan="1" rowspan="1">
                    <p class="c23"><span class="c4 c5">CĐR CDIO<br>của chương trình</span>
                    </p>
                </td>
            </tr>
            
            ${renderRowData(data)}
            
        </tbody>
    </table>
`;

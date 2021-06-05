import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';

const renderRowData = (data: ChuanDauRaMonHocEntity[]) => {
  const rows = data.map((e) => {
    return `
        <tr class="c9">
            <td class="c7" colspan="1" rowspan="1">
                <p class="c23"><span class="c0">${e?.ma}</span></p>
            </td>
            <td class="c21" colspan="1" rowspan="1">
                <p class="c10"><span class="c0">${e.mota}</span></p>
            </td>
            <td class="c42" colspan="1" rowspan="1">
                <p class="c23"><span class="c0">${e.mucDo}</span></p>
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
            <td class="c7 c29" colspan="1" rowspan="1">
                <p class="c10"><span class="c4 c5">Chuẩn đầu ra</span></p>
            </td>
            <td class="c21 c29" colspan="1" rowspan="1">
                <p class="c23"><span class="c4 c5">Mô tả (Mức chi tiết - hành động)</span></p>
            </td>
            <td class="c42 c29" colspan="1" rowspan="1">
                <p class="c23"><span class="c4 c5">Mức độ (I/T/U)</span></p>
            </td>
        </tr>
        ${renderRowData(data)}
    </tbody>
</table>
`;

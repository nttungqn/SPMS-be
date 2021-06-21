import { get } from 'lodash';
export default ({ subTitles = [], titles = [], data = [], fields = [], tongTC = 0 }) => {
  if (!data?.length) {
    return '';
  }
  return `
     <table style="position: relative;left: -80px;">
          ${generateHeader(titles, subTitles)}
          <tbody>
               ${data
                 .map((item, index) => {
                   tongTC += Number(item?.soTCBB);
                   let str = '';
                   // [if(item?.loaiNhom === 'TC')] or if(item?.loaiNhom === 'BB')
                   str += `
                   <tr>
                     <td colspan='1000'>Hoàn thành ${item?.soTCBB} tín chỉ trong các học phần sau</td>
                   </tr>
                 `;
                   const bodyRows = generateRows(item?.chiTietGomNhom, fields, item?.loaiNhom);
                   return `${str}${bodyRows}`;
                 })
                 .join('\n')}
                 <tr>
                      <td colspan='3'><p style="text-align:center"><b><span>Tổng Cộng</span></b></p></td> <td><p><b><span>${tongTC}</span></b></p></td>
                      <td></td> <td></td> <td></td> <td></td> <td></td>
                    </tr>
          </tbody>
     </table>
`;
};
export const generateHeader = (titles = [], subTitles = []) => {
  return `
  <thead page-break-after:always;>
        <tr>
            <th style="border-bottom: none;">#</th>
            ${titles
              .map(
                (item) =>
                  `<th ${item?.colspan ? `colspan='${item?.colspan}'` : ''}  ${
                    item?.rowspan ? `rowspan='${item?.rowspan}'` : ''
                  } style="vertical-align:middle;border-bottom: none;">${item?.title}</th>`
              )
              .join('\n')}
        </tr>
        ${
          subTitles?.length
            ? `<tr>${subTitles
                .map((item) => `<th scope="col" ${item ? '' : 'style="border-top: none;"'}>${item}</th>`)
                .join('')}</tr>`
            : ''
        }
  </thead>
  `;
};
export const generateRows = (data = [], fields = [], groupType = '') => {
  return `
  ${data
    .map((item, index) => {
      const newItem = { ...item, groupType };
      return `<tr>
       <td>${index + 1}</td>
       ${fields.map((field) => `<td>${get(newItem, field, '') || ''}</td>`).join('')}
       </tr>`;
    })
    .join('\n')}
  `;
};

export default ({ subTitles = [], titles = [], data = [], tongSoTinChi = 0, fields = [] }) => `
     <table>
          <thead>
               <tr>
                    <th style="border-bottom: none;">#</th>
                    ${titles
                      .map(
                        (item) =>
                          `<th ${item?.colspan ? `colspan='${item?.colspan}'` : ''}  ${
                            item?.rowspan ? `rowspan='${item?.rowspan}'` : ''
                          } style="vertical-align:middle;">${item?.title}</th>`
                      )
                      .join('\n')}
                    <th style="border-bottom: none;">Tống số tín chỉ khi tốt nghiệp(1+2+3+4)</th>
               </tr>
               ${
                 subTitles?.length
                   ? `<tr>${subTitles
                       .map((item) => `<th scope="col" ${item ? '' : 'style="border: none;"'}>${item}</th>`)
                       .join('')}</tr>`
                   : ''
               }
          </thead>
          <tbody>
               ${data
                 .map(
                   (item, index) =>
                     `<tr>
                    <td>${index + 1}</td>
                    ${fields.map((field) => `<td>${item[field]}</td>`).join('')}
                    ${
                      index === 0
                        ? `<td rowspan="${data.length}" style="vertical-align: middle;">${tongSoTinChi}</td>`
                        : ''
                    }</tr>`
                 )
                 .join('\n')}
          </tbody>
     </table>
`;

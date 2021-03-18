export default ({ subTitles = [], titles = [], data = [], tongSoTinChi = 0, fields = [] }) => `
      <style>
        table, td, th {
          border: 1px solid black;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th{
          text-align: center;
        }
        td, th {
          padding: 10px;
        }
      </style>
     <table>
          <thead>
               <tr>
                    <td rowspan='2'>#</td>
                    ${titles
                      .map(
                        (item) =>
                          `<th colspan='${item?.colspan}' rowspan='${item?.rowspan}' style="vertical-align:middle;">${item?.title}</th>`
                      )
                      .join('\n')}
                    <td rowspan='2'>Tống số tín chỉ khi tốt nghiệp(1+2+3+4)</td>
               </tr>
               ${
                 subTitles?.length ? `<tr>${subTitles.map((item) => `<th scope="col">${item}</th>`).join('')}</tr>` : ''
               }
          </thead>
          <tbody>
               ${data
                 .map(
                   (item, index) =>
                     `<tr>
                    <td scope="row">${index + 1}</td>
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

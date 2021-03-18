export function getStringHtml(data = [], field = '') {
  return data
    .map((item) => {
      return `
            <ul>
                ${`<li>${item?.ma} ${item?.chuanDauRa?.ten} ${
                  item?.children ? getStringHtml(item?.children, field) : ''
                }</li>`}
            </ul>
        `;
    })
    .join('');
}

import * as pdf from 'html-pdf';
import htmlTemlpate from './template';
const options = { format: 'Letter', width: '8.5in', height: '11in', border: '5mm' };

export async function generateTemplate(data = {}) {
  await pdf.create(htmlTemlpate(data), options).toFile('src/utils/templateCTDT/template.pdf', function (err, res) {
    if (err) return console.log(err);
    console.log('generated'); // { filename: '/app/businesscard.pdf' }
  });
}

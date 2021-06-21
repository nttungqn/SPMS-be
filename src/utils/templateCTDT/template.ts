import { get } from 'lodash';
const titles = {
  CHUONG_TRINH_DAO_TAO: 'chương trình đào tạo',
  TEN_CHUONG_TRINH: 'tên chương trình',
  TRINH_DO_DAI_HOC: 'trình đồ đại học',
  NGANH_DAO_TAO: 'ngành đào tạo',
  MA_NGANH: 'mã ngành',
  LOAI_HINH_DAO_TAO: 'loại hình đào tạo',
  KHOA_TUYEN: 'khóa tuyển',
  MUC_TIEU_DAO_TAO: 'mục tiêu đào tạo',
  MUC_TIEU_CHUNG: 'mục tiêu chung',
  MUC_TIEU_CU_THE: 'mục tiêu cụ thể',
  CO_HOI_NGHE_NGHIEP: 'cơ hội nghề nghiệp',
  THOI_GIAN_DAO_TAO: 'thời gian đào tạo',
  KHOI_LUONG_KIEN_THUC: 'khối lượng kiến thức toàn khóa',
  DOI_TUONG_TUYEN_SINH: 'đối tượng tuyển sinh',
  QUY_TRINH_DAO_TAO_DIEU_KIEN_TOT_NGHIEP: 'quy trình đào tạo, điều kiến tốt nghiệp',
  QUY_TRINH_DAO_TAO: 'quy trình đào tạo',
  DIEU_KIEN_TOT_NGHIEP: 'điều kiện tốt nghiệp',
  CAU_TRUC_CHUONG_TRINH: 'cấu trúc chương trình',
  NOI_DUNG_CHUONG_TRINH: 'nội dung chương trình',
  KE_HOACH_GIANG_DAY: 'kế hoạch giảng dạy'
};
import renderTables from 'utils/templateCTDT/components/tables';
import { getStringHtml } from './components/list';
import renderTableSubject, { generateHeader } from 'utils/templateCTDT/components/tableSubject';
import header from './components/header';
import footerSiganature from './components/footer-siganature';

export default async (data) => `
<!DOCTYPE html>
<html>
     <head>
     
     <style>
     ${
       process.env.TEMPLATE_PDF
         ? `html {
                  zoom: 0.55;
             }`
         : ''
     }
     .muctieucuthe ul,
     .muctieucuthe ol,
     .muctieucuthe li {
         list-style: none;
     }

     .muctieucuthe ol {
         list-style-type: none;
     }

     .muctieucuthe ol>li {
         display: table;
         margin-bottom: 0.6em;
         width: 90%;
         margin-top: 10px;
     }

     .muctieucuthe ol>li:before {
         padding-right: 0.3em;
         font-weight: 700;
     }
 </style>

 <style>
     .row {
         margin: 5px
     }

     .thongtinchung {
         margin-top: 30px;
     }

     .titleChuongTrinhDaoTao {
         text-align: center;
     }

     .titleChuongTrinhDaoTao h2 {
         font-weight: 700;
         font-size: 26px;
         text-transform: uppercase;
     }

     .table-info-top {
         display: -webkit-box;
         display: flex;
     }

     .table-title,
     .table-value {
         text-transform: capitalize;
     }

     .table-value {
         margin-left: 20px;
     }

     .block-info {
         display: flex;
         display: -webkit-flex;
     }

     .part-title {
         text-transform: uppercase;
         font-size: 15px;
         font-weight: 700;
     }

     .row.muctieucuthe>ul {
         padding: 0;
     }
 </style>

 <style>
     .tables_container table,
     .tables_container td,
     .tables_container th {
         border: 1px solid black;
     }

     .tables_container table {
         width: 100%;
         border-collapse: collapse;
     }

     .tables_container th {
         text-align: center;
     }

     .tables_container td,
     .tables_container th {
         padding: 10px;
     }
 </style>

 <style>
     .tables_container table {
         page-break-after: always;
     }

     .tables_container tr, .tables_container th, .tables_container td {
         page-break-inside: avoid;
     }
     

     .tables_container table tr {
         break-inside: avoid !important;
     }

     .tables_container thead {
         display: table-header-group !important;
     }

     .tables_container tbody {
         display: table-row-group !important;
     }

     .tables_container tfoot {
         display: table-header-group !important;
     }
 </style>
  
   <style>
     .row-header {
         display: flex;
         display: -webkit-flex;
         flex-direction: row;
         -webkit-justify-content: space-around;
         justify-content: space-around;
     }

     .headers {
         text-align: center;
     }

     .line {
         border: 1px solid black;
         width: 70%;
         margin: 0 auto;
     }
 </style>

 <style>
     .note {
         text-align: center;
         margin: 20px 0;
     }
     .note p{
       font-style: italic;
     }
 </style>

     </head>
     <body>
          <div class="wrapper">
               <div class="container-fluid" style="font-family: sans-serif">

                    ${header()}

                    <div class="row top thongtinchung">
                         <div class="container">
                              <div class="row titleChuongTrinhDaoTao">
                                   <h2>${titles.CHUONG_TRINH_DAO_TAO}</h2>
                                   <h2>ngành ${data?.tenNganhDaoTao}</h2>
                              </div>
                              <div class="row">
                                   <div class="table-info-top" style="width: 100%;">
                                        <div class="table-title">
                                             <p>${titles.TEN_CHUONG_TRINH}:</p>
                                             <p>${titles.TRINH_DO_DAI_HOC}:</p>
                                             <p>${titles.NGANH_DAO_TAO}:</p>
                                             <p>${titles.MA_NGANH}:</p>
                                             <p>${titles.LOAI_HINH_DAO_TAO}:</p>
                                             <p>${titles.KHOA_TUYEN}:</p>
                                        </div>
                                        <div class="table-value">
                                             <p class="block-value">${data?.tenNganhDaoTao}</p>
                                             <p class="block-value">${data?.trinhDo}</p>
                                             <p class="block-value">${data?.tenNganhDaoTao}</p>
                                             <p class="block-value">${data?.maNganhDaoTao}</p>
                                             <p class="block-value">${data?.loaiHinh}</p>
                                             <p class="block-value">${data?.khoa}</p>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
                    
                    <div class="row">
                         <div class="container">
                              <div class="row">
                                   <ol>
                                        <li class="li-menu-lv1">
                                             <p class="part-title">${titles.MUC_TIEU_DAO_TAO}</p>
                                             
                                             <ol>
                                                  <li class="li-menu-lv2">
                                                       <p class="part-title">${titles.MUC_TIEU_CHUNG}</p>
                                                       <div class="row muctieuchung">
                                                            <p>${data?.mucTieuChung}</p>
                                                       </div>
                                                  </li>
                                                  <li class="li-menu-lv2">
                                                       <p class="part-title">${titles.MUC_TIEU_CU_THE}</p>
                                                       <div class="row muctieucuthe">
                                                            ${getStringHtml(data?.chuanDauRaNganhDaoTao, 'ma')}
                                                       </div>
                                                  </li>
                                                  <li class="li-menu-lv2">
                                                       <p class="part-title">${titles.CO_HOI_NGHE_NGHIEP}</p>
                                                       <div class="row cohoinghenghiep">
                                                            <p>${data?.coHoiNgheNghiep}</p>
                                                       </div>
                                                  </li>
                                             </ol>
                                        </li>

                                        <li class="li-menu-lv1"><p class="part-title">${
                                          titles.THOI_GIAN_DAO_TAO
                                        }: 4 năm</p></li>
                                        <li class="li-menu-lv1"><p class="part-title">${titles.KHOI_LUONG_KIEN_THUC}: ${
  data?.tongTinChi
}</p></li>
                                        <li class="li-menu-lv1"><p class="part-title">${titles.DOI_TUONG_TUYEN_SINH}: ${
  data?.doiTuong
}</p></li>
                                        <li class="li-menu-lv1">
                                             <p class="part-title">${titles.QUY_TRINH_DAO_TAO_DIEU_KIEN_TOT_NGHIEP}</p>
                                        
                                             <ol>
                                                  <li class="li-menu-lv2">
                                                       <p class="part-title">${titles.QUY_TRINH_DAO_TAO}</p>
                                                       <div class="row quytrinhdaotao">
                                                            <p style="padding: 0;">${data?.quiTrinhDaoTao}</p>
                                                       </div>
                                                  </li>
                                                  <li class="li-menu-lv2">
                                                       <p class="part-title">${titles.DIEU_KIEN_TOT_NGHIEP}</p>
                                                       <div class="row dieukientotnghiep">
                                                       <p style="padding: 0;">${data?.dieuKienTotNghiep}</p>
                                                       </div>
                                                  </li>
                                             </ol>
                                        </li>
                                        <li class="li-menu-lv1 tables_container">
                                             <p class="part-title">${titles.CAU_TRUC_CHUONG_TRINH}</p>
                                             
                                             ${renderTables({
                                               titles: [
                                                 { title: 'Khối Kiến Thức', rowspan: 2 },
                                                 { title: 'Số Tín Chỉ', colspan: 3 },
                                                 { title: 'Ghi Chú', rowspan: 2 }
                                               ],
                                               fields: [
                                                 'ten',
                                                 'tinChiBatBuoc',
                                                 'tinChiTuChon',
                                                 'tinChiTuChonTuDo',
                                                 'ghiChu'
                                               ],
                                               data: data?.khoiKienThuc,
                                               tongSoTinChi: data?.tongTinChi,
                                               subTitles: ['', 'Bắt Buộc', 'Tự Chọn', 'Tự Chọn Tự Do', '']
                                             })}
                                        
                                             </li>
                                        <li class="li-menu-lv1 tables_container">
                                             <p class="part-title">${titles.NOI_DUNG_CHUONG_TRINH}</p>
                                        
                                             <ol>
                                                  ${data?.cauTrucChuongTrinh
                                                    ?.map((item) => {
                                                      return `
                                                                 <li class="li-menu-lv2">
                                                                      <p class="part-title">${item?.ten}</p>
                                                                      <p style="font-style: italic">Ghi chú: ${
                                                                        item?.ghiChu
                                                                      }</p>

                                                                      <ol>
                                                                           ${item?.loaiKhoiKienThuc
                                                                             ?.map((subItem) => {
                                                                               return `
                                                                                <li><p class="part-title">${
                                                                                  subItem?.ten
                                                                                }</p></li>
                                                                                

                                                                                ${renderTableSubject({
                                                                                  titles: [
                                                                                    {
                                                                                      title: 'Mã Học Phần'
                                                                                    },
                                                                                    {
                                                                                      title: 'Tên Học Phần'
                                                                                    },
                                                                                    {
                                                                                      title: 'Số TC'
                                                                                    },
                                                                                    {
                                                                                      title: 'Số Tiết',
                                                                                      colspan: 3
                                                                                    },
                                                                                    {
                                                                                      title: 'Loại HP'
                                                                                    },
                                                                                    { title: 'Ghi Chú' }
                                                                                  ],
                                                                                  fields: [
                                                                                    'idMH.ma',
                                                                                    'idMH.tenTiengViet',
                                                                                    'idMH.soTinChi',
                                                                                    'idMH.soTietLyThuyet',
                                                                                    'idMH.soTietThucHanh',
                                                                                    'idMH.soTietTuHoc',
                                                                                    'groupType',
                                                                                    'ghiChu'
                                                                                  ],
                                                                                  data: subItem?.gomNhom,
                                                                                  subTitles: [
                                                                                    '',
                                                                                    '',
                                                                                    '',
                                                                                    '',
                                                                                    'LT',
                                                                                    'TH',
                                                                                    'BT',
                                                                                    '',
                                                                                    ''
                                                                                  ],
                                                                                  tongTC: 0
                                                                                })}
                                                                                `;
                                                                             })
                                                                             .join('')}
                                                                      </ol>
                                                                 </li>
                                                            `;
                                                    })
                                                    .join('')}
                                             </ol>
                                        </li>
                                        <li class="li-menu-lv1 tables_container">
                                        <p class="part-title">${titles.KE_HOACH_GIANG_DAY}</p>
                                        <table>
                                             ${generateHeader(
                                               [
                                                 {
                                                   title: 'Mã Học Phần'
                                                 },
                                                 {
                                                   title: 'Tên Học Phần'
                                                 },
                                                 {
                                                   title: 'Số TC'
                                                 },
                                                 {
                                                   title: 'Số Tiết',
                                                   colspan: 3
                                                 },
                                                 {
                                                   title: 'Loại HP'
                                                 },
                                                 { title: 'Ghi Chú' }
                                               ],
                                               ['', '', '', '', 'LT', 'TH', 'BT', '', '']
                                             )}
                                        ${data?.keHoachGiangDay
                                          ?.map((item) => {
                                            return `
                                                  <tr>
                                                       <td colspan='1000' style="width:489.8pt;border:solid black 1.0pt;
                                                       border-top:none;background:#E2EFD9;padding:0in 5.75pt 0in 5.75pt;height:26.95pt"><p style="text-align:center"><b><span style="font-size:11.0pt;color:black">Học Kỳ ${
                                                         item?.tenHocKy
                                                       }</span></b></p></td>
                                                  </tr>
                                                  ${item?.chiTietKHGD
                                                    ?.map((subItem, index) => {
                                                      return `
                                                       <tr>
                                                            <td>${index + 1}</td>
                                                            ${[
                                                              'idCTGN.idMH.ma',
                                                              'idCTGN.idMH.tenTiengViet',
                                                              'idCTGN.idMH.soTinChi',
                                                              'idCTGN.idMH.soTietLyThuyet',
                                                              'idCTGN.idMH.soTietThucHanh',
                                                              'idCTGN.idMH.soTietTuHoc',
                                                              'idCTGN.idGN.loaiNhom',
                                                              'idCTGN.idGN.ghiChu'
                                                            ]
                                                              .map((field) => `<td>${get(subItem, field, '')}</td>`)
                                                              .join('')}
                                                       </tr>
                                                       `;
                                                    })
                                                    .join('')}
                                             `;
                                          })
                                          .join('')}
                                        </table>
                                        </li>
                                   </ol>
                              </div>
                         </div>
                    </div>
                    
                    ${footerSiganature()}

               </div>
          </div>
     </body>
</html>
`;

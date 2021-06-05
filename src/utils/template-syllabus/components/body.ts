import practiceTeachingPlanTable from './practice-teaching-plan-table';
import subjectGoalsTable from './subject-goals-table';
import subjectOuputStandardTable from './subject-ouput-standard-table';
import theoryTeachingPlanTable from './theory-teaching-plan-table';
import evaluationTable from './evaluation-table';

export default (data) => `
<body class="c60">
    <div>
        <p class="c10 c12"><span class="c14 c67"></span></p>
    </div>
    <h3 class="c65 c69"><span class="c4 c71">&nbsp;</span></h3>
    <p class="c32 title"><span class="c14 c44">ĐỀ CƯƠNG MÔN HỌC</span><span class="c4 c58">&nbsp;</span></p>
    <p class="c32 title"><span class="c4 c58">${data.ma} &ndash; ${data.tenTiengViet}</span></p>
    <ol class="c6 lst-kix_list_41-0 start" start="1">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">THÔNG TIN CHUNG</span></h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c39 c27">(Hướng dẫn: mô tả các thông tin cơ bản của môn học)</span></p><a
        id="t.94f37507212b865d0e688655a6a35fe4ae37abee"></a><a id="t.0"></a>
    <table class="c56">
        <tbody>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">Tên môn học (tiếng Việt):</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.tenTiengViet}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">Tên môn học (tiếng Anh):</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.tenTiengAnh}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">Mã số môn học:</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.ma}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">Thuộc khối kiến thức:</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.khoiKienThuc}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">Số tín chỉ:</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.soTinChi}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c15"><span class="c0">Số tiết lý thuyết:</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.soTietLyThuyet}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c15"><span class="c0">Số tiết thực hành:</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.soTietThucHanh}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c15"><span class="c0">Số tiết tự học:</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.soTietTuHoc}</span></p>
                </td>
            </tr>
            <tr class="c9">
                <td class="c49" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">Các môn học tiên quyết</span></p>
                </td>
                <td class="c34" colspan="1" rowspan="1">
                    <p class="c28"><span class="c0">${data.monHocTienQuyet}</span></p>
                </td>
            </tr>
        </tbody>
    </table>
    <ol class="c6 lst-kix_list_41-0" start="2">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">MÔ TẢ MÔN HỌC (COURSE DESCRIPTION)</span></h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c39 c27">(Hướng dẫn: một đoạn văn mô tả tóm tắt về nội dung của môn học)</span></p>
    <p class="c24"><span class="c0">${data.moTa}</span></p>
    <ol class="c6 lst-kix_list_41-0" start="3">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">MỤC TIÊU MÔN HỌC (COURSE GOALS)</span>
            </h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c39 c27">(Hướng dẫn: Liệt kê các mục tiêu môn học, từ 5-8 mục tiêu ở mức độ tổng
            quát. Sử dụng động từ Bloom ở mức độ nhóm. Mỗi mục tiêu môn học được mapping với chuẩn đầu ra cấp chương
            trình)</span></p>
    <hr style="page-break-before:always;display:none;">
    <p class="c62"><span class="c0">Sinh viên học xong môn học này có khả năng :</span></p><a
        id="t.08b95ece929dbfe729e1695e28288c5c636ef47f"></a><a id="t.1"></a>
    ${subjectGoalsTable(data.mucTieuMonHoc)}
    <ol class="c6 lst-kix_list_41-0" start="4">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">CHUẨN ĐẦU RA MÔN HỌC</span></h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c27 c39">(Hướng dẫn: Mô tả chi tiết các chuẩn đầu ra của môn học. Ứng với mỗi mục
            tiêu ở mục phía trên có thể có 1 hay nhiều chuẩn đầu ra chi tiết. Đánh mã số chuẩn đầu ra môn học ở cấp 2
            tương ứng với mỗi mục tiêu môn học. Mức độ được thể hiện bằng các ký hiệu I-Introduce, T-Teach và U-Utilize.
            Các động từ mô tả được sử dụng từ các động từ chi tiết của Bloom cho mức độ tương ứng – xem thêm bảng các
            động từ Bloom chi tiết cho ngành kỹ thuật.)</span></p><a
        id="t.79acfbcf7dff81506992c34f6e1bb6c10402f9c9"></a><a id="t.2"></a>
    ${subjectOuputStandardTable(data.chuanDauRaMonHoc)}
    <ol class="c6 lst-kix_list_41-0" start="5">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">KẾ HOẠCH GIẢNG DẠY LÝ THUYẾT</span></h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c39 c27">(Hướng dẫn: Mô tả chi tiết quá trình giảng dạy theo từng chủ đề: tên chủ
            đề, danh sách các chuẩn đầu ra chi tiết tương ứng với mỗi chủ đề, các hoạt động dạy và học gợi ý, các hoạt
            động đánh giá nếu có)</span></p><a id="t.370b0293c853639a8a26fc46f1956b5d98aa730d"></a><a id="t.3"></a>
    ${theoryTeachingPlanTable(data.keHoachGiangDayLyThuyet)}
    <ol class="c6 lst-kix_list_41-0" start="6">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">KẾ HOẠCH GIẢNG DẠY THỰC HÀNH (nếu có)</span></h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c39 c27">(Hướng dẫn: Mô tả tương tự như kế hoạch giảng dạy lý thuyết. Các chủ đề
            được liệt kê tuần tự và các chuẩn đầu ra, hoạt động giảng dạy và đánh giá tương ứng cho từng chủ đề.
            Lưu ý: đối với hình thức thực hành là hình thức 2 – nghĩa là GVTH không lên lớp thì có thể ghi trong hoạt
            động dạy & học là “thảo luận và trả lời thắc mắc trên diễn đàn môn học”)</span></p><a
        id="t.c5b009a38f6f7c91f5fe641710f60566cbd28b06"></a><a id="t.4"></a>
    ${practiceTeachingPlanTable(data.keHoachGiangDayThucHanh)}
    <ol class="c6 lst-kix_list_41-0" start="7">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">ĐÁNH GIÁ</span></h1>
        </li>
    </ol>
    <p class="c10"><span class="c14 c39 c27">(Hướng dẫn: Mô tả các thành phần bài tập, bài thi, đồ án... dùng để đánh giá kết quả của sinh viên khi tham gia môn học này. Bên cạnh mỗi nhóm bài tập, bài thi... cần có tỉ lệ % điểm tương ứng)</span></p><a
        id="t.96eb44cd32d9728b3b087d435a4de03e7ea6ee3c"></a><a id="t.5"></a>
    ${evaluationTable(data.loaiDanhGia)}
    <ol class="c6 lst-kix_list_41-0" start="8">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">TÀI NGUYÊN MÔN HỌC</span></h1>
        </li>
    </ol>
    ${data.taiNguyen}
    <h1 class="c64"><span class="c41 c4"></span></h1>
    <p class="c10 c26 c12"><span class="c0"></span></p>
    <hr style="page-break-before:always;display:none;">
    <ol class="c6 lst-kix_list_41-0" start="9">
        <li class="c59 li-bullet-0">
            <h1 style="display:inline"><span class="c4">CÁC QUY ĐỊNH CHUNG</span></h1>
        </li>
    </ol>
    ${data.quiDinh}
    <div>
        <p class="c10 c12"><span class="c14 c73"></span></p>
    </div>
</body>
`;

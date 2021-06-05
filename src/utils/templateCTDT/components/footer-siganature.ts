export default () => `
<style>
    .row-footer {
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-justify-content: space-around;
        justify-content: space-around;
        height: 300px;
    }
</style>

<div class="row row-footer signature">
    <div>
        <h4 class="text-uppercase">HIỆU TRƯỞNG</h4>
    </div>

    <div>
        <h4 class="text-uppercase">TRƯỞNG PHÒNG ĐÀO TẠO</h4>
    </div>

    <div>
        <h4 class="text-uppercase">TRƯỞNG KHOA</h4>
    </div>
</div>`;

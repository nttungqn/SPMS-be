# SPMS Back-end

Service back-end for SPMS

## Requirements

- Nodejs 10+

- Nestjs 7+

- Mysql 8.0+

## Project layout

```bash
.
├── docs/
├── spms_api
├── src/
├── test/
├── db/
├── package.json
├── package-lock.json  
├── tools/
├── constant.ts
├── .envrc
├── .gitignore
├── CONTRIBUTING.md
├── docker-compose.yml
├── LICENSE
└── README.md
```

- `docs` chứa những tài liệu mô tả luồng xử lý, tính năng của dự án có thể bao gồm `apis`, `postman`, ...

  
- `src` chứa source code các chức năng theo mô hình **3 Layers**
  
- `test` chứa source code unit tests để kiểm tra tương ứng với tính năng trong thư mục `src`
  
- `db` chứa file sql tạo database (**lưu ý**: nên đặt tên theo format `yyyymmdd_table.sql`)
  
- `package.json` và `package-lock.json` mô tả thông tin package cần có
  
- `tools` chứa những công cụ cần có
  
- `constanst` lưu *global variables*

- `.envrc` file chứa những biến môi trường có thể có

- `CONTRIBUTING.md` quy định về cách sử dụng với `git`

## Development installation

1. Install node package
   
   ```shell
   npm install
   ```

2. Run 
   
   - Development : 
     
     ```shell
     npm run start
     # or
     npm run start:dev
     ```
   
   - Production
     
     ```shell
     npm run start:prod
     ```

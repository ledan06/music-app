const fs = require("fs-extra");

const foldersToCopy = [
    { source: "views", destination: "dist/views" },
    { source: "public", destination: "dist/public" }
];

foldersToCopy.forEach(({ source, destination }) => {
    fs.copy(source, destination, err => {
        if (err) {
            console.error(`Lỗi khi sao chép từ thư mục ${source}:`, err);
        } else {
            console.log(`Sao chép thành công từ thư mục ${source} đến ${destination}`);
        }
    });
});
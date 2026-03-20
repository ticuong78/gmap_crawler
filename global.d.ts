export {};

declare global {
  type GmapStatus =
    | "idle" // Chưa làm gì, chờ user
    | "launching" // Đang khởi động browser + load maps
    | "ready" // Maps đã load xong, sẵn sàng search
    | "searching" // Đang type keyword + nhấn Enter
    | "crawling" // Đang thu thập kết quả
    | "done" // Hoàn thành
    | "error" // Có lỗi xảy ra
    | "closed";
  type GmapErrorMessage = string | null;
}

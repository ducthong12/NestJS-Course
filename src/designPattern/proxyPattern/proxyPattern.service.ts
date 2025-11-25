interface Downloader {
  download(url: string): void;
}

class RealDownloader implements Downloader {
  download(url: string) {
    console.log(`Downloading MP4 from ${url}... (Takes 5s)`);
  }
}

class ProxyDownloader implements Downloader {
  // 1. Biến để lưu danh sách đã tải (Cache)
  private cache: Set<string> = new Set();

  // 2. Biến chứa đối tượng thật
  private realDownloader: RealDownloader | null = null;

  download(url: string) {
    // --- BƯỚC 1: Kiểm tra Cache ---
    if (this.cache.has(url)) {
      console.log(`[Proxy] Get from cache: ${url} (No download needed)`);
      return; // Dừng luôn, không gọi thằng thật
    }

    // --- BƯỚC 2: Lazy Init (Như bạn đã làm) ---
    if (!this.realDownloader) {
      console.log('[Proxy] Initializing RealDownloader...');
      this.realDownloader = new RealDownloader();
    }

    // --- BƯỚC 3: Gọi thằng thật và Lưu vào Cache ---
    this.realDownloader.download(url);
    this.cache.add(url); // Đánh dấu là đã tải
  }
}

// --- Test ---
const proxy = new ProxyDownloader();
proxy.download('video1.mp4'); // Lần 1: Tải thật
proxy.download('video1.mp4'); // Lần 2: Lấy từ cache
proxy.download('video2.mp4'); // Lần 3: Tải thật

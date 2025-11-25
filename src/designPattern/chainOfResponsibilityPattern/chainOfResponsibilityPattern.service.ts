// 1. Base Handler (Lớp cha định nghĩa quy tắc chuyền bóng)
abstract class Handler {
  protected nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Trả về handler vừa set để có thể nối chuỗi: handler1.setNext(h2).setNext(h3)
    return handler;
  }

  abstract handle(request: string): void;
}

// 2. Các Handler cụ thể (Concrete Handlers)

class BotHandler extends Handler {
  handle(request: string): void {
    if (request === 'hello') {
      console.log('🤖 Bot: Xin chào! Tôi có thể giúp gì? (Đã xử lý xong)');
      return; // Dừng lại, không chuyền tiếp
    }

    console.log('🤖 Bot: Tôi không hiểu, chuyển cho nhân viên...');
    // Nếu có người sau thì chuyển tiếp
    if (this.nextHandler) {
      this.nextHandler.handle(request);
    }
  }
}

class StaffHandler extends Handler {
  handle(request: string): void {
    if (request === 'simple_bug') {
      console.log('👨‍💻 Staff: Đã fix xong bug này. (Đã xử lý xong)');
      return;
    }

    console.log('👨‍💻 Staff: Ca này khó quá, chuyển cho sếp...');
    if (this.nextHandler) {
      this.nextHandler.handle(request);
    }
  }
}

class ManagerHandler extends Handler {
  handle(request: string): void {
    // Sếp là chốt chặn cuối cùng
    console.log(`boss Manager: Ok, để tôi xử lý vấn đề "${request}" này.`);
  }
}

// --- 3. Client Code (Cách sử dụng) ---

// Khởi tạo các bộ phận
const bot = new BotHandler();
const staff = new StaffHandler();
const manager = new ManagerHandler();

// Thiết lập dây chuyền (Chain): Bot -> Staff -> Manager
bot.setNext(staff).setNext(manager);

// Test 1: Chat câu đơn giản
console.log('--- Test 1: "hello" ---');
bot.handle('hello');
// Output: Bot xử lý xong. Staff và Manager không bị làm phiền.

// Test 2: Chat báo lỗi khó
console.log('\n--- Test 2: "critical_crash" ---');
bot.handle('critical_crash');
// Output:
// Bot: Chuyển...
// Staff: Chuyển...
// Manager: Để tôi xử lý.

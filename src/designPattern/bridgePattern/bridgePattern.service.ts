// --- 1. Implementation Layer (Phần thực thi - CÁCH GỬI) ---
interface Sender {
  send(message: string): void;
}

class EmailSender implements Sender {
  send(message: string): void {
    console.log(`[Email System] Sending: ${message}`);
  }
}

class SmsSender implements Sender {
  send(message: string): void {
    console.log(`[SMS System] Sending: ${message}`);
  }
}

// --- 2. Abstraction Layer (Phần trừu tượng - LOẠI THÔNG BÁO) ---
abstract class Notification {
  // Đây chính là cái "Cầu" (Bridge) nối 2 thế giới
  constructor(protected sender: Sender) {}

  abstract notify(content: string): void;
}

// --- 3. Refined Abstractions (Các loại thông báo cụ thể) ---

class AlertNotification extends Notification {
  notify(content: string): void {
    // Alert thì format kiểu hét vào mặt (Upper case)
    const formattedMsg = `!!! ALERT: ${content.toUpperCase()} !!!`;
    this.sender.send(formattedMsg);
  }
}

class ReminderNotification extends Notification {
  notify(content: string): void {
    // Reminder thì nhẹ nhàng
    const formattedMsg = `Don't forget to: ${content}`;
    this.sender.send(formattedMsg);
  }
}

// --- 4. Client Code (Mix & Match thoải mái) ---

// Kịch bản 1: Gửi Cảnh báo qua SMS (Server sập!)
const sms = new SmsSender();
const alert = new AlertNotification(sms); // Nối Alert với SMS
alert.notify('Server Down');
// Output: [SMS System] Sending: !!! ALERT: SERVER DOWN !!!

// Kịch bản 2: Gửi Nhắc nhở qua Email (Họp team)
const email = new EmailSender();
const reminder = new ReminderNotification(email); // Nối Reminder với Email
reminder.notify('Join Daily Scrum');
// Output: [Email System] Sending: Don't forget to: Join Daily Scrum

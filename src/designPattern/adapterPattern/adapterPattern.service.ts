// 1. Thư viện cũ (Không được sửa code này)
class OldZaloPay {
  send_money_v1(amount: number, note: string) {
    console.log(`Zalo Old: Sending ${amount} with note: ${note}`);
  }
}

// 2. Interface mà hệ thống mới mong muốn
interface IPaymentProcessor {
  processPayment(money: number): void;
}

// 3. --- Nhiệm vụ của bạn: Viết class Adapter ở đây ---
// Class này phải implement IPaymentProcessor
// Nhưng bên trong lại gọi OldZaloPay
class ZaloPayAdapter implements IPaymentProcessor {
  constructor(private oldZaloPay: OldZaloPay) {}

  processPayment(money: number): void {
    this.oldZaloPay.send_money_v1(money, 'Payment via Adapter');
  }
}

// 4. Code sử dụng (Client)
const oldLib = new OldZaloPay();
const adapter = new ZaloPayAdapter(oldLib);
adapter.processPayment(100000); // Kết quả mong đợi: "Zalo Old: Sending 100000..."

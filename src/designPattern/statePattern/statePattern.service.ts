// 1. Context (Cái Đơn hàng)
class OrderContext {
  public state: OrderState;

  constructor() {
    this.state = new NewOrderState(); // Mặc định là đơn mới
  }

  // Hàm chuyển đổi trạng thái
  setState(newState: OrderState) {
    this.state = newState;
    console.log(`--- Order transitioned to ${this.state.constructor.name} ---`);
  }

  // Các hành động (Ủy quyền cho State hiện tại xử lý)
  pay() {
    this.state.pay(this);
  }
  ship() {
    this.state.ship(this);
  }
}

// 2. State Interface
interface OrderState {
  pay(order: OrderContext): void;
  ship(order: OrderContext): void;
}

// 3. Concrete States (Các trạng thái cụ thể)

// --- Trạng thái: Đơn Mới ---
class NewOrderState implements OrderState {
  pay(order: OrderContext) {
    console.log('Payment accepted.');
    // Chuyển sang trạng thái Đã Thanh Toán
    order.setState(new PaidOrderState());
  }

  ship() {
    console.log('❌ Error: Cannot ship unpaid order!');
  }
}

// --- Trạng thái: Đã Thanh Toán ---
class PaidOrderState implements OrderState {
  pay() {
    console.log('⚠️ Warning: Order already paid.');
  }

  ship(order: OrderContext) {
    console.log('Shipping product...');
    // Chuyển sang trạng thái Đã Giao
    order.setState(new ShippedOrderState());
  }
}

// --- Trạng thái: Đã Giao ---
class ShippedOrderState implements OrderState {
  pay() {
    console.log('❌ Error: Order already shipped.');
  }
  ship() {
    console.log('⚠️ Warning: Already shipped.');
  }
}

// --- Test ---
const order = new OrderContext();

console.log('1. Thử Ship khi chưa trả tiền:');
order.ship(); // -> Error

console.log('\n2. Trả tiền:');
order.pay(); // -> Chuyển sang PaidOrderState

console.log('\n3. Ship hàng:');
order.ship(); // -> Chuyển sang ShippedOrderState

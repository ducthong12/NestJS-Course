// 1. Receiver (Thiết bị thực sự làm việc)
class Light {
  on() {
    console.log('💡 Light is ON');
  }
  off() {
    console.log('🌑 Light is OFF');
  }
}

// 2. Command Interface
interface Command {
  execute(): void;
  undo(): void;
}

// 3. Concrete Command (Lệnh Bật Đèn)
class TurnOnLightCommand implements Command {
  // Phải cầm tham chiếu đến cái đèn
  constructor(private light: Light) {}

  execute() {
    this.light.on(); // Bật
  }

  undo() {
    this.light.off(); // Undo của Bật là Tắt
  }
}

// 4. Invoker (Cái Remote - Người ra lệnh)
class RemoteControl {
  private history: Command[] = []; // Lưu lịch sử để Undo

  submit(command: Command) {
    command.execute();
    this.history.push(command); // Lưu lại dấu vết
  }

  undo() {
    const lastCommand = this.history.pop();
    if (lastCommand) {
      console.log('Running Undo...');
      lastCommand.undo();
    } else {
      console.log('Nothing to undo');
    }
  }
}

// --- Test ---
const light = new Light();
const turnOnCommand = new TurnOnLightCommand(light);
const remote = new RemoteControl();

remote.submit(turnOnCommand); // Output: Light is ON
remote.undo(); // Output: Light is OFF

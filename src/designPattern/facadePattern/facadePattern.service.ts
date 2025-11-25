// Các hệ thống con phức tạp
class TV {
  turnOn() {}
  setInput(type: string) {
    console.log(`TV input set to ${type}`);
  }
}
class SoundSystem {
  turnOn() {}
  setVolume(level: number) {
    console.log(`Sound system volume set to ${level}`);
  }
}
class Lights {
  dim(level: number) {
    console.log(`Lights dimmed to ${level}%`);
  }
}

// --- TODO: Viết Facade ---
class HomeTheaterFacade {
  // Constructor nhận vào các device
  // Method: watchMovie() -> Tự động bật hết các thứ

  constructor(
    private tv: TV,
    private soundSystem: SoundSystem,
    private lights: Lights,
  ) {}

  watchMovie() {
    this.tv.turnOn();
    this.tv.setInput('HDMI');
    this.soundSystem.turnOn();
    this.soundSystem.setVolume(50);
    this.lights.dim(20);
  }
}

const homeTheater = new HomeTheaterFacade(
  new TV(),
  new SoundSystem(),
  new Lights(),
);

homeTheater.watchMovie();
// Kết quả mong đợi:

interface Observer {
  update(videoTitle: string): void;
}

class YoutubeChannel {
  private subscribers: Observer[] = [];

  subscribe(sub: Observer) {
    this.subscribers.push(sub);
  }
  unsubscribe(sub: Observer) {
    this.subscribers = this.subscribers.filter((s) => s !== sub);
  }

  uploadVideo(title: string) {
    console.log(`Uploading ${title}...`);
    // TODO: Loop qua mảng subscribers và gọi hàm update() của họ
    this.subscribers.forEach((sub) => sub.update(title));
  }
}

// 1. Tạo các Subscriber (Người xem)
class User implements Observer {
  constructor(private name: string) {}
  update(videoTitle: string) {
    console.log(
      `${this.name} got notification: New video "${videoTitle}" is out!`,
    );
  }
}

// 2. Chạy kịch bản
const myChannel = new YoutubeChannel();
const user1 = new User('Tùng');
const user2 = new User('Nam');

myChannel.subscribe(user1);
myChannel.subscribe(user2);

myChannel.uploadVideo('Learn NestJS in 10 mins');
// Output:
// Uploading Learn NestJS in 10 mins...
// Tùng got notification: New video "Learn NestJS in 10 mins" is out!
// Nam got notification: New video "Learn NestJS in 10 mins" is out!

// Nam hủy đăng ký
myChannel.unsubscribe(user2);
myChannel.uploadVideo('Advanced SOLID');
// Output: Chỉ còn Tùng nhận được thông báo.

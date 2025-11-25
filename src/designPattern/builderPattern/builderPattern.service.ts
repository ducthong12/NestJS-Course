// 1. Class Sản phẩm (Product) - Chỉ chứa dữ liệu
class Email {
  constructor(
    public from: string,
    public to: string,
    public subject: string,
    public body: string,
    public cc: string[],
    public bcc: string[],
    public attachments: string[],
  ) {}
}

// 2. Class Builder - Chuyên đi xây dựng
class EmailBuilder {
  private subject: string = '';
  private body: string = '';
  private cc: string[] = [];
  private bcc: string[] = [];
  private attachments: string[] = [];

  constructor(
    private from: string, // Giữ private để dùng lúc build
    private to: string,
  ) {}

  setSubject(subject: string): EmailBuilder {
    this.subject = subject;
    return this;
  }

  setBody(body: string): EmailBuilder {
    this.body = body;
    return this;
  }

  addAttachment(attachment: string): EmailBuilder {
    this.attachments.push(attachment);
    return this;
  }

  // --- KHÁC BIỆT LỚN NHẤT Ở ĐÂY ---
  build(): Email {
    // Trả về một object Email mới tinh, tách biệt hoàn toàn với Builder
    return new Email(
      this.from,
      this.to,
      this.subject,
      this.body,
      this.cc,
      this.bcc,
      this.attachments,
    );
  }
}

// --- Client ---
const mail = new EmailBuilder('me@gmail.com', 'you@gmail.com')
  .setSubject('Hello Builder')
  .addAttachment('file.png')
  .build(); // Lúc này biến 'mail' là kiểu Email, không phải EmailBuilder

console.log(mail);

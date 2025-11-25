interface FileSystemComponent {
  getSize(): number;
}

class FileItem implements FileSystemComponent {
  constructor(private size: number) {}
  getSize() {
    return this.size;
  }
}

// --- TODO: Hoàn thiện class Folder ---
class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  add(component: FileSystemComponent) {
    this.children.push(component);
  }

  getSize(): number {
    let totalSize = 0;

    for (const child of this.children) {
      totalSize += child.getSize();
    }

    return totalSize;
  }
}

// Tạo các file lẻ
const file1 = new FileItem(10); // 10MB
const file2 = new FileItem(20); // 20MB
const file3 = new FileItem(30); // 30MB

// Tạo folder con
const subFolder = new Folder();
subFolder.add(file1); // subFolder = 10
subFolder.add(file2); // subFolder = 10 + 20 = 30

// Tạo folder cha (root)
const rootFolder = new Folder();
rootFolder.add(subFolder); // root chưa subFolder (30)
rootFolder.add(file3); // root chứa file3 (30)

console.log(rootFolder.getSize());
// Kết quả: 60 (30 từ subFolder + 30 từ file3)

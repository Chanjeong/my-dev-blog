export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadFileInput {
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  folder: string;
}

export interface UploadFileResult {
  fileKey: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface IStorageService {
  upload(input: UploadFileInput): Promise<UploadFileResult>;
  getUrl(fileKey: string): Promise<string>;
  delete(fileKey: string): Promise<void>;
}
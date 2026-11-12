import type { IStorageService } from "../../domain/interfaces/IStorageService.ts";

export class UploadMaterialUseCase {
  constructor(
    private readonly storageService: IStorageService
  ) {}

  async execute(file: Express.Multer.File) {

    const folder = file.mimetype === "application/pdf"
      ? "learning-materials/pdf"
      : file.mimetype.startsWith("video/")
        ? "session-recordings"
        : file.mimetype.startsWith("image/")
          ? "profile-images"
          : "other";

    return this.storageService.upload({
      filePath: file.path,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder,
    });
  }
}
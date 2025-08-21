export interface SecurityPhotoResult {
  backPhoto: string;
  frontPhoto: string;
  timestamp: string;
}

export interface CameraCaptureModule {
  captureSecurityPhotos(): Promise<SecurityPhotoResult>;
}

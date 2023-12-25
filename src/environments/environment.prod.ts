import { join } from "path";

export const environment = {
  production: true,
  uploadedFilesDir: join(__dirname, '..', '..','publicFiles'),
  ApiUrl:'ApiUrl',
 };

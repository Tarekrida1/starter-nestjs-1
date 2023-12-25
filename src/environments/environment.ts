import { join } from 'path';
export const environment = {
  production: false,
  uploadedFilesDir: join(__dirname, '..', '..','publicFiles'),
};

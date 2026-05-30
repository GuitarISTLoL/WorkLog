import { existsSync } from 'fs';
import { join } from 'path';

export function getEnvFilePaths(): string[] {
  const candidates = [
    join(process.cwd(), '.env'),
    join(process.cwd(), '..', '.env'),
  ];

  return candidates.filter((path) => existsSync(path));
}

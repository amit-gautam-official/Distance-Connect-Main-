// scripts/configure-cors.ts
import { configureCORS } from '../src/lib/gcp-cors-config';

configureCORS().catch(console.error);

import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-crew-allocation.ts';
import '@/ai/flows/suggest-route-flow.ts';
import '@/ai/flows/predictive-maintenance-flow.ts';
import '@/ai/flows/analyze-safety-report-flow.ts';
import '@/ai/flows/generate-shanty-flow.ts';
import '@/ai/flows/generate-vessel-image-flow.ts';
import '@/ai/flows/generate-vessel-video-flow.ts';
import '@/ai/flows/generate-shanty-audio-flow.ts';
    

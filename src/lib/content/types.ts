import type { z } from 'zod';
import type { imageSchema, linkSchema, pageSchema, siteSchema } from './schema';

export type LinkItem = z.infer<typeof linkSchema>;
export type ImageAsset = z.infer<typeof imageSchema>;
export type SiteSettings = z.infer<typeof siteSchema>;
export type MarketingPage = z.infer<typeof pageSchema>;

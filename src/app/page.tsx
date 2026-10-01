import type { Metadata } from 'next';
import { TrackierPage } from '@/components/trackier/TrackierPage';

export const metadata: Metadata = {
  title: 'Trackier — One Platform, Multiple Solutions for Brands',
  description:
    'Scale, manage and optimize your performance marketing with Trackier’s partner marketing platform.',
};

export default function Home() {
  return <TrackierPage />;
}

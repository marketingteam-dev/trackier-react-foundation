import { redirect } from 'next/navigation';

// Convenience on the local / staging Next origin only. Production / stays WordPress.
export default function Home() { redirect('/react-demo/'); }

export type ClientStoryVideo =
  | { kind: 'youtube'; url: string; title: string }
  | { kind: 'file'; url: string; title: string; mimeType?: 'video/mp4' | 'video/webm' }
  | { kind: 'embed'; url: string; title: string };

export type ClientStory = {
  id: string;
  company: string;
  quote: string;
  speaker: string;
  role: string;
  portrait: string;
  video: ClientStoryVideo | null;
};

// The user supplied this temporary video for all three cards in the original design.
// Replace individual video values when distinct customer videos are available.
const sharedVideo: ClientStoryVideo = {
  kind: 'youtube',
  url: 'https://www.youtube.com/watch?v=huzHyFb1uKo',
  title: 'Trackier client story',
};

export const clientStories: ClientStory[] = [1, 2, 3].map((number) => ({
  id: `cuelinks-${number}`,
  company: 'Cuelinks',
  quote:
    '“I am very much satisfied. The CSM goes above and beyond. We work with many other networks that use Trackier, and the support we receive is exceptional. I would give Trackier a 10 on 10.”',
  speaker: 'Rachit Chugh',
  role: 'Senior Operations Manager',
  portrait: '/react-assets/figma/43f79ddc-1712-4c0a-90fc-a67e2095ad0d.png',
  video: sharedVideo,
}));

export function getClientStoryVideoUrl(video: ClientStoryVideo | null): string | null {
  if (!video) return null;
  try {
    const url = new URL(video.url);
    if (url.protocol !== 'https:') return null;
    if (video.kind === 'youtube') {
      const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
      const id =
        hostname === 'youtu.be'
          ? url.pathname.slice(1)
          : ['youtube.com', 'youtube-nocookie.com'].includes(hostname)
            ? url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
            : null;
      if (!id || !/^[\w-]{11}$/.test(id)) return null;
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
    }
    if (video.kind === 'file' && !/\.(mp4|webm)$/i.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

import type { Metadata } from 'next'

const vercelURL = "https://f281-141-136-91-106.ngrok-free.app";
const encodedVercelURL = encodeURIComponent(vercelURL);
const messageText = "Excited for the launch of FarGen! 🎨\n\nGenerate AI art and images in frame\n\nLaunching on August 5 at 14:00 EST 🚀🖼️\n\n👨‍🎨 Frame by: @sharas.eth\n\nShare this frame for a chance to win one of 10 exclusive Early-Pass NFTs to use FarGen frame!👇\n";
const encodedMessage = encodeURIComponent(messageText);
const href = `https://warpcast.com/~/compose?text=${encodedMessage}&embeds%5B%5D=${encodedVercelURL}`;

export const metadata: Metadata = {
  title: 'FarGen - AI Image Generator',
  description: 'Generate AI images in Farcaster Frames',
  openGraph: {
    title: 'FarGen - AI Image Generator',
    description: 'Generate AI images in Farcaster Frames',
    images: ["https://i.ibb.co/K2Ln7gR/get-pass.jpg"],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image:aspect_ratio':'1:1',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_SITE_URL}/init.gif`,
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_SITE_URL}/api/check`,
    'fc:frame:button:1': 'Start',
    'fc:frame:button:2': 'Get early pass',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://zora.co/collect/base:0x6ec3b83091a440b46844beabd141b887fd034390/1?referrer=0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6',
    'fc:frame:button:3': 'Share',
    'fc:frame:button:3:action': 'link',
    'fc:frame:button:3:target': `${href}`,
  },
}

export default function Page() {
  return (
    <div>
      <h1>FarGen - AI Image Generator</h1>
      <p>Use this frame to generate AI images directly in Farcaster!</p>
    </div>
  )
}
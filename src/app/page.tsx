import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'
import Image from 'next/image'

const vercelURL = process.env.NEXT_PUBLIC_SITE_URL as string;
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
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/home.jpg`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image:aspect_ratio':'1:1',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_SITE_URL}/init.gif`,
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_SITE_URL}/api/check`,
    'fc:frame:button:1': 'Start',
    'fc:frame:button:2': 'Share',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${href}`,
    'fc:frame:button:3': 'Tip @Sharas.eth',
    'fc:frame:button:3:action': 'link',
    'fc:frame:button:3:target': `${process.env.TIP_URL}`,
    'fc:frame:button:4': 'Nominate @Sharas.eth',
    'fc:frame:button:4:action': 'link',
    'fc:frame:button:4:target': 'https://build.top/nominate/0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6',
  
  },
}

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.overlay}>
        <a 
          href="https://warpcast.com/sharas.eth" 
          className={styles.overlayText}
          target="_blank" 
          rel="noopener noreferrer"
        >
          Frame by @sharas.eth
        </a>
      </div>
      <div className={styles.container}>
        <Image
          src="/initial.gif"
          alt="Fargen Studio"
          width={600}
          height={600}
          priority
        />
        <div className={styles.buttonContainer}>
          <Link href={`https://warpcast.com/~/compose?text=🎨✨ Generate amazing ai art in-frame with FarGen! 🖼️%0A%0A👨‍🎨 Frame by: @sharas.eth%0A%0A🚀 Try it yourself! 👇%0A&embeds[]=${encodedVercelURL}`} passHref>
            <button type="button" className={styles.button}>Share on Farcaster</button>
          </Link>
          <Link href="https://zora.co/collect/base:0x6ec3b83091a440b46844beabd141b887fd034390/1?referrer=0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" passHref>
            <button type="button" className={styles.button}>Get Early Pass</button>
          </Link>
        </div>
      </div>
    </main>
  )
}
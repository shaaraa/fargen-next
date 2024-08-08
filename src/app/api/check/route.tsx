import { NextRequest, NextResponse } from 'next/server'
import { CheckTokenHoldByFarcasterUserInput } from '../../../lib/airstack'
import {
  init,
  validateFramesMessage,
  ValidateFramesMessageInput,
  ValidateFramesMessageOutput,
} from "@airstack/frames";

export async function POST(req: NextRequest): Promise<NextResponse> {
  init(process.env.AIRSTACK_API_KEY as string);
  const launchDate = process.env.START_DATE as string
  const launchTime = new Date(launchDate);
  const currentTime = new Date();
  //const paramFid = Number(req.nextUrl.searchParams.get('fid'));
  const frameData = await req.json();
  const trustedData = await validateFramesMessage(frameData);
  const {isValid, message} = trustedData
  //console.log(message);
  if (currentTime < launchTime) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Countdown</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/og" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Follow @sharas.eth" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://warpcast.com/sharas.eth" />
      <meta property="fc:frame:button:2" content="Share on Farcaster" />
      <meta property="fc:frame:button:2:action" content="link" />
      <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=Excited for the launch of FarGen! 🎨%0A%0AGenerate AI art and images in frame%0A%0ALaunching on August 5 at 14:00 EST 🚀🖼️%0A%0A👨‍🎨 Frame by: @sharas.eth%0A%0AShare this frame for a chance to win one of 10 exclusive Early-Pass NFTs to use FarGen frame!👇%0A&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL as string)}" />
      <meta property="fc:frame:button:3" content="Get Early-Pass" />
      <meta property="fc:frame:button:3:action" content="link" />
      <meta property="fc:frame:button:3:target" content="https://zora.co/collect/base:0x6ec3b83091a440b46844beabd141b887fd034390/1?referrer=0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" />
    </head><body></body></html>`)
  }
  
  const fid = message?.data.fid as number

  if (!fid || !isValid) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Error</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/error.jpg" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Try Again" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}" />
    </head></html>`)
  }

  const hasToken = await CheckTokenHoldByFarcasterUserInput(fid);
  
  //const user = await GetFarcasterUserDetails(fid);
  //const hasToken = true;
  if (hasToken) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Select Style</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/select-style.jpg" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Anime" />
      <meta property="fc:frame:button:2" content="Photorealistic" />
      <meta property="fc:frame:button:3" content="Painting" />
      <meta property="fc:frame:button:4" content="3D Cartoon" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/prompt/?fid=${fid}" />
    </head></html>`)
  } else {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Get Pass</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/get-pass.jpg" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Get early pass" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://zora.co/collect/base:0x6ec3b83091a440b46844beabd141b887fd034390/1?referrer=0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" />
      <meta property="fc:frame:button:2" content="Back" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}" />
    </head></html>`)
  }
}

export const dynamic = 'force-dynamic'
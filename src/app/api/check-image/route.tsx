import { NextRequest, NextResponse } from 'next/server'
import { ImageResult } from '../../../lib/types'

// In-memory storage for results
const results: { [key: string]: ImageResult | null } = {};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const resultId = req.nextUrl.searchParams.get('id');
  console.log(resultId)
  if (!resultId) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Error</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/error.png" />
      <meta property="fc:frame:button:1" content="Try Again" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate" />
    </head></html>`)
  }

  const result = getResult(resultId);
  console.log(result)
  if (!result) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Still Generating</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/generating.gif" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Check Again" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/check-image?id=${resultId}" />
    </head></html>`)
  }

  const imageUrl = result.images[0].url;

  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Generated Image</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Generate Another" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate" />
    <meta property="fc:frame:button:2" content="Nominate @Sharas.eth" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://build.top/nominate/0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" />
    <meta property="fc:frame:button:3" content="Share on Farcaster" />
    <meta property="fc:frame:button:3:action" content="link" />
    <meta property="fc:frame:button:3:target" content="https://warpcast.com/~/compose?text=🎨✨ I just generated this amazing image in-frame with FarGen! 🖼️%0A%0A👨‍🎨 Frame by: @sharas.eth%0A%0A ${encodeURIComponent(imageUrl)}%0A%0A🚀 Try it yourself! 👇%0A&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL as string)}" />
  </head></html>`)
}

function getResult(id: string): ImageResult | null {
  return results[id] || null;
}

export const dynamic = 'force-dynamic'
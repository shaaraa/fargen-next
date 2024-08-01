import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Enter Prompt</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/more-info.jpg" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="get Early-pass" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="https://zora.co/collect/base:0x6ec3b83091a440b46844beabd141b887fd034390/1?referrer=0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" />
    <meta property="fc:frame:button:2" content="Back" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_SITE_URL}" />
  </head></html>`)
}

export const dynamic = 'force-dynamic'
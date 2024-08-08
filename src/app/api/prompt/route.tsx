import { NextRequest, NextResponse } from 'next/server'
import { getFarcasterUserData } from '../../../lib/pinataClient'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const { untrustedData } = data;
  const { buttonIndex } = untrustedData;
  const fid = req.nextUrl.searchParams.get('fid') as unknown as number;
  let style: string;
  let imageSrc: string;

  const userData1 = await getFarcasterUserData(fid)
  const username = userData1.user.username;
  const ethAddress = userData1.user.verified_addresses.eth_addresses[0];
  console.log(username);
  console.log(ethAddress);

  switch (buttonIndex) {
    case 1:
      style = 'Anime';
      imageSrc = '/anime.jpg';
      break;
    case 2:
      style = 'Photorealistic';
      imageSrc = '/photorealistic.jpg';
      break;
    case 3:
      style = 'Painting';
      imageSrc = '/painting.jpg';
      break;
    case 4:
      style = '3D Cartoon';
      imageSrc = '/cartoon.jpg';
      break;
    default:
      style = 'Anime';
      imageSrc = '/anime.jpg';
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Enter Prompt</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}${imageSrc}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:input:text" content="Enter your prompt" />
    <meta property="fc:frame:button:1" content="Generate" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate?style=${style}&fid=${fid}&uid=${username}&ethAddress=${ethAddress}" />
    <meta property="fc:frame:button:2" content="Back" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/check" />
  </head></html>`)
}

export const dynamic = 'force-dynamic'
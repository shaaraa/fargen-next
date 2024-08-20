import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const { untrustedData } = data;
  const { buttonIndex } = untrustedData;
  const fid = req.nextUrl.searchParams.get('fid') as unknown as number;
  const userName = req.nextUrl.searchParams.get('uid') || '';
  const ethAddress = req.nextUrl.searchParams.get('ethAddress') || '';
  let style: string;
  let imageSrc: string;

  

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
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate?style=${style}&fid=${fid}&uid=${userName}&ethAddress=${ethAddress}" />
    <meta property="fc:frame:button:2" content="Back" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/check" />
  </head></html>`)
}

export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import * as fal from '@fal-ai/serverless-client'
import { ImageResult } from '../../../lib/types'
import { xata } from '../../../lib/xataClient'
import { waitUntil } from '@vercel/functions'

fal.config({
  credentials: process.env.GEN_API_KEY as string,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const { untrustedData } = data;
  const { inputText } = untrustedData;
  
  const styleParam = req.nextUrl.searchParams.get('style') || '';
  const resultId = req.nextUrl.searchParams.get('id');
  const fid = req.nextUrl.searchParams.get('fid') || '';
  const userName = req.nextUrl.searchParams.get('uid') || '';
  const ethAddress = req.nextUrl.searchParams.get('ethAddress') || '';

  if (resultId) {
    return await checkImage(resultId);
  } else {
    return await generateImage(inputText, styleParam, fid, userName);
  }
}

async function generateImage(inputText: string , style: string , fid: string, userName: string): Promise<NextResponse> {
  const prompt = `Masterpiece, best quality, highly detailed, ${style}, ${inputText}`;
  const resultId = generateUniqueId();
  waitUntil(generateImageAsync(resultId, prompt, fid, userName));
  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Generating Image</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/generating.gif" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Check Result" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate?id=${resultId}" />
  </head></html>`)
}

async function generateImageAsync(resultId: string, prompt: string, fid: string, userName: string) {
  try {
    const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
      input: { 
        "format": "jpeg",
        "prompt": prompt,
        "image_size": "square_hd",
        "num_images": 1,
        "num_inference_steps": "4",
        "enable_safety_checker": false
      },
      //pollInterval: 2000,
      mode: "streaming",
      logs: false,
    }) as ImageResult;

    // Store the result in Xata
    await xata.db.farcaster.create({
      fid: fid,
      generated_url: result.images[0].url,
      generated_data: result,
      user_name: userName,
      uid: resultId,
      can_generate: true
    });
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

async function checkImage(resultId: string): Promise<NextResponse> {
  // Query the farcaster table for a record with matching uid
  const result = await xata.db.farcaster.filter({ uid: resultId }).getFirst();

  if (!result || !result.generated_url) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Still Generating</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/generating.gif" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Check Again" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate?id=${resultId}" />
    </head></html>`)
  }

  const imageUrl = result.generated_url;

  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Generated Image</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Generate Another" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/check" />
    <meta property="fc:frame:button:2" content="Nominate @Sharas.eth" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://build.top/nominate/0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" />
    <meta property="fc:frame:button:3" content="Share on Farcaster" />
    <meta property="fc:frame:button:3:action" content="link" />
    <meta property="fc:frame:button:3:target" content="https://warpcast.com/~/compose?text=🎨✨ I just generated this amazing image in-frame with FarGen! 🖼️%0A👨‍🎨 Frame by: @sharas.eth%0A🚀 Try it yourself! 👇&embeds[]=${process.env.NEXT_PUBLIC_SITE_URL}&embeds[]=${imageUrl}" />
  </head></html>`)
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const dynamic = 'force-dynamic'

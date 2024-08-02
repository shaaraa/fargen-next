import { NextRequest, NextResponse } from 'next/server'
import * as fal from '@fal-ai/serverless-client'
import { ImageResult } from '../../../lib/types'

fal.config({
  credentials: process.env.GEN_API_KEY as string,
});

// In-memory storage for results
const results: { [key: string]: ImageResult | null } = {};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const { untrustedData } = data;
  const { inputText } = untrustedData;
  
  const resultId = req.nextUrl.searchParams.get('id');
  
  if (resultId) {
    // This is a check request
    return await checkImage(resultId);
  } else {
    // This is a generate request
    return await generateImage(inputText);
  }
}

async function generateImage(inputText: string): Promise<NextResponse> {
  const style = 'Photorealistic'; // You can make this dynamic if needed
  const prompt = `Masterpiece, best quality, ${style}, ${inputText}`;

  const resultId = generateUniqueId();
  results[resultId] = null; // Initialize the result as null

  // Start the image generation process
  generateImageAsync(resultId, prompt);

  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Generating Image</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/generating.gif" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Check Result" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate?id=${resultId}" />
  </head></html>`)
}

async function generateImageAsync(resultId: string, prompt: string) {
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
      logs: true,
    });
    results[resultId] = result as ImageResult;
    console.log(result);
  } catch (error) {
    console.error('Error generating image:', error);
    results[resultId] = null;
  }
}

async function checkImage(resultId: string): Promise<NextResponse> {
  console.log(resultId);
  const result = results[resultId];
  console.log(result);
  
  if (!result) {
    return new NextResponse(`<!DOCTYPE html><html><head>
      <title>Still Generating</title>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_SITE_URL}/generating.gif" />
      <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      <meta property="fc:frame:button:1" content="Check Again" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}/api/generate?id=${resultId}" />
    </head></html>`)
  }

  const imageUrl = result.images[0].url;

  return new NextResponse(`<!DOCTYPE html><html><head>
    <title>Generated Image</title>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Generate Another" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_SITE_URL}" />
    <meta property="fc:frame:button:2" content="Nominate @Sharas.eth" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://build.top/nominate/0xdF2D9E58227CE5e37ED3e40BC49d4442C970A2D6" />
    <meta property="fc:frame:button:3" content="Share on Farcaster" />
    <meta property="fc:frame:button:3:action" content="link" />
    <meta property="fc:frame:button:3:target" content="https://warpcast.com/~/compose?text=🎨✨ I just generated this amazing image in-frame with FarGen! 🖼️%0A%0A👨‍🎨 Frame by: @sharas.eth%0A%0A ${encodeURIComponent(imageUrl)}%0A%0A🚀 Try it yourself! 👇%0A&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL as string)}" />
  </head></html>`)
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const dynamic = 'force-dynamic'
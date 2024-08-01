import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const launchTime = new Date(`${process.env.START_DATE}`);
  const currentTime = new Date();

  let countdownText = 'The event has started!';

  if (currentTime < launchTime) {
    const timeDifference = launchTime.getTime() - currentTime.getTime();
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    countdownText = `${days}d ${hours}h ${minutes}m`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          backgroundImage: `url(${process.env.NEXT_PUBLIC_SITE_URL}/countdown.jpg)`,
          backgroundSize: 'cover',
          fontSize: 30,
          fontWeight: 700,
          textAlign: 'center',
          color: 'black',
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
        }}
      >
        <p>{countdownText}</p>
      </div>
    ),
    {
      width: 630,
      height: 630,
    }
  );
}

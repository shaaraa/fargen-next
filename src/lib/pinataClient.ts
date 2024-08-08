// lib/pinataClient.ts
export async function getFarcasterUserData(fid: number) {
    const url = `https://api.pinata.cloud/v3/farcaster/users/${fid}`;
    console.log('Fetching URL:', url);
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching data from Pinata: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

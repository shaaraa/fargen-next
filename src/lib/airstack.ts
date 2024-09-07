import { init, getFarcasterUserDetails } from "@airstack/frames";
import opensea from '@api/opensea';

init(process.env.AIRSTACK_API_KEY as string);

opensea.auth(process.env.OPENSEA_API_KEY as string);
opensea.server('https://api.opensea.io');

// Function to check if a user holds the Early Pass
export async function CheckTokenHoldByFarcasterAddress(walletAddress: string): Promise<boolean> {
  try {
    const response = await opensea.get_nft({
      chain: 'base',
      address: '0x6ec3b83091a440b46844beabd141b887fd034390',
      identifier: '1'
    });

    const { nft } = response.data;
    // Check if the user's wallet address is in the list of owners
    const isOwner = nft.owners.some((owner: { address: string; quantity: number }) => 
      owner.address.toLowerCase() === walletAddress.toLowerCase()
    );

    return isOwner;
  } catch (err) {
    console.error("Error checking NFT ownership:", err);
    return false;
  }
}

// export async function CheckTokenHoldByFarcasterUserInput(fid: number): Promise<boolean> {
//   const input = {
//     fid: fid,
//     token: [
//       {
//         chain: TokenBlockchain.Base,
//         tokenAddress: "0x6ec3b83091a440b46844beabd141b887fd034390",
//       },
//     ],
//   };

//   try {
//     const { data, error } = await CheckTokenHoldByFarcasterUserQuery(input);
//     if (error) {
//       console.error("Error checking token hold:", error);
//       return false;
//     }
//     return Array.isArray(data) && data.length > 0 && data[0].isHold === true;
//   } catch (error) {
//     console.error("Unexpected error checking token hold:", error);
//     return false;
//   }
// }

// export const checkTokenHoldByFarcasterUserQuery = (
//   chains: TokenBlockchain[] | null | undefined
// ) => {
//   return (
//     /* GraphQL */ `
//     query CheckTokenHoldByFarcasterUserQuery(
//       $owner: Identity!
//       ` +
//     `
//       ${chains?.map?.((chain) => `$${chain}Tokens: [Address!]`).join("\n")}
//     ` +
//     `
//     ) {
//     ` +
//     chains
//       ?.map(
//         (chain) => `
//       ${chain}: TokenBalances(
//         input: {
//           filter: {
//             owner: { _eq: $owner }
//             tokenAddress: { _in: $${chain}Tokens }
//           }
//           blockchain: ${chain}
//           limit: 200
//         }
//       ) {
//         TokenBalance {
//           blockchain
//           tokenAddress
//           amount
//         }
//       }`
//       )
//       ?.join("") +
//     `
//     }
//   `
//   );
// };

export async function GetFarcasterUserDetails(fid: number): Promise<boolean> {
  const input = {
    fid: fid
  };

  try {
    const { data, error } = await getFarcasterUserDetails(input);
    if (error) {
      console.error("Error checking token hold:", error);
      return false;
    }
    return Array.isArray(data) && data.length > 0 && data[0].isHold === true;
    //return false
  } catch (error) {
    console.error("Unexpected error checking token hold:", error);
    return false;
  }
}
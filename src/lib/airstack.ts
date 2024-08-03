import { init, checkTokenHoldByFarcasterUser, getFarcasterUserDetails, TokenBlockchain } from "@airstack/frames";

init(process.env.AIRSTACK_API_KEY as string);

export async function CheckTokenHoldByFarcasterUserInput(fid: number): Promise<boolean> {
  const input = {
    fid: fid,
    token: [
      {
        chain: TokenBlockchain.Base,
        tokenAddress: "0x6ec3b83091a440b46844beabd141b887fd034390",
      },
    ],
  };

  try {
    const { data, error } = await checkTokenHoldByFarcasterUser(input);
    console.log(data)
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

export async function GetFarcasterUserDetails(fid: number): Promise<boolean> {
  const input = {
    fid: fid
  };

  try {
    const { data, error } = await getFarcasterUserDetails(input);
    console.log(data)
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
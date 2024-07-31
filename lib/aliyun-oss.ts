/*
 * @Author: Libra
 * @Date: 2024-07-22 17:45:52
 * @LastEditors: Libra
 * @Description:
 */

import { getStsToken } from "@/actions/oss/get-sts-token";
import OSS from "ali-oss";

export type Credentials = {
  AccessKeyId: string;
  AccessKeySecret: string;
  SecurityToken: string;
  Expiration: string;
};
let credentials: Credentials | null = null;

export const uploadToOss = async (directory: string, file: File) => {
  const client = await initClient();
  const result = await client.put(`${directory}/${file.name}`, file);
  console.log(result);
  return result;
};

export async function initClient() {
  if (isCredentialsExpired(credentials)) {
    const res = await getStsToken();
    if (res.code === 0) {
      credentials = res.data;
    }
  }

  if (!credentials) {
    throw new Error("Get STS token failed");
  }

  const client = new OSS({
    bucket: "libra-english",
    region: "oss-cn-beijing",
    accessKeyId: credentials.AccessKeyId,
    accessKeySecret: credentials.AccessKeySecret,
    stsToken: credentials.SecurityToken,
  });
  return client;
}

export function isCredentialsExpired(credentials: Credentials | null): boolean {
  if (!credentials) {
    return true;
  }
  const expireDate = new Date(credentials.Expiration);
  const now = new Date();
  return expireDate.getTime() - now.getTime() <= 60000;
}

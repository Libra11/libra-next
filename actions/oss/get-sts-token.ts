/*
 * @Author: Libra
 * @Date: 2024-07-23 10:03:41
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { STS } from "ali-oss";

export const getStsToken = async () => {
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_SECRET;
  if (!accessKeyId || !accessKeySecret) {
    return {
      code: code.CONFIG_NOT_EXIST,
      message:
        "请配置环境变量ALIBABA_CLOUD_ACCESS_KEY_ID和ALIBABA_CLOUD_ACCESS_SECRET",
      data: null,
    };
  }
  const sts = new STS({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
  });
  return sts
    .assumeRole(
      "acs:ram::1297456591392749:role/ramoss",
      "",
      3000,
      "sessiontest"
    )
    .then((result) => {
      return {
        code: 0,
        message: "Get sts token success",
        data: {
          AccessKeyId: result.credentials.AccessKeyId,
          AccessKeySecret: result.credentials.AccessKeySecret,
          SecurityToken: result.credentials.SecurityToken,
          Expiration: result.credentials.Expiration,
        },
      };
    })
    .catch((err) => {
      return {
        code: code.SERVER_ERROR,
        message: "Get sts token failed",
        data: null,
      };
    });
};

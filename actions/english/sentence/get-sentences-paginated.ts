"use server";
import { code } from "@/common/code";
import { getSentencesPaginated } from "@/data/english";

export const getSentencesPaginatedApi = async (
  page: number = 1,
  pageSize: number = 20
) => {
  try {
    const result = await getSentencesPaginated(page, pageSize);
    if (result) {
      return {
        code: 0,
        message: "get sentences paginated success",
        data: result,
      };
    } else {
      throw new Error("get sentences paginated failed");
    }
  } catch (error) {
    console.error("get sentences paginated failed:", error);
    return {
      code: code.SERVER_ERROR,
      message: "get sentences paginated failed",
      data: null,
    };
  }
};

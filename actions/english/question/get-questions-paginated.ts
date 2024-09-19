/*
 * @Author: Libra
 * @Date: 2024-09-18 10:44:31
 * @LastEditors: Libra
 * @Description:
 */
/*
 * @Author: Libra
 * @Date: 2024-09-18 10:44:31
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { getEnglishQuestionsPaginated } from "@/data/english";

export const getEnglishQuestionsPaginatedApi = async (
  page: number = 1,
  pageSize: number = 20
) => {
  try {
    const result = await getEnglishQuestionsPaginated(page, pageSize);
    if (result) {
      return {
        code: 0,
        message: "get english questions paginated success",
        data: result,
      };
    } else {
      throw new Error("get english questions paginated failed");
    }
  } catch (error) {
    console.error("get english questions paginated failed:", error);
    return {
      code: code.SERVER_ERROR,
      message: "get english questions paginated failed",
      data: null,
    };
  }
};

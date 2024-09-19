/*
 * @Author: Libra
 * @Date: 2024-09-18 10:44:41
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { getInterviewQuestionsPaginated } from "@/data/interview";

export const getInterviewQuestionsPaginatedApi = async (
  page: number = 1,
  pageSize: number = 20,
  categoryId?: number
) => {
  try {
    const result = await getInterviewQuestionsPaginated(
      page,
      pageSize,
      categoryId
    );
    if (result) {
      return {
        code: 0,
        message: "get interview questions paginated success",
        data: result,
      };
    } else {
      throw new Error("get interview questions paginated failed");
    }
  } catch (error) {
    console.error("get interview questions paginated failed:", error);
    return {
      code: code.SERVER_ERROR,
      message: "get interview questions paginated failed",
      data: null,
    };
  }
};

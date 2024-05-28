/**
 * Author: Libra
 * Date: 2024-05-28 13:42:01
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./cardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../formSuccess";
import { FormError } from "../formError";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("No token found");
      return;
    }
    const res = await newVerification(token);
    if (!res) return;
    if (res.code === 0) {
      setSuccess(res.message);
    } else {
      setError(res.message);
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

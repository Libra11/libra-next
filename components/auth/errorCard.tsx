/**
 * Author: Libra
 * Date: 2024-05-27 13:53:31
 * LastEditors: Libra
 * Description:
 */
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./cardWrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className=" w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

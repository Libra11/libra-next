/**
 * Author: Libra
 * Date: 2024-05-28 10:47:02
 * LastEditors: Libra
 * Description:
 */
"use client";
import { sendMail } from "@/actions/email";
import { Button } from "./ui/button";

interface TestButtonProps {
  label: string;
}

const sendEmail = async () => {
  await sendMail();
};

export const TestButton = ({ label }: TestButtonProps) => {
  return (
    <Button variant="secondary" onClick={sendEmail}>
      {label}
    </Button>
  );
};

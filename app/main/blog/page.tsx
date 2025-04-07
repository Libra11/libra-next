/**
 * Author: Libra
 * Date: 2024-09-05 11:29:55
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";

const BlogPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {isLoading && <Loading size="large" />}
      <iframe
        className="w-full h-full"
        src="https://penlibra.xin"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </div>
  );
};

export default BlogPage;

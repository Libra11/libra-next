/**
 * Author: Libra
 * Date: 2024-09-18 14:51:55
 * LastEditors: Libra
 * Description:
 */
import React, { useEffect, useRef, useState, useCallback } from "react";

interface InfiniteScrollProps<T> {
  items: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  className?: string;
  isLoading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function InfiniteScroll<T>({
  items,
  loadMore,
  hasMore,
  isLoading,
  className = "flex flex-col gap-3 justify-start items-center",
  renderItem,
}: InfiniteScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(async () => {
    if (isFetching || !hasMore || isLoading || !containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // 检查用户是否滚动到接近底部
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setIsFetching(true);
      await loadMore(); // 加载更多数据
      setIsFetching(false);
    }
  }, [isFetching, hasMore, isLoading, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);

    // 清除事件监听器
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={`h-full p-4 overflow-auto w-full ${className}`}
    >
      {items.map(renderItem)}
      {hasMore && (
        <div className="h-20 mt-4 w-full flex justify-center items-center">
          {isLoading ? (
            <div className="flex justify-center items-center gap-[5px] w-[100px] h-[100px]">
              <span className="bg-[hsl(var(--primary))] rounded-full w-[6px] h-[23px] animate-grow"></span>
              <span className="bg-[hsl(var(--primary))] rounded-full w-[6px] h-[23px] animate-grow delay-150"></span>
              <span className="bg-[hsl(var(--primary))] rounded-full w-[6px] h-[23px] animate-grow delay-200"></span>
              <span className="bg-[hsl(var(--primary))] rounded-full w-[6px] h-[23px] animate-grow delay-300"></span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

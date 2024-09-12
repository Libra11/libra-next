/**
 * Author: Libra
 * Date: 2024-09-05 11:29:55
 * LastEditors: Libra
 * Description:
 */
const BlogPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full rounded-lg overflow-hidden">
      <iframe
        className="w-full h-full"
        src="http://penlibra.com/blog/home"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default BlogPage;

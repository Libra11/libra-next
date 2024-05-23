/**
 * Author: Libra
 * Date: 2024-05-22 16:24:05
 * LastEditors: Libra
 * Description:
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full items-center justify-center bg-sky-500">
      {children}
    </div>
  );
};

export default AuthLayout;

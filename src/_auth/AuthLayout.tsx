import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (typeof cookieFallback === "string" && cookieFallback !== "[]" && cookieFallback !== null && cookieFallback !== undefined) {
      navigate(-1);
    }

  }, []);

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      <img
        src="/assets/images/side-img.svg"
        alt="logo"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </>
  );
};

export default AuthLayout;

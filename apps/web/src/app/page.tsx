'use client';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LoginAdmin from '@/components/login/loginAdmin';
import LoginCashier from '@/components/login/loginCashier';
import { DialogStartShift } from '@/components/shift/dialogStartShift';
import { DialogEndShift } from '@/components/shift/dialogEndShift';

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const getRole = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}account/get-role`,
        {
          method: 'GET',
          headers: { Authorization: `${token}` },
        },
      );
      const data = await response.json();
      setRole(data.role);
    };
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    getRole();
  }, []);
  return (
    <div className="">
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Corner.
              <strong className="font-extrabold text-red-700 sm:block">
                Point Of Sales.
              </strong>
            </h1>
            <p className="mt-4 sm:text-xl/relaxed">
              Streamline Sales, Elevate Success.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {isAuth && role == 'cashier' ? (
                <>
                  <DialogStartShift />
                  <DialogEndShift />
                </>
              ) : (
                <>
                  {!isAuth && <LoginAdmin />}
                  {!isAuth && <LoginCashier />}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

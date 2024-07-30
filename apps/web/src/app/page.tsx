'use client'
import LoginAdmin from "@/components/login/loginAdmin"
import LoginCashier from "@/components/login/loginCashier"

export default function Home() {
  return (
    <div className="flex justify-center gap-5">
      <LoginAdmin/>
      <LoginCashier/>
    </div>
  )
}
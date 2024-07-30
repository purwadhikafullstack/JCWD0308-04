import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginCashier() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleLogin = async (e: React.FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}cashier/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email, password})
      })
      if(!response.ok){
        const errorData = await response.json()
        throw new Error(errorData.error || "Login Failed")
    }
    const {token} = await response.json()
    Cookies.set("token", token, {
        expires: 1,
        sameSite: 'Strict'
      })
      alert("Login Success")
      router.push('/orders')
    } catch (error) {
      console.error("Login error:", error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login as Cashier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login as Cashier</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="blabla@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>Log In</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

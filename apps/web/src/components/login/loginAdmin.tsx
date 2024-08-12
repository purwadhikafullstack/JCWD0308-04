'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useState } from "react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { UserContext } from "../context/UserContext"

export default function LoginAdmin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    // const { shiftId } = useContext(UserContext)
    
    const handleLogin = async (event: React.FormEvent) =>{
        event.preventDefault()
        setLoading(true)
        setError("")
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}admin/login`,{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            })
            if (response.ok) {
              const data = await response.json();
              const expires = new Date()

              expires.setHours(expires.getHours() + 6)
              Cookies.set("token", data.token, {
                  expires: expires,
                  sameSite: 'Strict'
              })
              
              router.push("/admin/productManagements")
              alert('Login Success')
              // setUser(data.adminId)
            } else {
              const errorData = await response.json()
              throw new Error(errorData.error || 'Login Failed')
            }
        } catch (error) {
          console.error('Login error', error)
        }
        setLoading(false)
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login as Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin</DialogTitle>
          <DialogDescription>
            Make changes to your Corner.
          </DialogDescription>
        </DialogHeader>
        <form  onSubmit={handleLogin} className="grid gap-4 py-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="blabla@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        {error && <p className="text-red-600">Invalid Email or Password</p>}
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            Log In
            </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


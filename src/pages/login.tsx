import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {Link, useNavigate} from "react-router"
import {Pen, X} from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/authprovider"

const loginSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string({
      message: "Please enter a password",
    }).min(8,{
      message:"invalid password"
    })
    })

export default function Register() {
  const {setUser,user,isLoading} = useAuth()
  
  const navigate = useNavigate()
  const [errorMessage,setErrorMessage] = useState<string | null>(null)
  const loginMutation = useMutation({
    mutationFn:async(data:z.infer<typeof loginSchema>) => {
      const response = await axios.post("http://localhost:3000/api/users/login",data,{
        withCredentials:true
      })
      return response.data   
    },
    onSuccess:(data) => {
      const {user} = data
      console.log(user);
      setUser(user)
      toast({
        title:"Connected successfuly",
        variant:"success"
      })
      navigate("/notes")
    },
    onError:(error:AxiosError) => {
      if(error.response?.status === 500 ){
        toast({
          title:"",
          description:"internal server error, please try later",
          variant:"error"
        })
      }
      if(error.response?.status === 401){
      setErrorMessage("invalid email or password")
    }
    }
  })
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values)
   if(loginMutation.isError){
    loginForm.reset({
      email:values.email,
      password:""
    })
   }
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    )
  }
  if(user){
    navigate("/notes")
    return null
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="flex flex-col items-center">
     
        <Link to="/" className='flex items-center'>
    <Pen className='-rotate-90 font-bold'/>
      <h1 className="text-xl font-semibold underline ">
        Holy<span className="bg-red-500 px-1 rounded-r-sm">Notes</span>
      </h1>
    </Link>
          <CardDescription className="text-center">
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
        {errorMessage && (
            <div className="mb-4 p-2 bg-red-500 text-white text-center rounded-md shadow-md flex flex-col">
              <X className="h-4 w-4 self-end mb-2 cursor-pointer" onClick={() => {
                setErrorMessage(null)
              }
              }/>
              <div>
              {errorMessage}
              </div>
            </div>
          )}
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full"
              disabled={loginMutation.isPending}
              >
               {loginMutation.isPending ? "Logged In...":"Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="mt-2 text-xs text-center text-gray-700">
            Dont have an account ?{" "}
            <Link to="/register" className="underline hover:text-blue-600">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


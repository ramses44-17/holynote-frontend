import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { Pen, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(60, {
        message: "Username must be at most 60 characters long",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(60, {
        message: "Password must be at most 60 characters long",
      }),
    confirmPassword: z.string({
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const {  isLoading,user } = useAuth();
  const navigate = useNavigate();
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const response = await axios.post(
        "https://localhost:3000/api/users/register",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setErrorMessage(null);
      toast({
        title: "Account created successfully",
        description:
          "You can now log in to your account, you will be redirected to the login page",
        variant: "success",
        duration: 3000,
      });
      navigate("/login");
    },
    onError: (error: AxiosError) => {
      // Vérification si l'erreur a une réponse (statut HTTP)
      if (error.response) {
        const status = error.response.status;
    
        // Erreur 422 : Données invalides
        if (status === 422) {
          setErrorMessage(
            "Invalid input. Please check your fields and try again."
          );
        } 
        // Erreur 409 : Utilisateur déjà existant
        else if (status === 409) {
          setErrorMessage(
            "User already exists. Please try with a different email or username."
          );
          toast({
            title: "User already exists",
            description: "Please try with a different email or username",
            variant: "error",
          });
        } 
        // Erreur 500 : Erreur interne du serveur
        else if (status === 500) {
          setErrorMessage("Internal server error. Please try again later.");
          toast({
            title: "Internal server error",
            description: "Please try again later",
            variant: "error",
          });
        } 
        // Autres erreurs HTTP (404, 403, etc.)
        else {
          setErrorMessage("An unknown error occurred. Please try again.");
          toast({
            title: "An unknown error occurred",
            description: "Please try again",
            variant: "error",
          });
        }
      } 
      // Si l'erreur n'a pas de réponse (problème de réseau ou erreur autre que le statut HTTP)
      else if (error.request) {
        setErrorMessage("Network error. Please check your internet connection.");
        toast({
          title: "Network error",
          description: "Please check your internet connection and try again.",
          variant: "error",
        });
      } 
      // Si l'erreur est liée à une autre cause (par exemple, une erreur de configuration ou de réponse d'API)
      else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        toast({
          title: "Unexpected error",
          description: "Something went wrong. Please try again.",
          variant: "error",
        });
      }
    },    
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
    registerForm.reset({
      password: "",
      confirmPassword: "",
    });
  }

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/notes");
    }
  }, []);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="flex flex-col items-center">
          <Link to="/" className="flex items-center">
            <Pen className="-rotate-90 font-bold" />
            <h1 className="text-xl font-semibold underline">
              Holy<span className="bg-red-500 px-1 rounded-r-sm">Notes</span>
            </h1>
          </Link>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500 text-white text-center rounded-md shadow-md flex flex-col">
              <X
                className="h-4 w-4 self-end mb-2 cursor-pointer"
                onClick={() => {
                  setErrorMessage(null);
                }}
              />
              <div>{errorMessage}</div>
            </div>
          )}

          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
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
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <p className="mt-2 text-xs text-center text-gray-700">
            Do you already have an account?{" "}
            <Link to="/login" className="underline hover:text-blue-600">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

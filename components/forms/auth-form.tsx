"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BRAND_NAME } from "@/lib/constants";
import { Icons } from "../icons";
import { useToast } from "../ui/use-toast";
import { AuthSchema } from "@/lib/schema";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

import { Label } from "../ui/label";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const searchParams = useSearchParams();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const callback = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  async function onSocial(provider: string) {
    try {
      setIsLoading(true);
      const res = await signIn(provider, {
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      if (res?.ok) {
        toast({
          title: `Success: Authenticated`,
          description: "Continue to home",
        });
        if (callback) {
          router.push(callback);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: `Error: Authentication Failed`,
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof AuthSchema>) {
    try {
      setIsLoading(true);
      if (variant === "LOGIN") {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        if (res?.error) throw new Error("Invalid credentials");
        if (res?.ok) {
          toast({
            title: `Success: Authenticated`,
            description: "Continue to home",
          });
          if (callback) {
            router.push(callback);
          } else {
            router.push("/");
          }
        }
      }
      if (variant === "REGISTER") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        toast({
          title: `Success: Account Created`,
          description: "Continue to login",
        });
        setVariant("LOGIN");
      }
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: `Error: Authentication Failed`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
          px-4
          py-8
          sm:px-10
        "
      >
        {error && (
          <div className="border-2 border-destructive p-1 my-4 rounded-sm bg-red-200 flex justify-between items-center">
            <Label className="text-destructive ">Error: {error}</Label>
            <button onClick={() => setError("")}>
              <Icons.x className="text-destructive" />
            </button>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {variant === "REGISTER" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button disabled={isLoading} className="w-full" type="submit">
                {variant === "LOGIN" ? "Login now" : "Create an account"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              disabled={isLoading}
              className="w-full"
              variant={"outline"}
              onClick={() => onSocial("google")}
            >
              <Icons.google className="w-4 h-4 mr-1" /> Google
            </Button>
            <Button
              disabled={isLoading}
              className="w-full"
              variant={"outline"}
              onClick={() => onSocial("github")}
            >
              <Icons.gitHub className="w-4 h-4 mr-1" /> Github
            </Button>
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? `New to ${BRAND_NAME}?`
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

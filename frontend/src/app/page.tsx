"use client";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APIURL, cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, Array<string>>>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData);

    try {
      const response = await fetch(APIURL('users/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        document.cookie = `token=${data.token}; expires=${new Date(Date.now() + data.expiresIn).toUTCString()}; path=/`;
        document.cookie = `username=${data.username}; expires=${new Date(Date.now() + data.expiresIn).toUTCString()}; path=/`;
        console.log(document.cookie);
        router.push('/home');
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} onChange={() => setErrors(undefined)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className={cn({
                          "border-red-500 text-red-500 focus-visible:ring-red-500": errors && "email" in errors
                        })}
                      />
                      <ul>
                        {errors?.email?.map((error, index) => (
                          <li key={index} className="text-red-500">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className={cn({
                          "border-red-500 text-red-500 focus-visible:ring-red-500": errors && "password" in errors
                        })}
                      />
                      <ul>
                        {errors?.password?.map((error, index) => (
                          <li key={index} className="text-red-500">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline text-primary">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

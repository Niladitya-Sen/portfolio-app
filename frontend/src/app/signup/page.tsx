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
import { useToast } from "@/hooks/use-toast";
import { APIURL, cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, Array<string>>>();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    function handleFormChange(e: React.ChangeEvent<HTMLFormElement>) {
        setErrors((prev) => ({ ...prev, [e.target.name]: [] }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const body = Object.fromEntries(formData);

        try {
            const response = await fetch(APIURL('users/signup'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                router.push("/");
            } else {
                setErrors(data.errors);
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Create a new account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} onChange={handleFormChange}>
                                <div className="grid gap-6">
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                                className={cn({
                                                    "border-red-500 text-red-500 focus-visible:ring-red-500": errors && errors?.name?.length > 0
                                                })}
                                            />
                                            <ul>
                                                {errors?.name?.map((error) => (
                                                    <li key={error} className="text-red-500">
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                className={cn({
                                                    "border-red-500 text-red-500 focus-visible:ring-red-500": errors && errors?.email?.length > 0
                                                })}
                                            />
                                            <ul>
                                                {errors?.email?.map((error) => (
                                                    <li key={error} className="text-sm text-red-500">
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
                                                    "border-red-500 text-red-500 focus-visible:ring-red-500": errors && errors?.password?.length > 0
                                                })}
                                            />
                                            <ul>
                                                {errors?.password?.map((error) => (
                                                    <li key={error} className="text-sm text-red-500">
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                            <Input
                                                id="confirm-password"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                className={cn({
                                                    "border-red-500 text-red-500 focus-visible:ring-red-500": errors && errors?.confirmPassword?.length > 0
                                                })}
                                            />
                                            <ul>
                                                {errors?.confirmPassword?.map((error) => (
                                                    <li key={error} className="text-sm text-red-500">
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading}>
                                            Signup
                                            <LoaderCircle className={cn("hidden ", {
                                                "animate-spin block": loading
                                            })} />
                                        </Button>
                                    </div>
                                    <div className="text-center text-sm">
                                        Already have an account?{" "}
                                        <Link href="/" className="underline text-primary">
                                            Log In
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

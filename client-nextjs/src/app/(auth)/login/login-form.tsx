"use client";

import { ModeToggle } from "@/components/mode-toggle";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { LoginBody, LoginBodyType } from "@/src/schemaValidations/auth.schema";

import { useToast } from "@/hooks/use-toast";

import authApiRequest from "@/src/apiRequests/auth";
import { useRouter } from "next/navigation";
// import { ClientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  // Thêm isLoading state để track trạng thái đang gọi API để tránh api bị gọi liên tục
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    // có nghĩa là loading = true thì nó ko chạy đoạn dưới
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.login(values);

      await authApiRequest.auth({
        sessionToken: result.payload.data.token,
        expiresAt: result.payload.data.expiresAt,
      });

      console.log("result login form", result);
      toast({
        description: result.payload.message,
      });
      // setSessionToken(result.payload.data.token);
      // ClientSessionToken.value = result.payload.data.token;
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.log("error", error);

      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log("Form submit errors:", error);
        })}
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="email" {...field} />
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
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8 w-full">
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}

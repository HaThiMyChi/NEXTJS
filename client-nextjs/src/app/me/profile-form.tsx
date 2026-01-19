"use client";

import React, { useState } from "react";

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

import { useToast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";
// import { ClientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import accountApiRequest from "@/src/apiRequests/account";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/src/schemaValidations/account.schema";

type Profile = AccountResType["data"];
export default function ProfileForm({ profile }: { profile: Profile }) {
  const { toast } = useToast();
  const router = useRouter();

  // Thêm isLoading state để track trạng thái đang gọi API để tránh api bị gọi liên tục
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateMeBodyType) {
    // có nghĩa là loading = true thì nó ko chạy đoạn dưới
    if (loading) return;
    setLoading(true);
    try {
      const result = await accountApiRequest.updateMe(values);

      console.log("result profile me", result);
      toast({
        description: result.payload.message,
      });
      router.refresh();
    } catch (error: any) {
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="email" // có thể không dùng form nếu chỉ readOnly, nhưng cần bọc để tránh lỗi
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  type="email"
                  value={profile.email}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8 w-full">
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}

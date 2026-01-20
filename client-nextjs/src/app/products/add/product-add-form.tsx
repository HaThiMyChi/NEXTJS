"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
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
import {
  CreateProductBody,
  CreateProductBodyType,
} from "@/src/schemaValidations/product.schema";
import productApiRequest from "@/src/apiRequests/product";
import { Textarea } from "@/components/ui/textarea";

export default function ProductAddForm() {
  const { toast } = useToast();
  const router = useRouter();

  // Thêm isLoading state để track trạng thái đang gọi API để tránh api bị gọi liên tục
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  // 1. Define your form.
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateProductBodyType) {
    console.log("values in onSubmit", values);
    // có nghĩa là loading = true thì nó ko chạy đoạn dưới
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file as Blob);
      const uploadImageResult = await productApiRequest.uploadImage(formData);
      const imageUrl = uploadImageResult.payload.data;

      //  Copy shallow tất cả properties từ object values
      // image: imageUrl - Lập tức override lại property image với giá trị mới từ server

      // values vẫn không thay đổi, vì:
      // 1. ...values tạo object mới
      // 2. image: imageUrl chỉ thay đổi trong object mới
      // 3. values gốc vẫn giữ nguyên
      const result = await productApiRequest.create({
        ...values,
        image: imageUrl,
      });

      toast({
        description: result.payload.message,
      });
      // setSessionToken(result.payload.data.token);
      // ClientSessionToken.value = result.payload.data.token;
      router.push("/products");
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

  const handleRemoveImage = () => {
    // Giải phóng URL object
    if (file) {
      URL.revokeObjectURL(file);
    }
    setFile(null);

    form.setValue("image", "");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log("Form submit errors:", error);
          console.log(form.getValues("image"));
        })}
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="tên" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input placeholder="giá" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      field.onChange("http://localhost:3000/" + file.name);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {file && (
          // Chuyen 1 file anh sang cu phap object url
          <div>
            <Image
              src={URL.createObjectURL(file)}
              width={128}
              height={128}
              alt="preview"
              className="w-32 h-32 object-cover"
            />
            <Button
              type="button"
              variant={"destructive"}
              size={"sm"}
              onClick={handleRemoveImage}
            >
              Xoá hình ảnh
            </Button>
          </div>
        )}

        <Button type="submit" className="!mt-8 w-full">
          Thêm sản phẩm
        </Button>
      </form>
    </Form>
  );
}

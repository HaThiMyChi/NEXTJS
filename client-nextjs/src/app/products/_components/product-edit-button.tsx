"use client";
import { Button } from "@/components/ui/button";
import { isClient } from "@/lib/http";
import DeleteProduct from "@/src/app/products/_components/delete-product";
import { ProductListResType } from "@/src/schemaValidations/product.schema";
import Link from "next/link";
import React from "react";

export default function ProductEditButton({
  product,
}: {
  product: ProductListResType["data"][0];
}) {
  const isAuthenticated =
    isClient() && Boolean(localStorage.getItem("sessionToken"));
  if (!isAuthenticated) return null;
  return (
    <div className="flex space-x-2">
      <Link href={`/products/${product.id}/edit`}>
        <Button variant={"outline"}>Edit</Button>
      </Link>

      <DeleteProduct product={product} />
    </div>
  );
}

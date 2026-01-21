import productApiRequest from "@/src/apiRequests/product";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function ProductListPage() {
  // lấy ra payload theo kiểu destructing

  const { payload } = await productApiRequest.getList();
  const productList = payload.data;
  return (
    <div className="space-y-3">
      <h1>Product List</h1>
      <div className="space-y-5">
        {productList.map((product) => (
          <div key={product.id} className="flex space-x-4">
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              className="w-32 h-32 object-cover"
            />

            <h3>{product.name}</h3>
            <div>{product.price}</div>
            <div className="flex space-x-2">
              <Button variant={"outline"}>Edit</Button>
              <Button variant={"destructive"}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

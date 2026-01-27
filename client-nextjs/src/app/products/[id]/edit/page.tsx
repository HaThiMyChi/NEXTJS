import productApiRequest from "@/src/apiRequests/product";
import ProductAddForm from "@/src/app/products/_components/product-add-form";
import Image from "next/image";
import React from "react";

import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

const getDetail = cache(productApiRequest.getDetail);

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// generateMetadata chỉ work ở server component
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const { payload } = await getDetail(Number(id));
  const product = payload.data;

  return {
    title: "Edit sản phẩm: " + product.name,
    description: product.description,
  };
}

// https://nextjs.org/docs/14/app/building-your-application/routing/dynamic-routes
// Doc them doc de hieu cach lay param
export default async function ProductEdit({ params }: Props) {
  let product = null;
  try {
    console.log("id", params);
    const { payload } = await getDetail(Number(params.id));
    product = payload.data;
    console.log("product edit", product);
  } catch (error) {
    console.log("error product edit", error);
  }

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {/* {product && (
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className="w-32 h-32 object-cover"
          />
          <h3>{product.name}</h3>
          <div>{product.price}</div>
        </div>
      )} */}
      <ProductAddForm product={product} />
    </div>
  );
}

import productApiRequest from "@/src/apiRequests/product";
import React from "react";

// https://nextjs.org/docs/14/app/building-your-application/routing/dynamic-routes
// Doc them doc de hieu cach lay param
export default async function ProductEdit({
  params,
}: {
  params: { id: string };
}) {
  let product = null;
  try {
    console.log("id", params);
    const { payload } = await productApiRequest.getDetail(Number(params.id));
    product = payload.data;
    console.log("product edit", product);
  } catch (error) {
    console.log("error product edit", error);
  }

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <div>{product.name}</div>}
    </div>
  );
}

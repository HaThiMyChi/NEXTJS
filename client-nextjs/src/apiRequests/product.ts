import http from "@/lib/http";
import { MessageResType } from "@/src/schemaValidations/common.schema";
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType,
} from "@/src/schemaValidations/product.schema";

export const productApiRequest = {
  getList: () =>
    http.get<ProductListResType>("/products", {
      cache: "no-store",
    }),
  // Tắt cache ở nơi fetch list/detail (force-dynamic / no-store) để refresh lại data mới đã update
  getDetail: (id: number) =>
    http.get<ProductResType>(`/products/${id}`, {
      cache: "no-store",
    }),
  // Lay chi tiet san pham khong can xac thuc (authentication)
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
  update: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`/products/${id}`, body),
  uploadImage: (body: FormData) =>
    http.post<{ message: string; data: string }>("/media/upload", body),

  delete: (id: number) => http.delete<MessageResType>(`/products/${id}`),
};

export default productApiRequest;

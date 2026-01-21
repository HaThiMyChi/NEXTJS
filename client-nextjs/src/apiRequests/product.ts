import http from "@/lib/http";
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
} from "@/src/schemaValidations/product.schema";

export const productApiRequest = {
  getList: () => http.get<ProductListResType>("/products"),
  getDetail: (id: number) => http.get<ProductResType>(`/products/${id}`), // Lay chi tiet san pham khong can xac thuc (authentication)
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>("/products", body),
  uploadImage: (body: FormData) =>
    http.post<{ message: string; data: string }>("/media/upload", body),
};

export default productApiRequest;

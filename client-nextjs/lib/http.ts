import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/src/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPlayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  };
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    // ngoài những message ra thì mình không biết có những field nào nữa nên mình để [key:string]: any
    [key: string]: any;
  };

  constructor({ status, payload }: { status: number; payload: any }) {
    super("HTTP Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPlayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPlayload;
  }) {
    super({ status, payload });
    if (status !== ENTITY_ERROR_STATUS) {
      throw new Error("Status must be 422 for EntityError");
    }
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();
  get value() {
    return this.token;
  }

  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set session token on server side");
    }
    this.token = token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set session token on server side");
    }
    this._expiresAt = expiresAt;
  }
}

// object này chỉ thực hiện ở client thôi
export const ClientSessionToken = new SessionToken();

let clientLogoutRequest: null | Promise<any> = null;
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined,
) => {
  const body = options?.body
    ? options?.body instanceof FormData
      ? options?.body
      : JSON.stringify(options.body)
    : undefined;
  // Chỉ set Content-Type nếu không phải FormData
  const baseHeaders = {
    ...(!(options?.body instanceof FormData) && {
      "Content-Type": "application/json",
    }),
    Authorization: ClientSessionToken.value
      ? `Bearer ${ClientSessionToken.value}`
      : "",
  };

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  // Interceptor là nơi chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPlayload;
        },
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            },
          });
          await clientLogoutRequest;
          ClientSessionToken.value = "";
          ClientSessionToken.expiresAt = new Date().toISOString();
          clientLogoutRequest = null;
          console.log("Đã đăng xuất");
          // location.href nó chuyển trang full reload nên ko thấy api logout
          location.href = "/login";
        }
      } else {
        const sessionToken = (options?.headers as any)?.Authorization.split(
          "Bearer ",
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url),
      )
    ) {
      ClientSessionToken.value = (payload as LoginResType).data.token;
      ClientSessionToken.expiresAt = (payload as LoginResType).data.expiresAt;
    } else if ("auth/logout" === normalizePath(url)) {
      ClientSessionToken.value = "";
      ClientSessionToken.expiresAt = new Date().toISOString();
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options);
  },

  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },

  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;

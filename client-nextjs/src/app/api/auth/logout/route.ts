import { HttpError } from "@/lib/http";
import authApiRequest from "@/src/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // lấy cái body
  const res = await request.json();
  console.log("res", res);
  const force = res.force as boolean | undefined;
  if (force) {
    return Response.json(
      {
        message: "Đăng xuất thành công",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0;`,
        },
      }
    );
  }
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      { status: 401 }
    );
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value
    );
    return Response.json(result.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0;`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Lỗi không xác định",
        },
        {
          status: 500,
        }
      );
    }
  }
}

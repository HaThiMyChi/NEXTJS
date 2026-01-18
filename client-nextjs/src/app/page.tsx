import ButtonRedirect from "@/src/app/components/ButtonRedirect";
import Link from "next/link";
import { redirect } from "next/navigation";

// redirect chỉ work trong server component thôi
const isAuth = false;

export default function Home() {
  if (!isAuth) {
    redirect("/login");
  }

  return (
    <main>
      <ul>
        <li>
          <Link href={"/login"}>Login</Link>
        </li>
        <li>
          <Link href={"/register"}>Register</Link>
        </li>
      </ul>
      {/* <ButtonRedirect /> */}
    </main>
  );
}

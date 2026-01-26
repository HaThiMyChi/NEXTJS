import ButtonRedirect from "@/src/app/components/ButtonRedirect";
import Link from "next/link";
import { redirect } from "next/navigation";

// redirect chỉ work trong server component thôi
const isAuth = false;

export default function Home() {
  // if (!isAuth) {
  //   redirect("/login");
  // }

  return <main>Xin chào</main>;
}

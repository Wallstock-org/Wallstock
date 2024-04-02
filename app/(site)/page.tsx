import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex justify-center items-center flex-col">
        <p>{session?.user?.email}</p>
        <p>{session?.user?.name}</p>
        <h1>Jai Shree Ram</h1>
      </div>
      <div>
        <Link
          href={"/auth/logout"}
          className={cn(
            buttonVariants({
              variant: "destructive",
            })
          )}
        >
          Logout
        </Link>
      </div>
    </main>
  );
}

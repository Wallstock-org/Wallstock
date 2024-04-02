"use client";
import AuthForm from "../forms/auth-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { usePathname, useRouter } from "next/navigation";

const AuthModal = () => {
  const router = useRouter();
  const pathName = usePathname();

  const handleOnOpenChange = (open: boolean) => {
    router.push("/");
  };

  return (
    <Dialog open={pathName === "/auth"} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Authenticate Now</DialogTitle>
          <DialogDescription>
            <AuthForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

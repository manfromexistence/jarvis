"use client";
import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import { QuickCustomizer } from "@/components/customizer/quick-customizer";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/server/users";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {

  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 p-4">
      <div>
        Hello Worfld!
        {JSON.stringify(authClient.getSession().then(res => res))}
        {/* {} */}
      </div>
      <Button onClick={async () => {
        await authClient.signIn.anonymous()
      }}>
        SignIn Annoymously
      </Button>
      <Button onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              console.log("SignOut Successfully")
              toast.info("sign out");
            },
          },
        });
      }}>
        SignOut
      </Button>

      {/* <Button onClick={signUp}>SignUp</Button> */}
      <SignUp />
      {/* <SignIn /> */}

      {/* <span>Hello, guys.</span> */}
      {/* <QuickCustomizer /> */}
    </div>
  );
}

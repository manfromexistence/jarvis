"use client";
import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import { QuickCustomizer } from "@/components/customizer/quick-customizer";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/server/users";
import { authClient } from "@/lib/auth-client";

export default function Page() {

  // const { data: session, isPending } = authClient.useSession();

  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 p-4">
      {/* <div>
        {JSON.stringify(session)}
      </div> */}
      <Button onClick={() => { authClient.signIn.anonymous() }}>SignIn</Button>
      {/* <Button onClick={signUp}>SignUp</Button> */}
      <SignUp />
      <SignIn />

      {/* <span>Hello, guys.</span> */}
      {/* <QuickCustomizer /> */}
    </div>
  );
}

import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import { QuickCustomizer } from "@/components/customizer/quick-customizer";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/server/users";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 p-4">
      <Button onClick={signIn}>SignIn</Button>
      <Button onClick={signUp}>SignUp</Button>
      <SignIn />
      <SignUp />

      {/* <span>Hello, guys.</span> */}
      {/* <QuickCustomizer /> */}
    </div>
  );
}

import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import { QuickCustomizer } from "@/components/customizer/quick-customizer";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 p-4">
      {/* <span>Hello, guys.</span> */}
      <SignIn />
      <SignUp />
      {/* <QuickCustomizer /> */}
    </div>
  );
}

import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import { QuickCustomizer } from "@/components/customizer/quick-customizer";

export default function Page() {
  return (
    <div className="h-screen w-full p-4">
      <span>Hello</span>
      <SignIn />
      <SignUp />
      {/* <QuickCustomizer /> */}
    </div>
  );
}

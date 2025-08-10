import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-black text-white">
      <SignUp
        appearance={{ elements: { card: "bg-white/5 border border-white/10" } }}
        signInUrl="/sign-in"
        afterSignUpUrl="/sync-user"
        redirectUrl="/sync-user"
      />
    </div>
  );
}

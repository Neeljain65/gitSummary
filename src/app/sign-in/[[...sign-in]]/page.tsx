import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-black text-white">
      <SignIn
        appearance={{ elements: { card: "bg-white/5 border border-white/10" } }}
        signUpUrl="/sign-up"
        afterSignInUrl="/sync-user"
        redirectUrl="/sync-user"
      />
    </div>
  );
}

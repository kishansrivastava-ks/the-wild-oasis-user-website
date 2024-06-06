import { signInAction } from "../_lib/actions";

function SignInButton() {
  return (
    // we have used a form here to perform the signin because since this btn is a server component we cannot have onClick here(no interactivity) so we used server actions -> like created a form an its action is to perfom the signin

    <form action={signInAction}>
      <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;

// this is a global loader and will apply to any page in our website
import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return <Spinner />;
}

// this is applicable to the whole page. That is, if the page has 10 components and only one of them fetches data, the entire page would be replaced by the 'loading state...'

// this would also work for all the subroutes as well

// thats it

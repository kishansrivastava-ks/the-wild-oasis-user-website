import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const revalidate = 3600;
// the value of this revalidate helps implement the incremental static regeneration, that is the page would revalidate the cached data from time to time depending upon the value of this revalidate variable. Next js would automatically refetch the data after the specified mentioned milliseconds

export const metadata = {
  title: "Cabins",
};

export default async function Page({ searchParams }) {
  // the parameters from the url are accessible in the page component only as a prop
  // this is the way os sharing state between the client and the server

  const filter = searchParams?.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        {/* the key would help display the spinner when a new filter is chosen and the data is loading */}

        {/* fallback is the component that would be displayed while the Cabins list is being fetched. By this the spinner would be displayed only in place of the cabin list and not the entire page so that the components which are not dependent on the data fetching are displayed on the screen */}
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}

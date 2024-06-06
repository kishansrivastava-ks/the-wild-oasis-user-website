"use server";
import { revalidatePath } from "next/cache";
// every fn exported from this module is a server action

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
import { formatDate } from "date-fns";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!"); // we should not use try catch here in SAs, because the error will get caught by the closest error boundary

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const regex = /^[a-zA-Z0-9]{6,12}$/;
  if (!regex.test(nationalID)) throw new Error("Invalid national ID format");

  const updateData = (nationality, countryFlag, nationalID);
  console.log(updateData);

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile"); // this would clear and refetch the data under this URL, otherwise stale data would be used for sometime
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabin/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => bookingId);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking!");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservation");
}

export async function updateBooking(formData) {
  // 1. authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const bookingId = Number(formData.get("bookingId"));

  // 2. authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => bookingId);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking!");

  // 3. building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4. mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5. error handling
  if (error) throw new Error("Booking could not be updated");

  // 6.revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7. redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
  //   when the user successfully logs in, it redirects to the accounts page
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

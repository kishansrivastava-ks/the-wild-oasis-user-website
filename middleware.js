// import { NextResponse } from "next/server";
// this middleware fn by default would run before every route
// run it for a specific route otherwise it would go into an infinite loop

/*
export function middleware(request) {
  console.log(request);

  return NextResponse.redirect(new URL("/about", request.url));
}*/

import { auth } from "@/app/_lib/auth";
export const middleware = auth;

export const config = {
  matcher: ["/account"], // this is an array of all the routes in which this middleware should run
};

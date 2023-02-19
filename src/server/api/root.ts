import { seedRouter } from "./routers/seedRouter";
import { petHotelRouter } from "./routers/petHotelRouter";
import { freelancePetSitterRouter } from "./routers/freelancePetSitterRouter";
import { petOwnerRouter } from "./routers/petOwnerRouter";
import { userRouter } from "./routers/userRouter";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { petSitterRouter } from "./routers/petSitterRouter";
import { profilePictureRouter } from "./routers/profilePictureRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  petSitter: petSitterRouter,
  petOwner: petOwnerRouter,
  freelancePetSitter: freelancePetSitterRouter,
  petHotel: petHotelRouter,
  seed: seedRouter,
  file: profilePictureRouter,
  // Health check route, return 200 OK if server is up
  healthcheck: publicProcedure
    .meta({ description: "Health check route, return 200 OK if server is up" })
    .query(() => true),
});

// export type definition of API
export type AppRouter = typeof appRouter;

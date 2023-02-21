import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { userFields, petOwnerFields, petFields } from "../../../schema/schema";

export const petOwnerRouter = createTRPCRouter({
  //public procedure that get petOwner by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petOwner.findUnique({
        where: {
          userId: input.id,
        },
        include: {
          user: true,
          pet: true,
          review: true,
        },
      });
    }),

  //public procedure that get petOwner by name
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petOwner.findFirst({
        where: {
          user: {
            username: input.username,
          },
        },
        include: {
          user: true,
          pet: true,
          review: true,
        },
      });
    }),

  //public procedure that get petOwner by email
  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petOwner.findFirst({
        where: {
          user: { email: input.email },
        },
      });
    }),

  createDummy: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const code = input.code;
      return await ctx.prisma.petOwner.create({
        data: {
          user: {
            create: {
              username: "username" + code,
              email: "email" + code + "@gmail.com",
              password: "password" + code,
              createdAt: new Date(),
            },
          },

          firstName: "firstname" + code,
          lastName: "lastname" + code,
        },
        include: {
          user: true,
          pet: true,
          review: true,
        },
      });
    }),

  //update petOwner
  update: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        data: petOwnerFields.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.petOwner.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),

  //public procedure that create petOwner
  create: publicProcedure
    .input(
      z.object({
        user: userFields,
        petOwner: petOwnerFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.petOwner.create({
        data: {
          user: {
            create: {
              ...input.user,
              createdAt: new Date(),
            },
          },
          ...input.petOwner,
        },
        include: {
          user: true,
        },
      });
    }),
  //public procedure that create petOwner
  updatePetTypes: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const petOwner = await ctx.prisma.petOwner.findFirst({
        where: {
          userId: input.userId,
        },
        include: {
          pet: true, // Return all fields
        },
      });
      if (!petOwner) return "petOwnerId doens't exist";

      const pets = petOwner?.pet;
      if (!pets) return "Internal server error SHIT";

      const petTypes = new Set<string>();
      for (const pet of pets) {
        petTypes.add(pet.petType);
      }

      const update = await ctx.prisma.petOwner.update({
        where: {
          userId: input.userId,
        },
        data: {
          petTypes: Array.from(petTypes.values()),
        },
      });

      return "Updated pet types of this pet owner successfully!";
    }),
});

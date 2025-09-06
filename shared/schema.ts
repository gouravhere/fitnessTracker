import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dietaryPreference: text("dietary_preference").default("omnivore"), // "vegetarian", "non-vegetarian", "omnivore"
  dailyCalorieGoal: integer("daily_calorie_goal").default(2200),
  dailyProteinGoal: integer("daily_protein_goal").default(120),
  dailyCarbGoal: integer("daily_carb_goal").default(250),
  dailyFatGoal: integer("daily_fat_goal").default(75),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  type: text("type").notNull(), // "strength", "cardio", "flexibility", "sports"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id").notNull().references(() => workouts.id),
  name: text("name").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  weight: real("weight"), // in kg
  distance: real("distance"), // in km for cardio
  duration: integer("duration"), // in seconds for individual exercises
});

export const meals = pgTable("meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // "breakfast", "lunch", "dinner", "snack"
  date: timestamp("date").notNull(),
  totalCalories: integer("total_calories").default(0),
  totalProtein: real("total_protein").default(0),
  totalCarbs: real("total_carbs").default(0),
  totalFat: real("total_fat").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodItems = pgTable("food_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mealId: varchar("meal_id").notNull().references(() => meals.id),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(), // in grams
  caloriesPerGram: real("calories_per_gram").notNull(),
  proteinPerGram: real("protein_per_gram").default(0),
  carbsPerGram: real("carbs_per_gram").default(0),
  fatPerGram: real("fat_per_gram").default(0),
});

export const bodyMeasurements = pgTable("body_measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  weight: real("weight"), // in kg
  bodyFatPercentage: real("body_fat_percentage"),
  muscleMass: real("muscle_mass"), // in kg
  waist: real("waist"), // in cm
  chest: real("chest"), // in cm
  bicep: real("bicep"), // in cm
  thigh: real("thigh"), // in cm
  height: real("height"), // in cm
  createdAt: timestamp("created_at").defaultNow(),
});

export const waterIntake = pgTable("water_intake", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  amount: real("amount").notNull(), // in liters
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
  createdAt: true,
});

export const insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
});

export const insertBodyMeasurementSchema = createInsertSchema(bodyMeasurements).omit({
  id: true,
  createdAt: true,
});

export const insertWaterIntakeSchema = createInsertSchema(waterIntake).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;
export type FoodItem = typeof foodItems.$inferSelect;
export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type BodyMeasurement = typeof bodyMeasurements.$inferSelect;
export type InsertBodyMeasurement = z.infer<typeof insertBodyMeasurementSchema>;
export type WaterIntake = typeof waterIntake.$inferSelect;
export type InsertWaterIntake = z.infer<typeof insertWaterIntakeSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

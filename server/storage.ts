import { 
  type User, 
  type InsertUser, 
  type Workout, 
  type InsertWorkout,
  type Exercise,
  type InsertExercise,
  type Meal,
  type InsertMeal,
  type FoodItem,
  type InsertFoodItem,
  type BodyMeasurement,
  type InsertBodyMeasurement,
  type WaterIntake,
  type InsertWaterIntake
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Workout operations
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout | undefined>;
  deleteWorkout(id: string): Promise<boolean>;

  // Exercise operations
  getExercisesByWorkout(workoutId: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise | undefined>;
  deleteExercise(id: string): Promise<boolean>;

  // Meal operations
  getMeals(userId: string): Promise<Meal[]>;
  getMealsByDate(userId: string, date: Date): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: string, updates: Partial<Meal>): Promise<Meal | undefined>;
  deleteMeal(id: string): Promise<boolean>;

  // Food item operations
  getFoodItemsByMeal(mealId: string): Promise<FoodItem[]>;
  createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem | undefined>;
  deleteFoodItem(id: string): Promise<boolean>;

  // Body measurement operations
  getBodyMeasurements(userId: string): Promise<BodyMeasurement[]>;
  getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined>;
  createBodyMeasurement(measurement: InsertBodyMeasurement): Promise<BodyMeasurement>;
  updateBodyMeasurement(id: string, updates: Partial<BodyMeasurement>): Promise<BodyMeasurement | undefined>;
  deleteBodyMeasurement(id: string): Promise<boolean>;

  // Water intake operations
  getWaterIntake(userId: string, date: Date): Promise<WaterIntake[]>;
  createWaterIntake(intake: InsertWaterIntake): Promise<WaterIntake>;
  updateWaterIntake(id: string, updates: Partial<WaterIntake>): Promise<WaterIntake | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private meals: Map<string, Meal> = new Map();
  private foodItems: Map<string, FoodItem> = new Map();
  private bodyMeasurements: Map<string, BodyMeasurement> = new Map();
  private waterIntakes: Map<string, WaterIntake> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      dietaryPreference: insertUser.dietaryPreference || "omnivore",
      dailyCalorieGoal: insertUser.dailyCalorieGoal || 2200,
      dailyProteinGoal: insertUser.dailyProteinGoal || 120,
      dailyCarbGoal: insertUser.dailyCarbGoal || 250,
      dailyFatGoal: insertUser.dailyFatGoal || 75,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = {
      ...insertWorkout,
      id,
      duration: insertWorkout.duration || null,
      caloriesBurned: insertWorkout.caloriesBurned || null,
      notes: insertWorkout.notes || null,
      createdAt: new Date()
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) return undefined;
    
    const updatedWorkout = { ...workout, ...updates };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // Exercise operations
  async getExercisesByWorkout(workoutId: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.workoutId === workoutId);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = {
      ...insertExercise,
      id,
      sets: insertExercise.sets || null,
      reps: insertExercise.reps || null,
      weight: insertExercise.weight || null,
      distance: insertExercise.distance || null,
      duration: insertExercise.duration || null
    };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise | undefined> {
    const exercise = this.exercises.get(id);
    if (!exercise) return undefined;
    
    const updatedExercise = { ...exercise, ...updates };
    this.exercises.set(id, updatedExercise);
    return updatedExercise;
  }

  async deleteExercise(id: string): Promise<boolean> {
    return this.exercises.delete(id);
  }

  // Meal operations
  async getMeals(userId: string): Promise<Meal[]> {
    return Array.from(this.meals.values())
      .filter(meal => meal.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getMealsByDate(userId: string, date: Date): Promise<Meal[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return Array.from(this.meals.values())
      .filter(meal => 
        meal.userId === userId && 
        new Date(meal.date) >= targetDate && 
        new Date(meal.date) < nextDate
      );
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    return this.meals.get(id);
  }

  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = randomUUID();
    const meal: Meal = {
      ...insertMeal,
      id,
      totalCalories: insertMeal.totalCalories || 0,
      totalProtein: insertMeal.totalProtein || 0,
      totalCarbs: insertMeal.totalCarbs || 0,
      totalFat: insertMeal.totalFat || 0,
      createdAt: new Date()
    };
    this.meals.set(id, meal);
    return meal;
  }

  async updateMeal(id: string, updates: Partial<Meal>): Promise<Meal | undefined> {
    const meal = this.meals.get(id);
    if (!meal) return undefined;
    
    const updatedMeal = { ...meal, ...updates };
    this.meals.set(id, updatedMeal);
    return updatedMeal;
  }

  async deleteMeal(id: string): Promise<boolean> {
    return this.meals.delete(id);
  }

  // Food item operations
  async getFoodItemsByMeal(mealId: string): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values())
      .filter(item => item.mealId === mealId);
  }

  async createFoodItem(insertFoodItem: InsertFoodItem): Promise<FoodItem> {
    const id = randomUUID();
    const foodItem: FoodItem = {
      ...insertFoodItem,
      id,
      proteinPerGram: insertFoodItem.proteinPerGram || 0,
      carbsPerGram: insertFoodItem.carbsPerGram || 0,
      fatPerGram: insertFoodItem.fatPerGram || 0
    };
    this.foodItems.set(id, foodItem);
    return foodItem;
  }

  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem | undefined> {
    const foodItem = this.foodItems.get(id);
    if (!foodItem) return undefined;
    
    const updatedFoodItem = { ...foodItem, ...updates };
    this.foodItems.set(id, updatedFoodItem);
    return updatedFoodItem;
  }

  async deleteFoodItem(id: string): Promise<boolean> {
    return this.foodItems.delete(id);
  }

  // Body measurement operations
  async getBodyMeasurements(userId: string): Promise<BodyMeasurement[]> {
    return Array.from(this.bodyMeasurements.values())
      .filter(measurement => measurement.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined> {
    const measurements = await this.getBodyMeasurements(userId);
    return measurements[0];
  }

  async createBodyMeasurement(insertMeasurement: InsertBodyMeasurement): Promise<BodyMeasurement> {
    const id = randomUUID();
    const measurement: BodyMeasurement = {
      ...insertMeasurement,
      id,
      weight: insertMeasurement.weight || null,
      bodyFatPercentage: insertMeasurement.bodyFatPercentage || null,
      muscleMass: insertMeasurement.muscleMass || null,
      waist: insertMeasurement.waist || null,
      chest: insertMeasurement.chest || null,
      bicep: insertMeasurement.bicep || null,
      thigh: insertMeasurement.thigh || null,
      height: insertMeasurement.height || null,
      createdAt: new Date()
    };
    this.bodyMeasurements.set(id, measurement);
    return measurement;
  }

  async updateBodyMeasurement(id: string, updates: Partial<BodyMeasurement>): Promise<BodyMeasurement | undefined> {
    const measurement = this.bodyMeasurements.get(id);
    if (!measurement) return undefined;
    
    const updatedMeasurement = { ...measurement, ...updates };
    this.bodyMeasurements.set(id, updatedMeasurement);
    return updatedMeasurement;
  }

  async deleteBodyMeasurement(id: string): Promise<boolean> {
    return this.bodyMeasurements.delete(id);
  }

  // Water intake operations
  async getWaterIntake(userId: string, date: Date): Promise<WaterIntake[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return Array.from(this.waterIntakes.values())
      .filter(intake => 
        intake.userId === userId && 
        new Date(intake.date) >= targetDate && 
        new Date(intake.date) < nextDate
      );
  }

  async createWaterIntake(insertIntake: InsertWaterIntake): Promise<WaterIntake> {
    const id = randomUUID();
    const intake: WaterIntake = {
      ...insertIntake,
      id,
      createdAt: new Date()
    };
    this.waterIntakes.set(id, intake);
    return intake;
  }

  async updateWaterIntake(id: string, updates: Partial<WaterIntake>): Promise<WaterIntake | undefined> {
    const intake = this.waterIntakes.get(id);
    if (!intake) return undefined;
    
    const updatedIntake = { ...intake, ...updates };
    this.waterIntakes.set(id, updatedIntake);
    return updatedIntake;
  }
}

export const storage = new MemStorage();

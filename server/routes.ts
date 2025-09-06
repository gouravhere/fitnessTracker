import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
  insertUserSchema, 
  loginSchema, 
  insertWorkoutSchema,
  insertExerciseSchema,
  insertMealSchema,
  insertFoodItemSchema,
  insertBodyMeasurementSchema,
  insertWaterIntakeSchema
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // User profile routes
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        dietaryPreference: user.dietaryPreference,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dailyProteinGoal: user.dailyProteinGoal,
        dailyCarbGoal: user.dailyCarbGoal,
        dailyFatGoal: user.dailyFatGoal
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        dietaryPreference: req.body.dietaryPreference,
        dailyCalorieGoal: req.body.dailyCalorieGoal,
        dailyProteinGoal: req.body.dailyProteinGoal,
        dailyCarbGoal: req.body.dailyCarbGoal,
        dailyFatGoal: req.body.dailyFatGoal,
      };

      const updatedUser = await storage.updateUser(req.userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        dietaryPreference: updatedUser.dietaryPreference,
        dailyCalorieGoal: updatedUser.dailyCalorieGoal,
        dailyProteinGoal: updatedUser.dailyProteinGoal,
        dailyCarbGoal: updatedUser.dailyCarbGoal,
        dailyFatGoal: updatedUser.dailyFatGoal
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Workout routes
  app.get("/api/workouts", authenticateToken, async (req: any, res) => {
    try {
      const workouts = await storage.getWorkouts(req.userId);
      
      // Get exercises for each workout
      const workoutsWithExercises = await Promise.all(
        workouts.map(async (workout) => {
          const exercises = await storage.getExercisesByWorkout(workout.id);
          return { ...workout, exercises };
        })
      );

      res.json(workoutsWithExercises);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post("/api/workouts", authenticateToken, async (req: any, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse({ ...req.body, userId: req.userId });
      const workout = await storage.createWorkout(workoutData);
      
      // Create exercises if provided
      if (req.body.exercises && Array.isArray(req.body.exercises)) {
        const exercises = await Promise.all(
          req.body.exercises.map((exerciseData: any) => 
            storage.createExercise(insertExerciseSchema.parse({ 
              ...exerciseData, 
              workoutId: workout.id 
            }))
          )
        );
        res.json({ ...workout, exercises });
      } else {
        res.json({ ...workout, exercises: [] });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.delete("/api/workouts/:id", authenticateToken, async (req: any, res) => {
    try {
      const workout = await storage.getWorkout(req.params.id);
      if (!workout || workout.userId !== req.userId) {
        return res.status(404).json({ message: 'Workout not found' });
      }

      // Delete associated exercises first
      const exercises = await storage.getExercisesByWorkout(workout.id);
      await Promise.all(exercises.map(exercise => storage.deleteExercise(exercise.id)));
      
      await storage.deleteWorkout(req.params.id);
      res.json({ message: 'Workout deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Meal routes
  app.get("/api/meals", authenticateToken, async (req: any, res) => {
    try {
      let meals;
      if (req.query.date) {
        const date = new Date(req.query.date as string);
        meals = await storage.getMealsByDate(req.userId, date);
      } else {
        meals = await storage.getMeals(req.userId);
      }

      // Get food items for each meal
      const mealsWithFoods = await Promise.all(
        meals.map(async (meal) => {
          const foodItems = await storage.getFoodItemsByMeal(meal.id);
          return { ...meal, foodItems };
        })
      );

      res.json(mealsWithFoods);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post("/api/meals", authenticateToken, async (req: any, res) => {
    try {
      const mealData = insertMealSchema.parse({ ...req.body, userId: req.userId });
      const meal = await storage.createMeal(mealData);
      
      // Create food items if provided
      if (req.body.foodItems && Array.isArray(req.body.foodItems)) {
        const foodItems = await Promise.all(
          req.body.foodItems.map((foodData: any) => 
            storage.createFoodItem(insertFoodItemSchema.parse({ 
              ...foodData, 
              mealId: meal.id 
            }))
          )
        );

        // Calculate totals
        const totalCalories = foodItems.reduce((sum, item) => sum + (item.quantity * item.caloriesPerGram), 0);
        const totalProtein = foodItems.reduce((sum, item) => sum + (item.quantity * (item.proteinPerGram || 0)), 0);
        const totalCarbs = foodItems.reduce((sum, item) => sum + (item.quantity * (item.carbsPerGram || 0)), 0);
        const totalFat = foodItems.reduce((sum, item) => sum + (item.quantity * (item.fatPerGram || 0)), 0);

        // Update meal with totals
        const updatedMeal = await storage.updateMeal(meal.id, {
          totalCalories: Math.round(totalCalories),
          totalProtein: Math.round(totalProtein * 10) / 10,
          totalCarbs: Math.round(totalCarbs * 10) / 10,
          totalFat: Math.round(totalFat * 10) / 10,
        });

        res.json({ ...updatedMeal, foodItems });
      } else {
        res.json({ ...meal, foodItems: [] });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Body measurements routes
  app.get("/api/measurements", authenticateToken, async (req: any, res) => {
    try {
      const measurements = await storage.getBodyMeasurements(req.userId);
      res.json(measurements);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post("/api/measurements", authenticateToken, async (req: any, res) => {
    try {
      const measurementData = insertBodyMeasurementSchema.parse({ ...req.body, userId: req.userId });
      const measurement = await storage.createBodyMeasurement(measurementData);
      res.json(measurement);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Water intake routes
  app.get("/api/water", authenticateToken, async (req: any, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const intakes = await storage.getWaterIntake(req.userId, date);
      res.json(intakes);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post("/api/water", authenticateToken, async (req: any, res) => {
    try {
      const intakeData = insertWaterIntakeSchema.parse({ ...req.body, userId: req.userId });
      const intake = await storage.createWaterIntake(intakeData);
      res.json(intake);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", authenticateToken, async (req: any, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get today's meals
      const todayMeals = await storage.getMealsByDate(req.userId, today);
      const todayCalories = todayMeals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
      const todayProtein = todayMeals.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0);
      const todayCarbs = todayMeals.reduce((sum, meal) => sum + (meal.totalCarbs || 0), 0);
      const todayFat = todayMeals.reduce((sum, meal) => sum + (meal.totalFat || 0), 0);

      // Get today's water intake
      const todayWater = await storage.getWaterIntake(req.userId, today);
      const totalWater = todayWater.reduce((sum, intake) => sum + intake.amount, 0);

      // Get recent workouts
      const recentWorkouts = await storage.getWorkouts(req.userId);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyWorkouts = recentWorkouts.filter(w => new Date(w.date) >= weekAgo);

      // Get latest body measurement
      const latestMeasurement = await storage.getLatestBodyMeasurement(req.userId);

      // Get user goals
      const user = await storage.getUser(req.userId);

      res.json({
        todayCalories,
        todayProtein: Math.round(todayProtein * 10) / 10,
        todayCarbs: Math.round(todayCarbs * 10) / 10,
        todayFat: Math.round(todayFat * 10) / 10,
        todayWater: Math.round(totalWater * 10) / 10,
        weeklyWorkouts: weeklyWorkouts.length,
        totalWorkouts: recentWorkouts.length,
        currentWeight: latestMeasurement?.weight,
        goals: {
          calories: user?.dailyCalorieGoal || 2200,
          protein: user?.dailyProteinGoal || 120,
          carbs: user?.dailyCarbGoal || 250,
          fat: user?.dailyFatGoal || 75,
        },
        recentWorkouts: recentWorkouts.slice(0, 3)
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

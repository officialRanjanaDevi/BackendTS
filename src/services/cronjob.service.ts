import cron from "node-cron";
import { db } from "../config/database.config";

import { CategoryService } from "./category.service";
/**
 * *A service class that handles running a cron job daily at midnight.
 */
export class CronJobService {
  /**
   * Runs a cron job that executes a set of tasks daily at midnight.
   * The tasks include fetching category hierarchy data and storing it in the database,
   * as well as fetching featured categories data and storing it in the database.
   * @returns None
   */
  async cronJob() {
    // Runs a cron job that executes a set of tasks daily at midnight
    cron.schedule("0 0 * * *", async () => {
      console.log("Cron job is running daily at midnight");
      try {
        // Fetch category hierarchy data from the database
        const dashboardcategoryData = await new CategoryService().getCategoriesHierarchy();
        // console.log(categoryData)
        // Store the category hierarchy data in the redis database
        await db.set("dashboardCategories", JSON.stringify(dashboardcategoryData));

        // Fetch featured categories data from the database
        const featuredCategoriesData = await new CategoryService().getAllMarkedFeaturedCategories();
        // Store the featured categories data in the redis database
        await db.set("featuredCategories", JSON.stringify(featuredCategoriesData));
      } catch (err) {
        // Handle any error that occurs during the cron job
        console.error(err);
      }
    });

    cron.schedule("*/14 * * * *", async () => {
      console.log("Cron job is running every 14 minutes");

      fetch("https://trialshopy-backend-rk8d.onrender.com/api/v1/health")
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.error(err));
    });
  }
}

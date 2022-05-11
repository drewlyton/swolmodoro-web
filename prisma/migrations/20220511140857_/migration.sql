-- CreateEnum
CREATE TYPE "EXERCISE_GROUPS" AS ENUM ('chest', 'back', 'legs');

-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "exerciseGroup" "EXERCISE_GROUPS" NOT NULL DEFAULT E'legs';

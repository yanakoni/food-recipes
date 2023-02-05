/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recipe_source" TEXT,
    "instructions" TEXT,
    "youtube_link" TEXT,
    "meal_thumb" TEXT,
    "category_name" TEXT NOT NULL,
    "area_name" TEXT NOT NULL,

    CONSTRAINT "meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_measure" (
    "id" SERIAL NOT NULL,
    "igredient_name" TEXT NOT NULL,
    "meal_id" INTEGER NOT NULL,
    "measure" TEXT NOT NULL,

    CONSTRAINT "ingredient_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient" (
    "name" TEXT NOT NULL,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "area" (
    "name" TEXT NOT NULL,

    CONSTRAINT "area_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "category" (
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "tag" (
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "meal_tag_association" (
    "meal_id" INTEGER NOT NULL,
    "tag_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "meal_tag_association_meal_id_tag_name_key" ON "meal_tag_association"("meal_id", "tag_name");

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_category_name_fkey" FOREIGN KEY ("category_name") REFERENCES "category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_area_name_fkey" FOREIGN KEY ("area_name") REFERENCES "area"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_measure" ADD CONSTRAINT "ingredient_measure_igredient_name_fkey" FOREIGN KEY ("igredient_name") REFERENCES "ingredient"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_measure" ADD CONSTRAINT "ingredient_measure_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_tag_association" ADD CONSTRAINT "meal_tag_association_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_tag_association" ADD CONSTRAINT "meal_tag_association_tag_name_fkey" FOREIGN KEY ("tag_name") REFERENCES "tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

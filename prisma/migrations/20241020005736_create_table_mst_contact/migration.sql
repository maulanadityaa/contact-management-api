/*
  Warnings:

  - You are about to drop the column `email` on the `mst_user` table. All the data in the column will be lost.
  - Added the required column `name` to the `mst_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "mst_user_email_key";

-- AlterTable
ALTER TABLE "mst_user" DROP COLUMN "email",
ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "mst_contact" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,

    CONSTRAINT "mst_contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mst_contact" ADD CONSTRAINT "mst_contact_username_fkey" FOREIGN KEY ("username") REFERENCES "mst_user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

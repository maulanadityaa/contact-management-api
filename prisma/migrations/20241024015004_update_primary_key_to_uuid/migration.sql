/*
  Warnings:

  - The primary key for the `mst_address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mst_contact` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "mst_address" DROP CONSTRAINT "mst_address_contact_id_fkey";

-- AlterTable
ALTER TABLE "mst_address" DROP CONSTRAINT "mst_address_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contact_id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "mst_address_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "mst_address_id_seq";

-- AlterTable
ALTER TABLE "mst_contact" DROP CONSTRAINT "mst_contact_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "mst_contact_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "mst_contact_id_seq";

-- AddForeignKey
ALTER TABLE "mst_address" ADD CONSTRAINT "mst_address_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "mst_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "mst_address" (
    "id" SERIAL NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "province" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(255) NOT NULL,
    "contact_id" INTEGER NOT NULL,

    CONSTRAINT "mst_address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mst_address" ADD CONSTRAINT "mst_address_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "mst_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

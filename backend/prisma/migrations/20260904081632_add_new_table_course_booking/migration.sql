-- CreateTable
CREATE TABLE "course_bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "course_bookings" ADD CONSTRAINT "course_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_bookings" ADD CONSTRAINT "course_bookings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

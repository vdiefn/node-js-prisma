-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT '尚未開始',
    "description" VARCHAR(255) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "max_participants" INTEGER NOT NULL DEFAULT 15,
    "meetingUrl" VARCHAR(255) NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

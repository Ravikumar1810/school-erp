CREATE TYPE "public"."exam_type" AS ENUM('UNIT_TEST', 'MID_TERM', 'FINAL', 'ASSIGNMENT');--> statement-breakpoint
CREATE TABLE "marks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"subject" varchar(100) NOT NULL,
	"exam_type" "exam_type" NOT NULL,
	"marks_obtained" integer NOT NULL,
	"maximum_marks" integer NOT NULL,
	"added_by" uuid NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "marks" ADD CONSTRAINT "marks_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marks" ADD CONSTRAINT "marks_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "marks_student_subject_exam_unique" ON "marks" USING btree ("student_id","subject","exam_type");
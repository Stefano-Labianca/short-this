CREATE TABLE IF NOT EXISTS "link" (
	"short_link" char(32) PRIMARY KEY NOT NULL,
	"full_link" char(256) NOT NULL,
	"created_at" date NOT NULL,
	"user" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link" ADD CONSTRAINT "link_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

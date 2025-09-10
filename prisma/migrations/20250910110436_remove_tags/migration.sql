/*
  Warnings:

  - You are about to drop the column `tags` on the `posts` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_posts" ("content", "createdAt", "excerpt", "id", "published", "slug", "title", "updatedAt", "viewCount") SELECT "content", "createdAt", "excerpt", "id", "published", "slug", "title", "updatedAt", "viewCount" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

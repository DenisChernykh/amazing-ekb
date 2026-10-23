-- Re-imports may reuse an image only for the same Telegram post.
-- The trigger runs inside the import batch, so concurrent imports are safe too.
CREATE TRIGGER Image_path_owner_guard
BEFORE INSERT ON Image
WHEN EXISTS (
  SELECT 1 FROM Image WHERE path = NEW.path
  AND telegramPostId IS NOT NEW.telegramPostId
)
BEGIN
  SELECT RAISE(ABORT, 'IMAGE_PATH_CONFLICT');
END;

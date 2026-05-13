ALTER TABLE training_jobs
DROP COLUMN IF EXISTS current_epoch,
DROP COLUMN IF EXISTS epochs,
DROP COLUMN IF EXISTS dataset_version_id;

ALTER TABLE training_jobs
ADD COLUMN dataset_version_id UUID REFERENCES dataset_versions(id),
ADD COLUMN epochs INTEGER NOT NULL DEFAULT 5,
ADD COLUMN current_epoch INTEGER NOT NULL DEFAULT 0;

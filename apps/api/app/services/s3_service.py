import os
from pathlib import Path
import boto3
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_REGION", "ap-south-1")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "aetheris-production-bucket")

class S3Service:
    def __init__(self):
        if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_REGION,
            )
        else:
            # Fallback to default credentials provider chain if running in AWS
            self.s3_client = boto3.client("s3", region_name=AWS_REGION)
        self.bucket = S3_BUCKET_NAME

    def upload_file(self, file_path: str | Path, s3_key: str) -> bool:
        """Upload a file to an S3 bucket"""
        try:
            self.s3_client.upload_file(str(file_path), self.bucket, s3_key)
            return True
        except ClientError as e:
            logger.error(f"Failed to upload to S3: {e}")
            return False

    def download_file(self, s3_key: str, local_path: str | Path) -> bool:
        """Download a file from an S3 bucket"""
        try:
            # Create parent directories if they don't exist
            Path(local_path).parent.mkdir(parents=True, exist_ok=True)
            self.s3_client.download_file(self.bucket, s3_key, str(local_path))
            return True
        except ClientError as e:
            logger.error(f"Failed to download from S3: {e}")
            return False

    def generate_presigned_url(self, s3_key: str, expiration: int = 3600) -> str | None:
        """Generate a presigned URL to share an S3 object"""
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': s3_key},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            return None

s3_service = S3Service()

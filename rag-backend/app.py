"""
Hugging Face Spaces entry point for RAG Backend.
This file is used when deploying to Hugging Face Spaces.
"""
import os
import uvicorn
from app.main import app

if __name__ == "__main__":
    # Hugging Face Spaces provides PORT environment variable (defaults to 7860)
    port = int(os.getenv("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)


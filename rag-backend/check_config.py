"""
Quick script to check RAG backend configuration.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(env_path)
    print("✅ .env file found and loaded")
else:
    print("⚠️  .env file not found")

# Check API keys
gemini_key = os.getenv("GEMINI_API_KEY")
openai_key = os.getenv("OPENAI_API_KEY")
llm_provider = os.getenv("LLM_PROVIDER", "gemini")

print(f"\n📋 Configuration Status:")
print(f"   LLM Provider: {llm_provider}")

if llm_provider == "gemini":
    if gemini_key and gemini_key != "your_gemini_api_key_here":
        print(f"   ✅ Gemini API Key: Set ({gemini_key[:10]}...)")
    else:
        print(f"   ❌ Gemini API Key: NOT SET")
        print(f"      → Add GEMINI_API_KEY=your_key to .env file")
        print(f"      → Get key from: https://aistudio.google.com/app/apikey")
elif llm_provider == "openai":
    if openai_key and openai_key != "your_openai_api_key_here":
        print(f"   ✅ OpenAI API Key: Set ({openai_key[:10]}...)")
    else:
        print(f"   ❌ OpenAI API Key: NOT SET")

# Check other important settings
print(f"\n⚙️  Other Settings:")
print(f"   CHUNK_SIZE: {os.getenv('CHUNK_SIZE', '500')}")
print(f"   TOP_K: {os.getenv('TOP_K', '6')}")
print(f"   SIMILARITY_THRESHOLD: {os.getenv('SIMILARITY_THRESHOLD', '0.35')}")

print(f"\n💡 Next Steps:")
if not gemini_key or gemini_key == "your_gemini_api_key_here":
    print("   1. Get Gemini API key from: https://aistudio.google.com/app/apikey")
    print("   2. Add to .env file: GEMINI_API_KEY=your_actual_key")
    print("   3. Restart the server")
else:
    print("   ✅ Configuration looks good!")
    print("   → Test with: python test_rag.py")




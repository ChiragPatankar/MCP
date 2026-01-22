# 🔄 Migration Guide: Adding tenant_id to Existing Data

## Overview
After applying the security fixes, all existing data in the vector store needs `tenant_id` added to metadata.

## Option 1: Manual Migration (Recommended for Small Datasets)

### Step 1: Export Current Data
```python
# Run this script to export all chunks
from app.rag.vectorstore import get_vector_store

vector_store = get_vector_store()
all_data = vector_store.collection.get(include=["documents", "metadatas"])

# Save to JSON for backup
import json
with open("backup_chunks.json", "w") as f:
    json.dump({
        "ids": all_data["ids"],
        "documents": all_data["documents"],
        "metadatas": all_data["metadatas"]
    }, f)
```

### Step 2: Add tenant_id to Metadata
```python
# For each chunk, determine tenant_id based on user_id or kb_id
# This depends on your business logic

for i, metadata in enumerate(all_data["metadatas"]):
    # Determine tenant_id (example: extract from user_id or kb_id)
    user_id = metadata.get("user_id", "")
    kb_id = metadata.get("kb_id", "")
    
    # YOUR LOGIC HERE: Map user_id/kb_id to tenant_id
    tenant_id = determine_tenant_id(user_id, kb_id)  # Implement this
    
    metadata["tenant_id"] = tenant_id
```

### Step 3: Re-import with tenant_id
```python
# Delete old collection
vector_store.clear_collection()

# Re-add with tenant_id
vector_store.add_documents(
    documents=all_data["documents"],
    embeddings=[...],  # Re-generate or store separately
    metadatas=all_data["metadatas"],  # Now includes tenant_id
    ids=all_data["ids"]
)
```

## Option 2: Gradual Migration (For Large Datasets)

1. Keep old data accessible temporarily
2. New uploads include tenant_id
3. Migrate old data in batches
4. Verify no data loss
5. Remove old data

## Option 3: Fresh Start (If Data is Test/Dev)

Simply clear the collection and re-upload all documents with tenant_id:

```python
from app.rag.vectorstore import get_vector_store
vector_store = get_vector_store()
vector_store.clear_collection()
```

Then re-upload all documents through the API with tenant_id.

## Verification Script

```python
# Verify all chunks have tenant_id
from app.rag.vectorstore import get_vector_store

vector_store = get_vector_store()
all_data = vector_store.collection.get(include=["metadatas"])

missing_tenant = []
for i, metadata in enumerate(all_data["metadatas"]):
    if "tenant_id" not in metadata:
        missing_tenant.append(all_data["ids"][i])

if missing_tenant:
    print(f"⚠️  {len(missing_tenant)} chunks missing tenant_id")
else:
    print("✅ All chunks have tenant_id")
```




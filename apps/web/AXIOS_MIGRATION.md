## Axios Migration Summary

### What Changed

**Before (fetch):**
```typescript
// Multiple fetch calls scattered, no centralized error handling
const response = await fetch(`${getBaseUrl()}/documents`);
if (!response.ok) throw new Error("Failed to fetch documents");
return response.json();
```

**After (axios + interceptors):**
```typescript
// Single centralized configuration with interceptors
const response = await axiosInstance.get<Document[]>("/documents");
return response.data;
```

---

### Files Created

1. **`src/lib/axios.ts`** - Axios instance with interceptors
   - Request interceptor (auth tokens, logging)
   - Response interceptor (error handling, status codes)
   - Timeout: 30 seconds
   - Base URL from environment variable

2. **`src/lib/api.ts`** - Updated to use axios
   - Same API surface as before
   - Cleaner error handling
   - Better TypeScript support

---

### Request Interceptor
```typescript
// Automatically adds:
- Authorization header (Bearer token from localStorage)
- Request logging to console
- Custom headers as needed
```

### Response Interceptor
**Handles these scenarios:**
- ✅ 401 Unauthorized → Redirects to /login, clears token
- ✅ 403 Forbidden → "Access denied"
- ✅ 404 Not Found → "Resource not found"
- ✅ 500 Server Error → "Server error, try again later"
- ✅ Timeout (30s) → "Request timeout, check connection"
- ✅ Network errors → Detailed error messages

---

### Benefits

| Feature | fetch | axios |
|---------|-------|-------|
| Centralized config | ❌ | ✅ |
| Interceptors | ❌ | ✅ |
| Error handling | Manual | Automatic |
| Auth tokens | Manual | Built-in |
| Timeout support | ❌ | ✅ (30s) |
| Logging | Manual | Automatic |
| TypeScript | Basic | Excellent |
| Code duplication | High | Low |

---

### Usage Example

```typescript
// No changes needed in components!
import { api } from "@/lib/api";

// These work exactly the same as before
const docs = await api.getDocuments();
await api.uploadPDF(file);
const response = await api.askQuestion(query);
```

---

### Error Handling Flow

```
API Call
  ↓
Request Interceptor (adds auth token)
  ↓
HTTP Request
  ↓
Response Interceptor
  ├─ 2xx → Return data
  ├─ 401 → Redirect to /login
  ├─ 403 → Error: "Access denied"
  ├─ 404 → Error: "Resource not found"
  ├─ 500 → Error: "Server error"
  └─ Network → Error: "Timeout/Connection"
  ↓
Component receives data or error
```

---

### Next Steps

Ready to add:
- 🔐 JWT token refresh logic in interceptors
- 📱 Request cancellation for rapid changes
- 📊 Request/response logging service
- 🎯 Advanced error recovery strategies

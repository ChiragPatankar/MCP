# 🔐 Security Checklist for Production Deployment

## Pre-Deployment Security Review

### ✅ Authentication & Authorization
- [ ] Implement JWT/OAuth authentication
- [ ] Verify tokens on every request
- [ ] Extract tenant_id from token (never trust client)
- [ ] Implement user ownership verification
- [ ] Add RBAC if needed (admin, user, viewer roles)

### ✅ Multi-Tenant Isolation
- [ ] All queries filter by tenant_id
- [ ] Verify tenant_id matches authenticated user's tenant
- [ ] Test cross-tenant access attempts (should fail)
- [ ] Consider per-tenant collections for stronger isolation
- [ ] Audit logs include tenant_id

### ✅ Input Validation
- [ ] File size limits enforced
- [ ] File type validation
- [ ] File content scanning (malware detection)
- [ ] Rate limiting per user/tenant
- [ ] Query length limits
- [ ] Input sanitization

### ✅ API Security
- [ ] CORS restricted to production domains
- [ ] HTTPS only (no HTTP)
- [ ] API key authentication
- [ ] Rate limiting
- [ ] Request timeout limits
- [ ] Error messages don't leak internal info

### ✅ Data Security
- [ ] Encrypt data at rest
- [ ] Encrypt data in transit (TLS)
- [ ] Secure API keys (env vars, secrets manager)
- [ ] Regular backups
- [ ] Access logs
- [ ] Data retention policies

### ✅ Monitoring & Alerting
- [ ] Monitor failed authentication attempts
- [ ] Alert on cross-tenant access attempts
- [ ] Track confidence scores (alert if too low)
- [ ] Monitor error rates
- [ ] Log all sensitive operations

### ✅ Compliance
- [ ] GDPR compliance (if applicable)
- [ ] Data deletion on request
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Audit trail

---

## Testing Security

### Test Cases to Run:
1. **Cross-tenant access test**: Try accessing tenant B's data as tenant A user
2. **Unauthenticated access**: Try API calls without auth token
3. **Invalid tenant_id**: Try using wrong tenant_id
4. **File upload limits**: Try uploading files > 50MB
5. **Rate limiting**: Make 100+ requests quickly
6. **SQL injection**: Try malicious queries (should be safe with ChromaDB)
7. **XSS**: Try injecting scripts in file names/queries

---

## Production Configuration

```env
# Security
ALLOWED_ORIGINS=https://app.clientsphere.com,https://clientsphere.com
MAX_FILE_SIZE_MB=50
RATE_LIMIT_PER_MINUTE=60

# Authentication (set in your auth service)
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
TOKEN_EXPIRY_HOURS=24

# Monitoring
LOG_LEVEL=INFO
ENABLE_AUDIT_LOGS=true
```

---

## Incident Response Plan

1. **Data Breach**: Immediately revoke affected tokens, audit logs, notify users
2. **Cross-tenant Access**: Review access logs, fix bug, notify affected tenants
3. **DoS Attack**: Enable rate limiting, block IPs, scale resources
4. **Malicious Upload**: Quarantine file, scan system, review upload logs




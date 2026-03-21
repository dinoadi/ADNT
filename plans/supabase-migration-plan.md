# Supabase Migration Plan for ADNT Dashboard

## Overview
Migrate the ADNT application from Express/SQLite backend to Supabase for authentication and database, enabling seamless deployment on Netlify.

## Architecture Changes

### Before (Current)
```
Client (Netlify) → Express Server (localhost:3001) → SQLite/PostgreSQL
                      ↓
                 Hardcoded Auth (admin/admin)
```

### After (Target)
```
Client (Netlify) → Supabase (Auth + Database)
                      ↓
                 Supabase Auth (admin/admin)
```

## Implementation Steps

### Phase 1: Supabase Setup (Manual Steps)

#### 1.1 Configure Supabase Authentication
- [ ] Go to Supabase Dashboard → Authentication → Providers
- [ ] Enable Email/Password provider
- [ ] Create admin user:
  - Email: `admin@adnt.com`
  - Password: `admin123` (or your preferred password)
- [ ] Disable email confirmation (for demo purposes)

#### 1.2 Create Database Tables
- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Execute the following SQL to create the customers table:

```sql
-- Create customers table
CREATE TABLE customers (
  no_rek VARCHAR(255) PRIMARY KEY,
  nama VARCHAR(255),
  no_cif VARCHAR(255),
  saldo_awal FLOAT,
  saldo_akhir FLOAT,
  tagihan_pokok FLOAT,
  tagihan_bunga FLOAT DEFAULT 0,
  tunggakan_pokok FLOAT DEFAULT 0,
  tunggakan_bunga FLOAT DEFAULT 0,
  kolek INTEGER DEFAULT 1,
  tanggal_jt VARCHAR(255),
  status_pinjaman VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'BELUM BAYAR' CHECK (payment_status IN ('BELUM BAYAR', 'DONE', 'POTONG MANUAL')),
  no_hp VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_customers_tanggal_jt ON customers(tanggal_jt);
CREATE INDEX idx_customers_payment_status ON customers(payment_status);
CREATE INDEX idx_customers_kolek ON customers(kolek);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all data
CREATE POLICY "Allow authenticated read access" ON customers
  FOR SELECT TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update data
CREATE POLICY "Allow authenticated update access" ON customers
  FOR UPDATE TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert data
CREATE POLICY "Allow authenticated insert access" ON customers
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete data
CREATE POLICY "Allow authenticated delete access" ON customers
  FOR DELETE TO authenticated
  USING (true);
```

#### 1.3 Migrate Existing Data
- [ ] Export data from current database (SQLite/PostgreSQL)
- [ ] Import data into Supabase using SQL Editor or CSV import
- [ ] Verify data integrity (check row counts, sample records)

### Phase 2: Client Code Changes

#### 2.1 Update Login Component
**File:** `client/src/pages/Login.tsx`

Changes needed:
- Replace hardcoded login with Supabase Auth
- Use `supabase.auth.signInWithPassword()`
- Handle authentication errors properly
- Store session in Supabase (automatic)

#### 2.2 Update Dashboard Component
**File:** `client/src/pages/Dashboard.tsx`

Changes needed:
- Replace `axios.get()` with `supabase.from('customers').select()`
- Replace `axios.post()` with `supabase.from('customers').update()`
- Remove `API_URL` dependency
- Handle Supabase query errors

#### 2.3 Update App Component
**File:** `client/src/App.tsx`

Changes needed:
- Replace `localStorage.getItem('token')` with Supabase session check
- Use `supabase.auth.getSession()` for authentication
- Add session listener for auto-logout

#### 2.4 Update Supabase Client Configuration
**File:** `client/src/supabase.ts`

Changes needed:
- Ensure proper error handling
- Add auth configuration options

#### 2.5 Update CustomerTable Component
**File:** `client/src/components/CustomerTable.tsx`

Changes needed:
- Update to work with Supabase data structure
- Ensure proper error handling

#### 2.6 Update CalendarView Component
**File:** `client/src/components/CalendarView.tsx`

Changes needed:
- Ensure compatibility with Supabase data

### Phase 3: Environment Configuration

#### 3.1 Update Client Environment Variables
**File:** `client/.env`

Changes needed:
- Keep `VITE_SUPABASE_URL` (already configured)
- Keep `VITE_SUPABASE_ANON_KEY` (already configured)
- Remove or comment out `VITE_API_URL` (no longer needed)

#### 3.2 Configure Netlify Environment Variables
- [ ] Go to Netlify Dashboard → Site Settings → Environment Variables
- [ ] Add `VITE_SUPABASE_URL` with your Supabase URL
- [ ] Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key
- [ ] Redeploy the site

### Phase 4: Testing

#### 4.1 Local Testing
- [ ] Test login with Supabase credentials
- [ ] Test dashboard data loading
- [ ] Test payment status updates
- [ ] Test customer CRUD operations
- [ ] Test calendar view
- [ ] Test logout functionality

#### 4.2 Production Testing
- [ ] Deploy to Netlify
- [ ] Test all functionality in production
- [ ] Verify authentication works
- [ ] Verify data persistence

### Phase 5: Cleanup (Optional)

#### 5.1 Remove Backend Dependencies
- [ ] Archive or remove `server/` directory (keep for reference)
- [ ] Update documentation
- [ ] Update deployment scripts

## Files to Modify

### Core Files
1. `client/src/pages/Login.tsx` - Authentication logic
2. `client/src/pages/Dashboard.tsx` - Data fetching and updates
3. `client/src/App.tsx` - Route protection
4. `client/src/supabase.ts` - Supabase client configuration
5. `client/src/components/CustomerTable.tsx` - Customer data display
6. `client/src/components/CalendarView.tsx` - Calendar functionality
7. `client/.env` - Environment variables

### Files to Keep (No Changes)
- `client/src/pages/LandingPage.tsx` - Public landing page
- `client/src/components/ErrorBoundary.tsx` - Error handling
- UI components and styling files

## Migration Checklist

### Pre-Migration
- [ ] Backup current database
- [ ] Document current data structure
- [ ] Test Supabase connection with provided credentials

### During Migration
- [ ] Create Supabase tables
- [ ] Migrate data to Supabase
- [ ] Update authentication logic
- [ ] Update data fetching logic
- [ ] Update data update logic
- [ ] Test all features locally

### Post-Migration
- [ ] Deploy to Netlify
- [ ] Test in production
- [ ] Monitor for errors
- [ ] Update documentation
- [ ] Archive old backend code

## Potential Issues & Solutions

### Issue 1: Supabase Auth Not Working
**Solution:** Check email confirmation settings, ensure anon key is correct

### Issue 2: Data Not Loading
**Solution:** Check RLS policies, ensure user is authenticated, verify table structure

### Issue 3: CORS Errors
**Solution:** Supabase handles CORS automatically, but check if any custom headers are needed

### Issue 4: Performance Issues
**Solution:** Add database indexes, optimize queries, use pagination for large datasets

## Rollback Plan

If migration fails:
1. Revert code changes using git
2. Restore original backend server
3. Keep Supabase setup for future use
4. Document issues encountered

## Success Criteria

✅ Login works with Supabase credentials
✅ Dashboard loads customer data from Supabase
✅ Payment status updates work correctly
✅ All CRUD operations function properly
✅ Application works on Netlify without backend server
✅ No console errors in production
✅ Data persists across sessions

## Estimated Complexity

- **Supabase Setup:** Low (manual configuration)
- **Data Migration:** Medium (depends on data size)
- **Code Changes:** Medium (6-8 files to modify)
- **Testing:** Medium (comprehensive testing required)
- **Deployment:** Low (Netlify deployment is straightforward)

## Next Steps

1. Complete Phase 1 (Supabase Setup) manually
2. Switch to Code mode to implement Phase 2 (Client Code Changes)
3. Complete Phase 3 (Environment Configuration)
4. Perform Phase 4 (Testing)
5. Optionally complete Phase 5 (Cleanup)

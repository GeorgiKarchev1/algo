# 🔧 Supabase Setup Guide - Fix User Profile Creation Error

## Problem
You're getting this error when creating accounts:
```
Error creating user profile: {}
Error details: {}
```

This happens because the `profiles` table doesn't exist in your Supabase database.

## 🚀 Quick Fix - Method 1: Run SQL Setup

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your project: `fivbdlgrilpggncmdekp`

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### Step 3: Copy & Run the SQL
1. Open the `supabase-setup.sql` file in your project
2. Copy **ALL** the content from that file
3. Paste it into the SQL Editor
4. Click **"Run"** button

### Step 4: Verify Success
You should see messages like:
- ✅ "Success. No rows returned"
- ✅ Multiple successful operations

---

## 🛠️ Alternative Fix - Method 2: Manual Table Creation

If Method 1 doesn't work, follow these steps:

### Step 1: Create Profiles Table
In Supabase SQL Editor, run this simple command:

```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Step 2: Enable Row Level Security
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Step 3: Create Basic Policies
```sql
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile  
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 🧪 Test the Fix

### Step 1: Try Creating an Account
1. Go to your app's signup page
2. Create a new test account
3. Check the browser console

### Step 2: Expected Console Messages
After the fix, you should see:
- ✅ `User profile created successfully`
- ❌ NO MORE: `Error creating user profile: {}`

### Step 3: Verify in Supabase
1. Go to **Table Editor** in Supabase
2. Click on **"profiles"** table
3. You should see the new user's profile data

---

## 🔍 Troubleshooting

### If you still get errors:

**Error: "relation 'profiles' does not exist"**
- ✅ The table wasn't created properly
- 🔧 Try Method 2 (Manual Table Creation)

**Error: "permission denied"**
- ✅ RLS policies aren't set up correctly
- 🔧 Run the policy creation SQL from Method 2

**Error: "duplicate key value"**
- ✅ This is actually GOOD - it means the profile already exists
- 🔧 This error can be ignored

### Check Your Setup:
1. **Verify Table Exists:**
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'profiles';
   ```

2. **Check Policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. **Test Insert:**
   ```sql
   SELECT auth.uid(); -- Should return your user ID when logged in
   ```

---

## 💡 What This Setup Does

- **Creates a profiles table** linked to Supabase auth users
- **Enables security** so users can only access their own data
- **Allows your app** to store additional user information like full name, username, avatar
- **Fixes the signup error** you're experiencing

---

## 🎉 After Setup Success

Once this is working:
- ✅ Users can create accounts without errors
- ✅ User profiles are automatically created
- ✅ Your app can store and retrieve user profile data
- ✅ All data is secure with Row Level Security

Need help? Check the console messages - they now provide clear guidance on what's happening! 
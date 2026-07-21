## Admin Dashboard Setup Guide

The admin dashboard is now fully integrated into your bakery website. This guide explains the current setup and next steps for production deployment.

---

## ✅ What's Included

### Admin.tsx Component
- **Authentication Screen**: Login page with email/password validation
- **Three Tabs**:
  1. **Products**: Add, edit, delete menu items with image upload
  2. **Time Slots**: Manage pickup/delivery availability windows
  3. **Orders**: View customer orders with status tracking

### Features
- ✅ Add/Edit/Delete menu items (name, price, ingredients, photo)
- ✅ File upload for product images with preview
- ✅ Time slot management (date, time window, type, capacity)
- ✅ Availability tracking (booked vs capacity)
- ✅ Order dashboard (view order details, items, totals, status)
- ✅ Styled to match your bakery's warm aesthetic
- ✅ Responsive design (mobile + desktop)

### Routing
- **Home**: `localhost:5173/` (default)
- **Admin**: `localhost:5173/#admin` (direct link)
- **Keyboard Shortcuts**:
  - `Ctrl+Alt+A` (Windows) or `Cmd+Alt+A` (Mac) → Access admin
  - `Escape` → Return to home from admin

### Demo Credentials (Placeholder)
- **Email**: `admin@sistersbakery.com`
- **Password**: `password`

---

## 🔐 Next Steps: Cognito Integration

The admin page currently uses **placeholder authentication**. Follow these steps to connect AWS Cognito:

### Step 1: Set Up Cognito User Pool

1. Go to AWS Cognito Console
2. Click **"Create user pool"**
3. Configure:
   - **Pool name**: `SistersBakeryAdminPool`
   - **Sign-in options**: Email
   - **MFA**: Optional (recommended for security)
   - **User attributes**: Keep defaults
4. Create a **User** in the pool for your sister:
   - Email: your sister's email
   - Temporary password (she'll reset on first login)

### Step 2: Create Cognito App Client

1. In your User Pool, go to **"App integration" → "App clients"**
2. Click **"Create app client"**
3. Configure:
   - **App type**: Single Page Application
   - **Auth flows**: `ALLOW_USER_PASSWORD_AUTH` + `ALLOW_REFRESH_TOKEN_AUTH`
   - **Callback URL**: `https://main.dn5w8qnup650n.amplifyapp.com` (or your custom domain)
   - **Allowed logout URL**: Same as callback
   - **Allowed OAuth flows**: Authorization code, Implicit
4. Save the **Client ID** and **Client Secret**

### Step 3: Install AWS Amplify Package

```bash
npm install aws-amplify
```

### Step 4: Update Admin.tsx Login

Replace the placeholder login with Cognito integration:

```typescript
import { Auth } from 'aws-amplify';

// In your handleLogin function:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const user = await Auth.signIn(authEmail, authPassword);
    console.log('Login successful:', user);
    setIsAuthenticated(true);
    loadMockData();
  } catch (error) {
    setLoginError('Invalid email or password');
    console.error('Login error:', error);
  }
};

// For logout:
const handleLogout = async () => {
  await Auth.signOut();
  setIsAuthenticated(false);
};
```

### Step 5: Configure Amplify in main.tsx

Add this to `src/main.tsx`:

```typescript
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1', // Your AWS region
    userPoolId: 'us-east-1_xxxxxxx', // From Cognito console
    userPoolWebClientId: 'your-client-id-here',
  },
});
```

---

## 🔗 API Integration (Lambda Functions)

The admin dashboard has placeholder TODO comments for API calls. Once you set up Lambda functions, replace these:

### Products API Endpoints

```typescript
// Create Product
POST /api/products
Body: { name, price, ingredients, photoUrl }

// Update Product
PUT /api/products/{id}

// Delete Product
DELETE /api/products/{id}

// Get All Products
GET /api/products
```

### Time Slots API Endpoints

```typescript
// Create Slot
POST /api/time-slots
Body: { date, window, type, capacity }

// Update Slot
PUT /api/time-slots/{id}

// Delete Slot
DELETE /api/time-slots/{id}

// Get All Slots
GET /api/time-slots
```

### Orders API Endpoints

```typescript
// Get All Orders
GET /api/orders

// Get Order Details
GET /api/orders/{id}
```

Replace all `// TODO: Call Lambda API` sections with actual fetch calls:

```typescript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData),
});
```

---

## 📸 Image Upload to S3

The current implementation stores base64 images. For production, upload to S3:

```typescript
import { Storage } from 'aws-amplify';

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      const result = await Storage.put(file.name, file);
      const url = await Storage.get(result.key);
      setFilePreview(url);
      // Use this URL in your product data
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
};
```

---

## 🚀 Deployment to Amplify

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add admin dashboard with Cognito setup"
   git push origin main
   ```

2. **Auto-Deploy**: Amplify will detect changes and deploy automatically

3. **Access Admin**:
   - Visit: `https://main.dn5w8qnup650n.amplifyapp.com/#admin`
   - Login with Cognito credentials

---

## 🎨 Styling Notes

The admin dashboard uses:
- **Colors**: Your bakery theme (warm browns, cream, accent orange)
- **Fonts**: Playfair Display (headings), Lato (body)
- **Components**: All shadcn/ui components already in your project
- **Responsive**: Mobile-friendly with Tailwind CSS

---

## 📋 Checklist for Production

- [ ] Set up Cognito User Pool
- [ ] Create app client and get Client ID
- [ ] Install `aws-amplify` package
- [ ] Configure Amplify in `main.tsx`
- [ ] Replace placeholder login with Cognito auth
- [ ] Create Lambda functions for CRUD operations
- [ ] Set up API Gateway endpoints
- [ ] Configure S3 for image uploads
- [ ] Test full flow with demo data
- [ ] Deploy to Amplify
- [ ] Verify admin access via `#admin` route

---

## 🆘 Troubleshooting

**"Invalid credentials" on login**:
- Check Cognito credentials in Amplify config
- Verify user exists in Cognito User Pool
- Check password is correct (case-sensitive)

**Images not uploading**:
- Verify S3 bucket exists and permissions are correct
- Check Amplify Storage config
- Review browser console for errors

**Admin page not accessible**:
- Ensure you're logged in with Cognito
- Check auth token in browser storage
- Verify user pool permissions

---

## 📞 Support

For AWS Cognito help:
- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [Amplify Auth Guide](https://docs.amplify.aws/javascript/build-a-backend/auth/)

For admin dashboard customization, refer to shadcn/ui component docs for styling.

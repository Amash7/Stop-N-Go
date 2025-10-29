# 🚀 Deployment Guide for Stop N Go

This guide covers deploying your Stop N Go website to production.

## Option 1: Deploy to Vercel (Recommended - FREE)

Vercel is the easiest way to deploy Next.js applications and offers a generous free tier.

### Step 1: Prepare Your Repository

1. Initialize git if you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub:
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" (use your GitHub account)
3. Click "New Project"
4. Import your GitHub repository
5. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variables

In Vercel's dashboard:

1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add each variable from your `.env` file:

```
DATABASE_URL=your_neon_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

⚠️ **Important**: Update `NEXTAUTH_URL` to your actual Vercel domain!

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Visit your live site!

### Step 5: Setup Custom Domain (Optional)

1. In Vercel, go to "Settings" → "Domains"
2. Add your custom domain (e.g., stopngo.com)
3. Follow Vercel's instructions to configure DNS
4. Update `NEXTAUTH_URL` environment variable to your custom domain

## Option 2: Deploy to Other Platforms

### Deploy to Netlify

1. Push code to GitHub
2. Go to [https://netlify.com](https://netlify.com)
3. Click "Add new site" → "Import from Git"
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables (same as above)
7. Deploy!

### Deploy to Railway

1. Go to [https://railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Railway will auto-detect Next.js and deploy

## Production Checklist

Before deploying to production:

### Security
- [ ] Change admin password to something very secure
- [ ] Review all environment variables are set correctly
- [ ] Ensure `.env` is in `.gitignore` (already done)
- [ ] Consider enabling 2FA on Vercel/hosting account

### Database
- [ ] Verify Neon database is on a paid plan if you expect high traffic
- [ ] Set up database backups in Neon dashboard
- [ ] Test database connection from production

### Images
- [ ] Verify Cloudinary account limits (free tier: 25GB storage, 25GB bandwidth/month)
- [ ] Consider upgrading if you'll have many products
- [ ] Optimize images before uploading (recommended: 1000x1000px max)

### Testing
- [ ] Create test admin account
- [ ] Create test customer account
- [ ] Add test products
- [ ] Place test orders
- [ ] Test VIP enrollment
- [ ] Test order approval/discard
- [ ] Test on mobile devices
- [ ] Test in different browsers

### Performance
- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] Aim for 90+ performance score
- [ ] Check loading times

### Legal
- [ ] Add privacy policy page (if required)
- [ ] Add terms of service (if required)
- [ ] Ensure age verification for tobacco products
- [ ] Add required disclaimers

## Post-Deployment Steps

### 1. Monitor Your Site

Set up monitoring:
- Vercel automatically provides analytics
- Check for errors in Vercel logs
- Monitor Neon database usage

### 2. Regular Maintenance

Weekly:
- [ ] Check for pending orders
- [ ] Review VIP member milestones
- [ ] Add new products

Monthly:
- [ ] Review analytics dashboard
- [ ] Check database storage usage
- [ ] Review Cloudinary usage

### 3. Backups

- Neon provides automatic backups
- Consider exporting important data monthly
- Keep a local backup of product images

## Updating Your Site

To deploy updates:

1. Make changes to your code locally
2. Test thoroughly with `npm run dev`
3. Commit and push to GitHub:
```bash
git add .
git commit -m "Description of changes"
git push
```
4. Vercel will automatically deploy the new version!

## Troubleshooting Production Issues

### Site is slow
- Check Neon database connection
- Optimize images in Cloudinary
- Review Vercel analytics for bottlenecks

### Database connection errors
- Verify DATABASE_URL is correct
- Check if Neon database is active
- Review connection limits on Neon plan

### Images not loading
- Verify Cloudinary credentials
- Check Cloudinary usage limits
- Ensure image URLs are correct

### Authentication issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## Custom Domain Setup

### Using Vercel with Custom Domain

1. Purchase domain from registrar (GoDaddy, Namecheap, etc.)
2. In Vercel:
   - Go to Project → Settings → Domains
   - Add your domain (e.g., stopngo.com)
3. Add DNS records at your registrar:
   - Type: A Record
   - Name: @
   - Value: 76.76.21.21
   
   OR
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

4. Wait for DNS propagation (can take up to 48 hours)
5. Update `NEXTAUTH_URL` in environment variables

## Performance Optimization Tips

### Images
- Use WebP format when possible
- Compress images before uploading
- Use Cloudinary's automatic optimization features

### Database
- Regularly clean up old/discarded orders
- Index frequently queried fields (already done)
- Monitor query performance in Neon

### Caching
- Vercel automatically caches static assets
- Consider adding ISR (Incremental Static Regeneration) for product pages if needed

## Scaling Considerations

If your site grows:

1. **Database**: Upgrade Neon plan for more storage and connections
2. **Images**: Upgrade Cloudinary for more bandwidth
3. **Hosting**: Vercel Pro plan for analytics and more
4. **Consider**: Adding Redis for session storage
5. **Consider**: CDN for faster global access (Vercel includes this)

## Support & Resources

- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Neon Docs**: [https://neon.tech/docs](https://neon.tech/docs)
- **Cloudinary Docs**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)

## Emergency Rollback

If something goes wrong:

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Promote to Production"

Your site will instantly rollback to the previous version!

---

Good luck with your deployment! 🚀

For any issues, check Vercel logs first - they're very detailed and helpful!


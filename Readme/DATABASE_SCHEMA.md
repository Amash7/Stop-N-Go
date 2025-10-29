# Stop N Go Database Schema

## Tables

### users
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- name (String)
- role (Enum: 'customer', 'admin')
- vip_number (String, Unique, Nullable) - VIP Circle membership number
- vip_approved_orders (Integer, Default: 0) - Count of approved orders for VIP rewards
- created_at (Timestamp)
- updated_at (Timestamp)

### products
- id (UUID, Primary Key)
- name (String)
- description (Text)
- price (Decimal)
- quantity (Integer) - Available stock
- category (String)
- image_url (String) - Cloudinary URL
- image_public_id (String) - Cloudinary public ID for deletion
- is_active (Boolean, Default: true)
- created_at (Timestamp)
- updated_at (Timestamp)

### orders
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- order_number (String, Unique) - Format: ORD-YYYYMMDD-XXXX
- status (Enum: 'pending', 'approved', 'discarded')
- total_amount (Decimal)
- admin_note (Text, Nullable) - VIP reward notes or other messages
- created_at (Timestamp)
- updated_at (Timestamp)
- approved_at (Timestamp, Nullable)
- discarded_at (Timestamp, Nullable)

### order_items
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key -> orders.id)
- product_id (UUID, Foreign Key -> products.id)
- product_name (String) - Snapshot of product name at order time
- product_price (Decimal) - Snapshot of price at order time
- quantity (Integer)
- subtotal (Decimal)
- created_at (Timestamp)

## Relationships

- users.id -> orders.user_id (One-to-Many)
- orders.id -> order_items.order_id (One-to-Many)
- products.id -> order_items.product_id (Many-to-One)

## Indexes

- users: email, vip_number
- products: category, is_active
- orders: user_id, status, created_at, order_number
- order_items: order_id, product_id

## Business Logic

### VIP Circle Program
- When a customer signs up for VIP Circle, they receive a unique VIP number
- Every time an order is approved, their vip_approved_orders count increments
- When count reaches 10, admin can add a reward note
- Count resets to 0 after admin acknowledges the milestone

### Order Management
- Orders start as 'pending'
- Admin can 'approve' or 'discard'
- When approved: product quantities remain reduced, order contributes to analytics
- When discarded: product quantities are restored to inventory
- Analytics track both approved and discarded amounts by month


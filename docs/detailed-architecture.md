# 詳細設計書

## 1. データモデル詳細

### 1.1 ユーザーデータ (User)

```typescript
interface User {
  id: string;           // ユーザーID (例: "user-001")
  username: string;     // ユーザー名
  email: string;        // メールアドレス
  password: string;     // パスワード（平文、デモ用）
  firstName: string;    // 名
  lastName: string;     // 姓
  address: {
    postalCode: string; // 郵便番号
    prefecture: string; // 都道府県
    city: string;       // 市区町村
    street: string;     // 番地
  };
  createdAt: string;    // 作成日時 (ISO 8601)
}
```

**ダミーデータ例:**
```json
{
  "id": "user-001",
  "username": "tanaka",
  "email": "tanaka@example.com",
  "password": "password123",
  "firstName": "太郎",
  "lastName": "田中",
  "address": {
    "postalCode": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "street": "丸の内1-1-1"
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 1.2 カテゴリデータ (Category)

```typescript
interface Category {
  id: string;           // カテゴリID (例: "cat-001")
  name: string;         // カテゴリ名
  description: string;  // 説明
  icon: string;         // アイコン名/クラス
}
```

**ダミーデータ例:**
```json
[
  { "id": "cat-001", "name": "CPU", "description": "プロセッサー", "icon": "cpu" },
  { "id": "cat-002", "name": "GPU", "description": "グラフィックカード", "icon": "gpu" },
  { "id": "cat-003", "name": "メモリ", "description": "RAM", "icon": "memory" },
  { "id": "cat-004", "name": "ストレージ", "description": "SSD/HDD", "icon": "storage" },
  { "id": "cat-005", "name": "マザーボード", "description": "メインボード", "icon": "motherboard" },
  { "id": "cat-006", "name": "電源ユニット", "description": "PSU", "icon": "power" },
  { "id": "cat-007", "name": "PCケース", "description": "筐体", "icon": "case" },
  { "id": "cat-008", "name": "周辺機器", "description": "キーボード・マウス等", "icon": "peripheral" }
]
```

---

### 1.3 商品データ (Product)

```typescript
interface Product {
  id: string;           // 商品ID (例: "prod-001")
  name: string;         // 商品名
  categoryId: string;   // カテゴリID
  price: number;        // 価格（税込）
  stock: number;        // 在庫数
  description: string;  // 商品説明
  specifications: {     // スペック情報
    [key: string]: string;
  };
  imageUrl: string;     // 画像URL
  brand: string;        // ブランド名
  rating: number;       // 評価 (1-5)
  reviewCount: number;  // レビュー数
  createdAt: string;    // 登録日時
}
```

**ダミーデータ例:**
```json
{
  "id": "prod-001",
  "name": "Intel Core i9-14900K",
  "categoryId": "cat-001",
  "price": 89800,
  "stock": 15,
  "description": "第14世代Intel Coreプロセッサー。24コア/32スレッドの最高峰CPU。",
  "specifications": {
    "コア数": "24 (8P+16E)",
    "スレッド数": "32",
    "ベースクロック": "3.2GHz",
    "ブーストクロック": "6.0GHz",
    "TDP": "125W",
    "ソケット": "LGA1700"
  },
  "imageUrl": "/images/products/cpu-intel-i9.png",
  "brand": "Intel",
  "rating": 4.8,
  "reviewCount": 124,
  "createdAt": "2024-01-15T00:00:00Z"
}
```

---

### 1.4 カートデータ (Cart)

```typescript
interface CartItem {
  productId: string;    // 商品ID
  quantity: number;     // 数量
  addedAt: string;      // 追加日時
}

interface Cart {
  userId: string;       // ユーザーID
  items: CartItem[];    // カート内商品リスト
  updatedAt: string;    // 更新日時
}
```

---

### 1.5 注文データ (Order)

```typescript
interface OrderItem {
  productId: string;    // 商品ID
  productName: string;  // 商品名（スナップショット）
  quantity: number;     // 数量
  unitPrice: number;    // 単価（スナップショット）
  subtotal: number;     // 小計
}

interface Order {
  id: string;           // 注文ID (例: "ord-001")
  userId: string;       // ユーザーID
  items: OrderItem[];   // 注文明細
  totalAmount: number;  // 合計金額
  status: OrderStatus;  // 注文ステータス
  shippingAddress: {    // 配送先住所
    postalCode: string;
    prefecture: string;
    city: string;
    street: string;
  };
  orderedAt: string;    // 注文日時
}

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
```

---

## 2. API詳細仕様

### 2.1 認証API

#### POST /api/auth/login

**リクエスト:**
```json
{
  "email": "tanaka@example.com",
  "password": "password123"
}
```

**レスポンス (成功 200):**
```json
{
  "success": true,
  "user": {
    "id": "user-001",
    "username": "tanaka",
    "email": "tanaka@example.com",
    "firstName": "太郎",
    "lastName": "田中"
  },
  "sessionId": "sess-xxxx-xxxx"
}
```

**レスポンス (失敗 401):**
```json
{
  "success": false,
  "error": "メールアドレスまたはパスワードが正しくありません"
}
```

---

#### POST /api/auth/logout

**リクエストヘッダー:**
```
Authorization: Bearer {sessionId}
```

**レスポンス (成功 200):**
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

---

#### GET /api/auth/me

**リクエストヘッダー:**
```
Authorization: Bearer {sessionId}
```

**レスポンス (成功 200):**
```json
{
  "success": true,
  "user": {
    "id": "user-001",
    "username": "tanaka",
    "email": "tanaka@example.com",
    "firstName": "太郎",
    "lastName": "田中"
  }
}
```

---

### 2.2 商品API

#### GET /api/products

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| category | string | カテゴリIDでフィルタ |
| search | string | キーワード検索 |
| sort | string | ソート項目 (price, name, rating) |
| order | string | ソート順 (asc, desc) |
| page | number | ページ番号 (デフォルト: 1) |
| limit | number | 1ページあたりの件数 (デフォルト: 12) |

**レスポンス (成功 200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-001",
        "name": "Intel Core i9-14900K",
        "categoryId": "cat-001",
        "price": 89800,
        "stock": 15,
        "imageUrl": "/images/products/cpu-intel-i9.png",
        "brand": "Intel",
        "rating": 4.8
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 12
    }
  }
}
```

---

#### GET /api/products/:id

**レスポンス (成功 200):**
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Intel Core i9-14900K",
    "categoryId": "cat-001",
    "price": 89800,
    "stock": 15,
    "description": "第14世代Intel Coreプロセッサー...",
    "specifications": {
      "コア数": "24 (8P+16E)",
      "スレッド数": "32"
    },
    "imageUrl": "/images/products/cpu-intel-i9.png",
    "brand": "Intel",
    "rating": 4.8,
    "reviewCount": 124
  }
}
```

**レスポンス (失敗 404):**
```json
{
  "success": false,
  "error": "商品が見つかりません"
}
```

---

### 2.3 カートAPI

#### GET /api/cart

**レスポンス (成功 200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "prod-001",
        "product": {
          "id": "prod-001",
          "name": "Intel Core i9-14900K",
          "price": 89800,
          "imageUrl": "/images/products/cpu-intel-i9.png",
          "stock": 15
        },
        "quantity": 1,
        "subtotal": 89800
      }
    ],
    "totalAmount": 89800,
    "itemCount": 1
  }
}
```

---

#### POST /api/cart/items

**リクエスト:**
```json
{
  "productId": "prod-001",
  "quantity": 1
}
```

**レスポンス (成功 201):**
```json
{
  "success": true,
  "message": "カートに追加しました",
  "data": {
    "items": [...],
    "totalAmount": 89800,
    "itemCount": 1
  }
}
```

**レスポンス (失敗 400 - 在庫不足):**
```json
{
  "success": false,
  "error": "在庫が不足しています"
}
```

---

#### PUT /api/cart/items/:productId

**リクエスト:**
```json
{
  "quantity": 2
}
```

**レスポンス (成功 200):**
```json
{
  "success": true,
  "message": "数量を更新しました",
  "data": {
    "items": [...],
    "totalAmount": 179600,
    "itemCount": 2
  }
}
```

---

#### DELETE /api/cart/items/:productId

**レスポンス (成功 200):**
```json
{
  "success": true,
  "message": "カートから削除しました"
}
```

---

### 2.4 注文API

#### POST /api/orders

**リクエスト:**
```json
{
  "shippingAddress": {
    "postalCode": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "street": "丸の内1-1-1"
  }
}
```

**レスポンス (成功 201):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord-001",
    "totalAmount": 89800,
    "status": "confirmed",
    "orderedAt": "2024-06-15T10:30:00Z"
  }
}
```

---

#### GET /api/orders

**レスポンス (成功 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "ord-001",
      "totalAmount": 89800,
      "status": "confirmed",
      "itemCount": 1,
      "orderedAt": "2024-06-15T10:30:00Z"
    }
  ]
}
```

---

## 3. コンポーネント詳細設計

### 3.1 共通コンポーネント

#### Button コンポーネント

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### Input コンポーネント

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

---

### 3.2 商品関連コンポーネント

#### ProductCard コンポーネント

```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    brand: string;
    rating: number;
    stock: number;
  };
  onAddToCart: (productId: string) => void;
}
```

**表示内容:**
- 商品画像
- 商品名
- ブランド名
- 価格（税込表示）
- 評価（星表示）
- 在庫状況
- 「カートに追加」ボタン

---

#### ProductFilter コンポーネント

```typescript
interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

interface SortOption {
  field: 'price' | 'name' | 'rating';
  order: 'asc' | 'desc';
}
```

---

### 3.3 カート関連コンポーネント

#### CartItem コンポーネント

```typescript
interface CartItemProps {
  item: {
    productId: string;
    product: Product;
    quantity: number;
    subtotal: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}
```

#### CartSummary コンポーネント

```typescript
interface CartSummaryProps {
  items: CartItem[];
  totalAmount: number;
  onCheckout: () => void;
  onClearCart: () => void;
}
```

---

## 4. カスタムフック詳細

### 4.1 useAuth フック

```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

function useAuth(): UseAuthReturn;
```

**実装概要:**
1. AuthContextからユーザー情報を取得
2. ログイン/ログアウトAPIを呼び出し
3. セッション情報をlocalStorageに保存

---

### 4.2 useCart フック

```typescript
interface UseCartReturn {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  error: string | null;
}

function useCart(): UseCartReturn;
```

---

### 4.3 useProducts フック

```typescript
interface UseProductsParams {
  category?: string;
  search?: string;
  sort?: SortOption;
  page?: number;
}

interface UseProductsReturn {
  products: Product[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

function useProducts(params: UseProductsParams): UseProductsReturn;
```

---

## 5. エラーハンドリング

### 5.1 エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| AUTH_INVALID_CREDENTIALS | 401 | 認証情報が正しくない |
| AUTH_SESSION_EXPIRED | 401 | セッション期限切れ |
| AUTH_REQUIRED | 401 | 認証が必要 |
| PRODUCT_NOT_FOUND | 404 | 商品が見つからない |
| CART_EMPTY | 400 | カートが空 |
| STOCK_INSUFFICIENT | 400 | 在庫不足 |
| VALIDATION_ERROR | 400 | バリデーションエラー |
| SERVER_ERROR | 500 | サーバーエラー |

### 5.2 エラーレスポンス形式

```json
{
  "success": false,
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": "在庫が不足しています",
    "details": {
      "productId": "prod-001",
      "requested": 5,
      "available": 2
    }
  }
}
```

---

## 6. ダミーデータ一覧

### 6.1 ユーザーダミーデータ (3件)

| ID | ユーザー名 | メール | パスワード |
|----|-----------|--------|-----------|
| user-001 | tanaka | tanaka@example.com | password123 |
| user-002 | yamada | yamada@example.com | password123 |
| user-003 | suzuki | suzuki@example.com | password123 |

### 6.2 商品ダミーデータ (カテゴリ別各3-5件、計30件程度)

**CPU (5件)**
- Intel Core i9-14900K - ¥89,800
- Intel Core i7-14700K - ¥62,800
- AMD Ryzen 9 7950X - ¥79,800
- AMD Ryzen 7 7800X3D - ¥59,800
- Intel Core i5-14600K - ¥45,800

**GPU (5件)**
- NVIDIA GeForce RTX 4090 - ¥298,000
- NVIDIA GeForce RTX 4080 - ¥198,000
- NVIDIA GeForce RTX 4070 Ti - ¥128,000
- AMD Radeon RX 7900 XTX - ¥168,000
- AMD Radeon RX 7800 XT - ¥78,000

**メモリ (4件)**
- G.Skill Trident Z5 DDR5-6000 32GB - ¥28,800
- Corsair Vengeance DDR5-5600 32GB - ¥24,800
- Kingston FURY Beast DDR5-5200 32GB - ¥22,800
- Crucial DDR5-4800 32GB - ¥18,800

**ストレージ (4件)**
- Samsung 990 PRO 2TB NVMe - ¥28,800
- WD Black SN850X 2TB NVMe - ¥26,800
- Crucial T700 2TB NVMe - ¥32,800
- Seagate FireCuda 530 2TB - ¥24,800

※ 他カテゴリも同様に3-5件ずつ用意

---

## 7. 画面レイアウト詳細

### 7.1 共通レイアウト

```
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
│ ┌─────┐ ┌─────────────────────┐ ┌────┐ ┌────┐ ┌────┐  │
│ │Logo │ │    Search Bar       │ │Cart│ │User│ │Menu│  │
│ └─────┘ └─────────────────────┘ └────┘ └────┘ └────┘  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Main Content                         │
│                                                         │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Footer                                                  │
│ Copyright © 2024 PC Parts Shop                         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 商品一覧画面レイアウト

```
┌───────────────────────────────────────────────────────────┐
│ Sidebar (Filter)  │        Product Grid                   │
│ ┌───────────────┐ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Categories    │ │ │ Product │ │ Product │ │ Product │ │
│ │ ○ All        │ │ │  Card   │ │  Card   │ │  Card   │ │
│ │ ○ CPU        │ │ │         │ │         │ │         │ │
│ │ ○ GPU        │ │ └─────────┘ └─────────┘ └─────────┘ │
│ │ ○ Memory     │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ○ Storage    │ │ │ Product │ │ Product │ │ Product │ │
│ │ ...          │ │ │  Card   │ │  Card   │ │  Card   │ │
│ ├───────────────┤ │ │         │ │         │ │         │ │
│ │ Sort By      │ │ └─────────┘ └─────────┘ └─────────┘ │
│ │ ▼ Price Low  │ │                                      │
│ └───────────────┘ │ [1] [2] [3] [4] [5] (Pagination)    │
└───────────────────────────────────────────────────────────┘
```

### 7.3 カート画面レイアウト

```
┌───────────────────────────────────────────────────────────┐
│                    Shopping Cart                          │
├───────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ ┌────────┐ │
│ │ Cart Item                                 │ │Summary │ │
│ │ ┌─────┐ Product Name          [-][2][+]  │ │        │ │
│ │ │ IMG │ Brand                  ¥89,800   │ │小計    │ │
│ │ └─────┘                        [削除]    │ │¥179,600│ │
│ ├───────────────────────────────────────────┤ │        │ │
│ │ Cart Item                                 │ │税込    │ │
│ │ ┌─────┐ Product Name          [-][1][+]  │ │¥179,600│ │
│ │ │ IMG │ Brand                  ¥62,800   │ │        │ │
│ │ └─────┘                        [削除]    │ │[注文へ]│ │
│ └───────────────────────────────────────────┘ └────────┘ │
└───────────────────────────────────────────────────────────┘
```
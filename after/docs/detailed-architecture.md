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
  preferredLanguage: string;  // 🆕 優先言語 ('ja' | 'en')
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
  "preferredLanguage": "ja",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 1.2 カテゴリデータ (Category)

```typescript
// 🆕 多言語対応版
interface LocalizedText {
  ja: string;
  en: string;
}

interface Category {
  id: string;                  // カテゴリID (例: "cat-001")
  name: LocalizedText;         // 🆕 カテゴリ名（多言語）
  description: LocalizedText;  // 🆕 説明（多言語）
  icon: string;                // アイコン名/クラス
}
```

**ダミーデータ例:**
```json
[
  {
    "id": "cat-001",
    "name": { "ja": "CPU", "en": "CPU" },
    "description": { "ja": "プロセッサー", "en": "Processor" },
    "icon": "cpu"
  },
  {
    "id": "cat-002",
    "name": { "ja": "GPU", "en": "Graphics Card" },
    "description": { "ja": "グラフィックカード", "en": "Graphics Card" },
    "icon": "gpu"
  },
  {
    "id": "cat-003",
    "name": { "ja": "メモリ", "en": "Memory" },
    "description": { "ja": "RAM", "en": "RAM" },
    "icon": "memory"
  },
  {
    "id": "cat-004",
    "name": { "ja": "ストレージ", "en": "Storage" },
    "description": { "ja": "SSD/HDD", "en": "SSD/HDD" },
    "icon": "storage"
  },
  {
    "id": "cat-005",
    "name": { "ja": "マザーボード", "en": "Motherboard" },
    "description": { "ja": "メインボード", "en": "Main Board" },
    "icon": "motherboard"
  },
  {
    "id": "cat-006",
    "name": { "ja": "電源ユニット", "en": "Power Supply" },
    "description": { "ja": "PSU", "en": "PSU" },
    "icon": "power"
  },
  {
    "id": "cat-007",
    "name": { "ja": "PCケース", "en": "PC Case" },
    "description": { "ja": "筐体", "en": "Chassis" },
    "icon": "case"
  },
  {
    "id": "cat-008",
    "name": { "ja": "周辺機器", "en": "Peripherals" },
    "description": { "ja": "キーボード・マウス等", "en": "Keyboard, Mouse, etc." },
    "icon": "peripheral"
  }
]
```

---

### 1.3 商品データ (Product)

```typescript
// 🆕 多言語対応版
interface Product {
  id: string;                  // 商品ID (例: "prod-001")
  name: LocalizedText;         // 🆕 商品名（多言語）
  categoryId: string;          // カテゴリID
  price: number;               // 価格（税込）
  stock: number;               // 在庫数
  description: LocalizedText;  // 🆕 商品説明（多言語）
  specifications: {            // スペック情報
    [key: string]: string;
  };
  imageUrl: string;            // 画像URL
  brand: string;               // ブランド名
  rating: number;              // 評価 (1-5)
  reviewCount: number;         // レビュー数
  createdAt: string;           // 登録日時
}
```

**ダミーデータ例:**
```json
{
  "id": "prod-001",
  "name": {
    "ja": "Intel Core i9-14900K",
    "en": "Intel Core i9-14900K"
  },
  "categoryId": "cat-001",
  "price": 89800,
  "stock": 15,
  "description": {
    "ja": "第14世代Intel Coreプロセッサー。24コア/32スレッドの最高峰CPU。",
    "en": "14th Gen Intel Core Processor. Top-tier CPU with 24 cores and 32 threads."
  },
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
  productName: string;  // 商品名（スナップショット）※注文時の言語で保存
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
  language: string;     // 🆕 注文時の言語 ('ja' | 'en')
  orderedAt: string;    // 注文日時
}

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
```

---

### 1.6 翻訳データ構造 🆕

```typescript
// フロントエンド翻訳ファイル構造
interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

interface Translations {
  common: TranslationNamespace;
  product: TranslationNamespace;
  cart: TranslationNamespace;
  order: TranslationNamespace;
  error: TranslationNamespace;
}

// 対応言語
type SupportedLanguage = 'ja' | 'en';

// i18n設定
interface I18nConfig {
  defaultLanguage: SupportedLanguage;
  fallbackLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  namespaces: string[];
  defaultNamespace: string;
}
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
    "lastName": "田中",
    "preferredLanguage": "ja"
  },
  "sessionId": "sess-xxxx-xxxx"
}
```

**レスポンス (失敗 401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": {
      "ja": "メールアドレスまたはパスワードが正しくありません",
      "en": "Invalid email or password"
    }
  }
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
  "message": {
    "ja": "ログアウトしました",
    "en": "Successfully logged out"
  }
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
    "lastName": "田中",
    "preferredLanguage": "ja"
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
| **lang** | **string** | **🆕 言語コード (ja, en)。デフォルト: ja** |

**レスポンス (成功 200) - lang=ja:**
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

**レスポンス (成功 200) - lang=en:**
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

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| **lang** | **string** | **🆕 言語コード (ja, en)。デフォルト: ja** |

**レスポンス (成功 200) - lang=ja:**
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Intel Core i9-14900K",
    "categoryId": "cat-001",
    "price": 89800,
    "stock": 15,
    "description": "第14世代Intel Coreプロセッサー。24コア/32スレッドの最高峰CPU。",
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

**レスポンス (成功 200) - lang=en:**
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Intel Core i9-14900K",
    "categoryId": "cat-001",
    "price": 89800,
    "stock": 15,
    "description": "14th Gen Intel Core Processor. Top-tier CPU with 24 cores and 32 threads.",
    "specifications": {
      "Cores": "24 (8P+16E)",
      "Threads": "32"
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
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": {
      "ja": "商品が見つかりません",
      "en": "Product not found"
    }
  }
}
```

---

#### GET /api/categories 🆕

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| **lang** | **string** | **言語コード (ja, en)。デフォルト: ja** |

**レスポンス (成功 200) - lang=ja:**
```json
{
  "success": true,
  "data": [
    { "id": "cat-001", "name": "CPU", "description": "プロセッサー", "icon": "cpu" },
    { "id": "cat-002", "name": "GPU", "description": "グラフィックカード", "icon": "gpu" },
    { "id": "cat-003", "name": "メモリ", "description": "RAM", "icon": "memory" }
  ]
}
```

**レスポンス (成功 200) - lang=en:**
```json
{
  "success": true,
  "data": [
    { "id": "cat-001", "name": "CPU", "description": "Processor", "icon": "cpu" },
    { "id": "cat-002", "name": "Graphics Card", "description": "Graphics Card", "icon": "gpu" },
    { "id": "cat-003", "name": "Memory", "description": "RAM", "icon": "memory" }
  ]
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
          "name": {
            "ja": "Intel Core i9-14900K",
            "en": "Intel Core i9-14900K"
          },
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
  "message": {
    "ja": "カートに追加しました",
    "en": "Added to cart"
  },
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
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": {
      "ja": "在庫が不足しています",
      "en": "Insufficient stock"
    },
    "details": {
      "productId": "prod-001",
      "requested": 5,
      "available": 2
    }
  }
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
  "message": {
    "ja": "数量を更新しました",
    "en": "Quantity updated"
  },
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
  "message": {
    "ja": "カートから削除しました",
    "en": "Removed from cart"
  }
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
  },
  "language": "ja"
}
```

**レスポンス (成功 201):**
```json
{
  "success": true,
  "message": {
    "ja": "注文が完了しました",
    "en": "Order completed"
  },
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
      "language": "ja",
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

#### LanguageSwitcher コンポーネント 🆕

```typescript
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showLabel?: boolean;
  className?: string;
}

// 使用例
<LanguageSwitcher variant="dropdown" showLabel={true} />
```

**実装概要:**
```jsx
const LanguageSwitcher = ({ variant = 'dropdown', showLabel = true }) => {
  const { i18n, t } = useTranslation();
  
  const languages = [
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];
  
  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };
  
  return (
    // ドロップダウンまたはボタン形式のUI
  );
};
```

---

### 3.2 商品関連コンポーネント

#### ProductCard コンポーネント

```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;        // 言語に応じた商品名
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
- 商品名（🆕 言語に応じて表示）
- ブランド名
- 価格（🆕 ロケールに応じたフォーマット）
- 評価（星表示）
- 在庫状況（🆕 言語に応じたラベル）
- 「カートに追加」ボタン（🆕 言語に応じたテキスト）

---

#### ProductFilter コンポーネント

```typescript
interface ProductFilterProps {
  categories: Category[];  // 🆕 言語に応じたカテゴリ名
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
    product: Product;     // 🆕 多言語対応Product
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

**🆕 言語対応:**
- 現在の言語（`i18n.language`）を自動的にAPIリクエストに付加
- 言語切り替え時に自動で再取得

---

### 4.4 useLocale フック 🆕

```typescript
interface UseLocaleReturn {
  language: 'ja' | 'en';
  changeLanguage: (lang: 'ja' | 'en') => void;
  t: TFunction;                      // 翻訳関数
  formatPrice: (price: number) => string;
  formatDate: (date: string | Date) => string;
  formatNumber: (num: number) => string;
}

function useLocale(): UseLocaleReturn;
```

**実装概要:**
```typescript
const useLocale = () => {
  const { t, i18n } = useTranslation();
  
  const language = i18n.language as 'ja' | 'en';
  
  const changeLanguage = (lang: 'ja' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: 'JPY'
    }).format(price);
  };
  
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'ja' ? 'ja-JP' : 'en-US').format(num);
  };
  
  return { language, changeLanguage, t, formatPrice, formatDate, formatNumber };
};
```

---

## 5. i18n設定詳細 🆕

### 5.1 i18n初期化設定

```typescript
// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import jaCommon from '../locales/ja/common.json';
import jaProduct from '../locales/ja/product.json';
import jaCart from '../locales/ja/cart.json';
import jaOrder from '../locales/ja/order.json';
import jaError from '../locales/ja/error.json';

import enCommon from '../locales/en/common.json';
import enProduct from '../locales/en/product.json';
import enCart from '../locales/en/cart.json';
import enOrder from '../locales/en/order.json';
import enError from '../locales/en/error.json';

const resources = {
  ja: {
    common: jaCommon,
    product: jaProduct,
    cart: jaCart,
    order: jaOrder,
    error: jaError
  },
  en: {
    common: enCommon,
    product: enProduct,
    cart: enCart,
    order: enOrder,
    error: enError
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja',
    defaultNS: 'common',
    ns: ['common', 'product', 'cart', 'order', 'error'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage']
    }
  });

export default i18n;
```

### 5.2 翻訳ファイル詳細

**common.json (日本語)**
```json
{
  "nav": {
    "home": "ホーム",
    "products": "商品一覧",
    "cart": "カート",
    "orders": "注文履歴",
    "logout": "ログアウト",
    "login": "ログイン"
  },
  "button": {
    "addToCart": "カートに追加",
    "checkout": "購入手続きへ",
    "confirm": "確定",
    "cancel": "キャンセル",
    "back": "戻る",
    "search": "検索",
    "clear": "クリア"
  },
  "label": {
    "price": "価格",
    "quantity": "数量",
    "total": "合計",
    "subtotal": "小計",
    "stock": "在庫",
    "inStock": "在庫あり",
    "outOfStock": "在庫切れ",
    "taxIncluded": "税込"
  },
  "language": {
    "select": "言語選択",
    "ja": "日本語",
    "en": "English"
  }
}
```

**common.json (英語)**
```json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "cart": "Cart",
    "orders": "Order History",
    "logout": "Logout",
    "login": "Login"
  },
  "button": {
    "addToCart": "Add to Cart",
    "checkout": "Proceed to Checkout",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "back": "Back",
    "search": "Search",
    "clear": "Clear"
  },
  "label": {
    "price": "Price",
    "quantity": "Quantity",
    "total": "Total",
    "subtotal": "Subtotal",
    "stock": "Stock",
    "inStock": "In Stock",
    "outOfStock": "Out of Stock",
    "taxIncluded": "Tax included"
  },
  "language": {
    "select": "Select Language",
    "ja": "日本語",
    "en": "English"
  }
}
```

**error.json (日本語)**
```json
{
  "validation": {
    "required": "{{field}}は必須です",
    "email": "有効なメールアドレスを入力してください",
    "minLength": "{{field}}は{{min}}文字以上で入力してください",
    "maxLength": "{{field}}は{{max}}文字以内で入力してください"
  },
  "auth": {
    "invalidCredentials": "メールアドレスまたはパスワードが正しくありません",
    "sessionExpired": "セッションが期限切れです。再度ログインしてください",
    "unauthorized": "この操作を行う権限がありません"
  },
  "cart": {
    "insufficientStock": "在庫が不足しています（残り{{available}}個）",
    "addFailed": "カートへの追加に失敗しました",
    "updateFailed": "数量の更新に失敗しました"
  },
  "order": {
    "failed": "注文処理に失敗しました",
    "notFound": "注文が見つかりません"
  },
  "network": {
    "error": "通信エラーが発生しました",
    "timeout": "通信がタイムアウトしました"
  }
}
```

**error.json (英語)**
```json
{
  "validation": {
    "required": "{{field}} is required",
    "email": "Please enter a valid email address",
    "minLength": "{{field}} must be at least {{min}} characters",
    "maxLength": "{{field}} must be no more than {{max}} characters"
  },
  "auth": {
    "invalidCredentials": "Invalid email or password",
    "sessionExpired": "Your session has expired. Please log in again",
    "unauthorized": "You are not authorized to perform this action"
  },
  "cart": {
    "insufficientStock": "Insufficient stock ({{available}} remaining)",
    "addFailed": "Failed to add to cart",
    "updateFailed": "Failed to update quantity"
  },
  "order": {
    "failed": "Order processing failed",
    "notFound": "Order not found"
  },
  "network": {
    "error": "A network error occurred",
    "timeout": "Connection timed out"
  }
}
```

---

## 6. エラーハンドリング

### 6.1 エラーコード一覧

| コード | HTTPステータス | 説明（日本語） | 説明（英語） |
|--------|---------------|---------------|--------------|
| AUTH_INVALID_CREDENTIALS | 401 | 認証情報が正しくない | Invalid credentials |
| AUTH_SESSION_EXPIRED | 401 | セッション期限切れ | Session expired |
| AUTH_REQUIRED | 401 | 認証が必要 | Authentication required |
| PRODUCT_NOT_FOUND | 404 | 商品が見つからない | Product not found |
| CART_EMPTY | 400 | カートが空 | Cart is empty |
| STOCK_INSUFFICIENT | 400 | 在庫不足 | Insufficient stock |
| VALIDATION_ERROR | 400 | バリデーションエラー | Validation error |
| SERVER_ERROR | 500 | サーバーエラー | Server error |

### 6.2 エラーレスポンス形式

```json
{
  "success": false,
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": {
      "ja": "在庫が不足しています",
      "en": "Insufficient stock"
    },
    "details": {
      "productId": "prod-001",
      "requested": 5,
      "available": 2
    }
  }
}
```

---

## 7. ダミーデータ一覧

### 7.1 ユーザーダミーデータ (3件)

| ID | ユーザー名 | メール | パスワード | 優先言語 |
|----|-----------|--------|-----------|---------|
| user-001 | tanaka | tanaka@example.com | password123 | ja |
| user-002 | yamada | yamada@example.com | password123 | ja |
| user-003 | smith | smith@example.com | password123 | en |

### 7.2 商品ダミーデータ (カテゴリ別各3-5件、計30件程度)

**CPU (5件)**
| 商品名 | 日本語説明 | 英語説明 | 価格 |
|--------|-----------|---------|------|
| Intel Core i9-14900K | 第14世代Intel Coreプロセッサー | 14th Gen Intel Core Processor | ¥89,800 |
| Intel Core i7-14700K | ハイパフォーマンスCPU | High-performance CPU | ¥62,800 |
| AMD Ryzen 9 7950X | AMD最高峰プロセッサー | AMD's top-tier processor | ¥79,800 |
| AMD Ryzen 7 7800X3D | ゲーミング向けCPU | Gaming-focused CPU | ¥59,800 |
| Intel Core i5-14600K | コストパフォーマンス抜群 | Excellent value CPU | ¥45,800 |

※ 他カテゴリも同様に日英両方の説明を用意

---

## 8. 画面レイアウト詳細

### 8.1 共通レイアウト

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
│ ┌─────┐ ┌─────────────────────┐ 🌐[JA▼] ┌────┐ ┌────┐      │
│ │Logo │ │    Search Bar       │         │Cart│ │User│      │
│ └─────┘ └─────────────────────┘         └────┘ └────┘      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Main Content                             │
│                                                             │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
│ Copyright © 2024 PC Parts Shop                             │
└─────────────────────────────────────────────────────────────┘

🆕 言語切り替えドロップダウン（ヘッダー右側）
┌──────────────┐
│ 🌐 日本語 ▼  │
├──────────────┤
│ ○ 日本語     │
│ ○ English   │
└──────────────┘
```

### 8.2 商品一覧画面レイアウト

```
┌───────────────────────────────────────────────────────────┐
│ Sidebar (Filter)  │        Product Grid                   │
│ ┌───────────────┐ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ カテゴリ       │ │ │ Product │ │ Product │ │ Product │ │
│ │ Categories    │ │ │  Card   │ │  Card   │ │  Card   │ │
│ │ ○ すべて/All  │ │ │         │ │         │ │         │ │
│ │ ○ CPU        │ │ └─────────┘ └─────────┘ └─────────┘ │
│ │ ○ GPU/       │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │   Graphics   │ │ │ Product │ │ Product │ │ Product │ │
│ │ ○ メモリ/    │ │ │  Card   │ │  Card   │ │  Card   │ │
│ │   Memory     │ │ │         │ │         │ │         │ │
│ │ ...          │ │ └─────────┘ └─────────┘ └─────────┘ │
│ ├───────────────┤ │                                      │
│ │ 並び替え      │ │ [1] [2] [3] [4] [5] (Pagination)    │
│ │ Sort By      │ │                                      │
│ │ ▼ 価格(安い順)│ │                                      │
│ │   Price Low  │ │                                      │
│ └───────────────┘ │                                      │
└───────────────────────────────────────────────────────────┘

🆕 カテゴリ名・ラベルは選択言語に応じて表示
```

### 8.3 カート画面レイアウト

```
┌───────────────────────────────────────────────────────────┐
│                ショッピングカート / Shopping Cart          │
├───────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ ┌────────┐ │
│ │ Cart Item                                 │ │Summary │ │
│ │ ┌─────┐ Product Name          [-][2][+]  │ │概要    │ │
│ │ │ IMG │ Brand                  ¥89,800   │ │        │ │
│ │ └─────┘ 在庫あり / In Stock    [削除/    │ │小計    │ │
│ │                                Remove]   │ │Subtotal│ │
│ ├───────────────────────────────────────────┤ │¥179,600│ │
│ │ Cart Item                                 │ │        │ │
│ │ ┌─────┐ Product Name          [-][1][+]  │ │税込    │ │
│ │ │ IMG │ Brand                  ¥62,800   │ │Tax incl│ │
│ │ └─────┘ 在庫あり / In Stock    [削除/    │ │¥179,600│ │
│ │                                Remove]   │ │        │ │
│ └───────────────────────────────────────────┘ │[注文へ]│ │
│                                               │Checkout│ │
│                                               └────────┘ │
└───────────────────────────────────────────────────────────┘

🆕 すべてのラベル・ボタンテキストは選択言語に応じて表示
```

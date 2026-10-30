import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from './components/temu/Header';
import FlashDealsBanner from './components/temu/FlashDealsBanner';
import CategoryPills from './components/temu/CategoryPills';
import ProductCard from './components/temu/ProductCard';
import VideoModal from './components/temu/VideoModal';
import BottomNav from './components/temu/BottomNav';
import Footer from './components/temu/Footer';
import CreateProductModal from './components/merchant/CreateProductModal';
import EditProductModal from './components/merchant/EditProductModal';
import MerchantPortal from './components/merchant/MerchantPortal';
import EditStoreModal from './components/merchant/EditStoreModal';
import StoreFront from './components/store/StoreFront';
import ProductDetail from './components/product/ProductDetail';
import AuthModal from './components/auth/AuthModal';
import CartDrawer from './components/cart/CartDrawer';
import { api } from './services/api';

export default function App() {
  // Vistas de la aplicación: 'marketplace' | 'store' | 'portal'
  const [currentView, setCurrentView] = useState('marketplace');

  // Datos globales
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros del Marketplace
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCenter, setActiveCenter] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  // Tienda autenticada (Comerciante con local en San Victorino)
  const [loggedInStore, setLoggedInStore] = useState(() => {
    try {
      const saved = localStorage.getItem('sanvi_store');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeStore, setActiveStore] = useState(null);

  // Cliente autenticado (Comprador estilo Temu)
  const [loggedInCustomer, setLoggedInCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('sanvi_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modo del Modal de Login: 'customer' (Comprador) | 'merchant' (Comerciante)
  const [authModalMode, setAuthModalMode] = useState('customer');

  // Carrito de compras
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modales y selección
  const [selectedVideoProduct, setSelectedVideoProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);

  // Cargar tiendas y productos iniciales
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [storesData, productsData] = await Promise.all([
        api.getStores(),
        api.getProducts()
      ]);
      setStores(storesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error cargando datos de Sanvi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Actualizar filtros cuando se buscan en el marketplace principal
  useEffect(() => {
    if (currentView === 'marketplace') {
      const fetchFiltered = async () => {
        const params = {};
        if (activeCategory !== 'Todos' && activeCategory !== 'Madrugón') {
          params.category = activeCategory;
        }
        if (activeCategory === 'Madrugón') {
          params.madrugon = 'true';
        }
        if (activeCenter) {
          params.commercial_center = activeCenter;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        const data = await api.getProducts(params);
        setProducts(data);
      };
      fetchFiltered();
    }
  }, [activeCategory, activeCenter, searchTerm, currentView]);

  // Manejo de Carrito
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // WhatsApp directo al local
  const handleDirectWhatsApp = (product) => {
    api.trackWhatsApp({
      store_id: product.store_id,
      product_id: product.id,
      purchase_type: 'DETAL'
    }).catch(() => { });

    const phone = product.phone_whatsapp || '573102345678';
    const msg = encodeURIComponent(
      `Hola ${product.store_name}, vi en *SANVI* tu producto *${product.title}* de ${product.commercial_center} (${product.local_number}). ¿Tienen disponibilidad?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // Navegar a la Tienda Pública de un Comerciante
  const handleViewStore = (storeOrIdentifier) => {
    let target = null;
    if (typeof storeOrIdentifier === 'object') {
      target = storeOrIdentifier;
    } else {
      target = stores.find(
        (s) => s.id === storeOrIdentifier || s.slug === storeOrIdentifier || s.name === storeOrIdentifier
      );
    }

    if (target) {
      setActiveStore(target);
      setCurrentView('store');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Abrir la Página Completa del Producto
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback cuando se publica un producto desde el Portal del comerciante
  const handleProductCreated = (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
    setIsCreateProductOpen(false);
  };

  // Callback cuando se actualiza un producto (título, precio detal, mayor, fotos múltiples, video, madrugón)
  const handleProductUpdated = (updatedProd) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    if (selectedProduct && selectedProduct.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
    setEditingProduct(null);
  };

  // Eliminar un producto desde el panel del comerciante
  const handleDeleteProduct = (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto de tu catálogo y de Sanvi?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Callback cuando se actualiza la portada (banner), logo (cuadrito) o datos del local
  const handleStoreUpdated = (updatedStore) => {
    setStores((prev) => prev.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
    if (loggedInStore && loggedInStore.id === updatedStore.id) {
      setLoggedInStore(updatedStore);
    }
    if (activeStore && activeStore.id === updatedStore.id) {
      setActiveStore(updatedStore);
    }
    if (updatedStore.name) {
      setProducts((prev) =>
        prev.map((p) =>
          p.store_id === updatedStore.id
            ? {
                ...p,
                store_name: updatedStore.name,
                commercial_center: updatedStore.commercial_center,
                local_number: updatedStore.local_number,
                phone_whatsapp: updatedStore.phone_whatsapp
              }
            : p
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Central con Control de Sesión del Comerciante y del Cliente */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onGoHome={() => {
          setCurrentView('marketplace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loggedInStore={loggedInStore}
        loggedInCustomer={loggedInCustomer}
        onOpenAuthModal={(initialMode = 'customer') => {
          setAuthModalMode(initialMode);
          setIsAuthModalOpen(true);
        }}
        onOpenMerchantPortal={() => setCurrentView('portal')}
        onViewStore={(st) => handleViewStore(st)}
        onLogout={() => {
          localStorage.removeItem('sanvi_store');
          setLoggedInStore(null);
          setCurrentView('marketplace');
        }}
        onLogoutCustomer={() => {
          localStorage.removeItem('sanvi_customer');
          setLoggedInCustomer(null);
        }}
      />

      {/* VISTA 1: MARKETPLACE GENERAL DE SANVI (FEED TIPO TEMU) */}
      {currentView === 'marketplace' && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 flex-1 w-full pb-16 md:pb-6">
          <FlashDealsBanner onFilterMadrugon={() => setActiveCategory('Madrugón')} />

          <CategoryPills
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeCenter={activeCenter}
            onSelectCenter={setActiveCenter}
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="bg-white rounded-xl aspect-[3/4] animate-pulse p-3 space-y-2">
                  <div className="bg-gray-200 h-2/3 rounded-lg w-full" />
                  <div className="bg-gray-200 h-3 rounded w-3/4" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center space-y-3 my-6">
              <p className="text-gray-500 font-bold text-sm">No encontramos productos con estos filtros.</p>
              <button
                onClick={() => {
                  setActiveCategory('Todos');
                  setActiveCenter('');
                  setSearchTerm('');
                }}
                className="bg-sanvi-orange text-white text-xs font-black px-4 py-2 rounded-xl"
              >
                Ver Todo Sanvi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenVideo={(prod) => setSelectedVideoProduct(prod)}
                  onDirectWhatsApp={handleDirectWhatsApp}
                  onViewStore={(stId) => handleViewStore(stId)}
                  onSelectProduct={(p) => handleSelectProduct(p)}
                />
              ))}
            </div>
          )}

          {/* Botón Ver Más Estilo Temu */}
          {products.length > 0 && (
            <div className="flex justify-center pt-8 pb-4">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="bg-[#fb5805] hover:bg-[#e04e04] text-white font-extrabold px-14 py-3 rounded-full text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Ver más</span>
                <ChevronDown className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}
        </main>
      )}

      {/* VISTA 2: PÁGINA PÚBLICA DEDICADA DE LA TIENDA DENTRO DE SANVI */}
      {currentView === 'store' && activeStore && (
        <StoreFront
          store={activeStore}
          products={products}
          loggedInStore={loggedInStore}
          onOpenEditStore={() => setIsEditStoreOpen(true)}
          onBackToMarketplace={() => setCurrentView('marketplace')}
          onAddToCart={handleAddToCart}
          onOpenVideo={(prod) => setSelectedVideoProduct(prod)}
          onDirectWhatsApp={handleDirectWhatsApp}
          onSelectProduct={(p) => handleSelectProduct(p)}
        />
      )}

      {/* VISTA 3: PÁGINA COMPLETA DEL PRODUCTO CON GALERÍA Y DETALLES */}
      {currentView === 'product' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setCurrentView('marketplace')}
          onAddToCart={handleAddToCart}
          onOpenVideo={(prod) => setSelectedVideoProduct(prod)}
          onViewStore={(stId) => handleViewStore(stId)}
          loggedInCustomer={loggedInCustomer}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* VISTA 4: PANEL DE ADMINISTRACIÓN DEL COMERCIANTE (PORTAL PRIVADO) */}
      {currentView === 'portal' && loggedInStore && (
        <MerchantPortal
          store={loggedInStore}
          products={products}
          onOpenCreateProduct={() => setIsCreateProductOpen(true)}
          onEditProduct={(prod) => setEditingProduct(prod)}
          onOpenEditStore={() => setIsEditStoreOpen(true)}
          onViewPublicStore={(st) => handleViewStore(st)}
          onBackToMarketplace={() => setCurrentView('marketplace')}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Footer Estilo Temu Adaptado a SANVI */}
      {currentView !== 'portal' && (
        <Footer
          onOpenAuthModal={() => {
            setAuthModalMode('customer');
            setIsAuthModalOpen(true);
          }}
          onOpenStorePortal={() => {
            if (loggedInStore) {
              setCurrentView('portal');
            } else {
              setAuthModalMode('store');
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* Modal: Editar Producto Completo */}
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      {/* Modal: Personalizar Portada (Banner), Logo (Cuadrito) y Datos del Local */}
      <EditStoreModal
        isOpen={isEditStoreOpen}
        onClose={() => setIsEditStoreOpen(false)}
        store={loggedInStore}
        onStoreUpdated={handleStoreUpdated}
      />

      {/* Modal: Reproductor de Video (TikTok o Shorts) */}
      <VideoModal
        product={selectedVideoProduct}
        onClose={() => setSelectedVideoProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectWhatsApp={handleDirectWhatsApp}
      />

      {/* Carrito de Compras Lateral */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        loggedInCustomer={loggedInCustomer}
      />

      {/* Modal: Login / Registro Temu Style (Clientes y Comerciantes separados) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        stores={stores}
        loggedInCustomer={loggedInCustomer}
        initialMode={authModalMode}
        onLoginCustomer={(cust) => {
          localStorage.setItem('sanvi_customer', JSON.stringify(cust));
          setLoggedInCustomer(cust);
        }}
        onLoginSuccess={(store) => {
          localStorage.setItem('sanvi_store', JSON.stringify(store));
          setLoggedInStore(store);
          setCurrentView('portal'); // Abre inmediatamente su panel de control
        }}
      />

      {/* Modal: Publicar Producto (con Compresor WebP y TikTok) */}
      <CreateProductModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onProductCreated={handleProductCreated}
      />

      {/* Barra de Navegación Móvil */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDashboard={() => {
          if (loggedInStore) {
            setCurrentView('portal');
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onFilterMadrugon={() => {
          setCurrentView('marketplace');
          setActiveCategory('Madrugón');
        }}
      />
    </div>
  );
}

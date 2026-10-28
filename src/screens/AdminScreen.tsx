import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  BackHandler,
  Platform,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { setAdminStatus } from "../services/auth";
import {
  getPendingReports,
  approveReport,
  rejectReport,
  getAllReports,
} from "../services/reports";
import { Report } from "../services/reports";
import {
  getAllProducts,
  getHalalProductsCount,
  getProductsCount,
  updateProduct,
  deleteProduct,
  searchProducts,
  ProductBarcodeExistsError,
  Product,
  ProductListFilter,
  ProductPageCursor,
  ProductUpdateData,
  PRODUCTS_PAGE_SIZE,
} from "../services/products";
import { useSafeAreaPadding } from "../hooks/useSafeAreaPadding";
import { adminPanelStyles } from "../styles/AdminPanel.styles";
import { colors } from "../styles/theme";
import { ProductEditModal } from "../components/ProductEditModal";
import { ProductImage } from "../components/ProductImage";
import { ImageViewer } from "../components/ImageViewer";
import { useTranslation } from "react-i18next";

interface AdminScreenProps {
  currentUserId: string;
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  currentUserId,
  onBack,
}) => {
  const { t } = useTranslation();
  const { headerStyle, screenBottomStyle } = useSafeAreaPadding();
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [halalTotal, setHalalTotal] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [productFilter, setProductFilter] =
    useState<ProductListFilter>("all");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "reports" | "users" | "products"
  >("reports");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingImages, setViewingImages] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);
  const contentScrollRef = useRef<ScrollView>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productCursors = useRef<(ProductPageCursor | undefined)[]>([
    undefined,
  ]);
  const productPageRef = useRef(1);
  const productFilterRef = useRef<ProductListFilter>("all");
  const searchRequestId = useRef(0);

  // Handle Android back button for modals
  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android") {
        // If image viewer is open, close it
        if (viewingImages !== null) {
          setViewingImages(null);
          return true; // Prevent default behavior
        }
        // If product edit modal is open, close it
        if (editingProduct !== null) {
          setEditingProduct(null);
          return true; // Prevent default behavior
        }
        // If no modal is open, let parent handle it
        return false; // Allow default behavior
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [viewingImages, editingProduct]);

  useEffect(() => {
    loadData();
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const loadProductCounts = async () => {
    const [total, halal] = await Promise.all([
      getProductsCount(),
      getHalalProductsCount(),
    ]);
    setProductsTotal(total);
    setHalalTotal(halal);
  };

  const loadProductsPage = async (
    page: number,
    options?: { reset?: boolean }
  ) => {
    setLoadingProducts(true);
    try {
      if (options?.reset) {
        productCursors.current = [undefined];
      }
      const cursor = productCursors.current[page - 1];
      const result = await getAllProducts(
        cursor,
        PRODUCTS_PAGE_SIZE,
        productFilterRef.current
      );
      if (result.products.length === 0 && page > 1) {
        setHasMoreProducts(false);
        return loadProductsPage(page - 1);
      }
      setProducts(result.products);
      setProductPage(page);
      productPageRef.current = page;
      setHasMoreProducts(result.hasMore);
      const nextCursors = productCursors.current.slice(0, page);
      nextCursors[page] = result.lastDoc ?? undefined;
      productCursors.current = nextCursors;
      contentScrollRef.current?.scrollTo({ y: 0, animated: false });
    } catch (error) {
      console.error("Error loading products:", error);
      Alert.alert(t("admin.error"), t("admin.failedToLoadData"));
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [pending, all, usersList] = await Promise.all([
        getPendingReports(),
        getAllReports(),
        getUsers(),
      ]);
      setPendingReports(pending);
      setAllReports(all);
      setUsers(usersList);
      await Promise.all([
        loadProductsPage(1, { reset: true }),
        loadProductCounts(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert(t("admin.error"), t("admin.failedToLoadData"));
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  };

  const handleApproveReport = async (reportId: string) => {
    try {
      const success = await approveReport(
        reportId,
        currentUserId,
        "Approved by admin"
      );
      if (success) {
        Alert.alert(t("admin.success"), t("admin.reportApprovedSuccess"));
        loadData(); // Refresh data
      } else {
        Alert.alert(t("admin.error"), t("admin.failedToApproveReport"));
      }
    } catch (error) {
      Alert.alert(t("admin.error"), t("admin.failedToApproveReport"));
    }
  };

  const handleRejectReport = async (reportId: string) => {
    Alert.alert(t("admin.reject"), t("admin.rejectReportConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("admin.reject"),
        style: "destructive",
        onPress: async () => {
          try {
            const success = await rejectReport(
              reportId,
              currentUserId,
              "Rejected by admin"
            );
            if (success) {
              Alert.alert(t("admin.success"), t("admin.reportRejected"));
              loadData(); // Refresh data
            } else {
              Alert.alert(t("admin.error"), t("admin.failedToRejectReport"));
            }
          } catch (error) {
            Alert.alert(t("admin.error"), t("admin.failedToRejectReport"));
          }
        },
      },
    ]);
  };

  const handleToggleAdmin = async (
    userId: string,
    currentAdminStatus: boolean
  ) => {
    try {
      const success = await setAdminStatus(userId, !currentAdminStatus);
      if (success) {
        Alert.alert(
          t("admin.success"),
          !currentAdminStatus
            ? t("admin.adminStatusGranted")
            : t("admin.adminStatusRevoked")
        );
        loadData(); // Refresh data
      } else {
        Alert.alert(t("admin.error"), t("admin.failedToUpdateAdminStatus"));
      }
    } catch (error) {
      Alert.alert(t("admin.error"), t("admin.failedToUpdateAdminStatus"));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (
    productId: string,
    updateData: ProductUpdateData
  ) => {
    try {
      const success = await updateProduct(productId, updateData, currentUserId);
      if (success) {
        Alert.alert(t("common.success"), t("admin.productUpdated"));
        setEditingProduct(null);
        await Promise.all([
          loadProductsPage(productPageRef.current),
          loadProductCounts(),
        ]);
      } else {
        Alert.alert(t("common.error"), t("admin.productUpdateFailed"));
      }
    } catch (error) {
      if (error instanceof ProductBarcodeExistsError) {
        Alert.alert(t("common.error"), t("admin.barcodeExists"));
        return;
      }
      Alert.alert(t("common.error"), t("admin.productUpdateFailed"));
    }
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      t("admin.deleteProduct"),
      t("admin.deleteProductConfirm", { productName }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const success = await deleteProduct(productId);
              if (success) {
                Alert.alert(t("common.success"), t("admin.productDeleted"));
                await Promise.all([
                  loadProductsPage(productPageRef.current),
                  loadProductCounts(),
                ]);
              } else {
                Alert.alert(t("common.error"), t("admin.productDeleteFailed"));
              }
            } catch (error) {
              Alert.alert(t("common.error"), t("admin.productDeleteFailed"));
            }
          },
        },
      ]
    );
  };

  const applyProductFilter = (filter: ProductListFilter) => {
    if (
      filter === productFilterRef.current &&
      !isSearching &&
      searchTerm.trim() === ""
    ) {
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchRequestId.current += 1;
    productFilterRef.current = filter;
    setProductFilter(filter);
    setSearchTerm("");
    setIsSearching(false);
    loadProductsPage(1, { reset: true });
  };

  const handleSearchProducts = (term: string) => {
    setSearchTerm(term);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (term.trim() === "") {
      searchRequestId.current += 1;
      setIsSearching(false);
      loadProductsPage(1, { reset: true });
      return;
    }

    const requestId = searchRequestId.current + 1;
    searchRequestId.current = requestId;
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      setLoadingProducts(true);
      try {
        const searchResults = await searchProducts(term);
        if (requestId !== searchRequestId.current) return;
        setProducts(
          productFilterRef.current === "halal"
            ? searchResults.filter(
                (product) => product.halalStates?.default === "halal"
              )
            : searchResults
        );
      } catch (error) {
        console.error("Error searching products:", error);
        Alert.alert(t("common.error"), t("admin.failedToSearchProducts"));
      } finally {
        if (requestId === searchRequestId.current) {
          setLoadingProducts(false);
        }
      }
    }, 400);
  };

  if (loading) {
    return (
      <View style={adminPanelStyles.container}>
        <View style={[adminPanelStyles.header, headerStyle]}>
          <View style={adminPanelStyles.headerContent}>
            <TouchableOpacity
              style={adminPanelStyles.backButton}
              onPress={onBack}
            >
              <Text style={adminPanelStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={adminPanelStyles.headerTitle}>Admin Panel</Text>
          </View>
        </View>
        <View style={adminPanelStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={adminPanelStyles.loadingText}>
            Loading admin data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={adminPanelStyles.container}>
      <View style={[adminPanelStyles.header, headerStyle]}>
        <View style={adminPanelStyles.headerContent}>
          <TouchableOpacity
            style={adminPanelStyles.backButton}
            onPress={onBack}
          >
            <Text style={adminPanelStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={adminPanelStyles.headerTitle}>Admin Panel</Text>
        </View>
      </View>

      <View style={adminPanelStyles.tabContainer}>
        <TouchableOpacity
          style={[
            adminPanelStyles.tab,
            selectedTab === "reports" && adminPanelStyles.activeTab,
          ]}
          onPress={() => setSelectedTab("reports")}
        >
          <Text
            style={[
              adminPanelStyles.tabText,
              selectedTab === "reports" && adminPanelStyles.activeTabText,
            ]}
          >
            Reports ({pendingReports.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            adminPanelStyles.tab,
            selectedTab === "users" && adminPanelStyles.activeTab,
          ]}
          onPress={() => setSelectedTab("users")}
        >
          <Text
            style={[
              adminPanelStyles.tabText,
              selectedTab === "users" && adminPanelStyles.activeTabText,
            ]}
          >
            Users ({users.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            adminPanelStyles.tab,
            selectedTab === "products" && adminPanelStyles.activeTab,
          ]}
          onPress={() => setSelectedTab("products")}
        >
          <Text
            style={[
              adminPanelStyles.tabText,
              selectedTab === "products" && adminPanelStyles.activeTabText,
            ]}
          >
            {t("admin.products")} ({productsTotal})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={contentScrollRef}
        style={adminPanelStyles.content}
        contentContainerStyle={screenBottomStyle}
      >
        {selectedTab === "reports" && (
          <>
            <View style={adminPanelStyles.statsContainer}>
              <View style={adminPanelStyles.statCard}>
                <Text style={adminPanelStyles.statNumber}>
                  {pendingReports.length}
                </Text>
                <Text style={adminPanelStyles.statLabel}>Pending</Text>
              </View>
              <View style={adminPanelStyles.statCard}>
                <Text style={adminPanelStyles.statNumber}>
                  {allReports.length}
                </Text>
                <Text style={adminPanelStyles.statLabel}>Total Reports</Text>
              </View>
            </View>

            <Text style={adminPanelStyles.sectionTitle}>Pending Reports</Text>
            {pendingReports.length === 0 ? (
              <View style={adminPanelStyles.emptyContainer}>
                <Text style={adminPanelStyles.emptyIcon}>📋</Text>
                <Text style={adminPanelStyles.emptyTitle}>
                  {t("admin.noPendingReports")}
                </Text>
                <Text style={adminPanelStyles.emptyText}>
                  {t("admin.allReportsReviewed")}
                </Text>
              </View>
            ) : (
              pendingReports.map((report) => (
                <View key={report.id} style={adminPanelStyles.reportCard}>
                  <View style={adminPanelStyles.reportHeader}>
                    <Text style={adminPanelStyles.reportTitle}>
                      {report.name || t("admin.unnamedProduct")}
                    </Text>
                    <View style={adminPanelStyles.reportStatusBadge}>
                      <Text style={adminPanelStyles.reportStatusText}>
                        {t("admin.pending")}
                      </Text>
                    </View>
                  </View>

                  <View style={adminPanelStyles.reportDetails}>
                    <View style={adminPanelStyles.reportDetailRow}>
                      <Text style={adminPanelStyles.reportDetailLabel}>
                        {t("admin.barcode")}:
                      </Text>
                      <Text style={adminPanelStyles.reportDetailValue}>
                        {report.barcode}
                      </Text>
                    </View>
                    <View style={adminPanelStyles.reportDetailRow}>
                      <Text style={adminPanelStyles.reportDetailLabel}>
                        {t("admin.status")}:
                      </Text>
                      <Text style={adminPanelStyles.reportDetailValue}>
                        {report.suggestedState}
                      </Text>
                    </View>
                    <View style={adminPanelStyles.reportDetailRow}>
                      <Text style={adminPanelStyles.reportDetailLabel}>
                        {t("admin.reporter")}:
                      </Text>
                      <Text style={adminPanelStyles.reportDetailValue}>
                        {report.reporterId
                          ? report.reporterEmail ||
                            `User ID: ${report.reporterId}`
                          : t("admin.anonymousUser")}
                      </Text>
                    </View>
                    {report.notes && (
                      <Text style={adminPanelStyles.reportNotes}>
                        {t("admin.notes")}: {report.notes}
                      </Text>
                    )}

                    {/* Report Images */}
                    {report.images && report.images.length > 0 && (
                      <View style={adminPanelStyles.reportImagesContainer}>
                        <Text style={adminPanelStyles.reportImagesLabel}>
                          {t("product.images")}:
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={adminPanelStyles.reportImagesScrollView}
                        >
                          {report.images.map((imageUrl, index) => (
                            <ProductImage
                              key={index}
                              imageUrl={imageUrl}
                              style={adminPanelStyles.reportImage}
                              fallbackIcon="📷"
                              onPress={() =>
                                setViewingImages({
                                  images: report.images!,
                                  currentIndex: index,
                                })
                              }
                            />
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  <View style={adminPanelStyles.actionButtons}>
                    <TouchableOpacity
                      style={adminPanelStyles.approveButton}
                      onPress={() => handleApproveReport(report.id)}
                    >
                      <Text style={adminPanelStyles.approveButtonText}>
                        {t("admin.approve")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={adminPanelStyles.rejectButton}
                      onPress={() => handleRejectReport(report.id)}
                    >
                      <Text style={adminPanelStyles.rejectButtonText}>
                        {t("admin.reject")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {selectedTab === "users" && (
          <>
            <Text style={adminPanelStyles.sectionTitle}>
              {t("admin.userManagement")}
            </Text>
            {users.length === 0 ? (
              <View style={adminPanelStyles.emptyContainer}>
                <Text style={adminPanelStyles.emptyIcon}>👥</Text>
                <Text style={adminPanelStyles.emptyTitle}>
                  {t("admin.noUsersFound")}
                </Text>
                <Text style={adminPanelStyles.emptyText}>
                  {t("admin.noUsersRegistered")}
                </Text>
              </View>
            ) : (
              users.map((user) => (
                <View key={user.id} style={adminPanelStyles.userCard}>
                  <View style={adminPanelStyles.userHeader}>
                    <Text style={adminPanelStyles.userEmail}>{user.email}</Text>
                    {user.isAdmin && (
                      <View style={adminPanelStyles.adminBadge}>
                        <Text style={adminPanelStyles.adminBadgeText}>
                          ADMIN
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={adminPanelStyles.userStatus}>
                    {t("admin.adminStatus")}:{" "}
                    {user.isAdmin ? t("admin.yes") : t("admin.no")}
                  </Text>

                  <TouchableOpacity
                    style={
                      user.isAdmin
                        ? adminPanelStyles.revokeAdminButton
                        : adminPanelStyles.grantAdminButton
                    }
                    onPress={() => handleToggleAdmin(user.id, user.isAdmin)}
                  >
                    <Text style={adminPanelStyles.grantAdminButtonText}>
                      {user.isAdmin
                        ? t("admin.revokeAdminAccess")
                        : t("admin.grantAdminAccess")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}

        {selectedTab === "products" && (
          <>
            <View style={adminPanelStyles.statsContainer}>
              <TouchableOpacity
                style={[
                  adminPanelStyles.statCard,
                  productFilter === "all" &&
                    adminPanelStyles.statCardSelected,
                ]}
                onPress={() => applyProductFilter("all")}
                disabled={loadingProducts}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    adminPanelStyles.statNumber,
                    productFilter === "all" &&
                      adminPanelStyles.statNumberSelected,
                  ]}
                >
                  {productsTotal}
                </Text>
                <Text
                  style={[
                    adminPanelStyles.statLabel,
                    productFilter === "all" &&
                      adminPanelStyles.statLabelSelected,
                  ]}
                >
                  {t("admin.totalProducts")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  adminPanelStyles.statCard,
                  productFilter === "halal" &&
                    adminPanelStyles.statCardHalalSelected,
                ]}
                onPress={() => applyProductFilter("halal")}
                disabled={loadingProducts}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    adminPanelStyles.statNumber,
                    productFilter === "halal" &&
                      adminPanelStyles.statNumberHalalSelected,
                  ]}
                >
                  {halalTotal}
                </Text>
                <Text
                  style={[
                    adminPanelStyles.statLabel,
                    productFilter === "halal" &&
                      adminPanelStyles.statLabelHalalSelected,
                  ]}
                >
                  {t("admin.halalProducts")}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={adminPanelStyles.sectionTitle}>
              {t("admin.productManagement")}
            </Text>

            {/* Search Bar */}
            <View style={adminPanelStyles.searchContainer}>
              <TextInput
                style={adminPanelStyles.searchInput}
                placeholder={t("admin.searchProducts")}
                value={searchTerm}
                onChangeText={handleSearchProducts}
                placeholderTextColor={colors.text.tertiary}
              />
            </View>

            {loadingProducts && (
              <View style={adminPanelStyles.productsLoadingRow}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
                <Text style={adminPanelStyles.productsLoadingText}>
                  {t("common.loading")}
                </Text>
              </View>
            )}

            {products.length === 0 && !loadingProducts ? (
              <View style={adminPanelStyles.emptyContainer}>
                <Text style={adminPanelStyles.emptyIcon}>📦</Text>
                <Text style={adminPanelStyles.emptyTitle}>
                  {t("admin.noProductsFound")}
                </Text>
                <Text style={adminPanelStyles.emptyText}>
                  {searchTerm
                    ? t("admin.noProductsMatch")
                    : productFilter === "halal"
                    ? t("admin.noProductsMatchFilter")
                    : t("admin.noProductsInDatabase")}
                </Text>
              </View>
            ) : (
              products.map((product) => (
                <View key={product.id} style={adminPanelStyles.productCard}>
                  <View style={adminPanelStyles.productHeader}>
                    <Text style={adminPanelStyles.productName}>
                      {product.name || t("admin.unnamedProduct")}
                    </Text>
                    <View
                      style={[
                        adminPanelStyles.statusBadge,
                        product.halalStates?.default === "halal"
                          ? adminPanelStyles.halalBadge
                          : product.halalStates?.default === "haram"
                          ? adminPanelStyles.haramBadge
                          : product.halalStates?.default === "suspicious"
                          ? adminPanelStyles.suspiciousBadge
                          : adminPanelStyles.unknownBadge,
                      ]}
                    >
                      <Text
                        style={[
                          adminPanelStyles.statusText,
                          product.halalStates?.default === "halal"
                            ? adminPanelStyles.halalText
                            : product.halalStates?.default === "haram"
                            ? adminPanelStyles.haramText
                            : product.halalStates?.default === "suspicious"
                            ? adminPanelStyles.suspiciousText
                            : adminPanelStyles.unknownText,
                        ]}
                      >
                        {product.halalStates?.default?.toUpperCase() ||
                          "UNKNOWN"}
                      </Text>
                    </View>
                  </View>

                  {/* Product Image */}
                  {product.images && product.images.length > 0 && (
                    <View style={adminPanelStyles.productImageContainer}>
                      <ProductImage
                        imageUrl={product.images[0]}
                        style={adminPanelStyles.productImage}
                        fallbackIcon="📦"
                        onPress={() =>
                          setViewingImages({
                            images: product.images!,
                            currentIndex: 0,
                          })
                        }
                      />
                    </View>
                  )}

                  <View style={adminPanelStyles.productDetails}>
                    <View style={adminPanelStyles.productDetailRow}>
                      <Text style={adminPanelStyles.productDetailLabel}>
                        {t("admin.barcode")}:
                      </Text>
                      <Text style={adminPanelStyles.productDetailValue}>
                        {product.barcode}
                      </Text>
                    </View>
                    {product.manufacturer && (
                      <View style={adminPanelStyles.productDetailRow}>
                        <Text style={adminPanelStyles.productDetailLabel}>
                          {t("admin.manufacturer")}:
                        </Text>
                        <Text style={adminPanelStyles.productDetailValue}>
                          {product.manufacturer}
                        </Text>
                      </View>
                    )}
                    {product.lastUpdated && (
                      <View style={adminPanelStyles.productDetailRow}>
                        <Text style={adminPanelStyles.productDetailLabel}>
                          {t("admin.lastUpdated")}:
                        </Text>
                        <Text style={adminPanelStyles.productDetailValue}>
                          {new Date(
                            product.lastUpdated.seconds * 1000
                          ).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={adminPanelStyles.productActions}>
                    <TouchableOpacity
                      style={adminPanelStyles.editButton}
                      onPress={() => handleEditProduct(product)}
                    >
                      <Text style={adminPanelStyles.editButtonText}>
                        ✏️ {t("common.edit")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={adminPanelStyles.deleteButton}
                      onPress={() =>
                        handleDeleteProduct(
                          product.id,
                          product.name || t("admin.unnamedProduct")
                        )
                      }
                    >
                      <Text style={adminPanelStyles.deleteButtonText}>
                        🗑️ {t("common.delete")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {!isSearching &&
              ((productFilter === "halal" ? halalTotal : productsTotal) >
                PRODUCTS_PAGE_SIZE ||
                hasMoreProducts ||
                productPage > 1) && (
              <View style={adminPanelStyles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    adminPanelStyles.paginationButton,
                    productPage <= 1 &&
                      adminPanelStyles.paginationButtonDisabled,
                  ]}
                  disabled={productPage <= 1 || loadingProducts}
                  onPress={() => loadProductsPage(productPage - 1)}
                >
                  <Text style={adminPanelStyles.paginationButtonText}>
                    {t("admin.previous")}
                  </Text>
                </TouchableOpacity>
                <Text style={adminPanelStyles.paginationInfo}>
                  {t("admin.pageOf", {
                    current: productPage,
                    total: Math.max(
                      productPage,
                      Math.ceil(
                        (productFilter === "halal"
                          ? halalTotal
                          : productsTotal) / PRODUCTS_PAGE_SIZE
                      )
                    ),
                  })}
                </Text>
                <TouchableOpacity
                  style={[
                    adminPanelStyles.paginationButton,
                    !hasMoreProducts &&
                      adminPanelStyles.paginationButtonDisabled,
                  ]}
                  disabled={!hasMoreProducts || loadingProducts}
                  onPress={() => loadProductsPage(productPage + 1)}
                >
                  <Text style={adminPanelStyles.paginationButtonText}>
                    {t("admin.next")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <ProductEditModal
        visible={editingProduct !== null}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveProduct}
      />

      <ImageViewer
        visible={viewingImages !== null}
        images={viewingImages?.images || []}
        currentIndex={viewingImages?.currentIndex || 0}
        onClose={() => setViewingImages(null)}
        onIndexChange={(index) =>
          setViewingImages((prev) =>
            prev ? { ...prev, currentIndex: index } : null
          )
        }
      />
    </View>
  );
};

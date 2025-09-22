import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { setAdminStatus } from '../services/auth';
import { getPendingReports, approveReport, rejectReport, getAllReports } from '../services/reports';
import { Report } from '../services/reports';
import { adminPanelStyles } from '../styles/AdminPanel.styles';

interface AdminScreenProps {
  currentUserId: string;
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ currentUserId, onBack }) => {
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'reports' | 'users'>('reports');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pending, all, usersList] = await Promise.all([
        getPendingReports(),
        getAllReports(),
        getUsers()
      ]);
      setPendingReports(pending);
      setAllReports(all);
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const handleApproveReport = async (reportId: string) => {
    try {
      const success = await approveReport(reportId, currentUserId, 'Approved by admin');
      if (success) {
        Alert.alert('Success', 'Report approved successfully');
        loadData(); // Refresh data
      } else {
        Alert.alert('Error', 'Failed to approve report');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve report');
    }
  };

  const handleRejectReport = async (reportId: string) => {
    Alert.alert(
      'Reject Report',
      'Are you sure you want to reject this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await rejectReport(reportId, currentUserId, 'Rejected by admin');
              if (success) {
                Alert.alert('Success', 'Report rejected');
                loadData(); // Refresh data
              } else {
                Alert.alert('Error', 'Failed to reject report');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to reject report');
            }
          }
        }
      ]
    );
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    try {
      const success = await setAdminStatus(userId, !currentAdminStatus);
      if (success) {
        Alert.alert('Success', `Admin status ${!currentAdminStatus ? 'granted' : 'revoked'}`);
        loadData(); // Refresh data
      } else {
        Alert.alert('Error', 'Failed to update admin status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update admin status');
    }
  };

  if (loading) {
    return (
      <View style={adminPanelStyles.container}>
        <View style={adminPanelStyles.header}>
          <View style={adminPanelStyles.headerContent}>
            <TouchableOpacity style={adminPanelStyles.backButton} onPress={onBack}>
              <Text style={adminPanelStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={adminPanelStyles.headerTitle}>Admin Panel</Text>
          </View>
        </View>
        <View style={adminPanelStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={adminPanelStyles.loadingText}>Loading admin data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={adminPanelStyles.container}>
      <View style={adminPanelStyles.header}>
        <View style={adminPanelStyles.headerContent}>
          <TouchableOpacity style={adminPanelStyles.backButton} onPress={onBack}>
            <Text style={adminPanelStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={adminPanelStyles.headerTitle}>Admin Panel</Text>
        </View>
      </View>

      <View style={adminPanelStyles.tabContainer}>
        <TouchableOpacity
          style={[adminPanelStyles.tab, selectedTab === 'reports' && adminPanelStyles.activeTab]}
          onPress={() => setSelectedTab('reports')}
        >
          <Text style={[adminPanelStyles.tabText, selectedTab === 'reports' && adminPanelStyles.activeTabText]}>
            Reports ({pendingReports.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[adminPanelStyles.tab, selectedTab === 'users' && adminPanelStyles.activeTab]}
          onPress={() => setSelectedTab('users')}
        >
          <Text style={[adminPanelStyles.tabText, selectedTab === 'users' && adminPanelStyles.activeTabText]}>
            Users ({users.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={adminPanelStyles.content}>
        {selectedTab === 'reports' && (
          <>
            <View style={adminPanelStyles.statsContainer}>
              <View style={adminPanelStyles.statCard}>
                <Text style={adminPanelStyles.statNumber}>{pendingReports.length}</Text>
                <Text style={adminPanelStyles.statLabel}>Pending</Text>
              </View>
              <View style={adminPanelStyles.statCard}>
                <Text style={adminPanelStyles.statNumber}>{allReports.length}</Text>
                <Text style={adminPanelStyles.statLabel}>Total Reports</Text>
              </View>
            </View>

            <Text style={adminPanelStyles.sectionTitle}>Pending Reports</Text>
            {pendingReports.length === 0 ? (
              <View style={adminPanelStyles.emptyContainer}>
                <Text style={adminPanelStyles.emptyIcon}>📋</Text>
                <Text style={adminPanelStyles.emptyTitle}>No Pending Reports</Text>
                <Text style={adminPanelStyles.emptyText}>
                  All reports have been reviewed. Check back later for new submissions.
                </Text>
              </View>
            ) : (
              pendingReports.map((report) => (
                <View key={report.id} style={adminPanelStyles.reportCard}>
                  <View style={adminPanelStyles.reportHeader}>
                    <Text style={adminPanelStyles.reportTitle}>
                      {report.name || 'Unnamed Product'}
                    </Text>
                    <View style={adminPanelStyles.reportStatusBadge}>
                      <Text style={adminPanelStyles.reportStatusText}>PENDING</Text>
                    </View>
                  </View>
                  
                  <View style={adminPanelStyles.reportDetails}>
                    <View style={adminPanelStyles.reportDetailRow}>
                      <Text style={adminPanelStyles.reportDetailLabel}>Barcode:</Text>
                      <Text style={adminPanelStyles.reportDetailValue}>{report.barcode}</Text>
                    </View>
                    <View style={adminPanelStyles.reportDetailRow}>
                      <Text style={adminPanelStyles.reportDetailLabel}>Status:</Text>
                      <Text style={adminPanelStyles.reportDetailValue}>{report.suggestedState}</Text>
                    </View>
                    <View style={adminPanelStyles.reportDetailRow}>
                      <Text style={adminPanelStyles.reportDetailLabel}>Country:</Text>
                      <Text style={adminPanelStyles.reportDetailValue}>{report.country}</Text>
                    </View>
                    {report.notes && (
                      <Text style={adminPanelStyles.reportNotes}>
                        Notes: {report.notes}
                      </Text>
                    )}
                  </View>
                  
                  <View style={adminPanelStyles.actionButtons}>
                    <TouchableOpacity
                      style={adminPanelStyles.approveButton}
                      onPress={() => handleApproveReport(report.id)}
                    >
                      <Text style={adminPanelStyles.approveButtonText}>✓ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={adminPanelStyles.rejectButton}
                      onPress={() => handleRejectReport(report.id)}
                    >
                      <Text style={adminPanelStyles.rejectButtonText}>✗ Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {selectedTab === 'users' && (
          <>
            <Text style={adminPanelStyles.sectionTitle}>User Management</Text>
            {users.length === 0 ? (
              <View style={adminPanelStyles.emptyContainer}>
                <Text style={adminPanelStyles.emptyIcon}>👥</Text>
                <Text style={adminPanelStyles.emptyTitle}>No Users Found</Text>
                <Text style={adminPanelStyles.emptyText}>
                  No users are currently registered in the system.
                </Text>
              </View>
            ) : (
              users.map((user) => (
                <View key={user.id} style={adminPanelStyles.userCard}>
                  <View style={adminPanelStyles.userHeader}>
                    <Text style={adminPanelStyles.userEmail}>{user.email}</Text>
                    {user.isAdmin && (
                      <View style={adminPanelStyles.adminBadge}>
                        <Text style={adminPanelStyles.adminBadgeText}>ADMIN</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={adminPanelStyles.userStatus}>
                    Admin Status: {user.isAdmin ? 'Yes' : 'No'}
                  </Text>
                  
                  <TouchableOpacity
                    style={user.isAdmin ? adminPanelStyles.revokeAdminButton : adminPanelStyles.grantAdminButton}
                    onPress={() => handleToggleAdmin(user.id, user.isAdmin)}
                  >
                    <Text style={adminPanelStyles.grantAdminButtonText}>
                      {user.isAdmin ? 'Revoke Admin Access' : 'Grant Admin Access'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

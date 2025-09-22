import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { adminPanelStyles } from '../styles/AdminPanel.styles';

interface AdminPanelProps {
  onNavigateToAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToAdmin }) => {
  return (
    <TouchableOpacity style={adminPanelStyles.adminButton} onPress={onNavigateToAdmin}>
      <Text style={adminPanelStyles.adminButtonIcon}>⚙️</Text>
      <Text style={adminPanelStyles.adminButtonText}>Admin Panel</Text>
    </TouchableOpacity>
  );
};


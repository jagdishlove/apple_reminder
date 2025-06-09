// components/LoadingOverlay.tsx
import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={() => {}}
  >
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingOverlay;

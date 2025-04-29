import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Users, FolderOpen, BarChart } from "lucide-react-native";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <View style={styles.footer}>
      {/* Home */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.replace("/coach")}
      >
        <Home size={24} color={isActive("/coach") ? "#B00020" : "#bbb"} />
        <Text style={[styles.navText, isActive("/coach") && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Participants */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.replace("/players")}
      >
        <Users size={24} color={isActive("/participants") ? "#B00020" : "#bbb"} />
        <Text style={[styles.navText, isActive("/participants") && styles.activeText]}>
          My Players
        </Text>
      </TouchableOpacity>

      {/* Categories */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.replace("/categories")}
      >
        <FolderOpen size={24} color={isActive("/categories") ? "#B00020" : "#bbb"} />
        <Text style={[styles.navText, isActive("/categories") && styles.activeText]}>
          My Categories
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.replace("/profile")}
      >
        <Users size={24} color={isActive("/profile") ? "#B00020" : "#bbb"} />
        <Text style={[styles.navText, isActive("/profile") && styles.activeText]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    backgroundColor: "#000", // dark footer
    height: 70,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 10,
    color: "#bbb",
    marginTop: 2,
  },
  activeText: {
    color: "#B00020",
    fontWeight: "bold",
  },
});

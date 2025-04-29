// app/profile/index.tsx

import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LogOut, Moon, Sun } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../../context/ThemeContext"; // 👈 import your theme context here

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme(); // 👈 use theme from context
  const [coachData, setCoachData] = useState<{ firstName: string; lastName: string; email: string }>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const fadeAnim = useRef(new Animated.Value(1)).current; // 🔥 for fade animation

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive", 
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/login/login");
          } 
        }
      ]
    );
  };

  const handleToggleTheme = () => {
    // Start fade-out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // After fade-out, toggle theme
      toggleTheme();

      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    async function loadCoachData() {
      try {
        const firstName = await AsyncStorage.getItem("coachFirstName");
        const lastName = await AsyncStorage.getItem("coachLastName");
        const email = await AsyncStorage.getItem("coachEmail");

        if (firstName && lastName && email) {
          setCoachData({ firstName, lastName, email });
        } else {
          console.warn("Coach data not found.");
        }
      } catch (error) {
        console.error("Error loading coach data:", error);
      }
    }

    loadCoachData();
  }, []);

  return (
    <Animated.View style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}>
      <Header title="Profile" showBack={false} />

      <View style={[styles.container]}>
        <View style={[styles.card]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.title, { color: colors.text }]}>Coach Profile</Text>
            <TouchableOpacity onPress={handleToggleTheme}>
              {theme === "light" ? <Moon size={24} color={colors.text} /> : <Sun size={24} color={colors.text} />}
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
            <Text style={[styles.value, { color: colors.text }]}>{coachData.firstName || "-"}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
            <Text style={[styles.value, { color: colors.text }]}>{coachData.lastName || "-"}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <Text style={[styles.value, { color: colors.text }]}>{coachData.email || "-"}</Text>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 80,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
  },
  signOutButton: {
    marginTop: 30,
    backgroundColor: "#c53030",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});

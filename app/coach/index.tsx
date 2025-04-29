// app/coach/index.tsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../../constants";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext"; // ✅ added this

interface Player {
  _id: string;
  fullName: string;
  age: number;
  weight: number;
  category: string;
  gender: string;
  createdAt?: string;
}

export default function CoachDashboard() {
  const router = useRouter();
  const { colors } = useTheme(); // ✅ added this
  const fadeAnim = useRef(new Animated.Value(1)).current; // ✅ fade animation

  const [coachFirstName, setCoachFirstName] = useState("");
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const isAdmin = false; // 🔥 simulate role for now

  useFocusEffect(
    useCallback(() => {
      async function fetchDashboardData() {
        try {
          const firstName = await AsyncStorage.getItem("coachFirstName");
          const coachId = await AsyncStorage.getItem("coachId");

          if (firstName) setCoachFirstName(firstName);

          if (!coachId) {
            console.log("Coach ID not found in AsyncStorage");
            return;
          }

          const playerResponse = await axios.get(`${BACKEND_URL}/players?coachId=${coachId}`);
          let players = playerResponse.data.players || [];
          players = players.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          setRecentPlayers(players.slice(0, 3));

          const participantsResponse = await axios.get(`${BACKEND_URL}/players/count?coachId=${coachId}`);
          setTotalParticipants(participantsResponse.data.count);

          const categoriesResponse = await axios.get(`${BACKEND_URL}/categories/count?coachId=${coachId}`);
          setTotalCategories(categoriesResponse.data.count);

        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }

      fetchDashboardData();
    }, [])
  );

  return (
    <>
      <Header title="Dashboard" showBack />

      <Animated.ScrollView
        style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isAdmin ? "Admin Dashboard" : `Coach ${coachFirstName || "Dashboard"}`}
          </Text>
          <Text style={[styles.date, { color: colors.text }]}>{new Date().toDateString()}</Text>

          {!isAdmin && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/coach/register-player")}>
              <Text style={styles.primaryButtonText}>+ Register New Player</Text>
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{isAdmin ? "All Players" : "My Players"}</Text>
              <TouchableOpacity onPress={() => router.push("/players")} style={styles.seeAllBox}>
                <Text style={styles.seeAllButtonText}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentPlayers.length > 0 ? (
              recentPlayers.map((player) => (
                <View key={player._id} style={styles.card}>
                  <View style={styles.cardText}>
                    <Text style={[styles.cardName, { color: colors.text }]}>{player.fullName}</Text>
                    <Text style={[styles.cardDetails, { color: colors.text }]}>
                      {player.age} years • {player.weight} kg • {player.category}
                    </Text>
                  </View>
                  <View style={styles.genderBadge}>
                    <Text style={[styles.genderBadgeText, { color: colors.text }]}>{player.gender === "Male" ? "M" : "F"}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={[styles.noData, { color: colors.text }]}>No players registered yet</Text>
                <TouchableOpacity onPress={() => router.push("/coach/register-player")}>
                  <Text style={styles.link}>Register your first player</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/categories")}>
            <Text style={styles.secondaryButtonText}>See All Categories</Text>
          </TouchableOpacity>

          <View style={styles.stats}>
            <View style={[styles.statCard, { backgroundColor: "#B00020" }]}>
              <Text style={styles.statNumber}>{totalParticipants}</Text>
              <Text style={styles.statLabel}>{isAdmin ? "Total Players" : "Your Players"}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#000" }]}>
              <Text style={[styles.statNumber, { color: "#FFD700" }]}>{totalCategories}</Text>
              <Text style={[styles.statLabel, { color: "#FFD700" }]}>{isAdmin ? "Active Categories" : "Your Categories"}</Text>
            </View>
          </View>

          <View style={{ height: 300, marginTop: 20, borderRadius: 16, overflow: "hidden" }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 33.8886,
                longitude: 35.4955,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{ latitude: 33.8886, longitude: 35.4955 }}
                title="Competition Location"
                description="Main Kung Fu Arena"
              />
            </MapView>
          </View>

        </View>
      </Animated.ScrollView>

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  date: {
    color: "#444",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#B00020",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  cardText: {},
  cardName: {
    fontWeight: "600",
    fontSize: 16,
  },
  cardDetails: {
    fontSize: 12,
    color: "#444",
  },
  genderBadge: {
    backgroundColor: "#FFD70020",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  genderBadgeText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#000",
  },
  noData: {
    textAlign: "center",
    color: "#888",
  },
  link: {
    textAlign: "center",
    marginTop: 8,
    color: "#B00020",
    textDecorationLine: "underline",
  },
  secondaryButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#fff",
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  outlineButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  seeAllButton: {
    alignSelf: "flex-end",
    marginVertical: 8,
  },
  seeAllButtonText: {
    color: "#B00020",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  seeAllBox: {
    borderWidth: 1,
    borderColor: "#B00020",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

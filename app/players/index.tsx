// app/participants/index.tsx

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { BACKEND_URL } from "../../constants";
import { useTheme } from "../../context/ThemeContext"; // 👈 added this

// Define the Player type (for TypeScript)
type Player = {
  _id: string;
  fullName: string;
  age: number;
  weight: number;
  gender: string;
  club: string;
  categoryId: {
    _id: string;
    ageGroup: string;
    weightClass: string;
    gender: string;
  };
};

export default function ParticipantsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [coachId, setCoachId] = useState("");
  const { colors } = useTheme(); // 👈 added this
  const fadeAnim = useRef(new Animated.Value(1)).current; // 🔥 fade animation

  useEffect(() => {
    const fetchCoachIdAndPlayers = async () => {
      try {
        const id = await AsyncStorage.getItem('coachId');
        if (!id) {
          console.error('No coach ID found in storage');
          return;
        }
        setCoachId(id);
  
        try {
          const url = `${BACKEND_URL}/players?coachId=${id}`;
          console.log("🔵 Fetching URL:", url);
        
          const response = await fetch(url);
          const text = await response.text();
          console.log("🟡 Raw Response Text:", text);
        
          const data = JSON.parse(text);
          setPlayers(data.players);
        
        } catch (error) {
          console.error("🔴 Error fetching players:", error);
        }

      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
  
    fetchCoachIdAndPlayers();
  }, []);

  const filteredPlayers = Array.isArray(players)
    ? players.filter((p) =>
        p?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <Header title="Participants" showBack />
      
      <Animated.View style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}>
        <View style={styles.container}>
          <Text style={styles.title}>Participants</Text>

          {/* 🔍 Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* 🔁 No players */}
          {filteredPlayers.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noText}>
                {searchQuery
                  ? "No players found matching your search."
                  : "No players have registered yet."}
              </Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/coach/register-player")}
              >
                <Text style={styles.addButtonText}>Register First Player</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredPlayers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardText}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
                    <Text style={[styles.details, { color: colors.text }]}>Age: {item.age} yrs</Text>
                    <Text style={[styles.details, { color: colors.text }]}>Weight: {item.weight} kg</Text>
                    <Text style={[styles.details, { color: colors.text }]}>Gender: {item.gender}</Text>
              
                    {item.categoryId && (
                      <Text style={[styles.details, { color: colors.text }]}>
                        Category: {item.categoryId.ageGroup} / {item.categoryId.weightClass}
                      </Text>
                    )}
              
                    <Text style={[styles.details, { color: colors.text }]}>Club: {item.club}</Text>
                  </View>
                </View>
              )}
              
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </View>
      </Animated.View>

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#B00020",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  noText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#B00020",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#D3D3D3",
  },
  cardText: {
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
  },
});

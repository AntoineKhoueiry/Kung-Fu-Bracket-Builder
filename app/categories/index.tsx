// app/categories/index.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../constants';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../../context/ThemeContext"; // ✅ added

interface Category {
  categoryId: string;
  categoryName: string;
  ageGroup: string;
  weightClass: string;
  gender: string;
  playerCount: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { colors } = useTheme(); // ✅ added
  const fadeAnim = useRef(new Animated.Value(1)).current; // ✅ added fade

  const cardBackgroundColor = colors.background === "#ffffff" ? "#ffffff" : "#1c1c1e";  // 🔥 Add this line here


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const coachId = await AsyncStorage.getItem('coachId');
        if (!coachId) {
          console.error('No coachId found');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/categories?coachId=${coachId}`);
        const data = await response.json();
        setCategories(data);

      } catch (error) {
        console.error('🚨 Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#B00020" />
      </View>
    );
  }

  return (
    <>
      <Header title="Competition Categories" />

      <Animated.ScrollView 
        style={{ flex: 1, backgroundColor: colors.background, opacity: fadeAnim }}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.container}>
          {categories.length === 0 ? (
            <Text style={[styles.noCategories, { color: colors.text }]}>You have no players registered yet.</Text>
          ) : (
            categories.map((category) => (
                <View key={category.categoryId} style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.categoryName}>{category.categoryName}</Text>
                  <Text style={[styles.playerCount, { color: colors.text }]}>👥 {category.playerCount}</Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={[styles.label, { color: colors.text }]}>Age:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>{category.ageGroup}</Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={[styles.label, { color: colors.text }]}>Weight:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>{category.weightClass}</Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={[styles.label, { color: colors.text }]}>Gender:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>{category.gender}</Text>
                </View>

                {category.playerCount >= 2 ? (
                  <TouchableOpacity 
                    style={styles.viewBracketButton} 
                    onPress={() => router.push(`/categories/${category.categoryId}`)}
                  >
                    <Text style={styles.buttonText}>View Bracket</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.needsPlayersButton}>
                    <Text style={styles.buttonText}>Needs More Players</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </Animated.ScrollView>

      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCategories: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B00020",
  },
  playerCount: {
    fontSize: 14,
  },
  infoBlock: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    width: 80,
  },
  value: {
    fontSize: 14,
  },
  viewBracketButton: {
    marginTop: 12,
    backgroundColor: "#B00020",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  needsPlayersButton: {
    marginTop: 12,
    backgroundColor: "#e57373",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CategoriesPage;

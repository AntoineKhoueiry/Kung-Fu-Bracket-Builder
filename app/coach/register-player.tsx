import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import { BACKEND_URL, COMPETITION_ID } from "../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RegisterPlayerScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [school, setSchool] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    setFormError("");
  
    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }
  
    if (!age.trim() || isNaN(Number(age))) {
      setFormError("Valid age is required.");
      return;
    }
  
    if (!weight.trim() || isNaN(Number(weight))) {
      setFormError("Valid weight is required.");
      return;
    }
  




    const ageNum = Number(age);
    const weightNum = Number(weight);
    
    // Basic range check
    if (ageNum < 4 || ageNum > 35) {
      setFormError("Age must be between 4 and 35 years.");
      return;
    }
    if (weightNum < 20 || weightNum > 130) {
      setFormError("Weight must be between 20kg and 130kg.");
      return;
    }
    
    // Smart dynamic validation
    if (ageNum >= 4 && ageNum <= 5 && (weightNum < 20 || weightNum > 35)) {
      setFormError("For 4-5 years, weight must be between 20–35kg.");
      return;
    }
    if (ageNum >= 6 && ageNum <= 7 && (weightNum < 20 || weightNum > 40)) {
      setFormError("For 6-7 years, weight must be between 20–40kg.");
      return;
    }
    if (ageNum >= 8 && ageNum <= 9 && (weightNum < 25 || weightNum > 50)) {
      setFormError("For 8-9 years, weight must be between 25–50kg.");
      return;
    }
    if (ageNum >= 10 && ageNum <= 11 && (weightNum < 30 || weightNum > 60)) {
      setFormError("For 10-11 years, weight must be between 30–60kg.");
      return;
    }
    if (ageNum >= 12 && ageNum <= 13 && (weightNum < 35 || weightNum > 70)) {
      setFormError("For 12-13 years, weight must be between 35–70kg.");
      return;
    }
    if (ageNum >= 14 && ageNum <= 15 && (weightNum < 45 || weightNum > 90)) {
      setFormError("For 14-15 years, weight must be between 45–90kg.");
      return;
    }
    if (ageNum >= 16 && ageNum <= 17 && (weightNum < 50 || weightNum > 130)) {  // 90kg+ open until 130kg
      setFormError("For 16-17 years, weight must be between 50–130kg.");
      return;
    }
    if (ageNum >= 18 && ageNum <= 35 && (weightNum < 55 || weightNum > 130)) {
      setFormError("For 18-35 years, weight must be between 55–130kg.");
      return;
    }
    


  
    const coachId = await AsyncStorage.getItem('coachId');

    if (!coachId) {
      Alert.alert("Error", "Coach ID not found. Please login again.");
      return;
    }    

    try {
      const response = await fetch(`${BACKEND_URL}/register-players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coachId: coachId,
          competitionId: COMPETITION_ID,
          fullName: name,
          age: ageNum,
          weight: weightNum,
          gender: gender,
          club: school,
        })
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        Alert.alert('Success', 'Player registered successfully!');
        router.back();
      } else {
        setFormError(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setFormError('Could not connect to server.');
    }
  };
  

  return (
    <>
      <Header title="Register Participant" showBack />
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Register New Player</Text>

        <View style={styles.form}>
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter player name"
            value={name}
            onChangeText={setName}
          />

          {/* Age */}
          <Text style={styles.label}>Age</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          {/* Weight */}
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderOption, gender === "Male" && styles.genderSelected]}
              onPress={() => setGender("Male")}
            >
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderOption, gender === "Female" && styles.genderSelected]}
              onPress={() => setGender("Female")}
            >
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>

          {/* School/Dojo */}
          <Text style={styles.label}>Club</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter club name"
            value={school}
            onChangeText={setSchool}
          />

          {/* Error Message */}
          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Register Player</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#B00020",
  },
  form: {
    gap: 16,
  },
  label: {
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#FFD700",
  },
  genderText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
  errorBox: {
    backgroundColor: "#ffe5e5",
    borderColor: "#ff9999",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "#B00020",
    textAlign: "center",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#B00020",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#B00020",
    fontWeight: "bold",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#B00020",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

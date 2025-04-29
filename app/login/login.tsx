import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../../constants";
import { User } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Fetch coach info after login (NEW)
  async function fetchCoachAfterLogin(firebaseUser: User) {
    try {
      const response = await fetch(`${BACKEND_URL}/coaches/${firebaseUser.uid}`);
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Coach fetched:", data);
        await AsyncStorage.setItem('coachId', data._id);
        await AsyncStorage.setItem('coachUid', firebaseUser.uid);
        await AsyncStorage.setItem('coachFirstName', data.firstName);
        await AsyncStorage.setItem('coachLastName', data.lastName);
        await AsyncStorage.setItem('coachEmail', data.email);
        console.log('✅ Coach info saved locally.');
      } else {
        console.error('Failed to fetch coach:', data.error);
        Alert.alert("Login Failed", "Could not retrieve coach data.");
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch coach after login:', error);
      throw error;
    }
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await fetchCoachAfterLogin(user); // ✅ Fetch instead of creating
      }

      router.replace("/coach");
    } catch (error: any) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to Kung Fu Bracket Builder</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#F5F5F5" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("./signup")} style={styles.signupLink}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#D3D3D3",
  },
  form: {
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#F5F5F5",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#333333",
    color: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444444",
  },
  loginButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupLink: {
    marginTop: 24,
    alignItems: "center",
  },
  signupText: {
    color: "#FF3B30",
    fontSize: 14,
  },
});

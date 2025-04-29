import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../../constants";
import { User } from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 createCoachAfterLogin again here (inside the file)
  async function createCoachAfterLogin(firebaseUser: User, firstName: string, lastName: string) {
    try {
      const bodyToSend = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firstName || "Unnamed",
        lastName: lastName || "Coach",
      };
  
      console.log("🧠 Sending Coach Data to Backend:", bodyToSend);
  
      const response = await fetch(`${BACKEND_URL}/coaches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend),
      });
  
      const data = await response.json();
      console.log('🛠 Server Response:', data);
  
      if (!data.coachId) {
        throw new Error("Server did not return coachId");
      }
  
      await AsyncStorage.setItem('coachId', data.coachId);
      await AsyncStorage.setItem('coachUid', firebaseUser.uid);
      await AsyncStorage.setItem('coachFirstName', firstName);
      await AsyncStorage.setItem('coachLastName', lastName);
      await AsyncStorage.setItem('coachEmail', firebaseUser.email || "unknown@example.com");
      console.log('✅ Coach info saved locally.');
    } catch (error) {
      console.error('Failed to create coach:', error);
      throw error;
    }
  }
  
  

  const handleSignUp = async () => {
    // 🧠 Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill in all the fields before signing up.");
      return;
    }
  
    // 🧠 Password strength validation
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[^A-Za-z0-9]/; // anything that is NOT a letter or number

    if (
      password.length < 6 ||
      !uppercaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long and include:\n- 1 uppercase letter\n- 1 number\n- 1 special character"
      );
      return;
    }


    setIsLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        await createCoachAfterLogin(user, firstName, lastName);
        ;
  
        await fetch(`${BACKEND_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            age: 25,
            weight: 70,
            category: "18-30 / 70-80kg",
          }),
        });
  
        console.log("✅ User registered successfully to MongoDB");
      }
  
      router.replace("/coach"); 
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Kung Fu Bracket Builder</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#AAAAAA"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#AAAAAA"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
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
            placeholder="Password"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.signupButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#F5F5F5" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login/login")} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
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
  signupButton: {
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
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginText: {
    color: "#FF3B30",
    fontSize: 14,
  },
});

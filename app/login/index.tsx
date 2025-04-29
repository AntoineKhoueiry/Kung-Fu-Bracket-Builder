import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kung Fu Bracket</Text>
        <Text style={styles.title}>Builder</Text>
        <Text style={styles.subtitle}>Welcome to your tournament management platform</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={() => router.push("/login/login")}
            style={[styles.button, styles.loginButton]}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/login/signup")}
            style={[styles.button, styles.signupButton]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // kungfu-dark equivalent
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF3B30", // kungfu-red
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#D3D3D3", // kungfu-light/70
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#FF3B30", // kungfu-red
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "#FF3B30",
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#F5F5F5", // kungfu-light
    fontSize: 16,
    fontWeight: "600",
  },
});

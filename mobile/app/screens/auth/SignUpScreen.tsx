import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppScreen } from "../../components/layout/AppScreen";

type Props = NativeStackScreenProps<any>;

export const SignUpScreen = ({ navigation }: Props) => {
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signup({ name, email, password });
    } catch (error: any) {
      Alert.alert("Sign up failed", error?.message ?? "Please try again.");
    }
  };

  return (
    <AppScreen style={styles.container}>
      <Text style={styles.title}>Join Routine Tracker</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#a1a1aa" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#a1a1aa" autoCapitalize="none" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#a1a1aa" secureTextEntry />
      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
      </Pressable>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Have an account? Sign in</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#05050a" },
  title: { fontSize: 26, fontWeight: "600", color: "#fff", marginBottom: 32, textAlign: "center" },
  input: { backgroundColor: "#11111a", color: "#fff", padding: 16, borderRadius: 12, marginBottom: 16 },
  button: { backgroundColor: "#7c3aed", padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#a1a1aa", textAlign: "center", marginTop: 16 },
});

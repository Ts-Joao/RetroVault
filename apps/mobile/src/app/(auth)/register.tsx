import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as api from "../../lib/api";
import useAuthStore from "../../stores/useAuthStore";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleRegister = async () => {
    // basic client-side validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("A senha e a confirmação não coincidem");
      return;
    }

    setLoading(true);
    try {
      await api.register(name, email, password, phone);
      const token = await api.login(email, password);
      await login(token);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Registro falhou");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Criar conta</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nome"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Telefone"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Criando..." : "Criar conta"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  inner: { padding: 24, marginTop: 80 },
  title: { fontSize: 28, color: "white", marginBottom: 16 },
  input: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#111",
    color: "white",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "600" },
});

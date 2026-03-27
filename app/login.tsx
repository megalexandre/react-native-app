import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { Colors } from '@/constants/theme';
import { AuthError } from '@/services/auth-model';
import { login } from '@/services/auth-service';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validateForm = () => {
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Usuário é obrigatório';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } 

    setErrors(newErrors);
    return newErrors.username === '' && newErrors.password === '';
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login({
        username: username.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'Erro ao fazer login. Tente novamente.';

      setErrors({
        username: '',
        password: message,
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      testID="login-screen"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView testID="login-scroll" contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View testID="login-header" style={styles.header}>
          <ThemedText testID="login-title" type="title" style={styles.title}>Bem-vindo</ThemedText>
          <ThemedText testID="login-subtitle" style={styles.subtitle}>Faça login na sua conta</ThemedText>
        </View>
        <View testID="login-form" style={styles.form}>
          <TextInput testID="login-username" label="Usuário" placeholder="Digite seu usuário" value={username} onChangeText={(text) => {
            setUsername(text);
            if (errors.username) {
              setErrors({ ...errors, username: '' });
            }
          }} editable={!loading} error={errors.username} />
          <TextInput testID="login-password" label="Senha" placeholder="Digite sua senha" secureTextEntry value={password} onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors({ ...errors, password: '' });
            }
          }} editable={!loading} error={errors.password} />
          <Button testID="login-submit" title={loading ? 'Fazendo login...' : 'Login'} onPress={handleLogin} loading={loading} disabled={loading} style={styles.button} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 32,
  },
  button: {
    marginTop: 12,
    width: '100%',
  },
});

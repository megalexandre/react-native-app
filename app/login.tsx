import { useAuth } from '@/components/auth-provider';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { Colors } from '@/constants/theme';
import { AuthError } from '@/services/auth-model';
import { login } from '@/services/auth-service';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

export default function LoginScreen() {
  const isWeb = Platform.OS === 'web';
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { isAuthenticated, isLoading: isRestoringSession, signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

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
      const session = await login({
        username: username.trim(),
        password,
      });
      await signIn(session);
      router.replace('/dashboard');
    } catch (error: unknown) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'Erro ao fazer login. Tente novamente.';

      setErrors({
        username: '',
        password: '',
      });
      showToast(message);
      
    } finally {
      setLoading(false);
    }
  };

  if (isRestoringSession) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  return (
    <KeyboardAvoidingView
      testID="login-screen"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView testID="login-scroll" contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View
          testID="login-content"
          style={[
            styles.content,
            isWeb ? styles.contentWeb : null,
            isWeb
              ? {
                  backgroundColor: colorScheme === 'dark' ? '#1f2328' : '#f8fafc',
                  borderColor: colorScheme === 'dark' ? '#2f343a' : '#e5e7eb',
                }
              : null,
          ]}
        >
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
        </View>
      </ScrollView>
      {toastMessage ? (
        <View testID="login-toast" style={styles.toastContainer}>
          <ThemedText testID="login-toast-message" style={styles.toastText}>{toastMessage}</ThemedText>
        </View>
      ) : null}
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
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 440,
  },
  contentWeb: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 28,
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
  },
  button: {
    marginTop: 12,
    width: '100%',
  },
  toastContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    borderRadius: 10,
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  toastText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});

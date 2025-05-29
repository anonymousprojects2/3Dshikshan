import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../constants/theme';
import { useAuth } from '../../context/FirebaseAuthContext';
import { DISTRICTS, LEARNING_CENTERS } from '../../data/learningCenters';

interface SignupScreenProps {
  onToggleMode: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onToggleMode }) => {
  const { signup, isLoading } = useAuth();
  
  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Modal states
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [centerModalVisible, setCenterModalVisible] = useState(false);
  
  // Filtered centers based on selected district
  const [availableCenters, setAvailableCenters] = useState(LEARNING_CENTERS);
  
  // Form validation errors
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [districtError, setDistrictError] = useState('');
  const [centerError, setCenterError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Update available centers when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filteredCenters = LEARNING_CENTERS.filter(
        center => center.district === selectedDistrict
      );
      setAvailableCenters(filteredCenters);
      setSelectedCenter(null); // Reset selected center when district changes
    } else {
      setAvailableCenters(LEARNING_CENTERS);
      setSelectedCenter(null);
    }
  }, [selectedDistrict]);

  // Form validation functions
  const validateName = (name: string) => {
    if (!name) {
      setNameError('Name is required');
      return false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateUsername = (username: string) => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    } else {
      setUsernameError('');
      return true;
    }
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validateAddress = (address: string) => {
    if (!address) {
      setAddressError('Address is required');
      return false;
    } else if (address.length < 5) {
      setAddressError('Please enter a complete address');
      return false;
    } else {
      setAddressError('');
      return true;
    }
  };

  const validateDistrict = () => {
    if (!selectedDistrict) {
      setDistrictError('Please select a district');
      return false;
    } else {
      setDistrictError('');
      return true;
    }
  };

  const validateCenter = () => {
    if (!selectedCenter) {
      setCenterError('Please select a learning center');
      return false;
    } else {
      setCenterError('');
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setDistrictModalVisible(false);
    setDistrictError('');
  };

  const handleCenterSelect = (centerId: string) => {
    setSelectedCenter(centerId);
    setCenterModalVisible(false);
    setCenterError('');
  };

  const handleSignup = async () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isUsernameValid = validateUsername(username);
    const isPhoneValid = validatePhone(phone);
    const isEmailValid = validateEmail(email);
    const isAddressValid = validateAddress(address);
    const isDistrictValid = validateDistrict();
    const isCenterValid = validateCenter();
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      isNameValid && 
      isUsernameValid && 
      isPhoneValid && 
      isEmailValid && 
      isAddressValid && 
      isDistrictValid && 
      isCenterValid && 
      isPasswordValid && 
      isConfirmPasswordValid
    ) {
      // Get the selected center details
      const center = LEARNING_CENTERS.find(c => c.id === selectedCenter);
      
      // Pass all the user data to the signup function
      const success = await signup(
        name,
        email,
        password,
        username,
        phone,
        address,
        selectedDistrict || '',
        selectedCenter || '',
        center?.name || ''
      );
      
      if (!success) {
        Alert.alert('Signup Failed', 'There was a problem creating your account. Please try again.');
      }
    }
  };

  const renderDistrictModal = () => (
    <Modal
      visible={districtModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setDistrictModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select District</Text>
            <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalList}>
            {DISTRICTS.map((district) => (
              <TouchableOpacity
                key={district}
                style={styles.modalItem}
                onPress={() => handleDistrictSelect(district)}
              >
                <Text style={styles.modalItemText}>{district}</Text>
                {selectedDistrict === district && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderCenterModal = () => (
    <Modal
      visible={centerModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setCenterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Learning Center</Text>
            <TouchableOpacity onPress={() => setCenterModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          {!selectedDistrict ? (
            <View style={styles.modalEmptyState}>
              <Ionicons name="alert-circle-outline" size={40} color={COLORS.textSecondary} />
              <Text style={styles.modalEmptyStateText}>Please select a district first</Text>
            </View>
          ) : availableCenters.length === 0 ? (
            <View style={styles.modalEmptyState}>
              <Ionicons name="alert-circle-outline" size={40} color={COLORS.textSecondary} />
              <Text style={styles.modalEmptyStateText}>No centers available in this district</Text>
            </View>
          ) : (
            <ScrollView style={styles.modalList}>
              {availableCenters.map((center) => (
                <TouchableOpacity
                  key={center.id}
                  style={styles.modalItem}
                  onPress={() => handleCenterSelect(center.id)}
                >
                  <View>
                    <Text style={styles.modalItemText}>{center.name}</Text>
                    <Text style={styles.modalItemSubtext}>{center.address}</Text>
                  </View>
                  {selectedCenter === center.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to join 3D Shikshan</Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, nameError ? styles.inputError : null]}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) validateName(text);
                }}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={[styles.inputWrapper, usernameError ? styles.inputError : null]}>
              <Ionicons name="at-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) validateUsername(text);
                }}
              />
            </View>
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputWrapper, phoneError ? styles.inputError : null]}>
              <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your 10-digit phone number"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) validatePhone(text);
                }}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.inputWrapper, addressError ? styles.inputError : null]}>
              <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                placeholderTextColor={COLORS.textSecondary}
                multiline={true}
                numberOfLines={2}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (addressError) validateAddress(text);
                }}
              />
            </View>
            {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
          </View>

          {/* District/Node Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>District/Node</Text>
            <TouchableOpacity
              style={[styles.dropdownWrapper, districtError ? styles.inputError : null]}
              onPress={() => setDistrictModalVisible(true)}
            >
              <Ionicons name="map-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <Text 
                style={[
                  styles.dropdownText, 
                  !selectedDistrict && { color: COLORS.textSecondary }
                ]}
              >
                {selectedDistrict || 'Select your district'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {districtError ? <Text style={styles.errorText}>{districtError}</Text> : null}
          </View>

          {/* Learning Center Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Learning Center</Text>
            <TouchableOpacity
              style={[styles.dropdownWrapper, centerError ? styles.inputError : null]}
              onPress={() => setCenterModalVisible(true)}
            >
              <Ionicons name="school-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <Text 
                style={[
                  styles.dropdownText, 
                  !selectedCenter && { color: COLORS.textSecondary }
                ]}
              >
                {selectedCenter 
                  ? LEARNING_CENTERS.find(c => c.id === selectedCenter)?.name || 'Select learning center'
                  : 'Select learning center'
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {centerError ? <Text style={styles.errorText}>{centerError}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, confirmPasswordError ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onToggleMode}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderDistrictModal()}
      {renderCenterModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  formContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  dropdownText: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    minHeight: 50,
  },
  passwordToggle: {
    padding: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  signupButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalList: {
    padding: SPACING.md,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  modalItemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  modalItemSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  modalEmptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  modalEmptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default SignupScreen; 
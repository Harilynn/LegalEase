// Authentication Helper Functions
class AuthManager {
  
  // Sign up new user
  static async signUp(email, password, displayName) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await user.updateProfile({
        displayName: displayName
      });
      
      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        displayName: displayName,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        profilePicture: null,
        phone: null,
        address: null
      });
      
      console.log("✅ User created successfully:", user);
      return { success: true, user: user };
    } catch (error) {
      console.error("❌ Sign up error:", error);
      return { success: false, error: error.message };
    }
  }
  
  // Sign in existing user
  static async signIn(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log("✅ User signed in:", userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("❌ Sign in error:", error);
      return { success: false, error: error.message };
    }
  }
  
  // Sign out user
  static async signOut() {
    try {
      await auth.signOut();
      console.log("✅ User signed out");
      return { success: true };
    } catch (error) {
      console.error("❌ Sign out error:", error);
      return { success: false, error: error.message };
    }
  }
  
  // Create user profile in Firestore
  static async createUserProfile(userId, profileData) {
    try {
      await db.collection('users').doc(userId).set(profileData);
      console.log("✅ User profile created in Firestore");
    } catch (error) {
      console.error("❌ Error creating user profile:", error);
      throw error;
    }
  }
  
  // Get user profile from Firestore
  static async getUserProfile(userId) {
    try {
      const doc = await db.collection('users').doc(userId).get();
      if (doc.exists) {
        return { success: true, data: doc.data() };
      } else {
        return { success: false, error: "User profile not found" };
      }
    } catch (error) {
      console.error("❌ Error getting user profile:", error);
      return { success: false, error: error.message };
    }
  }
  
  // Update user profile
  static async updateUserProfile(userId, updates) {
    try {
      await db.collection('users').doc(userId).update({
        ...updates,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ User profile updated");
      return { success: true };
    } catch (error) {
      console.error("❌ Error updating user profile:", error);
      return { success: false, error: error.message };
    }
  }
  
  // Check if user is authenticated
  static getCurrentUser() {
    return auth.currentUser;
  }
  
  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
  
  // Redirect if not authenticated
  static requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
  
  // Redirect if already authenticated
  static redirectIfAuthenticated() {
    const user = this.getCurrentUser();
    if (user) {
      window.location.href = 'dashboard.html';
      return true;
    }
    return false;
  }
}

// Auth state listener - runs on every page
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("🔐 User is signed in:", user.email);
    // User is signed in
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userId', user.uid);
  } else {
    console.log("🔓 User is signed out");
    // User is signed out
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
  }
});
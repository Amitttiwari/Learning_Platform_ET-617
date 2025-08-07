// API Test Utility
export const testBackendConnection = async () => {
  try {
    const response = await fetch('https://learning-platform-backend-knkr.onrender.com/api/health');
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

export const testAuthEndpoint = async () => {
  try {
    const response = await fetch('https://learning-platform-backend-knkr.onrender.com/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`
      }
    });
    const data = await response.json();
    console.log('✅ Auth endpoint test:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Auth endpoint test failed:', error);
    return { success: false, error: error.message };
  }
}; 
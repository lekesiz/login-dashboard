const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'demo123';
  const storedHash = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';
  
  // Test current hash
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('Current hash valid?', isValid);
  
  // Generate new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash for demo123:', newHash);
  
  // Verify new hash
  const verifyNew = await bcrypt.compare(password, newHash);
  console.log('New hash valid?', verifyNew);
}

testPassword();
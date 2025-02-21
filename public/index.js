document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const userData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    };
  
    try {
      const response = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
  
      const result = await response.json();
      document.getElementById('responseMessage').textContent = result.message;
    } catch (error) {
      document.getElementById('responseMessage').textContent = 'Registration failed!';
    }
  });
  
import { useState, useEffect } from 'react';

// CAMBIA ESTA URL por tu enlace público real de Railway
const API_URL = "https://proyecto-con-fastapi-production.up.railway.app";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const [libros, setLibros] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  useEffect(() => {
    if (token) {
      fetchLibros();
    }
  }, [token]);

  const fetchLibros = async () => {
    try {
      const res = await fetch(`${API_URL}/libros/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLibros(data);
      }
    } catch (err) {
      console.error("Error al cargar libros", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword })
      });
      if (res.ok) {
        setMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
      } else {
        setMessage("Error en el registro.");
      }
    } catch (err) {
      setMessage("Error de conexión.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setMessage("¡Sesión iniciada con éxito!");
      } else {
        setMessage("Credenciales incorrectas.");
      }
    } catch (err) {
      setMessage("Error de conexión.");
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/libros/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, autor })
      });
      if (res.ok) {
        setTitulo("");
        setAutor("");
        fetchLibros();
      }
    } catch (err) {
      console.error("Error al crear libro", err);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>📚 Biblioteca Full-Stack (FastAPI + React)</h1>
      
      {message && <p style={{ background: '#e2f0d9', padding: '10px', borderRadius: '5px' }}>{message}</p>}

      {!token ? (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          {/* Login */}
          <form onSubmit={handleLogin} style={{ flex: 1, background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
            <h3>Iniciar Sesión</h3>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <button type="submit" style={{ width: '100%', padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Entrar</button>
          </form>

          {/* Registro */}
          <form onSubmit={handleRegister} style={{ flex: 1, background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
            <h3>Registrarse</h3>
            <input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <input type="password" placeholder="Contraseña" value={regPassword} onChange={e => setRegPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <button type="submit" style={{ width: '100%', padding: '8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Crear cuenta</button>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Panel de Libros</h2>
            <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar Sesión</button>
          </div>

          <form onSubmit={handleCreateBook} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
            <input type="text" placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
            <button type="submit" style={{ padding: '8px 15px', background: '#6610f2', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar</button>
          </form>

          <h3>Mis Libros Guardados</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {libros.map(libro => (
              <li key={libro.id} style={{ background: '#f1f1f1', margin: '8px 0', padding: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{libro.titulo}</strong> - {libro.autor}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>ID: {libro.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;